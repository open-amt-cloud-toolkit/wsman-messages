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
    Actions["SET_BOOT_CONFIG_ROLE"] = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole";
    Actions["CHANGE_BOOT_ORDER"] = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting/ChangeBootOrder";
    Actions["REQUEST_POWER_STATE_CHANGE"] = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService/RequestPowerStateChange";
    Actions["REQUEST_STATE_CHANGE"] = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_KVMRedirectionSAP/RequestStateChange";
})(Actions = exports.Actions || (exports.Actions = {}));
//# sourceMappingURL=actions.js.map