/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import * as CIM from '../cim'
import { NetworkPortConfigurationService } from '../cim/models'

export interface AMTAuthenticateObject {
  nonce?: number[]
  uuid?: string[]
  fqdn?: string
  fwVersion?: string
  amtSvn?: number
  signatureMechanism?: number
  signature?: number[]
  lengthOfCertificates?: number[]
  certificates?: number[]
}

export interface GeneralSettings extends CIM.Models.SettingData {
  NetworkInterfaceEnabled?: boolean
  DigestRealm?: string
  IdleWakeTimeout?: number
  HostName?: string
  DomainName?: string
  PingResponseEnabled?: boolean
  WsmanOnlyMode?: boolean
  PreferredAddressFamily?: number
  DHCPv6ConfigurationTimeout?: number
  DDNSUpdateByDHCPServerEnabled?: boolean
  SharedFQDN?: boolean
  HostOSFQDN?: string
  DDNSTTL?: number
  AMTNetworkEnabled?: number
  RmcpPingResponseEnabled?: boolean
  DDNSPeriodicUpdateInterval?: number
  PresenceNotificationInterval?: number
  PrivacyLevel?: number
  PowerSource?: number
  ThunderboltDockEnabled?: number
  AMTAuthenticate?: (mcNonce: number) => AMTAuthenticateObject
}

export interface GeneralSettingsResponse {
  AMT_GeneralSettings: GeneralSettings
}

export interface EthernetPortSettings extends CIM.Models.SettingData {
  VLANTag?: number
  SharedMAC?: boolean
  MACAddress?: string
  LinkIsUp?: boolean
  LinkPolicy?: number[]
  LinkPreference?: number
  LinkControl?: number
  SharedStaticIp?: boolean
  SharedDynamicIP?: boolean
  IpSyncEnabled?: boolean
  DHCPEnabled?: boolean
  IPAddress?: string
  SubnetMask?: string
  DefaultGateway?: string
  PrimaryDNS?: string
  SecondaryDNS?: string
  ConsoleTcpMaxRetransmissions?: number
  WLANLinkProtectionLevel?: number
  PhysicalConnectionType?: number
  PhysicalNicMedium?: number
  SetLinkPreferences?: (linkPreference: number, timeout: number) => number
  CancelLinkProtection?: () => number
  RestoreLinkProtection?: () => number
}

export interface MPServer {
  AccessInfo?: string
  InfoFormat?: number
  Port?: number
  AuthMethod?: number
  Username?: string
  Password?: string
  CommonName?: string
}

export interface RemoteAccessPolicyRule {
  Trigger?: number
  TunnelLifeTime?: number
  ExtendedData?: string
}

export interface SystemDefensePolicy extends CIM.Models.ManagedElement {
  PolicyName?: string
  PolicyPrecedence?: number
  AntiSpoofingSupport?: number
  FilterCreationHandles?: number[]
  TxDefaultDrop?: boolean
  TxDefaultMatchEvent?: boolean
  TxDefaultCount?: boolean
  RxDefaultDrop?: boolean
  RxDefaultMatchEvent?: boolean
  RxDefaultCount?: boolean
}

export interface EnvironmentDetectionSettingData extends CIM.Models.SettingData {
  DetectionAlgorithm?: number
  DetectionStrings?: string[]
  DetectionIPv6LocalPrefixes?: string[]
  SetSystemDefensePolicy?: (policy: SystemDefensePolicy) => number
  EnableVpnRouting?: (enable: boolean) => number
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
  FirmwareVerbosity?: number
  ConfigurationDataReset?: boolean
  IDERBootDevice?: number
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
  EventSeverity?: number
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
  EnabledState: number
}

export interface RedirectionResponse {
  AMT_RedirectionService: RedirectionService
}
export interface PublicKeyCertificate{
  // A user-friendly name for the object . . .
 ElementName:string
  // Within the scope of the instantiating Namespace, InstanceID opaquely and uniquely identifies an instance of this class.
 InstanceID :string
  // The X.509 Certificate blob.
   X509Certificate: string // uint8[4100]

  // For root certificate [that were added by AMT_PublicKeyManagementService.AddTrustedRootCertificate()]this property will be true.
  TrustedRootCertficate:boolean

  // The Issuer field of this certificate.
  Issuer:string

  // The Subject field of this certificate.
  Subject:string

  // Indicates whether the certificate is an Intel AMT self-signed certificate. If True, the certificate cannot be deleted.
  ReadOnlyCertificate:boolean

}
export interface TLSProtocolEndpointCollection extends CIM.Models.Collection {

}
export interface TLSCredentialContext {//  extends CIM.Models.CredentialContext{
// A certificate whose context is defined.
  ElementInContext: string
// The TLSProtocolEndpointCollection that provides context or scope for the Credential.
  ElementProvidingContext: string
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
export interface GenerateKeyPair{
  KeyAlgorithm: number
  KeyLength: number
}
export interface AddCertificate{
  CertificateBlob: string
}
export interface WiFiPortConfigurationService extends NetworkPortConfigurationService {
  RequestedState: number
  // RequestedState is an integer enumeration that indicates the last requested or desired state for the element, irrespective of the mechanism through which it was requested . . .
  EnabledState: number
  // EnabledState is an integer enumeration that indicates the enabled and disabled states of an element . . .
  HealthState: number
  // Indicates the current health of the element. . .
  ElementName: string
  // A user - friendly name for the object. . .
  SystemCreationClassName: string
  // The CreationClassName of the scoping System.
  SystemName: string
  // The Name of the scoping System.
  CreationClassName: string
  // CreationClassName indicates the name of the class or the subclass that is used in the creation of an instance. . .
  Name: string
  // The Name property uniquely identifies the Service and provides an indication of the functionality that is managed. . .
  localProfileSynchronizationEnabled: number
  // Administrator's policy regarding enablement of local profile synchronization.Remote profile synchronization is always enabled.
  LastConnectedSsidUnderMeControl: string
  // The SSID of the Wireless network that was last connected in ME Control state
  NoHostCsmeSoftwarePolicy: number
  // Setting Policy regarding no HOST CSME software.
  UEFIWiFiProfileShareEnabled: number
  // Enables or disables UEFI / CSME Wi - Fi Profile Sharing.
}

export interface RemoteAccessPolicyAppliesToMPS extends CIM.Models.PolicySetAppliesToElement{
  OrderOfAccess: number
  MpsType: number
}

export interface AlarmClockService extends CIM.Models.Service { }
