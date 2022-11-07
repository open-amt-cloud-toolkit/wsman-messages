/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace AMTAuthenticateObject {
    export type SignatureMechanism = 0
  }

  export namespace GeneralSettings {
    export type PreferredAddressFamily = 0 | 1
    export type AMTNetworkEnabled = 0 | 1
    export type PrivacyLevel = 0 | 1 | 2
    export type PowerSource = 0 | 1
    export type ThunderboltDockEnabled = 0 | 1
  }

  export namespace EthernetPortSettings {
    export type LinkPolicyValues = 1 | 14 | 16 | 224
    export type LinkPolicy = LinkPolicyValues[]
    export type LinkPreference = 1 | 2
    export type LinkControl = 1 | 2
    export type ConsoleTcpMaxRetransmissions = 5 | 6 | 7
    export type WLANLinkProtectionLevel = 0 | 1 | 2 | 3
    export type PhysicalConnectionType = 0 | 1 | 2 | 3
    export type PhysicalNicMedium = 0 | 1
  }

  export namespace MPServer {
    export type InfoFormat = 3 | 4 | 201
    export type AuthMethod = 1 | 2
  }

  export namespace RemoteAccessPolicyRule {
    export type Trigger = 0 | 1 | 2 | 3
  }

  export namespace SystemDefensePolicy {
    export type AntiSpoofingSupport = 0 | 1 | 2 | 3 | 4
  }

  export namespace EnvironmentDetectionSettingData {
    export type DetectionAlgorithm = 0 | 1
  }

  export namespace BootSettingData {
    export type FirmwareVerbosity = 0 | 1 | 2 | 3
    export type IDERBootDevice = 0 | 1
  }

  export namespace EVENT_DATA {
    export type EventSeverity = 0 | 1 | 2 | 4 | 8 | 16 | 32
  }

  export namespace RedirectionService {
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 32768 | 32769 | 32770 | 32771
    export type RequestedState = 32768 | 32769 | 32770 | 32771
  }

  export namespace GenerateKeyPair {
    export type KeyAlgorithm = 0
  }

  export namespace WiFiPortConfigurationService {
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type HealthState = 0 | 5 | 10 | 15 | 20 | 25 | 30
    export type localProfileSynchronizationEnabled = 0 | 3
    export type NoHostCsmeSoftwarePolicy = 0 | 1 | 2
    export type UEFIWiFiProfileShareEnabled = 0 | 1
  }

  export namespace RemoteAccessPolicyAppliesToMPS {
    export type MpsType = 0 | 1 | 2
  }

  export namespace UserInitiatedConnectionService {
    export type RequestedState = 32768 | 32769 | 32770 | 32771
  }

  export namespace SetupAndConfigurationService {
    export type ProvisioningMode = 0 | 1 | 2 | 3
  }
}
