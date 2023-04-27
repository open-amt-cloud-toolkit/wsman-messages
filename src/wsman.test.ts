/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator, BaseActions } from './WSMan'
import { CIM, AMT } from './index'
import type { Selector } from './WSMan'

const wsmanMessageCreator = new WSManMessageCreator('http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/')
describe('WSManMessageCreator Tests', () => {
  const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Device 0' }
  let messageId = 0
  const enumerationContext = 'A4070000-0000-0000-0000-000000000000'
  describe('createXml Tests', () => {
    it('creates an enumerate wsman string when provided a header and body to createXml', () => {
      const header = wsmanMessageCreator.createHeader(BaseActions.ENUMERATE, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT)
      const body = wsmanMessageCreator.createCommonBody.Enumerate()
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      expect(response).toEqual(correctResponse)
    })
    it('creates a pull wsman string when provided a header and body to createXml', () => {
      const header = wsmanMessageCreator.createHeader(BaseActions.PULL, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT)
      const body = wsmanMessageCreator.createCommonBody.Pull('A4070000-0000-0000-0000-000000000000')
      const response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      expect(response).toEqual(correctResponse)
    })
  })
  describe('createHeader Tests', () => {
    it('creates a correct header with action, resourceUri, and messageId provided for createHeader', () => {
      const correctHeader = `<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>`
      const header = wsmanMessageCreator.createHeader(BaseActions.ENUMERATE, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT)
      expect(header).toEqual(correctHeader)
    })
    it('applies custom address correctly in createHeader', () => {
      const correctHeader = `<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>`
      const header = wsmanMessageCreator.createHeader(BaseActions.ENUMERATE, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT, undefined, 'customAddress')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom timeout correctly in createHeader', () => {
      const correctHeader = `<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>`
      const header = wsmanMessageCreator.createHeader(BaseActions.ENUMERATE, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT, undefined, undefined, 'PT30S')
      expect(header).toEqual(correctHeader)
    })
    it('applies custom selector correctly in createHeader', () => {
      const correctHeader = `<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>${messageId++}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Device 0</w:Selector></w:SelectorSet></Header>`
      const header = wsmanMessageCreator.createHeader(BaseActions.ENUMERATE, CIM.Classes.SERVICE_AVAILABLE_TO_ELEMENT, selector, undefined, 'PT30S')
      expect(header).toEqual(correctHeader)
    })
  })
  describe('createSelector Tests', () => {
    it('creates a correct SelectorSet string when a simple name value pair is provided', () => {
      const selectorSet = {
        name: 'name',
        value: 'value'
      }
      const correctString = `<w:SelectorSet><w:Selector Name="${selectorSet.name}">${selectorSet.value}</w:Selector></w:SelectorSet>`
      const result = wsmanMessageCreator.createSelector(selectorSet)
      expect(result).toEqual(correctString)
    })
    it('creates a correct SelectorSet string when selectorSet is complex', () => {
      const selectorSet = {
        test: {
          ReferenceParameters: {
            ResourceURI: 'ResourceURI',
            SelectorSet: {
              Selector: {
                $: {
                  Name: 'name'
                },
                _: 'InstanceID'
              }
            }
          },
          Address: 'address'
        }
      }
      const correctString = '<w:SelectorSet><w:Selector Name="test"><a:EndpointReference><a:Address>address</a:Address><a:ReferenceParameters><w:ResourceURI>ResourceURI</w:ResourceURI><w:SelectorSet><w:Selector Name="name">InstanceID</w:Selector></w:SelectorSet></a:ReferenceParameters></a:EndpointReference></w:Selector></w:SelectorSet>'
      const result = wsmanMessageCreator.createSelector(selectorSet)
      expect(result).toEqual(correctString)
    })
  })
  describe('createCommonBody Tests', () => {
    it('creates correct Pull body ', () => {
      const correctBody = `<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>`
      const body = wsmanMessageCreator.createCommonBody.Pull(enumerationContext)
      expect(body).toEqual(correctBody)
    })
    it('creates correct Enumerate body ', () => {
      const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      const body = wsmanMessageCreator.createCommonBody.Enumerate()
      expect(body).toEqual(correctBody)
    })
    it('creates correct Get body ', () => {
      const correctBody = '<Body></Body>'
      const body = wsmanMessageCreator.createCommonBody.Get()
      expect(body).toEqual(correctBody)
    })
    it('creates correct Delete body ', () => {
      const correctBody = '<Body></Body>'
      const body = wsmanMessageCreator.createCommonBody.Delete()
      expect(body).toEqual(correctBody)
    })
  })
  describe('createBody Tests', () => {
    it('should convert obj to XML with object test values', () => {
      const result = wsmanMessageCreator.createBody('testMethod', 'testUri', { testXmlns: 'test' })
      expect(result).toBe('<Body><h:testMethod xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/testUri"><h:testXmlns>test</h:testXmlns></h:testMethod></Body>')
    })
    it('should convert obj to XML with array test values', () => {
      const result = wsmanMessageCreator.createBody('testMethod', 'testUri', [{ testXmlns: 'test' }])
      expect(result).toBe('<Body><h:testMethod xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/testUri"><h:testXmlns>test</h:testXmlns></h:testMethod></Body>')
    })
    it('should convert obj to XML with not empty', () => {
      const result = wsmanMessageCreator.createBody('test_INPUT', 'example', [{
        AMTNetworkEnabled: '1',
        DDNSPeriodicUpdateInterval: '1440',
        DDNSTTL: '900'
      }])
      expect(result).toBe('<Body><h:test_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/example"><h:AMTNetworkEnabled>1</h:AMTNetworkEnabled><h:DDNSPeriodicUpdateInterval>1440</h:DDNSPeriodicUpdateInterval><h:DDNSTTL>900</h:DDNSTTL></h:test_INPUT></Body>')
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
      const result = wsmanMessageCreator.createBody('test_INPUT', key, [data[key]])
      expect(result).toBe('<Body><h:test_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/AMT_GeneralSettings"><h:AMTNetworkEnabled>1</h:AMTNetworkEnabled><h:DDNSPeriodicUpdateInterval>1440</h:DDNSPeriodicUpdateInterval><h:DDNSTTL>900</h:DDNSTTL></h:test_INPUT></Body>')
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
      const result = wsmanMessageCreator.createBody('test_INPUT', key, [data[key]])
      expect(result).toBe('<Body><h:test_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/AMT_GeneralSettings"><h:AMTNetworkEnabled>1</h:AMTNetworkEnabled><h:DDNSPeriodicUpdateInterval>1440</h:DDNSPeriodicUpdateInterval><h:DDNSTTL>900</h:DDNSTTL><h:Settings><h:Set1>1</h:Set1><h:Set2>7</h:Set2><h:Set3>8</h:Set3></h:Settings></h:test_INPUT></Body>')
    })
    it('should convert obj to XML with data that includes Selector array', () => {
      const data = {
        ManagedElement: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_ManagementPresenceRemoteSAP',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT:Management Presence Server 0',
                  $: {
                    Name: 'Name'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        },
        MpsType: 0,
        OrderOfAccess: 0,
        PolicySet: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_RemoteAccessPolicyRule',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Periodic',
                  $: {
                    Name: 'PolicyRuleName'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        }
      }
      const result = wsmanMessageCreator.createBody('AMT_RemoteAccessPolicyAppliesToMPS', 'AMT_RemoteAccessPolicyAppliesToMPS', [data])
      expect(result).toBe('<Body><h:AMT_RemoteAccessPolicyAppliesToMPS xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/AMT_RemoteAccessPolicyAppliesToMPS"><h:ManagedElement><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><w:SelectorSet><w:Selector Name="CreationClassName">AMT_ManagementPresenceRemoteSAP</w:Selector><w:Selector Name="Name">Intel(r) AMT:Management Presence Server 0</w:Selector><w:Selector Name="SystemCreationClassName">CIM_ComputerSystem</w:Selector><w:Selector Name="SystemName">Intel(r) AMT</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ManagedElement><h:MpsType>0</h:MpsType><h:OrderOfAccess>0</h:OrderOfAccess><h:PolicySet><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><w:SelectorSet><w:Selector Name="CreationClassName">AMT_RemoteAccessPolicyRule</w:Selector><w:Selector Name="PolicyRuleName">Periodic</w:Selector><w:Selector Name="SystemCreationClassName">CIM_ComputerSystem</w:Selector><w:Selector Name="SystemName">Intel(r) AMT</w:Selector></w:SelectorSet></a:ReferenceParameters></h:PolicySet></h:AMT_RemoteAccessPolicyAppliesToMPS></Body>')
    })
    it('should create a proper wsman body with a mix of xml properties', () => {
      const data = {
        ManagedElement: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_ManagementPresenceRemoteSAP',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT:Management Presence Server 0',
                  $: {
                    Name: 'Name'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        },
        MpsType: 0,
        OrderOfAccess: 0,
        PolicySet: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_RemoteAccessPolicyRule',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Periodic',
                  $: {
                    Name: 'PolicyRuleName'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        }
      }
      const expectedBody = '<Body><h:AMT_RemoteAccessPolicyAppliesToMPS xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/AMT_RemoteAccessPolicyAppliesToMPS"><h:ManagedElement><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</w:ResourceURI><w:SelectorSet><w:Selector Name="CreationClassName">AMT_ManagementPresenceRemoteSAP</w:Selector><w:Selector Name="Name">Intel(r) AMT:Management Presence Server 0</w:Selector><w:Selector Name="SystemCreationClassName">CIM_ComputerSystem</w:Selector><w:Selector Name="SystemName">Intel(r) AMT</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ManagedElement><h:MpsType>0</h:MpsType><h:OrderOfAccess>0</h:OrderOfAccess><h:PolicySet><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address><a:ReferenceParameters><w:ResourceURI>http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule</w:ResourceURI><w:SelectorSet><w:Selector Name="CreationClassName">AMT_RemoteAccessPolicyRule</w:Selector><w:Selector Name="PolicyRuleName">Periodic</w:Selector><w:Selector Name="SystemCreationClassName">CIM_ComputerSystem</w:Selector><w:Selector Name="SystemName">Intel(r) AMT</w:Selector></w:SelectorSet></a:ReferenceParameters></h:PolicySet></h:AMT_RemoteAccessPolicyAppliesToMPS></Body>'
      const result = wsmanMessageCreator.createBody(AMT.Classes.REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, AMT.Classes.REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, [data])
      expect(result).toStrictEqual(expectedBody)
    })
  })
  describe('processBody tests', () => {
    it('should update the data with proper prefixes', () => {
      const data = {
        ManagedElement: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_ManagementPresenceRemoteSAP',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT:Management Presence Server 0',
                  $: {
                    Name: 'Name'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        },
        MpsType: 0,
        OrderOfAccess: 0,
        PolicySet: {
          Address: 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule',
            SelectorSet: {
              Selector: [
                {
                  _: 'AMT_RemoteAccessPolicyRule',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Periodic',
                  $: {
                    Name: 'PolicyRuleName'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        }
      }
      const expectedData = {
        'h:ManagedElement': {
          'a:Address': 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          'a:ReferenceParameters': {
            'w:ResourceURI': 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP',
            'w:SelectorSet': {
              'w:Selector': [
                {
                  _: 'AMT_ManagementPresenceRemoteSAP',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT:Management Presence Server 0',
                  $: {
                    Name: 'Name'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        },
        'h:MpsType': 0,
        'h:OrderOfAccess': 0,
        'h:PolicySet': {
          'a:Address': 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous',
          'a:ReferenceParameters': {
            'w:ResourceURI': 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessPolicyRule',
            'w:SelectorSet': {
              'w:Selector': [
                {
                  _: 'AMT_RemoteAccessPolicyRule',
                  $: {
                    Name: 'CreationClassName'
                  }
                },
                {
                  _: 'Periodic',
                  $: {
                    Name: 'PolicyRuleName'
                  }
                },
                {
                  _: 'CIM_ComputerSystem',
                  $: {
                    Name: 'SystemCreationClassName'
                  }
                },
                {
                  _: 'Intel(r) AMT',
                  $: {
                    Name: 'SystemName'
                  }
                }
              ]
            }
          }
        }
      }
      wsmanMessageCreator.processBody(data)
      expect(data).toStrictEqual(expectedData)
    })
  })
  describe('renameKey tests', () => {
    it('should properly rename keys', () => {
      const data = {
        origKey: {
          nestedData: {
            moreData: 'value'
          }
        }
      }
      const modifiedData = {
        'h:origKey': {
          'h:nestedData': {
            'h:moreData': 'value'
          }
        }
      }
      wsmanMessageCreator.prependObjectKey(data, 'origKey', 'h:')
      expect(data).toStrictEqual(modifiedData)
    })
  })
})
