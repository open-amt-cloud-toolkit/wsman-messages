/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum Actions {
  CHANGE_BOOT_ORDER = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting/ChangeBootOrder',
  DELETE = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  ENUMERATE = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  GET = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  PULL = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  PUT = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  REQUEST_POWER_STATE_CHANGE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService/RequestPowerStateChange',
  SET_BOOT_CONFIG_ROLE = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole'
}
const REQUEST_STATE_CHANGE = (className: string): string => `http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/${className}/RequestStateChange`

export { REQUEST_STATE_CHANGE }
