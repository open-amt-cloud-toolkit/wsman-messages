/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace HostBasedSetupService {
    export type CurrentControlMode = 0 | 1 | 2
    export type CertChainStatus = 0 | 1 | 2
    export type AdminPassEncryptionType = 0 | 1 | 2
    export type SigningAlgorithm = 0 | 1 | 2
  }
  export namespace OptInService {
    export type OptInRequired = 0 | 1
    export type OptInState = 0 | 1 | 2 | 3 | 4
    export type CanModifyOptInPolicy = 0 | 1
  }

  export namespace IEEE8021xSettings {
    export type Enabled = 2 | 3 | 6
  }
}
