/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Messages } from './messages'
import { Methods } from './methods'
import { WSManErrors } from '../WSMan'
import { IPS_OptInServiceResponse } from '../models/ips_models'

const ipsClass = new Messages()
const castedIPSClass = new Messages() as any

describe('IPS Tests', () => {
  const adminPassEncryptionType = 2
  const adminPassword = 'bebb3497d69b544c732651365cc3462d'
  const mcNonce = 'ZxxE0cFy590zDBIR39q6QU6iuII='
  const signingAlgorithm = 2
  const digitalSignature = 'T0NvoR7RUkOpVULIcNL0VhpEK5rO3j5/TBpN82q1YgPM5sRBxqymu7fKBgAGGN49oD8xsqW4X0SWxjuB3q/TLHjNJJNxoHHlXZnb77HTwfXHp59E/TM10UvOX96qEgKU5Mp+8/IE9LnYxC1ajQostSRA/X+HA5F6kRctLiCK+ViWUCk4sAtPzHhhHSTB/98KDWuacPepScSpref532hpD2/g43nD3Wg0SjmOMExPLMMnijWE9KDkxE00+Bos28DD3Yclj4BMhkoXDw6k4EcTWKbGhtF/9meXXmSPwRmXEaWe8COIDrQks1mpyLblYu8yHHnUjhssdcCQHtAOu7t0RA=='
  describe('ips_OptInService Tests', () => {
    it('should create a valid ips_OptInService Get wsman message', () => {
      const response = ipsClass.OptInService(Methods.GET)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.OptInService(Methods.REQUEST_POWER_STATE_CHANGE) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
    it('should create a valid ips_OptInService Put wsman message', () => {
      const data: IPS_OptInServiceResponse = {
        IPS_OptInService: {
          OptInCodeTimeout: 300
        }
      }
      const response = ipsClass.OptInService(Methods.PUT, null, data)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:IPS_OptInService xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService"><h:OptInCodeTimeout>300</h:OptInCodeTimeout></h:IPS_OptInService></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_StartOptIn wsman message', () => {
      const response = ipsClass.OptInService(Methods.START_OPT_IN)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>2</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:StartOptIn_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_SendOptInCode wsman message', () => {
      const code = 1
      const response = ipsClass.OptInService(Methods.SEND_OPT_IN_CODE, code)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>3</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:SendOptInCode_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService"><h:OptInCode>1</h:OptInCode></h:SendOptInCode_INPUT></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid ips_CancelOptIn wsman message', () => {
      const response = ipsClass.OptInService(Methods.CANCEL_OPT_IN)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService</w:ResourceURI><a:MessageID>4</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:CancelOptIn_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
  })
  describe('ips_HostBasedSetupService Tests', () => {
    it('should return a valid ips_HostBasedSetupService Get wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>5</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.GET)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Setup wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>6</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:Setup_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><h:NetAdminPassEncryptionType>2</h:NetAdminPassEncryptionType><h:NetworkAdminPassword>bebb3497d69b544c732651365cc3462d</h:NetworkAdminPassword></h:Setup_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.SETUP, adminPassEncryptionType, adminPassword)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Admin Setup wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AdminSetup</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>7</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:AdminSetup_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><h:NetAdminPassEncryptionType>2</h:NetAdminPassEncryptionType><h:NetworkAdminPassword>bebb3497d69b544c732651365cc3462d</h:NetworkAdminPassword><h:McNonce>ZxxE0cFy590zDBIR39q6QU6iuII=</h:McNonce><h:SigningAlgorithm>2</h:SigningAlgorithm><h:DigitalSignature>T0NvoR7RUkOpVULIcNL0VhpEK5rO3j5/TBpN82q1YgPM5sRBxqymu7fKBgAGGN49oD8xsqW4X0SWxjuB3q/TLHjNJJNxoHHlXZnb77HTwfXHp59E/TM10UvOX96qEgKU5Mp+8/IE9LnYxC1ajQostSRA/X+HA5F6kRctLiCK+ViWUCk4sAtPzHhhHSTB/98KDWuacPepScSpref532hpD2/g43nD3Wg0SjmOMExPLMMnijWE9KDkxE00+Bos28DD3Yclj4BMhkoXDw6k4EcTWKbGhtF/9meXXmSPwRmXEaWe8COIDrQks1mpyLblYu8yHHnUjhssdcCQHtAOu7t0RA==</h:DigitalSignature></h:AdminSetup_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, adminPassEncryptionType, adminPassword, mcNonce, signingAlgorithm, digitalSignature)
      expect(response).toEqual(correctResponse)
    })
    it('should return a valid ips_HostBasedSetupService Add Next Cert in Chain wsman message', () => {
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AddNextCertInChain</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService</w:ResourceURI><a:MessageID>8</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><h:AddNextCertInChain_INPUT xmlns:h="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService"><h:NextCertificate>ExampleCertificate</h:NextCertificate><h:IsLeafCertificate>true</h:IsLeafCertificate><h:IsRootCertificate>false</h:IsRootCertificate></h:AddNextCertInChain_INPUT></Body></Envelope>'
      const response = ipsClass.HostBasedSetupService(Methods.ADD_NEXT_CERT_IN_CHAIN, null, null, null, null, null, 'ExampleCertificate', true, false)
      expect(response).toEqual(correctResponse)
    })
    it('should return null if adminPassEncryptionType in ips_HostBasedSetupService Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.SETUP, null, adminPassword) }).toThrow(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE)
    })
    it('should return null if adminPassword in ips_HostBasedSetupService Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.SETUP, adminPassEncryptionType, null) }).toThrow(WSManErrors.ADMIN_PASSWORD)
    })
    it('should return null if adminPassEncryptionType in ips_HostBasedSetupService Admin Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, null, adminPassword) }).toThrow(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE)
    })
    it('should return null if adminPassword in ips_HostBasedSetupService Admin Setup is missing', () => {
      expect(() => { ipsClass.HostBasedSetupService(Methods.ADMIN_SETUP, adminPassEncryptionType, null) }).toThrow(WSManErrors.ADMIN_PASSWORD)
    })
    it('should throw error if an unsupported method is called', () => {
      expect(() => { castedIPSClass.HostBasedSetupService(Methods.REQUEST_POWER_STATE_CHANGE) }).toThrow(WSManErrors.UNSUPPORTED_METHOD)
    })
  })
})
