/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { Common } from '../'
import { Types } from './types'

export namespace Models {
  export interface ManagedElement {
    Caption?: string // MaxLen=64
    Description?: string // MaxLen=256
    ElementName?: string // MaxLen=256
  }

  export interface ManagedSystemElement extends ManagedElement {
    InstallDate?: Date
    Name?: string // MaxLen=1024
    OperationalStatus?: Types.ManagedSystemElement.OperationalStatus // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, .., 0x8000..} Values={Unknown, Other, OK, Degraded, Stressed, Predictive Failure, Error, Non-Recoverable Error, Starting, Stopping, Stopped, In Service, No Contact, Lost Communication, Aborted, Dormant, Supporting Entity in Error, Completed, Power Mode, Relocating, DMTF Reserved, Vendor Reserved} ArrayType=Indexed
    StatusDescriptions?: string[] // ArrayType=Indexed MaxLen=256
    Status?: string // ValueMap={OK, Error, Degraded, Unknown, Pred Fail, Starting, Stopping, Service, Stressed, NonRecover, No Contact, Lost Comm, Stopped} MaxLen=10
    HealthState?: Types.ManagedSystemElement.HealthState // ValueMap={0, 5, 10, 15, 20, 25, 30, .., 32768..65535} Values={Unknown, OK, Degraded/Warning, Minor failure, Major failure, Critical failure, Non-recoverable error, DMTF Reserved, Vendor Specific}
  }

  export interface PhysicalElement extends ManagedSystemElement {
    Tag?: string // MaxLen=256
    CreationClassName?: string // MaxLen=256
    Manufacturer?: string // MaxLen=256
    Model?: string // MaxLen=256
    Sku?: string // MaxLen=64
    SerialNumber?: string // MaxLen=256
    Version?: string // MaxLen=64
    PartNumber?: string // MaxLen=256
    OtherIdentifyingInfo?: string // MaxLen=256
    PoweredOn?: boolean
    ManufactureDate?: Date
    VendorEquipmentType?: string // MaxLen=256
    UserTracking?: string // MaxLen=256
    CanBeFRUed?: boolean
  }

  export interface PhysicalComponent extends PhysicalElement {
    RemovalConditions?: Types.PhysicalComponent.RemovalConditions // ValueMap={0, 2, 3, 4} Values={Unknown, Not Applicable, Removable when off, Removable when on or off}
    Removable?: boolean
    Replaceable?: boolean
    HotSwappable?: boolean
  }

  export interface Chip extends PhysicalComponent {
    Tag?: string // MaxLen=65
    CreationClassName?: string // MaxLen=10
    ElementName?: string // MaxLen=65
    Manufacturer?: string // MaxLen=64
    Version?: string // MaxLen=64
    CanBeFRUed?: boolean
  }

  export interface PhysicalMemory extends Chip {
    FormFactor?: number
    MemoryType?: Types.PhysicalMemory.MemoryType // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35..32567, 32568..65535} Values={Unknown, Other, DRAM, Synchronous DRAM, Cache DRAM, EDO, EDRAM, VRAM, SRAM, RAM, ROM, Flash, EEPROM, FEPROM, EPROM, CDRAM, 3DRAM, SDRAM, SGRAM, RDRAM, DDR, DDR-2, BRAM, FB-DIMM, DDR3, FBD2, DDR4, LPDDR, LPDDR2, LPDDR3, LPDDR4, Logical non-volatile device, HBM (High Bandwidth Memory), HBM2 (High Bandwidth Memory Generation 2), DDR5, LPDDR5, DMTF Reserved, Vendor Reserved}
    Speed?: number // Units=NanoSeconds
    Capacity?: number // Units=Bytes
    BankLabel?: string // MaxLen=64
    ConfiguredMemoryClockSpeed?: number // Units=MegaHertz
    IsSpeedInMhz?: boolean
    MaxMemorySpeed?: number // Units=MegaHertz
  }

  export interface PhysicalPackage extends PhysicalElement {
    PackageType?: Types.PhysicalPackage.PackageType // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17} Values={Unknown, Other, Rack, Chassis/Frame, Cross Connect/Backplane, Container/Frame Slot, Power Supply, Fan, Sensor, Module/Card, Port/Connector, Battery, Processor, Memory, Power Source/Generator, Storage Media Package (e.g., Disk or Tape Drive), Blade, Blade Expansion}
  }

