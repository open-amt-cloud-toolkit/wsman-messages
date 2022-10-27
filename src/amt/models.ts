/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM } from '../'
import { Types } from './types'

export namespace Models {
  export interface AMTAuthenticateObject {
    Nonce?: number[]
    UUID?: string[]
    FQDN?: string
    FWVersion?: string
    AMTSVN?: number
    SignatureMechanism?: Types.AMTAuthenticateObject.SignatureMechanism // ValueMap { "0","1..65535" } values { "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384","Reserved" }
    Signature?: number[]
    LengthOfCertificates?: number[]
    Certificates?: number[]
  }

  export interface GeneralSettings extends CIM.Models.SettingData {
    NetworkInterfaceEnabled?: boolean
    DigestRealm?: string
    IdleWakeTimeout?: number
    HostName?: string
    DomainName?: string
    PingResponseEnabled?: boolean
    WsmanOnlyMode?: boolean
    PreferredAddressFamily?: Types.GeneralSettings.PreferredAddressFamily
    DHCPv6ConfigurationTimeout?: number
    DDNSUpdateEnabled?: boolean
    DDNSUpdateByDHCPServerEnabled?: boolean
    SharedFQDN?: boolean
    HostOSFQDN?: string
    DDNSTTL?: number
    AMTNetworkEnabled?: Types.GeneralSettings.AMTNetworkEnabled
    RmcpPingResponseEnabled?: boolean
    DDNSPeriodicUpdateInterval?: number
    PresenceNotificationInterval?: number
    PrivacyLevel?: Types.GeneralSettings.PrivacyLevel
    PowerSource?: Types.GeneralSettings.PowerSource
    ThunderboltDockEnabled?: Types.GeneralSettings.ThunderboltDockEnabled
    OemID: number
  }

  export interface GeneralSettingsResponse {
    AMT_GeneralSettings: GeneralSettings
  }

  export interface EthernetPortSettings extends CIM.Models.SettingData {
    VLANTag?: number
    SharedMAC?: boolean
    MACAddress?: string
    LinkIsUp?: boolean
    LinkPolicy?: Types.EthernetPortSettings.LinkPolicy // ValueMap={1, 14, 16, 224} Values={available on S0 AC, available on Sx AC, available on S0 DC, available on Sx DC}
    LinkPreference?: Types.EthernetPortSettings.LinkPreference // ValueMap={1, 2, 3..} Values={ME, HOST, Reserved}
    LinkControl?: Types.EthernetPortSettings.LinkControl // ValueMap={1, 2, 3..} Values={ME, HOST, Reserved}
    SharedStaticIp?: boolean
    SharedDynamicIP?: boolean
    IpSyncEnabled?: boolean
    DHCPEnabled?: boolean
    IPAddress?: string
    SubnetMask?: string
    DefaultGateway?: string
    PrimaryDNS?: string
    SecondaryDNS?: string
    ConsoleTcpMaxRetransmissions?: Types.EthernetPortSettings.ConsoleTcpMaxRetransmissions // MinValue=5 MaxValue=7
    WLANLinkProtectionLevel?: Types.EthernetPortSettings.WLANLinkProtectionLevel // ValueMap={0, 1, 2, 3, 4..} Values={OVERRIDE, NONE, PASSIVE, HIGH, RESERVED}
    PhysicalConnectionType?: Types.EthernetPortSettings.PhysicalConnectionType // ValueMap={"0", "1", "2", "3", "4.."} Values={"Integrated LAN NIC", "Discrete LAN NIC", "LAN via a Thunderbolt dock", "Wireless LAN", "Reserved"}
    PhysicalNicMedium?: Types.EthernetPortSettings.PhysicalNicMedium // ValueMap={"0", "1", "2.."} Values={"SMBUS", "PCIe", "Reserved"}
  }

  export interface MPServer {
    AccessInfo?: string // MaxLen=256
    InfoFormat?: Types.MPServer.InfoFormat // ValueMap={3, 4, 201} Values={IPv4 Address, IPv6 Address, FQDN}
    Port?: number
    AuthMethod?: Types.MPServer.AuthMethod // ValueMap={1, 2} Values={Mutual Authentication, Username Password Authentication}
    Username?: string
    Password?: string
    CommonName?: string
  }

  export interface RemoteAccessPolicyRule {
    Trigger?: Types.RemoteAccessPolicyRule.Trigger
    TunnelLifeTime?: number
    ExtendedData?: string
  }

