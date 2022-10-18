/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { ReturnValue } from '../models/common'
import * as Common from '../models/common'

export interface ManagedElement {
  Caption?: string // Max Length 64
  Description?: string
  ElementName?: string
}

export interface ManagedSystemElement extends ManagedElement {
  InstallDate?: Date
  Name?: string
  OperationalStatus?: number[]
  StatusDescriptions?: string[]
  Status?: string
  HealthState?: number
}

export interface PhysicalElement extends ManagedSystemElement {
  Tag?: string
  CreationClassName?: string
  Manufacturer?: string
  Model?: string
  Sku?: string
  SerialNumber?: string
  Version?: string
  PartNumber?: string
  OtherIdentifyingInfo?: string
  PoweredOn?: boolean
  ManufactureDate?: Date
  VendorEquipmentType?: string
  UserTracking?: string
  CanBeFRUed?: boolean
}

export interface PhysicalComponent extends PhysicalElement {
  RemovalConditions?: number
  Removable?: boolean
  Replaceable?: boolean
  HotSwappable?: boolean
}

export interface Chip extends PhysicalComponent {
  OperationalStatus?: number[]
  Tag?: string
  CreationClassName?: string
  ElementName?: string
  Manufacturer?: string
  Version?: string
  CanBeFRUed?: boolean
}

export interface PhysicalMemory extends Chip {
  FormFactor?: number
  MemoryType?: number
  Speed?: number
  Capacity?: number
  BankLabel?: string
  ConfiguredMemoryClockSpeed?: number
  IsSpeedInMhz?: boolean
  MaxMemorySpeed?: number
}

export interface PhysicalPackage extends PhysicalElement {
  PackageType?: number
}

export interface Card extends PhysicalPackage { }

export interface PhysicalFrame extends PhysicalPackage {
  VendorCompatibilityStrings?: string[]
  OtherPackageType?: string
  Weight?: number
  Width?: number
  Depth?: number
  Height?: number
  RemovalConditions?: number
  Removable?: boolean
  Replaceable?: boolean
  HotSwappable?: boolean
  CableManagementStrategy?: string
  ServicePhilosophy?: number[]
  ServiceDescriptions?: string[]
  LockPresent?: boolean
  AudibleAlarm?: boolean
  VisibleAlarm?: boolean
  SecurityBreach?: number
  BreachDescription?: string
  IsLocked?: boolean
}

export interface Chassis extends PhysicalFrame {
  ChassisPackageType?: number
}

export interface LogicalElement extends ManagedSystemElement { }

export interface SoftwareElement extends LogicalElement {
  Version?: string
  SoftwareElementState?: number
  SoftwareElementId?: string
  TargetOperatingSystem?: number
  OtherTargetOs?: string
  Manufacturer?: string
  BuildNumber?: string
  SerialNumber?: string
  CodeSet?: string
  IdentificationCode?: string
  LanguageEdition?: string
}

export interface BIOSElement extends SoftwareElement {
  PrimaryBIOS?: boolean
  ReleaseDate?: Date
}

export interface Job extends LogicalElement {
  InstanceId?: string
  CommunicationStatus?: number
  DetailedStatus?: number
  OperatingStatus?: number
  PrimaryStatus?: number
  JobStatus?: string
  TimeSubmitted?: Date
  ScheduledStartTime?: Date
  StartTime?: Date
  ElapsedTime?: Date
  JobRunTimes?: number
  RunMonth?: number
  RunDay?: number
  RunDayOfWeek?: number
  RunStartInterval?: Date
  LocalOrUtcTime?: number
  Notify?: string
  Owner?: string
  Priority?: number
  PercentComplete?: number
  DeleteOnCompletion?: boolean
  ErrorCode?: number
  ErrorDescription?: string
  RecoveryAction?: number
  OtherRecoveryAction?: string
}

export interface ConcreteJob extends Job {
  UntilTime?: Date
  JobState?: number
  TimeOfLastStateChange?: Date
  TimeBeforeRemoval?: Date
}

export interface EnabledLogicalElement extends LogicalElement {
  EnabledState?: number
  OtherEnabledState?: string
  RequestedState?: number
  EnabledDefault?: number
  TimeOfLastStateChange?: Date
  RequestStateChange?: (
    RequestedState: number,
    TimeoutPeriod?: Date
  ) => ConcreteJob
}