  export interface Card extends PhysicalPackage { }

  export interface PhysicalFrame extends PhysicalPackage {
    VendorCompatibilityStrings?: string[] // MaxLen=256
    OtherPackageType?: string // MaxLen=256
    Weight?: number // Units=Pounds
    Width?: number // Units=Inches
    Depth?: number // Units=Inches
    Height?: number // Units=Inches
    RemovalConditions?: Types.PhysicalFrame.RemovalConditions // ValueMap={0, 2, 3, 4} Values={Unknown, Not Applicable, Removable when off, Removable when on or off}
    Removable?: boolean
    Replaceable?: boolean
    HotSwappable?: boolean
    CableManagementStrategy?: string // MaxLen=256
    ServicePhilosophy?: Types.PhysicalFrame.ServicePhilosophy // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8} Values={Unknown, Other, Service From Top, Service From Front, Service From Back, Service From Side, Sliding Trays, Removable Sides, Moveable} ArrayType=Indexed
    ServiceDescriptions?: string[] // ArrayType=Indexed MaxLen=256
    LockPresent?: boolean
    AudibleAlarm?: boolean
    VisibleAlarm?: boolean
    SecurityBreach?: Types.PhysicalFrame.SecurityBreach // ValueMap={1, 2, 3, 4, 5} Values={Other, Unknown, No Breach, Breach Attempted, Breach Successful}
    BreachDescription?: string // MaxLen=256
    IsLocked?: boolean
  }

  export interface Chassis extends PhysicalFrame {
    ChassisPackageType?: Types.Chassis.ChassisPackageType // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, .., 0x8000..0xFFFF} Values={Unknown, Other, SMBIOS Reserved, Desktop, Low Profile Desktop, Pizza Box, Mini Tower, Tower, Portable, LapTop, Notebook, Hand Held, Docking Station, All in One, Sub Notebook, Space-Saving, Lunch Box, Main System Chassis, Expansion Chassis, SubChassis, Bus Expansion Chassis, Peripheral Chassis, Storage Chassis, SMBIOS Reserved, Sealed-Case PC, SMBIOS Reserved, CompactPCI, AdvancedTCA, Blade Enclosure, SMBIOS Reserved, Tablet, Convertible, Detachable, IoT Gateway, Embedded PC, Mini PC, Stick PC, DMTF Reserved, Vendor Reserved}
  }

  export interface LogicalElement extends ManagedSystemElement { }

  export interface SoftwareElement extends LogicalElement {
    Version?: string // MaxLen=64
    SoftwareElementState?: Types.SoftwareElement.SoftwareElementState // ValueMap={0, 1, 2, 3} Values={Deployable, Installable, Executable, Running}
    SoftwareElementId?: string // MaxLen=256
    TargetOperatingSystem?: Types.SoftwareElement.TargetOperatingSystem // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113} Values={Unknown, Other, MACOS, ATTUNIX, DGUX, DECNT, Tru64 UNIX, OpenVMS, HPUX, AIX, MVS, OS400, OS/2, JavaVM, MSDOS, WIN3x, WIN95, WIN98, WINNT, WINCE, NCR3000, NetWare, OSF, DC/OS, Reliant UNIX, SCO UnixWare, SCO OpenServer, Sequent, IRIX, Solaris, SunOS, U6000, ASERIES, HP NonStop OS, HP NonStop OSS, BS2000, LINUX, Lynx, XENIX, VM, Interactive UNIX, BSDUNIX, FreeBSD, NetBSD, GNU Hurd, OS9, MACH Kernel, Inferno, QNX, EPOC, IxWorks, VxWorks, MiNT, BeOS, HP MPE, NextStep, PalmPilot, Rhapsody, Windows 2000, Dedicated, OS/390, VSE, TPF, Windows (R) Me, Caldera Open UNIX, OpenBSD, Not Applicable, Windows XP, z/OS, Microsoft Windows Server 2003, Microsoft Windows Server 2003 64-Bit, Windows XP 64-Bit, Windows XP Embedded, Windows Vista, Windows Vista 64-Bit, Windows Embedded for Point of Service, Microsoft Windows Server 2008, Microsoft Windows Server 2008 64-Bit, FreeBSD 64-Bit, RedHat Enterprise Linux, RedHat Enterprise Linux 64-Bit, Solaris 64-Bit, SUSE, SUSE 64-Bit, SLES, SLES 64-Bit, Novell OES, Novell Linux Desktop, Sun Java Desktop System, Mandriva, Mandriva 64-Bit, TurboLinux, TurboLinux 64-Bit, Ubuntu, Ubuntu 64-Bit, Debian, Debian 64-Bit, Linux 2.4.x, Linux 2.4.x 64-Bit, Linux 2.6.x, Linux 2.6.x 64-Bit, Linux 64-Bit, Other 64-Bit, Microsoft Windows Server 2008 R2, VMware ESXi, Microsoft Windows 7, CentOS 32-bit, CentOS 64-bit, Oracle Enterprise Linux 32-bit, Oracle Enterprise Linux 64-bit, eComStation 32-bitx, Microsoft Windows Server 2011, Microsoft Windows Server 2011 64-Bit, Microsoft Windows Server 8}
    OtherTargetOs?: string // MaxLen=64
    Manufacturer?: string // MaxLen=256
    BuildNumber?: string // MaxLen=64
    SerialNumber?: string // MaxLen=64
    CodeSet?: string // MaxLen=64
    IdentificationCode?: string // MaxLen=64
    LanguageEdition?: string // MaxLen=32
  }