  export interface SystemDefensePolicy extends CIM.Models.ManagedElement {
    PolicyName?: string
    PolicyPrecedence?: number
    AntiSpoofingSupport?: Types.SystemDefensePolicy.AntiSpoofingSupport
    FilterCreationHandles?: number[]
    TxDefaultDrop?: boolean
    TxDefaultMatchEvent?: boolean
    TxDefaultCount?: boolean
    RxDefaultDrop?: boolean
    RxDefaultMatchEvent?: boolean
    RxDefaultCount?: boolean
  }

  export interface EnvironmentDetectionSettingData extends CIM.Models.SettingData {
    DetectionAlgorithm?: Types.EnvironmentDetectionSettingData.DetectionAlgorithm
    DetectionStrings?: string[]
    DetectionIPv6LocalPrefixes?: string[]
  }

  export interface BootCapabilities extends CIM.Models.ManagedElement {
    AMT_BootCapabilities: {
      // The user friendly name for this instance of Capabilities . . .
      ElementName: string
      // Within the scope of the instantiating Namespace, InstanceID opaquely and uniquely identifies an instance of this class . . .
      InstanceID: string
      // Indicates whether Intel(R) AMT device supports 'IDE Redirection'
      IDER: boolean
      // Indicates whether Intel(R) AMT device supports 'Serial Over Lan'
      SOL: boolean
      // Indicates whether Intel(R) AMT device supports 'BIOS Reflash'
      BIOSReflash: boolean
      // Indicates whether Intel(R) AMT device supports 'BIOS Setup'
      BIOSSetup: boolean
      // Indicates whether Intel(R) AMT device supports 'BIOS Pause'
      BIOSPause: boolean
      // Indicates whether Intel(R) AMT device supports 'Force PXE Boot'
      ForcePXEBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Force Hard Drive Boot'
      ForceHardDriveBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Force Hard Drive Safe Mode Boot'
      ForceHardDriveSafeModeBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Force Diagnostic Boot'
      ForceDiagnosticBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Force CD or DVD Boot'
      ForceCDorDVDBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Verbosity Screen Blank'
      VerbosityScreenBlank: boolean
      // Indicates whether Intel(R) AMT device supports 'Power Button Lock'
      PowerButtonLock: boolean
      // Indicates whether Intel(R) AMT device supports 'Reset Button Lock'
      ResetButtonLock: boolean
      // Indicates whether Intel(R) AMT device supports 'Keyboard Lock'
      KeyboardLock: boolean
      // Indicates whether Intel(R) AMT device supports 'Sleep Button Lock'
      SleepButtonLock: boolean
      // Indicates whether Intel(R) AMT device supports 'User Password Bypass'
      UserPasswordBypass: boolean
      // Indicates whether Intel(R) AMT device supports 'Forced Progress Events'
      ForcedProgressEvents: boolean
      // Indicates whether Intel(R) AMT device supports 'Verbosity/Verbose'
      VerbosityVerbose: boolean
      // Indicates whether Intel(R) AMT device supports 'Verbosity/Quiet'
      VerbosityQuiet: boolean
      // Indicates whether Intel(R) AMT device supports 'Configuration Data Reset'
      ConfigurationDataReset: boolean
      // Indicates whether Intel(R) AMT device supports 'BIOS Secure Boot'
      BIOSSecureBoot: boolean
      // Indicates whether Intel(R) AMT device supports 'Secure Erase'
      SecureErase: boolean
      // Supports Intel AMT invoking boot to WinRE
      ForceWinREBoot: boolean
      // Supports booting to an ISV’s PBA
      ForceUEFILocalPBABoot: boolean
      // Supports Intel AMT invoking HTTPS boot
      ForceUEFIHTTPSBoot: boolean
      // Determines whether Intel AMT is privileged by BIOS to disable secure boot for an AMT triggered boot option. If true, the BIOS allows Intel AMT to control the secure boot (i.e., to disable secure boot in recovery from HTTPS under certain conditions).
      AMTSecureBootControl: boolean
      // Read-only field, determines whether UEFI BIOS and Intel AMT WiFi profile share is supported.
      UEFIWiFiCoExistenceAndProfileShare: boolean
      // Indicates whether the Intel AMT device supports Remote Secure Platform Erase (i.e., whether the OEM's BIOS includes support for the feature), and shows the devices that can be erased.
      PlatformErase: number
    }
  }

