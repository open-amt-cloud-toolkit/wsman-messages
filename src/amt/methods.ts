/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Methods {
  GET = 'Get',
  PULL = 'Pull',
  ENUMERATE = 'Enumerate',
  PUT = 'Put',
  DELETE = 'Delete',
  READ_RECORDS = 'ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'AddTrustedRootCertificate',
  ADD_CERTIFICATE = 'AddCertificate',
  ADD_MPS = 'AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'AddRemoteAccessPolicyRule',
  CREATE = 'Create',
  REQUEST_STATE_CHANGE = 'RequestStateChange',
  SET_BOOT_CONFIG_ROLE = 'SetBootConfigRole',
  GET_RECORDS = 'GetRecords',
  POSITION_TO_FIRST_RECORD = 'PositionToFirstRecord',
  COMMIT_CHANGES = 'commitChanges',
  UNPROVISION = 'Unprovision',
  SET_MEBX_PASSWORD = 'SetMEBxPassword',
  SET_ADMIN_ACL_ENTRY_EX = 'SetAdminAclEntryEx',
  GET_LOW_ACCURACY_TIME_SYNCH = 'GetLowAccuracyTimeSynch',
  SET_HIGH_ACCURACY_TIME_SYNCH = 'SetHighAccuracyTimeSynch',
  GENERATE_KEY_PAIR = 'GenerateKeyPair',
  ADD_WIFI_SETTINGS = 'AddWiFiSettings',
  ADD_ALARM = 'AddAlarm'
}
