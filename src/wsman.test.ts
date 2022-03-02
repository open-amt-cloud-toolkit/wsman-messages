/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManErrors, WSManMessageCreator } from './WSMan'

const wsmanMessageCreator = new WSManMessageCreator()
describe('WSManMessageCreator Tests', () => {
  const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Device 0' }
  describe('createXml Tests', () => {
    it('creates an enumerate wsman string when provided a header and body to createXml', () => {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement')
      const body = wsmanMessageCreator.createCommonBody('Enumerate')
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('creates a pull wsman string when provided a header and body to createXml', () => {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement')
      const body = wsmanMessageCreator.createCommonBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if header is null/undefined in createXml', () => {
      const header = null
      const body = wsmanMessageCreator.createCommonBody('Enumerate')
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.HEADER)
    })
    it('should throw error if body is null/undefined in createXml', () => {
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement')
      const body = null
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.BODY)
    })
  })
  describe('createHeader Tests', () => {
    it('creates a correct header with action, resourceUri, and messageId provided for createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>3</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous')
      expect(header).toEqual(correctHeader)
    })
    it('should throw error if missing action in createHeader', () => {
      expect(() => { wsmanMessageCreator.createHeader(null, 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement') }).toThrow(WSManErrors.ACTION)
    })
    it('should throw error if missing resourceUri in createHeader', () => {
      expect(() => { wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', null) }).toThrow(WSManErrors.RESOURCE_URI)
    })

    it('applies custom address correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>4</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', 'customAddress')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom timeout correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>5</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', null, 'PT30S')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom selector correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>6</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Device 0</w:Selector></w:SelectorSet></Header>'
      const header = wsmanMessageCreator.createHeader('http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate', 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', null, 'PT30S', selector)
      expect(header).toEqual(correctHeader)
    })
  })
  describe('createBody Tests', () => {
    it('creates correct Pull body for createBody', () => {
      const correctBody = '<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
      const body = wsmanMessageCreator.createCommonBody('Pull', 'A4070000-0000-0000-0000-000000000000')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Enumerate body for createBody', () => {
      const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      const body = wsmanMessageCreator.createCommonBody('Enumerate')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Get body for createBody', () => {
      const correctBody = '<Body></Body>'
      const body = wsmanMessageCreator.createCommonBody('Get')
      expect(body).toEqual(correctBody)
    })
    it('creates correct Delete body for createBody', () => {
      const correctBody = '<Body></Body>'
      const body = wsmanMessageCreator.createCommonBody('Delete')
      expect(body).toEqual(correctBody)
    })
    it('should throw error if Pull is missing enumerationContext in createBody', () => {
      expect(() => { wsmanMessageCreator.createCommonBody('Pull') }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if RequestStateChange is missing input in createBody', () => {
      expect(() => { wsmanMessageCreator.createCommonBody('RequestStateChange', null, null, 8) }).toThrow(WSManErrors.INPUT)
    })
    it('should throw error if RequestStateChange is missing requestedState in createBody', () => {
      expect(() => { wsmanMessageCreator.createCommonBody('RequestStateChange', null, 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService', null) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
    it('should throw error if method is not handled in createBody', () => {
      expect(() => { wsmanMessageCreator.createCommonBody('test') }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('createBody', () => {
    it('should convert obj to XML with test values', () => {
      const result = wsmanMessageCreator.createBody('testMethod', 'testUri', 'testXmlns')
      expect(result).toBe('<Body><r:testMethod xmlns:r="testUritestXmlns" /></Body>')
    })
    it('should convert obj to XML with not empty', () => {
      const result = wsmanMessageCreator.createBody('test_INPUT', 'http://test/', 'example', {
        AMTNetworkEnabled: '1',
        DDNSPeriodicUpdateInterval: '1440',
        DDNSTTL: '900'
      })
      expect(result).toBe('<Body><r:test_INPUT xmlns:r="http://test/example"><r:AMTNetworkEnabled>1</r:AMTNetworkEnabled><r:DDNSPeriodicUpdateInterval>1440</r:DDNSPeriodicUpdateInterval><r:DDNSTTL>900</r:DDNSTTL></r:test_INPUT></Body>')
    })
    it('should convert obj to XML with not empty with nested object', () => {
      const data = {
        AMT_GeneralSettings: {
          AMTNetworkEnabled: '1',
          DDNSPeriodicUpdateInterval: '1440',
          DDNSTTL: '900'
        }
      }
      const key = Object.keys(data)[0]
      const result = wsmanMessageCreator.createBody('test_INPUT', 'http://test/', key, data[key])
      expect(result).toBe('<Body><r:test_INPUT xmlns:r="http://test/AMT_GeneralSettings"><r:AMTNetworkEnabled>1</r:AMTNetworkEnabled><r:DDNSPeriodicUpdateInterval>1440</r:DDNSPeriodicUpdateInterval><r:DDNSTTL>900</r:DDNSTTL></r:test_INPUT></Body>')
    })
    it('should convert obj to XML with not empty with double nested object', () => {
      const data = {
        AMT_GeneralSettings: {
          AMTNetworkEnabled: '1',
          DDNSPeriodicUpdateInterval: '1440',
          DDNSTTL: '900',
          Settings: {
            Set1: 1,
            Set2: 7,
            Set3: 8
          }
        }
      }
      const key = Object.keys(data)[0]
      const result = wsmanMessageCreator.createBody('test_INPUT', 'http://test/', key, data[key])
      expect(result).toBe('<Body><r:test_INPUT xmlns:r="http://test/AMT_GeneralSettings"><r:AMTNetworkEnabled>1</r:AMTNetworkEnabled><r:DDNSPeriodicUpdateInterval>1440</r:DDNSPeriodicUpdateInterval><r:DDNSTTL>900</r:DDNSTTL><r:Settings><r:Set1>1</r:Set1><r:Set2>7</r:Set2><r:Set3>8</r:Set3></r:Settings></r:test_INPUT></Body>')
    })
  })
})
