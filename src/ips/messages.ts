/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManMessageCreator } from '../WSMan'
import { Actions, Methods, Classes } from './'
import type { Models, Types } from './'
import type { AMT } from '..'
import type { Selector } from '../WSMan'

export class Messages {
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator(this.resourceUriBase)

  private readonly get = (ipsClass: Classes): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.GET, ipsClass)
    const body = this.wsmanMessageCreator.createCommonBody.Get()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly enumerate = (ipsClass: Classes): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.ENUMERATE, ipsClass)
    const body = this.wsmanMessageCreator.createCommonBody.Enumerate()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (ipsClass: Classes, enumerationContext: string): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.PULL, ipsClass)
    const body = this.wsmanMessageCreator.createCommonBody.Pull(enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly put = (ipsClass: Classes, data: any, selector?: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.PUT, ipsClass, selector)
    const body = this.wsmanMessageCreator.createCommonBody.CreateOrPut(ipsClass, data)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (ipsClass: Classes, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(Actions.DELETE, ipsClass, selector)
    const body = this.wsmanMessageCreator.createCommonBody.Delete()
    return this.wsmanMessageCreator.createXml(header, body)
  }

  public readonly IEEE8021xCredentialContext = {
    /**
     * Enumerates the instances of IEEE8021xCredentialContext
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.IEEE8021X_CREDENTIAL_CONTEXT),
    /**
     * Gets the representation of IEEE8021xCredentialContext
     * @returns string
     */
    Get: (): string => this.get(Classes.IEEE8021X_CREDENTIAL_CONTEXT),
    /**
     * Pulls instances of IEEE8021xCredentialContext, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.IEEE8021X_CREDENTIAL_CONTEXT, enumerationContext)
  }

  public readonly AlarmClockOccurrence = {
    /**
     * Deletes an instance of AlarmClockOccurrence
     * @param selector Selector Object.
     * @returns string
     */
    Delete: (selector: Selector): string => this.delete(Classes.ALARM_CLOCK_OCCURRENCE, selector),
    /**
     * Enumerates the instances of AlarmClockOccurrence
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.ALARM_CLOCK_OCCURRENCE),
    /**
     * Gets the representation of AlarmClockOccurrence
     * @returns string
     */
    Get: (): string => this.get(Classes.ALARM_CLOCK_OCCURRENCE),
    /**
     * Pulls instances of AlarmClockOccurrence, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.ALARM_CLOCK_OCCURRENCE, enumerationContext)
  }

  public readonly HostBasedSetupService = {
    /**
     * Add a certificate to the provisioning certificate chain, to be used by AdminSetup or UpgradeClientToAdmin methods.
     * @param cert The next certificate to add to the chain
     * @param isLeaf true, when the current certificate is leaf certificate
     * @param isRoot true, when the current certificate is root. Marks end of the certificate chain
     * @returns string
     */
    AddNextCertInChain: (cert: string, isLeaf: boolean, isRoot: boolean): string => {
      const header: string = this.wsmanMessageCreator.createHeader(Actions.ADD_NEXT_CERT_IN_CHAIN, Classes.HOST_BASED_SETUP_SERVICE)
      const body: string = this.wsmanMessageCreator.createBody('AddNextCertInChain_INPUT', Classes.HOST_BASED_SETUP_SERVICE, {
        NextCertificate: cert,
        IsLeafCertificate: isLeaf,
        IsRootCertificate: isRoot
      })
      return this.wsmanMessageCreator.createXml(header, body)
    },
    /**
     * Setup Intel(R) AMT from the local host, resulting in Admin Setup Mode. Requires OS administrator rights, and moves Intel(R) AMT from "Pre Provisioned" state to "Post Provisioned" state. The control mode after this method is run will be "Admin".
     * @param adminPassEncryptionType The encryption type of the network admin password. Only HTTP-MD5 is supported. The values are the same as the CIM_Account.UserPasswordEncryptionAlgorithm field
     * @param adminPassword New network admin password to be set by this command, encrypted using the encryption type algorithm
     * @param mcNonce A random nonce value generated by the configuration agent.Required if the digital signature is provided.needs to be concatenated after the configuration nonce and signed together with the attached certificate's private key
     * @param signingAlgorithm The signing algorithm used to sign the setup operation.
     * @param digitalSignature A digital signature of the ConfigurationNonce and the McNonce concatenated. If this information is provided, AMT will validate the signature before accepting the command.
     * @returns string
     */
    AdminSetup: (adminPassEncryptionType: Types.HostBasedSetupService.AdminPassEncryptionType, adminPassword: string, mcNonce: string, signingAlgorithm: Types.HostBasedSetupService.SigningAlgorithm, digitalSignature: string): string => {
      const header: string = this.wsmanMessageCreator.createHeader(Actions.ADMIN_SETUP, Classes.HOST_BASED_SETUP_SERVICE)
      const body: string = this.wsmanMessageCreator.createBody('AdminSetup_INPUT', Classes.HOST_BASED_SETUP_SERVICE, {
        NetAdminPassEncryptionType: adminPassEncryptionType,
        NetworkAdminPassword: adminPassword,
        McNonce: mcNonce,
        SigningAlgorithm: signingAlgorithm,
        DigitalSignature: digitalSignature
      })
      return this.wsmanMessageCreator.createXml(header, body)
    },
    /**
     * Enumerates the instances of HostBasedSetupService
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.HOST_BASED_SETUP_SERVICE),
    /**
     * Gets the representation of HostBasedSetupService
     * @returns string
     */
    Get: (): string => this.get(Classes.HOST_BASED_SETUP_SERVICE),
    /**
     * Pulls instances of HostBasedSetupService, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.HOST_BASED_SETUP_SERVICE, enumerationContext),
    /**
     * Setup Intel(R) AMT from local host. This function requires OS administrator rights, and moves Intel(R) AMT from "Pre Provisioned" state to "Post Provisioned" state. The control mode after this method is run will be "Client". This method also allows the configuring agent to sign the setup operation with a certificate. The certificate hash will be kept in the corresponding provisioning record
     * @param adminPassEncryptionType The encryption type of the network admin password. Only HTTP-MD5 is supported. The values are the same as the CIM_Account.UserPasswordEncryptionAlgorithm field
     * @param adminPassword New network admin password to be set by this command, encrypted using the encryption type algorithm
     * @returns string
     */
    Setup: (adminPassEncryptionType: Types.HostBasedSetupService.AdminPassEncryptionType, adminPassword: string): string => {
      const header: string = this.wsmanMessageCreator.createHeader(Actions.SETUP, Classes.HOST_BASED_SETUP_SERVICE)
      const body: string = this.wsmanMessageCreator.createBody('Setup_INPUT', Classes.HOST_BASED_SETUP_SERVICE, {
        NetAdminPassEncryptionType: adminPassEncryptionType.toString(),
        NetworkAdminPassword: adminPassword
      })
      return this.wsmanMessageCreator.createXml(header, body)
    }
  }

  public readonly IEEE8021xSettings = {
    /**
     * Deletes an instance of IEEE8021xSettings
     * @param selector Selector Object.
     * @returns string
     */
    Delete: (selector: Selector): string => this.delete(Classes.IEEE8021X_SETTINGS, selector),
    /**
     * Enumerates the instances of IEEE8021xSettings
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.IEEE8021X_SETTINGS),
    /**
     * Gets the representation of IEEE8021xSettings
     * @returns string
     */
    Get: (): string => this.get(Classes.IEEE8021X_SETTINGS),
    /**
     * Pulls instances of IEEE8021xSettings, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.IEEE8021X_SETTINGS, enumerationContext),
    /**
     * Changes properties of IEEE8021xSettings.
     * @param ieee8021xSettings IEEE8021xSettings Object
     * @returns string
     */
    Put: (ieee8021xSettings: Models.IEEE8021xSettings): string => this.put(Classes.IEEE8021X_SETTINGS, ieee8021xSettings),
    /**
     * Sets certificates for IEEE8021xSettings in AMT
     * @param serverCertificateIssuer AMT_PublicKeyCertificate Object
     * @param clientCertificate AMT_PublicKeyCertificate Object
     * @returns string
     */
    SetCertificates: (serverCertificateIssuer: AMT.Models.PublicKeyCertificate, clientCertificate: AMT.Models.PublicKeyCertificate): string => {
      const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_CERTIFICATES, Classes.IEEE8021X_SETTINGS, undefined, Classes.IEEE8021X_SETTINGS)
      const body: string = this.wsmanMessageCreator.createBody(Methods.SET_CERTIFICATES, Classes.IEEE8021X_SETTINGS, {
        ServerCertificateIssuer: serverCertificateIssuer,
        ClientCertificate: clientCertificate
      })
      return this.wsmanMessageCreator.createXml(header, body)
    }
  }

  public readonly OptInService = {
    /**
     * Cancel a previous opt-in code request.
     * @returns string
     */
    CancelOptIn: (): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.CANCEL_OPT_IN, Classes.OPT_IN_SERVICE)
      const body = this.wsmanMessageCreator.createBody('CancelOptIn_INPUT', Classes.OPT_IN_SERVICE)
      return this.wsmanMessageCreator.createXml(header, body)
    },
    /**
     * Enumerates the instances of OptInService
     * @returns string
     */
    Enumerate: (): string => this.enumerate(Classes.OPT_IN_SERVICE),
    /**
     * Gets the representation of OptInService
     * @returns string
     */
    Get: (): string => this.get(Classes.OPT_IN_SERVICE),
    /**
     * Pulls instances of OptInService, following an Enumerate operation
     * @param enumerationContext string returned from an Enumerate call.
     * @returns string
     */
    Pull: (enumerationContext: string): string => this.pull(Classes.OPT_IN_SERVICE, enumerationContext),
    /**
     * Changes properties of OptInService.
     * @param optInServiceResponse OptInServiceResponse Object
     * @returns string
     */
    Put: (optInServiceResponse: Models.OptInServiceResponse): string => {
      const key = Object.keys(optInServiceResponse)[0]
      return this.put(Classes.OPT_IN_SERVICE, optInServiceResponse[key])
    },
    /**
     * Send the opt-in code to Intel(R) AMT.
     * @param optInCode The opt-in code generated by Intel(R) AMT. This code is displayed on the user screen and should be entered by the remote IT technician.
     * @returns string
     */
    SendOptInCode: (optInCode: number): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.SEND_OPT_IN_CODE, Classes.OPT_IN_SERVICE)
      const body = this.wsmanMessageCreator.createBody('SendOptInCode_INPUT', Classes.OPT_IN_SERVICE, { OptInCode: optInCode })
      return this.wsmanMessageCreator.createXml(header, body)
    },
    /**
     * Request an opt-in code
     * @returns string
     */
    StartOptIn: (): string => {
      const header = this.wsmanMessageCreator.createHeader(Actions.START_OPT_IN, Classes.OPT_IN_SERVICE)
      const body = this.wsmanMessageCreator.createBody('StartOptIn_INPUT', Classes.OPT_IN_SERVICE)
      return this.wsmanMessageCreator.createXml(header, body)
    }
  }
}
