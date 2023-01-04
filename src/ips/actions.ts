/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Actions {
  ADD_NEXT_CERT_IN_CHAIN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AddNextCertInChain',
  ADMIN_SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/AdminSetup',
  CANCEL_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/CancelOptIn',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  SEND_OPT_IN_CODE = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/SendOptInCode',
  SET_CERTIFICATES = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_IEEE8021xSettings/SetCertificates',
  SETUP = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup',
  START_OPT_IN = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_OptInService/StartOptIn'
}
