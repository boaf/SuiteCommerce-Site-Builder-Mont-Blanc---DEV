{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-msr-enablelink-module">
	<a class="order-wizard-msr-enablelink-module-link" href="#" data-action="change-status-multishipto" data-type="{{#if isMultiShipToEnabled}}multishipto{{else}}singleshipto{{/if}}" >
		{{#if isMultiShipToEnabled}}
			{{translate 'I want to ship to a single address'}}
		{{else}}
			{{translate 'I want to ship to multiple addresses'}}
		{{/if}}
	</a>
	{{#unless isMultiShipToEnabled}}
		<i class="order-wizard-msr-enablelink-module-link-icon" data-toggle="tooltip" title="" data-original-title="{{translate 'Click here if you want to divide your order and ship it to multiple addresses. All your data will be saved.'}}" ></i>
	{{/unless}}
</div>