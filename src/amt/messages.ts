/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors } from '../WSMan'
import { EthernetPortSettings, MPServer, RemoteAccessPolicyRule, EnvironmentDetectionSettingData, BootSettingData, RedirectionResponse, TLSSettingData, GenerateKeyPair, AddCertificate, GeneralSettings, TLSCredentialContext, RemoteAccessPolicyAppliesToMPS } from './models'
import { REQUEST_STATE_CHANGE } from './actions'
import { Classes, Methods, Actions } from './'
import { WiFiEndpointSettings } from '../models/cim_models'
import { AlarmClockOccurrence } from '../ips/models'

type AllActions = Actions

export interface AMTCall {
  method: Methods
  class: Classes
  enumerationContext?: string
  selector?: Selector
  requestedState?: number
  data?: RedirectionResponse
  maxElements?: number
}

export class Messages {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/amt-schema/1/'

  private readonly get = (action: AllActions, amtClass: Classes): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly enumerate = (action: AllActions, amtClass: Classes): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: AllActions, amtClass: Classes, enumerationContext: string): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly put = (action: AllActions, amtClass: Classes, data: RedirectionResponse): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const key = Object.keys(data)[0]
    const body = this.wsmanMessageCreator.createBody(Classes.AMT_REDIRECTION_SERVICE, this.resourceUriBase, key, data[key])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (action: AllActions, amtClass: Classes, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`, null, null, selector)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.DELETE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly requestStateChange = (action: string, amtClass: Classes, requestedState: number): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${amtClass}`)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.REQUEST_STATE_CHANGE, null, `${this.resourceUriBase}${amtClass}`, requestedState)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  amtSwitch = (amt: AMTCall): string => {
    switch (amt.method) {
      case Methods.GET:
        return this.get(Actions.GET, amt.class)
      case Methods.PUT:
        if (amt.data == null) { throw new Error(WSManErrors.BODY) }
        return this.put(Actions.PUT, amt.class, amt.data)
      case Methods.PULL:
        if (amt.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, amt.class, amt.enumerationContext)
      case Methods.ENUMERATE:
        return this.enumerate(Actions.ENUMERATE, amt.class)
      case Methods.DELETE:
        if (amt.selector == null) { throw new Error(WSManErrors.SELECTOR) }
        return this.delete(Actions.DELETE, amt.class, amt.selector)
      case Methods.REQUEST_STATE_CHANGE:
        if (amt.requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
        return this.requestStateChange(REQUEST_STATE_CHANGE(amt.class), amt.class, amt.requestedState)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  AuditLog = (method: Methods.READ_RECORDS, startIndex: number): string => {
    let header: string
    let body: string
    switch (method) {
      case Methods.READ_RECORDS:
        header = this.wsmanMessageCreator.createHeader(Actions.READ_RECORDS, `${this.resourceUriBase}${Classes.AMT_AUDIT_LOG}`)
        body = this.wsmanMessageCreator.createBody('ReadRecords_INPUT', this.resourceUriBase, Classes.AMT_AUDIT_LOG, { StartIndex: startIndex })
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  MessageLog = (method: Methods.GET_RECORDS | Methods.POSITION_TO_FIRST_RECORD, identifier?: number): string => {
    let header: string, body: string
    switch (method) {
      case Methods.POSITION_TO_FIRST_RECORD:
        header = this.wsmanMessageCreator.createHeader(Actions.POSITION_TO_FIRSTRECORD, `${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}`)
        body = `<Body><r:PositionToFirstRecord_INPUT xmlns:r="${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}" /></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.GET_RECORDS:
        header = this.wsmanMessageCreator.createHeader(Actions.GET_RECORDS, `${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}`)
        body = this.wsmanMessageCreator.createBody('GetRecords_INPUT', this.resourceUriBase, Classes.AMT_MESSAGE_LOG, { IterationIdentifier: identifier, MaxReadRecords: 390 })
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  BootCapabilities = (method: Methods.GET): string => {
    return this.amtSwitch({ method: method, class: Classes.AMT_BOOT_CAPABILITIES })
  }

  RedirectionService = (method: Methods.GET | Methods.REQUEST_STATE_CHANGE | Methods.PUT, requestedState?: number, data?: RedirectionResponse): string => {
    return this.amtSwitch({ method: method, class: Classes.AMT_REDIRECTION_SERVICE, requestedState, data })
  }

  SetupAndConfigurationService = (method: Methods.GET | Methods.UNPROVISION | Methods.SET_MEBX_PASSWORD | Methods.COMMIT_CHANGES, password?: string, provisioningMode?: number): string => {
    let header: string, body: string
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, class: Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE })
      case Methods.UNPROVISION:
        header = this.wsmanMessageCreator.createHeader(Actions.UNPROVISION, `${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}`)
        body = `<Body><r:Unprovision_INPUT xmlns:r="${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}"><r:ProvisioningMode>${provisioningMode}</r:ProvisioningMode></r:Unprovision_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.SET_MEBX_PASSWORD:
        header = this.wsmanMessageCreator.createHeader(Actions.SET_MEBX_PASSWORD, `${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}`)
        body = `<Body><r:SetMEBxPassword_INPUT xmlns:r="${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}"><r:Password>${password}</r:Password></r:SetMEBxPassword_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.COMMIT_CHANGES:
        header = this.wsmanMessageCreator.createHeader(Actions.COMMIT_CHANGES, `${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}`)
        body = this.wsmanMessageCreator.createBody('CommitChanges_INPUT', this.resourceUriBase, Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE, {})
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  GeneralSettings = (method: Methods.GET | Methods.PUT, data?: GeneralSettings): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, class: Classes.AMT_GENERAL_SETTINGS })
      case Methods.PUT: {
        if (data == null) throw new Error(WSManErrors.BODY)
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_GENERAL_SETTINGS}`)
        const body = this.wsmanMessageCreator.createBody('AMT_GeneralSettings', this.resourceUriBase, Classes.AMT_GENERAL_SETTINGS, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  EthernetPortSettings = (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT, enumerationContext?: string, ethernetPortObject?: EthernetPortSettings): string => {
    switch (method) {
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.amtSwitch({ method: method, class: Classes.AMT_ETHERNET_PORT_SETTINGS, enumerationContext })
      case Methods.PUT: {
        if (ethernetPortObject == null) { throw new Error(WSManErrors.ETHERNET_PORT_OBJECT) }
        const selector: Selector = { name: 'InstanceID', value: ethernetPortObject.InstanceID }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_ETHERNET_PORT_SETTINGS}`, null, null, selector)
        // AMT doesn't accept XML with null values, remove properties with null values before creating body
        Object.keys(ethernetPortObject).forEach(key => {
          if (ethernetPortObject[key] == null) {
            delete ethernetPortObject[key]
          }
        })
        const body = this.wsmanMessageCreator.createBody('AMT_EthernetPortSettings', this.resourceUriBase, Classes.AMT_ETHERNET_PORT_SETTINGS, ethernetPortObject)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  RemoteAccessPolicyRule = (method: Methods.DELETE, selector?: Selector): string => {
    return this.amtSwitch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_RULE, selector: selector })
  }

  ManagementPresenceRemoteSAP = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.amtSwitch({ method: method, class: Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, enumerationContext: enumerationContext })
      }
      case Methods.DELETE: {
        return this.amtSwitch({ method: method, class: Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, selector: selector })
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  TLSCredentialContext = (method: Methods.ENUMERATE | Methods.PULL | Methods.CREATE | Methods.DELETE, enumerationContext?: string, data?: TLSCredentialContext, selector?: any) => {
    switch (method) {
      case Methods.CREATE: {
        const header = this.wsmanMessageCreator.createHeader(Actions.CREATE, `${this.resourceUriBase}${Classes.AMT_TLS_CREDENTIAL_CONTEXT}`)
        const body = this.wsmanMessageCreator.createBody('AMT_TLSCredentialContext', this.resourceUriBase, Classes.AMT_TLS_CREDENTIAL_CONTEXT, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.amtSwitch({ method: method, class: Classes.AMT_TLS_CREDENTIAL_CONTEXT, enumerationContext: enumerationContext })
      case Methods.DELETE: {
        return this.amtSwitch({ method: method, class: Classes.AMT_TLS_CREDENTIAL_CONTEXT, selector: selector })
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  TLSSettingData = (method: Methods.ENUMERATE | Methods.PULL | Methods.PUT, enumerationContext?: string, data?: TLSSettingData) => {
    switch (method) {
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.amtSwitch({ method: method, class: Classes.AMT_TLS_SETTING_DATA, enumerationContext })
      case Methods.PUT: {
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_TLS_SETTING_DATA}`, null, null, { name: 'InstanceID', value: data.InstanceID })
        const body = this.wsmanMessageCreator.createBody('AMT_TLSSettingData', this.resourceUriBase, Classes.AMT_TLS_SETTING_DATA, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  PublicPrivateKeyPair = (method: Methods.ENUMERATE | Methods.PULL | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.amtSwitch({ method, class: Classes.AMT_PUBLIC_PRIVATE_KEY_PAIR, enumerationContext: enumerationContext })
      case Methods.DELETE:
        return this.amtSwitch({ method: method, class: Classes.AMT_PUBLIC_PRIVATE_KEY_PAIR, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  PublicKeyCertificate = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.amtSwitch({ method: method, class: Classes.AMT_PUBLIC_KEY_CERTIFICATE, enumerationContext: enumerationContext })
      }
      case Methods.DELETE: {
        return this.amtSwitch({ method: method, class: Classes.AMT_PUBLIC_KEY_CERTIFICATE, selector: selector })
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  EnvironmentDetectionSettingData = (method: Methods.GET | Methods.PUT, environmentDetectionSettingData?: EnvironmentDetectionSettingData): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, class: Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA })
      case Methods.PUT: {
        if (environmentDetectionSettingData == null) { throw new Error(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA) }
        const selector: Selector = { name: 'InstanceID', value: environmentDetectionSettingData.InstanceID }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}`, null, null, selector)
        let body = `<Body><r:AMT_EnvironmentDetectionSettingData xmlns:r="${this.resourceUriBase}${Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA}"><r:DetectionAlgorithm>${environmentDetectionSettingData.DetectionAlgorithm}</r:DetectionAlgorithm><r:ElementName>${environmentDetectionSettingData.ElementName}</r:ElementName><r:InstanceID>${environmentDetectionSettingData.InstanceID}</r:InstanceID>`
        environmentDetectionSettingData.DetectionStrings.forEach(function (item) {
          body += `<r:DetectionStrings>${item}</r:DetectionStrings>`
        })
        body += '</r:AMT_EnvironmentDetectionSettingData></Body>'
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  PublicKeyManagementService = (method: Methods.ADD_TRUSTED_ROOT_CERTIFICATE | Methods.GENERATE_KEY_PAIR | Methods.ADD_CERTIFICATE, data?: GenerateKeyPair | AddCertificate): string => {
    switch (method) {
      case Methods.GENERATE_KEY_PAIR: {
        const header = this.wsmanMessageCreator.createHeader(Actions.GENERATE_KEY_PAIR, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('GenerateKeyPair_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_CERTIFICATE: {
        if ((data as AddCertificate)?.CertificateBlob == null) throw new Error(WSManErrors.CERTIFICATE_BLOB)
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_CERTIFICATE, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('AddCertificate_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_TRUSTED_ROOT_CERTIFICATE: {
        if ((data as AddCertificate)?.CertificateBlob == null) throw new Error(WSManErrors.CERTIFICATE_BLOB)
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_TRUSTED_ROOT_CERTIFICATE, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('AddTrustedRootCertificate_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  RemoteAccessService = (method: Methods.ADD_MPS | Methods.ADD_REMOTE_ACCESS_POLICY_RULE, mpServer?: MPServer, remoteAccessPolicyRule?: RemoteAccessPolicyRule, selector?: Selector): string => {
    switch (method) {
      case Methods.ADD_MPS: {
        if (mpServer == null) { throw new Error(WSManErrors.MP_SERVER) }
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_MPS, `${this.resourceUriBase}${Classes.AMT_REMOTE_ACCESS_SERVICE}`)
        const body = `<Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpServer.InfoFormat}</r:InfoFormat><r:Port>${mpServer.Port}</r:Port><r:AuthMethod>${mpServer.AuthMethod}</r:AuthMethod><r:Username>${mpServer.Username}</r:Username><r:Password>${mpServer.Password}</r:Password><r:CN>${mpServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_REMOTE_ACCESS_POLICY_RULE: {
        if (remoteAccessPolicyRule == null) { throw new Error(WSManErrors.REMOTE_ACCESS_POLICY_RULE) }
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_REMOTE_ACCESS_POLICY_RULE, `${this.resourceUriBase}${Classes.AMT_REMOTE_ACCESS_SERVICE}`)
        const body = `<Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.Trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  UserInitiatedConnectionService = (method: Methods.REQUEST_STATE_CHANGE, requestedState?: number): string => {
    return this.amtSwitch({ method: method, class: Classes.AMT_USER_INITIATED_CONNECTION_SERVICE, requestedState: requestedState })
  }

  BootSettingData = (method: Methods.GET | Methods.PUT, bootSettingData?: BootSettingData): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method: method, class: Classes.AMT_BOOT_SETTING_DATA })
      case Methods.PUT: {
        if (bootSettingData == null) { throw new Error(WSManErrors.BOOT_SETTING_DATA) }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_BOOT_SETTING_DATA}`)
        let body = '<Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData">'
        bootSettingData.BIOSLastStatus?.forEach(function (item) {
          body += `<r:BIOSLastStatus>${item}</r:BIOSLastStatus>`
        })
        bootSettingData.UEFIBootNumberOfParams?.forEach(function (item) {
          body += `<r:UEFIBootNumberOfParams>${item}</r:UEFIBootNumberOfParams>`
        })
        bootSettingData.UEFIBootParametersArray?.forEach(function (item) {
          body += `<r:UEFIBootParametersArray>${item}</r:UEFIBootParametersArray>`
        })
        body += `<r:BIOSPause>${String(bootSettingData.BIOSPause)}</r:BIOSPause><r:BIOSSetup>${String(bootSettingData.BIOSSetup)}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${String(bootSettingData.ConfigurationDataReset)}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${String(bootSettingData.EnforceSecureBoot)}</r:EnforceSecureBoot><r:FirmwareVerbosity>${String(bootSettingData.FirmwareVerbosity)}</r:FirmwareVerbosity><r:ForcedProgressEvents>${String(bootSettingData.ForcedProgressEvents)}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceID}</r:InstanceID><r:LockKeyboard>${String(bootSettingData.LockKeyboard)}</r:LockKeyboard><r:LockPowerButton>${String(bootSettingData.LockPowerButton)}</r:LockPowerButton><r:LockResetButton>${String(bootSettingData.LockResetButton)}</r:LockResetButton><r:LockSleepButton>${String(bootSettingData.LockSleepButton)}</r:LockSleepButton><r:OptionsCleared>${String(bootSettingData.OptionsCleared)}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${String(bootSettingData.ReflashBIOS)}</r:ReflashBIOS><r:SecureErase>${String(bootSettingData.SecureErase)}</r:SecureErase><r:UseIDER>${String(bootSettingData.UseIDER)}</r:UseIDER><r:UseSOL>${String(bootSettingData.UseSOL)}</r:UseSOL><r:UseSafeMode>${String(bootSettingData.UseSafeMode)}</r:UseSafeMode><r:UserPasswordBypass>${String(bootSettingData.UserPasswordBypass)}</r:UserPasswordBypass></r:AMT_BootSettingData></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  AuthorizationService = (method: Methods.SET_ADMIN_ACL_ENTRY_EX, username: string, digestPassword: string): string => {
    switch (method) {
      case Methods.SET_ADMIN_ACL_ENTRY_EX: {
        const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_ADMIN_ACL_ENTRY_EX, `${this.resourceUriBase}${Classes.AMT_AUTHORIZATION_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('SetAdminAclEntryEx_INPUT', this.resourceUriBase, Classes.AMT_AUTHORIZATION_SERVICE, {
          Username: username,
          DigestPassword: digestPassword
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  TimeSynchronizationService = (method: Methods.GET_LOW_ACCURACY_TIME_SYNCH | Methods.SET_HIGH_ACCURACY_TIME_SYNCH, ta0?: number, tm1?: number, tm2?: number): string => {
    switch (method) {
      case Methods.GET_LOW_ACCURACY_TIME_SYNCH: {
        const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_LOW_ACCURACY_TIME_SYNCH, `${this.resourceUriBase}${Classes.AMT_TIME_SYNCHRONIZATION_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('GetLowAccuracyTimeSynch_INPUT', this.resourceUriBase, Classes.AMT_TIME_SYNCHRONIZATION_SERVICE)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.SET_HIGH_ACCURACY_TIME_SYNCH: {
        const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_HIGH_ACCURACY_TIME_SYNCH, `${this.resourceUriBase}${Classes.AMT_TIME_SYNCHRONIZATION_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('SetHighAccuracyTimeSynch_INPUT', this.resourceUriBase, Classes.AMT_TIME_SYNCHRONIZATION_SERVICE, {
          Ta0: ta0,
          Tm1: tm1,
          Tm2: tm2
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  WiFiPortConfigurationService = (method: Methods.ADD_WIFI_SETTINGS | Methods.PUT | Methods.GET, data?: WiFiEndpointSettings | any, selector?: Selector, enumerationContext?: string): string => {
    switch (method) {
      case Methods.PUT: {
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE}`, null, null, selector)
        const body = this.wsmanMessageCreator.createBody(Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, this.resourceUriBase, Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.GET:
        return this.amtSwitch({ method, class: Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, enumerationContext })
      case Methods.ADD_WIFI_SETTINGS: {
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_WIFI_SETTINGS, `${this.resourceUriBase}${Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE}`)
        const body = `<Body><r:AddWiFiSettings_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><r:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet></a:ReferenceParameters></r:WiFiEndpoint><r:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>${data.ElementName}</q:ElementName><q:InstanceID>${data.InstanceID}</q:InstanceID><q:AuthenticationMethod>${data.AuthenticationMethod}</q:AuthenticationMethod><q:EncryptionMethod>${data.EncryptionMethod}</q:EncryptionMethod><q:SSID>${data.SSID}</q:SSID><q:Priority>${data.Priority}</q:Priority><q:PSKPassPhrase>${data.PSKPassPhrase}</q:PSKPassPhrase></r:WiFiEndpointSettingsInput></r:AddWiFiSettings_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  RemoteAccessPolicyAppliesToMPS = (method: Methods.PULL | Methods.ENUMERATE | Methods.GET | Methods.DELETE | Methods.PUT, enumerationContext?: string, data?: RemoteAccessPolicyAppliesToMPS, maxElements?: number, selector?: Selector): string => {
    switch (method) {
      case Methods.ENUMERATE:
      case Methods.GET:
      case Methods.DELETE:
      case Methods.PULL: {
        return this.amtSwitch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, enumerationContext: enumerationContext, maxElements: maxElements, selector })
      }
      case Methods.PUT: {
        const action = (method === Methods.PUT ? Actions.PUT : Actions.CREATE)
        const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS}`)
        const body = this.wsmanMessageCreator.createBody(Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, this.resourceUriBase, Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  AlarmClockService = (method: Methods.ADD_ALARM | Methods.GET, data?: AlarmClockOccurrence | any): string => {
    switch (method) {
      case Methods.GET:
        return this.amtSwitch({ method, class: Classes.AMT_ALARM_CLOCK_SERVICE })
      case Methods.ADD_ALARM: {
        if (data == null) { throw new Error(WSManErrors.ADD_ALARM_DATA) }
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_ALARM, `${this.resourceUriBase}${Classes.AMT_ALARM_CLOCK_SERVICE}`)
        // toIsoString() is adding milliseconds... remove them by taking everything before the '.' and adding back the 'Z'
        const startTime = data.StartTime.toISOString().split('.')[0] + 'Z'
        let body = `<Body><p:AddAlarm_INPUT xmlns:p="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AlarmClockService"><p:AlarmTemplate><s:InstanceID xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${data.InstanceID}</s:InstanceID>`
        if (data.ElementName != null) {
          body += `<s:ElementName xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${data.ElementName}</s:ElementName>`
        }
        body += `<s:StartTime xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Datetime xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">${startTime}</p:Datetime></s:StartTime>`
        if (data.Interval != null) {
          const minutes: number = data.Interval % 60
          const hours: number = Math.floor(data.Interval / 60) % 24
          const days: number = Math.floor(data.Interval / 1440)
          body += `<s:Interval xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Interval xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">P${days}DT${hours}H${minutes}M</p:Interval></s:Interval>`
        }
        body += `<s:DeleteOnCompletion xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${String(data.DeleteOnCompletion)}</s:DeleteOnCompletion></p:AlarmTemplate></p:AddAlarm_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
