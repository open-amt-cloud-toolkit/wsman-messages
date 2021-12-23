"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMT = void 0;
const WSMan_1 = require("../WSMan");
const methods_1 = require("./methods");
const actions_1 = require("./actions");
const classes_1 = require("./classes");
class AMT {
    constructor() {
        this.wsmanMessageCreator = new WSMan_1.WSManMessageCreator();
        this.resourceUriBase = 'http://intel.com/wbem/wscim/1/amt-schema/1/';
        this.get = (action, amtClass, messageId) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.GET);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.enumerate = (action, amtClass, messageId) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.ENUMERATE);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.pull = (action, amtClass, messageId, enumerationContext) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.PULL, enumerationContext);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.put = (action, amtClass, messageId, data) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            let body = this.wsmanMessageCreator.createPutBody(data);
            body = body.replace(`<r:${classes_1.Classes.AMT_REDIRECTION_SERVICE}>`, `<r:${classes_1.Classes.AMT_REDIRECTION_SERVICE} xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_REDIRECTION_SERVICE}">`);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.delete = (action, amtClass, messageId, selector) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId, null, null, selector);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.DELETE);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.requestStateChange = (action, amtClass, messageId, requestedState) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.REQUEST_STATE_CHANGE, null, `${this.resourceUriBase}${amtClass}`, requestedState);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.amtSwitch = (amt) => {
            switch (amt.method) {
                case methods_1.Methods.GET:
                    return this.get(actions_1.Actions.GET, amt.class, amt.messageId);
                case methods_1.Methods.PUT:
                    if (amt.data == null) {
                        throw new Error(WSMan_1.WSManErrors.BODY);
                    }
                    return this.put(actions_1.Actions.PUT, amt.class, amt.messageId, amt.data);
                case methods_1.Methods.PULL:
                    if (amt.enumerationContext == null) {
                        throw new Error(WSMan_1.WSManErrors.ENUMERATION_CONTEXT);
                    }
                    return this.pull(actions_1.Actions.PULL, amt.class, amt.messageId, amt.enumerationContext);
                case methods_1.Methods.ENUMERATE:
                    return this.enumerate(actions_1.Actions.ENUMERATE, amt.class, amt.messageId);
                case methods_1.Methods.DELETE:
                    if (amt.selector == null) {
                        throw new Error(WSMan_1.WSManErrors.SELECTOR);
                    }
                    return this.delete(actions_1.Actions.DELETE, amt.class, amt.messageId, amt.selector);
                case methods_1.Methods.REQUEST_STATE_CHANGE:
                    if (amt.requestedState == null) {
                        throw new Error(WSMan_1.WSManErrors.REQUESTED_STATE);
                    }
                    return this.requestStateChange((0, actions_1.REQUEST_STATE_CHANGE)(amt.class), amt.class, amt.messageId, amt.requestedState);
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.AuditLog = (method, messageId, startIndex) => {
            let header;
            let body;
            switch (method) {
                case methods_1.Methods.READ_RECORDS:
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.READ_RECORDS, `${this.resourceUriBase}${classes_1.Classes.AMT_AUDIT_LOG}`, messageId);
                    body = `<Body><r:ReadRecords_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_AUDIT_LOG}"><r:StartIndex>${startIndex}</r:StartIndex></r:ReadRecords_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.MessageLog = (method, messageId, identifier) => {
            let header, body;
            switch (method) {
                case methods_1.Methods.POSITION_TO_FIRSTRECORD:
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.POSITION_TO_FIRSTRECORD, `${this.resourceUriBase}${classes_1.Classes.AMT_MESSAGE_LOG}`, messageId);
                    body = `<Body><r:PositionToFirstRecord_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_MESSAGE_LOG}" /></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                case methods_1.Methods.GET_RECORDS:
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.GET_RECORDS, `${this.resourceUriBase}${classes_1.Classes.AMT_MESSAGE_LOG}`, messageId);
                    body = `<Body><r:GetRecords_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_MESSAGE_LOG}"><r:IterationIdentifier>${identifier}</r:IterationIdentifier><r:MaxReadRecords>390</r:MaxReadRecords></r:GetRecords_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.BootCapabilities = (method, messageId) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_BOOT_CAPABILITIES });
        };
        this.RedirectionService = (method, messageId, requestedState, data) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_REDIRECTION_SERVICE, requestedState, data });
        };
        this.SetupAndConfigurationService = (method, messageId) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE });
        };
        this.GeneralSettings = (method, messageId) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_GENERAL_SETTINGS });
        };
        this.EthernetPortSettings = (method, messageId, enumerationContext, ethernetPortObject) => {
            switch (method) {
                case methods_1.Methods.PULL:
                case methods_1.Methods.ENUMERATE:
                    return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_ETHERNET_PORT_SETTINGS, enumerationContext });
                case methods_1.Methods.PUT: {
                    if (ethernetPortObject == null) {
                        throw new Error(WSMan_1.WSManErrors.ETHERNET_PORT_OBJECT);
                    }
                    const selector = { name: 'InstanceID', value: ethernetPortObject.InstanceId };
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.PUT, `${this.resourceUriBase}${classes_1.Classes.AMT_ETHERNET_PORT_SETTINGS}`, messageId, null, null, selector);
                    let body = `<Body><r:AMT_EthernetPortSettings xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_ETHERNET_PORT_SETTINGS}"><r:DHCPEnabled>${String(ethernetPortObject.DHCPEnabled)}</r:DHCPEnabled><r:ElementName>${ethernetPortObject.ElementName}</r:ElementName><r:InstanceID>${ethernetPortObject.InstanceId}</r:InstanceID><r:IpSyncEnabled>${String(ethernetPortObject.IpSyncEnabled)}</r:IpSyncEnabled><r:LinkIsUp>${String(ethernetPortObject.LinkIsUp)}</r:LinkIsUp>`;
                    ethernetPortObject.LinkPolicy.forEach(function (item) {
                        body += `<r:LinkPolicy>${item}</r:LinkPolicy>`;
                    });
                    body += `<r:MACAddress>${ethernetPortObject.MACAddress}</r:MACAddress><r:PhysicalConnectionType>${ethernetPortObject.PhysicalConnectionType}</r:PhysicalConnectionType><r:SharedDynamicIP>${String(ethernetPortObject.SharedDynamicIp)}</r:SharedDynamicIP><r:SharedMAC>${String(ethernetPortObject.SharedMAC)}</r:SharedMAC><r:SharedStaticIp>${String(ethernetPortObject.SharedStaticIp)}</r:SharedStaticIp></r:AMT_EthernetPortSettings></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.RemoteAccessPolicyRule = (method, messageId, selector) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_REMOTE_ACCESS_POLICY_RULE, selector: selector });
        };
        this.ManagementPresenceRemoteSAP = (method, messageId, enumerationContext) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, enumerationContext: enumerationContext });
        };
        this.PublicKeyCertificate = (method, messageId, enumerationContext) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_PUBLIC_KEY_CERTIFICATE, enumerationContext: enumerationContext });
        };
        this.EnvironmentDetectionSettingData = (method, messageId, environmentDetectionSettingData) => {
            switch (method) {
                case methods_1.Methods.GET:
                    return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA });
                case methods_1.Methods.PUT: {
                    if (environmentDetectionSettingData == null) {
                        throw new Error(WSMan_1.WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA);
                    }
                    const selector = { name: 'InstanceID', value: environmentDetectionSettingData.InstanceId };
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.PUT, `${this.resourceUriBase}${classes_1.Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}`, messageId, null, null, selector);
                    let body = `<Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="${this.resourceUriBase}${classes_1.Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}"><r:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.ElementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.InstanceId}</r:InstanceID>`;
                    environmentDetectionSettingData.DetectionStrings.forEach(function (item) {
                        body += `<r:DetectionStrings>${item}</r:DetectionStrings>`;
                    });
                    body += '</r:AMT_EnvironmentDetectionSettingData></Body>';
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.PublicKeyManagementService = (method, messageId, certificateBlob) => {
            switch (method) {
                case methods_1.Methods.ADD_TRUSTED_ROOT_CERTIFICATE: {
                    if (certificateBlob == null) {
                        throw new Error(WSMan_1.WSManErrors.CERTIFICATE_BLOB);
                    }
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.ADD_TRUSTED_ROOT_CERTIFICATE, `${this.resourceUriBase}${classes_1.Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`, messageId);
                    const body = `<Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${certificateBlob}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.RemoteAccessService = (method, messageId, mpServer, remoteAccessPolicyRule, selector) => {
            switch (method) {
                case methods_1.Methods.ADD_MPS: {
                    if (mpServer == null) {
                        throw new Error(WSMan_1.WSManErrors.MP_SERVER);
                    }
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.ADD_MPS, `${this.resourceUriBase}${classes_1.Classes.AMT_REMOTE_ACCESS_SERVICE}`, messageId);
                    const body = `<Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpServer.InfoFormat}</r:InfoFormat><r:Port>${mpServer.Port}</r:Port><r:AuthMethod>${mpServer.AuthMethod}</r:AuthMethod><r:Username>${mpServer.Username}</r:Username><r:Password>${mpServer.Password}</r:Password><r:CN>${mpServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                case methods_1.Methods.ADD_REMOTE_ACCESS_POLICY_RULE: {
                    if (remoteAccessPolicyRule == null) {
                        throw new Error(WSMan_1.WSManErrors.REMOTE_ACCESS_POLICY_RULE);
                    }
                    if (selector == null) {
                        throw new Error(WSMan_1.WSManErrors.SELECTOR);
                    }
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.ADD_REMOTE_ACCESS_POLICY_RULE, `${this.resourceUriBase}${classes_1.Classes.AMT_REMOTE_ACCESS_SERVICE}`, messageId);
                    const body = `<Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.Trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.UserInitiatedConnectionService = (method, messageId, requestedState) => {
            return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_USER_INITIATED_CONNECTION_SERVICE, requestedState: requestedState });
        };
        this.BootSettingData = (method, messageId, bootSettingData) => {
            var _a, _b, _c;
            switch (method) {
                case methods_1.Methods.GET:
                    return this.amtSwitch({ method: method, messageId: messageId, class: classes_1.Classes.AMT_BOOT_SETTING_DATA });
                case methods_1.Methods.PUT: {
                    if (bootSettingData == null) {
                        throw new Error(WSMan_1.WSManErrors.BOOT_SETTING_DATA);
                    }
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.PUT, `${this.resourceUriBase}${classes_1.Classes.AMT_BOOT_SETTING_DATA}`, messageId);
                    let body = '<Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData">';
                    (_a = bootSettingData.BIOSLastStatus) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                        body += `<r:BIOSLastStatus>${item}</r:BIOSLastStatus>`;
                    });
                    (_b = bootSettingData.UEFIBootNumberOfParams) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
                        body += `<r:UEFIBootNumberOfParams>${item}</r:UEFIBootNumberOfParams>`;
                    });
                    (_c = bootSettingData.UEFIBootParametersArray) === null || _c === void 0 ? void 0 : _c.forEach(function (item) {
                        body += `<r:UEFIBootParametersArray>${item}</r:UEFIBootParametersArray>`;
                    });
                    body += `<r:BIOSPause>${String(bootSettingData.BIOSPause)}</r:BIOSPause><r:BIOSSetup>${String(bootSettingData.BIOSSetup)}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${String(bootSettingData.ConfigurationDataReset)}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${String(bootSettingData.EnforceSecureBoot)}</r:EnforceSecureBoot><r:FirmwareVerbosity>${String(bootSettingData.FirmwareVerbosity)}</r:FirmwareVerbosity><r:ForcedProgressEvents>${String(bootSettingData.ForcedProgressEvents)}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceId}</r:InstanceID><r:LockKeyboard>${String(bootSettingData.LockKeyboard)}</r:LockKeyboard><r:LockPowerButton>${String(bootSettingData.LockPowerButton)}</r:LockPowerButton><r:LockResetButton>${String(bootSettingData.LockResetButton)}</r:LockResetButton><r:LockSleepButton>${String(bootSettingData.LockSleepButton)}</r:LockSleepButton><r:OptionsCleared>${String(bootSettingData.OptionsCleared)}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${String(bootSettingData.ReflashBIOS)}</r:ReflashBIOS><r:SecureErase>${String(bootSettingData.SecureErase)}</r:SecureErase><r:UseIDER>${String(bootSettingData.UseIDER)}</r:UseIDER><r:UseSOL>${String(bootSettingData.UseSOL)}</r:UseSOL><r:UseSafeMode>${String(bootSettingData.UseSafeMode)}</r:UseSafeMode><r:UserPasswordBypass>${String(bootSettingData.UserPasswordBypass)}</r:UserPasswordBypass></r:AMT_BootSettingData></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
    }
}
exports.AMT = AMT;
//# sourceMappingURL=AMT.js.map