# WSMAN-MESSAGES
[![Known Vulnerabilities](https://snyk.io/test/github/open-amt-cloud-toolkit/wsman-messages/badge.svg?targetFile=package.json)](https://snyk.io/test/github/open-amt-cloud-toolkit/wsman-messages?targetFile=package.json) ![Node.js CI](https://github.com/open-amt-cloud-toolkit/wsman-messages/workflows/Node.js%20CI/badge.svg) ![codecov.io](https://codecov.io/github/open-amt-cloud-toolkit/wsman-messages/coverage.svg?branch=main)

Creates properly formated wsman messages to send to Intel&reg; Active Management Technology (AMT) capable platforms.  These libraries provide an easy to use API that when called return an XML string that is ready to be sent to an Intel&reg; AMT device.  Supports calls into AMT, IPS, and CIM classes supported by Intel&reg; AMT devices.  Full AMT SDK documentation can be found [here](https://software.intel.com/sites/manageability/AMT_Implementation_and_Reference_Guide/default.htm). 

<br>

## Installation
via NPM

``` bash
npm i @open-amt-cloud-toolkit/wsman-messages
```

## Usage
``` typescript
import { AMT } from '@open-amt-cloud-toolkit/wsman-messages'

const amtClass = new AMT.Message()
const message = this.amtClass.GeneralSettings(AMT.Methods.GET)
console.log(message)
```