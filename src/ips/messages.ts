/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors, WSManMessageCreator, Selector } from '../WSMan'
import { Actions } from './actions'
import { Methods } from './methods'
import { Classes } from './classes'
import { IEEE8021xSettings, OptInServiceResponse } from './models'
import { PublicKeyCertificate as AMT_PublicKeyCertificate } from './../amt/models'

type AllActions = Actions

export class Messages {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'

  private readonly enumerate = (action: Actions, ipsClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.ENUMERATE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly pull = (action: Actions, ipsClass: Classes, enumerationContext: string): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.PULL, enumerationContext)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly get = (action: AllActions, ipsClass: Classes): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`)
    const body: string = this.wsmanMessageCreator.createCommonBody(Methods.GET)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly put = (action: AllActions, ipsClass: Classes, data: any): string => {
    const header: string = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`)
    let body = 'NULL'
    if (data) {
      const key = Object.keys(data)[0]
      body = this.wsmanMessageCreator.createBody(ipsClass, this.resourceUriBase, ipsClass, data)
    }
    return this.wsmanMessageCreator.createXml(header, body)
  }

  private readonly delete = (action: Actions, ipsClass: Classes, selector: Selector): string => {
    const header = this.wsmanMessageCreator.createHeader(action, `${this.resourceUriBase}${ipsClass}`, null, null, selector)
    const body = this.wsmanMessageCreator.createCommonBody(Methods.DELETE)
    return this.wsmanMessageCreator.createXml(header, body)
  }

  OptInService = (method: Methods.GET | Methods.PUT | Methods.START_OPT_IN | Methods.CANCEL_OPT_IN | Methods.SEND_OPT_IN_CODE, optInCode?: Number, optInServiceResponse?: OptInServiceResponse): string => {
    let header: string, body: string
    switch (method) {
      case Methods.GET:
        return this.get(Actions.GET, Classes.IPS_OPT_IN_SERVICE)
      case Methods.PUT:
        if (optInServiceResponse) {
          const key = Object.keys(optInServiceResponse)[0]
          return this.put(Actions.PUT, Classes.IPS_OPT_IN_SERVICE, optInServiceResponse[key])
        } else {
          throw new Error(WSManErrors.OPT_IN_SERVICE_RESPONSE)
        }
      case Methods.START_OPT_IN: {
        header = this.wsmanMessageCreator.createHeader(Actions.START_OPT_IN, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`)
        body = this.wsmanMessageCreator.createBody('StartOptIn_INPUT', this.resourceUriBase, Classes.IPS_OPT_IN_SERVICE)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.SEND_OPT_IN_CODE: {
        header = this.wsmanMessageCreator.createHeader(Actions.SEND_OPT_IN_CODE, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`)
        if (optInCode) {
          body = this.wsmanMessageCreator.createBody('SendOptInCode_INPUT', this.resourceUriBase, Classes.IPS_OPT_IN_SERVICE, { OptInCode: optInCode })
          return this.wsmanMessageCreator.createXml(header, body)
        } else {
          throw new Error(WSManErrors.OPT_IN_CODE)
        }
      }
      case Methods.CANCEL_OPT_IN: {
        header = this.wsmanMessageCreator.createHeader(Actions.CANCEL_OPT_IN, `${this.resourceUriBase}${Classes.IPS_OPT_IN_SERVICE}`)
        body = this.wsmanMessageCreator.createBody('CancelOptIn_INPUT', this.resourceUriBase, Classes.IPS_OPT_IN_SERVICE)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  // Consider breaking add_next_cert_in_chain out into its own method
  HostBasedSetupService = (method: Methods.GET | Methods.SETUP | Methods.ADMIN_SETUP | Methods.ADD_NEXT_CERT_IN_CHAIN, adminPassEncryptionType?: Number, adminPassword?: string, mcNonce?: string, signingAlgorithm?: number, digitalSignature?: string, cert?: string, isLeaf?: boolean, isRoot?: boolean): string => {
    switch (method) {
      case Methods.GET: {
        return this.get(Actions.GET, Classes.IPS_HOST_BASED_SETUP_SERVICE)
      }
      case Methods.SETUP: {
        if (adminPassEncryptionType == null) { throw new Error(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE) }
        if (adminPassword == null) { throw new Error(WSManErrors.ADMIN_PASSWORD) }
        const header: string = this.wsmanMessageCreator.createHeader(Actions.SETUP, `${this.resourceUriBase}${Classes.IPS_HOST_BASED_SETUP_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('Setup_INPUT', this.resourceUriBase, Classes.IPS_HOST_BASED_SETUP_SERVICE, {
          NetAdminPassEncryptionType: adminPassEncryptionType.toString(),
          NetworkAdminPassword: adminPassword
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADMIN_SETUP: {
        if (adminPassEncryptionType == null) { throw new Error(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE) }
        if (adminPassword == null) { throw new Error(WSManErrors.ADMIN_PASSWORD) }
        const header: string = this.wsmanMessageCreator.createHeader(Actions.ADMIN_SETUP, `${this.resourceUriBase}${Classes.IPS_HOST_BASED_SETUP_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('AdminSetup_INPUT', this.resourceUriBase, Classes.IPS_HOST_BASED_SETUP_SERVICE, {
          NetAdminPassEncryptionType: adminPassEncryptionType,
          NetworkAdminPassword: adminPassword,
          McNonce: mcNonce,
          SigningAlgorithm: signingAlgorithm,
          DigitalSignature: digitalSignature
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case Methods.ADD_NEXT_CERT_IN_CHAIN: {
        const header: string = this.wsmanMessageCreator.createHeader(Actions.ADD_NEXT_CERT_IN_CHAIN, `${this.resourceUriBase}${Classes.IPS_HOST_BASED_SETUP_SERVICE}`)
        const body: string = this.wsmanMessageCreator.createBody('AddNextCertInChain_INPUT', this.resourceUriBase, Classes.IPS_HOST_BASED_SETUP_SERVICE, {
          NextCertificate: cert,
          IsLeafCertificate: isLeaf,
          IsRootCertificate: isRoot
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  AlarmClockOccurrence = (method: Methods.PULL | Methods.ENUMERATE | Methods.DELETE, enumerationContext?: string, selector?: Selector): string => {
    switch (method) {
      case Methods.PULL: {
        if (enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, Classes.IPS_ALARM_CLOCK_OCCURRENCE, enumerationContext)
      }
      case Methods.ENUMERATE: {
        return this.enumerate(Actions.ENUMERATE, Classes.IPS_ALARM_CLOCK_OCCURRENCE)
      }
      case Methods.DELETE: {
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        return this.delete(Actions.DELETE, Classes.IPS_ALARM_CLOCK_OCCURRENCE, selector)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  IEEE8021xSettings = (method: Methods.PULL | Methods.ENUMERATE | Methods.PUT | Methods.SET_CERTIFICATES, enumerationContext?: string, ieee8021xSettings?: IEEE8021xSettings, serverCertificateIssuer?: AMT_PublicKeyCertificate, clientCertificate?: AMT_PublicKeyCertificate): string => {
    switch (method) {
      case Methods.PULL: {
        if (enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(Actions.PULL, Classes.IPS_IEEE8021X_SETTINGS, enumerationContext)
      }
      case Methods.ENUMERATE: {
        return this.enumerate(Actions.ENUMERATE, Classes.IPS_IEEE8021X_SETTINGS)
      }
      case Methods.PUT: {
        if (ieee8021xSettings == null) { throw new Error(WSManErrors.IEEE8021X_SETTINGS) }
        return this.put(Actions.PUT, Classes.IPS_IEEE8021X_SETTINGS, ieee8021xSettings)
      }
      case Methods.SET_CERTIFICATES: {
        if (serverCertificateIssuer == null || clientCertificate == null) { throw new Error(WSManErrors.CERTIFICATE_BLOB) }
        const header: string = this.wsmanMessageCreator.createHeader(Actions.SET_CERTIFICATES, this.resourceUriBase, Classes.IPS_IEEE8021X_SETTINGS)
        const body: string = this.wsmanMessageCreator.createBody(Methods.SET_CERTIFICATES, this.resourceUriBase, Classes.IPS_IEEE8021X_SETTINGS, {
          ServerCertificateIssuer: serverCertificateIssuer,
          ClientCertificate: clientCertificate
        })
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
