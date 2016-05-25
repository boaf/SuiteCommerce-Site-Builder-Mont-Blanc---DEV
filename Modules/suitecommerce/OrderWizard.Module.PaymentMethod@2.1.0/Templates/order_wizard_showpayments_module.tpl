{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<section class="order-wizard-showpayments-module-details">
	<div class="order-wizard-showpayments-module-details-body">
		<div class="order-wizard-showpayments-module-billing-address">
			<h3 class="order-wizard-showpayments-module-section-header">
				{{translate 'Billing Address'}}
			</h3>
			{{#if showBillingAddress}}
				<div data-view="Billing.Address"></div>		
			{{else}}
				<a class="order-wizard-showpayments-module-billing-address-edit" data-action="edit-module" href="{{editBillingUrl}}?force=true">
					{{translate 'Please select a valid billing address'}}
				</a>
			{{/if}}
			{{#if showEditBillingButton}}
				<a class="order-wizard-showpayments-module-billing-address-edit" data-action="edit-module" href="{{editBillingUrl}}?force=true">
					{{translate 'Back to edit billing information'}}
				</a>
			{{/if}}
		</div>
		<div class="order-wizard-showpayments-module-payment-method">
			{{#if showPayments}}
				<h3 class="order-wizard-showpayments-module-section-header">
					{{translate 'Payment Type'}}
				</h3>
				<div class="order-wizard-showpayments-module-payment-methods-summary">
					<div data-view="PaymentMethods.Collection"></div>
					{{#if showGiftcertificates}}
						<br>
						<b>{{translate 'Gift Certificates'}}</b><br>
						<div data-view="GiftCertificates.Collection"></div>
					{{/if}}
					{{#if showGuestEmail}}
						<div>
							<h5>{{guestEmail}}</h5>
						</div>
					{{/if}}
				</div>
			{{/if}}
		</div>
	</div>
</section>