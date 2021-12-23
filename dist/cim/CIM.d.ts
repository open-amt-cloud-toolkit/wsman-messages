/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { Methods } from '.';
import { WSManMessageCreator } from '../WSMan';
export declare class CIM {
    wsmanMessageCreator: WSManMessageCreator;
    readonly resourceUriBase: string;
    private readonly enumerate;
    private readonly pull;
    private readonly get;
    private readonly requestStateChange;
    private readonly switch;
    ServiceAvailableToElement: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    SoftwareIdentity: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    ComputerSystemPackage: (method: Methods.GET | Methods.ENUMERATE, messageId: string) => string;
    SystemPackaging: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    KVMRedirectionSAP: (method: Methods.GET | Methods.REQUEST_STATE_CHANGE, messageId: string, requestedState?: number) => string;
    Chassis: (method: Methods.GET, messageId: string) => string;
    Chip: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    Card: (method: Methods.GET, messageId: string) => string;
    BIOSElement: (method: Methods.GET, messageId: string) => string;
    Processor: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    PhysicalMemory: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    MediaAccessDevice: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    PhysicalPackage: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    WiFiEndpointSettings: (method: Methods.PULL | Methods.ENUMERATE, messageId: string, enumerationContext?: string) => string;
    BootService: (method: Methods.SET_BOOT_CONFIG_ROLE, messageId: string, bootSource: string, role: number) => string;
    BootConfigSetting: (method: Methods.CHANGE_BOOT_ORDER, messageId: string, source: string) => string;
    PowerManagementService: (method: Methods.REQUEST_POWER_STATE_CHANGE, messageId: string, powerState?: number) => string;
}
