/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Actions {
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  CREATE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Create',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate',
  GENERATE_KEY_PAIR = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  GET_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords',
  POSITION_TO_FIRSTRECORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord',
  COMMIT_CHANGES = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges',
  UNPROVISION = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision',
  SET_MEBX_PASSWORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword',
  SET_ADMIN_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx',
  GET_LOW_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch',
  SET_HIGH_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch',
  ADD_WIFI_SETTINGS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings',
  ADD_ALARM = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService/AddAlarm'
}
const REQUEST_STATE_CHANGE = (className: string): string => { return `http://intel.com/wbem/wscim/1/amt-schema/1/${className}/RequestStateChange` }

export { REQUEST_STATE_CHANGE }
