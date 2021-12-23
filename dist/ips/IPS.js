"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPS = void 0;
const WSMan_1 = require("../WSMan");
const actions_1 = require("./actions");
const methods_1 = require("./methods");
const classes_1 = require("./classes");
class IPS {
    constructor() {
        this.wsmanMessageCreator = new WSMan_1.WSManMessageCreator();
        this.resourceUriBase = 'http://intel.com/wbem/wscim/1/ips-schema/1/';
        this.get = (action, ipsClass, messageId) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, messageId);
            const body = this.wsmanMessageCreator.createBody(methods_1.Methods.GET);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.put = (action, ipsClass, messageId, data) => {
            const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, messageId);
            let body = this.wsmanMessageCreator.createPutBody(data);
            body = body.replace(`<r:${classes_1.Classes.IPS_OPT_IN_SERVICE}>`, `<r:IPS_OptInService xmlns:r="${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}">`);
            return this.wsmanMessageCreator.createXml(header, body);
        };
        this.OptInService = (method, messageId, code, data) => {
            let header, body;
            switch (method) {
                case methods_1.Methods.GET:
                    return this.get(actions_1.Actions.GET, classes_1.Classes.IPS_OPT_IN_SERVICE, messageId);
                case methods_1.Methods.PUT:
                    return this.put(actions_1.Actions.PUT, classes_1.Classes.IPS_OPT_IN_SERVICE, messageId, data);
                case methods_1.Methods.START_OPT_IN: {
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.START_OPT_IN, `${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}`, messageId);
                    body = `<Body><r:StartOptIn_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}" /></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                case methods_1.Methods.SEND_OPT_IN_CODE: {
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.SEND_OPT_IN_CODE, `${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}`, messageId);
                    body = `<Body><r:SendOptInCode_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}"><r:OptInCode>${code}</r:OptInCode></r:SendOptInCode_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                case methods_1.Methods.CANCEL_OPT_IN: {
                    header = this.wsmanMessageCreator.createHeader(actions_1.Actions.CANCEL_OPT_IN, `${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}`, messageId);
                    body = `<Body><r:CancelOptIn_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.IPS_OPT_IN_SERVICE}" /></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
        this.HostBasedSetupService = (method, messageId, adminPassEncryptionType, adminPassword) => {
            switch (method) {
                case methods_1.Methods.SETUP: {
                    if (adminPassEncryptionType == null) {
                        throw new Error(WSMan_1.WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE);
                    }
                    if (adminPassword == null) {
                        throw new Error(WSMan_1.WSManErrors.ADMIN_PASSWORD);
                    }
                    const header = this.wsmanMessageCreator.createHeader(actions_1.Actions.SETUP, `${this.resourceUriBase}${classes_1.Classes.IPS_HOST_BASED_SETUP_SERVICE}`, messageId);
                    const body = `<Body><r:Setup_INPUT xmlns:r="${this.resourceUriBase}${classes_1.Classes.IPS_HOST_BASED_SETUP_SERVICE}"><r:NetAdminPassEncryptionType>${adminPassEncryptionType.toString()}</r:NetAdminPassEncryptionType><r:NetworkAdminPassword>${adminPassword}</r:NetworkAdminPassword></r:Setup_INPUT></Body>`;
                    return this.wsmanMessageCreator.createXml(header, body);
                }
                default:
                    throw new Error(WSMan_1.WSManErrors.UNSUPPORTED_METHOD);
            }
        };
    }
}
exports.IPS = IPS;
//# sourceMappingURL=IPS.js.map