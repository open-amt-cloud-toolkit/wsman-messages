/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors } from '../WSMan'
import { Messages, Realms } from './'
import type { Models } from './'
import type { CIM } from '../'
import type { Selector } from '../WSMan'

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
      const response = amtClass.AlarmClockService.AddAlarm({ InstanceID: instanceID, ElementName: elementName, StartTime: new Date(startTime), Interval: interval, DeleteOnCompletion: deleteOnCompletion })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AlarmClockService GET message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AlarmClockService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AlarmClockService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AlarmClockService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AlarmClockService PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AlarmClockService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('AuditLog Tests', () => {
    it('should return a valid amt_AuditLog GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AuditLog.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AuditLog.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AuditLog.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ReadRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:ReadRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><h:StartIndex>1</h:StartIndex></h:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog.ReadRecords(1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuditLog ReadRecords wsman message even if startIndex is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:ReadRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog"><h:StartIndex>1</h:StartIndex></h:ReadRecords_INPUT></Body></Envelope>`
      const response = amtClass.AuditLog.ReadRecords()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('AuthorizationService Tests', () => {
    it('should return a valid amt_AuthorizationService GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.AuthorizationService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.AuthorizationService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.AuthorizationService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService SET_ADMIN_ACL_ENTRY_EX wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetAdminAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Username>admin</h:Username><h:DigestPassword>P@ssw0rd</h:DigestPassword></h:SetAdminAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.SetAdminACLEntryEx('admin', 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService ADD_USER_ACL_ENTRY_EX wsman message using digest', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/AddUserAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddUserAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:DigestUsername>test</h:DigestUsername><h:DigestPassword>P@ssw0rd</h:DigestPassword><h:AccessPermission>2</h:AccessPermission><h:Realms>3</h:Realms></h:AddUserAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION], 'test', 'P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService ADD_USER_ACL_ENTRY_EX wsman message using kerberos', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/AddUserAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddUserAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:KerberosUserSid>64</h:KerberosUserSid><h:AccessPermission>2</h:AccessPermission><h:Realms>3</h:Realms></h:AddUserAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION], undefined, undefined, '64')
      expect(response).toEqual(correctResponse)
    })
    it('should throw an error if the digestUsername is longer than 16 when calling AddUserAclEntryEx', () => {
      expect(() => { amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION], 'thisusernameistoolong', 'test') }).toThrow(WSManErrors.USERNAME_TOO_LONG)
    })
    it('should throw an error if digest or kerberos credentials are not provided to AddUserAclEntryEx', () => {
      expect(() => { amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION]) }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
      expect(() => { amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION], 'test') }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
      expect(() => { amtClass.AuthorizationService.AddUserAclEntryEx(2, [Realms.ADMINISTRATION], undefined, 'test') }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
    })
    it('should return a valid amt_AuthorizationService EnumerateUserAclEntries wsman message when startIndex is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/EnumerateUserAclEntries</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:EnumerateUserAclEntries_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:StartIndex>1</h:StartIndex></h:EnumerateUserAclEntries_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.EnumerateUserAclEntries()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService EnumerateUserAclEntries wsman message when startIndex is not 1', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/EnumerateUserAclEntries</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:EnumerateUserAclEntries_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:StartIndex>50</h:StartIndex></h:EnumerateUserAclEntries_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.EnumerateUserAclEntries(50)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService GetUserAclEntryEx wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetUserAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetUserAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle></h:GetUserAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.GetUserAclEntryEx(1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService UpdateUserAclEntryEx wsman message using digest', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/UpdateUserAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:UpdateUserAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle><h:DigestUsername>test</h:DigestUsername><h:DigestPassword>test123!</h:DigestPassword><h:AccessPermission>2</h:AccessPermission><h:Realms>3</h:Realms></h:UpdateUserAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION], 'test', 'test123!')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService UpdateUserAclEntryEx wsman message using kerberos', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/UpdateUserAclEntryEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:UpdateUserAclEntryEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle><h:KerberosUserSid>64</h:KerberosUserSid><h:AccessPermission>2</h:AccessPermission><h:Realms>3</h:Realms></h:UpdateUserAclEntryEx_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION], undefined, undefined, '64')
      expect(response).toEqual(correctResponse)
    })
    it('should throw an error if digest or kerberos credentials are not provided to UpdateUserAclEntryEx', () => {
      expect(() => { amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION]) }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
      expect(() => { amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION], 'test') }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
      expect(() => { amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION], undefined, 'test') }).toThrow(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION)
    })
    it('should throw an error if the digestUsername is longer than 16 when calling UpdateUserAclEntryEx', () => {
      expect(() => { amtClass.AuthorizationService.UpdateUserAclEntryEx(1, 2, [Realms.ADMINISTRATION], 'thisusernameistoolong', 'test') }).toThrow(WSManErrors.USERNAME_TOO_LONG)
    })
    it('should return a valid amt_AuthorizationService RemoveUserAclEntry wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/RemoveUserAclEntry</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:RemoveUserAclEntry_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle></h:RemoveUserAclEntry_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.RemoveUserAclEntry(1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService GetAdminAclEntry wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminAclEntry</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetAdminAclEntry_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"></h:GetAdminAclEntry_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.GetAdminAclEntry()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService GetAdminAclEntryStatus wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminAclEntryStatus</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetAdminAclEntryStatus_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"></h:GetAdminAclEntryStatus_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.GetAdminAclEntryStatus()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService GetAdminNetAclEntryStatus wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminNetAclEntryStatus</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetAdminNetAclEntryStatus_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"></h:GetAdminNetAclEntryStatus_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.GetAdminNetAclEntryStatus()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService SetAclEnabledState wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAclEnabledState</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetAclEnabledState_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle><h:Enabled>true</h:Enabled></h:SetAclEnabledState_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.SetAclEnabledState(1, true)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_AuthorizationService GetAclEnabledState wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAclEnabledState</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetAclEnabledState_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService"><h:Handle>1</h:Handle></h:GetAclEnabledState_INPUT></Body></Envelope>`
      const response = amtClass.AuthorizationService.GetAclEnabledState(1)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('BootCapabilities Tests', () => {
    it('should return a valid amt_BootCapabilities Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootCapabilities.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.BootCapabilities.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootCapabilities</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.BootCapabilities.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('BootSettingData Tests', () => {
    it('should return a valid amt_BootSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.BootSettingData.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootCapabilities ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.BootSettingData.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid AMT_BootSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.BootSettingData.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_BootSettingData xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData"><h:BIOSLastStatus>2</h:BIOSLastStatus><h:BIOSLastStatus>0</h:BIOSLastStatus><h:BIOSPause>false</h:BIOSPause><h:BIOSSetup>false</h:BIOSSetup><h:BootMediaIndex>0</h:BootMediaIndex><h:ConfigurationDataReset>false</h:ConfigurationDataReset><h:ElementName>Intel(r) AMT Boot Configuration Settings</h:ElementName><h:EnforceSecureBoot>false</h:EnforceSecureBoot><h:FirmwareVerbosity>0</h:FirmwareVerbosity><h:ForcedProgressEvents>false</h:ForcedProgressEvents><h:IDERBootDevice>0</h:IDERBootDevice><h:InstanceID>Intel(r) AMT:BootSettingData 0</h:InstanceID><h:LockKeyboard>false</h:LockKeyboard><h:LockPowerButton>false</h:LockPowerButton><h:LockResetButton>false</h:LockResetButton><h:LockSleepButton>false</h:LockSleepButton><h:OptionsCleared>true</h:OptionsCleared><h:OwningEntity>Intel(r) AMT</h:OwningEntity><h:ReflashBIOS>false</h:ReflashBIOS><h:SecureErase>false</h:SecureErase><h:UseIDER>false</h:UseIDER><h:UseSOL>false</h:UseSOL><h:UseSafeMode>false</h:UseSafeMode><h:UserPasswordBypass>false</h:UserPasswordBypass><h:UEFIBootNumberOfParams>1</h:UEFIBootNumberOfParams><h:UEFIBootParametersArray>1</h:UEFIBootParametersArray></h:AMT_BootSettingData></Body></Envelope>`
      const response = amtClass.BootSettingData.Put(bootSettingData)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('EnvironmentDetectionSettingData Tests', () => {
    it('should return a valid amt_EnvironmentDetectionSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EnvironmentDetectionSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EnvironmentDetectionSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EnvironmentDetectionSettingData Put wsman message', () => {
      const environmentDetectionSettingData: Models.EnvironmentDetectionSettingData = {
        InstanceID: 'Intel(r) AMT Environment Detection Settings',
        DetectionAlgorithm: 0,
        ElementName: 'Intel(r) AMT Environment Detection Settings',
        DetectionStrings: ['dummy.com']
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">${environmentDetectionSettingData.InstanceID}</w:Selector></w:SelectorSet></Header><Body><h:AMT_EnvironmentDetectionSettingData xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EnvironmentDetectionSettingData"><h:InstanceID>${environmentDetectionSettingData.InstanceID}</h:InstanceID><h:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</h:DetectionAlgorithm><h:ElementName>${environmentDetectionSettingData.ElementName}</h:ElementName><h:DetectionStrings>${environmentDetectionSettingData.DetectionStrings}</h:DetectionStrings></h:AMT_EnvironmentDetectionSettingData></Body></Envelope>`
      const response = amtClass.EnvironmentDetectionSettingData.Put(environmentDetectionSettingData)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('EthernetPortSettings Tests', () => {
    it('should return a valid amt_EthernetPortSettings Get wsman message', () => {
      const selector: Selector = {
        name: 'InstanceID',
        value: 'Intel(r) AMT Ethernet Port Settings 0'
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.EthernetPortSettings.Get(selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_EthernetPortSettings ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.EthernetPortSettings.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.EthernetPortSettings.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_EthernetPortSettings Put wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Ethernet Port Settings 0</w:Selector></w:SelectorSet></Header><Body><h:AMT_EthernetPortSettings xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_EthernetPortSettings"><h:InstanceID>Intel(r) AMT Ethernet Port Settings 0</h:InstanceID><h:ElementName>Intel(r) AMT Ethernet Port Settings</h:ElementName><h:SharedMAC>true</h:SharedMAC><h:MACAddress>a4-ae-11-1c-02-4d</h:MACAddress><h:LinkIsUp>true</h:LinkIsUp><h:LinkPolicy>1</h:LinkPolicy><h:LinkPolicy>14</h:LinkPolicy><h:LinkPolicy>16</h:LinkPolicy><h:SharedStaticIp>false</h:SharedStaticIp><h:SharedDynamicIP>true</h:SharedDynamicIP><h:IpSyncEnabled>true</h:IpSyncEnabled><h:DHCPEnabled>true</h:DHCPEnabled><h:PhysicalConnectionType>0</h:PhysicalConnectionType></h:AMT_EthernetPortSettings></Body></Envelope>`
      const response = amtClass.EthernetPortSettings.Put(ethernetPortObject)
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
      const response = amtClass.EthernetPortSettings.Put(testBody)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('GeneralSettings Tests', () => {
    it('should return a valid amt_GeneralSettings Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.GeneralSettings.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_GeneralSettings ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.GeneralSettings.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_GeneralSettings Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.GeneralSettings.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_GeneralSettings PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_GeneralSettings xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings"></h:AMT_GeneralSettings></Body></Envelope>`
      const response = amtClass.GeneralSettings.Put({} as any)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('IEEE8021xCredentialContext Tests', () => {
    it('should return a valid amt_8021xCredentialContext GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021xCredentialContext ENUMERATE message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021xCredentialContext PULL message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021xCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.IEEE8021xCredentialContext.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('IEEE8021XProfile Tests', () => {
    it('should return a valid amt_8021XProfile GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021XProfile ENUMERATE message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_8021XProfile PULL message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_8021XProfile</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.IEEE8021xProfile.Pull(enumerationContext)
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
      const response = amtClass.IEEE8021xProfile.Put(data)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('KerberosSettingData Tests', () => {
    it('should return a valid amt_KerberosSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.KerberosSettingData.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_KerberosSettingData Enumerate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.KerberosSettingData.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_KerberosSettingData GetCredentialCacheState wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData/GetCredentialCacheState</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetCredentialCacheState_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData"></h:GetCredentialCacheState_INPUT></Body></Envelope>`
      const response = amtClass.KerberosSettingData.GetCredentialCacheState()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_KerberosSettingData SetCredentialCacheState wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData/SetCredentialCacheState</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetCredentialCacheState_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData"></h:SetCredentialCacheState_INPUT></Body></Envelope>`
      const response = amtClass.KerberosSettingData.SetCredentialCacheState(true)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_KerberosSettingData Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.KerberosSettingData.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('ManagementPresenceRemoteSAP Tests', () => {
    it('should return a valid amt_ManagementPresenceRemoteSAP Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_ManagementPresenceRemoteSAP ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_ManagementPresenceRemoteSAP Delete wsman message', () => {
      const selector: Selector = { name: 'Name', value: 'Intel(r) AMT:Management Presence Server 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">Intel(r) AMT:Management Presence Server 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.ManagementPresenceRemoteSAP.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('MessageLog Tests', () => {
    it('should return a valid amt_MessageLog Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.MessageLog.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.MessageLog.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_MessageLog Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.MessageLog.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog PositionToFirstRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:PositionToFirstRecord_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog" /></Body></Envelope>`
      const response = amtClass.MessageLog.PositionToFirstRecord()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog GetRecords wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"><h:IterationIdentifier>1</h:IterationIdentifier><h:MaxReadRecords>390</h:MaxReadRecords></h:GetRecords_INPUT></Body></Envelope>`
      const response = amtClass.MessageLog.GetRecords(1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MessageLog GetRecords wsman message even if identifier is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetRecords_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog"><h:IterationIdentifier>1</h:IterationIdentifier><h:MaxReadRecords>390</h:MaxReadRecords></h:GetRecords_INPUT></Body></Envelope>`
      const response = amtClass.MessageLog.GetRecords()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('MPSUsernamePassword Tests', () => {
    it('should return a valid amt_MPSUsernamePassword Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MPSUsernamePassword Enumerate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MPSUsernamePassword Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.MPSUsernamePassword.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_MPSUsernamePassword Put wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_MPSUsernamePassword xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MPSUsernamePassword"><h:InstanceID>test</h:InstanceID><h:Secret>test</h:Secret><h:RemoteID>test</h:RemoteID></h:AMT_MPSUsernamePassword></Body></Envelope>`
      const mpsUsernamePassword: Models.MPSUsernamePassword = {
        InstanceID: 'test',
        Secret: 'test',
        RemoteID: 'test'
      }
      const response = amtClass.MPSUsernamePassword.Put(mpsUsernamePassword)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('PublicKeyCertificate Tests', () => {
    it('should return a valid amt_PublicKeyCertificate Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyCertificate ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyCertificate Delete wsman message', () => {
      const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Certificate: Handle: 0' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle: 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyCertificate.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('PublicKeyManagementService Tests', () => {
    it('should return a valid amt_PublicKeyManagementService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_PublicKeyManagementService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService AddTrustedRootCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddTrustedRootCertificate_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:CertificateBlob>${trustedRootCert}</h:CertificateBlob></h:AddTrustedRootCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService.AddTrustedRootCertificate({ CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService GenerateKeyPair wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GenerateKeyPair_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:KeyAlgorithm>0</h:KeyAlgorithm><h:KeyLength>2048</h:KeyLength></h:GenerateKeyPair_INPUT></Body></Envelope>`
      const keyPairParameters: Models.GenerateKeyPairParameters = {
        KeyAlgorithm: 0,
        KeyLength: 2048
      }
      const response = amtClass.PublicKeyManagementService.GenerateKeyPair(keyPairParameters)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService AddCertificate wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddCertificate_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:CertificateBlob>${trustedRootCert}</h:CertificateBlob></h:AddCertificate_INPUT></Body></Envelope>`
      const response = amtClass.PublicKeyManagementService.AddCertificate({ CertificateBlob: trustedRootCert })
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_PublicKeyManagementService GeneratePKCS10RequestEx wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GeneratePKCS10RequestEx</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GeneratePKCS10RequestEx_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><h:KeyPair>test</h:KeyPair><h:NullSignedCertificateRequest>reallylongcertificateteststring</h:NullSignedCertificateRequest><h:SigningAlgorithm>1</h:SigningAlgorithm></h:GeneratePKCS10RequestEx_INPUT></Body></Envelope>`
      const pkcs10Request: Models.PKCS10Request = {
        KeyPair: 'test',
        NullSignedCertificateRequest: 'reallylongcertificateteststring',
        SigningAlgorithm: 1
      }
      const response = amtClass.PublicKeyManagementService.GeneratePKCS10RequestEx(pkcs10Request)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('PublicPrivateKeyPair Tests', () => {
    const selector: Selector = {
      name: 'InstanceID',
      value: 'Intel(r) AMT Key: Handle: 0'
    }
    it('should return a valid PublicPrivateKeyPair Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid PublicPrivateKeyPair ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid PublicPrivateKeyPair Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid PublicPrivateKeyPair DELETE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicPrivateKeyPair</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Key: Handle: 0</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.PublicPrivateKeyPair.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('RedirectionService Tests', () => {
    it('should return a valid amt_RedirectionService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RedirectionService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RedirectionService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RedirectionService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RedirectionService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RedirectionService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData Put wsman message', () => {
      const test: Models.RedirectionService = {
        Name: 'test',
        CreationClassName: 'test',
        SystemName: 'test',
        SystemCreationClassName: 'test',
        AccessLog: 'test',
        ElementName: 'test',
        EnabledState: 32768,
        ListenerEnabled: true
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_RedirectionService xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><h:Name>test</h:Name><h:CreationClassName>test</h:CreationClassName><h:SystemName>test</h:SystemName><h:SystemCreationClassName>test</h:SystemCreationClassName><h:AccessLog>test</h:AccessLog><h:ElementName>test</h:ElementName><h:EnabledState>32768</h:EnabledState><h:ListenerEnabled>true</h:ListenerEnabled></h:AMT_RedirectionService></Body></Envelope>`
      const response = amtClass.RedirectionService.Put(test)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_BootSettingData REQUEST_STATE_CHANGE wsman message', () => {
      const requestedState = 32771
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:RequestStateChange_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RedirectionService"><h:RequestedState>32771</h:RequestedState></h:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.RedirectionService.RequestStateChange(requestedState)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('RemoteAccessPolicyAppliesToMPS Tests', () => {
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS DELETE wsman message', () => {
      const selector: Selector = {
        name: 'Name',
        value: 'Instance'
      }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">Instance</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyAppliesToMPS GET wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyAppliesToMPS PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyAppliesToMPS</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>AC070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Pull(enumerationContext)
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
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Put(remoteAccessPolicyAppliesToMPS)
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
      const response = amtClass.RemoteAccessPolicyAppliesToMPS.Create(remoteAccessPolicyAppliesToMPS)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('RemoteAccessPolicyRule Tests', () => {
    it('should return a valid amt_RemoteAccessPolicyRule Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessPolicyRule ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyRule Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessPolicyRule Delete wsman message', () => {
      const selector: Selector = { name: 'PolicyRuleName', value: 'User Initiated' }
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessPolicyRule.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('RemoteAccessService Tests', () => {
    it('should return a valid amt_RemoteAccessService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.RemoteAccessService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.RemoteAccessService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_RemoteAccessService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.RemoteAccessService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_RemoteAccessService addMpsServer wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddMpServer_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><h:AccessInfo>${mpsServer.AccessInfo}</h:AccessInfo><h:InfoFormat>${mpsServer.InfoFormat}</h:InfoFormat><h:Port>${mpsServer.Port}</h:Port><h:AuthMethod>${mpsServer.AuthMethod}</h:AuthMethod><h:Username>${mpsServer.Username}</h:Username><h:Password>${mpsServer.Password}</h:Password><h:CN>${mpsServer.CommonName}</h:CN></h:AddMpServer_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService.AddMPS(mpsServer)
      expect(response).toEqual(correctResponse)
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
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddRemoteAccessPolicyRule_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><h:Trigger>${remoteAccessPolicyRule.Trigger}</h:Trigger><h:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</h:TunnelLifeTime><h:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</h:ExtendedData><h:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></h:MpServer></h:AddRemoteAccessPolicyRule_INPUT></Body></Envelope>`
      const response = amtClass.RemoteAccessService.AddRemoteAccessPolicyRule(remoteAccessPolicyRule, selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('SetupAndConfigurationService Tests', () => {
    it('should return a valid amt_SetupAndConfigurationService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService GetUuid wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/GetUuid</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetUuid_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"></h:GetUuid_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.GetUuid()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_SetupAndConfigurationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService SetMEBxPassword wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetMEBxPassword_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><h:Password>P@ssw0rd</h:Password></h:SetMEBxPassword_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.SetMEBXPassword('P@ssw0rd')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService Unprovision wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:Unprovision_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><h:ProvisioningMode>1</h:ProvisioningMode></h:Unprovision_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.Unprovision(1)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService Unprovision wsman message even if provisioningMode is undefined', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:Unprovision_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"><h:ProvisioningMode>1</h:ProvisioningMode></h:Unprovision_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.Unprovision()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_SetupAndConfigurationService COMMIT_CHANGES wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:CommitChanges_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService"></h:CommitChanges_INPUT></Body></Envelope>`
      const response = amtClass.SetupAndConfigurationService.CommitChanges()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('TimeSynchronizationService Tests', () => {
    it('should return a valid amt_TimeSynchronizationService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_TimeSynchronizationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService GET_LOW_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:GetLowAccuracyTimeSynch_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService"></h:GetLowAccuracyTimeSynch_INPUT></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService.GetLowAccuracyTimeSynch()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_TimeSynchronizationService SET_HIGH_ACCURACY_TIME_SYNCH wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:SetHighAccuracyTimeSynch_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService"><h:Ta0>1644240911</h:Ta0><h:Tm1>1644240943</h:Tm1><h:Tm2>1644240943</h:Tm2></h:SetHighAccuracyTimeSynch_INPUT></Body></Envelope>`
      const response = amtClass.TimeSynchronizationService.SetHighAccuracyTimeSynch(1644240911, 1644240943, 1644240943)
      expect(response).toEqual(correctResponse)
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
      const response = amtClass.TLSCredentialContext.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext CREATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Create</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AMT_TLSCredentialContext xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext"><h:ElementInContext><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle 1</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementInContext><h:ElementProvidingContext><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSProtocolEndpointCollection</w:ResourceURI><w:SelectorSet><w:Selector Name="ElementName">TLSProtocolEndpointInstances Collection</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementProvidingContext></h:AMT_TLSCredentialContext></Body></Envelope>`
      const response = amtClass.TLSCredentialContext.Create('Intel(r) AMT Certificate: Handle 1')
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSCredentialContext.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid TLSCredentialContext Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TLSCredentialContext.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSCredentialContext DELETE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSCredentialContext</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Certificate: Handle: 1</w:Selector></w:SelectorSet></Header><Body></Body></Envelope>`
      const response = amtClass.TLSCredentialContext.Delete(selector)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('TLSSettingData Tests', () => {
    it('should return a valid TLSSettingData Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.TLSSettingData.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData PUT wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">test</w:Selector></w:SelectorSet></Header><Body><h:AMT_TLSSettingData xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData"><h:AcceptNonSecureConnections>false</h:AcceptNonSecureConnections><h:Enabled>true</h:Enabled><h:MutualAuthentication>false</h:MutualAuthentication><h:NonSecureConnectionsSupported>false</h:NonSecureConnectionsSupported><h:TrustedCN>test</h:TrustedCN><h:ElementName>test</h:ElementName><h:InstanceID>test</h:InstanceID></h:AMT_TLSSettingData></Body></Envelope>`
      const tlsSettingData: Models.TLSSettingData = {
        AcceptNonSecureConnections: false,
        Enabled: true,
        MutualAuthentication: false,
        NonSecureConnectionsSupported: false,
        TrustedCN: 'test',
        ElementName: 'test',
        InstanceID: 'test'
      }
      const response = amtClass.TLSSettingData.Put(tlsSettingData)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData PULL wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.TLSSettingData.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid TLSSettingData ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TLSSettingData</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.TLSSettingData.Enumerate()
      expect(response).toEqual(correctResponse)
    })
  })
  describe('UserInitiatedConnectionService Tests', () => {
    it('should return a valid amt_UserInitiatedConnectionService Get wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_UserInitiatedConnectionService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_UserInitiatedConnectionService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_UserInitiatedConnectionService AddTrustedRootCertificate wsman message', () => {
      const requestedState = 32771
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:RequestStateChange_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService"><h:RequestedState>${requestedState}</h:RequestedState></h:RequestStateChange_INPUT></Body></Envelope>`
      const response = amtClass.UserInitiatedConnectionService.RequestStateChange(requestedState)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('WiFiPortConfigurationService Tests', () => {
    let selector: Selector
    let wifiEndpointSettings: CIM.Models.WiFiEndpointSettings
    let ieee8021xSettingsInput: CIM.Models.IEEE8021xSettings
    let clientCredential: string, caCredential: string
    beforeEach(() => {
      selector = {
        name: 'Name',
        value: 'WiFi Endpoint 0'
      }
      wifiEndpointSettings = {
        ElementName: 'home',
        InstanceID: 'Intel(r) AMT:WiFi Endpoint Settings home',
        AuthenticationMethod: 6,
        EncryptionMethod: 4,
        SSID: 'admin',
        Priority: 1,
        PSKPassPhrase: 'p\'ass<>&"code'
      }
      ieee8021xSettingsInput = {
        ElementName: 'wifi_8021x_profile',
        AuthenticationProtocol: 0
      }
      clientCredential = 'handle 0'
      caCredential = 'handle 1'
    })
    it('should return a valid amt_WiFiPortConfigurationService ADD_WIFI_SETTINGS wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><h:AddWiFiSettings_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><h:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet></a:ReferenceParameters></h:WiFiEndpoint><h:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>${wifiEndpointSettings.ElementName}</q:ElementName><q:InstanceID>${wifiEndpointSettings.InstanceID}</q:InstanceID><q:AuthenticationMethod>${wifiEndpointSettings.AuthenticationMethod}</q:AuthenticationMethod><q:EncryptionMethod>${wifiEndpointSettings.EncryptionMethod}</q:EncryptionMethod><q:SSID>${wifiEndpointSettings.SSID}</q:SSID><q:Priority>${wifiEndpointSettings.Priority}</q:Priority><q:PSKPassPhrase>p&apos;ass&lt;&gt;&amp;&quot;code</q:PSKPassPhrase></h:WiFiEndpointSettingsInput></h:AddWiFiSettings_INPUT></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.AddWiFiSettings(wifiEndpointSettings, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService ADD_WIFI_SETTINGS with 802.1x wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:AddWiFiSettings_INPUT xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><h:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="Name">WiFi Endpoint 0</w:Selector></w:SelectorSet></a:ReferenceParameters></h:WiFiEndpoint><h:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>home</q:ElementName><q:InstanceID>Intel(r) AMT:WiFi Endpoint Settings home</q:InstanceID><q:AuthenticationMethod>6</q:AuthenticationMethod><q:EncryptionMethod>4</q:EncryptionMethod><q:SSID>admin</q:SSID><q:Priority>1</q:Priority><q:PSKPassPhrase>p&apos;ass&lt;&gt;&amp;&quot;code</q:PSKPassPhrase></h:WiFiEndpointSettingsInput><h:IEEE8021xSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_IEEE8021xSettings"><q:ElementName>wifi_8021x_profile</q:ElementName><q:AuthenticationProtocol>0</q:AuthenticationProtocol></h:IEEE8021xSettingsInput><h:ClientCredential><a:Address>default</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><w:SelectorSet><w:Selector Name="InstanceID">handle 0</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ClientCredential><h:CACredential><a:Address>default</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate</w:ResourceURI><w:SelectorSet><w:Selector Name="InstanceID">handle 1</w:Selector></w:SelectorSet></a:ReferenceParameters></h:CACredential></h:AddWiFiSettings_INPUT></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.AddWiFiSettings(wifiEndpointSettings, selector, ieee8021xSettingsInput, clientCredential, caCredential)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService PUT message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout><w:SelectorSet><w:Selector Name="Name">WiFi Endpoint 0</w:Selector></w:SelectorSet></Header><Body><h:AMT_WiFiPortConfigurationService xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><h:localProfileSynchronizationEnabled>1</h:localProfileSynchronizationEnabled></h:AMT_WiFiPortConfigurationService></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.Put({ localProfileSynchronizationEnabled: 1 } as any, selector)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService GET message ', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.Get()
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid amt_WiFiPortConfigurationService ENUMERATE wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.Enumerate()
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid amt_WiFiPortConfigurationService Pull wsman message', () => {
      const correctResponse = `${xmlHeader}${envelope}http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService</w:ResourceURI><a:MessageID>${(messageId++).toString()}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>${operationTimeout}</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const response = amtClass.WiFiPortConfigurationService.Pull(enumerationContext)
      expect(response).toEqual(correctResponse)
    })
  })
})
