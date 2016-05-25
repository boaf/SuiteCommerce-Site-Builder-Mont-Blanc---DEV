{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showWrapper}}
<div class="{{wrapperClass}}">
{{/if}}
{{#if showCheckbox}}
	<label class="order-wizard-termsandconditions-module-label">
		<input type="checkbox" id="termsandconditions" name="termsandconditions" {{#if isAgreeTermCondition}}checked{{/if}}>
		{{translate 'I agree to the <a data-type="term-condition-link-module" data-toggle="show-terms" href="#">Terms & Conditions</a>'}}
	</label>
{{else}}
	<small class="order-wizard-termsandconditions-module-text">
		{{translate 'By placing your order, you are agreeing to our <a data-type="term-condition-link-module" data-toggle="show-terms" href="#">Terms & Conditions</a>'}}
	</small>
{{/if}}
{{#if showWrapper}}
</div>
{{/if}}