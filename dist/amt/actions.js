"use strict";
/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_STATE_CHANGE = exports.Actions = void 0;
var Actions;
(function (Actions) {
    Actions["ENUMERATE"] = "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate";
    Actions["PULL"] = "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull";
    Actions["GET"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Get";
    Actions["PUT"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Put";
    Actions["DELETE"] = "http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete";
    Actions["READ_RECORDS"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords";
    Actions["ADD_TRUSTED_ROOT_CERTIFICATE"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate";
    Actions["ADD_MPS"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer";
    Actions["ADD_REMOTE_ACCESS_POLICY_RULE"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule";
    Actions["SET_BOOT_CONFIG_ROLE"] = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole";
    Actions["GET_RECORDS"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords";
    Actions["POSITION_TO_FIRSTRECORD"] = "http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord";
})(Actions = exports.Actions || (exports.Actions = {}));
const REQUEST_STATE_CHANGE = (className) => { return `http://intel.com/wbem/wscim/1/amt-schema/1/${className}/RequestStateChange`; };
exports.REQUEST_STATE_CHANGE = REQUEST_STATE_CHANGE;
//# sourceMappingURL=actions.js.map