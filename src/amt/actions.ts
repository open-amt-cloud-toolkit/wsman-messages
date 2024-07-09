/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export enum Actions {
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_KEY = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddKey',
  ADD_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate',
  GENERATE_KEY_PAIR = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  GET_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords',
  POSITION_TO_FIRST_RECORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord',
  COMMIT_CHANGES = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges',
  UNPROVISION = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision',
  SET_MEBX_PASSWORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword',
  GET_UUID = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/GetUuid',
  SET_ADMIN_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx',
  ADD_USER_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/AddUserAclEntryEx',
  GET_LOW_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch',
  SET_HIGH_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch',
  ADD_WIFI_SETTINGS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings',
  ADD_ALARM = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService/AddAlarm',
  GENERATE_PKCS10_REQUEST_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GeneratePKCS10RequestEx',
  GET_CREDENTIAL_CACHE_STATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData/GetCredentialCacheState',
  SET_CREDENTIAL_CACHE_STATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_KerberosSettingData/SetCredentialCacheState',
  ENUMERATE_USER_ACL_ENTRIES = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/EnumerateUserAclEntries',
  GET_USER_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetUserAclEntryEx',
  UPDATE_USER_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/UpdateUserAclEntryEx',
  REMOVE_USER_ACL_ENTRY = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/RemoveUserAclEntry',
  GET_ADMIN_ACL_ENTRY = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminAclEntry',
  GET_ADMIN_ACL_ENTRY_STATUS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminAclEntryStatus',
  GET_ADMIN_NET_ACL_ENTRY_STATUS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAdminNetAclEntryStatus',
  SET_ACL_ENABLED_STATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAclEnabledState',
  GET_ACL_ENABLED_STATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/GetAclEnabledState'
}

export enum Realms {
  /**
   * Manages security control data, such as Access Control Lists, Kerberos parameters, and Transport Layer Security. This permission is required for both user creation and management mechanism. Manages power saving options and power packages. Performs the functions required for Intel AMT setup and configuration. Configures local network options. These are usually configured with a DHCP server, but can be configured directly using this interface.
   */
  ADMINISTRATION = 3,
  /**
   * Used by an application designed to run on the local platform to report that it is running and to send heartbeats periodically.
   */
  AGENT_PRESENCE_LOCAL = 9,
  /**
   * Used to register Local Agent applications and to specify the behavior of Intel AMT when an application is running or stops running unexpectedly.
   */
  AGENT_PRESENCE_REMOTE = 10,
  /**
   * Configures the Audit Log.
   */
  AUDIT_LOG = 20,
  /**
   * Used to define filters, counters, and policies to monitor incoming and outgoing network traffic and to block traffic when a suspicious condition is detected.
   */
  CIRCUIT_BREAKER = 11,
  /**
   * DEPRECATED. Not supported starting CSME release 18.0. Returns settings associated with NAC/NAP posture.
   */
  ENDPOINT_ACCESS_CONTROL = 17,
  /**
   * DEPRECATED. Not supported starting CSME release 18.0. Configures and enables the NAC/NAP posture. Note: Beginning in Intel AMT Release 9.0 NAC is no longer supported.
   */
  ENDPOINT_ACCESS_CONTROL_ADMIN = 18,
  /**
   * Controls access for reading the Intel AMT event log.
   */
  EVENT_LOG_READER = 19,
  /**
   * Allows configuring hardware and software events to generate alerts and to send them to a remote console and/or log them locally.
   */
  EVENT_MANAGER = 7,
  /**
   * Returns general setting and status information. With this interface, it is possible to give a user permission to read parameters related to other interfaces without giving permission to change the parameters.
   */
  GENERAL_INFO = 13,
  /**
   * Used to retrieve information about the hardware inventory of the platform.
   */
  HARDWARE_ASSET = 4,
  /**
   * Provides alerts to a user on the local interface. Used by User Notification Service to communicate with Intel AMT.
   */
  LOCAL_APPS = 24,
  /**
   * Used to set the clock in the Intel AMT device and synchronize it to network time. Can be assigned to a separate user who has limited administrative privileges.
   */
  NETWORK_TIME = 12,
  /**
   * Enables and disables the redirection capability and retrieves the redirection log. The redirection interface itself is a separate proprietary interface.
   */
  REDIRECTION = 2,
  /**
   * Enables powering a platform up or down remotely. Used in conjunction with the Redirection capability to boot remotely.
   */
  REMOTE_CONTROL = 5,
  /**
   * Used to access, configure, manage, write to and read from non-volatile user storage.
   */
  STORAGE = 6,
  /**
   * Used to configure the global parameters that govern the allocation and use of non-volatile storage.
   */
  STORAGE_ADMIN = 8,
  /**
   * Users can control the properties of their own ACL entries.
   */
  USER_ACCESS_CONTROL = 21
}