  export interface BIOSElement extends SoftwareElement {
    PrimaryBIOS?: boolean
    ReleaseDate?: Date
  }

  export interface Job extends LogicalElement {
    InstanceId?: string // MaxLen=256
    CommunicationStatus?: Types.Job.CommunicationStatus // ValueMap={0, 1, 2, 3, 4, .., 0x8000..} Values={Unknown, Not Available, Communication OK, Lost Communication, No Contact, DMTF Reserved, Vendor Reserved}
    DetailedStatus?: Types.Job.DetailedStatus // ValueMap={0, 1, 2, 3, 4, 5, .., 0x8000..} Values={Not Available, No Additional Information, Stressed, Predictive Failure, Non-Recoverable Error, Supporting Entity in Error, DMTF Reserved, Vendor Reserved}
    OperatingStatus?: Types.Job.OperatingStatus // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, .., 0x8000..} Values={Unknown, Not Available, Servicing, Starting, Stopping, Stopped, Aborted, Dormant, Completed, Migrating, Emigrating, Immigrating, Snapshotting, Shutting Down, In Test, Transitioning, In Service, DMTF Reserved, Vendor Reserved}
    PrimaryStatus?: Types.Job.PrimaryStatus // ValueMap={0, 1, 2, 3, .., 0x8000..} Values={Unknown, OK, Degraded, Error, DMTF Reserved, Vendor Reserved}
    JobStatus?: string // MaxLen=256
    TimeSubmitted?: Date
    ScheduledStartTime?: Date
    StartTime?: Date
    ElapsedTime?: Date
    JobRunTimes?: number
    RunMonth?: Types.Job.RunMonth // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11} Values={January, February, March, April, May, June, July, August, September, October, November, December}
    RunDay?: Types.Job.RunDay // MinValue=-31 MaxValue=31
    RunDayOfWeek?: Types.Job.RunDayOfWeek // ValueMap={-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7} Values={-Saturday, -Friday, -Thursday, -Wednesday, -Tuesday, -Monday, -Sunday, ExactDayOfMonth, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}
    RunStartInterval?: Date
    LocalOrUtcTime?: Types.Job.LocalOrUtcTime // ValueMap={1, 2} Values={Local Time, UTC Time}
    Notify?: string // MaxLen=256
    Owner?: string // MaxLen=256
    Priority?: number
    PercentComplete?: number // Units=Percent MinValue=0 MaxValue=101
    DeleteOnCompletion?: boolean
    ErrorCode?: number
    ErrorDescription?: string // MaxLen=256
    RecoveryAction?: Types.Job.RecoveryAction // ValueMap={0, 1, 2, 3, 4, 5} Values={Unknown, Other, Do Not Continue, Continue With Next Job, Re-run Job, Run Recovery Job}
    OtherRecoveryAction?: string // MaxLen=256
  }

