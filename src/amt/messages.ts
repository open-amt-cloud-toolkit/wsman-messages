/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM } from '../'
import { Base, BaseActions, WSManErrors, WSManMessageCreator } from '../WSMan'
import { Classes, Actions, Methods } from './'
import type { Models, Types } from './'
import type { IPS } from '../'
import type { Selector } from '../WSMan'

class AlarmClockService extends Base {
  className = Classes.ALARM_CLOCK_SERVICE
  /**
   * This method creates an alarm that would wake the system at a given time.The method receives as input an embedded instance of type IPS_AlarmClockOccurrence, with the following fields set: StartTime, Interval, InstanceID, DeleteOnCompletion. Upon success, the method creates an instance of IPS_AlarmClockOccurrence which is associated with AlarmClockService.The method would fail if 5 instances or more of IPS_AlarmClockOccurrence already exist in the system.
   * @param alarmClockOccurrence IPS.Models.AlarmClockOccurrence Object
   * @returns string
   */
  AddAlarm = (alarmClockOccurrence: IPS.Models.AlarmClockOccurrence): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_ALARM, this.className)
    // toIsoString() is adding milliseconds... remove them by taking everything before the '.' and adding back the 'Z'
    const startTime = alarmClockOccurrence.StartTime.toISOString().split('.')[0] + 'Z'
    let body = `<Body><p:AddAlarm_INPUT xmlns:p="${this.wsmanMessageCreator.resourceUriBase}AMT_AlarmClockService"><p:AlarmTemplate><s:InstanceID xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${alarmClockOccurrence.InstanceID}</s:InstanceID>`
    if (alarmClockOccurrence.ElementName != null) {
      body += `<s:ElementName xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${alarmClockOccurrence.ElementName}</s:ElementName>`
    }
    body += `<s:StartTime xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Datetime xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">${startTime}</p:Datetime></s:StartTime>`
    if (alarmClockOccurrence.Interval != null) {
      const minutes: number = alarmClockOccurrence.Interval % 60
      const hours: number = Math.floor(alarmClockOccurrence.Interval / 60) % 24
      const days: number = Math.floor(alarmClockOccurrence.Interval / 1440)
      body += `<s:Interval xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence"><p:Interval xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/common">P${days}DT${hours}H${minutes}M</p:Interval></s:Interval>`
    }
    body += `<s:DeleteOnCompletion xmlns:s="http://intel.com/wbem/wscim/1/ips-schema/1/IPS_AlarmClockOccurrence">${String(alarmClockOccurrence.DeleteOnCompletion)}</s:DeleteOnCompletion></p:AlarmTemplate></p:AddAlarm_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Changes properties of the selected instance
   * @param alarmClockService An instance of AlarmClockService
   * @returns string
   */
  Put = (alarmClockService: Models.AlarmClockService): string => this.protectedPut(alarmClockService, false)
}
class AuditLog extends Base {
  className = Classes.AUDIT_LOG
  /**
   * Returns a list of consecutive audit log records in chronological order: The first record in the returned array is the oldest record stored in the log. The record entries are returned as an array of base64Binary elements.
   * @param startIndex Identifies the position of the first record to retrieve. An index of 1 indicates the first record in the log.  If startIndex isn't provided, defaults to 1.
   * @returns string
   */
  ReadRecords = (startIndex?: number): string => {
    if (startIndex === undefined) { startIndex = 1 }
    const header = this.wsmanMessageCreator.createHeader(Actions.READ_RECORDS, this.className)
    const body = this.wsmanMessageCreator.createBody('ReadRecords_INPUT', this.className, [{ StartIndex: startIndex }])
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class AuthorizationService extends Base {
  className = Classes.AUTHORIZATION_SERVICE
  /**
   * Adds a user entry to the Intel(R) AMT device.
   * @param accessPermission Indicates whether the User is allowed to access Intel(R) AMT from the Network or Local Interfaces. Note: this definition is restricted by the Default Interface Access Permissions of each Realm.
   * @param realms Array of interface names the ACL entry is allowed to access.
   * @param digestUsername Username for access control. Contains 7-bit ASCII characters. String length is limited to 16 characters. Username cannot be an empty string.
   * @param digestPassword An MD5 Hash of these parameters concatenated together (Username + ":" + DigestRealm + ":" + Password). The DigestRealm is a field in AMT_GeneralSettings
   * @param kerberosUserSid Descriptor for user (SID) which is authenticated using the Kerberos Authentication. Byte array, specifying the Security Identifier (SID) according to the Kerberos specification. Current requirements imply that SID should be not smaller than 1 byte length and no longer than 28 bytes. SID length should also be a multiplicand of 4.
   * @returns string
   */
  AddUserAclEntryEx = (accessPermission: Types.AuthorizationService.AccessPermission, realms: Types.AuthorizationService.Realms, digestUsername?: string, digestPassword?: string, kerberosUserSid?: string): string => {
    if ((!digestUsername || !digestPassword) && !kerberosUserSid) { throw new Error(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION) }
    if (digestUsername && digestUsername.length > 16) { throw new Error(WSManErrors.USERNAME_TOO_LONG) }
    const header: string = this.wsmanMessageCreator.createHeader(Actions.ADD_USER_ACL_ENTRY_EX, this.className)
    const aclObject: Models.UserAclEntry = {
      DigestUsername: digestUsername,
      DigestPassword: digestPassword,
      KerberosUserSid: kerberosUserSid,
      AccessPermission: accessPermission,
      Realms: realms
    }
    const body: string = this.wsmanMessageCreator.createBody('AddUserAclEntryEx_INPUT', this.className, [aclObject])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Enumerates entries in the User Access Control List (ACL). Only 50 handles can be returned, so in order to get others startIndex should be bigger than 1.
   * @param startIndex Indicates the first ACL entry to retrieve. if startIndex isn't provided, it will be set to 1
   * @returns string
   */
  EnumerateUserAclEntries = (startIndex?: number): string => {
    if (!startIndex) startIndex = 1
    const header: string = this.wsmanMessageCreator.createHeader(Actions.ENUMERATE_USER_ACL_ENTRIES, this.className)
    const body: string = this.wsmanMessageCreator.createBody('EnumerateUserAclEntries_INPUT', this.className, [{ StartIndex: startIndex }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Gets the state of a user ACL entry (enabled/disabled)
   * @param handle Specifies the ACL entry
   * @returns string
   */
  GetAclEnabledState = (handle: number): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_ACL_ENABLED_STATE, this.className)
    const body: string = this.wsmanMessageCreator.createBody('GetAclEnabledState_INPUT', this.className, [{ Handle: handle }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Returns the username attribute of the Admin ACL.
   * @returns string
   */
  GetAdminAclEntry = (): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_ADMIN_ACL_ENTRY, this.className)
    const body: string = this.wsmanMessageCreator.createBody('GetAdminAclEntry_INPUT', this.className, [{}])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Reads the Admin ACL Entry status from Intel(R) AMT. The return state changes as a function of the admin password.  TRUE if the admin ACL entry (admin password) was never changed by the user. Otherwise, the parameter is FALSE.
   * @returns string
   */
  GetAdminAclEntryStatus = (): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_ADMIN_ACL_ENTRY_STATUS, this.className)
    const body: string = this.wsmanMessageCreator.createBody('GetAdminAclEntryStatus_INPUT', this.className, [{}])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Reads the remote Admin ACL Entry status from Intel(R) AMT. The return state changes as a function of the remote admin password.  TRUE if the admin ACL entry (admin password) was never changed by the user. Otherwise, the parameter is FALSE.
   * @returns string
   */
  GetAdminNetAclEntryStatus = (): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_ADMIN_NET_ACL_ENTRY_STATUS, this.className)
    const body: string = this.wsmanMessageCreator.createBody('GetAdminNetAclEntryStatus_INPUT', this.className, [{}])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Reads a user entry from the Intel(R) AMT device. Note: confidential information, such as password (hash) is omitted or zeroed in the response.
   * @param handle Specifies the ACL entry to fetch.
   * @returns string
   */
  GetUserAclEntryEx = (handle: number): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_USER_ACL_ENTRY_EX, this.className)
    const body: string = this.wsmanMessageCreator.createBody('GetUserAclEntryEx_INPUT', this.className, [{ Handle: handle }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
  * Removes an entry from the User Access Control List (ACL), given a handle.
  * @param handle Specifies the ACL entry to be removed.
  * @returns string
  */
  RemoveUserAclEntry = (handle: number): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.REMOVE_USER_ACL_ENTRY, this.className)
    const body: string = this.wsmanMessageCreator.createBody('RemoveUserAclEntry_INPUT', this.className, [{ Handle: handle }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Enables or disables a user ACL entry.Disabling ACL entries is useful when accounts that cannot be removed (system accounts - starting with $$) are required to be disabled.
   * @param handle Specifies the ACL entry to update
   * @param enabled Specifies the state of the ACL entry
   * @returns string
   */
  SetAclEnabledState = (handle: number, enabled: boolean): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_ACL_ENABLED_STATE, this.className)
    const body: string = this.wsmanMessageCreator.createBody('SetAclEnabledState_INPUT', this.className, [{ Handle: handle, Enabled: enabled }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Updates an Admin entry in the Intel(R) AMT device.
   * @param username Username for access control. Contains 7-bit ASCII characters. String length is limited to 16 characters. Username cannot be an empty string.
   * @param digestPassword An MD5 Hash of these parameters concatenated together (Username + ":" + DigestRealm + ":" + Password). The DigestRealm is a field in AMT_GeneralSettings.
   * @returns string
   */
  SetAdminACLEntryEx = (username: string, digestPassword: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_ADMIN_ACL_ENTRY_EX, this.className)
    const body: string = this.wsmanMessageCreator.createBody('SetAdminAclEntryEx_INPUT', this.className, [{
      Username: username,
      DigestPassword: digestPassword
    }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Updates a user entry in the Intel(R) AMT device.
   * @param handle Creation handle to a User ACL entry.
   * @param accessPermission Indicates whether the User is allowed to access Intel(R) AMT from the Network or Local Interfaces. Note: this definition is restricted by the Default Interface Access Permissions of each Realm.
   * @param realms Array of interface names the ACL entry is allowed to access.
   * @param digestUsername Username for access control. Contains 7-bit ASCII characters. String length is limited to 16 characters. Username cannot be an empty string.
   * @param digestPassword An MD5 Hash of these parameters concatenated together (Username + ":" + DigestRealm + ":" + Password). The DigestRealm is a field in AMT_GeneralSettings
   * @param kerberosUserSid Descriptor for user (SID) which is authenticated using the Kerberos Authentication. Byte array, specifying the Security Identifier (SID) according to the Kerberos specification. Current requirements imply that SID should be not smaller than 1 byte length and no longer than 28 bytes. SID length should also be a multiplicand of 4.
   * @returns string
   */
  UpdateUserAclEntryEx = (handle: number, accessPermission: Types.AuthorizationService.AccessPermission, realms: Types.AuthorizationService.Realms, digestUsername?: string, digestPassword?: string, kerberosUserSid?: string): string => {
    if ((!digestUsername || !digestPassword) && !kerberosUserSid) { throw new Error(WSManErrors.MISSING_USER_ACL_ENTRY_INFORMATION) }
    if (digestUsername && digestUsername.length > 16) { throw new Error(WSManErrors.USERNAME_TOO_LONG) }
    const header: string = this.wsmanMessageCreator.createHeader(Actions.UPDATE_USER_ACL_ENTRY_EX, this.className)
    const aclObject: Models.UserAclEntry = {
      Handle: handle,
      DigestUsername: digestUsername,
      DigestPassword: digestPassword,
      KerberosUserSid: kerberosUserSid,
      AccessPermission: accessPermission,
      Realms: realms
    }
    const body: string = this.wsmanMessageCreator.createBody('UpdateUserAclEntryEx_INPUT', this.className, [aclObject])
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class BootCapabilities extends Base {
  className = Classes.BOOT_CAPABILITIES
}
class BootSettingData extends Base {
  className = Classes.BOOT_SETTING_DATA
  /**
   * Changes properties of BootSettingData.
   * @param bootSettingData BootSettingData Object.
   * @returns string
   */
  Put = (bootSettingData: Models.BootSettingData): string => this.protectedPut(bootSettingData, false)
}
class EnvironmentDetectionSettingData extends Base {
  className = Classes.ENVIRONMENT_DETECTION_SETTING_DATA
  /**
   * Changes properties of EnvironmentDetectionSettingData.
   * @param environmentDetectionSettingData EnvironmentDetectionSettingData Object.
   * @returns string
   */
  Put = (environmentDetectionSettingData: Models.EnvironmentDetectionSettingData): string => this.protectedPut(environmentDetectionSettingData, true)
}
class EthernetPortSettings extends Base {
  className = Classes.ETHERNET_PORT_SETTINGS
  /**
   * Changes properties of the EthernetPortSettings.
   * @param ethernetPortObject EthernetPortSettings Object.
   * @returns string
   */
  Put = (ethernetPortObject: Models.EthernetPortSettings): string => this.protectedPut(ethernetPortObject, true)
}
class GeneralSettings extends Base {
  className = Classes.GENERAL_SETTINGS
  /**
   * Changes properties of GeneralSettings.
   * @param generalSettings GeneralSettings Object.
   * @returns string
   */
  Put = (generalSettings: Models.GeneralSettings): string => this.protectedPut(generalSettings, false)
}
class IEEE8021xCredentialContext extends Base {
  className = Classes.IEEE8021X_CREDENTIAL_CONTEXT
}
class IEEE8021xProfile extends Base {
  className = Classes.IEEE8021X_PROFILE
  /**
   * Changes properties of IEEE8021xProfile
   * @param ieee8021xProfile IEEE8021xProfile Object
   * @returns string
   */
  Put = (ieee8021xProfile: Models.IEEE8021xProfile): string => this.protectedPut(ieee8021xProfile, false)
}
class KerberosSettingData extends Base {
  className = Classes.KERBEROS_SETTING_DATA
  /**
   * Gets the current state of the credential caching functionality
   * @returns string
   */
  GetCredentialCacheState = (): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.GET_CREDENTIAL_CACHE_STATE, this.className)
    const body = this.wsmanMessageCreator.createBody('GetCredentialCacheState_INPUT', this.className)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Enables/disables the credential caching functionality
   * @param enabled New state of the functionality
   * @returns string
   */
  SetCredentialCacheState = (enabled: boolean): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.SET_CREDENTIAL_CACHE_STATE, this.className)
    const body = this.wsmanMessageCreator.createBody('SetCredentialCacheState_INPUT', this.className, [enabled])
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class ManagementPresenceRemoteSAP extends Base {
  className = Classes.MANAGEMENT_PRESENCE_REMOTE_SAP
  /**
   * Deletes an instance
   * @param selector indicates the instance
   * @returns string
   */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
}
class MessageLog extends Base {
  className = Classes.MESSAGE_LOG
  /**
   * Retrieves multiple records from MessageLog.
   * @param identifier the IterationIdentifier input parameter is a numeric value (starting at 1) which is the position of the first record in the log that should be extracted.  If identifier isn't provided, defaults to 1.
   * @returns string
   */
  GetRecords = (identifier?: number): string => {
    if (identifier === undefined) { identifier = 1 }
    const header = this.wsmanMessageCreator.createHeader(Actions.GET_RECORDS, this.className)
    const body = this.wsmanMessageCreator.createBody('GetRecords_INPUT', this.className, [{ IterationIdentifier: identifier, MaxReadRecords: 390 }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Requests that an iteration of the MessageLog be established and that the iterator be set to the first entry in the Log. An identifier for the iterator is returned as an output parameter of the method.
   * @returns string
   */
  PositionToFirstRecord = (): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.POSITION_TO_FIRST_RECORD, this.className)
    const body = `<Body><h:PositionToFirstRecord_INPUT xmlns:h="${this.wsmanMessageCreator.resourceUriBase}${this.className}" /></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class MPSUsernamePassword extends Base {
  className = Classes.MPS_USERNAME_PASSWORD
  /**
  * Changes properties of MPSUsernamePassword.
  * @param  mpsUsernamePassword MPSUsernamePassword Object.
  * @returns string
  */
  Put = (mpsUsernamePassword: Models.MPSUsernamePassword): string => this.protectedPut(mpsUsernamePassword, false)
}
class PublicKeyCertificate extends Base {
  className = Classes.PUBLIC_KEY_CERTIFICATE
  /**
   * Deletes an instance
   * @param selector indicates the instance
   * @returns string
   */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
  /**
   * Changes properties of PublicKeyCertificate.
   * @param publicKeyCertificate Public Key Certificate object
   * @returns string
   */
  Put = (publicKeyCertificate: Models.PublicKeyCertificate): string => this.protectedPut(publicKeyCertificate, false)
}
class PublicKeyManagementService extends Base {
  className = Classes.PUBLIC_KEY_MANAGEMENT_SERVICE
  /**
   * This method adds new certificate to the Intel(R) AMT CertStore. A certificate cannot be removed if it is referenced (for example, used by TLS, 802.1X or EAC).
   * @param addCertificate AddCertificate Object
   * @returns string
   */
  AddCertificate = (addCertificate: Models.AddCertificate): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_CERTIFICATE, this.className)
    const body = this.wsmanMessageCreator.createBody('AddCertificate_INPUT', this.className, [addCertificate])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * This function adds new certificate key to the Intel(R) AMT CertStore. A key cannot be removed if its corresponding certificate is referenced (for example, used by TLS or 802.1X).
   * @param keyBlob RSA Key encoded as DES PKCS#1
   * @returns string
   */
  AddKey = (keyBlob: string): string => {
    const keyObj = {
      KeyBlob: keyBlob
    }
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_KEY, this.className)
    const body = this.wsmanMessageCreator.createBody('AddKey_INPUT', this.className, [keyObj])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * This method adds new root certificate to the Intel(R) AMT CertStore. A certificate cannot be removed if it is referenced (for example, used by TLS, 802.1X or EAC).
   * @param addCertificate AddCertificate Object
   * @returns string
   */
  AddTrustedRootCertificate = (addCertificate: Models.AddCertificate): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_TRUSTED_ROOT_CERTIFICATE, this.className)
    const body = this.wsmanMessageCreator.createBody('AddTrustedRootCertificate_INPUT', this.className, [addCertificate])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * This method is used to generate a key in the FW.
   * @param keyPairParameters KeyPairParameters Object
   * @returns string
   */
  GenerateKeyPair = (keyPairParameters: Models.GenerateKeyPairParameters): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.GENERATE_KEY_PAIR, this.className)
    const body = this.wsmanMessageCreator.createBody('GenerateKeyPair_INPUT', this.className, [keyPairParameters])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * This method is used to create a PKCS#10 certificate signing request based on a key from the key store.
   * @param pkcs10Request PKCS10Request Object
   * @returns string
   */
  GeneratePKCS10RequestEx = (pkcs10Request: Models.PKCS10Request): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.GENERATE_PKCS10_REQUEST_EX, this.className)
    const body = this.wsmanMessageCreator.createBody('GeneratePKCS10RequestEx_INPUT', this.className, [pkcs10Request])
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class PublicPrivateKeyPair extends Base {
  className = Classes.PUBLIC_PRIVATE_KEY_PAIR/**
  * Deletes an instance
  * @param selector indicates the instance
  * @returns string
  */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
}
class RedirectionService extends Base {
  className = Classes.REDIRECTION_SERVICE
  /**
   * Changes properties of RedirectionService.
   * @param redirectionService RedirectionService Object.
   * @returns string
   */
  Put = (redirectionService: Models.RedirectionService): string => this.protectedPut(redirectionService, false)
  /**
   * Requests that the state of the element be changed to the value specified in the RequestedState parameter.  The supported values in requestedState are 32768-32771.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), 3 ('Timeout'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @value_map 32768 = disable IDER and SOL, 32769 = enable IDER and disable SOL, 32770 = enable SOL and disable IDER, 32771 = enable IDER and SOL
   * @returns string
   */
  RequestStateChange = (requestedState: Types.RedirectionService.RequestedState): string => this.protectedRequestStateChange(`http://intel.com/wbem/wscim/1/amt-schema/1/${this.className}/RequestStateChange`, requestedState)
}
class RemoteAccessPolicyAppliesToMPS extends Base {
  className = Classes.REMOTE_ACCESS_POLICY_APPLIES_TO_MPS
  /**
  * Deletes an instance
  * @param selector indicates the instance
  * @returns string
  */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
  /**
   * Creates an instance of RemoteAccessPolicyAppliesToMPS
   * @param remoteAccessPolicyAppliesToMPS RemoteAccessPolicyAppliesToMPS Object
   * @returns string
   */
  Create = (remoteAccessPolicyAppliesToMPS: Models.RemoteAccessPolicyAppliesToMPS): string => this.protectedCreate(remoteAccessPolicyAppliesToMPS)
  /**
   * Changes properties of RemoteAccessPolicyAppliesToMPS.
   * @param remoteAccessPolicyAppliesToMPS RemoteAccessPolicyAppliesToMPS Object.
   * @returns string
   */
  Put = (remoteAccessPolicyAppliesToMPS: Models.RemoteAccessPolicyAppliesToMPS): string => this.protectedPut(remoteAccessPolicyAppliesToMPS, false)
}
class RemoteAccessPolicyRule extends Base {
  className = Classes.REMOTE_ACCESS_POLICY_RULE
  /**
   * Deletes an instance
   * @param selector indicates the instance
   * @returns string
   */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
  /**
   * Changes properties of RemoteAccessPolicyRule
   * @param remoteAccessPolicyRule Remote Access Policy Rule object
   * @returns string
   */
  Put = (remoteAccessPolicyRule: Models.RemoteAccessPolicyRule): string => this.protectedPut(remoteAccessPolicyRule, false)
}
class RemoteAccessService extends Base {
  className = Classes.REMOTE_ACCESS_SERVICE
  /**
   * Requires mpServer.  Adds a Management Presence Server to the Intel(R) AMT subsystem. Creates an AMT_ManagementPresenceRemoteSAP instance and an AMT_RemoteAccessCredentialContext association to a credential. This credential may be an existing AMT_PublicKeyCertificate instance (if the created MPS is configured to use mutual authentication). If the created MpServer is configured to use username password authentication, an AMT_MPSUsernamePassword instance is created and used as the associated credential.
   * @param mpServer MPServer Object.
   * @returns string
   */
  AddMPS = (mpServer: Models.MPServer): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_MPS, Classes.REMOTE_ACCESS_SERVICE)
    const body = `<Body><h:AddMpServer_INPUT xmlns:h="${this.wsmanMessageCreator.resourceUriBase}AMT_RemoteAccessService"><h:AccessInfo>${mpServer.AccessInfo}</h:AccessInfo><h:InfoFormat>${mpServer.InfoFormat}</h:InfoFormat><h:Port>${mpServer.Port}</h:Port><h:AuthMethod>${mpServer.AuthMethod}</h:AuthMethod><h:Username>${mpServer.Username}</h:Username><h:Password>${mpServer.Password}</h:Password><h:CN>${mpServer.CommonName}</h:CN></h:AddMpServer_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Requires remoteAccessPolicyRule and selector.  Adds a Remote Access policy to the Intel(R) AMT subsystem. The policy defines an event that will trigger an establishment of a tunnel between AMT and a pre-configured MPS. Creates an AMT_RemoteAccessPolicyRule instance and associates it to a given list of AMT_ManagementPresenceRemoteSAP instances with AMT_PolicySetAppliesToElement association instances.
   * @param remoteAccessPolicyRule RemoteAccessPolicyRule Object.
   * @param selector Selector Object.
   * @returns string
   */
  AddRemoteAccessPolicyRule = (remoteAccessPolicyRule: Models.RemoteAccessPolicyRule, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_REMOTE_ACCESS_POLICY_RULE, Classes.REMOTE_ACCESS_SERVICE)
    const body = `<Body><h:AddRemoteAccessPolicyRule_INPUT xmlns:h="${this.wsmanMessageCreator.resourceUriBase}AMT_RemoteAccessService"><h:Trigger>${remoteAccessPolicyRule.Trigger}</h:Trigger><h:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</h:TunnelLifeTime><h:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</h:ExtendedData><h:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">${this.wsmanMessageCreator.resourceUriBase}AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></h:MpServer></h:AddRemoteAccessPolicyRule_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class SetupAndConfigurationService extends Base {
  className = Classes.SETUP_AND_CONFIGURATION_SERVICE
  /**
   * Commits pending configuration commands made to the Intel(R) AMT device. Completes configuration when in "IN-provisioning" state.
   * @returns string
   */
  CommitChanges = (): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.COMMIT_CHANGES, Classes.SETUP_AND_CONFIGURATION_SERVICE)
    const body = this.wsmanMessageCreator.createBody('CommitChanges_INPUT', Classes.SETUP_AND_CONFIGURATION_SERVICE, [{}])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Pulls instances of SetupAndConfigurationService, following an Enumerate operation.
   * @param enumerationContext string returned from an Enumerate call.
   * @returns string
   */
  GetUuid = (): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.GET_UUID, Classes.SETUP_AND_CONFIGURATION_SERVICE)
    const body = this.wsmanMessageCreator.createBody('GetUuid_INPUT', Classes.SETUP_AND_CONFIGURATION_SERVICE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Requires password. This method sets the ME Bios extension password. It allows a remote caller to change the ME access password for the BIOS extension screen. This call succeeds depending on the password policy rule defined in MEBx (BIOS extension):"Default Password Only" - Method succeeds only when the current password is still the default value and only in PKI provisioning. "During Setup and Configuration" - Method succeeds only during provisioning, regardless of provisioning method or previous password value."ANYTIME" - Method will always succeed. (i.e. even when configured).
   * @param password Password needs to be strong: Contain at least one of: upper-case, lower-case, digit and special character.
   * @remarks Min Length = 8
   * @remarks Max Length = 32
   * @returns string
   */
  SetMEBXPassword = (password: string): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.SET_MEBX_PASSWORD, Classes.SETUP_AND_CONFIGURATION_SERVICE)
    const body = `<Body><h:SetMEBxPassword_INPUT xmlns:h="${this.wsmanMessageCreator.resourceUriBase}${Classes.SETUP_AND_CONFIGURATION_SERVICE}"><h:Password>${password}</h:Password></h:SetMEBxPassword_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Resets the Intel(R) AMT device to default factory settings. The device will need to be re-provisioned after this command.
   * @param provisioningMode Indicates the provisioning mode (Enterprise , Small Business or Remote Connectivity) the device will enter following successful completion of the command. Starting from Release 6.0 only effective value is ProvisioningModeEnterprise
   * @value_map 0 = ProvisioningModeCurrent, 1 = ProvisioningModeEnterprise, 2 = ProvisioningModeSmallBusiness, 3 = ProvisioningRemoteConnectivity
   * @returns string
   */
  Unprovision = (provisioningMode?: Types.SetupAndConfigurationService.ProvisioningMode_Input): string => {
    if (provisioningMode === undefined) { provisioningMode = 1 }
    const header = this.wsmanMessageCreator.createHeader(Actions.UNPROVISION, Classes.SETUP_AND_CONFIGURATION_SERVICE)
    const body = `<Body><h:Unprovision_INPUT xmlns:h="${this.wsmanMessageCreator.resourceUriBase}${Classes.SETUP_AND_CONFIGURATION_SERVICE}"><h:ProvisioningMode>${provisioningMode}</h:ProvisioningMode></h:Unprovision_INPUT></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Changes properties of Setup and Configuration Service
   * @param setupAndConfigurationService SetupAndConfigurationService object
   * @returns string
   */
  Put = (setupAndConfigurationService: Models.SetupAndConfigurationService): string => this.protectedPut(setupAndConfigurationService, false)
}
class TimeSynchronizationService extends Base {
  className = Classes.TIME_SYNCHRONIZATION_SERVICE
  /**
   * Requires ta0, tm1, tm2.  This method is used to synchronize the Intel(R) AMT device's internal clock with an external clock.
   * @param ta0 The time value received from invoking GetLowAccuracyTimeSynch().
   * @param tm1 The remote client timestamp after getting a response from GetLowAccuracyTimeSynch().
   * @param tm2 The remote client timestamp obtained immediately prior to invoking this method.
   * @returns string
   */
  SetHighAccuracyTimeSynch = (ta0: number, tm1: number, tm2: number): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_HIGH_ACCURACY_TIME_SYNCH, Classes.TIME_SYNCHRONIZATION_SERVICE)
    const body: string = this.wsmanMessageCreator.createBody('SetHighAccuracyTimeSynch_INPUT', Classes.TIME_SYNCHRONIZATION_SERVICE, [{
      Ta0: ta0,
      Tm1: tm1,
      Tm2: tm2
    }])
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * This method is used for reading the Intel(R) AMT device's internal clock.
   * @returns string
   */
  GetLowAccuracyTimeSynch = (): string => {
    const header: string = this.wsmanMessageCreator.createHeader(Actions.GET_LOW_ACCURACY_TIME_SYNCH, Classes.TIME_SYNCHRONIZATION_SERVICE)
    const body: string = this.wsmanMessageCreator.createBody('GetLowAccuracyTimeSynch_INPUT', Classes.TIME_SYNCHRONIZATION_SERVICE)
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class TLSCredentialContext extends Base {
  className = Classes.TLS_CREDENTIAL_CONTEXT
  /**
   * Deletes an instance
   * @param selector indicates the instance
   * @returns string
   */
  Delete = (selector: Selector): string => this.protectedDelete(selector)
  /**
   * Requires tlsCredentialContext.  Creates a new instance of TLSCredentialContext.
   * @param tlsCredentialContext TLSCredentialContext Object.
   * @returns string
   */
  // TLS Credential Context object is highly complex and needs to use createBody function
  Create = (certHandle: string): string => {
    const header = this.wsmanMessageCreator.createHeader(BaseActions.CREATE, Classes.TLS_CREDENTIAL_CONTEXT)
    // const body = this.wsmanMessageCreator.createBody('AMT_TLSCredentialContext', Classes.TLS_CREDENTIAL_CONTEXT, tlsCredentialContext)
    const body = `<Body><h:AMT_TLSCredentialContext xmlns:h="${this.wsmanMessageCreator.resourceUriBase}AMT_TLSCredentialContext"><h:ElementInContext><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>${this.wsmanMessageCreator.resourceUriBase}AMT_PublicKeyCertificate</w:ResourceURI><w:SelectorSet><w:Selector Name="InstanceID">${certHandle}</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementInContext><h:ElementProvidingContext><a:Address>/wsman</a:Address><a:ReferenceParameters><w:ResourceURI>${this.wsmanMessageCreator.resourceUriBase}AMT_TLSProtocolEndpointCollection</w:ResourceURI><w:SelectorSet><w:Selector Name="ElementName">TLSProtocolEndpointInstances Collection</w:Selector></w:SelectorSet></a:ReferenceParameters></h:ElementProvidingContext></h:AMT_TLSCredentialContext></Body>`
    return this.wsmanMessageCreator.createXml(header, body)
  }
}
class TLSSettingData extends Base {
  className = Classes.TLS_SETTING_DATA
  /**
   * Changes properties of TLSSettingData.
   * @param tlsSettingData TLSSettingData Object.
   * @returns string
   */
  Put = (tlsSettingData: Models.TLSSettingData): string => this.protectedPut(tlsSettingData, true)
}
class UserInitiatedConnectionService extends Base {
  className = Classes.USER_INITIATED_CONNECTION_SERVICE
  /**
   * Requires requestedState.  Requests that the state of the element be changed to the value specified in the RequestedState parameter. When the requested state change takes place, the EnabledState and RequestedState of the element will be the same. Invoking the RequestStateChange method multiple times could result in earlier requests being overwritten or lost.  If 0 is returned, then the task completed successfully and the use of ConcreteJob was not required. If 4096 (0x1000) is returned, then the task will take some time to complete, ConcreteJob will be created, and its reference returned in the output parameter Job. Any other return code indicates an error condition.
   * @param requestedState The state requested for the element. This information will be placed into the RequestedState property of the instance if the return code of the RequestStateChange method is 0 ('Completed with No Error'), 3 ('Timeout'), or 4096 (0x1000) ('Job Started'). Refer to the description of the EnabledState and RequestedState properties for the detailed explanations of the RequestedState values.
   * @value_map 32768 = All Interfaces disabled, 32769 = BIOS Interface enabled, 32770 = OS Interface enabled, 32771 = BIOS and OS Interfaces enabled
   * @returns string
   */
  RequestStateChange = (requestedState: Types.UserInitiatedConnectionService.RequestedState): string => this.protectedRequestStateChange(`http://intel.com/wbem/wscim/1/amt-schema/1/${this.className}/RequestStateChange`, requestedState)
}
class WiFiPortConfigurationService extends Base {
  className = Classes.WIFI_PORT_CONFIGURATION_SERVICE
  /**
   * Atomically creates an instance of CIM_WifiEndpointSettings from the embedded instance parameter and optionally an instance of CIM_IEEE8021xSettings from the embedded instance parameter (if provided), associates the CIM_WiFiEndpointSettings instance with the referenced instance of CIM_WiFiEndpoint using an instance of CIM_ElementSettingData optionally associates the newly created or referenced by parameter instance of CIM_IEEE8021xSettings with the instance of CIM_WiFiEndpointSettings using an instance of CIM_ConcreteComponent and optionally associates the referenced instance of AMT_PublicKeyCertificate (if provided) with the instance of CIM_IEEE8021xSettings (if provided) using an instance of CIM_CredentialContext.
   * @param wifiEndpointSettings WiFiEndpointSettings Object
   * @param selector Selector Object.
   * @returns string
   */
  AddWiFiSettings = (wifiEndpointSettings: CIM.Models.WiFiEndpointSettings, selector: Selector, ieee8021xSettingsInput?: CIM.Models.IEEE8021xSettings, clientCredential?: string, caCredential?: string): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ADD_WIFI_SETTINGS, Classes.WIFI_PORT_CONFIGURATION_SERVICE)
    const dataArray: object[] = []
    const wifiEndpointObject = {
      WiFiEndpoint: {
        Address: '/wsman',
        ReferenceParameters: {
          ResourceURI: `http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/${CIM.Classes.WIFI_ENDPOINT}`,
          SelectorSet: this.wsmanMessageCreator.createSelectorObjectForBody(selector)
        }
      }
    }
    dataArray.push(wifiEndpointObject)
    if (wifiEndpointSettings) {
      // HANDLE SPECIAL CHARACTERS FOR XML
      wifiEndpointSettings.PSKPassPhrase = wifiEndpointSettings.PSKPassPhrase?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
      const wifiEndpointSettingInputObject = {
        WiFiEndpointSettingsInput: wifiEndpointSettings,
        namespace: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_WiFiEndpointSettings'
      }
      dataArray.push(wifiEndpointSettingInputObject)
    }
    if (ieee8021xSettingsInput) {
      const ieee8021xSettingsInputObject = {
        IEEE8021xSettingsInput: ieee8021xSettingsInput,
        namespace: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_IEEE8021xSettings'
      }
      dataArray.push(ieee8021xSettingsInputObject)
    }
    if (clientCredential) {
      const clientCredentialObject = {
        ClientCredential: {
          Address: 'default',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate',
            SelectorSet: this.wsmanMessageCreator.createSelectorObjectForBody({ name: 'InstanceID', value: clientCredential })
          }
        }
      }
      dataArray.push(clientCredentialObject)
    }
    if (caCredential) {
      const caCredentialObject = {
        CACredential: {
          Address: 'default',
          ReferenceParameters: {
            ResourceURI: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyCertificate',
            SelectorSet: this.wsmanMessageCreator.createSelectorObjectForBody({ name: 'InstanceID', value: caCredential })
          }
        }
      }
      dataArray.push(caCredentialObject)
    }
    const body = this.wsmanMessageCreator.createBody(Methods.ADD_WIFI_SETTINGS + '_INPUT', Classes.WIFI_PORT_CONFIGURATION_SERVICE, dataArray)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  /**
   * Changes properties of WiFiEndpointSettings
   * @param wifiEndpointSettings WiFiEndpointSettings Object
   * @param selector Selector Object.
   * @returns string
   */
  Put = (wifiEndpointSettings: Models.WiFiPortConfigurationService, selector?: Selector): string => this.protectedPut(wifiEndpointSettings, true, selector)
}
export class Messages {
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/amt-schema/1/'
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator(this.resourceUriBase)
  public AlarmClockService = new AlarmClockService(this.wsmanMessageCreator)
  public AuditLog = new AuditLog(this.wsmanMessageCreator)
  public AuthorizationService = new AuthorizationService(this.wsmanMessageCreator)
  public BootCapabilities = new BootCapabilities(this.wsmanMessageCreator)
  public BootSettingData = new BootSettingData(this.wsmanMessageCreator)
  public EnvironmentDetectionSettingData = new EnvironmentDetectionSettingData(this.wsmanMessageCreator)
  public EthernetPortSettings = new EthernetPortSettings(this.wsmanMessageCreator)
  public GeneralSettings = new GeneralSettings(this.wsmanMessageCreator)
  public IEEE8021xCredentialContext = new IEEE8021xCredentialContext(this.wsmanMessageCreator)
  public IEEE8021xProfile = new IEEE8021xProfile(this.wsmanMessageCreator)
  public KerberosSettingData = new KerberosSettingData(this.wsmanMessageCreator)
  public ManagementPresenceRemoteSAP = new ManagementPresenceRemoteSAP(this.wsmanMessageCreator)
  public MessageLog = new MessageLog(this.wsmanMessageCreator)
  public MPSUsernamePassword = new MPSUsernamePassword(this.wsmanMessageCreator)
  public PublicKeyCertificate = new PublicKeyCertificate(this.wsmanMessageCreator)
  public PublicKeyManagementService = new PublicKeyManagementService(this.wsmanMessageCreator)
  public PublicPrivateKeyPair = new PublicPrivateKeyPair(this.wsmanMessageCreator)
  public RedirectionService = new RedirectionService(this.wsmanMessageCreator)
  public RemoteAccessPolicyAppliesToMPS = new RemoteAccessPolicyAppliesToMPS(this.wsmanMessageCreator)
  public RemoteAccessPolicyRule = new RemoteAccessPolicyRule(this.wsmanMessageCreator)
  public RemoteAccessService = new RemoteAccessService(this.wsmanMessageCreator)
  public SetupAndConfigurationService = new SetupAndConfigurationService(this.wsmanMessageCreator)
  public TimeSynchronizationService = new TimeSynchronizationService(this.wsmanMessageCreator)
  public TLSCredentialContext = new TLSCredentialContext(this.wsmanMessageCreator)
  public TLSSettingData = new TLSSettingData(this.wsmanMessageCreator)
  public UserInitiatedConnectionService = new UserInitiatedConnectionService(this.wsmanMessageCreator)
  public WiFiPortConfigurationService = new WiFiPortConfigurationService(this.wsmanMessageCreator)
}
