<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:platformCore="urn:core_2014_2.platform.webservices.netsuite.com"
    xmlns:platformMsgs="urn:messages_2014_2.platform.webservices.netsuite.com">
    <soapenv:Header>
        {{> _passport }}
    </soapenv:Header>
    <soapenv:Body>
        <platformMsgs:searchMoreWithId>
            <platformCore:searchId>{{id}}</platformCore:searchId>
            <platformCore:pageIndex>{{page}}</platformCore:pageIndex>
        </platformMsgs:searchMoreWithId>
    </soapenv:Body>
</soapenv:Envelope>