  export interface ConcreteJob extends Job {
    UntilTime?: Date
    JobState?: Types.ConcreteJob.JobState // ValueMap={2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13..32767, 32768..65535} Values={New, Starting, Running, Suspended, Shutting Down, Completed, Terminated, Killed, Exception, Service, Query Pending, DMTF Reserved, Vendor Reserved}
    TimeOfLastStateChange?: Date
    TimeBeforeRemoval?: Date
  }

  export interface EnabledLogicalElement extends LogicalElement {
    EnabledState?: Types.EnabledLogicalElement.EnabledState // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11..32767, 32768..65535} Values={Unknown, Other, Enabled, Disabled, Shutting Down, Not Applicable, Enabled but Offline, In Test, Deferred, Quiesce, Starting, DMTF Reserved, Vendor Reserved}
    OtherEnabledState?: string // MaxLen=256
    RequestedState?: Types.EnabledLogicalElement.RequestedState // ValueMap={0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, .., 32768..65535} Values={Unknown, Enabled, Disabled, Shut Down, No Change, Offline, Test, Deferred, Quiesce, Reboot, Reset, Not Applicable, DMTF Reserved, Vendor Reserved}
    EnabledDefault?: Types.EnabledLogicalElement.EnabledDefault // ValueMap={2, 3, 5, 6, 7, 9, .., 32768..65535} Values={Enabled, Disabled, Not Applicable, Enabled but Offline, No Default, Quiesce, DMTF Reserved, Vendor Reserved}
    TimeOfLastStateChange?: Date
  }

  export interface LogicalDevice extends EnabledLogicalElement {
    SystemCreationClassName?: string // MaxLen=256
    SystemName?: string // MaxLen=256
    CreationClassName?: string // MaxLen=256
    DeviceId?: string // MaxLen=64
    PowerManagementSupported?: boolean
    PowerManagementCapabilities?: Types.LogicalDevice.PowerManagementCapabilities // ValueMap={0, 1, 2, 3, 4, 5, 6, 7} Values={Unknown, Not Supported, Disabled, Enabled, Power Saving Modes Entered Automatically, Power State Settable, Power Cycling Supported, Timed Power On Supported}
    Availability?: Types.LogicalDevice.Availability // ValueMap={1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21} Values={Other, Unknown, Running/Full Power, Warning, In Test, Not Applicable, Power Off, Off Line, Off Duty, Degraded, Not Installed, Install Error, Power Save - Unknown, Power Save - Low Power Mode, Power Save - Standby, Power Cycle, Power Save - Warning, Paused, Not Ready, Not Configured, Quiesced}
    StatusInfo?: Types.LogicalDevice.StatusInfo // ValueMap={1, 2, 3, 4, 5} Values={Other, Unknown, Enabled, Disabled, Not Applicable}
    LastErrorCode?: number
    ErrorDescription?: string // MaxLen=256
    ErrorCleared?: boolean
    OtherIdentifyingInfo?: string[] // MaxLen=256
    PowerOnHours?: number // Units=Hours
    TotalPowerOnHours?: number // Units=Hours
    IdentifyingDescriptions?: string[] // MaxLen=256
    AdditionalAvailability?: Types.LogicalDevice.AdditionalAvailability // ValueMap={1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21} Values={Other, Unknown, Running/Full Power, Warning, In Test, Not Applicable, Power Off, Off Line, Off Duty, Degraded, Not Installed, Install Error, Power Save - Unknown, Power Save - Low Power Mode, Power Save - Standby, Power Cycle, Power Save - Warning, Paused, Not Ready, Not Configured, Quiesced}
    MaxQuiesceTime?: number // Units=MilliSeconds
  }

