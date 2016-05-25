<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope
    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:ns1="urn:messages_2014_2.platform.webservices.netsuite.com"
    xmlns:ns2="urn:core_2014_2.platform.webservices.netsuite.com"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:ns="ns">
    <SOAP-ENV:Header>
        {{> _passport }}
    </SOAP-ENV:Header>
    <SOAP-ENV:Body>
        <ns1:getCustomizationId>
            <ns1:customizationType getCustomizationType="{{getCustomizationType}}"/>
            <ns1:includeInactives>{{#if includeInactives}}{{includeInactives}}{{else}}false{{/if}}</ns1:includeInactives>
        </ns1:getCustomizationId>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>