/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace HostBasedSetupService {
    /**
     * Not provisioned:0 | Client:1 | Admin:2
     */
    export type CurrentControlMode = 0 | 1 | 2
    /**
     * Not Started:0 | Chain In-Progress:1 | Chain Complete:2
     */
    export type CertChainStatus = 0 | 1 | 2
    /**
     * None:0 | Other:1 | HTTP Digest MD5(A1):2
     */
    export type AdminPassEncryptionType = 0 | 1 | 2
    /**
     * None:0 | Other:1 | RSA_SHA-2_256:2
     */
    export type SigningAlgorithm = 0 | 1 | 2
  }
  export namespace IEEE8021xSettings {
    /**
     * Enabled:2 | Disabled:3 | Enabled Without Certificates:6
     */
    export type Enabled = 2 | 3 | 6
  }
  export namespace OptInService {
    /**
     * None:0 | KVM:1 | All:4294967295
     */
    export type OptInRequired = 0 | 1 | 4294967295
    /**
     * Not started:0 | Requested:1 | Displayed:2 | Received:3 | In Session:4
     */
    export type OptInState = 0 | 1 | 2 | 3 | 4
    /**
     * FALSE:0 | TRUE:1
     */
    export type CanModifyOptInPolicy = 0 | 1
  }
}