  export interface Processor extends LogicalDevice {
    Role?: string // MaxLen=65
    Family?: number
    OtherFamilyDescription?: string // MaxLen=65
    UpgradeMethod?: Types.Processor.UpgradeMethod // ValueMap={1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60} Values={Other, Unknown, Daughter Board, ZIF Socket, Replacement/Piggy Back, None, LIF Socket, Slot 1, Slot 2, 370 Pin Socket, Slot A, Slot M, Socket 423, Socket A (Socket 462), Socket 478, Socket 754, Socket 940, Socket 939, Socket mPGA604, Socket LGA771, Socket LGA775, Socket S1, Socket AM2, Socket F (1207), Socket LGA1366, Socket G34, Socket AM3, Socket C32, Socket LGA1156, Socket LGA1567, Socket PGA988A, Socket BGA1288, rPGA988B, BGA1023, BGA1224, LGA1155, LGA1356, LGA2011, Socket FS1, Socket FS2, Socket FM1, Socket FM2, Socket LGA2011-3, Socket LGA1356-3, Socket LGA1150, Socket BGA1168, Socket BGA1234, Socket BGA1364, Socket AM4, Socket LGA1151, Socket BGA1356, Socket BGA1440, Socket BGA1515, Socket LGA3647-1, Socket SP3, Socket SP3r2, Socket LGA2066, Socket BGA1392, Socket BGA1510, Socket BGA1528}
    MaxClockSpeed?: number // Units=MegaHertz
    CurrentClockSpeed?: number // Units=MegaHertz
    Stepping?: string // MaxLen=65
    CPUStatus?: Types.Processor.CPUStatus // ValueMap={0, 1, 2, 3, 4, 7} Values={Unknown, CPU Enabled, CPU Disabled by User, CPU Disabled By BIOS (POST Error), CPU Is Idle, Other}
    ExternalBusClockSpeed?: number // Units=MegaHertz
  }

  export interface MediaAccessDevice extends LogicalDevice {
    Capabilities?: Types.MediaAccessDevice.Capabilities // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12} Values={Unknown, Other, Sequential Access, Random Access, Supports Writing, Encryption, Compression, Supports Removeable Media, Manual Cleaning, Automatic Cleaning, SMART Notification, Supports Dual Sided Media, Predismount Eject Not Required} ArrayType=Indexed
    MaxMediaSize?: number
    Security?: Types.MediaAccessDevice.Security // ValueMap={1, 2, 3, 4, 5, 6, 7} Values={Other, Unknown, None, Read Only, Locked Out, Boot Bypass, Boot Bypass and Read Only}
  }

  export interface Service extends EnabledLogicalElement {
    SystemCreationClassName?: string // MaxLen=256
    SystemName?: string // MaxLen=256
    CreationClassName?: string // MaxLen=256
    PrimaryOwnerName?: string // MaxLen=64
    PrimaryOwnerContact?: string // MaxLen=256
    StartMode?: string // ValueMap={Automatic, Manual} MaxLen=10
    Started?: boolean
  }

  export interface SecurityService extends Service { }

  export interface SettingData extends ManagedElement {
    InstanceID?: string // MaxLen=256
  }

  // To do: Fix the typing on Dependent and Antecedent
  export interface Dependency {
    Antecedent: any
    Dependent: any
  }

  export interface SystemPackaging extends Dependency { }

  export interface ComputerSystemPackage extends SystemPackaging {
    PlatformGuid?: string // MaxLen=40
  }

  export interface LogicalPort extends LogicalDevice {
    Speed?: number // Units=Bits per Second
    MaxSpeed?: number // Units=Bits per Second
    RequestedSpeed?: number // Units=Bits per Second
    UsageRestriction?: Types.LogicalPort.UsageRestriction // ValueMap={0, 2, 3, 4} Values={Unknown, Front-end only, Back-end only, Not restricted}
    PortType?: Types.LogicalPort.PortType // ValueMap={0, 1, 2, 3..15999, 16000..65535} Values={Unknown, Other, Not Applicable, DMTF Reserved, Vendor Reserved}
    OtherPortType?: string // MaxLen=256
  }

  export interface NetworkPort extends LogicalPort {
    PortNumber?: number
    LinkTechnology?: Types.NetworkPort.LinkTechnology // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11} Values={Unknown, Other, Ethernet, IB, FC, FDDI, ATM, Token Ring, Frame Relay, Infrared, BlueTooth, Wireless LAN}
    OtherLinkTechnology?: string // MaxLen=256
    PermanentAddress?: string // MaxLen=64
    NetworkAddresses?: string[] // MaxLen=64
    FullDuplex?: boolean
    AutoSense?: boolean
    SupportedMaximumTransmissionUnit?: number // Units=Bytes
    ActiveMaximumTransmissionUnit?: number // Units=Bytes
  }

