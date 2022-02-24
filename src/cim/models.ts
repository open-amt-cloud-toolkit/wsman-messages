/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { ReturnValue } from '../models/common'

export interface ManagedElement {
  Caption?: string
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
  RequestPowerStateChange_OUTPUT: ReturnValue
}

export interface NetworkPortConfigurationService extends Service {
}
