# WSMAN-MESSAGES

![CodeQL](https://img.shields.io/github/actions/workflow/status/open-amt-cloud-toolkit/wsman-messages/codeql-analysis.yml?style=for-the-badge&label=CodeQL)
![Build](https://img.shields.io/github/actions/workflow/status/open-amt-cloud-toolkit/wsman-messages/node.js.yml?style=for-the-badge)
![Codecov](https://img.shields.io/codecov/c/github/open-amt-cloud-toolkit/wsman-messages?style=for-the-badge)
![OSSF-Scorecard Score](https://img.shields.io/ossf-scorecard/github.com/open-amt-cloud-toolkit/wsman-messages?style=for-the-badge&label=OSSF%20Score)
![Discord](https://img.shields.io/discord/1063200098680582154?style=for-the-badge&label=Discord)

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
const message = this.amtClass.GeneralSettings.Get()
console.log(message)
```
