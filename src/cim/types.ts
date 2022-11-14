/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export namespace Types {
  export namespace ManagedSystemElement {
    export type HealthState = 0 | 5 | 10 | 15 | 20 | 25 | 30
    export type OperationalStatusValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    export type OperationalStatus = OperationalStatusValues[]
  }

  export namespace PhysicalComponent {
    export type RemovalConditions = 0 | 2 | 3 | 4
  }

  export namespace PhysicalMemory {
    export type MemoryType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34
  }

  export namespace PhysicalPackage {
    export type PackageType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
  }

  export namespace PhysicalFrame {
    export type RemovalConditions = 0 | 2 | 3 | 4
    export type SecurityBreach = 1 | 2 | 3 | 4 | 5
    export type ServicePhilosophyValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    export type ServicePhilosophy = ServicePhilosophyValues[]
  }

  export namespace Chassis {
    export type ChassisPackageType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36
  }

  export namespace SoftwareElement {
    export type SoftwareElementState = 0 | 1 | 2 | 3
    export type TargetOperatingSystem = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113
  }

  export namespace Job {
    export type CommunicationStatus = 0 | 1 | 2 | 3 | 4
    export type DetailedStatus = 0 | 1 | 2 | 3 | 4 | 5
    export type OperatingStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
    export type PrimaryStatus = 0 | 1 | 2 | 3
    export type RunMonth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    export type RunDay = -31 | -30 | -29 | -28 | -27 | -26 | -25 | -24 | -23 | -22 | -21 | -20 | -19 | -18 | -17 | -16 | -15 | -14 | -13 | -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31
    export type RunDayOfWeek = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    export type RecoveryAction = 0 | 1 | 2 | 3 | 4 | 5
    export type LocalOrUtcTime = 1 | 2
  }

  export namespace ConcreteJob {
    export type JobState = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  }

  export namespace EnabledLogicalElement {
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    export type EnabledDefault = 2 | 3 | 5 | 6 | 7 | 9
  }

  export namespace LogicalDevice {
    export type PowerManagementCapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    export type PowerManagementCapabilities = PowerManagementCapabilitiesValues[]
    export type Availability = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
    export type StatusInfo = 1 | 2 | 3 | 4 | 5
    export type AdditionalAvailabilityValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21
    export type AdditionalAvailability = AdditionalAvailabilityValues[]
  }

  export namespace Processor {
    export type UpgradeMethod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60
    export type CPUStatus = 0 | 1 | 2 | 3 | 4 | 7
  }

  export namespace MediaAccessDevice {
    export type CapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    export type Capabilities = CapabilitiesValues[]
    export type Security = 1 | 2 | 3 | 4 | 5 | 6 | 7
  }

  export namespace LogicalPort {
    export type UsageRestriction = 0 | 2 | 3 | 4
    export type PortType = 0 | 1 | 2
  }

  export namespace NetworkPort {
    export type LinkTechnology = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  }

  export namespace Role {
    export type RoleCharacteristicsValues = 2 | 3
    export type RoleCharacteristics = RoleCharacteristicsValues[]
  }

  export namespace Log {
    export type OverwritePolicy = 0 | 2 | 7
    export type LogState = 0 | 2 | 3 | 4
  }

  export namespace MessageLog {
    export type CapabilitiesValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type Capabilities = CapabilitiesValues[]
    export type LastChange = 0 | 1 | 2 | 3 | 4
    export type CharacterSet = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  }

  export namespace KVMRedirectionSAP {
    export type EnabledState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type RequestedState = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    export type RequestedStateInputs = 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11
    export type KVMProtocol = 0 | 1 | 2 | 3 | 4
  }

  export namespace WiFiEndpointSettings {
    export type BSSType = 0 | 2 | 3
    export type EncryptionMethod = 1 | 2 | 3 | 4 | 5
    export type AuthenticationMethod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 32768 | 32769
  }

  export namespace PolicySet {
    export type PolicyDecisionStrategy = 1 | 2
    export type Enabled = 1 | 2 | 3
  }

  export namespace IEEE8021xSettings {
    export type AuthenticationProtocol = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    export type ServerCertificateNameComparison = 1 | 2 | 3
  }

  export namespace WiFiPort {
    export type RequestedState = 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 32768 | 32769
  }

  export namespace BootService {
    export type Role = 0 | 1 | 2
  }

  export namespace PowerManagementService {
    export type PowerState = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
  }
}
