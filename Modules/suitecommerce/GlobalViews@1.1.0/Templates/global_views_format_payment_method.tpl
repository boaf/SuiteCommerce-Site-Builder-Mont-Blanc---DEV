{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="global-views-format-payment-method">
	{{#if isCreditcard}}
		<div class="global-views-format-payment-method-header">
			{{#if showCreditCardImage}}
				<img class="global-views-format-payment-method-header-icon" src="{{creditCardImageUrl}}" alt="{{creditCardPaymentMethodName}}">
			{{else}}
				{{creditCardPaymentMethodName}}
			{{/if}}
			<p class="global-views-format-payment-method-number"> &ndash; <b>{{translate 'Ending in $(0)' creditCardNumberEnding}}</b></p>
		</div>
		<p class="global-views-format-payment-method-name">{{creditCard.ccname}}</p>
		<p class="global-views-format-payment-method-expdate">{{translate 'Expires $(0)' creditCard.ccexpiredate}}</p>
	{{/if}}

	{{#if isGiftCertificate}}
		<p class="global-views-format-payment-method-gift-certificate">{{translate 'Ending in $(0)' giftCertificateEnding}}</p>
	{{/if}}

	{{#if isInvoice}}
		<p class="global-views-format-payment-method-invoice">{{translate 'Invoice: Terms $(0)' model.paymentterms.name}}</p>
		{{#if showPurchaseNumber}}
			<p class="global-views-format-payment-method-purchase">{{translate 'Purchase Number: $(0)' model.purchasenumber }}</p>
		{{/if}}
	{{/if}}

	{{#if isPaypal}}
		<p class="global-views-format-payment-method-paypal">{{translate 'Payment via Paypal'}}</p>
	{{/if}}

	{{#if isOther}}
		{{name}}
	{{/if}}

	{{#if showStreet}}
			<p class="global-views-format-payment-method-street">{{translate 'Card Street: <span class="global-views-format-payment-method-street-value">$(0)</span>' model.ccstreet }}</p>
	{{/if}}
	{{#if showZipCode}}
		<p class="global-views-format-payment-method-zip">{{translate 'Card Zip Code: <span class="global-views-format-payment-method-zip-value">$(0)</span>' model.cczipcode }}</p>
	{{/if}}
</div>