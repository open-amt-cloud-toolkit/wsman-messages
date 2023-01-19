/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from '../WSMan'
import { REQUEST_STATE_CHANGE } from './actions'
import { Classes, Actions } from './'
import type { Selector } from '../WSMan'
import type { Types } from './'

export class Messages {
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator(this.resourceUriBase)

  private readonly enumerate = (cimClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.ENUMERATE, cimClass)
    const body: string = this.wsmanMessageCreator.createCommonBody.Enumerate()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (cimClass: Classes, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.PULL, cimClass)
    const body: string = this.wsmanMessageCreator.createCommonBody.Pull(enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly get = (cimClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET, cimClass)
    const body: string = this.wsmanMessageCreator.createCommonBody.Get()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (cimClass: Classes, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.DELETE, cimClass, selector)
    const body = this.wsmanMessageCreator.createCommonBody.Delete()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly requestStateChange = (action: string, cimClass: Classes, requestedState: number): string => {
    const header = this.wsmanMessageCreator.createHeader(action, cimClass)
    const body = this.wsmanMessageCreator.createCommonBody.RequestStateChange(`${this.resourceUriBase}${cimClass}`, requestedState)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  public readonly BIOSElement = {
    /**
     * Enumerates the instances of BIOSElement
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.BIOS_ELEMENT),
    /**
     * Gets the representation of BIOSElement
     * @returns string
     */
    Get: (): string => this.get(Classes.BIOS_ELEMENT),
    /**
     * Pulls instances of BIOSElement, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.BIOS_ELEMENT, enumerationContext)
  }

  public readonly BootConfigSetting = {
    /**
     * This method is called to change the boot order within a boot configuration.
     * @param source CIM.Models.BootSourceSetting Object
     * @returns string
     */
    ChangeBootOrder: (source: Types.BootConfigSetting.InstanceID): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.CHANGE_BOOT_ORDER, Classes.BOOT_CONFIG_SETTING)
      const body = `<Body><h:ChangeBootOrder_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"><h:Source><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootSourceSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${source}</Selector></SelectorSet></ReferenceParameters></h:Source></h:ChangeBootOrder_INPUT></Body>`
      return this.wsmanMessageCreator.createXml(header, body)
    },
    /**
     * Enumerates the instances of BootService
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.BOOT_CONFIG_SETTING),
    /**
     * Gets the representation of BootService
     * @returns string
     */
    Get: (): string => this.get(Classes.BOOT_CONFIG_SETTING),
    /**
     * Pulls instances of BootService, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.BOOT_CONFIG_SETTING, enumerationContext)
  }

  public readonly BootSourceSetting = {
    /**
     * Enumerates the instances of BootSourceSetting
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.BOOT_SOURCE_SETTING),
    /**
     * Gets the representation of BootSourceSetting
     * @returns string
     */
    Get: (): string => this.get(Classes.BOOT_SOURCE_SETTING),
    /**
     * Pulls instances of BootSourceSetting, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.BOOT_SOURCE_SETTING, enumerationContext)
  }

  public readonly BootService = {
    /**
     * numerates the instances of BootService
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.BOOT_SERVICE),
    /**
     * Gets the representation of BootService
     * @returns string
     */
    Get: (): string => this.get(Classes.BOOT_SERVICE),
    /**
     * Pulls instances of BootService, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.BOOT_SERVICE, enumerationContext),
    /**
     * This method is called to set the role of the BootConfigSetting that is directly or indirectly associated to one or more ComputerSystems. The method applies the new role equally to all related ComputerSystems. If a BootConfigSetting can be related to more than one ComputerSystem, but role modification applies to just one of them, the SetBootConfigUsage method shall be used instead.  The method shall update the IsNext or IsDefault property of every ElementSettingData that directly or indirectly associates BootConfigSetting to a ComputerSystem. The method may also update the IsNext or IsDefault property of other ElementSettingDatas that reference the same ComputerSystems to satisfy cardinality constraints.
     * @param bootSource An existing BootConfigSetting instance whose role will be updated.
     * @param role The desired Role of the BootConfigSetting.
     * @returns string
     */
    SetBootConfigRole: (bootSource: string, role: Types.BootService.Role): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.SET_BOOT_CONFIG_ROLE, Classes.BOOT_SERVICE)
      const body = `<Body><h:SetBootConfigRole_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><h:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${bootSource}</Selector></SelectorSet></ReferenceParameters></h:BootConfigSetting><h:Role>${role}</h:Role></h:SetBootConfigRole_INPUT></Body>`
      return this.wsmanMessageCreator.createXml(header, body)
    }
  }

  public readonly Card = {
    /**
     * Enumerates the instances of Card
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.CARD),
    /**
     * Gets the representation of Card
     * @returns string
     */
    Get: (): string => this.get(Classes.CARD),
    /**
     * Pulls instances of Card, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.CARD, enumerationContext)
  }

  public readonly Chassis = {
    /**
     * Enumerates the instances of Chassis
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.CHASSIS),
    /**
     * Gets the representation of Chassis
     * @returns string
     */
    Get: (): string => this.get(Classes.CHASSIS),
    /**
     * Pulls instances of Chassis, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.CHASSIS, enumerationContext)
  }

  public readonly Chip = {
    /**
     * Enumerates the instances of Chip
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.CHIP),
    /**
     * Gets the representation of Chip
     * @returns string
     */
    Get: (): string => this.get(Classes.CHIP),
    /**
     * Pulls instances of Chip, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.CHIP, enumerationContext)
  }

  public readonly ComputerSystemPackage = {
    /**
     * Enumerates the instances of ComputerSystemPackage
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.COMPUTER_SYSTEM_PACKAGE),
    /**
     * Gets the representation of ComputerSystemPackage
     * @returns string
     */
    Get: (): string => this.get(Classes.COMPUTER_SYSTEM_PACKAGE),
    /**
     * Pulls instances of ComputerSystemPackage, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.COMPUTER_SYSTEM_PACKAGE, enumerationContext)
  }

  public readonly IEEE8021xSettings = {
    /**
     * Enumerates the instances of IEEE8021xSettings
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.IEEE8021X_SETTINGS),
    /**
     * Gets the representation of IEEE8021xSettings
     * @returns string
     */
    Get: (): string => this.get(Classes.IEEE8021X_SETTINGS),
    /**
     * Pulls instances of IEEE8021xSettings, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.IEEE8021X_SETTINGS, enumerationContext)
  }

  public readonly KVMRedirectionSAP = {
    /**
     * Enumerates the instances of KVMRedirectionSAP
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.KVM_REDIRECTION_SAP),
    /**
     * Gets the representation of KVMRedirectionSAP
     * @returns string
     */
    Get: (): string => this.get(Classes.KVM_REDIRECTION_SAP),
    /**
     * Pulls instances of KVMRedirectionSAP, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.KVM_REDIRECTION_SAP, enumerationContext),
    /**
     * Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
     * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
     * @returns string
     */
    RequestStateChange: (requestedState: Types.KVMRedirectionSAP.RequestedStateInputs): string => this.requestStateChange(REQUEST_STATE_CHANGE(Classes.KVM_REDIRECTION_SAP), Classes.KVM_REDIRECTION_SAP, requestedState)
  }

  public readonly MediaAccessDevice = {
    /**
     * Enumerates the instances of MediaAccessDevice
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.MEDIA_ACCESS_DEVICE),
    /**
     * Gets the representation of MediaAccessDevice
     * @returns string
     */
    Get: (): string => this.get(Classes.MEDIA_ACCESS_DEVICE),
    /**
     * Pulls instances of MediaAccessDevice, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.MEDIA_ACCESS_DEVICE, enumerationContext)
  }

  public readonly PhysicalMemory = {
    /**
     * Enumerates the instances of PhysicalMemory
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.PHYSICAL_MEMORY),
    /**
     * Gets the representation of PhysicalMemory
     * @returns string
     */
    Get: (): string => this.get(Classes.PHYSICAL_MEMORY),
    /**
     * Pulls instances of PhysicalMemory, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.PHYSICAL_MEMORY, enumerationContext)
  }

  public readonly PhysicalPackage = {
    /**
     * Enumerates the instances of PhysicalPackage
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.PHYSICAL_PACKAGE),
    /**
     * Gets the representation of PhysicalPackage
     * @returns string
     */
    Get: (): string => this.get(Classes.PHYSICAL_PACKAGE),
    /**
     * Pulls instances of PhysicalPackage, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.PHYSICAL_PACKAGE, enumerationContext)
  }

  public readonly PowerManagementService = {
    /**
     * Enumerates the instances of PowerManagementService
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.POWER_MANAGEMENT_SERVICE),
    /**
     * Gets the representation of PowerManagementService
     * @returns string
     */
    Get: (): string => this.get(Classes.POWER_MANAGEMENT_SERVICE),
    /**
     * Pulls instances of PowerManagementService, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.POWER_MANAGEMENT_SERVICE, enumerationContext),
    /**
     * RequestPowerStateChange defines the desired power state of the managed element, and when the element should be put into that state. The RequestPowerStateChange method has five input parameters and a result code.
     * @param powerState The power state for PowerManagementService.
     * @returns string
     */
    RequestPowerStateChange: (powerState: Types.PowerManagementService.PowerState): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.REQUEST_POWER_STATE_CHANGE, Classes.POWER_MANAGEMENT_SERVICE)
      const body = `<Body><h:RequestPowerStateChange_INPUT xmlns:h="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><h:PowerState>${powerState}</h:PowerState><h:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></h:ManagedElement></h:RequestPowerStateChange_INPUT></Body>`
      return this.wsmanMessageCreator.createXml(header, body)
    }
  }

  public readonly Processor = {
    /**
     * Enumerates the instances of Processor
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.PROCESSOR),
    /**
     * Gets the representation of Processor
     * @returns string
     */
    Get: (): string => this.get(Classes.PROCESSOR),
    /**
     * Pulls instances of Processor, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.PROCESSOR, enumerationContext)
  }

  public readonly ServiceAvailableToElement = {
    /**
     * Enumerates the instances of ServiceAvailableToElement
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.SERVICE_AVAILABLE_TO_ELEMENT),
    /**
     * Gets the representation of ServiceAvailableToElement
     * @returns string
     */
    Get: (): string => this.get(Classes.SERVICE_AVAILABLE_TO_ELEMENT),
    /**
     * Pulls instances of ServiceAvailableToElement, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.SERVICE_AVAILABLE_TO_ELEMENT, enumerationContext)
  }

  public readonly SoftwareIdentity = {
    /**
     * Enumerates the instances of SoftwareIdentity
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.SOFTWARE_IDENTITY),
    /**
     * Gets the representation of SoftwareIdentity
     * @returns string
     */
    Get: (): string => this.get(Classes.SOFTWARE_IDENTITY),
    /**
     * Pulls instances of SoftwareIdentity, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.SOFTWARE_IDENTITY, enumerationContext)
  }

  public readonly SystemPackaging = {
    /**
     * Enumerates the instances of SystemPackaging
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.SYSTEM_PACKAGING),
    /**
     * Gets the representation of SystemPackaging
     * @returns string
     */
    Get: (): string => this.get(Classes.SYSTEM_PACKAGING),
    /**
     * Pulls instances of SystemPackaging, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.SYSTEM_PACKAGING, enumerationContext)
  }

  public readonly WiFiEndpointSettings = {
    /**
     * Deletes an instance of WiFiEndpointSettings
     * @param selector Selector Object.
     * @returns string
     */
    Delete: (selector: Selector): string => this.delete(Classes.WIFI_ENDPOINT_SETTINGS, selector),
    /**
     * Enumerates the instances of WiFiEndpointSettings
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.WIFI_ENDPOINT_SETTINGS),
    /**
     * Gets the representation of WiFiEndpointSettings
     * @returns string
     */
    Get: (): string => this.get(Classes.WIFI_ENDPOINT_SETTINGS),
    /**
     * Pulls instances of WiFiEndpointSettings, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.WIFI_ENDPOINT_SETTINGS, enumerationContext)
  }

  public readonly WiFiPort = {
    /**
     * Enumerates the instances of WiFiPort
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.WIFI_PORT),
    /**
     * Gets the representation of WiFiPort
     * @returns string
     */
    Get: (): string => this.get(Classes.WIFI_PORT),
    /**
     * Pulls instances of WiFiPort, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.WIFI_PORT, enumerationContext),
    /**
     * Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
     * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
     * @returns string
     */
    RequestStateChange: (requestedState: Types.WiFiPort.RequestedState): string => this.requestStateChange(REQUEST_STATE_CHANGE(Classes.WIFI_PORT), Classes.WIFI_PORT, requestedState)
  }
}
