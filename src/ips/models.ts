/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as CIM from '../cim'
import * as Common from '../models/common'

export interface HostBasedSetupService extends CIM.Models.SecurityService {
  CurrentControlMode?: number
  AllowedControlModes?: number[]
  ConfigurationNonce?: number[]
  CertChainStatus?: number
}
export interface OptInService extends CIM.Models.Service {
  OptInCodeTimeout?: number
  OptInRequired?: number
  OptInState?: number
  CanModifyOptInPolicy?: number
  OptInDisplayTimeout?: number
}

export interface OptInServiceResponse{
  IPS_OptInService: OptInService
}

export interface StartOptIn_OUTPUT {
  StartOptIn_OUTPUT: Common.ReturnValue
}

export interface CancelOptIn_OUTPUT {
  CancelOptIn_OUTPUT: Common.ReturnValue
}

export interface SendOptInCode_OUTPUT {
  SendOptInCode_OUTPUT: Common.ReturnValue
}

export interface AlarmClockOccurrence extends CIM.Models.ManagedElement {
  InstanceID: string
  StartTime: Date
  Interval?: number
  DeleteOnCompletion: boolean
}

export interface IEEE8021xSettings extends CIM.Models.IEEE8021xSettings {
  Enabled: 2 | 3 | 6
  // ValueMap={0..1, 2, 3, 4..5, 6, 7..}
  // Values={Reserved, Enabled, Disabled, Reserved1, Enabled Without Certificates, Reserved2}
  PxeTimeout?: number // Timeout in seconds.  0 disables feature.  Max value is 86400 (one day).  Default 120
  AvailableInS0?: boolean // Default true
}
