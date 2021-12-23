/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { CIM_ManagedElement, CIM_SettingData, CIM_EthernetPort, CIM_BootSettingData, CIM_CredentialManagementService, CIM_MessageLog } from './cim_models';
export interface amtAuthenticateObject {
    nonce?: number[];
    uuid?: string[];
    fqdn?: string;
    fwVersion?: string;
    amtSvn?: number;
    signatureMechanism?: number;
    signature?: number[];
    lengthOfCertificates?: number[];
    certificates?: number[];
}
export interface AMT_GeneralSettings extends CIM_SettingData {
    NetworkInterfaceEnabled?: boolean;
    DigestRealm?: string;
    IdleWakeTimeout?: number;
    HostName?: string;
    DomainName?: string;
    PingResponseEnabled?: boolean;
    WsmanOnlyMode?: boolean;
    PreferredAddressFamily?: number;
    DHCPv6ConfigurationTimeout?: number;
    DDNSUpdateByDHCPServerEnabled?: boolean;
    SharedFQDN?: boolean;
    HostOSFQDN?: string;
    DDNSTTL?: number;
    AMTNetworkEnabled?: number;
    RmcpPingResponseEnabled?: boolean;
    DDNSPeriodicUpdateInterval?: number;
    PresenceNotificationInterval?: number;
    PrivacyLevel?: number;
    PowerSource?: number;
    ThunderboltDockEnabled?: number;
    AMTAuthenticate?: (mcNonce: number) => amtAuthenticateObject;
}
export interface AMT_GeneralSettingsResponse {
    AMT_GeneralSettings: AMT_GeneralSettings;
}
export interface AMT_EthernetPortSettings extends CIM_SettingData {
    VLANTag?: number;
    SharedMAC?: boolean;
    MACAddress?: string;
    LinkIsUp?: boolean;
    LinkPolicy?: number[];
    LinkPreference?: number;
    LinkControl?: number;
    SharedStaticIp?: boolean;
    SharedDynamicIp?: boolean;
    IpSyncEnabled?: boolean;
    DHCPEnabled?: boolean;
    IPAddress?: string;
    SubnetMask?: string;
    DefaultGateway?: string;
    PrimaryDNS?: string;
    SecondaryDNS?: string;
    ConsoleTcpMaxRetransmissions?: number;
    WLANLinkProtectionLevel?: number;
    PhysicalConnectionType?: number;
    PhysicalNicMedium?: number;
    SetLinkPreferences?: (linkPreference: number, timeout: number) => number;
    CancelLinkProtection?: () => number;
    RestoreLinkProtection?: () => number;
}
export interface MPServer {
    AccessInfo?: string;
    InfoFormat?: number;
    Port?: number;
    AuthMethod?: number;
    Username?: string;
    Password?: string;
    CommonName?: string;
}
export interface RemoteAccessPolicyRule {
    Trigger?: number;
    TunnelLifeTime?: number;
    ExtendedData?: string;
}
export interface AMT_SystemDefensePolicy extends CIM_ManagedElement {
    PolicyName?: string;
    PolicyPrecedence?: number;
    AntiSpoofingSupport?: number;
    FilterCreationHandles?: number[];
    TxDefaultDrop?: boolean;
    TxDefaultMatchEvent?: boolean;
    TxDefaultCount?: boolean;
    RxDefaultDrop?: boolean;
    RxDefaultMatchEvent?: boolean;
    RxDefaultCount?: boolean;
    GetTimeout?: () => number;
    SetTimeout?: (number: any) => number;
    UpdateStatistics?: (networkInterface: CIM_EthernetPort, resetOnRead: boolean) => number;
}
export interface AMT_EnvironmentDetectionSettingData extends CIM_SettingData {
    DetectionAlgorithm?: number;
    DetectionStrings?: string[];
    DetectionIPv6LocalPrefixes?: string[];
    SetSystemDefensePolicy?: (policy: AMT_SystemDefensePolicy) => number;
    EnableVpnRouting?: (enable: boolean) => number;
}
export interface AMT_BootCapabilities extends CIM_ManagedElement {
    AMT_BootCapabilities: {
        ElementName: string;
        InstanceID: string;
        IDER: boolean;
        SOL: boolean;
        BIOSReflash: boolean;
        BIOSSetup: boolean;
        BIOSPause: boolean;
        ForcePXEBoot: boolean;
        ForceHardDriveBoot: boolean;
        ForceHardDriveSafeModeBoot: boolean;
        ForceDiagnosticBoot: boolean;
        ForceCDorDVDBoot: boolean;
        VerbosityScreenBlank: boolean;
        PowerButtonLock: boolean;
        ResetButtonLock: boolean;
        KeyboardLock: boolean;
        SleepButtonLock: boolean;
        UserPasswordBypass: boolean;
        ForcedProgressEvents: boolean;
        VerbosityVerbose: boolean;
        VerbosityQuiet: boolean;
        ConfigurationDataReset: boolean;
        BIOSSecureBoot: boolean;
        SecureErase: boolean;
        ForceWinREBoot: boolean;
        ForceUEFILocalPBABoot: boolean;
        ForceUEFIHTTPSBoot: boolean;
        AMTSecureBootControl: boolean;
        UEFIWiFiCoExistenceAndProfileShare: boolean;
        PlatformErase: number;
    };
}
export interface AMT_BootSettingData extends CIM_BootSettingData {
    UseSOL?: boolean;
    UseSafeMode?: boolean;
    ReflashBIOS?: boolean;
    BIOSSetup?: boolean;
    BIOSPause?: boolean;
    LockPowerButton?: boolean;
    LockResetButton?: boolean;
    LockKeyboard?: boolean;
    LockSleepButton?: boolean;
    UserPasswordBypass?: boolean;
    ForcedProgressEvents?: boolean;
    FirmwareVerbosity?: number;
    ConfigurationDataReset?: boolean;
    IDERBootDevice?: number;
    UseIDER?: boolean;
    EnforceSecureBoot?: boolean;
    BootMediaIndex?: number;
    SecureErase?: boolean;
    RSEPassword?: string;
    OptionsCleared?: boolean;
    WinREBootEnabled?: boolean;
    UEFILocalPBABootEnabled?: boolean;
    UEFIHTTPSBootEnabled?: boolean;
    SecureBootControlEnabled?: boolean;
    BootguardStatus?: boolean;
    BIOSLastStatus?: number[];
    UEFIBootParametersArray?: number[];
    UEFIBootNumberOfParams?: number[];
}
export interface AMT_BootSettingDataResponse {
    AMT_BootSettingData: AMT_BootSettingData;
}
export interface AMT_SetupAndConfigurationService extends CIM_CredentialManagementService {
    AMT_SetupAndConfigurationService: {
        CreationClassName: string;
        ElementName: string;
        EnabledState: string;
        Name: string;
        PasswordModel: string;
        ProvisioningMode: string;
        ProvisioningServerOTP: string;
        ProvisioningState: string;
        RequestedState: string;
        SystemCreationClassName: string;
        SystemName: string;
        ZeroTouchConfigurationEnabled: string;
    };
}
export interface AMT_MessageLog extends CIM_MessageLog {
}
export interface EVENT_DATA {
    DeviceAddress?: number;
    EventSensorType?: number;
    EventType?: number;
    EventOffset?: number;
    EventSourceType?: number;
    EventSeverity?: number;
    SensorNumber?: number;
    Entity?: number;
    EntityInstance?: number;
    EventData?: number[];
    TimeStamp?: Date;
}
export interface AMT_AuditLog_ReadRecords {
    ReadRecords_OUTPUT: {
        TotalRecordCount: string;
        RecordsReturned: string;
        EventRecords: string[];
        ReturnValue: string;
    };
}
export interface AMT_RedirectionService {
    Name: string;
    CreationClassName: string;
    SystemName: string;
    SystemCreationClassName: string;
    ElementName: string;
    ListenerEnabled: boolean;
    AccessLog: string;
    EnabledState: number;
}
export interface AMT_RedirectionResponse {
    AMT_RedirectionService: AMT_RedirectionService;
}
