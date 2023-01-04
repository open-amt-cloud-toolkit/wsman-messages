/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Methods {
  ADD_ALARM = 'AddAlarm',
  ADD_CERTIFICATE = 'AddCertificate',
  ADD_MPS = 'AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'AddRemoteAccessPolicyRule',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'AddTrustedRootCertificate',
  ADD_WIFI_SETTINGS = 'AddWiFiSettings',
  COMMIT_CHANGES = 'commitChanges',
  CREATE = 'Create',
  DELETE = 'Delete',
  ENUMERATE = 'Enumerate',
  GENERATE_KEY_PAIR = 'GenerateKeyPair',
  GENERATE_PKCS10_REQUEST_EX = 'GeneratePKCS10RequestEx',
  GET = 'Get',
  GET_LOW_ACCURACY_TIME_SYNCH = 'GetLowAccuracyTimeSynch',
  GET_RECORDS = 'GetRecords',
  GET_UUID = 'GetUuid',
  POSITION_TO_FIRST_RECORD = 'PositionToFirstRecord',
  PULL = 'Pull',
  PUT = 'Put',
  READ_RECORDS = 'ReadRecords',
  REQUEST_STATE_CHANGE = 'RequestStateChange',
  SET_ADMIN_ACL_ENTRY_EX = 'SetAdminAclEntryEx',
  SET_BOOT_CONFIG_ROLE = 'SetBootConfigRole',
  SET_HIGH_ACCURACY_TIME_SYNCH = 'SetHighAccuracyTimeSynch',
  SET_MEBX_PASSWORD = 'SetMEBxPassword',
  UNPROVISION = 'Unprovision'
}
