/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
***********************************************************************/

export interface Selector {
  name: string
  value: string
}

export enum WSManErrors {
  HEADER = 'missing header',
  BODY = 'missing body',
  ACTION = 'missing action',
  MESSAGE_ID = 'missing messageId',
  RESOURCE_URI = 'missing resourceUri',
  ENUMERATION_CONTEXT = 'missing enumerationContext',
  UNSUPPORTED_METHOD = 'unsupported method',
  INPUT = 'missing input',
  REQUESTED_STATE = 'missing requestedState',
  SELECTOR = 'missing selector',
  ROLE = 'missing role',
  REQUESTED_POWER_STATE_CHANGE = 'missing powerState',
  ADMIN_PASS_ENCRYPTION_TYPE = 'missing adminPassEncryptionType',
  ADMIN_PASSWORD = 'missing adminPassword',
  ETHERNET_PORT_OBJECT = 'missing ethernetPortObject',
  ENVIRONMENT_DETECTION_SETTING_DATA = 'missing environmentDetectionSettingData',
  CERTIFICATE_BLOB = 'missing certificateBlob',
  MP_SERVER = 'missing mpServer',
  REMOTE_ACCESS_POLICY_RULE = 'missing remoteAccessPolicyRule',
  BOOT_SETTING_DATA = 'missing bootSettingData',
  ADD_ALARM_DATA = 'missing alarmClockOccurrence'
}

export class WSManMessageCreator {
  messageId: number = 0
  xmlCommonPrefix: string = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope">'
  xmlCommonEnd: string = '</Envelope>'
  anonymousAddress: string = 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous'
  defaultTimeout: string = 'PT60S'

  createXml = (header: string, body: string): string => {
    if (header == null) throw new Error(WSManErrors.HEADER)
    if (body == null) throw new Error(WSManErrors.BODY)
    return this.xmlCommonPrefix + header + body + this.xmlCommonEnd
  }

  createHeader = (action: string, resourceUri: string, address?: string, timeout?: string, selector?: Selector): string => {
    let header: string = '<Header>'
    if (action == null) { throw new Error(WSManErrors.ACTION) }
    if (resourceUri == null) { throw new Error(WSManErrors.RESOURCE_URI) }
    header += `<a:Action>${action}</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${(this.messageId++).toString()}</a:MessageID><a:ReplyTo>`
    if (address != null) { header += `<a:Address>${address}</a:Address>` } else { header += `<a:Address>${this.anonymousAddress}</a:Address>` }
    header += '</a:ReplyTo>'
    if (timeout != null) { header += `<w:OperationTimeout>${timeout}</w:OperationTimeout>` } else { header += `<w:OperationTimeout>${this.defaultTimeout}</w:OperationTimeout>` }
    if (selector != null) {
      header += this.createSelector(selector)
    }
    header += '</Header>'
    return header
  }

  createSelector = (selectorSet: any): any => {
    if (selectorSet.name) return `<w:SelectorSet><w:Selector Name="${selectorSet.name}">${selectorSet.value}</w:Selector></w:SelectorSet>`
    let result = '<w:SelectorSet>'
    for (const propName in selectorSet) {
      result += '<w:Selector Name="' + propName + '">'
      if (selectorSet[propName].ReferenceParameters) {
        result += '<a:EndpointReference>'
        result += '<a:Address>' + selectorSet[propName].Address + '</a:Address><a:ReferenceParameters><w:ResourceURI>' + selectorSet[propName].ReferenceParameters.ResourceURI + '</w:ResourceURI><w:SelectorSet>'
        const selectorArray = selectorSet[propName].ReferenceParameters.SelectorSet.Selector
        if (Array.isArray(selectorArray)) {
          // TODO: Enable when selector is an array. No need for now.
          // for (let i = 0; i < selectorArray.length; i++) {
          //   result += '<w:Selector Name="${selectorArray[i].$.Name}">${selectorArray[i]._}</w:Selector>'
          // }
        } else {
          result += `<w:Selector Name="${selectorArray.$.Name}">${selectorArray._}</w:Selector>`
        }
        result += '</w:SelectorSet></a:ReferenceParameters></a:EndpointReference>'
      }
      result += '</w:Selector>'
    }
    result += '</w:SelectorSet>'
    return result
  }

  /**
   * @param method Valid methods are Pull, Enumerate, Get, Delete and RequestStateChange. For other methods use createBody()
   */
  createCommonBody = (method: string, enumerationContext?: string, input?: string, requestedState?: Number): string => {
    let str = '<Body>'
    switch (method) {
      case 'Pull':
        if (enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        str += `<Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull>`
        break
      case 'Enumerate':
        str += '<Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" />'
        break
      case 'Get':
      case 'Delete':
        str += ''
        break
      case 'RequestStateChange':
        if (input == null) { throw new Error(WSManErrors.INPUT) }
        if (requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
        str += `<r:RequestStateChange_INPUT xmlns:r="${input}"><r:RequestedState>${requestedState.toString()}</r:RequestedState></r:RequestStateChange_INPUT>`
        break
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
    str += '</Body>'
    return str
  }

  /**
   *
   * @param method
   * @param resourceUriBase
   * @param wsmanClass
   * @param data object(s) below the WSMAN class
   * @returns
   */
  createBody = (method: string, resourceUriBase: string, wsmanClass: string, data?: any): string => {
    this.processBody(data)
    let str = '<Body>'
    if (data) {
      str += `<h:${method} xmlns:h="${resourceUriBase}${wsmanClass}">`
      str += this.OBJtoXML(data)
      str += `</h:${method}>`
    } else {
      str += `<h:${method} xmlns:h="${resourceUriBase}${wsmanClass}" />`
    }
    str += '</Body>'
    return str
  }

  OBJtoXML (data: any): string {
    let xml = ''
    for (const prop in data) {
      if (Array.isArray(data[prop])) {
        xml += ''
      } else {
        xml += `<${prop}>`
      }
      if (Array.isArray(data[prop])) {
        for (const arrayIdx in data[prop]) {
          xml += `<${prop}`
          for (const attr in data[prop][arrayIdx].$) {
            xml += ` ${attr}="${data[prop][arrayIdx].$[attr]}"`
          }
          xml += '>'
          xml += data[prop][arrayIdx]._ ? data[prop][arrayIdx]._ : data[prop][arrayIdx]
          xml += `</${prop}>`
        }
      } else if (typeof data[prop] === 'object') {
        xml += this.OBJtoXML(data[prop])
      } else {
        xml += data[prop]
      }
      if (Array.isArray(data[prop])) {
        xml += ''
      } else {
        xml += `</${prop}>`
      }
    }
    return xml
  }

  processBody (data: any): any {
    if (Array.isArray(data)) {
      return
    }
    for (const val in data) {
      switch (val) {
        case 'Address':
        case 'ReferenceParameters':
          this.prependObjectKey(data, val, 'a:')
          break
        case 'SelectorSet':
        case 'Selector':
        case 'ResourceURI':
          this.prependObjectKey(data, val, 'w:')
          break
        default:
          this.prependObjectKey(data, val, 'h:')
          break
      }
    }
  }

  prependObjectKey (data: object, key: string, prefix: string) {
    data[prefix + key] = data[key]
    if (typeof data[key] === 'object') {
      this.processBody(data[key])
    }
    delete data[key]
  }
}