  export interface EthernetPort extends NetworkPort { }

  export interface BootSettingData extends SettingData {
    OwningEntity?: string // MaxLen=256
  }

  export interface Collection extends ManagedElement { }

  export interface Role extends Collection {
    CreationClassName?: string // MaxLen=12
    Name?: string // MaxLen=64
    CommonName?: string // MaxLen=256
    RoleCharacteristics?: Types.Role.RoleCharacteristics // ValueMap={2, 3, .., 32000..65535} Values={Static, Opaque, DMTF Reserved, Vendor Specific}
  }

  export interface AuthenticationService extends SecurityService {
  }

  export interface CredentialManagementService extends AuthenticationService {
    // InstanceID is an optional property that may be used to opaquely and uniquely identify an instance of this class within the scope of the instantiating Namespace . . .
    InstanceID?: string // MaxLen=256
  }

  export interface Credential extends ManagedElement {
    Issued?: Date // The date and time when the credential was issued.  Default is current time
    Expires?: Date // The date and time when the credential expires (and is not appropriate for use for authentication/ authorization).  Default is '99991231235959.999999+999'
  }
  export interface CredentialContext {
    // A Credential whose context is defined.
    ElementInContext: Credential
    // The ManagedElement that provides context or scope for the Credential.
    ElementProvidingContext: ManagedElement
  }
  export interface SharedCredential extends Credential {
    InstanceID: string // Within the scope of the instantiating Namespace, InstanceID opaquely and uniquely identifies an instance of this class . . .
    RemoteID?: string // RemoteID is the name by which the principal is known at the remote secret key authentication service.
    Secret?: string // The secret known by the principal.
    Algorithm?: string // The transformation algorithm, if any, used to protect passwords before use in the protocol . . .
    Protocol?: string // The protocol with which the SharedCredential is used.
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

  export interface SoftwareIdentity extends LogicalElement {
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
    OverwritePolicy: Types.Log.OverwritePolicy // ValueMap={0, 2, 7, .., 32768..65535} Values={Unknown, Wraps When Full, Never Overwrites, DMTF Reserved, Vendor Reserved}
    LogState: Types.Log.LogState // ValueMap={0, 2, 3, 4, .., 32768..65535} Values={Unknown, Normal, Erasing, Not Applicable, DMTF Reserved, Vendor Reserved}
  }

  export interface MessageLog extends Log {
    CreationClassName: string // MaxLen=256
    Capabilities: Types.MessageLog.Capabilities // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10} Values={Unknown, Other, Write Record Supported, Delete Record Supported, Can Move Backward in Log, Freeze Log Supported, Clear Log Supported, Supports Addressing by Ordinal Record Number, Variable Length Records Supported, Variable Formats for Records, Can Flag Records for Overwrite} ArrayType=Indexed
    CapabilitiesDescriptions: string[] // MaxLen=256
    MaxLogSize: number // Units=Bytes
    SizeOfHeader: number // Units=Bytes
    HeaderFormat: string // MaxLen=256
    MaxRecordSize: number // Units=Bytes
    SizeOfRecordHeader: number // Units=Bytes
    RecordHeaderFormat: string // MaxLen=256
    OtherPolicyDescription: string // MaxLen=256
    TimeWhenOutdated: Date
    PercentageNearFull: number // Units=Percent
    LastChange: Types.MessageLog.LastChange // ValueMap={0, 1, 2, 3, 4} Values={Unknown, Add, Delete, Modify, Log Cleared}
    TimeOfLastChange: Date
    RecordLastChanged: number
    IsFrozen: boolean
    CharacterSet: Types.MessageLog.CharacterSet // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11} Values={Unknown, Other, ASCII, Unicode, ISO2022, ISO8859, Extended UNIX Code, UTF-8, UCS-2, Bitmapped Data, OctetString, Defined by Individual Records}
  }

