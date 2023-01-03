/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Actions {
  ADD_ALARM = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService/AddAlarm',
  ADD_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddCertificate',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_WIFI_SETTINGS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService/AddWiFiSettings',
  COMMIT_CHANGES = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/CommitChanges',
  CREATE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Create',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  GENERATE_KEY_PAIR = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GenerateKeyPair',
  GENERATE_PKCS10_REQUEST_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/GeneratePKCS10RequestEx',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  GET_LOW_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/GetLowAccuracyTimeSynch',
  GET_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/GetRecords',
  GET_UUID = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/GetUuid',
  POSITION_TO_FIRSTRECORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_MessageLog/PositionToFirstRecord',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  SET_ADMIN_ACL_ENTRY_EX = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuthorizationService/SetAdminAclEntryEx',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  SET_HIGH_ACCURACY_TIME_SYNCH = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_TimeSynchronizationService/SetHighAccuracyTimeSynch',
  SET_MEBX_PASSWORD = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword',
  UNPROVISION = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision'
}
const REQUEST_STATE_CHANGE = (className: string): string => { return `http://intel.com/wbem/wscim/1/amt-schema/1/${className}/RequestStateChange` }

export { REQUEST_STATE_CHANGE }
