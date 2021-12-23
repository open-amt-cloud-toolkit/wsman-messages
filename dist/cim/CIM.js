"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIM = void 0;
const _1 = require(".");
const WSMan_1 = require("../WSMan");
class CIM {
    constructor() {
        this.wsmanMessageCreator = new WSMan_1.WSManMessageCreator();
        this.resourceUriBase = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/';
        this.enumerate = (action, cimClass, messageId) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(_1.Methods.ENUMERATE);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.pull = (action, cimClass, messageId, enumerationContext) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(_1.Methods.PULL, enumerationContext);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.get = (action, cimClass, messageId) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${cimClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(_1.Methods.GET);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.requestStateChange = (action, amtClass, messageId, requestedState) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(_1.Methods.REQUEST_STATE_CHANGE, null, `${this.resourceUriBase}${amtClass}`, requestedState);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.switch = (cim) => {
            switch (cim.method) {
                case _1.Methods.GET:
                    return this.get(_1.Actions.GET, cim.class, cim.messageId);
                case _1.Methods.PULL:
                    if (cim.enumerationContext == null) {
                        throw new Error(WSMan_1.WSManErrors.ENUMERATION_CONTEXT);
                    }
                    return this.pull(_1.Actions.PULL, cim.class, cim.messageId, cim.enumerationContext);
                case _1.Methods.ENUMERATE:
                    return this.enumerate(_1.Actions.ENUMERATE, cim.class, cim.messageId);
                case _1.Methods.REQUEST_STATE_CHANGE:
                    if (cim.requestedState == null) {
                        throw new Error(WSMan_1.WSManErrors.REQUESTED_STATE);
                    }
                    return this.requestStateChange(_1.Actions.REQUEST_STATE_CHANGE, cim.class, cim.messageId, cim.requestedState);
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.ServiceAvailableToElement = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.SERVICE_AVAILABLE_TO_ELEMENT });
        };
        this.SoftwareIdentity = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_SOFTWARE_IDENTITY });
        };
        this.ComputerSystemPackage = (method, messageId) => {
            return this.switch({ method: method, messageId: messageId, class: _1.Classes.CIM_COMPUTER_SYSTEM_PACKAGE });
        };
        this.SystemPackaging = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_SYSTEM_PACKAGING });
        };
        this.KVMRedirectionSAP = (method, messageId, requestedState) => {
            return this.switch({ method: method, messageId: messageId, class: _1.Classes.CIM_KVM_REDIRECTION_SAP, requestedState });
        };
        this.Chassis = (method, messageId) => {
            return this.switch({ method: method, messageId: messageId, class: _1.Classes.CIM_CHASSIS });
        };
        this.Chip = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_CHIP });
        };
        this.Card = (method, messageId) => {
            return this.switch({ method: method, messageId: messageId, class: _1.Classes.CIM_CARD });
        };
        this.BIOSElement = (method, messageId) => {
            return this.switch({ method: method, messageId: messageId, class: _1.Classes.CIM_BIOS_ELEMENT });
        };
        this.Processor = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_PROCESSOR });
        };
        this.PhysicalMemory = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_PHYSICAL_MEMORY });
        };
        this.MediaAccessDevice = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_MEDIA_ACCESS_DEVICE });
        };
        this.PhysicalPackage = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_PHYSICAL_PACKAGE });
        };
        this.WiFiEndpointSettings = (method, messageId, enumerationContext) => {
            return this.switch({ method: method, messageId: messageId, enumerationContext: enumerationContext, class: _1.Classes.CIM_WIFI_ENDPOINT_SETTINGS });
        };
        this.BootService = (method, messageId, bootSource, role) => {
            switch (method) {
                case 'SetBootConfigRole': {
                    if (bootSource == null) {
                        throw new Error(WSMan_1.WSManErrors.SELECTOR);
                    }
                    if (role == null) {
                        throw new Error(WSMan_1.WSManErrors.ROLE);
                    }
                    const header = this.wsmanMessageCreator.createHeader(_1.Actions.SET_BOOT_CONFIG_ROLE, `${this.resourceUriBase}${_1.Classes.CIM_BOOT_SERVICE}`, messageId);
                    const body = `<Body><r:SetBootConfigRole_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><r:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${bootSource}</Selector></SelectorSet></ReferenceParameters></r:BootConfigSetting><r:Role>${role}</r:Role></r:SetBootConfigRole_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.BootConfigSetting = (method, messageId, source) => {
            switch (method) {
                case 'ChangeBootOrder': { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
                    const header = this.wsmanMessageCreator.createHeader(_1.Actions.CHANGE_BOOT_ORDER, `${this.resourceUriBase}${_1.Classes.CIM_BOOT_CONFIG_SETTING}`, messageId);
                    const body = `<Body><r:ChangeBootOrder_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"><r:Source>${source}</r:Source></r:ChangeBootOrder_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.PowerManagementService = (method, messageId, powerState) => {
            switch (method) {
                case 'RequestPowerStateChange': {
                    if (powerState == null) {
                        throw new Error(WSMan_1.WSManErrors.REQUESTED_POWER_STATE_CHANGE);
                    }
                    const header = this.wsmanMessageCreator.createHeader(_1.Actions.REQUEST_POWER_STATE_CHANGE, `${this.resourceUriBase}${_1.Classes.CIM_POWER_MANAGEMENT_SERVICE}`, messageId);
                    const body = `<Body><r:RequestPowerStateChange_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService"><r:PowerState>${powerState}</r:PowerState><r:ManagedElement><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters></r:ManagedElement></r:RequestPowerStateChange_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
    }
}
exports.CIM = CIM;
//# sourceMappingURL=CIM.js.map