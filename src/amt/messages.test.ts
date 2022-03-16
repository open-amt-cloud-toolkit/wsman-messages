/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Methods, Messages, Classes } from './'
import { BootSettingData, EnvironmentDetectionSettingData, EthernetPortSettings, MPServer, RemoteAccessPolicyRule, RedirectionResponse } from './models'
import { Selector, WSManErrors } from '../WSMan'

describe('AMT Tests', () => {
  let messageId = 0
  const amtClass = new Messages()
  const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>'
  const envelope = '<Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>'
  const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
  const operationTimeout = 'PT60S'
  const ethernetPortObject: EthernetPortSettings = {
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
  const mpsServer: MPServer = {
    AccessInfo: '192.168.0.38',
    InfoFormat: 3,
    Port: 4433,
    AuthMethod: 2,
    Username: 'admin',
    Password: 'eD9J*56Bn7ieEsVR',
    CommonName: '192.168.0.38'
  }
  const remoteAccessPolicyRule: RemoteAccessPolicyRule = {
    Trigger: 2,
    TunnelLifeTime: 0,
    ExtendedData: 'AAAAAAAAABk='
  }
  const bootSettingData: BootSettingData = {
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
      expect(() => { amtClass.amtSwitch({ method: Methods.READ_RECORDS, class: Classes.AMT_AUDIT_LOG }) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
    it('should return a valid Put wsman message', () => {
      const data: RedirectionResponse = {
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
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_RedirectionService xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><r:Name>${data.AMT_RedirectionService.Name}</r:Name><r:CreationClassName>${data.AMT_RedirectionService.CreationClassName}</r:CreationClassName><r:SystemName>${data.AMT_RedirectionService.SystemName}</r:SystemName><r:SystemCreationClassName>${data.AMT_RedirectionService.SystemCreationClassName}</r:SystemCreationClassName><r:ElementName>${data.AMT_RedirectionService.ElementName}</r:ElementName><r:ListenerEnabled>${data.AMT_RedirectionService.ListenerEnabled}</r:ListenerEnabled><r:AccessLog>${data.AMT_RedirectionService.AccessLog}</r:AccessLog><r:EnabledState>${data.AMT_RedirectionService.EnabledState}</r:EnabledState></r:AMT_RedirectionService></Body></Envelope>`
      const response = amtClass.amtSwitch({ method: Methods.PUT, class: Classes.AMT_ETHERNET_PORT_SETTINGS, data })
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if amt.data is null', () => {
      expect(() => { amtClass.amtSwitch({ method: Methods.PUT, class: Classes.AMT_ETHERNET_PORT_SETTINGS, data: null }) }).toThrow(WSManErrors.BODY)
    })
  })
  describe('AuditLog Tests', () => {
    it('should return a valid amt_AuditLog ReadRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:ReadRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><r:StartIndex>1</r:StartIndex></r:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog(Methods.READ_RECORDS, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.AuditLog(Methods.GET as any, 1) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('MessageLog Tests', () => {
    it('should return a valid amt_MessageLog PositionToFirstRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:PositionToFirstRecord_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog" /></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.POSITION_TO_FIRST_RECORD)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog GetRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:GetRecords_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"><r:IterationIdentifier>1</r:IterationIdentifier><r:MaxReadRecords>390</r:MaxReadRecords></r:GetRecords_INPUT></Body></Envelope>`
      const response = amtClass.MessageLog(Methods.GET_RECORDS, 1)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.MessageLog(Methods.GET as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('BootCapabilities Tests', () => {
    it('should return a valid amt_BootCapabilities Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootCapabilities(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('RedirectionService Tests', () => {
    it('should return a valid amt_RedirectionService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const boundCall = amtClass.RedirectionService.bind(this, Methods.GET)
      const response = boundCall()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('SetupAndConfigurationService Tests', () => {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService SetMEBxPassword wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:SetMEBxPassword_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><r:Password>P@ssw0rd</r:Password></r:SetMEBxPassword_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.SET_MEBX_PASSWORD, 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService Unprovision wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:Unprovision_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><r:ProvisioningMode>2</r:ProvisioningMode></r:Unprovision_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.UNPROVISION, null, 2)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService COMMIT_CHANGES wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:CommitChanges_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"></r:CommitChanges_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService(Methods.COMMIT_CHANGES)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.SetupAndConfigurationService(Methods.PULL as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('GeneralSettings Tests', () => {
    it('should return a valid amt_GeneralSettings Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_GeneralSettings PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_GeneralSettings xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings"></r:AMT_GeneralSettings></Body></Envelope>`
      const response = amtClass.GeneralSettings(Methods.PUT, {} as any)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if no data for PUT', () => {
      expect(() => { amtClass.GeneralSettings(Methods.PUT, null) }).toThrow(WSManErrors.BODY)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.GeneralSettings(Methods.PULL as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('EthernetPortSettings Tests', () => {
    it('should return a valid amt_EthernetPortSettings Get wsman message', () => {
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
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><r:AMT_EthernetPortSettings xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><r:DHCPEnabled>true</r:DHCPEnabled><r:ElementName>Intel(r) AMT Ethernet Port Settings</r:ElementName><r:InstanceID>Intel(r) AMT Ethernet Port Settings 0</r:InstanceID><r:IpSyncEnabled>true</r:IpSyncEnabled><r:LinkIsUp>true</r:LinkIsUp><r:LinkPolicy>1</r:LinkPolicy><r:LinkPolicy>14</r:LinkPolicy><r:LinkPolicy>16</r:LinkPolicy><r:MACAddress>a4-ae-11-1c-02-4d</r:MACAddress><r:PhysicalConnectionType>0</r:PhysicalConnectionType><r:SharedDynamicIP>true</r:SharedDynamicIP><r:SharedMAC>true</r:SharedMAC><r:SharedStaticIp>false</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.EthernetPortSettings(Methods.PUT, null, ethernetPortObject)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if ethernetPortObject is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.PUT) }).toThrow(WSManErrors.ETHERNET_PORT_OBJECT)
    })
    it('should throw error if enumerationContext is missing from amt_EthernetPortSettings Pull request', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.PULL) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.EthernetPortSettings(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessPolicyRule Tests', () => {
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', () => {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule(Methods.DELETE, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if selector is missing from amt_RemoteAccessPolicyRule Delete method', () => {
      expect(() => { amtClass.RemoteAccessPolicyRule(Methods.DELETE) }).toThrow(WSManErrors.SELECTOR)
    })
  })
  describe('ManagementPresenceRemoteSAP Tests', () => {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_ManagementPresenceRemoteSAP Pull request', () => {
      expect(() => { amtClass.ManagementPresenceRemoteSAP(Methods.PULL) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Delete wsman message', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">Intel(r) AMT:Management Presence Server 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP(Methods.DELETE, null, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if selector is missing from amt_ManagementPresenceRemoteSAP Delete method', () => {
      expect(() => { amtClass.ManagementPresenceRemoteSAP(Methods.DELETE) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.ManagementPresenceRemoteSAP(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicKeyCertificate Tests', () => {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.PULL, enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if enumerationContext is missing from amt_PublicKeyCertificate Pull request', () => {
      expect(() => { amtClass.PublicKeyCertificate(Methods.PULL) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should create a valid amt_PublicKeyCertificate Delete wsman message', () => {
      const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Certificate: Handle: 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle: 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate(Methods.DELETE, null, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if selector is missing from amt_PublicKeyCertificate Delete method', () => {
      expect(() => { amtClass.PublicKeyCertificate(Methods.DELETE) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicKeyCertificate(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('EnvironmentDetectionSettingData Tests', () => {
    it('should return a valid amt_EnvironmentDetectionSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EnvironmentDetectionSettingData Put wsman message', () => {
      const environmentDetectionSettingData: EnvironmentDetectionSettingData = {
        InstanceID: 'Intel(r) AMT Environment Detection Settings',
        DetectionAlgorithm: 0,
        ElementName: 'Intel(r) AMT Environment Detection Settings',
        DetectionStrings: ['dummy.com']
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">${environmentDetectionSettingData.InstanceID}</w:Selector></w:SelectorSet></Header><Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"><r:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.ElementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.InstanceID}</r:InstanceID><r:DetectionStrings>${environmentDetectionSettingData.DetectionStrings}</r:DetectionStrings></r:AMT_EnvironmentDetectionSettingData></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData(Methods.PUT, environmentDetectionSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if environmentDetectionSettingData is missing from amt_EnvironmentDetectionSettingData Pull request', () => {
      expect(() => { amtClass.EnvironmentDetectionSettingData(Methods.PUT) }).toThrow(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.EnvironmentDetectionSettingData(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicKeyManagementService Tests', () => {
    it('should return a valid amt_PublicKeyManagementService AddTrustedRootCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${trustedRootCert}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE, { CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService GenerateKeyPair wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:GenerateKeyPair_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:KeyAlgorithm>0</r:KeyAlgorithm><r:KeyLength>2048</r:KeyLength></r:GenerateKeyPair_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.GENERATE_KEY_PAIR, { KeyAlgorithm: 0, KeyLength: 2048 })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService AddCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${trustedRootCert}</r:CertificateBlob></r:AddCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService(Methods.ADD_CERTIFICATE, { CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.ADD_TRUSTED_ROOT_CERTIFICATE) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if certificateBlob is missing from amt_PublicKeyManagementService methods', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.ADD_CERTIFICATE) }).toThrow(WSManErrors.CERTIFICATE_BLOB)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicKeyManagementService(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('RemoteAccessService Tests', () => {
    it('should return a valid amt_RemoteAccessService addMpsServer wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpsServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpsServer.InfoFormat}</r:InfoFormat><r:Port>${mpsServer.Port}</r:Port><r:AuthMethod>${mpsServer.AuthMethod}</r:AuthMethod><r:Username>${mpsServer.Username}</r:Username><r:Password>${mpsServer.Password}</r:Password><r:CN>${mpsServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ADD_MPS, mpsServer)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if mpServer is missing from amt_RemoteAccessService addMpsServer methods', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_MPS) }).toThrow(WSManErrors.MP_SERVER)
    })
    it('should throw error if remoteAccessPolicyRule is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, null, null, selector) }).toThrow(WSManErrors.REMOTE_ACCESS_POLICY_RULE)
    })
    it('should throw error if selector is missing from amt_RemoteAccessService AddRemoteAccessPolicyRule methods', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, null, remoteAccessPolicyRule) }).toThrow(WSManErrors.SELECTOR)
    })
    it('should return a valid amt_RemoteAccessPolicyRule wsman message', () => {
      const remoteAccessPolicyRule: RemoteAccessPolicyRule = {
        Trigger: 2,
        TunnelLifeTime: 0,
        ExtendedData: '0300'
      }
      const selector: Selector = {
        name: 'myselector',
        value: 'true'
      }
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.Trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService(Methods.ADD_REMOTE_ACCESS_POLICY_RULE, null, remoteAccessPolicyRule, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.RemoteAccessService(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('UserInitiatedConnectionService Tests', () => {
    it('should return a valid amt_UserInitiatedConnectionService AddTrustedRootCertificate wsman message', () => {
      const requestedState = 32771
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:RequestStateChange_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService"><r:RequestedState>${requestedState}</r:RequestedState></r:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService(Methods.REQUEST_STATE_CHANGE, requestedState)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if requestedState is missing from amt_UserInitiatedConnectionService RequestStateChange methods', () => {
      expect(() => { amtClass.UserInitiatedConnectionService(Methods.REQUEST_STATE_CHANGE) }).toThrow(WSManErrors.REQUESTED_STATE)
    })
  })
  describe('BootSettingData Tests', () => {
    it('should return a valid amt_BootSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData"><r:BIOSLastStatus>${bootSettingData.BIOSLastStatus[0]}</r:BIOSLastStatus><r:BIOSLastStatus>${bootSettingData.BIOSLastStatus[1]}</r:BIOSLastStatus><r:UEFIBootNumberOfParams>${bootSettingData.UEFIBootNumberOfParams[0]}</r:UEFIBootNumberOfParams><r:UEFIBootParametersArray>${bootSettingData.UEFIBootParametersArray[0]}</r:UEFIBootParametersArray><r:BIOSPause>${bootSettingData.BIOSPause}</r:BIOSPause><r:BIOSSetup>${bootSettingData.BIOSSetup}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${bootSettingData.ConfigurationDataReset}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${bootSettingData.EnforceSecureBoot}</r:EnforceSecureBoot><r:FirmwareVerbosity>${bootSettingData.FirmwareVerbosity}</r:FirmwareVerbosity><r:ForcedProgressEvents>${bootSettingData.ForcedProgressEvents}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceID}</r:InstanceID><r:LockKeyboard>${bootSettingData.LockKeyboard}</r:LockKeyboard><r:LockPowerButton>${bootSettingData.LockPowerButton}</r:LockPowerButton><r:LockResetButton>${bootSettingData.LockResetButton}</r:LockResetButton><r:LockSleepButton>${bootSettingData.LockSleepButton}</r:LockSleepButton><r:OptionsCleared>${bootSettingData.OptionsCleared}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${bootSettingData.ReflashBIOS}</r:ReflashBIOS><r:SecureErase>${bootSettingData.SecureErase}</r:SecureErase><r:UseIDER>${bootSettingData.UseIDER}</r:UseIDER><r:UseSOL>${bootSettingData.UseSOL}</r:UseSOL><r:UseSafeMode>${bootSettingData.UseSafeMode}</r:UseSafeMode><r:UserPasswordBypass>${bootSettingData.UserPasswordBypass}</r:UserPasswordBypass></r:AMT_BootSettingData></Body></Envelope>`
      const response = amtClass.BootSettingData(Methods.PUT, bootSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if bootSettingData is missing from amt_BootSettingData Put method', () => {
      expect(() => { amtClass.BootSettingData(Methods.PUT) }).toThrow(WSManErrors.BOOT_SETTING_DATA)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.BootSettingData(Methods.SET_BOOT_CONFIG_ROLE as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('AuthorizationService Tests', () => {
    it('should return a valid amt_AuthorizationService SET_ADMIN_ACL_ENTRY_EX wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:SetAdminAclEntryEx_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><r:Username>admin</r:Username><r:DigestPassword>P@ssw0rd</r:DigestPassword></r:SetAdminAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService(Methods.SET_ADMIN_ACL_ENTRY_EX, 'admin', 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.AuthorizationService(Methods.GET as any, '', '') }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('TimeSynchronizationService Tests', () => {
    it('should return a valid amt_TimeSynchronizationService GET_LOW_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:GetLowAccuracyTimeSynch_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService" /></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.GET_LOW_ACCURACY_TIME_SYNCH)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService SET_HIGH_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:SetHighAccuracyTimeSynch_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService"><r:Ta0>1644240911</r:Ta0><r:Tm1>1644240943</r:Tm1><r:Tm2>1644240943</r:Tm2></r:SetHighAccuracyTimeSynch_INPUT></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService(Methods.SET_HIGH_ACCURACY_TIME_SYNCH, 1644240911, 1644240943, 1644240943)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TimeSynchronizationService(Methods.GET as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('TLSCredentialContext Tests', () => {
    it('should return a valid TLSCredentialContext CREATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Create</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:AMT_TLSCredentialContext xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext" /></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.CREATE)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSCredentialContext(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TLSCredentialContext(Methods.GET as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('TLSSettingData Tests', () => {
    it('should return a valid TLSSettingData PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT 802.3 TLS Settings</w:Selector></w:SelectorSet></Header><Body><r:AMT_TLSSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData"><r:InstanceID>Intel(r) AMT 802.3 TLS Settings</r:InstanceID></r:AMT_TLSSettingData></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.PUT, null, { InstanceID: 'Intel(r) AMT 802.3 TLS Settings' } as any)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>7E030000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.PULL, '7E030000-0000-0000-0000-000000000000')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSSettingData(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.TLSSettingData(Methods.GET as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('PublicPrivateKeyPair Tests', () => {
    it('should return a valid PublicPrivateKeyPair ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair(Methods.ENUMERATE)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.PublicPrivateKeyPair(Methods.GET as any) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
  describe('WiFiPortConfigurationService Tests', () => {
    it('should return a valid ADD_WIFI_SETTINGS wsman message', () => {
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
        PSKPassPhrase: 'passcode'
      }
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:AddWiFiSettings_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><r:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet></a:ReferenceParameters></r:WiFiEndpoint><r:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>${wifiEndpointSettings.ElementName}</q:ElementName><q:InstanceID>${wifiEndpointSettings.InstanceID}</q:InstanceID><q:AuthenticationMethod>${wifiEndpointSettings.AuthenticationMethod}</q:AuthenticationMethod><q:EncryptionMethod>${wifiEndpointSettings.EncryptionMethod}</q:EncryptionMethod><q:SSID>${wifiEndpointSettings.SSID}</q:SSID><q:Priority>${wifiEndpointSettings.Priority}</q:Priority><q:PSKPassPhrase>${wifiEndpointSettings.PSKPassPhrase}</q:PSKPassPhrase></r:WiFiEndpointSettingsInput></r:AddWiFiSettings_INPUT></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.ADD_WIFI_SETTINGS, wifiEndpointSettings, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid PUT message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:AMT_WiFiPortConfigurationService xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><r:localProfileSynchronizationEnabled>1</r:localProfileSynchronizationEnabled></r:AMT_WiFiPortConfigurationService></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.PUT, { localProfileSynchronizationEnabled: 1 }, null)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid GET message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService(Methods.GET, null, null)
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { amtClass.WiFiPortConfigurationService(Methods.ENUMERATE as any, null, null) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
