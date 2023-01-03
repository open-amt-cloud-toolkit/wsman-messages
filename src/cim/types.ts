/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace BootService {
    /**
     * IsNext:0 | IsNextSingleUse:1 | IsDefault:2
     */
    export type Role = 0 | 1 | 2
  }
  export namespace Chassis {
    /**
     * Unknown: 0 | Other: 1 | SMBIOS Reserved: 2 | Desktop: 3 | Low Profile Desktop: 4 | Pizza Box: 5 | Mini Tower: 6 | Tower: 7 | Portable: 8 | LapTop: 9 | Notebook: 10 | Hand Held: 11 | Docking Station: 12 | All in One: 13 | Sub Notebook: 14 | Space-Saving: 15 | Lunch Box: 16 | Main System Chassis: 17 | Expansion Chassis: 18 | SubChassis: 19 | Bus Expansion Chassis: 20 | Peripheral Chassis: 21 | Storage Chassis: 22 | SMBIOS Reserved: 23 | Sealed-Case PC: 24 | SMBIOS Reserved: 25 | CompactPCI: 26 | AdvancedTCA: 27 | Blade Enclosure: 28 | SMBIOS Reserved: 29 | Tablet: 30 | Convertible: 31 | Detachable: 32 | IoT Gateway: 33 | Embedded PC: 34 | Mini PC: 35 | Stick PC: 36
     */
    export type ChassisPackageType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36
  }
  export namespace ConcreteJob {
    /**
     * New: 2 | Starting: 3 | Running: 4 | Suspended: 5 | Shutting Down: 6 | Completed: 7 | Terminated: 8 | Killed: 9 | Exception: 10 | Service: 11 | Query Pending: 12
     */
    export type JobState = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  }
  export namespace EnabledLogicalElement {
    /**
     * Unknown:0 | Other:1 | Enabled:2 | Disabled:3 | Shutting Down:4 | Not Applicable:5 | Enabled but Offline:6 | In Test:7 | Deferred:8 | Quiesce:9 | Starting:10
     */
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    /**
     * Unknown:0 | Enabled:2 | Disabled:3 | Shut Down:4 | No Change:5 | Offline:6 | Test:7 | Deferred:8 | Quiesce:9 | Reboot:10 | Reset:11 | Not Applicable:12
     */
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    /**
     * Enabled:2 | Disabled:3 | Not Applicable:5 | Enabled but Offline:6 | No Default:7 | Quiesce:9
     */
    export type EnabledDefault = 2 | 3 | 5 | 6 | 7 | 9
  }
  export namespace IEEE8021xSettings {
    /**
     * EAP-TLS:0 | EAP-TTLS/MSCHAPv2:1 | PEAPv0/EAP-MSCHAPv2:2 | PEAPv1/EAP-GTC:3 | EAP-FAST/MSCHAPv2:4 | EAP-FAST/GTC:5 | EAP-MD5:6 | EAP-PSK:7 | EAP-SIM:8 | EAP-AKA:9 | EAP-FAST/TLS:10
     */
    export type AuthenticationProtocol = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    /**
     * Other:1 | FullName:2 | DomainSuffix:3
     */
    export type ServerCertificateNameComparison = 1 | 2 | 3
  }
  export namespace Job {
    /**
     * Unknown: 0 | Not Available: 1 | Communication OK: 2 | Lost Communication: 3 | No Contact: 4
     */
    export type CommunicationStatus = 0 | 1 | 2 | 3 | 4
    /**
     * Not Available: 0 | No Additional Information: 1 | Stressed: 2 | Predictive Failure: 3 | Non-Recoverable Error: 4 | Supporting Entity in Error: 5
     */
    export type DetailedStatus = 0 | 1 | 2 | 3 | 4 | 5
    /**
     * Unknown: 0 | Not Available: 1 | Servicing: 2 | Starting: 3 | Stopping: 4 | Stopped: 5 | Aborted: 6 | Dormant: 7 | Completed: 8 | Migrating: 9 | Emigrating: 10 | Immigrating: 11 | Snapshotting: 12 | Shutting Down: 13 | In Test: 14 | Transitioning: 15 | In Service: 16
     */
    export type OperatingStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
    /**
     * Unknown: 0 | OK: 1 | Degraded: 2 | Error: 3
     */
    export type PrimaryStatus = 0 | 1 | 2 | 3
    /**
     * January: 0 | February: 1 | March: 2 | April: 3 | May: 4 | June: 5 | July: 6 | August: 7 | September: 8 | October: 9 | November: 10 | December: 11
     */
    export type RunMonth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    /**
     * The day in the month on which the Job should be processed. There are two different interpretations for this property, depending on the value of DayOfWeek. In one case, RunDay defines the day-in-month on which the Job is processed. This interpretation is used when the DayOfWeek is 0. A positive or negative integer indicates whether the RunDay should be calculated from the beginning or end of the month. For example, 5 indicates the fifth day in the RunMonth and -1 indicates the last day in the RunMonth.
     */
    export type RunDay = -31 | -30 | -29 | -28 | -27 | -26 | -25 | -24 | -23 | -22 | -21 | -20 | -19 | -18 | -17 | -16 | -15 | -14 | -13 | -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31
    /**
     * -Saturday: -7 | -Friday: -6 | -Thursday: -5 | -Wednesday: -4 | -Tuesday: -3 | -Monday: -2 | -Sunday: -1 | ExactDayOfMonth: 0 | Sunday: 1 | Monday: 2 | Tuesday: 3 | Wednesday: 4 | Thursday: 5 | Friday: 6 | Saturday: 7
     *
     * A positive or negative integer used in conjunction with RunDay to indicate the day of the week on which the Job is processed. RunDayOfWeek is set to 0 to indicate an exact day of the month, such as March 1. A positive integer (representing Sunday, Monday, ..., Saturday) means that the day of week is found on or after the specified RunDay. A negative integer (representing -Sunday, -Monday, ..., -Saturday) means that the day of week is found on or BEFORE the RunDay.
     */
    export type RunDayOfWeek = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    /**
     * Unknown: 0 | Other: 1 | Do Not Continue: 2 | Continue With Next Job: 3 | Re-run Job: 4 | Run Recovery Job: 5
     */
    export type RecoveryAction = 0 | 1 | 2 | 3 | 4 | 5
    /**
     * Local Time: 1 | UTC Time: 2
     */
    export type LocalOrUtcTime = 1 | 2
  }
  export namespace KVMRedirectionSAP {
    /**
     * Unknown:0 | Other:1 | Enabled:2 | Disabled:3 | Shutting Down:4 | Not Applicable:5 | Enabled but Offline:6 | In Test:7 | Deferred:8 | Quiesce:9 | Starting:10
     */
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    /**
     * Unknown:0 | Enabled:2 | Disabled:3 | Shut Down:4 | No Change:5 | Offline:6 | Test:7 | Deferred:8 | Quiesce:9 | Reboot:10 | Reset:11 | Not Applicable:12
     */
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    /**
     * Enabled:2 | Disabled:3 | Shut Down:4 | Offline:6 | Test:7 | Defer:8 | Quiesce:9 | Reboot:10 | Reset:11
     */
    export type RequestedStateInputs = 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11
    /**
     * Unknown:0 | Other:1 | Raw:2 | RDP:3 | VNC-RFB:4
     */
    export type KVMProtocol = 0 | 1 | 2 | 3 | 4
  }
  export namespace Log {
    /**
     * Unknown:0 | Wraps When Full:2 | Never Overwrites:7
     */
    export type OverwritePolicy = 0 | 2 | 7
    /**
     * Unknown:0 | Normal:2 | Erasing:3 | Not Applicable:4
     */
    export type LogState = 0 | 2 | 3 | 4
  }
  export namespace LogicalDevice {
    /**
     * Unknown:0 | Not Supported:1 | Disabled:2 | Enabled:3 | Power Saving Modes Entered Automatically:4 | Power State Settable:5 | Power Cycling Supported:6 | Timed Power On Supported:7
     */
    export type PowerManagementCapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    export type PowerManagementCapabilities = PowerManagementCapabilitiesValues[]
    /**
     * Other:1 | Unknown:2 | Running/Full Power:3 | Warning:4 | In Test:5 | Not Applicable:6 | Power Off:7 | Off Line:8 | Off Duty:9 | Degraded:10 | Not Installed:11 | Install Error:12 | Power Save - Unknown:13 | Power Save - Low Power Mode:14 | Power Save - Standby:15 | Power Cycle:16 | Power Save - Warning:17 | Paused:18 | Not Ready:19 | Not Configured:20 | Quiesced:21
     */
    export type Availability = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
    /**
     * Other:1 | Unknown:2 | Enabled:3 | Disabled:4 | Not Applicable:5
     */
    export type StatusInfo = 1 | 2 | 3 | 4 | 5
    /**
     * Other:1 | Unknown:2 | Running/Full Power:3 | Warning:4 | In Test:5 | Not Applicable:6 | Power Off:7 | Off Line:8 | Off Duty:9 | Degraded:10 | Not Installed:11 | Install Error:12 | Power Save - Unknown:13 | Power Save - Low Power Mode:14 | Power Save - Standby:15 | Power Cycle:16 | Power Save - Warning:17 | Paused:18 | Not Ready:19 | Not Configured:20 | Quiesced:21
     */
    export type AdditionalAvailabilityValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
    export type AdditionalAvailability = AdditionalAvailabilityValues[]
  }
  export namespace LogicalPort {
    /**
     * Unknown:0 | Front-end only:2 | Back-end only:3 | Not restricted:4
     */
    export type UsageRestriction = 0 | 2 | 3 | 4
    /**
     * Unknown:0 | Other:1 | Not Applicable:2
     */
    export type PortType = 0 | 1 | 2
  }
  export namespace ManagedSystemElement {
    /**
     * 0 = Unknown | 5 = OK | 10 = Degraded/Warning | 15 = Minor failure | 20 = Major failure | 25 = Critical failure | 30 = Non-recoverable error
     */
    export type HealthState = 0 | 5 | 10 | 15 | 20 | 25 | 30
    /**
     * 0 = Unknown | 1 = Other | 2 = OK | 3 = Degraded | 4 = Stressed | 5 = Predictive Failure | 6 = Error | 7 = Non-Recoverable Error | 8 = Starting | 9 = Stopping | 10 = Stopped | 11 = In Service | 12 = No Contact | 13 = Lost Communication | 14 = Aborted | 15 = Dormant | 16 = Supporting Entity in Error | 17 = Completed | 18 = Power Mode | 19 = Relocating
     */
    export type OperationalStatusValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    export type OperationalStatus = OperationalStatusValues[]
  }
  export namespace MediaAccessDevice {
    /**
     * Unknown:0 | Other:1 | Sequential Access:2 | Random Access:3 | Supports Writing:4 | Encryption:5 | Compression:6 | Supports Removeable Media:7 | Manual Cleaning:8 | Automatic Cleaning:9 | SMART Notification:10 | Supports Dual Sided Media:11 | Predismount Eject Not Required:12
     */
    export type CapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    export type Capabilities = CapabilitiesValues[]
    /**
     * Other:1 | Unknown:2 | None:3 | Read Only:4 | Locked Out:5 | Boot Bypass:6 | Boot Bypass and Read Only:7
     */
    export type Security = 1 | 2 | 3 | 4 | 5 | 6 | 7
  }
  export namespace MessageLog {
    /**
     * Unknown:0 | Other:1 | Write Record Supported:2 | Delete Record Supported:3 | Can Move Backward in Log:4 | Freeze Log Supported:5 | Clear Log Supported:6 | Supports Addressing by Ordinal Record Number:7 | Variable Length Records Supported:8 | Variable Formats for Records:9 | Can Flag Records for Overwrite:10
     */
    export type CapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type Capabilities = CapabilitiesValues[]
    /**
     * Unknown:0 | Add:1 | Delete:2 | Modify:3 | Log Cleared:4
     */
    export type LastChange = 0 | 1 | 2 | 3 | 4
    /**
     * Unknown:0 | Other:1 | ASCII:2 | Unicode:3 | ISO2022:4 | ISO8859:5 | Extended UNIX Code:6 | UTF-8:7 | UCS-2:8 | Bitmapped Data:9 | OctetString:10 | Defined by Individual Records:11
     */
    export type CharacterSet = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  }
  export namespace NetworkPort {
    /**
     * Unknown:0 | Other:1 | Ethernet:2 | IB:3 | FC:4 | FDDI:5 | ATM:6 | Token Ring:7 | Frame Relay:8 | Infrared:9 | BlueTooth:10 | Wireless LAN:11
     */
    export type LinkTechnology = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  }
  export namespace PhysicalComponent {
    /**
     * 0 = Unknown | 2 = Not Applicable | 3 = Removable when off | 4 = Removable when on or off
     */
    export type RemovalConditions = 0 | 2 | 3 | 4
  }
  export namespace PhysicalFrame {
    /**
     * Unknown: 0 | Not Applicable: 2 | Removable when off: 3 | Removable when on or off: 4
     */
    export type RemovalConditions = 0 | 2 | 3 | 4
    /**
     * Other: 1 | Unknown: 2 | No Breach: 3 | Breach Attempted: 4 | Breach Successful: 5
     */
    export type SecurityBreach = 1 | 2 | 3 | 4 | 5
    /**
     * Unknown: 0 | Other: 1 | Service From Top: 2 | Service From Front: 3 | Service From Back: 4 | Service From Side: 5 | Sliding Trays: 6 | Removable Sides: 7 | Moveable: 8
     */
    export type ServicePhilosophyValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    export type ServicePhilosophy = ServicePhilosophyValues[]
  }
  export namespace PhysicalMemory {
    /**
     * 0 = Unknown | 1 = Other | 2 = DRAM | 3 = Synchronous DRAM | 4 = Cache DRAM | 5 = EDO | 6 = EDRAM | 7 = VRAM | 8 = SRAM | 9 = RAM | 10 = ROM | 11 = Flash | 12 = EEPROM | 13 = FEPROM | 14 = EPROM | 15 = CDRAM | 16 = 3DRAM | 17 = SDRAM | 18 = SGRAM | 19 = RDRAM | 20 = DDR | 21 = DDR-2 | 22 = BRAM | 23 = FB-DIMM | 24 = DDR3 | 25 = FBD2 | 26 = DDR4 | 27 = LPDDR | 28 = LPDDR2 | 29 = LPDDR3 | 30 = LPDDR4 | 31 = Logical non-volatile device | 32 = HBM (High Bandwidth Memory) | 33 = HBM2 (High Bandwidth Memory Generation 2) | 34 = DDR5 | 35 = LPDDR5 | 36 = HBM3 (High Bandwidth Memory Generation 3)
     */
    export type MemoryType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36
  }
  export namespace PhysicalPackage {
    /**
     * Unknown: 0 | Other: 1 | Rack: 2 | Chassis/Frame: 3 | Cross Connect/Backplane: 4 | Container/Frame Slot: 5 | Power Supply: 6 | Fan: 7 | Sensor: 8 | Module/Card: 9 | Port/Connector: 10 | Battery: 11 | Processor: 12 | Memory: 13 | Power Source/Generator: 14 | Storage Media Package (e.g., Disk or Tape Drive): 15 | Blade: 16 | Blade Expansion: 17
     */
    export type PackageType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
  }
  export namespace PolicySet {
    /**
     * First Matching:1 | All:2
     */
    export type PolicyDecisionStrategy = 1 | 2
    /**
     * Enabled:1 | Disabled:2 | Enabled For Debug:3
     */
    export type Enabled = 1 | 2 | 3
  }
  export namespace PowerManagementService {
    /**
     * Power On:2 | Sleep - Light:3 | Sleep - Deep:4 | Power Cycle (Off Soft):5 | Power Off - Hard:6 | Hibernate:7 | Power Off - Soft:8 | Power Cycle (Off Hard):9 | Master Bus Reset:10 | Diagnostic Interrupt (NMI):11 | Power Off - Soft Graceful:12 | Power Off - Hard Graceful:13 | Master Bus Reset Graceful:14 | Power Cycle (Off - Soft Graceful):15 | Power Cycle (Off - Hard Graceful):16
     */
    export type PowerState = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
  }
  export namespace Processor {
    /**
     * Other:1 | Unknown:2 | Daughter Board:3 | ZIF Socket:4 | Replacement/Piggy Back:5 | None:6 | LIF Socket:7 | Slot 1:8 | Slot 2:9 | 370 Pin Socket:10 | Slot A:11 | Slot M:12 | Socket 423:13 | Socket A (Socket 462):14 | Socket 478:15 | Socket 754:16 | Socket 940:17 | Socket 939:18 | Socket mPGA604:19 | Socket LGA771:20 | Socket LGA775:21 | Socket S1:22 | Socket AM2:23 | Socket F (1207):24 | Socket LGA1366:25 | Socket G34:26 | Socket AM3:27 | Socket C32:28 | Socket LGA1156:29 | Socket LGA1567:30 | Socket PGA988A:31 | Socket BGA1288:32 | rPGA988B:33 | BGA1023:34 | BGA1224:35 | LGA1155:36 | LGA1356:37 | LGA2011:38 | Socket FS1:39 | Socket FS2:40 | Socket FM1:41 | Socket FM2:42 | Socket LGA2011-3:43 | Socket LGA1356-3:44 | Socket LGA1150:45 | Socket BGA1168:46 | Socket BGA1234:47 | Socket BGA1364:48 | Socket AM4:49 | Socket LGA1151:50 | Socket BGA1356:51 | Socket BGA1440:52 | Socket BGA1515:53 | Socket LGA3647-1:54 | Socket SP3:55 | Socket SP3r2:56 | Socket LGA2066:57 | Socket BGA1392:58 | Socket BGA1510:59 | Socket BGA1528:60 | Socket LGA4189:61 | Socket LGA1200:62 | Socket LGA4677:63 | Socket LGA1700:64 | Socket BGA1744:65 | Socket BGA1781:66 | Socket BGA1211:67 | Socket BGA2422:68 | Socket LGA1211:69 | Socket LGA2422:70 | Socket LGA5773:71 | Socket BGA5773:72
     */
    export type UpgradeMethod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72
    /**
     * Unknown:0 | CPU Enabled:1 | CPU Disabled by User:2 | CPU Disabled By BIOS (POST Error):3 | CPU Is Idle:4 | Other:7
     */
    export type CPUStatus = 0 | 1 | 2 | 3 | 4 | 7
  }
  export namespace Role {
    /**
     * Static:2 | Opaque:3
     */
    export type RoleCharacteristicsValues = 2 | 3
    export type RoleCharacteristics = RoleCharacteristicsValues[]
  }
  export namespace SoftwareElement {
    /**
     * Deployable: 0 | Installable: 1 | Executable: 2 | Running: 3
     */
    export type SoftwareElementState = 0 | 1 | 2 | 3
    /**
     * Unknown: 0 | Other: 1 | MACOS: 2 | ATTUNIX: 3 | DGUX: 4 | DECNT: 5 | Tru64 UNIX: 6 | OpenVMS: 7 | HPUX: 8 | AIX: 9 | MVS: 10 | OS400: 11 | OS/2: 12 | JavaVM: 13 | MSDOS: 14 | WIN3x: 15 | WIN95: 16 | WIN98: 17 | WINNT: 18 | WINCE: 19 | NCR3000: 20 | NetWare: 21 | OSF: 22 | DC/OS: 23 | Reliant UNIX: 24 | SCO UnixWare: 25 | SCO OpenServer: 26 | Sequent: 27 | IRIX: 28 | Solaris: 29 | SunOS: 30 | U6000: 31 | ASERIES: 32 | HP NonStop OS: 33 | HP NonStop OSS: 34 | BS2000: 35 | LINUX: 36 | Lynx: 37 | XENIX: 38 | VM: 39 | Interactive UNIX: 40 | BSDUNIX: 41 | FreeBSD: 42 | NetBSD: 43 | GNU Hurd: 44 | OS9: 45 | MACH Kernel: 46 | Inferno: 47 | QNX: 48 | EPOC: 49 | IxWorks: 50 | VxWorks: 51 | MiNT: 52 | BeOS: 53 | HP MPE: 54 | NextStep: 55 | PalmPilot: 56 | Rhapsody: 57 | Windows 2000: 58 | Dedicated: 59 | OS/390: 60 | VSE: 61 | TPF: 62 | Windows (R) Me: 63 | Caldera Open UNIX: 64 | OpenBSD: 65 | Not Applicable: 66 | Windows XP: 67 | z/OS: 68 | Microsoft Windows Server 2003: 69 | Microsoft Windows Server 2003 64-Bit: 70 | Windows XP 64-Bit: 71 | Windows XP Embedded: 72 | Windows Vista: 73 | Windows Vista 64-Bit: 74 | Windows Embedded for Point of Service: 75 | Microsoft Windows Server 2008: 76 | Microsoft Windows Server 2008 64-Bit: 77 | FreeBSD 64-Bit: 78 | RedHat Enterprise Linux: 79 | RedHat Enterprise Linux 64-Bit: 80 | Solaris 64-Bit: 81 | SUSE: 82 | SUSE 64-Bit: 83 | SLES: 84 | SLES 64-Bit: 85 | Novell OES: 86 | Novell Linux Desktop: 87 | Sun Java Desktop System: 88 | Mandriva: 89 | Mandriva 64-Bit: 90 | TurboLinux: 91 | TurboLinux 64-Bit: 92 | Ubuntu: 93 | Ubuntu 64-Bit: 94 | Debian: 95 | Debian 64-Bit: 96 | Linux 2.4.x: 97 | Linux 2.4.x 64-Bit: 98 | Linux 2.6.x: 99 | Linux 2.6.x 64-Bit: 100 | Linux 64-Bit: 101 | Other 64-Bit: 102 | Microsoft Windows Server 2008 R2: 103 | VMware ESXi: 104 | Microsoft Windows 7: 105 | CentOS 32-bit: 106 | CentOS 64-bit: 107 | Oracle Enterprise Linux 32-bit: 108 | Oracle Enterprise Linux 64-bit: 109 | eComStation 32-bitx: 110 | Microsoft Windows Server 2011: 111 | Microsoft Windows Server 2011 64-Bit: 112 | Microsoft Windows Server 8: 113
     */
    export type TargetOperatingSystem = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113
  }
  export namespace WiFiEndpointSettings {
    /**
     * Unknown:0 | Independent:2 | Infrastructure:3
     */
    export type BSSType = 0 | 2 | 3
    /**
     * Other:1 | WEP:2 | TKIP:3 | CCMP:4 | None:5
     */
    export type EncryptionMethod = 1 | 2 | 3 | 4 | 5
    /**
     * Other:1 | Open System:2 | Shared Key:3 | WPA PSK:4 | WPA IEEE 802.1x:5 | WPA2 PSK:6 | WPA2 IEEE 802.1x:7 | WPA3 SAE:32768 | WPA3 OWE:32769
     */
    export type AuthenticationMethod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 32768 | 32769
  }
  export namespace WiFiPort {
    /**
     * Unknown:0 | Enabled:2 | Disabled:3 | Shut Down:4 | No Change:5 | Offline:6 | Test:7 | Deferred:8 | Quiesce:9 | Reboot:10 | Reset:11 | Not Applicable:12 | WiFi is enabled in S0:32768 | WiFi is enabled in S0 + Sx/AC:32769
     */
    export type RequestedState = 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 32768 | 32769
  }
}