  export interface KVMRedirectionSAP {
    Name: string // MaxLen=40
    CreationClassName: string // MaxLen=25
    SystemName: string // MaxLen=20
    SystemCreationClassName: string // MaxLen=25
    ElementName: string // MaxLen=40
    EnabledState: Types.KVMRedirectionSAP.EnabledState // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11..32767, 32768..65535} Values={Unknown, Other, Enabled, Disabled, Shutting Down, Not Applicable, Enabled but Offline, In Test, Deferred, Quiesce, Starting, DMTF Reserved, Vendor Reserved}
    RequestedState: Types.KVMRedirectionSAP.RequestedState // ValueMap={0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, .., 32768..65535} Values={Unknown, Enabled, Disabled, Shut Down, No Change, Offline, Test, Deferred, Quiesce, Reboot, Reset, Not Applicable, DMTF Reserved, Vendor Reserved}
    KVMProtocol: Types.KVMRedirectionSAP.KVMProtocol // ValueMap={0, 1, 2, 3, 4, 5..32767, 32768..65535} Values={Unknown, Other, Raw, RDP, VNC-RFB, DMTF Reserved, Vendor Specified}
  }

  export interface KVMRedirectionSAPResponse {
    CIM_KVMRedirectionSAP: KVMRedirectionSAP
  }

  export interface PowerActionResponse {
    RequestPowerStateChange_OUTPUT: Common.Models.ReturnValue
  }

  export interface WiFiEndpointSettings extends SettingData {
    ElementName: string
    InstanceID: string
    Priority: number
    SSID?: string // Max Length 32
    BSSType?: Types.WiFiEndpointSettings.BSSType // ValueMap={0, 2, 3, ..} Values={Unknown, Independent, Infrastructure, DMTF Reserved}
    EncryptionMethod: Types.WiFiEndpointSettings.EncryptionMethod // ValueMap={1, 2, 3, 4, 5, 6..} Values={Other, WEP, TKIP, CCMP, None, DMTF Reserved}
    AuthenticationMethod: Types.WiFiEndpointSettings.AuthenticationMethod // ValueMap={1, 2, 3, 4, 5, 6, 7, 8..32767, 32768, 32769, 32770..} Values={Other, Open System, Shared Key, WPA PSK, WPA IEEE 802.1x, WPA2 PSK, WPA2 IEEE 802.1x, DMTF Reserved, WPA3 SAE, WPA3 OWE, Vendor Reserved}
    Keys?: string[] // OctetString ArrayType=Indexed Max Length 256
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
    PolicyDecisionStrategy: Types.PolicySet.PolicyDecisionStrategy // ValueMap={1, 2} Values={First Matching, All}
    PolicyRoles: string[] // MaxLen=256
    Enabled: Types.PolicySet.Enabled // ValueMap={1, 2, 3} Values={Enabled, Disabled, Enabled For Debug}
  }
  export interface PolicySetAppliesToElement {
    PolicySet: PolicySet
    ManagedElement: ManagedElement
  }

  export interface IEEE8021xSettings extends SettingData {
    AuthenticationProtocol: Types.IEEE8021xSettings.AuthenticationProtocol // ValueMap={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ..} Values={EAP-TLS, EAP-TTLS/MSCHAPv2, PEAPv0/EAP-MSCHAPv2, PEAPv1/EAP-GTC, EAP-FAST/MSCHAPv2, EAP-FAST/GTC, EAP-MD5, EAP-PSK, EAP-SIM, EAP-AKA, EAP-FAST/TLS, DMTF Reserved} MappingStrings={RFC4017.IETF, RFC2716.IETF, draft-ietf-pppext-eap-ttls.IETF, draft-kamath-pppext-peapv0.IETF, draft-josefsson-pppext-eap-tls-eap, RFC4851.IETF, RFC3748.IETF, RFC4764.IETF, RFC4186.IETF, RFC4187.IETF}
    RoamingIdentity: string // Max Length 80
    ServerCertificateName?: string // Max Length 80
    ServerCertificateNameComparison?: Types.IEEE8021xSettings.ServerCertificateNameComparison // ValueMap={1, 2, 3, ..} Values={Other, FullName, DomainSuffix, DMTF Reserved}
    Username?: string // Max Length 128
    Password?: string // Max Length 256
    Domain?: string // Max Length 256
    ProtectedAccessCredential?: string // OctetString Write-Only
    PACPassword?: string // Max Length 256 Write-Only
    PSK?: string // OctetString Write-Only
  }
}