  export interface BootSettingData extends CIM.Models.BootSettingData {
    UseSOL?: boolean
    UseSafeMode?: boolean
    ReflashBIOS?: boolean
    BIOSSetup?: boolean
    BIOSPause?: boolean
    LockPowerButton?: boolean
    LockResetButton?: boolean
    LockKeyboard?: boolean
    LockSleepButton?: boolean
    UserPasswordBypass?: boolean
    ForcedProgressEvents?: boolean
    FirmwareVerbosity?: Types.BootSettingData.FirmwareVerbosity // ValueMap={0, 1, 2, 3} Values={System default, Quiet - minimal screen activity, Verbose - all messages appear on the screen, Screen blank - no messages appear on the screen}
    ConfigurationDataReset?: boolean
    IDERBootDevice?: Types.BootSettingData.IDERBootDevice // ValueMap={0, 1} Values={Floppy Boot, CD Boot}
    UseIDER?: boolean
    EnforceSecureBoot?: boolean
    BootMediaIndex?: number
    SecureErase?: boolean
    RSEPassword?: string
    OptionsCleared?: boolean
    WinREBootEnabled?: boolean
    UEFILocalPBABootEnabled?: boolean
    UEFIHTTPSBootEnabled?: boolean
    SecureBootControlEnabled?: boolean
    BootguardStatus?: boolean
    BIOSLastStatus?: number[]
    UEFIBootParametersArray?: number[]
    UEFIBootNumberOfParams?: number[]
  }
  export interface BootSettingDataResponse {
    AMT_BootSettingData: BootSettingData
  }

  export interface SetupAndConfigurationService extends CIM.Models.CredentialManagementService {
    AMT_SetupAndConfigurationService: {
      CreationClassName: string
      ElementName: string
      EnabledState: string
      Name: string
      PasswordModel: string
      ProvisioningMode: string
      ProvisioningServerOTP: string
      ProvisioningState: string
      RequestedState: string
      SystemCreationClassName: string
      SystemName: string
      ZeroTouchConfigurationEnabled: string
    }
  }

  export interface MessageLog extends CIM.Models.MessageLog { }

  // Event Log Records have no header and the record data is combined of 21 binary bytes which could be read as EVENT_DATA
  export interface EVENT_DATA {
    DeviceAddress?: number
    EventSensorType?: number
    EventType?: number
    EventOffset?: number
    EventSourceType?: number
    EventSeverity?: Types.EVENT_DATA.EventSeverity
    SensorNumber?: number
    Entity?: number
    EntityInstance?: number
    EventData?: number[]
    TimeStamp?: Date
  }
  export interface AuditLog_ReadRecords {
    ReadRecords_OUTPUT: {
      TotalRecordCount: string
      RecordsReturned: string
      EventRecords: string[]
      ReturnValue: string
    }
  }

  export interface RedirectionService {
    // The Name property uniquely identifies the Service and provides an indication of the functionality that is managed . . .
    Name: string
    // CreationClassName indicates the name of the class or the subclass that is used in the creation of an instance . . .
    CreationClassName: string
    // The Name of the scoping System.
    SystemName: string
    // The CreationClassName of the scoping System.
    SystemCreationClassName: string
    // A user-friendly name for the object . . .
    ElementName: string
    // Describes the listener state of this service . . .
    ListenerEnabled: boolean
    // A list of string elements, describing recent IDE redirection operations . . .
    AccessLog: string
    // EnabledState is an integer enumeration that indicates the enabled and disabled states of an element . . .
    EnabledState: Types.RedirectionService.EnabledState // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11..32767, 32768, 32769, 32770, 32771, 32772..65535} Values={Unknown, Other, Enabled, Disabled, Shutting Down, Not Applicable, Enabled but Offline, In Test, Deferred, Quiesce, Starting, DMTF Reserved, IDER and SOL are disabled, IDER is enabled and SOL is disabled, SOL is enabled and IDER is disabled, IDER and SOL are enabled, Vendor Reserved}
  }

