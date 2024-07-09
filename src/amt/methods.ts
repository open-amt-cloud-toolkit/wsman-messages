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
  ADD_ALARM = 'AddAlarm',
  GENERATE_PKCS10_REQUEST_EX = 'GeneratePKCS10RequestEx',
  GET_UUID = 'GetUuid',
  ENUMERATE_USER_ACL_ENTRIES = 'EnumerateUserAclEntries',
  GET_ACL_ENABLED_STATE = 'GetAclEnabledState',
  GET_ADMIN_ACL_ENTRY = 'GetAdminAclEntry',
  GET_ADMIN_ACL_ENTRY_STATUS = 'GetAdminAclEntryStatus',
  GET_ADMIN_NET_ACL_ENTRY_STATUS = 'GetAdminNetAclEntryStatus',
  GET_USER_ACL_ENTRY_EX = 'GetUserAclEntryEx',
  REMOVE_USER_ACL_ENTRY = 'RemoveUserAclEntry',
  SET_ACL_ENABLED_STATE = 'SetAclEnabledState',
  UPDATE_USER_ACL_ENTRY_EX = 'UpdateUserAclEntryEx',
  ADD_USER_ACL_ENTRY_EX = 'AddUserAclEntryEx'
}
