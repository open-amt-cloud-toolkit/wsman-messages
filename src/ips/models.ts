/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import type { Types } from './types'
import type { CIM, Common } from '../'

export namespace Models {
  export interface HostBasedSetupService extends CIM.Models.SecurityService {
    CurrentControlMode?: Types.HostBasedSetupService.CurrentControlMode // ValueMap={0, 1, 2, ..} Values={Not provisioned, Client, Admin, Reserved}
    AllowedControlModes?: number[] // ValueMap={0, 1, 2, ..} Values={Not provisioned, Client, Admin, Reserved}
    ConfigurationNonce?: number[]
    CertChainStatus?: Types.HostBasedSetupService.CertChainStatus // ValueMap={0, 1, 2, ..} Values={Not Started, Chain In-Progress, Chain Complete, Reserved}
  }

  export interface OptInService extends CIM.Models.Service {
    OptInCodeTimeout?: number // ValueMap={0..59, 60..900, 901..4294967295} Values={Reserved, Seconds Timeout, Reserved1}
    OptInRequired?: Types.OptInService.OptInRequired // ValueMap={0, 1, 2..4294967294, 4294967295} Values={None, KVM, Reserved, All}
    OptInState?: Types.OptInService.OptInState // ValueMap={0, 1, 2, 3, 4, 5..255} Values={Not started, Requested, Displayed, Received, In Session, Reserved}
    CanModifyOptInPolicy?: Types.OptInService.CanModifyOptInPolicy // ValueMap={0, 1} Values={FALSE, TRUE}
    OptInDisplayTimeout?: number // ValueMap={0..9, 10..4095, 4096..65536} Values={Reserved, Seconds timeout, Reserved1}
  }

  export interface OptInServiceResponse {
    IPS_OptInService: OptInService
  }

  export interface StartOptIn_OUTPUT {
    StartOptIn_OUTPUT: Common.Models.ReturnValue
  }

  export interface CancelOptIn_OUTPUT {
    CancelOptIn_OUTPUT: Common.Models.ReturnValue
  }

  export interface SendOptInCode_OUTPUT {
    SendOptInCode_OUTPUT: Common.Models.ReturnValue
  }

  export interface AlarmClockOccurrence extends CIM.Models.ManagedElement {
    InstanceID: string // MaxLen=32
    StartTime: Date
    Interval?: number
    DeleteOnCompletion: boolean
  }

  export interface IEEE8021xSettings extends CIM.Models.IEEE8021xSettings {
    Enabled: Types.IEEE8021xSettings.Enabled // ValueMap={0..1, 2, 3, 4..5, 6, 7..} Values={Reserved, Enabled, Disabled, Reserved1, Enabled Without Certificates, Reserved2}
    PxeTimeout?: number // Timeout in seconds.  0 disables feature.  Max value is 86400 (one day).  Default 120
    AvailableInS0?: boolean // Default true
  }
}
