/*********************************************************************
* Copyright (c) Intel Corporation 2023
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as xml2js from 'xml2js'

function myParseNumbers (value: string, name: string): any {
  if (name === 'ElementName' || name === 'InstanceID') {
    if (value.length > 1 && value.charAt(0) === '0') {
      return value
    }
  }
  return xml2js.processors.parseNumbers(value, name)
}

export interface AMTResponse {
  responseCode?: number
  responseValue?: string
  responseMessage?: string
}

export interface ParsedObject extends AMTResponse {
  action?: string
  class?: string
  error?: string | null
  wsmanResponse?: any
}

export class Messages {
  stripPrefix: any
  parser: any
  constructor () {
    this.stripPrefix = xml2js.processors.stripPrefix
    this.parser = new xml2js.Parser({ ignoreAttrs: true, mergeAttrs: false, explicitArray: false, tagNameProcessors: [this.stripPrefix], valueProcessors: [myParseNumbers, xml2js.processors.parseBooleans] })
  }

  parseXML = (xmlBody: string): ParsedObject => {
    const returnObject: ParsedObject = {
      error: 'parsing failure'
    }
    const xmlDecoded: string = Buffer.from(xmlBody, 'binary').toString('utf8')
    this.parser.parseString(xmlDecoded, (err, result) => {
      if (err) {
        returnObject.error = err
      } else {
        returnObject.error = null
        returnObject.responseCode = this.getResponseCode(result.Envelope?.Body)
        returnObject.responseMessage = returnObject.responseCode === 0 ? 'Success' : 'not successful' // TODO should use the class, action, and responseCode to get the SDK specific message
        returnObject.class = this.getUriEndpoint(result.Envelope?.Header?.ResourceURI)
        returnObject.action = this.getUriEndpoint(result.Envelope?.Header?.Action)
        returnObject.wsmanResponse = result
      }
    })
    return returnObject
  }

  private readonly getUriEndpoint = (resourceUri: string): string => resourceUri.substring(resourceUri.lastIndexOf('/') + 1, resourceUri.length)
  private readonly getResponseCode = (body: object): number => this.findProperty(body, 'ReturnValue')
  private readonly findProperty = (obj, propertyToFind): any => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === propertyToFind) {
          return obj[key]
        }
        if (typeof obj[key] === 'object') {
          const result = this.findProperty(obj[key], propertyToFind)
          if (result !== undefined) {
            return result
          }
        }
      }
    }
    return undefined
  }
}