export interface LogicalDevice extends EnabledLogicalElement {
  SystemCreationClassName?: string
  SystemName?: string
  CreationClassName?: string
  DeviceId?: string
  PowerManagementSupported?: boolean
  PowerManagementCapabilities?: number[]
  Availability?: number
  StatusInfo?: number
  LastErrorCode?: number
  ErrorDescription?: string
  ErrorCleared?: boolean
  OtherIdentifyingInfo?: string[]
  PowerOnHours?: number
  TotalPowerOnHours?: number
  IdentifyingDescriptions?: string[]
  AdditionalAvailability?: number[]
  MaxQuiesceTime?: number
  Reset?: () => number
  SaveProperties?: () => number
  RestoreProperties?: () => number
}

export interface Processor extends LogicalDevice {
  Role?: string
  Family?: number
  OtherFamilyDescription?: string
  UpgradeMethod?: number
  MaxClockSpeed?: number
  CurrentClockSpeed?: number
  Stepping?: string
  CPUStatus?: number
  ExternalBusClockSpeed?: number
}

export interface MediaAccessDevice extends LogicalDevice {
  Capabilities?: number[]
  MaxMediaSize?: number
  Security?: number
}

export interface Service extends EnabledLogicalElement {
  SystemCreationClassName?: string
  SystemName?: string
  CreationClassName?: string
  PrimaryOwnerName?: string
  PrimaryOwnerContact?: string
  StartMode?: string
  Started?: boolean
  StartService?: () => number
  StopService?: () => number
}

export interface SecurityService extends Service { }

export interface SettingData extends ManagedElement {
  InstanceID?: string
}

// To do: Fix the typing on Dependent and Antecedent
export interface Dependency {
  Antecedent: any
  Dependent: any
}

export interface SystemPackaging extends Dependency { }

export interface ComputerSystemPackage extends SystemPackaging {
  PlatformGuid?: string
}

export interface LogicalPort extends LogicalDevice {
  Speed?: number
  MaxSpeed?: number
  RequestedSpeed?: number
  UsageRestriction?: number
  PortType?: number
  OtherPortType?: string
}

export interface NetworkPort extends LogicalPort {
  PortNumber?: number
  LinkTechnology?: number
  OtherLinkTechnology?: string
  PermanentAddress?: string
  NetworkAddresses?: string[]
  FullDuplex?: boolean
  AutoSense?: boolean
  SupportedMaximumTransmissionUnit?: number
  ActiveMaximumTransmissionUnit?: number
}

export interface EthernetPort extends NetworkPort { }

export interface BootSettingData extends SettingData {
  OwningEntity?: string
}

export interface Collection extends ManagedElement { }

export interface Role extends Collection {
  CreationClassName?: string
  Name?: string
  CommonName?: string
  RoleCharacteristics?: number[]
}

export interface AuthenticationService extends SecurityService {
}

export interface CredentialManagementService extends AuthenticationService {
  // InstanceID is an optional property that may be used to opaquely and uniquely identify an instance of this class within the scope of the instantiating Namespace . . .
  InstanceID: string
}

export interface Credential extends ManagedElement{
  Issued?: Date // The date and time when the credential was issued.  Default is current time
  Expires?: Date // The date and time when the credential expires (and is not appropriate for use for authentication/ authorization).  Default is '99991231235959.999999+999'
}

export interface CredentialContext {
  // A Credential whose context is defined.
  ElementInContext: Credential
  // The ManagedElement that provides context or scope for the Credential.
  ElementProvidingContext: ManagedElement
}

export interface ServiceAvailableToElement {
  ServiceProvided: {
    Address: string
    ReferenceParameters: {
      ResourceURI: string
      SelectorSet: {
        Selector: string[]
      }
    }
  }
  UserOfService: {
    Address: string
    ReferenceParameters: {
      ResourceURI: string
      SelectorSet: {
        Selector: string[]
      }
    }
  }
}

export interface AssociatedPowerManagementService extends ServiceAvailableToElement {
  CIM_AssociatedPowerManagementService: {
    AvailableRequestedPowerStates: string[]
    PowerState: string
  } & ServiceAvailableToElement
}

export interface SoftwareIdentity
  extends LogicalElement {
  CIM_SoftwareIdentity: Array<
    {
      InstanceID: string
      VersionString: string
      IsEntity: boolean
    } & LogicalElement
  >
}

