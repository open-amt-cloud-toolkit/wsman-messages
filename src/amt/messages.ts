/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors } from '../WSMan'
import { REQUEST_STATE_CHANGE } from './actions'
import { Classes, Methods, Actions, Models, Types } from './'
import { AMT, CIM, IPS } from '../'

type AllActions = Actions

export interface AMTCall {
  method: Methods
  class: Classes
  enumerationContext?: string
  selector?: Selector
  requestedState?: number
  data?: Models.RedirectionResponse
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

  private readonly put = (action: AllActions, amtClass: Classes, data: Models.RedirectionResponse): string => {
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

  switch = (amt: AMTCall): string => {
    switch (amt.method) {
      case Methods.GET:
        return this.get(Actions.GET, amt.class)
      case Methods.PUT:
        if (amt.data == null) { throw new Error(WSManErrors.DATA) }
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

  /**
     * Accesses a representation of IEEE8021xCredentialContext.  This is referenced in AMT SDK as AMT_8021xCredentialContext
     * @method PULL - Requires enumerationContext.  Pulls instances of IEEE8021xCredentialContext, following an Enumerate operation
     * @method ENUMERATE - Enumerates the instances of IEEE8021xCredentialContext
     * @param enumerationContext string returned from an ENUMERATE call.
     * @returns string
     */
  IEEE8021xCredentialContext = (method: Methods.PULL | Methods.ENUMERATE | Methods.GET, enumerationContext?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_IEEE8021X_CREDENTIAL_CONTEXT, enumerationContext: enumerationContext })
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of IEEE8021xProfile.  This is referenced in AMT SDK as AMT_8021xProfile
   * @method PULL - Requires enumerationContext.  Pulls instances of IEEE8021xProfile, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of IEEE8021xProfile
   * @method PUT - Requires data as IEEE8021xProfile object.  Changes properties of IEEE8021xProfile
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param instance object returned from PULL call
   * @returns string
   */
  IEEE8021xProfile = (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT | Methods.GET, enumerationContext?: string, data?: Models.IEEE8021xProfile): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_IEEE8021X_PROFILE, enumerationContext: enumerationContext })
      }
      case Methods.PUT: {
        if (data == null) { throw new Error(WSManErrors.DATA) }
        const action = Actions.PUT
        const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${Classes.AMT_IEEE8021X_PROFILE}`)
        const body = this.wsmanMessageCreator.createBody(Classes.AMT_IEEE8021X_PROFILE, this.resourceUriBase, Classes.AMT_IEEE8021X_PROFILE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of AlarmClockService.
   * @method ADD_ALARM - Requires data.  This method creates an alarm that would wake the system at a given time.The method receives as input an embedded instance of type IPS_AlarmClockOccurrence, with the following fields set: StartTime, Interval, InstanceID, DeleteOnCompletion. Upon success, the method creates an instance of IPS_AlarmClockOccurrence which is associated with AlarmClockService.The method would fail if 5 instances or more of IPS_AlarmClockOccurrence already exist in the system.
   * @method GET - Gets the representation of AlarmClockOccurrence
   * @method ENUMERATE - Enumerates the instances of AlarmClockService
   * @method PULL - Requires enumerationContext.  Pulls instances of AlarmClockService, following an Enumerate operation
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param data AlarmClockOccurrence Object
   * @returns string
   */
  AlarmClockService = (method: Methods.ADD_ALARM | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, data?: IPS.Models.AlarmClockOccurrence | any): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.AMT_ALARM_CLOCK_SERVICE, enumerationContext: enumerationContext })
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

  /**
   * Accesses a representation of the AuditLog.
   * @method READ_RECORDS - Requires startIndex.  Returns a list of consecutive audit log records in chronological order: The first record in the returned array is the oldest record stored in the log. The record entries are returned as an array of base64Binary elements.
   * @method GET - Gets the representation of AuditLog
   * @method ENUMERATE - Enumerates the instances of AuditLog
   * @method PULL - Requires enumerationContext.  Pulls instances of AuditLog, following an Enumerate operation
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param startIndex Identifies the position of the first record to retrieve. An index of 1 indicates the first record in the log.
   * @returns string
   */
  AuditLog = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL | Methods.READ_RECORDS, enumerationContext?: string, startIndex?: number): string => {
    let header: string
    let body: string
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.AMT_AUDIT_LOG, enumerationContext: enumerationContext })
      case Methods.READ_RECORDS:
        if (startIndex == null) { startIndex = 1 }
        header = this.wsmanMessageCreator.createHeader(Actions.READ_RECORDS, `${this.resourceUriBase}${Classes.AMT_AUDIT_LOG}`)
        body = this.wsmanMessageCreator.createBody('ReadRecords_INPUT', this.resourceUriBase, Classes.AMT_AUDIT_LOG, { StartIndex: startIndex })
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of AuthorizationService.
   * @method SET_ADMIN_ACL_ENTRY_EX - Requires username and digestPassword.  Updates an Admin entry in the Intel(R) AMT device.
   * @method GET - Gets the representation of AuthorizationService
   * @method ENUMERATE - Enumerates the instances of AuthorizationService
   * @method PULL - Requires enumerationContext.  Pulls instances of AuthorizationService, following an Enumerate operation
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param username Username for access control. Contains 7-bit ASCII characters. String length is limited to 16 characters. Username cannot be an empty string.
   * @remarks Max Length 16
   * @param digestPassword An MD5 Hash of these parameters concatenated together (Username + ":" + DigestRealm + ":" + Password). The DigestRealm is a field in AMT_GeneralSettings.
   * @remarks OctetString
   * @returns string
   */
  AuthorizationService = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL | Methods.SET_ADMIN_ACL_ENTRY_EX, enumerationContext?: string, username?: string, digestPassword?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.AMT_AUTHORIZATION_SERVICE, enumerationContext: enumerationContext })
      case Methods.SET_ADMIN_ACL_ENTRY_EX: {
        if (username == null) { throw new Error(WSManErrors.USERNAME) }
        if (digestPassword == null) { throw new Error(WSManErrors.DIGEST_PASSWORD) }
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

  /**
   * Accesses a representation of the BootCapabilities options that the Intel® AMT device supports.
   * @method GET - Retrieves a representation of BootCapabilities.
   * @method PULL - Requires enumerationContext.  Pulls instances of BootCapabilities, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of BootCapabilities.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  BootCapabilities = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_BOOT_CAPABILITIES, enumerationContext: enumerationContext })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of BootSettingData.
   * @method GET - Retrieves a representation of BootSettingData.
   * @method PUT - Requires bootSettingData.  Changes properties of BootSettingData.
   * @method PULL - Requires enumerationContext.  Pulls instances of BootSettingData, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of BootSettingData.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param bootSettingData BootSettingData Object.
   * @returns string
   */
  BootSettingData = (method: Methods.GET | Methods.PUT | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, bootSettingData?: Models.BootSettingData): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_BOOT_SETTING_DATA, enumerationContext: enumerationContext })
      case Methods.PUT: {
        if (bootSettingData == null || bootSettingData.BIOSLastStatus == null || bootSettingData.UEFIBootNumberOfParams == null || bootSettingData.UEFIBootParametersArray == null) { throw new Error(WSManErrors.BOOT_SETTING_DATA) }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_BOOT_SETTING_DATA}`)
        let body = '<Body><r:AMT_BootSettingData xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData">'
        bootSettingData.BIOSLastStatus.forEach(function (item) {
          body += `<r:BIOSLastStatus>${item}</r:BIOSLastStatus>`
        })
        bootSettingData.UEFIBootNumberOfParams.forEach(function (item) {
          body += `<r:UEFIBootNumberOfParams>${item}</r:UEFIBootNumberOfParams>`
        })
        bootSettingData.UEFIBootParametersArray.forEach(function (item) {
          body += `<r:UEFIBootParametersArray>${item}</r:UEFIBootParametersArray>`
        })
        body += `<r:BIOSPause>${String(bootSettingData.BIOSPause)}</r:BIOSPause><r:BIOSSetup>${String(bootSettingData.BIOSSetup)}</r:BIOSSetup><r:BootMediaIndex>${bootSettingData.BootMediaIndex}</r:BootMediaIndex><r:ConfigurationDataReset>${String(bootSettingData.ConfigurationDataReset)}</r:ConfigurationDataReset><r:ElementName>${bootSettingData.ElementName}</r:ElementName><r:EnforceSecureBoot>${String(bootSettingData.EnforceSecureBoot)}</r:EnforceSecureBoot><r:FirmwareVerbosity>${String(bootSettingData.FirmwareVerbosity)}</r:FirmwareVerbosity><r:ForcedProgressEvents>${String(bootSettingData.ForcedProgressEvents)}</r:ForcedProgressEvents><r:IDERBootDevice>${bootSettingData.IDERBootDevice}</r:IDERBootDevice><r:InstanceID>${bootSettingData.InstanceID}</r:InstanceID><r:LockKeyboard>${String(bootSettingData.LockKeyboard)}</r:LockKeyboard><r:LockPowerButton>${String(bootSettingData.LockPowerButton)}</r:LockPowerButton><r:LockResetButton>${String(bootSettingData.LockResetButton)}</r:LockResetButton><r:LockSleepButton>${String(bootSettingData.LockSleepButton)}</r:LockSleepButton><r:OptionsCleared>${String(bootSettingData.OptionsCleared)}</r:OptionsCleared><r:OwningEntity>${bootSettingData.OwningEntity}</r:OwningEntity><r:ReflashBIOS>${String(bootSettingData.ReflashBIOS)}</r:ReflashBIOS><r:SecureErase>${String(bootSettingData.SecureErase)}</r:SecureErase><r:UseIDER>${String(bootSettingData.UseIDER)}</r:UseIDER><r:UseSOL>${String(bootSettingData.UseSOL)}</r:UseSOL><r:UseSafeMode>${String(bootSettingData.UseSafeMode)}</r:UseSafeMode><r:UserPasswordBypass>${String(bootSettingData.UserPasswordBypass)}</r:UserPasswordBypass></r:AMT_BootSettingData></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of EnvironmentDetectionSettingData.
   * @method GET - Retrieves a representation of EnvironmentDetectionSettingData.
   * @method PUT - Requires environmentDetectionSettingData.  Changes properties of EnvironmentDetectionSettingData.
   * @method PULL - Requires enumerationContext.  Pulls instances of EnvironmentDetectionSettingData, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of EnvironmentDetectionSettingData.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param environmentDetectionSettingData EnvironmentDetectionSettingData Object.
   * @returns string
   */
  EnvironmentDetectionSettingData = (method: Methods.GET | Methods.PUT | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, environmentDetectionSettingData?: Models.EnvironmentDetectionSettingData): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_ENVIRONMENT_DETECTION_SETTING_DATA, enumerationContext: enumerationContext })
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

  /**
   * Accesses a representation of the EthernetPortSettings.
   * @method PULL - Requires enumerationContext.  Pulls instances of EthernetPortSettings, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of EthernetPortSettings.
   * @method PUT - Requires ethernetPortObject.  Changes properties of the EthernetPortSettings.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param ethernetPortObject EthernetPortSettings Object.
   * @returns string
   */
  EthernetPortSettings = (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT | Methods.GET, enumerationContext?: string, ethernetPortObject?: Models.EthernetPortSettings): string => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method: method, class: Classes.AMT_ETHERNET_PORT_SETTINGS, enumerationContext })
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

  /**
   * Accesses a representation of the GeneralSettings.
   * @method GET - Retrieves a representation of GeneralSettings.
   * @method PUT - Requires generalSettings.  Changes properties of GeneralSettings.
   * @param generalSettings GeneralSettings Object.
   * @returns string
   */
  GeneralSettings = (method: Methods.GET | Methods.PUT | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, generalSettings?: Models.GeneralSettings): string => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method: method, class: Classes.AMT_GENERAL_SETTINGS, enumerationContext: enumerationContext })
      case Methods.PUT: {
        if (generalSettings == null) throw new Error(WSManErrors.GENERAL_SETTINGS)
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_GENERAL_SETTINGS}`)
        const body = this.wsmanMessageCreator.createBody('AMT_GeneralSettings', this.resourceUriBase, Classes.AMT_GENERAL_SETTINGS, generalSettings)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of the KerberosSettingData.
   * @method GET - Retrieves a representation of the KerberosSettingData.
   * @method PULL - Requires enumerationContext.  Pulls instances of KerberosSettingData, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of KerberosSettingData.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  KerberosSettingData = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method: method, class: Classes.AMT_KERBEROS_SETTING_DATA, enumerationContext: enumerationContext })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of a Management Presence Remote Service Access Point (or an MPS) to be accessed by the Intel(R) AMT subsystem from remote.
   * @method GET - Retrieves a representation of the ManagementPresenceRemoteSAP.
   * @method PULL - Requires enumerationContext.  Pulls instances of ManagementPresenceRemoteSAP, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of ManagementPresenceRemoteSAP.
   * @method DELETE - Requires selector.  Deletes the ManagementPresenceRemoteSAP instance.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param selector Selector Object.
   * @returns string
   */
  ManagementPresenceRemoteSAP = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE | Methods.GET, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, enumerationContext: enumerationContext })
      }
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_MANAGEMENT_PRESENCE_REMOTE_SAP, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of the MessageLog (Event Log)
   * @method GET - Retrieves a representation of the MessageLog.
   * @method PULL - Requires enumerationContext.  Pulls instances of MessageLog, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of MessageLog.
   * @method GET_RECORDS - Requires identifier.  Retrieves multiple records from MessageLog.
   * @method POSITION_TO_FIRST_RECORD - Requests that an iteration of the MessageLog be established and that the iterator be set to the first entry in the Log. An identifier for the iterator is returned as an output parameter of the method.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param identifier the IterationIdentifier input parameter is a numeric value (starting at 1) which is the position of the first record in the log that should be extracted.
   * @returns string
   */
  MessageLog = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL | Methods.GET_RECORDS | Methods.POSITION_TO_FIRST_RECORD, enumerationContext?: string, identifier?: number): string => {
    let header: string, body: string
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_MESSAGE_LOG, enumerationContext: enumerationContext })
      }
      case Methods.POSITION_TO_FIRST_RECORD:
        header = this.wsmanMessageCreator.createHeader(Actions.POSITION_TO_FIRSTRECORD, `${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}`)
        body = `<Body><r:PositionToFirstRecord_INPUT xmlns:r="${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}" /></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.GET_RECORDS:
        if (identifier == null) { identifier = 1 }
        header = this.wsmanMessageCreator.createHeader(Actions.GET_RECORDS, `${this.resourceUriBase}${Classes.AMT_MESSAGE_LOG}`)
        body = this.wsmanMessageCreator.createBody('GetRecords_INPUT', this.resourceUriBase, Classes.AMT_MESSAGE_LOG, { IterationIdentifier: identifier, MaxReadRecords: 390 })
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of MPSUsernamePassword.
   * @method GET - Retrieves a representation of MPSUsernamePassword.
   * @method PUT - Requires MPSUsernamePassword.  Changes properties of MPSUsernamePassword.
   * @method PULL - Requires enumerationContext.  Pulls instances of MPSUsernamePassword, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of MPSUsernamePassword.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param data MPSUsernamePassword Object.
   * @returns string
   */
  MPSUsernamePassword = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL | Methods.PUT, enumerationContext?: string, data?: AMT.Models.MPSUsernamePassword): string => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method: method, class: Classes.AMT_MPS_USERNAME_PASSWORD, enumerationContext: enumerationContext })
      case Methods.PUT: {
        if (data == null) throw new Error(WSManErrors.DATA)
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_MPS_USERNAME_PASSWORD}`)
        const body = this.wsmanMessageCreator.createBody(Classes.AMT_MPS_USERNAME_PASSWORD, this.resourceUriBase, Classes.AMT_MPS_USERNAME_PASSWORD, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of PublicKeyCertificate.
   * @method GET - Retrieves a representation of PublicKeyCertificate.
   * @method PULL - Requires enumerationContext.  Pulls instances of PublicKeyCertificate, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of PublicKeyCertificate.
   * @method DELETE - Requires selector.  Deletes the PublicKeyCertificate instance.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param selector Selector Object.
   * @returns string
   */
  PublicKeyCertificate = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE | Methods.GET, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_PUBLIC_KEY_CERTIFICATE, enumerationContext: enumerationContext })
      }
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_PUBLIC_KEY_CERTIFICATE, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of PublicKeyManagementCapabilities.
   * @method GET - Retrieves a representation of PublicKeyManagementCapabilities.
   * @method PULL - Requires enumerationContext.  Pulls instances of PublicKeyManagementCapabilities, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of PublicKeyManagementCapabilities.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  PublicKeyManagementCapabilities = (method: Methods.GET | Methods.PULL | Methods.ENUMERATE, enumerationContext?: string): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_PUBLIC_KEY_MANAGEMENT_CAPABILITIES, enumerationContext: enumerationContext })
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of PublicKeyManagementService.
   * @method GET - Retrieves a representation of PublicKeyManagementCapabilities.
   * @method PULL - Requires enumerationContext.  Pulls instances of PublicKeyManagementCapabilities, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of PublicKeyManagementCapabilities.
   * @method ADD_TRUSTED_ROOT_CERTIFICATE - Requires data as AddCertificate.  This method adds new root certificate to the Intel(R) AMT CertStore. A certificate cannot be removed if it is referenced (for example, used by TLS, 802.1X or EAC).
   * @method GENERATE_KEY_PAIR - Requires data as GenerateKeyPair.  This method is used to generate a key in the FW.
   * @method ADD_CERTIFICATE - Requires data as AddCertificate.  This method adds new certificate to the Intel(R) AMT CertStore. A certificate cannot be removed if it is referenced (for example, used by TLS, 802.1X or EAC).
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param data Accepts either GenerateKeyPair Object or AddCertificate Object.
   * @returns string
   */
  PublicKeyManagementService = (method: Methods.GET | Methods.ENUMERATE | Methods.PULL | Methods.ADD_TRUSTED_ROOT_CERTIFICATE | Methods.GENERATE_KEY_PAIR | Methods.ADD_CERTIFICATE | Methods.GENERATE_PKCS10_REQUEST_EX, enumerationContext?: string, data?: Models.GenerateKeyPair | Models.AddCertificate | Models.PKCS10Request): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL: {
        return this.switch({ method: method, class: Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, enumerationContext: enumerationContext })
      }
      case Methods.GENERATE_KEY_PAIR: {
        if ((data as Models.GenerateKeyPair)?.KeyAlgorithm == null || (data as Models.GenerateKeyPair)?.KeyLength == null) throw new Error(WSManErrors.KEY_PAIR)
        const header = this.wsmanMessageCreator.createHeader(Actions.GENERATE_KEY_PAIR, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('GenerateKeyPair_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_CERTIFICATE: {
        if ((data as Models.AddCertificate)?.CertificateBlob == null) throw new Error(WSManErrors.CERTIFICATE_BLOB)
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_CERTIFICATE, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('AddCertificate_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_TRUSTED_ROOT_CERTIFICATE: {
        if ((data as Models.AddCertificate)?.CertificateBlob == null) throw new Error(WSManErrors.CERTIFICATE_BLOB)
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_TRUSTED_ROOT_CERTIFICATE, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('AddTrustedRootCertificate_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.GENERATE_PKCS10_REQUEST_EX: {
        if ((data as Models.PKCS10Request) == null) throw new Error(WSManErrors.PKCS10Request)
        const header = this.wsmanMessageCreator.createHeader(Actions.GENERATE_PKCS10_REQUEST_EX, `${this.resourceUriBase}${Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE}`)
        const body = this.wsmanMessageCreator.createBody('GeneratePKCS10RequestEx_INPUT', this.resourceUriBase, Classes.AMT_PUBLIC_KEY_MANAGEMENT_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
 * Accesses a representation of the PublicPrivateKeyPair.
 * @method ENUMERATE - Enumerates the instances of PublicPrivateKeyPair.
 * @method PULL - Requires enumerationContext.  Pulls instances of PublicPrivateKeyPair, following an Enumerate operation.
 * @method DELETE - Requires selector.  Deletes the PublicPrivateKeyPair instance.
 * @param enumerationContext string returned from an ENUMERATE call.
 * @param selector Selector Object.
 * @returns string
 */
  PublicPrivateKeyPair = (method: Methods.ENUMERATE | Methods.PULL | Methods.DELETE | Methods.GET, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.AMT_PUBLIC_PRIVATE_KEY_PAIR, enumerationContext: enumerationContext })
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_PUBLIC_PRIVATE_KEY_PAIR, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of the RedirectionService, which encompasses the IDER and SOL redirection functionalities.
   * @method GET - Retrieves a representation of RedirectionService.
   * @method REQUEST_STATE_CHANGE - Requires requestedState.  Requests that the state of the element be changed to the value specified in the RequestedState parameter.  The supported values in requestedState are 32768-32771.
   * @method PUT - Requires data.  Changes properties of RedirectionService.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), 3 ('Timeout'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @remarks ValueMap={2, 3, 4, 6, 7, 8, 9, 10, 11, .., 32768, 32769, 32770, 32771, 32772..65535}
   * @remarks Values={Enabled, Disabled, Shut Down, Offline, Test, Defer, Quiesce, Reboot, Reset, DMTF Reserved, disable IDER and SOL, enable IDER and disable SOL, enable SOL and disable IDER, enable IDER and SOL, Vendor Reserved}
   * @param data RedirectionResponse Object.
   * @returns string
   */
  RedirectionService = (method: Methods.GET | Methods.REQUEST_STATE_CHANGE | Methods.PUT | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, requestedState?: Types.RedirectionService.RequestedState, data?: Models.RedirectionResponse): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_REDIRECTION_SERVICE, enumerationContext: enumerationContext })
      case Methods.REQUEST_STATE_CHANGE:
        return this.switch({ method: method, class: Classes.AMT_REDIRECTION_SERVICE, requestedState: requestedState })
      case Methods.PUT:
        return this.switch({ method: method, class: Classes.AMT_REDIRECTION_SERVICE, data: data })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of RemoteAccessPolicyAppliesToMPS.
   * @method PULL - Requires enumerationContext.  Pulls instances of RemoteAccessPolicyAppliesToMPS, following an Enumerate operation
   * @method ENUMERATE - Enumerates the instances of RemoteAccessPolicyAppliesToMPS
   * @method GET - Gets the representation of RemoteAccessPolicyAppliesToMPS
   * @method DELETE - Requires selector.  Deletes an instance
   * @method PUT - Requires data. Changes properties of RemoteAccessPolicyAppliesToMPS
   * @method CREATE - Requires data. Creates an instance of RemoteAccessPolicyAppliesToMPS
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param data RemoteAccessPolicyAppliesToMPS Object
   * @param selector Selector Object
   * @returns string
   */
  RemoteAccessPolicyAppliesToMPS = (method: Methods.PULL | Methods.ENUMERATE | Methods.GET | Methods.DELETE | Methods.PUT | Methods.CREATE, enumerationContext?: string, data?: Models.RemoteAccessPolicyAppliesToMPS, selector?: Selector): string => {
    switch (method) {
      case Methods.ENUMERATE:
      case Methods.GET:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, enumerationContext: enumerationContext })
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_APPLIES_TO_MPS, selector: selector })
      case Methods.CREATE:
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

  /**
   * Accesses a representation of a RemoteAccessPolicyRule.
   * @method DELETE - Requires selector.  Deletes the RemoteAccessPolicyRule.
   * @method GET - Retrieves a representation of RemoteAccessCapabilities.
   * @method PULL - Requires enumerationContext.  Pulls instances of RemoteAccessCapabilities, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of RemoteAccessCapabilities.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param selector Selector Object.
   * @returns string
   */
  RemoteAccessPolicyRule = (method: Methods.DELETE | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_RULE, enumerationContext: enumerationContext })
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_REMOTE_ACCESS_POLICY_RULE, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of RemoteAccessService.
   * @method GET - Retrieves a representation of RemoteAccessService.
   * @method PULL - Requires enumerationContext.  Pulls instances of RemoteAccessService, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of RemoteAccessService.
   * @method ADD_MPS - Requires mpServer.  Adds a Management Presence Server to the Intel(R) AMT subsystem. Creates an AMT_ManagementPresenceRemoteSAP instance and an AMT_RemoteAccessCredentialContext association to a credential. This credential may be an existing AMT_PublicKeyCertificate instance (if the created MPS is configured to use mutual authentication). If the created MpServer is configured to use username password authentication, an AMT_MPSUsernamePassword instance is created and used as the associated credential.
   * @method ADD_REMOTE_ACCESS_POLICY_RULE - Requires remoteAccessPolicyRule and selector.  Adds a Remote Access policy to the Intel(R) AMT subsystem. The policy defines an event that will trigger an establishment of a tunnel between AMT and a pre-configured MPS. Creates an AMT_RemoteAccessPolicyRule instance and associates it to a given list of AMT_ManagementPresenceRemoteSAP instances with AMT_PolicySetAppliesToElement association instances.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param mpServer MPServer Object.
   * @param remoteAccessPolicyRule RemoteAccessPolicyRule Object.
   * @param selector Selector Object.
   * @returns string
   */
  RemoteAccessService = (method: Methods.ADD_MPS | Methods.ADD_REMOTE_ACCESS_POLICY_RULE | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, mpServer?: Models.MPServer, remoteAccessPolicyRule?: Models.RemoteAccessPolicyRule, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_REMOTE_ACCESS_SERVICE, enumerationContext: enumerationContext })
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

  /**
   * Accesses a representation of the SetupAndConfigurationService.
   * @method GET - Retrieves a representation of SetupAndConfigurationService.
   * @method PULL - Requires enumerationContext.  Pulls instances of SetupAndConfigurationService, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of SetupAndConfigurationService.
   * @method UNPROVISION - provisioningMode not required, defaults to 1 if not provided.  Resets the Intel(R) AMT device to default factory settings. The device will need to be re-provisioned after this command.
   * @method SET_MEBX_PASSWORD - Requires password. This method sets the ME Bios extension password. It allows a remote caller to change the ME access password for the BIOS extension screen. This call succeeds depending on the password policy rule defined in MEBx (BIOS extension):"Default Password Only" - Method succeeds only when the current password is still the default value and only in PKI provisioning. "During Setup and Configuration" - Method succeeds only during provisioning, regardless of provisioning method or previous password value."ANYTIME" - Method will always succeed. (i.e. even when configured).
   * @method COMMIT_CHANGES - Commits pending configuration commands made to the Intel(R) AMT device. Completes configuration when in "IN-provisioning" state.
   * @method GET_UUID - This method returns the Universal Unique ID of the platform (UUID).
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param password Password needs to be strong: Contain at least one of: upper-case, lower-case, digit and special character.
   * @remarks Min Length = 8
   * @remarks Max Length = 32
   * @param provisioningMode Indicates the provisioning mode (Enterprise , Small Business or Remote Connectivity) the device will enter following successful completion of the command. Starting from Release 6.0 only effective value is ProvisioningModeEnterprise.
   * @remarks ValueMap={0, 1, 2, 3}
   * @remarks Values={ProvisioningModeCurrent, ProvisioningModeEnterprise, ProvisioningModeSmallBusiness, ProvisioningRemoteConnectivity}
   * @returns string
   */
  SetupAndConfigurationService = (method: Methods.GET | Methods.UNPROVISION | Methods.SET_MEBX_PASSWORD | Methods.COMMIT_CHANGES | Methods.GET_UUID | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, password?: string, provisioningMode?: Types.SetupAndConfigurationService.ProvisioningMode): string => {
    let header: string, body: string
    switch (method) {
      case Methods.GET_UUID:
        header = this.wsmanMessageCreator.createHeader(Actions.GET_UUID, `${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}`)
        body = this.wsmanMessageCreator.createBody(Methods.GET_UUID, this.resourceUriBase, Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE)
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE, enumerationContext: enumerationContext })
      case Methods.UNPROVISION:
        if (provisioningMode == null) { provisioningMode = 1 }
        header = this.wsmanMessageCreator.createHeader(Actions.UNPROVISION, `${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}`)
        body = `<Body><r:Unprovision_INPUT xmlns:r="${this.resourceUriBase}${Classes.AMT_SETUP_AND_CONFIGURATION_SERVICE}"><r:ProvisioningMode>${provisioningMode}</r:ProvisioningMode></r:Unprovision_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      case Methods.SET_MEBX_PASSWORD:
        if (password == null) throw new Error(WSManErrors.PASSWORD)
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

  /**
   * Accesses a representation of TimeSynchronizationService.
   * @method GET_LOW_ACCURACY_TIME_SYNCH - This method is used for reading the Intel(R) AMT device's internal clock.
   * @method SET_HIGH_ACCURACY_TIME_SYNCH - Requires ta0, tm1, tm2.  This method is used to synchronize the Intel(R) AMT device's internal clock with an external clock.
   * @method GET - Retrieves a representation of TimeSynchronizationService.
   * @method PULL - Requires enumerationContext.  Pulls instances of TimeSynchronizationService, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of TimeSynchronizationService.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param ta0 The time value received from invoking GetLowAccuracyTimeSynch().
   * @param tm1 The remote client timestamp after getting a response from GetLowAccuracyTimeSynch().
   * @param tm2 The remote client timestamp obtained immediately prior to invoking this method.
   * @returns string
   */
  TimeSynchronizationService = (method: Methods.GET_LOW_ACCURACY_TIME_SYNCH | Methods.SET_HIGH_ACCURACY_TIME_SYNCH | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, ta0?: number, tm1?: number, tm2?: number): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_TIME_SYNCHRONIZATION_SERVICE, enumerationContext })
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

  /**
   * Accesses a representation of the TLSCredentialContext.
   * @method ENUMERATE - Enumerates the instances of TLSCredentialContext.
   * @method PULL - Requires enumerationContext.  Pulls instances of TLSCredentialContext, following an Enumerate operation.
   * @method CREATE - Requires tlsCredentialContext.  Creates a new instance of TLSCredentialContext.
   * @method DELETE - Requires selector.  Deletes the TLSCredentialContext instance.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param tlsCredentialContext TLSCredentialContext Object.
   * @param selector Selector Object.
   * @returns string
   */
  TLSCredentialContext = (method: Methods.ENUMERATE | Methods.PULL | Methods.CREATE | Methods.DELETE | Methods.GET, enumerationContext?: string, tlsCredentialContext?: Models.TLSCredentialContext, selector?: Selector) => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_TLS_CREDENTIAL_CONTEXT, enumerationContext: enumerationContext })
      case Methods.CREATE: {
        if (tlsCredentialContext == null) { throw new Error(WSManErrors.TLS_CREDENTIAL_CONTEXT) }
        const header = this.wsmanMessageCreator.createHeader(Actions.CREATE, `${this.resourceUriBase}${Classes.AMT_TLS_CREDENTIAL_CONTEXT}`)
        const body = this.wsmanMessageCreator.createBody('AMT_TLSCredentialContext', this.resourceUriBase, Classes.AMT_TLS_CREDENTIAL_CONTEXT, tlsCredentialContext)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.DELETE:
        return this.switch({ method: method, class: Classes.AMT_TLS_CREDENTIAL_CONTEXT, selector: selector })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of the TLSSettingData.
   * @method ENUMERATE - Enumerates the instances of TLSSettingData.
   * @method PULL - Requires enumerationContext.  Pulls instances of TLSSettingData, following an Enumerate operation.
   * @method PUT - Requires tlsSettingData.  Changes properties of TLSSettingData.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param tlsSettingData TLSSettingData Object.
   * @returns string
   */
  TLSSettingData = (method: Methods.ENUMERATE | Methods.PULL | Methods.PUT | Methods.GET, enumerationContext?: string, tlsSettingData?: Models.TLSSettingData) => {
    switch (method) {
      case Methods.GET:
      case Methods.PULL:
      case Methods.ENUMERATE:
        return this.switch({ method: method, class: Classes.AMT_TLS_SETTING_DATA, enumerationContext })
      case Methods.PUT: {
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_TLS_SETTING_DATA}`, null, null, { name: 'InstanceID', value: tlsSettingData.InstanceID })
        const body = this.wsmanMessageCreator.createBody('AMT_TLSSettingData', this.resourceUriBase, Classes.AMT_TLS_SETTING_DATA, tlsSettingData)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of UserInitiatedConnectionService.
   * @method REQUEST_STATE_CHANGE - Requires requestedState.  Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  If 0 is returned, then the task completed successfully and the use of ConcreteJob was not required. If 4096 (0x1000) is returned, then the task will take some time to complete, ConcreteJob will be created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
   * @method GET - Retrieves a representation of UserInitiatedConnectionService.
   * @method PULL - Requires enumerationContext.  Pulls instances of UserInitiatedConnectionService, following an Enumerate operation.
   * @method ENUMERATE - Enumerates the instances of UserInitiatedConnectionService.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), 3 ('Timeout'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @returns string
   */
  UserInitiatedConnectionService = (method: Methods.REQUEST_STATE_CHANGE | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, requestedState?: Types.UserInitiatedConnectionService.RequestedState): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method: method, class: Classes.AMT_USER_INITIATED_CONNECTION_SERVICE, enumerationContext })
      case Methods.REQUEST_STATE_CHANGE:
        return this.switch({ method: method, class: Classes.AMT_USER_INITIATED_CONNECTION_SERVICE, requestedState: requestedState })
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  /**
   * Accesses a representation of WiFiPortConfigurationService.
   * @method ADD_WIFI_SETTINGS - Requires data and selector.  Atomically creates an instance of CIM_WifiEndpointSettings from the embedded instance parameter and optionally an instance of CIM_IEEE8021xSettings from the embedded instance parameter (if provided), associates the CIM_WiFiEndpointSettings instance with the referenced instance of CIM_WiFiEndpoint using an instance of CIM_ElementSettingData optionally associates the newly created or referenced by parameter instance of CIM_IEEE8021xSettings with the instance of CIM_WiFiEndpointSettings using an instance of CIM_ConcreteComponent and optionally associates the referenced instance of AMT_PublicKeyCertificate (if provided) with the instance of CIM_IEEE8021xSettings (if provided) using an instance of CIM_CredentialContext.
   * @method PUT - Requires data and selector.  Changes properties of WiFiEndpointSettings
   * @method GET - Retrieves a representation of WiFiEndpointSettings.
   * @param data WiFiEndpointSettings Object
   * @param selector Selector Object.
   * @param enumerationContext string returned from an ENUMERATE call.
   * @returns string
   */
  WiFiPortConfigurationService = (method: Methods.ADD_WIFI_SETTINGS | Methods.PUT | Methods.GET | Methods.ENUMERATE | Methods.PULL, enumerationContext?: string, data?: CIM.Models.WiFiEndpointSettings | any, selector?: Selector): string => {
    switch (method) {
      case Methods.GET:
      case Methods.ENUMERATE:
      case Methods.PULL:
        return this.switch({ method, class: Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, enumerationContext })
      case Methods.PUT: {
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        if (data == null) { throw new Error(WSManErrors.DATA) }
        const header = this.wsmanMessageCreator.createHeader(Actions.PUT, `${this.resourceUriBase}${Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE}`, null, null, selector)
        const body = this.wsmanMessageCreator.createBody(Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, this.resourceUriBase, Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE, data)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_WIFI_SETTINGS: {
        if (data == null) { throw new Error(WSManErrors.DATA) }
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        const header = this.wsmanMessageCreator.createHeader(Actions.ADD_WIFI_SETTINGS, `${this.resourceUriBase}${Classes.AMT_WIFI_PORT_CONFIGURATION_SERVICE}`)
        // HANDLE SPECIAL CHARACTERS FOR XML
        const encodedPassphrase = data.PSKPassPhrase.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
        const body = `<Body><r:AddWiFiSettings_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_WiFiPortConfigurationService"><r:WiFiEndpoint><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpoint</w:ResourceURI><w:SelectorSet><w:Selector Name="${selector.name}">${selector.value}</w:Selector></w:SelectorSet></a:ReferenceParameters></r:WiFiEndpoint><r:WiFiEndpointSettingsInput xmlns:q="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings"><q:ElementName>${data.ElementName}</q:ElementName><q:InstanceID>${data.InstanceID}</q:InstanceID><q:AuthenticationMethod>${data.AuthenticationMethod}</q:AuthenticationMethod><q:EncryptionMethod>${data.EncryptionMethod}</q:EncryptionMethod><q:SSID>${data.SSID}</q:SSID><q:Priority>${data.Priority}</q:Priority><q:PSKPassPhrase>${encodedPassphrase}</q:PSKPassPhrase></r:WiFiEndpointSettingsInput></r:AddWiFiSettings_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
