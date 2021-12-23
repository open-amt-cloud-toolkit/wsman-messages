"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
***********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSManMessageCreator = exports.WSManErrors = void 0;
var WSManErrors;
(function (WSManErrors) {
    WSManErrors["HEADER"] = "missing header";
    WSManErrors["BODY"] = "missing body";
    WSManErrors["ACTION"] = "missing action";
    WSManErrors["MESSAGE_ID"] = "missing messageId";
    WSManErrors["RESOURCE_URI"] = "missing resourceUri";
    WSManErrors["ENUMERATION_CONTEXT"] = "missing enumerationContext";
    WSManErrors["UNSUPPORTED_METHOD"] = "unsupported method";
    WSManErrors["INPUT"] = "missing input";
    WSManErrors["REQUESTED_STATE"] = "missing requestedState";
    WSManErrors["SELECTOR"] = "missing selector";
    WSManErrors["ROLE"] = "missing role";
    WSManErrors["REQUESTED_POWER_STATE_CHANGE"] = "missing powerState";
    WSManErrors["ADMIN_PASS_ENCRYPTION_TYPE"] = "missing adminPassEncryptionType";
    WSManErrors["ADMIN_PASSWORD"] = "missing adminPassword";
    WSManErrors["ETHERNET_PORT_OBJECT"] = "missing ethernetPortObject";
    WSManErrors["ENVIRONMENT_DETECTION_SETTING_DATA"] = "missing environmentDetectionSettingData";
    WSManErrors["CERTIFICATE_BLOB"] = "missing certificateBlob";
    WSManErrors["MP_SERVER"] = "missing mpServer";
    WSManErrors["REMOTE_ACCESS_POLICY_RULE"] = "missing remoteAccessPolicyRule";
    WSManErrors["BOOT_SETTING_DATA"] = "missing bootSettingData";
})(WSManErrors = exports.WSManErrors || (exports.WSManErrors = {}));
class WSManMessageCreator {
    constructor() {
        this.xmlCommonPrefix = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope">';
        this.xmlCommonEnd = '</Envelope>';
        this.anonymousAddress = 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous';
        this.defaultTimeout = 'PT60S';
        this.createXml = (header, body) => {
            if (header == null)
                throw new Error(WSManErrors.HEADER);
            if (body == null)
                throw new Error(WSManErrors.BODY);
            return this.xmlCommonPrefix + header + body + this.xmlCommonEnd;
        };
        this.createHeader = (action, resourceUri, messageId, address, timeout, selector) => {
            let header = '<Header>';
            if (action == null) {
                throw new Error(WSManErrors.ACTION);
            }
            if (resourceUri == null) {
                throw new Error(WSManErrors.RESOURCE_URI);
            }
            if (messageId == null) {
                throw new Error(WSManErrors.MESSAGE_ID);
            }
            header += `<a:Action>${action}</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo>`;
            if (address != null) {
                header += `<a:Address>${address}</a:Address>`;
            }
            else {
                header += `<a:Address>${this.anonymousAddress}</a:Address>`;
            }
            header += '</a:ReplyTo>';
            if (timeout != null) {
                header += `<w:OperationTimeout>${timeout}</w:OperationTimeout>`;
            }
            else {
                header += `<w:OperationTimeout>${this.defaultTimeout}</w:OperationTimeout>`;
            }
            if (selector != null) {
                header += `<w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet>`;
            }
            header += '</Header>';
            return header;
        };
        this.createBody = (method, enumerationContext, input, requestedState) => {
            let str = '<Body>';
            switch (method) {
                case 'Pull':
                    if (enumerationContext == null) {
                        throw new Error(WSManErrors.ENUMERATION_CONTEXT);
                    }
                    str += `<Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull>`;
                    break;
                case 'Enumerate':
                    str += '<Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" />';
                    break;
                case 'Get':
                case 'Delete':
                    str += '';
                    break;
                case 'RequestStateChange':
                    if (input == null) {
                        throw new Error(WSManErrors.INPUT);
                    }
                    if (requestedState == null) {
                        throw new Error(WSManErrors.REQUESTED_STATE);
                    }
                    str += `<r:RequestStateChange_INPUT xmlns:r="${input}"><r:RequestedState>${requestedState.toString()}</r:RequestedState></r:RequestStateChange_INPUT>`;
                    break;
                default:
                    throw new Error(WSManErrors.UNSUPPORTED_METHOD);
            }
            str += '</Body>';
            return str;
        };
    }
    createPutBody(data) {
        let str = '<Body>';
        str += this.OBJtoXML(data);
        str += '</Body>';
        return str;
    }
    OBJtoXML(data) {
        let xml = '';
        // keeping it basic
        for (const prop in data) {
            xml += `<r:${prop}>`;
            if (typeof data[prop] === 'object') {
                xml += this.OBJtoXML(data[prop]);
            }
            else {
                xml += data[prop];
            }
            xml += `</r:${prop}>`;
        }
        return xml;
    }
}
exports.WSManMessageCreator = WSManMessageCreator;
//# sourceMappingURL=WSMan.js.map