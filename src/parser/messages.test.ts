/*********************************************************************
* Copyright (c) Intel Corporation 2023
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Messages } from './messages'

describe('Messages tests', () => {
  let parseMessages = new Messages()
  beforeEach(() => {
    parseMessages = new Messages()
  })
  describe('parse tests', () => {
    it('should parse a xml PullResponse string into a json object', () => {
      const xml = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://schemas.xmlsoap.org/ws/2004/09/enumeration" xmlns:h="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:RelatesTo>0</b:RelatesTo><b:Action a:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000000515</b:MessageID><c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_GeneralSettings</c:ResourceURI></a:Header><a:Body><g:PullResponse><g:Items><h:AMT_GeneralSettings><h:AMTNetworkEnabled>1</h:AMTNetworkEnabled><h:DDNSPeriodicUpdateInterval>1440</h:DDNSPeriodicUpdateInterval><h:DDNSTTL>900</h:DDNSTTL><h:DDNSUpdateByDHCPServerEnabled>true</h:DDNSUpdateByDHCPServerEnabled><h:DDNSUpdateEnabled>false</h:DDNSUpdateEnabled><h:DHCPv6ConfigurationTimeout>0</h:DHCPv6ConfigurationTimeout><h:DigestRealm>Digest:D0C190414F4F58AAD0D04CD87426A586</h:DigestRealm><h:DomainName></h:DomainName><h:ElementName>Intel(r) AMT: General Settings</h:ElementName><h:HostName></h:HostName><h:HostOSFQDN>Dev_Machine</h:HostOSFQDN><h:IdleWakeTimeout>65535</h:IdleWakeTimeout><h:InstanceID>Intel(r) AMT: General Settings</h:InstanceID><h:NetworkInterfaceEnabled>true</h:NetworkInterfaceEnabled><h:PingResponseEnabled>true</h:PingResponseEnabled><h:PowerSource>0</h:PowerSource><h:PreferredAddressFamily>0</h:PreferredAddressFamily><h:PresenceNotificationInterval>0</h:PresenceNotificationInterval><h:PrivacyLevel>0</h:PrivacyLevel><h:RmcpPingResponseEnabled>true</h:RmcpPingResponseEnabled><h:SharedFQDN>true</h:SharedFQDN><h:WsmanOnlyMode>false</h:WsmanOnlyMode></h:AMT_GeneralSettings></g:Items><g:EndOfSequence></g:EndOfSequence></g:PullResponse></a:Body></a:Envelope>'
      const parsedMessage = parseMessages.parseXML(xml)
      console.log(parsedMessage)
      expect(parsedMessage.class).toBe('AMT_GeneralSettings')
      expect(parsedMessage.action).toBe('PullResponse')
      expect(parsedMessage.error).toBeNull()
    })
    it('should parse a xml Output response string into a json object', () => {
      const xml = '<?xml version="1.0" encoding="UTF-8"?><a:Envelope xmlns:a="http://www.w3.org/2003/05/soap-envelope" xmlns:b="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:c="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:d="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:e="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:f="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:g="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><a:Header><b:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</b:To><b:RelatesTo>0</b:RelatesTo><b:Action a:mustUnderstand="true">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryExResponse</b:Action><b:MessageID>uuid:00000000-8086-8086-8086-000000000516</b:MessageID><c:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService</c:ResourceURI></a:Header><a:Body><g:SetAdminAclEntryEx_OUTPUT><g:ReturnValue>0</g:ReturnValue></g:SetAdminAclEntryEx_OUTPUT></a:Body></a:Envelope>'
      const parsedMessage = parseMessages.parseXML(xml)
      console.log(parsedMessage)
      expect(parsedMessage.class).toBe('AMT_AuthorizationService')
      expect(parsedMessage.action).toBe('SetAdminAclEntryExResponse')
      expect(parsedMessage.error).toBeNull()
    })
  })
})
