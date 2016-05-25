{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-paymentmethod-giftcertificates-module">
	{{#if pageHeader}}
		<header class="order-wizard-paymentmethod-giftcertificates-module-step-header">
			<h2 class="order-wizard-paymentmethod-giftcertificates-module-section-header">
				{{pageHeader}}
			</h2>
		</header>
	{{/if}}

	<div class="order-wizard-paymentmethod-giftcertificates-module-expander-head">
		<a class="order-wizard-paymentmethod-giftcertificates-module-expander-head-toggle collapsed" data-toggle="collapse" data-target="#gift-certificate-form" aria-expanded="false" aria-controls="gift-certificate-form">
			{{#if hasGiftCertificates}}
				{{translate 'Add other Gift Certificate'}}
			{{else}}
				{{translate 'Apply a Gift Certificate'}}
			{{/if}}
			<i class="order-wizard-paymentmethod-giftcertificates-module-expander-icon"></i>
		</a>
	</div>
	<form id="gift-certificate-form" class="order-wizard-paymentmethod-giftcertificates-module-form collapse" data-action="gift-certificate-form">
		<div class="order-wizard-paymentmethod-giftcertificates-module-form-expander-container">
			<fieldset>
				
				<div class="order-wizard-paymentmethod-giftcertificates-module-form-input-container">
					<input type="text" class="order-wizard-paymentmethod-giftcertificates-module-form-input" name="code">
				</div>
				<div class="order-wizard-paymentmethod-giftcertificates-module-form-submit-container">
					<button type="submit" class="order-wizard-paymentmethod-giftcertificates-module-form-submit">
					{{translate 'Apply'}}
				</button>
				</div>

				<div data-type="alert-placeholder-gif-certificate"></div>
			</fieldset>
		</div>
	</form>

	{{#if hasGiftCertificates}}
		<table class="order-wizard-paymentmethod-giftcertificates-module-table">
			<thead class="order-wizard-paymentmethod-giftcertificates-module-table-header">
				<tr>
					<th class="order-wizard-paymentmethod-giftcertificates-module-row-number">
						<span>{{translate 'Gift Certificate number'}}</span>
					</th>
					<th class="order-wizard-paymentmethod-giftcertificates-module-row-amount">
						<span>{{translate 'Amount applied'}}</span>
					</th>
					<th class="order-wizard-paymentmethod-giftcertificates-module-row-remaining">
						<span>{{translate 'Remaining balance'}}</span>
					</th>
					<th class="order-wizard-paymentmethod-giftcertificates-module-row-actions"></th>
				</tr>
			</thead>
			<tbody class="order-wizard-paymentmethod-giftcertificates-module-table-body" data-view="GiftCertificatesRecords"></tbody>
		</table>

	{{/if}}
</div>
