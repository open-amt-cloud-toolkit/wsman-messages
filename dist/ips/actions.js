"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = void 0;
var Actions;
(function (Actions) {
    Actions["ENUMERATE"] = "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate";
    Actions["PULL"] = "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull";
    Actions["GET"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Get";
    Actions["PUT"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Put";
    Actions["DELETE"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete";
    Actions["SETUP"] = "http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup";
    Actions["START_OPT_IN"] = "http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn";
    Actions["CANCEL_OPT_IN"] = "http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn";
    Actions["SEND_OPT_IN_CODE"] = "http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode";
})(Actions = exports.Actions || (exports.Actions = {}));
//# sourceMappingURL=actions.js.map