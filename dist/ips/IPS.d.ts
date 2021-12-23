/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { WSManMessageCreator } from '../WSMan';
import { Methods } from './methods';
import { OptInServiceResponse } from './models';
export declare class IPS {
    wsmanMessageCreator: WSManMessageCreator;
    readonly resourceUriBase: string;
    private readonly get;
    private readonly put;
    OptInService: (method: Methods.GET | Methods.PUT | Methods.START_OPT_IN | Methods.CANCEL_OPT_IN | Methods.SEND_OPT_IN_CODE, messageId: string, code?: Number, data?: OptInServiceResponse) => string;
    HostBasedSetupService: (method: Methods.SETUP, messageId: string, adminPassEncryptionType?: Number, adminPassword?: string) => string;
}
