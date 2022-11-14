/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const net = require('node:net')
const crypto = require('node:crypto')
const xml2js = require('xml2js')
const httpZ = require('http-z')
const app = express()
const port = 3000
let socket

app.use(express.static('sample'))
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/sample.htm', function (req, res) {
  res.sendFile(__dirname + "/sample.htm")
})

app.post('/', function (req, res) {
  let response = req.body
  createAMTConnection(response, res)
})

app.listen(port, () => {
  console.log(`Example app running at http://localhost:3000/sample.htm`)
})

let messageHolder
let connectionAttempts = 0
let httpHandler

function createAMTConnection(request, response) {
  messageHolder = request
  socket = new net.Socket()
  socket.setEncoding('binary')
  socket.setTimeout(6000)
  socket.on('data', onSocketData)
  socket.on('close', onSocketClosed)
  socket.on('timeout', onTimeout)
  socket.on('error', onError)
  socket.on('ready', onSocketReady.bind(this, messageHolder))
  socket.connect(messageHolder.port, messageHolder.host)
}

function onError(err) {
  console.log('ERROR:\n\r', JSON.stringify(err))
}

function onSocketReady(data) {
  console.log('socket state:', socket.readyState)
  sendData(data)
}

function onSocketData(data) {
  console.log('Received from AMT:\n\r' + data + '\n\r')
  const message = httpZ.parse(data)
  switch (message.statusCode) {
    case 401:
      connectionAttempts++
      if (connectionAttempts < 4) {
        
        httpHandler = new HttpHandler()
        messageHolder.digestChallenge = handleAuth(message)
        sendData(messageHolder)
      }
      break
    case 200:
      console.log('OMG IT WORKED')
      break
  }
}

function onSocketClosed(event) {
  console.log('socket (closed) state:', socket.readyState)
}

function onTimeout(event) {
  console.log('socket (timeout) state:', socket.readyState)
}

function sendData(data) {
  if (!httpHandler) {
    httpHandler = new HttpHandler()
  }
  messageHolder.message = httpHandler.wrapIt(data.wsman, data)
  console.log('Sending to AMT:\n\r' + messageHolder.message + '\n\r')
  socket.write(Buffer.from(messageHolder.message, 'ascii'))
  // Return Response to Webpage
}

function handleAuth(message) {
  const found = message.headers.find(item => item.name.toLowerCase() === 'www-authenticate')
  if (found != null) {
    return httpHandler.parseAuthenticateResponseHeader(found.value)
  }
  return null
}

// export interface DigestChallenge {
//   realm?: string
//   nonce?: string // Uniquely generated everytime a 401 response made
//   stale?: string
//   qop?: string // quality of protection
// }

// export interface connectionParams {
//   port: number
//   guid: string
//   username: string
//   password: string
//   nonce?: string
//   nonceCounter?: number
//   consoleNonce?: string
//   digestChallenge?: DigestChallenge
// }

class HttpHandler {
  authResolve = null
  isAuthInProgress = null
  // The purpose of this directive is to allow the server to detect request replays by maintaining its own copy of this count.
  // if the same nonceCounter-value is seen twice, then the request is a replay
  nonceCounter = 1
  stripPrefix = null
  parser = null
  constructor() {
    this.stripPrefix = xml2js.processors.stripPrefix
    this.parser = new xml2js.Parser({ ignoreAttrs: false, mergeAttrs: false, explicitArray: false, tagNameProcessors: [this.stripPrefix], valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans] })
  }

  wrapIt = (data, connectionParams) => {
    try {
      const url = '/wsman'
      const action = 'POST'
      let message = `${action} ${url} HTTP/1.1\r\n`
      if (data == null) {
        return null
      }
      if (connectionParams.digestChallenge != null) {
        // Prepare an Authorization request header from the 401 unauthorized response from AMT
        let responseDigest = null
        // console nonce should be a unique opaque quoted string
        connectionParams.consoleNonce = Math.random().toString(36).substring(7)
        const nc = ('00000000' + (this.nonceCounter++).toString(16)).slice(-8)
        const HA1 = this.hashIt(`${connectionParams.username}:${connectionParams.digestChallenge.realm}:${connectionParams.password}`)
        const HA2 = this.hashIt(`${action}:${url}`)
        responseDigest = this.hashIt(`${HA1}:${connectionParams.digestChallenge.nonce}:${nc}:${connectionParams.consoleNonce}:${connectionParams.digestChallenge.qop}:${HA2}`)
        const authorizationRequestHeader = this.digestIt({
          username: connectionParams.username,
          realm: connectionParams.digestChallenge.realm,
          nonce: connectionParams.digestChallenge.nonce,
          uri: url,
          qop: connectionParams.digestChallenge.qop,
          response: responseDigest,
          nc,
          cnonce: connectionParams.consoleNonce
        })
        message += `Authorization: ${authorizationRequestHeader}\r\n`
      }

      message += Buffer.from([
        `Host: ${connectionParams.host}:${connectionParams.port}`,
        'Transfer-Encoding: chunked',
        '',
        data.length.toString(16).toUpperCase(),
        data,
        0,
        '\r\n'
      ].join('\r\n'), 'utf8')
      return message
    } catch (err) {
      console.log('This is busted')
    }
  }

  hashIt = (data) => {
    return crypto.createHash('md5').update(data).digest('hex')
  }

  // Prepares Authorization Request Header
  digestIt = (params) => {
    const paramNames = []
    for (const i in params) {
      paramNames.push(i)
    }
    return `Digest ${paramNames.reduce((s1, ii) => `${s1},${ii}="${params[ii]}"`, '').substring(1)}`
  }

  parseAuthenticateResponseHeader = (value) => {
    const params = value.replace('Digest realm', 'realm').split(/([^=,]*)=("[^"]*"|[^,"]*)/)
    const obj = {}
    for (let idx = 0; idx < params.length; idx = idx + 3) {
      if (params[idx + 1] != null) {
        obj[params[idx + 1].trim()] = params[idx + 2].replace(/"/g, '')
      }
    }
    if (obj.qop != null) {
      obj.qop = 'auth'
    }
    return obj
  }

  addAuthorizationHeader = (context) => {
    const { message } = context
    const found = message.headers?.find(item => item.name === 'Www-Authenticate')
    if (found != null) {
      return httpHandler.parseAuthenticateResponseHeader(found.value)
    }
  }

  parseXML = (xmlBody) => {
    let wsmanResponse
    this.parser.parseString(xmlBody, (err, result) => {
      if (err) {
        this.logger.error('failed to parse XML :', err)
        wsmanResponse = null
      } else {
        wsmanResponse = result
      }
    })
    return wsmanResponse
  }
}
