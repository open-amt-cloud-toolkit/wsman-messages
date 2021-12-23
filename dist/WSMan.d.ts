/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
***********************************************************************/
export interface Selector {
    name: string;
    value: string;
}
export declare enum WSManErrors {
    HEADER = "missing header",
    BODY = "missing body",
    ACTION = "missing action",
    MESSAGE_ID = "missing messageId",
    RESOURCE_URI = "missing resourceUri",
    ENUMERATION_CONTEXT = "missing enumerationContext",
    UNSUPPORTED_METHOD = "unsupported method",
    INPUT = "missing input",
    REQUESTED_STATE = "missing requestedState",
    SELECTOR = "missing selector",
    ROLE = "missing role",
    REQUESTED_POWER_STATE_CHANGE = "missing powerState",
    ADMIN_PASS_ENCRYPTION_TYPE = "missing adminPassEncryptionType",
    ADMIN_PASSWORD = "missing adminPassword",
    ETHERNET_PORT_OBJECT = "missing ethernetPortObject",
    ENVIRONMENT_DETECTION_SETTING_DATA = "missing environmentDetectionSettingData",
    CERTIFICATE_BLOB = "missing certificateBlob",
    MP_SERVER = "missing mpServer",
    REMOTE_ACCESS_POLICY_RULE = "missing remoteAccessPolicyRule",
    BOOT_SETTING_DATA = "missing bootSettingData"
}
export declare class WSManMessageCreator {
    xmlCommonPrefix: string;
    xmlCommonEnd: string;
    anonymousAddress: string;
    defaultTimeout: string;
    createXml: (header: string, body: string) => string;
    createHeader: (action: string, resourceUri: string, messageId: string, address?: string, timeout?: string, selector?: Selector) => string;
    createBody: (method: string, enumerationContext?: string, input?: string, requestedState?: Number) => string;
    createPutBody(data: any): string;
    OBJtoXML(data: any): string;
}
