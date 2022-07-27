/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { SecurityService, Service, ManagedElement } from '../cim/models'
import { ReturnValue } from '../models/common'

export interface HostBasedSetupService extends SecurityService {
  CurrentControlMode?: number
  AllowedControlModes?: number[]
  ConfigurationNonce?: number[]
  CertChainStatus?: number
}
export interface OptInService extends Service {
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
  StartOptIn_OUTPUT: ReturnValue
}
export interface CancelOptIn_OUTPUT {
  CancelOptIn_OUTPUT: ReturnValue
}

export interface SendOptInCode_OUTPUT {
  SendOptInCode_OUTPUT: ReturnValue
}

export interface AlarmClockOccurrence extends ManagedElement {
  InstanceID: string
  StartTime: Date
  Interval?: number
  DeleteOnCompletion: boolean
}
