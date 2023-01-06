/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors } from '../WSMan'
import { Methods, Messages, Classes } from './'
import type { AMT, CIM } from '../'
import type { Selector } from '../WSMan'
import type { Models } from './'

describe('AMT Tests', () => {
  let messageId = 0
  let amtClass = new Messages()
  beforeEach(() => {
    messageId = 0
    amtClass = new Messages()
  })

  const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>'
  const envelope = '<Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>'
  const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
  const operationTimeout = 'PT60S'
  const ethernetPortObject: Models.EthernetPortSettings = {
    InstanceID: 'Intel(r) AMT Ethernet Port Settings 0',
    ElementName: 'Intel(r) AMT Ethernet Port Settings',
    SharedMAC: true,
    MACAddress: 'a4-ae-11-1c-02-4d',
    LinkIsUp: true,
    LinkPolicy: [1, 14, 16],
    SharedStaticIp: false,
    SharedDynamicIP: true,
    IpSyncEnabled: true,
    DHCPEnabled: true,
    PhysicalConnectionType: 0
  }
  const mpsServer: Models.MPServer = {
    AccessInfo: '192.168.0.38',
    InfoFormat: 3,
    Port: 4433,
    AuthMethod: 2,
    Username: 'admin',
    Password: 'eD9J*56Bn7ieEsVR',
    CommonName: '192.168.0.38'
  }
  const remoteAccessPolicyRule: Models.RemoteAccessPolicyRule = {
    Trigger: 2,
    TunnelLifeTime: 0,
    ExtendedData: 'AAAAAAAAABk='
  }
  const bootSettingData: Models.BootSettingData = {
    BIOSLastStatus: [2, 0],
    BIOSPause: false,
    BIOSSetup: false,
    BootMediaIndex: 0,
    ConfigurationDataReset: false,
    ElementName: 'Intel(r) AMT Boot Configuration Settings',
    EnforceSecureBoot: false,
    FirmwareVerbosity: 0,
    ForcedProgressEvents: false,
    IDERBootDevice: 0,
    InstanceID: 'Intel(r) AMT:BootSettingData 0',
    LockKeyboard: false,
    LockPowerButton: false,
    LockResetButton: false,
    LockSleepButton: false,
    OptionsCleared: true,
    OwningEntity: 'Intel(r) AMT',
    ReflashBIOS: false,
    SecureErase: false,
    UseIDER: false,
    UseSOL: false,
    UseSafeMode: false,
    UserPasswordBypass: false,
    UEFIBootNumberOfParams: [1],
    UEFIBootParametersArray: [1]
  }
  const trustedRootCert = 'MIIEOzCCAqOgAwIBAgIDAZiFMA0GCSqGSIb3DQEBDAUAMD0xFzAVBgNVBAMTDk1QU1Jvb3QtNjE0ZDg4MRAwDgYDVQQKEwd1bmtub3duMRAwDgYDVQQGEwd1bmtub3duMCAXDTIwMDgyNTE4MzMzN1oYDzIwNTEwODI1MTgzMzM3WjA9MRcwFQYDVQQDEw5NUFNSb290LTYxNGQ4ODEQMA4GA1UEChMHdW5rbm93bjEQMA4GA1UEBhMHdW5rbm93bjCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAOi1jx9L8DG6gBPxd9gmJ6vqQC/F/TBMTJvb3ZAuRbDxUKnxZk3PafyNM6fO8QTL4qZVhvyGEZaIzVePrdJj31aZ93mNY2TJee3/DLRsJUIZHGFufBvi8pgQL+JjE9JmFD5/S2yciHIEVpKmXo1CbGmZGsnb8NRjaQVwB94pI1mg8JFMxyKzU/cUoCBfI+wmeMgBVdOJPNpH2zjC/GxwEFNQaxGe9GHmYbwoeiDeMPo75E/o+Gw6kJm429cuhJBC3KqHevAJj9V2nSUvoO0oxKqzLVkUYcjHEGYjxIvP6a6uo7x9llwfshJsBZ3PE5hucNdWS3dY3GeCqOwcaAQQIj2jULpZ/KlgVAdBK/o5QjE+IIQXCVK9USvktGzz7I5oH98zy8jCFStbGM7PQCo+DEnHn/SANmVbcy3hjzrXC8zf5dvmKiUb2eKnpv+z3FHsi64sVwFqBArB2ipcTM/qv4nEM6uLW1t+7+NB0OyaBmLktJrpb6af7z/EW1QuPIfTcQIDAQABo0IwQDAMBgNVHRMEBTADAQH/MBEGCWCGSAGG+EIBAQQEAwIABzAdBgNVHQ4EFgQUYU2IeTFqWXI1rG+JqZq8eVDO/LMwDQYJKoZIhvcNAQEMBQADggGBANoKIsFOn8/Lrb98DjOP+LUeopoU9KQ70ndreNqchrkPmM61V9IdD9OZiLr/7OY/rLGZwNvkhQYRPUa842Mqjfpr4YcV6HC0j6Zg0lcpxQ5eGGBkLb/teBcboi3sZcJvbCFUW2DJjhy7uqYxzE4eqSsKx5fEjp/wa6oNzNrgWRXyxQlaOo42RjXnOXS7sB0jPrgO0FClL1Xzif06kFHzzyJCVUqzNEJv0ynLgkpzCVdUUfoMM1RcKc3xJes5C0zg64ugj2R9e4VwJfn9W3+rlYS1So1q1jL8w+3qOM7lXyvr8Bdgc5BMvrOvHxzdOnpZmUEJkbKty62e8fYKN+WP7BrpxnzFQSzczX5S0uN4rn0rLO4wxVf2rtnTqIhKKYTsPMRBVEjpbRT1smzPPdINKu5l/Rz/zZS0b5I4yKJrkTYNgoPC/QSq8A9uXZxxQvj6x1bWZJVWywmaqYolEp8NaVHd+JYnlTmr4XpMHm01TPi1laowtY3ZepnKm8I55Ly0JA=='
  describe('AMT private function Tests', () => {
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.switch({ method: Methods.READ_RECORDS, class: Classes.AMT_AUDIT_LOG }) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
    it('should return a valid Put wsman message', () => {
      const data: Models.RedirectionResponse = {
        AMT_RedirectionService: {
          Name: 'myservice',
          CreationClassName: 'redirection_service',
          SystemName: 'mysystem',
          SystemCreationClassName: 'test',
          ElementName: 'test',
          ListenerEnabled: true,
          AccessLog: 'hello',
          EnabledState: 0
        }
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_RedirectionService xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><h:Name>${data.AMT_RedirectionService.Name}</h:Name><h:CreationClassName>${data.AMT_RedirectionService.CreationClassName}</h:CreationClassName><h:SystemName>${data.AMT_RedirectionService.SystemName}</h:SystemName><h:SystemCreationClassName>${data.AMT_RedirectionService.SystemCreationClassName}</h:SystemCreationClassName><h:ElementName>${data.AMT_RedirectionService.ElementName}</h:ElementName><h:ListenerEnabled>${data.AMT_RedirectionService.ListenerEnabled}</h:ListenerEnabled><h:AccessLog>${data.AMT_RedirectionService.AccessLog}</h:AccessLog><h:EnabledState>${data.AMT_RedirectionService.EnabledState}</h:EnabledState></h:AMT_RedirectionService></Body></Envelope>`
      const response = amtClass.switch({ method: Methods.PUT, class: Classes.AMT_ETHERNET_PORT_SETTINGS, data })
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if amt.data is undefined', () => {
      expect(() => { amtClass.switch({ method: Methods.PUT, class: Classes.AMT_ETHERNET_PORT_SETTINGS, data: undefined }) }).toThrow(WSManErrors.DATA)
    })
    it('should throw error if amt.enumerationContext is undefined', () => {
      expect(() => { amtClass.switch({ method: Methods.PULL, class: Classes.AMT_ETHERNET_PORT_SETTINGS, enumerationContext: undefined }) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if amt.selector is undefined', () => {
      expect(() => { amtClass.switch({ method: Methods.DELETE, class: Classes.AMT_ETHERNET_PORT_SETTINGS, selector: undefined }) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if amt.requetedState is undefined', () => {
      expect(() => { amtClass.switch({ method: Methods.REQUEST_STATE_CHANGE, class: Classes.AMT_ETHERNET_PORT_SETTINGS, requestedState: undefined }) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
    it('should throw error if unsupported method is called', () => {
      expect(() => { amtClass.switch({ method: Methods.ADD_ALARM, class: Classes.AMT_ETHERNET_PORT_SETTINGS }) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('IEEE8021xCredentialContext Tests', () => {
    it('should return a valid amt_8021xCredentialContext GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021xCredentialContext ENUMERATE message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021xCredentialContext PULL message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.IEEE8021xCredentialContext(Methods.DELETE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
      expect(() => { amtClass.IEEE8021xCredentialContext(Methods.PUT as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
      expect(() => { amtClass.IEEE8021xCredentialContext(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('IEEE8021XProfile Tests', () => {
    it('should return a valid amt_8021XProfile GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021XProfile ENUMERATE message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021XProfile PULL message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021XProfile PUT message', () => {
      const data: Models.IEEE8021xProfile = {
        ElementName: 'test',
        InstanceID: 'test',
        Enabled: true,
        ActiveInS0: true,
        AuthenticationProtocol: 0,
        RoamingIdentity: 'test',
        Username: 'test',
        Password: 'test',
        Domain: 'test',
        PxeTimeout: 0
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_8021XProfile xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile"><h:ElementName>test</h:ElementName><h:InstanceID>test</h:InstanceID><h:Enabled>true</h:Enabled><h:ActiveInS0>true</h:ActiveInS0><h:AuthenticationProtocol>0</h:AuthenticationProtocol><h:RoamingIdentity>test</h:RoamingIdentity><h:Username>test</h:Username><h:Password>test</h:Password><h:Domain>test</h:Domain><h:PxeTimeout>0</h:PxeTimeout></h:AMT_8021XProfile></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile(Methods.PUT, undefined, data)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if data is missing from PUT call', () => {
      expect(() => { amtClass.IEEE8021xProfile(Methods.PUT) }).toThrow(WSManErrors.DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.IEEE8021xProfile(Methods.DELETE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
      expect(() => { amtClass.IEEE8021xProfile(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('AlarmClockService Tests', () => {
    it('should return a valid amt_AlarmClockService ADD_ALARM wsman message', () => {
      const instanceID = 'Instance'
      const elementName = 'Alarm instance name'
      // Start time must be on the minute - seconds must be 00
      const startTime = '2022-12-31T23:59:00Z'
      // The interval is in minutes
      const minutes = 59
      const hours = 23
      const days = 1
      const interval = minutes + hours * 60 + days * 1440
      const deleteOnCompletion = true
      let correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService/AddAlarm</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header>`
      correctResponse += '<Body><p:AddAlarm_INPUT xmlns:p="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService"><p:AlarmTemplate>'
      correctResponse += `<s:InstanceID xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${instanceID}</s:InstanceID>`
      correctResponse += `<s:ElementName xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${elementName}</s:ElementName>`
      correctResponse += `<s:StartTime xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Datetime xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">${startTime}</p:Datetime></s:StartTime>`
      correctResponse += `<s:Interval xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Interval xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">P${days}DT${hours}H${minutes}M</p:Interval></s:Interval>`
      correctResponse += `<s:DeleteOnCompletion xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${String(deleteOnCompletion)}</s:DeleteOnCompletion>`
      correctResponse += '</p:AlarmTemplate></p:AddAlarm_INPUT></Body></Envelope>'
      const response = amtClass.AlarmClockService(Methods.ADD_ALARM, undefined, { InstanceID: instanceID, ElementName: elementName, StartTime: new Date(startTime), Interval: interval, DeleteOnCompletion: deleteOnCompletion })
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if data is missing from amt_AlarmClockService AddAlarm method', () => {
      expect(() => { amtClass.AlarmClockService(Methods.ADD_ALARM, undefined) }).toThrow(WSManErrors.ADD_ALARM_DATA)
    })
    it('should return a valid amt_AlarmClockService GET message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AlarmClockService(Methods.GET, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AlarmClockService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AlarmClockService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AlarmClockService PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AlarmClockService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.AlarmClockService(Methods.PUT as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
      expect(() => { amtClass.AlarmClockService(Methods.DELETE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('AuditLog Tests', () => {
    it('should return a valid amt_AuditLog GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ReadRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:ReadRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><h:StartIndex>1</h:StartIndex></h:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.READ_RECORDS, undefined, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ReadRecords wsman message even if startIndex is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:ReadRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><h:StartIndex>1</h:StartIndex></h:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.READ_RECORDS, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.AuditLog(Methods.CREATE as any, undefined, 1) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('AuthorizationService Tests', () => {
    it('should return a valid amt_AuthorizationService GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AuthorizationService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AuthorizationService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AuthorizationService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService SET_ADMIN_ACL_ENTRY_EX wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetAdminAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Username>admin</h:Username><h:DigestPassword>P@ssw0rd</h:DigestPassword></h:SetAdminAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService(Methods.SET_ADMIN_ACL_ENTRY_EX, undefined, 'admin', 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if SET_ADMIN_ACL_ENTRY_EX is missing username', () => {
      expect(() => { amtClass.AuthorizationService(Methods.SET_ADMIN_ACL_ENTRY_EX, undefined, undefined, 'test') }).toThrow(WSManErrors.USERNAME)
    })
    it('should throw error if SET_ADMIN_ACL_ENTRY_EX is missing digestPassword', () => {
      expect(() => { amtClass.AuthorizationService(Methods.SET_ADMIN_ACL_ENTRY_EX, undefined, 'test', undefined) }).toThrow(WSManErrors.DIGEST_PASSWORD)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.AuthorizationService(Methods.CREATE as any, '', '') }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('BootCapabilities Tests', () => {
    it('should return a valid amt_BootCapabilities Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootCapabilities(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.BootCapabilities(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.BootCapabilities(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.BootCapabilities(Methods.CREATE as any, '') }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('BootSettingData Tests', () => {
    it('should return a valid amt_BootSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid AMT_BootSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      let correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData">`
      bootSettingData.BIOSLastStatus?.forEach((item) => {
        correctResponse += `<r:BIOSLastStatus>${item}</r:BIOSLastStatus>`
      })
      bootSettingData.UEFIBootNumberOfParams?.forEach((item) => {
        correctResponse += `<r:UEFIBootNumberOfParams>${item}</r:UEFIBootNumberOfParams>`
      })
      bootSettingData.UEFIBootParametersArray?.forEach((item) => {
        correctResponse += `<r:UEFIBootParametersArray>${item}</r:UEFIBootParametersArray>`
      })
      correctResponse += `<r:BIOSPause>${bootSettingData.BIOSPause}</r:BIOSPause><r:BIOSSetup>${bootSettingData.BIOSSetup}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${bootSettingData.ConfigurationDataReset}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${bootSettingData.EnforceSecureBoot}</r:EnforceSecureBoot><r:FirmwareVerbosity>${bootSettingData.FirmwareVerbosity}</r:FirmwareVerbosity><r:ForcedProgressEvents>${bootSettingData.ForcedProgressEvents}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceID}</r:InstanceID><r:LockKeyboard>${bootSettingData.LockKeyboard}</r:LockKeyboard><r:LockPowerButton>${bootSettingData.LockPowerButton}</r:LockPowerButton><r:LockResetButton>${bootSettingData.LockResetButton}</r:LockResetButton><r:LockSleepButton>${bootSettingData.LockSleepButton}</r:LockSleepButton><r:OptionsCleared>${bootSettingData.OptionsCleared}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${bootSettingData.ReflashBIOS}</r:ReflashBIOS><r:SecureErase>${bootSettingData.SecureErase}</r:SecureErase><r:UseIDER>${bootSettingData.UseIDER}</r:UseIDER><r:UseSOL>${bootSettingData.UseSOL}</r:UseSOL><r:UseSafeMode>${bootSettingData.UseSafeMode}</r:UseSafeMode><r:UserPasswordBypass>${bootSettingData.UserPasswordBypass}</r:UserPasswordBypass></r:AMT_BootSettingData></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.PUT, undefined, bootSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if bootSettingData is missing or incomplete from amt_BootSettingData Put method', () => {
      expect(() => { amtClass.BootSettingData(Methods.PUT) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
      expect(() => { amtClass.BootSettingData(Methods.PUT, undefined, { BIOSLastStatus: undefined, UEFIBootNumberOfParams: [], UEFIBootParametersArray: [] }) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
      expect(() => { amtClass.BootSettingData(Methods.PUT, undefined, { BIOSLastStatus: [], UEFIBootNumberOfParams: undefined, UEFIBootParametersArray: [] }) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
      expect(() => { amtClass.BootSettingData(Methods.PUT, undefined, { BIOSLastStatus: [], UEFIBootNumberOfParams: [], UEFIBootParametersArray: undefined }) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.BootSettingData(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('EnvironmentDetectionSettingData Tests', () => {
    it('should return a valid amt_EnvironmentDetectionSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EnvironmentDetectionSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EnvironmentDetectionSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EnvironmentDetectionSettingData Put wsman message', () => {
      const environmentDetectionSettingData: Models.EnvironmentDetectionSettingData = {
        InstanceID: 'Intel(r) AMT Environment Detection Settings',
        DetectionAlgorithm: 0,
        ElementName: 'Intel(r) AMT Environment Detection Settings',
        DetectionStrings: ['dummy.com']
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">${environmentDetectionSettingData.InstanceID}</w:Selector></w:SelectorSet></Header><Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"><r:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.ElementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.InstanceID}</r:InstanceID><r:DetectionStrings>${environmentDetectionSettingData.DetectionStrings}</r:DetectionStrings></r:AMT_EnvironmentDetectionSettingData></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.PUT, undefined, environmentDetectionSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if environmentDetectionSettingData is missing from amt_EnvironmentDetectionSettingData Pull request', () => {
      expect(() => { amtClass.EnvironmentDetectionSettingData(Methods.PUT) }).toThrow(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.EnvironmentDetectionSettingData(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('EthernetPortSettings Tests', () => {
    it('should return a valid amt_EthernetPortSettings Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EthernetPortSettings ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Put wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><h:AMT_EthernetPortSettings xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><h:InstanceID>Intel(r) AMT Ethernet Port Settings 0</h:InstanceID><h:ElementName>Intel(r) AMT Ethernet Port Settings</h:ElementName><h:SharedMAC>true</h:SharedMAC><h:MACAddress>a4-ae-11-1c-02-4d</h:MACAddress><h:LinkIsUp>true</h:LinkIsUp><h:LinkPolicy>1</h:LinkPolicy><h:LinkPolicy>14</h:LinkPolicy><h:LinkPolicy>16</h:LinkPolicy><h:SharedStaticIp>false</h:SharedStaticIp><h:SharedDynamicIP>true</h:SharedDynamicIP><h:IpSyncEnabled>true</h:IpSyncEnabled><h:DHCPEnabled>true</h:DHCPEnabled><h:PhysicalConnectionType>0</h:PhysicalConnectionType></h:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.PUT, undefined, ethernetPortObject)
      expect(response).toEqual(correctResponse)
    })
    it('should remove undefined properties before sending to createBody', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><h:AMT_EthernetPortSettings xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><h:InstanceID>Intel(r) AMT Ethernet Port Settings 0</h:InstanceID><h:ElementName>Intel(r) AMT Ethernet Port Settings</h:ElementName><h:SharedMAC>true</h:SharedMAC><h:MACAddress>a4-ae-11-1c-02-4d</h:MACAddress><h:LinkIsUp>true</h:LinkIsUp><h:LinkPolicy>1</h:LinkPolicy><h:LinkPolicy>14</h:LinkPolicy><h:LinkPolicy>16</h:LinkPolicy><h:SharedStaticIp>false</h:SharedStaticIp><h:SharedDynamicIP>true</h:SharedDynamicIP><h:IpSyncEnabled>true</h:IpSyncEnabled><h:DHCPEnabled>true</h:DHCPEnabled><h:PhysicalConnectionType>0</h:PhysicalConnectionType></h:AMT_EthernetPortSettings></Body></Envelope>`
      const testBody: Models.EthernetPortSettings = {
        InstanceID: 'Intel(r) AMT Ethernet Port Settings 0',
        ElementName: 'Intel(r) AMT Ethernet Port Settings',
        SharedMAC: true,
        MACAddress: 'a4-ae-11-1c-02-4d',
        LinkIsUp: true,
        LinkPolicy: [1, 14, 16],
        SharedStaticIp: false,
        SharedDynamicIP: true,
        DefaultGateway: undefined,
        IpSyncEnabled: true,
        DHCPEnabled: true,
        PhysicalConnectionType: 0,
        IPAddress: undefined,
        SubnetMask: undefined,
        PrimaryDNS: undefined,
        SecondaryDNS: undefined
      }
      const response = amtClass.EthernetPortSettings(Methods.PUT, undefined, testBody)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if ethernetPortObject is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.PUT) }).toThrow(WSManErrors.ETHERNET_PORT_OBJECT)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('GeneralSettings Tests', () => {
    it('should return a valid amt_GeneralSettings Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_GeneralSettings ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_GeneralSettings Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_GeneralSettings PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_GeneralSettings xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings"></h:AMT_GeneralSettings></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.PUT, undefined, {} as any)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if no data for PUT', () => {
      expect(() => { amtClass.GeneralSettings(Methods.PUT, undefined, undefined) }).toThrow(WSManErrors.GENERAL_SETTINGS)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.GeneralSettings(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('KerberosSettingData Tests', () => {
    it('should return a valid amt_KerberosSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.KerberosSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_KerberosSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.KerberosSettingData(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_KerberosSettingData Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.KerberosSettingData(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.KerberosSettingData(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('ManagementPresenceRemoteSAP Tests', () => {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_ManagementPresenceRemoteSAP ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Delete wsman message', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">Intel(r) AMT:Management Presence Server 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.DELETE, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.ManagementPresenceRemoteSAP(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('MessageLog Tests', () => {
    it('should return a valid amt_MessageLog Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_MessageLog Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog PositionToFirstRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:PositionToFirstRecord_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog" /></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.POSITION_TO_FIRST_RECORD)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog GetRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"><h:IterationIdentifier>1</h:IterationIdentifier><h:MaxReadRecords>390</h:MaxReadRecords></h:GetRecords_INPUT></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.GET_RECORDS, undefined, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog GetRecords wsman message even if identifier is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"><h:IterationIdentifier>1</h:IterationIdentifier><h:MaxReadRecords>390</h:MaxReadRecords></h:GetRecords_INPUT></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.GET_RECORDS, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.MessageLog(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('MPSUsernamePassword Tests', () => {
    it('should return a valid amt_MPSUsernamePassword Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MPSUsernamePassword ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_MPSUsernamePassword Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MPSUsernamePassword PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_MPSUsernamePassword xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword"></h:AMT_MPSUsernamePassword></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword(Methods.PUT, undefined, {} as any)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if data is missing from Put call', () => {
      expect(() => { amtClass.MPSUsernamePassword(Methods.PUT, undefined, undefined) }).toThrow(WSManErrors.DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.MPSUsernamePassword(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicKeyCertificate Tests', () => {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyCertificate ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Delete wsman message', () => {
      const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Certificate: Handle: 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle: 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.DELETE, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicKeyCertificate(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicKeyManagementService Tests', () => {
    it('should return a valid amt_PublicKeyManagementService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyManagementService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService AddTrustedRootCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddTrustedRootCertificate_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:CertificateBlob>${trustedRootCert}</h:CertificateBlob></h:AddTrustedRootCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE, undefined, { CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService GenerateKeyPair wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GenerateKeyPair_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:KeyAlgorithm>0</h:KeyAlgorithm><h:KeyLength>2048</h:KeyLength></h:GenerateKeyPair_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.GENERATE_KEY_PAIR, undefined, { KeyAlgorithm: 0, KeyLength: 2048 })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService AddCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddCertificate_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:CertificateBlob>${trustedRootCert}</h:CertificateBlob></h:AddCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ADD_CERTIFICATE, undefined, { CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService GeneratePKCS10RequestEx wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GeneratePKCS10RequestEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GeneratePKCS10RequestEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:KeyPair>test</h:KeyPair><h:NullSignedCertificateRequest>reallylongcertificateteststring</h:NullSignedCertificateRequest><h:SigningAlgorithm>1</h:SigningAlgorithm></h:GeneratePKCS10RequestEx_INPUT></Body></Envelope>`
      const pkcs10Request: Models.PKCS10Request = {
        KeyPair: 'test',
        NullSignedCertificateRequest: 'reallylongcertificateteststring',
        SigningAlgorithm: 1
      }
      const response = amtClass.PublicKeyManagementService(Methods.GENERATE_PKCS10_REQUEST_EX, undefined, pkcs10Request)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.ADD_CERTIFICATE) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if GenerateKeyPair is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.GENERATE_KEY_PAIR, undefined, undefined) }).toThrow(WSManErrors.KEY_PAIR)
    })
    it('should throw error if PKCS10Request is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.GENERATE_PKCS10_REQUEST_EX) }).toThrow(WSManErrors.PKCS10Request)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicPrivateKeyPair Tests', () => {
    const selector: Selector = {
      name: 'InstanceID',
      value: 'Intel(r) AMT Key: Handle: 0'
    }
    it('should return a valid PublicPrivateKeyPair Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid PublicPrivateKeyPair ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid PublicPrivateKeyPair Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid PublicPrivateKeyPair DELETE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Key: Handle: 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair(Methods.DELETE, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicPrivateKeyPair(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessCapabilities Tests', () => {
    it('should return a valid amt_RemoteAccessCapabilities Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessCapabilities(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessCapabilities ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessCapabilities(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessCapabilities Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessCapabilities(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RemoteAccessCapabilities(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RedirectionService Tests', () => {
    it('should return a valid amt_RedirectionService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RedirectionService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RedirectionService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RedirectionService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RedirectionService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RedirectionService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const test: AMT.Models.RedirectionService = {
        Name: 'test',
        CreationClassName: 'test',
        SystemName: 'test',
        SystemCreationClassName: 'test',
        AccessLog: 'test',
        ElementName: 'test',
        EnabledState: 32768,
        ListenerEnabled: true
      }
      const data: AMT.Models.RedirectionResponse = {
        AMT_RedirectionService: test
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_RedirectionService xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><h:Name>test</h:Name><h:CreationClassName>test</h:CreationClassName><h:SystemName>test</h:SystemName><h:SystemCreationClassName>test</h:SystemCreationClassName><h:AccessLog>test</h:AccessLog><h:ElementName>test</h:ElementName><h:EnabledState>32768</h:EnabledState><h:ListenerEnabled>true</h:ListenerEnabled></h:AMT_RedirectionService></Body></Envelope>`
      const response = amtClass.RedirectionService(Methods.PUT, undefined, undefined, data)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData REQUEST_STATE_CHANGE wsman message', () => {
      const requestedState = 32771
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:RequestStateChange_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><r:RequestedState>32771</r:RequestedState></r:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.RedirectionService(Methods.REQUEST_STATE_CHANGE, undefined, requestedState)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RedirectionService(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessPolicyAppliesToMPS Tests', () => {
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS DELETE wsman message', () => {
      const selector: Selector = {
        name: 'Name',
        value: 'Instance'
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">Instance</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.DELETE, undefined, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyAppliesToMPS PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>AC070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyAppliesToMPS PUT wsman message', () => {
      const managedElement: CIM.Models.ManagedElement = {
        ElementName: 'test',
        Description: 'test',
        Caption: 'test'
      }
      const policySet: CIM.Models.PolicySet = {
        CommonName: 'test',
        Enabled: 1,
        PolicyDecisionStrategy: 1,
        PolicyKeywords: ['test'],
        PolicyRoles: ['test'],
        Caption: 'test',
        Description: 'test',
        ElementName: 'test'
      }
      const remoteAccessPolicyAppliesToMPS: Models.RemoteAccessPolicyAppliesToMPS = {
        ManagedElement: managedElement,
        PolicySet: policySet,
        MpsType: 2,
        OrderOfAccess: 0
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_RemoteAccessPolicyAppliesToMPS xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS"><h:ManagedElement><h:ElementName>test</h:ElementName><h:Description>test</h:Description><h:Caption>test</h:Caption></h:ManagedElement><h:PolicySet><h:CommonName>test</h:CommonName><h:Enabled>1</h:Enabled><h:PolicyDecisionStrategy>1</h:PolicyDecisionStrategy><h:PolicyKeywords>test</h:PolicyKeywords><h:PolicyRoles>test</h:PolicyRoles><h:Caption>test</h:Caption><h:Description>test</h:Description><h:ElementName>test</h:ElementName></h:PolicySet><h:MpsType>2</h:MpsType><h:OrderOfAccess>0</h:OrderOfAccess></h:AMT_RemoteAccessPolicyAppliesToMPS></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.PUT, undefined, remoteAccessPolicyAppliesToMPS)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyAppliesToMPS CREATE wsman message', () => {
      const managedElement: CIM.Models.ManagedElement = {
        ElementName: 'test',
        Description: 'test',
        Caption: 'test'
      }
      const policySet: CIM.Models.PolicySet = {
        CommonName: 'test',
        Enabled: 1,
        PolicyDecisionStrategy: 1,
        PolicyKeywords: ['test'],
        PolicyRoles: ['test'],
        Caption: 'test',
        Description: 'test',
        ElementName: 'test'
      }
      const remoteAccessPolicyAppliesToMPS: Models.RemoteAccessPolicyAppliesToMPS = {
        ManagedElement: managedElement,
        PolicySet: policySet,
        MpsType: 2,
        OrderOfAccess: 0
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Create</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_RemoteAccessPolicyAppliesToMPS xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS"><h:ManagedElement><h:ElementName>test</h:ElementName><h:Description>test</h:Description><h:Caption>test</h:Caption></h:ManagedElement><h:PolicySet><h:CommonName>test</h:CommonName><h:Enabled>1</h:Enabled><h:PolicyDecisionStrategy>1</h:PolicyDecisionStrategy><h:PolicyKeywords>test</h:PolicyKeywords><h:PolicyRoles>test</h:PolicyRoles><h:Caption>test</h:Caption><h:Description>test</h:Description><h:ElementName>test</h:ElementName></h:PolicySet><h:MpsType>2</h:MpsType><h:OrderOfAccess>0</h:OrderOfAccess></h:AMT_RemoteAccessPolicyAppliesToMPS></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS(Methods.CREATE, undefined, remoteAccessPolicyAppliesToMPS)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RemoteAccessPolicyAppliesToMPS(Methods.ADD_MPS as any, undefined, undefined) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessPolicyRule Tests', () => {
    it('should return a valid amt_RemoteAccessPolicyRule Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyRule ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyRule Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', () => {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.DELETE, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RemoteAccessPolicyRule(Methods.CREATE as any, undefined, undefined) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessService Tests', () => {
    it('should return a valid amt_RemoteAccessService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessService addMpsServer wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpsServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpsServer.InfoFormat}</r:InfoFormat><r:Port>${mpsServer.Port}</r:Port><r:AuthMethod>${mpsServer.AuthMethod}</r:AuthMethod><r:Username>${mpsServer.Username}</r:Username><r:Password>${mpsServer.Password}</r:Password><r:CN>${mpsServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ADD_MPS, undefined, mpsServer)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if mpServer is missing from amt_RemoteAccessService addMpsServer methods', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_MPS) }).toThrow(WSManErrors.MP_SERVER)
    })
    it('should throw error if remoteAccessPolicyRule is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, undefined, undefined, undefined, selector) }).toThrow(WSManErrors.REMOTE_ACCESS_POLICY_RULE)
    })
    it('should throw error if selector is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, undefined, undefined, remoteAccessPolicyRule) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should return a valid amt_RemoteAccessPolicyRule wsman message', () => {
      const remoteAccessPolicyRule: Models.RemoteAccessPolicyRule = {
        Trigger: 2,
        TunnelLifeTime: 0,
        ExtendedData: '0300'
      }
      const selector: Selector = {
        name: 'myselector',
        value: 'true'
      }
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.Trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, undefined, undefined, remoteAccessPolicyRule, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('SetupAndConfigurationService Tests', () => {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService GetUuid wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/GetUuid</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetUuid xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService" /></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.GET_UUID)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_SetupAndConfigurationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService SetMEBxPassword wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:SetMEBxPassword_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><r:Password>P@ssw0rd</r:Password></r:SetMEBxPassword_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.SET_MEBX_PASSWORD, undefined, 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should throw an error if password is undefined for SET_MEBX_PASSWORD', () => {
      expect(() => { amtClass.SetupAndConfigurationService(Methods.SET_MEBX_PASSWORD, undefined, undefined) }).toThrow(WSManErrors.PASSWORD)
    })
    it('should return a valid amt_SetupAndConfigurationService Unprovision wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:Unprovision_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><r:ProvisioningMode>1</r:ProvisioningMode></r:Unprovision_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.UNPROVISION, undefined, undefined, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService Unprovision wsman message even if provisioningMode is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:Unprovision_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><r:ProvisioningMode>1</r:ProvisioningMode></r:Unprovision_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.UNPROVISION, undefined, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService COMMIT_CHANGES wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:CommitChanges_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"></h:CommitChanges_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.COMMIT_CHANGES)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.SetupAndConfigurationService(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('TimeSynchronizationService Tests', () => {
    it('should return a valid amt_TimeSynchronizationService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_TimeSynchronizationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService GET_LOW_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetLowAccuracyTimeSynch_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService" /></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.GET_LOW_ACCURACY_TIME_SYNCH)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService SET_HIGH_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetHighAccuracyTimeSynch_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService"><h:Ta0>1644240911</h:Ta0><h:Tm1>1644240943</h:Tm1><h:Tm2>1644240943</h:Tm2></h:SetHighAccuracyTimeSynch_INPUT></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.SET_HIGH_ACCURACY_TIME_SYNCH, undefined, 1644240911, 1644240943, 1644240943)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TimeSynchronizationService(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('TLSCredentialContext Tests', () => {
    const tlsCredentialContext: Models.TLSCredentialContext = {
      ElementInContext: {
        Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
        ReferenceParameters: {
          ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate',
          SelectorSet: {
            Selector: {
              _: 'Intel(r) AMT Certificate: Handle: 1',
              $: {
                Name: 'InstanceID'
              }
            }
          }
        }
      },
      ElementProvidingContext: {
        Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
        ReferenceParameters: {
          ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSProtocolEndpointCollection',
          SelectorSet: {
            Selector: {
              _: 'TLSProtocolEndpoint Instances Collection',
              $: {
                Name: 'ElementName'
              }
            }
          }
        }
      }
    }
    const selector: Selector = {
      name: tlsCredentialContext.ElementInContext.ReferenceParameters.SelectorSet.Selector.$.Name,
      value: tlsCredentialContext.ElementInContext.ReferenceParameters.SelectorSet.Selector._
    }
    it('should return a valid TLSCredentialContext Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext CREATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Create</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_TLSCredentialContext xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext"><h:ElementInContext><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><w:SelectorSet><w:Selector><h:_>Intel(r) AMT Certificate: Handle: 1</h:_><h:$><h:Name>InstanceID</h:Name></h:$></w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementInContext><h:ElementProvidingContext><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSProtocolEndpointCollection</w:ResourceURI><w:SelectorSet><w:Selector><h:_>TLSProtocolEndpoint Instances Collection</h:_><h:$><h:Name>ElementName</h:Name></h:$></w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementProvidingContext></h:AMT_TLSCredentialContext></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.CREATE, undefined, tlsCredentialContext, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid TLSCredentialContext Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext DELETE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle: 1</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.DELETE, undefined, undefined, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TLSCredentialContext(Methods.ADD_ALARM as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
    it('should throw error if tlsCredentialContext is undefined when CREATE is called', () => {
      expect(() => { amtClass.TLSCredentialContext(Methods.CREATE, undefined, undefined) }).toThrow(WSManErrors.TLS_CREDENTIAL_CONTEXT)
    })
  })
  describe('TLSSettingData Tests', () => {
    it('should return a valid TLSSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT 802.3 TLS Settings</w:Selector></w:SelectorSet></Header><Body><h:AMT_TLSSettingData xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData"><h:InstanceID>Intel(r) AMT 802.3 TLS Settings</h:InstanceID></h:AMT_TLSSettingData></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.PUT, undefined, { InstanceID: 'Intel(r) AMT 802.3 TLS Settings' } as any)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>7E030000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.PULL, '7E030000-0000-0000-0000-000000000000')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TLSSettingData(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('UserInitiatedConnectionService Tests', () => {
    it('should return a valid amt_UserInitiatedConnectionService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_UserInitiatedConnectionService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_UserInitiatedConnectionService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_UserInitiatedConnectionService AddTrustedRootCertificate wsman message', () => {
      const requestedState = 32771
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:RequestStateChange_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService"><r:RequestedState>${requestedState}</r:RequestedState></r:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.REQUEST_STATE_CHANGE, undefined, requestedState)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.UserInitiatedConnectionService(Methods.CREATE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('WiFiPortConfigurationService Tests', () => {
    const selector: Selector = {
      name: 'Name',
      value: 'WiFi Endpoint 0'
    }
    const wifiEndpointSettings = {
      ElementName: 'home',
      InstanceID: 'Intel(r) AMT:WiFi Endpoint Settings home',
      AuthenticationMethod: 6,
      EncryptionMethod: 4,
      SSID: 'admin',
      Priority: 1,
      PSKPassPhrase: 'p\'ass<>&"code'
    }
    it('should return a valid amt_WiFiPortConfigurationService ADD_WIFI_SETTINGS wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddWiFiSettings_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><r:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet></a:ReferenceParameters></r:WiFiEndpoint><r:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>${wifiEndpointSettings.ElementName}</q:ElementName><q:InstanceID>${wifiEndpointSettings.InstanceID}</q:InstanceID><q:AuthenticationMethod>${wifiEndpointSettings.AuthenticationMethod}</q:AuthenticationMethod><q:EncryptionMethod>${wifiEndpointSettings.EncryptionMethod}</q:EncryptionMethod><q:SSID>${wifiEndpointSettings.SSID}</q:SSID><q:Priority>${wifiEndpointSettings.Priority}</q:Priority><q:PSKPassPhrase>p&apos;ass&lt;&gt;&amp;&quot;code</q:PSKPassPhrase></r:WiFiEndpointSettingsInput></r:AddWiFiSettings_INPUT></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.ADD_WIFI_SETTINGS, undefined, wifiEndpointSettings, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService PUT message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">WiFi Endpoint 0</w:Selector></w:SelectorSet></Header><Body><h:AMT_WiFiPortConfigurationService xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><h:localProfileSynchronizationEnabled>1</h:localProfileSynchronizationEnabled></h:AMT_WiFiPortConfigurationService></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.PUT, undefined, { localProfileSynchronizationEnabled: 1 }, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService GET message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.GET, undefined, undefined)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_WiFiPortConfigurationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if data is missing from PUT call', () => {
      const selector: Selector = {
        name: 'name',
        value: 'value'
      }
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.PUT, undefined, undefined, selector) }).toThrow(WSManErrors.DATA)
    })
    it('should throw error if data is missing from ADD_WIFI_SETTINGS call', () => {
      const selector: Selector = {
        name: 'name',
        value: 'value'
      }
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.ADD_WIFI_SETTINGS, undefined, undefined, selector) }).toThrow(WSManErrors.DATA)
    })
    it('should throw error if selector is missing from ADD_WIFI_SETTINGS call', () => {
      const data: CIM.Models.WiFiEndpointSettings = {
        AuthenticationMethod: 6,
        ElementName: 'test',
        EncryptionMethod: 1,
        InstanceID: 'InstanceID',
        Priority: 1,
        BSSType: 2,
        Caption: 'caption',
        Description: 'description',
        KeyIndex: 1,
        Keys: ['keys'],
        PSKPassPhrase: 'passphrase',
        PSKValue: 0,
        SSID: 'ssid'
      }
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.ADD_WIFI_SETTINGS, undefined, data, undefined) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throow error if Selector or Data are missing from Put call', () => {
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.PUT, undefined, undefined, { name: 'test', value: 'test' }) }).toThrow(WSManErrors.DATA)
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.PUT, undefined, { name: 'test' }, undefined) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.CREATE as any, undefined, undefined) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
