{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-paymentmethod-selector-module">
	{{#if showTitle}}
		<h2 class="order-wizard-paymentmethod-selector-module-header">
			{{title}}
		</h2>
	{{/if}}
	{{#if activeModulesLengthGreaterThan1}}
		<select class="order-wizard-paymentmethod-selector-module-options" data-action="select-payment-method" >
			{{#each activeModules}}
				<option class="order-wizard-paymentmethod-selector-module-option" {{#if isSelected}}selected{{/if}}  data-type="{{type}}" value="{{type}}">
					{{name}}
				</option>
			{{/each}}
		</select>
	{{/if}}

	<div class="order-wizard-paymentmethod-selector-module-payment-method-selector-content" id="payment-method-selector-content"></div>
</div>