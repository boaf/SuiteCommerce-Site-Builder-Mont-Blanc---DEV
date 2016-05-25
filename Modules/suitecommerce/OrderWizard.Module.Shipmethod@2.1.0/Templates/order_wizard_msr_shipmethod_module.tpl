{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showPackages}}
	<div data-type="shipments-list" data-view="Packages.Collection"></div>
{{else}}
	<p class="order-wizard-msr-shipmethod-module-message">
		<i class="order-wizard-msr-shipmethod-module-message-icon"></i>
		{{translate 'You haven\'t set any shipments yet'}}
	</p>
{{/if}}