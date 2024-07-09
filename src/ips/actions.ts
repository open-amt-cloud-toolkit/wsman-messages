/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

export enum Actions {
  SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup',
  ADMIN_SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AdminSetup',
  UPGRADE_CLIENT_TO_ADMIN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/UpgradeClientToAdmin',
  ADD_NEXT_CERT_IN_CHAIN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AddNextCertInChain',
  START_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn',
  CANCEL_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn',
  SEND_OPT_IN_CODE = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode',
  SET_CERTIFICATES = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_IEEE8021xSettings/SetCertificates'
}
