/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Selector, WSManMessageCreator } from '../WSMan';
import { EthernetPortSettings, MPServer, RemoteAccessPolicyRule, EnvironmentDetectionSettingData, BootSettingData, RedirectionResponse } from './models';
import { Methods } from './methods';
import { REQUEST_STATE_CHANGE } from './actions';
export declare class AMT {
    wsmanMessageCreator: WSManMessageCreator;
    readonly resourceUriBase: string;
    private readonly get;
    private readonly enumerate;
    private readonly pull;
    private readonly put;
    private readonly delete;
    private readonly requestStateChange;
    private readonly amtSwitch;
    AuditLog: (method: Methods.READ_RECORDS, messageId: string, startIndex: number) => string;
    MessageLog: (method: Methods.GET_RECORDS | Methods.POSITION_TO_FIRSTRECORD, messageId: string, identifier?: number) => string;
    BootCapabilities: (method: Methods.GET, messageId: string) => string;
    RedirectionService: (method: Methods.GET | Methods.REQUEST_STATE_CHANGE | Methods.PUT, messageId: string, requestedState?: number, data?: RedirectionResponse) => string;
    SetupAndConfigurationService: (method: Methods.GET, messageId: string) => string;
    GeneralSettings: (method: Methods.GET, messageId: string) => string;
    EthernetPortSettings: (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT, messageId: string, enumerationContext?: string, ethernetPortObject?: EthernetPortSettings) => string;
    RemoteAccessPolicyRule: (method: Methods.DELETE, messageId: string, selector?: Selector) => string;
    ManagementPresenceRemoteSAP: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    PublicKeyCertificate: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    EnvironmentDetectionSettingData: (method: Methods.GET | Methods.PUT, messageId: string, environmentDetectionSettingData?: EnvironmentDetectionSettingData) => string;
    PublicKeyManagementService: (method: Methods.ADD_TRUSTED_ROOT_CERTIFICATE, messageId: string, certificateBlob?: string) => string;
    RemoteAccessService: (method: Methods.ADD_MPS | Methods.ADD_REMOTE_ACCESS_POLICY_RULE, messageId: string, mpServer?: MPServer, remoteAccessPolicyRule?: RemoteAccessPolicyRule, selector?: Selector) => string;
    UserInitiatedConnectionService: (method: Methods.REQUEST_STATE_CHANGE, messageId: string, requestedState?: number) => string;
    BootSettingData: (method: Methods.GET | Methods.PUT, messageId: string, bootSettingData?: BootSettingData) => string;
}
