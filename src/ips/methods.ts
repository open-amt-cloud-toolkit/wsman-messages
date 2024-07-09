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
  SETUP = 'Setup',
  ADMIN_SETUP = 'AdminSetup',
  START_OPT_IN = 'StartOptIn',
  CANCEL_OPT_IN = 'CancelOptIn',
  SEND_OPT_IN_CODE = 'SendOptInCode',
  REQUEST_POWER_STATE_CHANGE = 'RequestPowerStateChange',
  ADD_NEXT_CERT_IN_CHAIN = 'AddNextCertInChain',
  SET_CERTIFICATES = 'SetCertificates',
  SET_CERTIFICATES_INPUT = 'SetCertificates_INPUT'
}
