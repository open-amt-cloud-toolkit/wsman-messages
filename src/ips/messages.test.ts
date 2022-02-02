/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Messages } from './messages'
import { Methods } from './methods'
import { WSManErrors } from '../WSMan'
import { IPS_OptInService, IPS_OptInServiceResponse } from '../models/ips_models'

const ipsClass = new Messages()
const castedIPSClass = new Messages() as any

describe('IPS Tests', () => {
  const messageId = '1'
  const adminPassEncryptionType = 2
  const adminPassword = 'bebb3497d69b544c732651365cc3462d'
  const mcNonce = 'ZxxE0cFy590zDBIR39q6QU6iuII='
  const signingAlgorithm = 2
  const digitalSignature = 'T0NvoR7RUkOpVULIcNL0VhpEK5rO3j5/TBpN82q1YgPM5sRBxqymu7fKBgAGGN49oD8xsqW4X0SWxjuB3q/TLHjNJJNxoHHlXZnb77HTwfXHp59E/TM10UvOX96qEgKU5Mp+8/IE9LnYxC1ajQostSRA/X+HA5F6kRctLiCK+ViWUCk4sAtPzHhhHSTB/98KDWuacPepScSpref532hpD2/g43nD3Wg0SjmOMExPLMMnijWE9KDkxE00+Bos28DD3Yclj4BMhkoXDw6k4EcTWKbGhtF/9meXXmSPwRmXEaWe8COIDrQks1mpyLblYu8yHHnUjhssdcCQHtAOu7t0RA=='
  describe('ips_OptInService Tests', () => {
    it('should create a valid ips_OptInService Get wsman message', () => {
      const response = ipsClass.OptInService(Methods.GET, messageId)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should return null if messageId in ips_OptInService is missing', () => {
      expect(() => { ipsClass.OptInService(Methods.GET, null) }).toThrow(WSManErrors.MESSAGE_ID)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.OptInService(Methods.REQUEST_POWER_STATE_CHANGE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
    it('should create a valid ips_OptInService Put wsman message', () => {
      const data: IPS_OptInServiceResponse = {
        IPS_OptInService: {
          OptInCodeTimeout: 300
        }
      }
      const response = ipsClass.OptInService(Methods.PUT, messageId, null, data)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:IPS_OptInService xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService"><r:OptInCodeTimeout>300</r:OptInCodeTimeout></r:IPS_OptInService></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_StartOptIn wsman message', () => {
      const response = ipsClass.OptInService(Methods.START_OPT_IN, messageId)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:StartOptIn_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_SendOptInCode wsman message', () => {
      const code = 1
      const response = ipsClass.OptInService(Methods.SEND_OPT_IN_CODE, messageId, code)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:SendOptInCode_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService"><r:OptInCode>1</r:OptInCode></r:SendOptInCode_INPUT></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_CancelOptIn wsman message', () => {
      const response = ipsClass.OptInService(Methods.CANCEL_OPT_IN, messageId)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:CancelOptIn_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
  })
  describe('ips_HostBasedSetupService Tests', () => {
    it('should return a valid ips_HostBasedSetupService Get wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.GET, messageId)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Setup wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:Setup_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><r:NetAdminPassEncryptionType>2</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>bebb3497d69b544c732651365cc3462d</r:NetworkAdminPassword></r:Setup_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.SETUP, messageId, adminPassEncryptionType, adminPassword)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Admin Setup wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AdminSetup</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:AdminSetup_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><r:NetAdminPassEncryptionType>2</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>bebb3497d69b544c732651365cc3462d</r:NetworkAdminPassword><r:McNonce>ZxxE0cFy590zDBIR39q6QU6iuII=</r:McNonce><r:SigningAlgorithm>2</r:SigningAlgorithm><r:DigitalSignature>T0NvoR7RUkOpVULIcNL0VhpEK5rO3j5/TBpN82q1YgPM5sRBxqymu7fKBgAGGN49oD8xsqW4X0SWxjuB3q/TLHjNJJNxoHHlXZnb77HTwfXHp59E/TM10UvOX96qEgKU5Mp+8/IE9LnYxC1ajQostSRA/X+HA5F6kRctLiCK+ViWUCk4sAtPzHhhHSTB/98KDWuacPepScSpref532hpD2/g43nD3Wg0SjmOMExPLMMnijWE9KDkxE00+Bos28DD3Yclj4BMhkoXDw6k4EcTWKbGhtF/9meXXmSPwRmXEaWe8COIDrQks1mpyLblYu8yHHnUjhssdcCQHtAOu7t0RA==</r:DigitalSignature></r:AdminSetup_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, messageId, adminPassEncryptionType, adminPassword, mcNonce, signingAlgorithm, digitalSignature)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Add Next Cert in Chain wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AddNextCertInChain</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><r:AddNextCertInChain_INPUT xmlns:r="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><r:NextCertificate>ExampleCertificate</r:NextCertificate><r:IsLeafCertificate>true</r:IsLeafCertificate><r:IsRootCertificate>false</r:IsRootCertificate></r:AddNextCertInChain_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.ADD_NEXT_CERT_IN_CHAIN, messageId, null, null, null, null, null, 'ExampleCertificate', true, false)
      expect(response).toEqual(correctResponse)
    })
    it('should return null if adminPassEncryptionType in ips_HostBasedSetupService Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.SETUP, messageId, null, adminPassword) }).toThrow(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE)
    })
    it('should return null if adminPassword in ips_HostBasedSetupService Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.SETUP, messageId, adminPassEncryptionType, null) }).toThrow(WSManErrors.ADMIN_PASSWORD)
    })
    it('should return null if adminPassEncryptionType in ips_HostBasedSetupService Admin Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, messageId, null, adminPassword) }).toThrow(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE)
    })
    it('should return null if adminPassword in ips_HostBasedSetupService Admin Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, messageId, adminPassEncryptionType, null) }).toThrow(WSManErrors.ADMIN_PASSWORD)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.HostBasedSetupService(Methods.REQUEST_POWER_STATE_CHANGE, messageId) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
