/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { REQUEST_STATE_CHANGE } from './actions'
import { Classes, Methods, Actions, Types } from './'
import { WSManMessageCreator, WSManErrors, Selector } from '../WSMan'

interface CIMCall {
  method: Methods
  class: Classes
  selector?: Selector
  enumerationContext?: string
  requestedState?: number
}

export class Messages {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'
  private readonly enumerate = (action: Actions, cimClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: Actions, cimClass: Classes, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly get = (action: Actions, cimClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (action: Actions, amtClass: Classes, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, null, null, selector)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.DELETE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly requestStateChange = (action: string, amtClass: Classes, requestedState: number): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.REQUEST_STATE_CHANGE, null, `${this.resourceUriBase}${amtClass}`, requestedState)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  switch = (cim: CIMCall): string => {
    switch (cim.method) {
      case Methods.GET:
        return this.get(Actions.GET, cim.class)
      case Methods.PULL:
        if (cim.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, cim.class, cim.enumerationContext)
      case Methods.ENUMERATE:
        return this.enumerate(Actions.ENUMERATE, cim.class)
      case Methods.DELETE:
        if (cim.selector == null) { throw new Error(WSManErrors.SELECTOR) }
        return this.delete(Actions.DELETE, cim.class, cim.selector)
      case Methods.REQUEST_STATE_CHANGE:
        if (cim.requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
        return this.requestStateChange(REQUEST_STATE_CHANGE(cim.class), cim.class, cim.requestedState)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of BIOSElement.
   * @method GET - Gets the representation of BIOSElement
   * @method PULL - Requires enumerationContext. Pulls instances of BIOSElement, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of BIOSElement
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  BIOSElement = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_BIOS_ELEMENT, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of BootConfigSetting.
   * @method GET - Gets the representation of BootConfigSetting
   * @method PULL - Requires enumerationContext. Pulls instances of BootConfigSetting, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of BootConfigSetting
   * @method CHANGE_BOOT_ORDER - Requires source.  This method is called to change the boot order within a boot configuration. An ordered array of BootSourceSetting instances is passed to this method. Each BootSourceSetting instance MUST already be associated with this BootConfigSetting instance via an instance of OrderedComponent. If not, the implementation MUST return a value of "Invalid Parameter" Upon execution of this method, the value of the AssignedSequence property on each instance of OrderedComponent will be updated such that the values are monotonically increasing in correlation with the position of the referenced BootSourceSetting instance in the source input parameter. That is, the first position in the array will have the lowest value for AssignedSequence. The second position will have the second lowest value, and so on. For BootSourceSetting instances which are associated with the BootConfigSetting instance via OrderedComponent and not present in the input array, the AssignedSequence property on the OrderedComponent association will be assigned a value of 0.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param source An ordered array of BootSourceSettings.
   * @returns string
   */
  BootConfigSetting = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.CHANGE_BOOT_ORDER, enumerationContext?: string, source?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.CIM_BOOT_CONFIG_SETTING, enumerationContext: enumerationContext })
      case Methods.CHANGE_BOOT_ORDER: { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
        const header = this.wsmanMessageCreator.createHeader(Actions.CHANGE_BOOT_ORDER, `${this.resourceUriBase}${Classes.CIM_BOOT_CONFIG_SETTING}`)
        const body = this.wsmanMessageCreator.createBody('ChangeBootOrder_INPUT', this.resourceUriBase, 'CIM_BootConfigSetting', { Source: source })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of BootService.
   * @method GET - Gets the representation of BootService
   * @method PULL - Requires enumerationContext. Pulls instances of BootService, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of BootService
   * @method SET_BOOT_CONFIG_ROLE - Requires bootSource and role.  This method is called to set the role of the BootConfigSetting that is directly or indirectly associated to one or more ComputerSystems. The method applies the new role equally to all related ComputerSystems. If a BootConfigSetting can be related to more than one ComputerSystem, but role modification applies to just one of them, the SetBootConfigUsage method shall be used instead.  The method shall update the IsNext or IsDefault property of every ElementSettingData that directly or indirectly associates BootConfigSetting to a ComputerSystem. The method may also update the IsNext or IsDefault property of other ElementSettingDatas that reference the same ComputerSystems to satisfy cardinality constraints.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param bootSource An existing BootConfigSetting instance whose role will be updated.
   * @param role The desired Role of the BootConfigSetting.
   * @remarks "IsNext" updates the ElementSettingData.IsNext property and indicates that the specified BootConfigSetting is to be used in the future when any of its related ComputerSystems are enabled.
   * @remarks "IsNextSingleUse" updates the ElementSettingData.IsNext property. It is similar to IsNext, except the change applies only to the next time a related ComputerSystem is enabled.
   * @remarks "IsDefault" updates the ElementSettingData.IsDefault property to indicate that the BootConfigSetting is identified as the default boot configuration for any of its related ComputerSystems
   * @remarks ValueMap={0, 1, 2, 3..32767, 32768..65535}
   * @remarks Values={IsNext, IsNextSingleUse, IsDefault, DMTF Reserved, Vendor Specified}
   * @returns string
   */
  BootService = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.SET_BOOT_CONFIG_ROLE, enumerationContext?: string, bootSource?: string, role?: Types.BootService.Role): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.CIM_BOOT_SERVICE, enumerationContext: enumerationContext })
      case Methods.SET_BOOT_CONFIG_ROLE: {
        if (bootSource == null) { throw new Error(WSManErrors.SELECTOR) }
        if (role == null) { throw new Error(WSManErrors.ROLE) }
        const header = this.wsmanMessageCreator.createHeader(Actions.SET_BOOT_CONFIG_ROLE, `${this.resourceUriBase}${Classes.CIM_BOOT_SERVICE}`)
        const body = `<Body><r:SetBootConfigRole_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><r:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${bootSource}</Selector></SelectorSet></ReferenceParameters></r:BootConfigSetting><r:Role>${role}</r:Role></r:SetBootConfigRole_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of Card.
   * @method GET - Gets the representation of Card
   * @method PULL - Requires enumerationContext. Pulls instances of Card, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of Card
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  Card = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_CARD, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of Chassis.
   * @method GET - Gets the representation of Chassis
   * @method PULL - Requires enumerationContext. Pulls instances of Chassis, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of Chassis
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  Chassis = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_CHASSIS, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of Chip.
   * @method GET - Gets the representation of Chip
   * @method PULL - Requires enumerationContext. Pulls instances of Chip, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of Chip
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  Chip = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_CHIP, enumerationContext: enumerationContext })
  }

  /**
     * Accesses a representation of ComputerSystemPackage.
     * @method GET - Gets the representation of ComputerSystemPackage
     * @method PULL - Requires enumerationContext. Pulls instances of ComputerSystemPackage, following an Enumerate operation
     * @method ENUMERATE - Enumerates the instances of ComputerSystemPackage
     * @returns string
     */
  ComputerSystemPackage = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_COMPUTER_SYSTEM_PACKAGE, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of IEEE8021xSettings.
   * @method GET - Gets the representation of IEEE8021xSettings
   * @method PULL - Requires enumerationContext. Pulls instances of IEEE8021xSettings, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of WiFiEndpointSettings
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  IEEE8021xSettings = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_IEEE8021X_SETTINGS, enumerationContext: enumerationContext })
  }

  /**
     * Accesses a representation of KVMRedirectionSAP.
     * @method GET - Gets the representation of KVMRedirectionSAP
     * @method PULL - Requires enumerationContext. Pulls instances of KVMRedirectionSAP, following an Enumerate operation
     * @method ENUMERATE - Enumerates the instances of KVMRedirectionSAP
     * @method REQUEST_STATE_CHANGE - Requires requestedState.  Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
     * @param enumerationContext string returned from an ENUMERATE call.
     * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
     * @remarks ValueMap={2, 3, 4, 6, 7, 8, 9, 10, 11, .., 32768..65535}
     * @remarks Values={Enabled, Disabled, Shut Down, Offline, Test, Defer, Quiesce, Reboot, Reset, DMTF Reserved, Vendor Reserved}
     * @returns string
     */
  KVMRedirectionSAP = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.REQUEST_STATE_CHANGE, enumerationContext?: string, requestedState?: Types.KVMRedirectionSAP.RequestedStateInputs): string => {
    return this.switch({ method, class: Classes.CIM_KVM_REDIRECTION_SAP, enumerationContext: enumerationContext, requestedState: requestedState })
  }

  /**
   * Accesses a representation of MediaAccessDevice.
   * @method GET - Gets the representation of MediaAccessDevice
   * @method PULL - Requires enumerationContext. Pulls instances of MediaAccessDevice, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of MediaAccessDevice
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  MediaAccessDevice = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_MEDIA_ACCESS_DEVICE, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of PhysicalMemory.
   * @method GET - Gets the representation of PhysicalMemory
   * @method PULL - Requires enumerationContext. Pulls instances of PhysicalMemory, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of PhysicalMemory
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  PhysicalMemory = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_PHYSICAL_MEMORY, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of PhysicalPackage.
   * @method GET - Gets the representation of PhysicalPackage
   * @method PULL - Requires enumerationContext. Pulls instances of PhysicalPackage, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of PhysicalPackage
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  PhysicalPackage = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_PHYSICAL_PACKAGE, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of PowerManagementService.
   * @method GET - Gets the representation of PowerManagementService
   * @method PULL - Requires enumerationContext. Pulls instances of PowerManagementService, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of PowerManagementService
   * @method REQUEST_POWER_STATE_CHANGE - Requires powerState. RequestPowerStateChange defines the desired power state of the managed element, and when the element should be put into that state. The RequestPowerStateChange method has five input parameters and a result code.
   * @remark PowerState indicates the desired power state.
   * @remark ManagedElement indicates the element whose state is set. This element SHOULD be associated to the service using the AssociatedPowerManagementService relationship.
   * @remark Time indicates when the power state should be set, either as a regular date-time value or as an interval value (where the interval begins when the method invocation is received).
   * @remark Job is a reference to the job if started.
   * @remark TimeOutPeriod indicates the maximum amount of time a client is expects the transition to take.
   * @remark See CIM_PowerStateCapabilities for descriptions of PowerState parameter enumerations.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param powerState The power state for PowerManagementService.
   * @remark ValueMap={2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
   * @remark Values={Power On, Sleep - Light, Sleep - Deep, Power Cycle (Off Soft), Power Off - Hard, Hibernate, Power Off - Soft, Power Cycle (Off Hard), Master Bus Reset, Diagnostic Interrupt (NMI), Power Off - Soft Graceful, Power Off - Hard Graceful, Master Bus Reset Graceful, Power Cycle (Off - Soft Graceful), Power Cycle (Off - Hard Graceful)}
   * @returns string
   */
  PowerManagementService = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.REQUEST_POWER_STATE_CHANGE, enumerationContext?: string, powerState?: Types.PowerManagementService.PowerState): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.CIM_POWER_MANAGEMENT_SERVICE, enumerationContext: enumerationContext })
      case 'RequestPowerStateChange': {
        if (powerState == null) { throw new Error(WSManErrors.REQUESTED_POWER_STATE_CHANGE) }
        const header = this.wsmanMessageCreator.createHeader(Actions.REQUEST_POWER_STATE_CHANGE, `${this.resourceUriBase}${Classes.CIM_POWER_MANAGEMENT_SERVICE}`)
        const body = `<Body><r:RequestPowerStateChange_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><r:PowerState>${powerState}</r:PowerState><r:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></r:ManagedElement></r:RequestPowerStateChange_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of Processor.
   * @method GET - Gets the representation of Processor
   * @method PULL - Requires enumerationContext. Pulls instances of Processor, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of Processor
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  Processor = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_PROCESSOR, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of ServiceAvailableToElement.
   * @method GET - Gets the representation of ServiceAvailableToElement
   * @method PULL - Requires enumerationContext. Pulls instances of ServiceAvailableToElement, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of ServiceAvailableToElement
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  ServiceAvailableToElement = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.SERVICE_AVAILABLE_TO_ELEMENT, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of SoftwareIdentity.
   * @method GET - Gets the representation of SoftwareIdentity
   * @method PULL - Requires enumerationContext. Pulls instances of SoftwareIdentity, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of SoftwareIdentity
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  SoftwareIdentity = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_SOFTWARE_IDENTITY, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of SystemPackaging.
   * @method GET - Gets the representation of SystemPackaging
   * @method PULL - Requires enumerationContext. Pulls instances of SystemPackaging, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of SystemPackaging
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  SystemPackaging = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, class: Classes.CIM_SYSTEM_PACKAGING, enumerationContext: enumerationContext })
  }

  /**
   * Accesses a representation of WiFiEndpointSettings.
   * @method GET - Gets the representation of WiFiEndpointSettings
   * @method PULL - Requires enumerationContext. Pulls instances of WiFiEndpointSettings, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of WiFiEndpointSettings
   * @method DELETE - Requires selector. Deletes an instance of WiFiEndpointSettings
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param selector Selector Object.
   * @returns string
   */
  WiFiEndpointSettings = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method, class: Classes.CIM_WIFI_ENDPOINT_SETTINGS, enumerationContext: enumerationContext })
      case Methods.DELETE:
        return this.switch({ method, class: Classes.CIM_WIFI_ENDPOINT_SETTINGS, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of WiFiPort.
   * @method GET - Gets the representation of WiFiPort
   * @method PULL - Requires enumerationContext. Pulls instances of WiFiPort, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of WiFiPort
   * @method REQUEST_STATE_CHANGE - Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  A return code of 0 shall indicate the state change was successfully initiated.  A return code of 3 shall indicate that the state transition cannot complete within the interval specified by the TimeoutPeriod parameter.  A return code of 4096 (0x1000) shall indicate the state change was successfully initiated, a ConcreteJob has been created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @remarks ValueMap={2, 3, 4, 6, 7, 8, 9, 10, 11, .., 32768..65535}
   * @remarks Values={Enabled, Disabled, Shut Down, Offline, Test, Defer, Quiesce, Reboot, Reset, DMTF Reserved, Vendor Reserved}
   * @returns string
   */
  WiFiPort = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE | Methods.REQUEST_STATE_CHANGE, enumerationContext?: string, requestedState?: Types.WiFiPort.RequestedState): string => {
    return this.switch({ method, class: Classes.CIM_WIFI_PORT, enumerationContext: enumerationContext, requestedState: requestedState })
  }
}
