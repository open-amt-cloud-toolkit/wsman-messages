/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Base, WSManMessageCreator } from '../WSMan'
import { Classes, Actions } from './'
import type { Types } from './'
import type { Selector } from '../WSMan'

class BIOSElement extends Base {
  className = Classes.BIOS_ELEMENT
}
class BootConfigSetting extends Base {
  className = Classes.BOOT_CONFIG_SETTING
  /**
   * This method is called to change the boot order within a boot configuration.
   * @param source CIM.Models.BootSourceSetting Object
   * @returns string
   */
  ChangeBootOrder = (source: Types.BootConfigSetting.InstanceID): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.CHANGE_BOOT_ORDER, Classes.BOOT_CONFIG_SETTING)
    const body = `<Body><h:ChangeBootOrder_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"><h:Source><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${source}</Selector></SelectorSet></ReferenceParameters></h:Source></h:ChangeBootOrder_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class BootService extends Base {
  className = Classes.BOOT_SERVICE
  /**
   * This method is called to set the role of the BootConfigSetting that is directly or indirectly associated to one or more ComputerSystems. The method applies the new role equally to all related ComputerSystems. If a BootConfigSetting can be related to more than one ComputerSystem, but role modification applies to just one of them, the SetBootConfigUsage method shall be used instead.  The method shall update the IsNext or IsDefault property of every ElementSettingData that directly or indirectly associates BootConfigSetting to a ComputerSystem. The method may also update the IsNext or IsDefault property of other ElementSettingDatas that reference the same ComputerSystems to satisfy cardinality constraints.
   * @param bootSource An existing BootConfigSetting instance whose role will be updated.
   * @param role The desired Role of the BootConfigSetting.
   * @returns string
   */
  SetBootConfigRole = (bootSource: string, role: Types.BootService.Role): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.SET_BOOT_CONFIG_ROLE, Classes.BOOT_SERVICE)
    const body = `<Body><h:SetBootConfigRole_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><h:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${bootSource}</Selector></SelectorSet></ReferenceParameters></h:BootConfigSetting><h:Role>${role}</h:Role></h:SetBootConfigRole_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class BootSourceSetting extends Base { className = Classes.BOOT_SOURCE_SETTING }
class Card extends Base { className = Classes.CARD }
class Chassis extends Base { className = Classes.CHASSIS }
class Chip extends Base { className = Classes.CHIP }
class ComputerSystemPackage extends Base { className = Classes.COMPUTER_SYSTEM_PACKAGE }
class IEEE8021xSettings extends Base { className = Classes.IEEE8021X_SETTINGS }
class KVMRedirectionSAP extends Base {
  className = Classes.KVM_REDIRECTION_SAP
  /**
   * Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @returns string
   */
  RequestStateChange = (requestedState: Types.KVMRedirectionSAP.RequestedStateInputs): string => this.protectedRequestStateChange(`http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/${this.className}/RequestStateChange`, requestedState)
}
class MediaAccessDevice extends Base { className = Classes.MEDIA_ACCESS_DEVICE }
class PhysicalMemory extends Base { className = Classes.PHYSICAL_MEMORY }
class PhysicalPackage extends Base { className = Classes.PHYSICAL_PACKAGE }
class PowerManagementService extends Base {
  className = Classes.POWER_MANAGEMENT_SERVICE
  /**
   * RequestPowerStateChange defines the desired power state of the managed element, and when the element should be put into that state. The RequestPowerStateChange method has five input parameters and a result code.
   * @param powerState The power state for PowerManagementService.
   * @returns string
   */
  RequestPowerStateChange = (powerState: Types.PowerManagementService.PowerState): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.REQUEST_POWER_STATE_CHANGE, Classes.POWER_MANAGEMENT_SERVICE)
    const body = `<Body><h:RequestPowerStateChange_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><h:PowerState>${powerState}</h:PowerState><h:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></h:ManagedElement></h:RequestPowerStateChange_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class Processor extends Base { className = Classes.PROCESSOR }
class ServiceAvailableToElement extends Base { className = Classes.SERVICE_AVAILABLE_TO_ELEMENT }
class SoftwareIdentity extends Base { className = Classes.SOFTWARE_IDENTITY }
class SystemPackaging extends Base { className = Classes.SYSTEM_PACKAGING }
class WiFiEndpointSettings extends Base {
  className = Classes.WIFI_ENDPOINT_SETTINGS
  /**
   * Deletes an instance of WiFiEndpointSettings
   * @param selector Selector Object.
   * @returns string
   */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
}
class WiFiPort extends Base {
  className = Classes.WIFI_PORT
  /**
   * Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @returns string
   */
  RequestStateChange = (requestedState: Types.WiFiPort.RequestedState): string => this.protectedRequestStateChange(`http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/${this.className}/RequestStateChange`, requestedState)
}
export class Messages {
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator(this.resourceUriBase)
  public BIOSElement = new BIOSElement(this.wsmanMessageCreator)
  public BootConfigSetting = new BootConfigSetting(this.wsmanMessageCreator)
  public BootService = new BootService(this.wsmanMessageCreator)
  public BootSourceSetting = new BootSourceSetting(this.wsmanMessageCreator)
  public Card = new Card(this.wsmanMessageCreator)
  public Chassis = new Chassis(this.wsmanMessageCreator)
  public Chip = new Chip(this.wsmanMessageCreator)
  public ComputerSystemPackage = new ComputerSystemPackage(this.wsmanMessageCreator)
  public IEEE8021xSettings = new IEEE8021xSettings(this.wsmanMessageCreator)
  public KVMRedirectionSAP = new KVMRedirectionSAP(this.wsmanMessageCreator)
  public MediaAccessDevice = new MediaAccessDevice(this.wsmanMessageCreator)
  public PhysicalMemory = new PhysicalMemory(this.wsmanMessageCreator)
  public PhysicalPackage = new PhysicalPackage(this.wsmanMessageCreator)
  public PowerManagementService = new PowerManagementService(this.wsmanMessageCreator)
  public Processor = new Processor(this.wsmanMessageCreator)
  public ServiceAvailableToElement = new ServiceAvailableToElement(this.wsmanMessageCreator)
  public SoftwareIdentity = new SoftwareIdentity(this.wsmanMessageCreator)
  public SystemPackaging = new SystemPackaging(this.wsmanMessageCreator)
  public WiFiEndpointSettings = new WiFiEndpointSettings(this.wsmanMessageCreator)
  public WiFiPort = new WiFiPort(this.wsmanMessageCreator)
}