export interface Log extends EnabledLogicalElement {
  MaxNumberOfRecords: number
  CurrentNumberOfRecords: number
  OverwritePolicy: number
  LogState: number
}

export interface MessageLog extends Log {
  CreationClassName: string
  Capabilities: number[]
  CapabilitiesDescriptions: string[]
  MaxLogSize: number
  SizeOfHeader: number
  HeaderFormat: string
  MaxRecordSize: number
  SizeOfRecordHeader: number
  RecordHeaderFormat: string
  OtherPolicyDescription: string
  TimeWhenOutdated: Date
  PercentageNearFull: number
  LastChange: number
  TimeOfLastChange: Date
  RecordLastChanged: number
  IsFrozen: boolean
  CharacterSet: number
}

export interface KVMRedirectionSAP {
  Name: string
  CreationClassName: string
  SystemName: string
  SystemCreationClassName: string
  ElementName: string
  EnabledState: number
  RequestedState: number
  KVMProtocol: number
}

export interface KVMRedirectionSAPResponse {
  CIM_KVMRedirectionSAP: KVMRedirectionSAP
}

export interface PowerActionResponse {
  RequestPowerStateChange_OUTPUT: Common.ReturnValue
}

export interface WiFiEndpointSettings extends SettingData {
  ElementName: string
  InstanceID: string
  Priority: number
  SSID?: string // Max Length 32
  BSSType?: 0 | 2 | 3
  EncryptionMethod: 1 | 2 | 3 | 4 | 5
  // ValueMap={1, 2, 3, 4, 5, 6..}
  // Values={Other, WEP, TKIP, CCMP, None, DMTF Reserved}
  AuthenticationMethod: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 32768 | 32769
  // ValueMap={1, 2, 3, 4, 5, 6, 7, 8..32767, 32768, 32769, 32770..}
  // Values={Other, Open System, Shared Key, WPA PSK, WPA IEEE 802.1x, WPA2 PSK, WPA2 IEEE 802.1x, DMTF Reserved, WPA3 SAE, WPA3 OWE, Vendor Reserved}
  Keys?: string[4] // OctetString ArrayType=Indexed Max Length 256
  KeyIndex?: number
  PSKValue?: number // OctetString
  PSKPassPhrase?: string // Min Length 8 Max Length 63
}

export interface NetworkPortConfigurationService extends Service { }

export interface Policy extends ManagedElement {
  CommonName: string
  PolicyKeywords: string[]
}

export interface PolicySet extends Policy {
  PolicyDecisionStrategy: number
  PolicyRoles: string[]
  Enabled: number
}
export interface PolicySetAppliesToElement {
  PolicySet: PolicySet
  ManagedElement: ManagedElement
}

export interface IEEE8021xSettings extends SettingData {
  AuthenticationProtocol: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ..}
  // Values={EAP-TLS, EAP-TTLS/MSCHAPv2, PEAPv0/EAP-MSCHAPv2, PEAPv1/EAP-GTC, EAP-FAST/MSCHAPv2, EAP-FAST/GTC, EAP-MD5, EAP-PSK, EAP-SIM, EAP-AKA, EAP-FAST/TLS, DMTF Reserved}
  // MappingStrings={RFC4017.IETF, RFC2716.IETF, draft-ietf-pppext-eap-ttls.IETF, draft-kamath-pppext-peapv0.IETF, draft-josefsson-pppext-eap-tls-eap, RFC4851.IETF, RFC3748.IETF, RFC4764.IETF, RFC4186.IETF, RFC4187.IETF}
  RoamingIdentity: string // Max Length 80
  ServerCertificateName?: string // Max Length 80
  ServerCertificateNameComparison?: 1 | 2 | 3
  // ValueMap={1, 2, 3, ..}
  // Values={Other, FullName, DomainSuffix, DMTF Reserved}
  // ModelCorrespondence={CIM_IEEE8021xSettings.ServerCertificateName}
  Username?: string // Max Length 128
  Password?: string // Max Length 256
  Domain?: string // Max Length 256
  ProtectedAccessCredential?: string // OctetString Write-Only
  PACPassword?: string // Max Length 256 Write-Only
  PSK?: string // OctetString Write-Only
}
