{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-paymentmethod-invoice-module">
	<div class="order-wizard-paymentmethod-invoice-module-row">
		<div class="order-wizard-paymentmethod-invoice-module-terms">
			<p class="order-wizard-paymentmethod-invoice-module-terms-label">
				{{translate 'Terms'}}
			</p>
			<p class="order-wizard-paymentmethod-invoice-module-terms-value">
				{{termsName}}
			</p>
		</div>
		<div class="order-wizard-paymentmethod-invoice-module-balance">
			<p class="order-wizard-paymentmethod-invoice-module-balance-label">
				{{translate 'Available Balance'}}
			</p>
			<p class="order-wizard-paymentmethod-invoice-module-balance-value">
				{{balanceAvailable}}
			</p>
		</div>
	</div>
	<div class="order-wizard-paymentmethod-invoice-module-row">
		<label for="purchase-order-number" class="order-wizard-paymentmethod-invoice-module-purchase-order-label">
			{{translate 'Purchase Order Number'}} <span class="order-wizard-paymentmethod-invoice-module-purchase-order-optional"> {{ translate '(Optional)' }} </span>
		</label>
		<input
			type="text"
			name="purchase-order-number"
			id="purchase-order-number"
			class="order-wizard-paymentmethod-invoice-module-purchase-order-value"
			value="{{purchaseNumber}}"
		>
	</div>
	{{#if showTerms}}
		<p class="order-wizard-paymentmethod-invoice-module-conditions">
			{{translate 'I agree to pay with my current Invoice <a data-toggle="show-terms" href="#">Terms & Conditions</a>'}}
		</p>
	{{/if}}
</div>