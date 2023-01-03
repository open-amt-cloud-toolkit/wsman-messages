/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace AMTAuthenticateObject {
    /**
     * 0 = "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"
     */
    export type SignatureMechanism = 0
  }
  export namespace BootSettingData {
    /**
     * 0 = System default | 1 = Quiet - minimal screen activity | 2 = Verbose - all messages appear on the screen | 3 = Screen blank - no messages appear on the screen
     */
    export type FirmwareVerbosity = 0 | 1 | 2 | 3
    /**
     * 0 = Floppy Boot | 1 = CD Boot
     */
    export type IDERBootDevice = 0 | 1
  }
  export namespace EnvironmentDetectionSettingData {
    /**
     * 0 = Local Domains | 1 = Remote URLs
     */
    export type DetectionAlgorithm = 0 | 1
  }
  export namespace EthernetPortSettings {
    /**
     * 1 = available on S0 AC | 14 = available on Sx AC | 16 = available on S0 DC | 224 = available on Sx DC
     */
    export type LinkPolicyValues = 1 | 14 | 16 | 224
    export type LinkPolicy = LinkPolicyValues[]
    /**
     * 1 = ME | 2 = HOST
     */
    export type LinkPreference = 1 | 2
    /**
     * 1 = ME | 2 = HOST
     */
    export type LinkControl = 1 | 2
    /**
     * Indicates the number of retransmissions host TCP SW tries if no ack is accepted
     */
    export type ConsoleTcpMaxRetransmissions = 5 | 6 | 7
    /**
     * 0 = OVERRIDE | 1 = NONE | 2 = PASSIVE | 3 = HIGH
     */
    export type WLANLinkProtectionLevel = 0 | 1 | 2 | 3
    /**
     * 0 = "Integrated LAN NIC" | 1 = "Discrete LAN NIC" | 2 = "LAN via a Thunderbolt dock" | 3 = "Wireless LAN"
     */
    export type PhysicalConnectionType = 0 | 1 | 2 | 3
    /**
     * 0 = "SMBUS" | 1 = "PCIe"
     */
    export type PhysicalNicMedium = 0 | 1
  }
  export namespace EVENT_DATA {
    /**
     * 0 = unspecified | 1 = Monitor | 2 = Information | 4 = OK | 8 = Non-critical condition | 16 = Critical condition | 32 = Non-recoverable condition
     */
    export type EventSeverity = 0 | 1 | 2 | 4 | 8 | 16 | 32
  }
  export namespace GeneralSettings {
    /**
     * 0 = IPv4 | 1 = IPv6
     */
    export type PreferredAddressFamily = 0 | 1
    /**
     * 0 = Disabled | 1 = Enabled
     */
    export type AMTNetworkEnabled = 0 | 1
    /**
     * 0 = Default | 1 = Enhanced | 2 = Extreme
     */
    export type PrivacyLevel = 0 | 1 | 2
    /**
     * 0 = AC | 1 = DC
     */
    export type PowerSource = 0 | 1
    /**
     * 0=Disabled | 1=Enabled. Default: Enabled.
     * Available in Release 15.0 and later releases.
     */
    export type ThunderboltDockEnabled = 0 | 1
  }
  export namespace GenerateKeyPair {
    /**
     * 0 = RSA
     */
    export type KeyAlgorithm = 0
  }
  export namespace GeneratePKCS10RequestEx {
    /**
     * 0 = SHA1-RSA | 1 = SHA256-RSA
     */
    export type SigningAlgorithm = 0 | 1
  }
  export namespace IEEE8021xProfile {
    /**
     * 0 = TLS | 1 = TTLS_MSCHAPv2 | 2 = PEAP_MSCHAPv2 | 3 = EAP_GTC | 4 = EAPFAST_MSCHAPv2 | 5 = EAPFAST_GTC | 6 = EAPFAST_TLS
     */
    export type AuthenticationProtocol = 0 | 1 | 2 | 3 | 4 | 5 | 6
    /**
     * 0 = FullName | 1 = DomainSuffix
     */
    export type ServerCertificateNameComparison = 0 | 1
  }
  export namespace MPServer {
    /**
     * 3 = IPv4 Address | 4 = IPv6 Address | 201 = FQDN
     */
    export type InfoFormat = 3 | 4 | 201
    /**
     * 1 = Mutual Authentication | 2 = Username Password Authentication
     */
    export type AuthMethod = 1 | 2
  }
  export namespace RedirectionService {
    /**
     * 0 = Unknown | 1 = Other | 2 = Enabled | 3 = Disabled | 4 = Shutting Down | 5 = Not Applicable | 6 = Enabled but Offline | 7 = In Test | 8 = Deferred | 9 = Quiesce | 10 = Starting | 32768 = IDER and SOL are disabled |  32769 = IDER is enabled and SOL is disabled | 32770 = SOL is enabled and IDER is disabled | 32771 = IDER and SOL are enabled
     */
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 32768 | 32769 | 32770 | 32771
    /**
     * 32768 = disable IDER and SOL | 32769 = enable IDER and disable SOL | 32770 = enable SOL and disable IDER | 32771 = enable IDER and SOL
     */
    export type RequestedState = 32768 | 32769 | 32770 | 32771
  }
  export namespace RemoteAccessPolicyAppliesToMPS {
    /**
     * 0 = External MPS | 1 = Internal MPS | 2 = Both
     */
    export type MpsType = 0 | 1 | 2
  }
  export namespace RemoteAccessPolicyRule {
    /**
     * 0 = User Initiated | 1 = Alert | 2 = Periodic | 3 = Home Provisioning
     */
    export type Trigger = 0 | 1 | 2 | 3
  }
  export namespace SetupAndConfigurationService {
    /**
     * 1 = Admin Control Mode | 4 = Client Control Mode
     */
    export type ProvisioningMode = 1 | 4
  }
  export namespace SystemDefensePolicy {
    /**
     * 0 = Off | 1 = EventOnMatch | 2 = Count | 3 = Counting + EventOnMatch | 4 = On without Counting or EventOnMatch
     */
    export type AntiSpoofingSupport = 0 | 1 | 2 | 3 | 4
  }
  export namespace UserInitiatedConnectionService {
    /**
     * 32768 = All Interfaces disabled | 32769 = BIOS Interface enabled | 32770 = OS Interface enabled | 32771 = BIOS and OS Interfaces enabled
     */
    export type RequestedState = 32768 | 32769 | 32770 | 32771
  }
  export namespace WiFiPortConfigurationService {
    /**
     * 0 = Unknown | 2 = Enabled | 3 = Disabled | 4 = Shut Down | 5 = No Change | 6 = Offline | 7 = Test | 8 = Deferred | 9 = Quiesce | 10 = Reboot | 11 = Reset | 12 = Not Applicable
     */
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    /**
     * 0 = Unknown | 1 = Other | 2 = Enabled | 3 = Disabled | 4 = Shutting Down | 5 = Not Applicable | 6 = Enabled but Offline | 7 = In Test | 8 = Deferred | 9 = Quiesce | 10 = Starting
     */
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    /**
     * 0 = Unknown | 5 = OK | 10 = Degraded/Warning | 15 = Minor failure | 20 = Major failure | 25 = Critical failure | 30 = Non-recoverable error
     */
    export type HealthState = 0 | 5 | 10 | 15 | 20 | 25 | 30
    /**
     * 0 = Local synchronization disabled | 3 = Unrestricted synchronization
     */
    export type localProfileSynchronizationEnabled = 0 | 3
    /**
     * 0 = NoHostCsmeSoftwareRelaxedPolicy | 1 = NoHostCsmeSoftwareAggressivePolicy | 2 = Reserved
     */
    export type NoHostCsmeSoftwarePolicy = 0 | 1 | 2
    /**
     * 0 = Enable | 1 = Disable
     */
    export type UEFIWiFiProfileShareEnabled = 0 | 1
  }
}
