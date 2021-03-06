/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { REQUEST_STATE_CHANGE } from './actions'
import { Classes, Methods, Actions } from './'
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

  ServiceAvailableToElement = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.SERVICE_AVAILABLE_TO_ELEMENT })
  }

  SoftwareIdentity = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_SOFTWARE_IDENTITY })
  }

  ComputerSystemPackage = (method: Methods.GET | Methods.ENUMERATE): string => {
    return this.switch({ method, class: Classes.CIM_COMPUTER_SYSTEM_PACKAGE })
  }

  SystemPackaging = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_SYSTEM_PACKAGING })
  }

  KVMRedirectionSAP = (method: Methods.GET | Methods.REQUEST_STATE_CHANGE, requestedState?: number): string => {
    return this.switch({ method, class: Classes.CIM_KVM_REDIRECTION_SAP, requestedState })
  }

  Chassis = (method: Methods.GET): string => {
    return this.switch({ method, class: Classes.CIM_CHASSIS })
  }

  Chip = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_CHIP })
  }

  Card = (method: Methods.GET): string => {
    return this.switch({ method, class: Classes.CIM_CARD })
  }

  BIOSElement = (method: Methods.GET): string => {
    return this.switch({ method, class: Classes.CIM_BIOS_ELEMENT })
  }

  Processor = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_PROCESSOR })
  }

  PhysicalMemory = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_PHYSICAL_MEMORY })
  }

  MediaAccessDevice = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_MEDIA_ACCESS_DEVICE })
  }

  PhysicalPackage = (method: Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_PHYSICAL_PACKAGE })
  }

  WiFiEndpointSettings = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method, enumerationContext: enumerationContext, class: Classes.CIM_WIFI_ENDPOINT_SETTINGS })
      case Methods.DELETE:
        return this.switch({ method, class: Classes.CIM_WIFI_ENDPOINT_SETTINGS, selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  WiFiPort = (method: Methods.REQUEST_STATE_CHANGE, requestedState: number): string => {
    return this.switch({ method, class: Classes.CIM_WIFI_PORT, requestedState: requestedState })
  }

  BootService = (method: Methods.SET_BOOT_CONFIG_ROLE, bootSource: string, role: number): string => {
    switch (method) {
      case 'SetBootConfigRole': {
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

  BootConfigSetting = (method: Methods.CHANGE_BOOT_ORDER, source: string): string => {
    switch (method) {
      case 'ChangeBootOrder': { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
        const header = this.wsmanMessageCreator.createHeader(Actions.CHANGE_BOOT_ORDER, `${this.resourceUriBase}${Classes.CIM_BOOT_CONFIG_SETTING}`)
        const body = this.wsmanMessageCreator.createBody('ChangeBootOrder_INPUT', this.resourceUriBase, 'CIM_BootConfigSetting', { Source: source })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  PowerManagementService = (method: Methods.REQUEST_POWER_STATE_CHANGE, powerState?: number): string => {
    switch (method) {
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
}