  export interface RedirectionResponse {
    AMT_RedirectionService: RedirectionService
  }
  export interface PublicKeyCertificate {
    ElementName: string // A user-friendly name for the object . . .
    InstanceID: string // Within the scope of the instantiating Namespace, InstanceID opaquely and uniquely identifies an instance of this class.
    X509Certificate: string // uint8[4100] // The X.509 Certificate blob.
    TrustedRootCertficate: boolean // For root certificate [that were added by AMT_PublicKeyManagementService.AddTrustedRootCertificate()]this property will be true.
    Issuer: string // The Issuer field of this certificate.
    Subject: string // The Subject field of this certificate.
    ReadOnlyCertificate: boolean // Indicates whether the certificate is an Intel AMT self-signed certificate. If True, the certificate cannot be deleted.
  }
  export interface TLSProtocolEndpointCollection extends CIM.Models.Collection {

  }
  export interface TLSCredentialContext {//  extends CIM.Models.CredentialContext{
    // A certificate whose context is defined.
    ElementInContext: {
      Address: string,
      ReferenceParameters: {
        ResourceURI: string,
        SelectorSet: {
          Selector: {
            _: string,
            $: {
              Name: string
            }
          }
        }
      }
    }
    // The TLSProtocolEndpointCollection that provides context or scope for the Credential.
    ElementProvidingContext: {
      Address: string,
      ReferenceParameters: {
        ResourceURI: string,
        SelectorSet: {
          Selector: {
            _: string,
            $: {
              Name: string
            }
          }
        }
      }
    }
  }

  export interface TLSSettingData extends CIM.Models.SettingData {
    MutualAuthentication: boolean
    // Adminstrator-settable property that determines whether or not mutual authentication is used at the TLS layer is used on the associated service access point . . .
    Enabled: boolean
    // Administrator-settable property that determines whether or not TLS is used on the associated service access point.
    TrustedCN: string
    // An array of strings, used to validate the CN subfield of the subject field in X.509 certificates presented to Intel(R) AMT in the TLS handshake . . .
    AcceptNonSecureConnections: boolean
    // This setting defines once TLS is enabled and configured whether non-secure EOI/WSMAN connections are still accepted by FW on ports 16992 and 623 . . .
    NonSecureConnectionsSupported: boolean
    // If the value of this read-only field is True, the value of AcceptNonSecureConnections can be changed. Note that this class and field can be accessed locally as well as remotely.
  }

  export interface GenerateKeyPair {
    KeyAlgorithm: Types.GenerateKeyPair.KeyAlgorithm
    KeyLength: number
  }
  export interface AddCertificate {
    CertificateBlob: string
  }

  export interface WiFiPortConfigurationService extends CIM.Models.NetworkPortConfigurationService {
    RequestedState: Types.WiFiPortConfigurationService.RequestedState // ValueMap={0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, .., 32768..65535} Values={Unknown, Enabled, Disabled, Shut Down, No Change, Offline, Test, Deferred, Quiesce, Reboot, Reset, Not Applicable, DMTF Reserved, Vendor Reserved}
    EnabledState: Types.WiFiPortConfigurationService.EnabledState // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11..32767, 32768..65535} Values={Unknown, Other, Enabled, Disabled, Shutting Down, Not Applicable, Enabled but Offline, In Test, Deferred, Quiesce, Starting, DMTF Reserved, Vendor Reserved}
    HealthState: Types.WiFiPortConfigurationService.HealthState // ValueMap={0, 5, 10, 15, 20, 25, 30, .., 32768..65535} Values={Unknown, OK, Degraded/Warning, Minor failure, Major failure, Critical failure, Non-recoverable error, DMTF Reserved, Vendor Specific}
    ElementName: string
    SystemCreationClassName: string
    SystemName: string
    CreationClassName: string
    Name: string
    localProfileSynchronizationEnabled: Types.WiFiPortConfigurationService.localProfileSynchronizationEnabled // ValueMap={0, 1..2, 3, 4..} Values={Local synchronization disabled, Vendor Reserved, Unrestricted synchronization, Reserved}
    LastConnectedSsidUnderMeControl: string
    NoHostCsmeSoftwarePolicy: Types.WiFiPortConfigurationService.NoHostCsmeSoftwarePolicy // ValueMap={0, 1, 2} Values={NoHostCsmeSoftwareRelaxedPolicy, NoHostCsmeSoftwareAggressivePolicy, Reserved}
    UEFIWiFiProfileShareEnabled: Types.WiFiPortConfigurationService.UEFIWiFiProfileShareEnabled // 1: Enable 0: Disable
  }

  export interface RemoteAccessPolicyAppliesToMPS extends CIM.Models.PolicySetAppliesToElement {
    OrderOfAccess: number
    MpsType: Types.RemoteAccessPolicyAppliesToMPS.MpsType // ValueMap={0, 1, 2} Values={External MPS, Internal MPS, Both}
  }

  export interface AlarmClockService extends CIM.Models.Service { }
}
