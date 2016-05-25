{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<form class="cart-promocode-form" data-action="apply-promocode">
	<div class="cart-promocode-form-summary-grid">
	<div class="cart-promocode-form-summary-container-input">
		<div class="{{#if showErrorMessage}}error{{/if}}">
			<!-- Placeholder removed on SCA 2015 / placeholder="{{translate 'Promo code'}}" -->
			<input
				type="text"
				name="promocode"
				id="promocode"
				class="cart-promocode-form-summary-input"
				value="{{code}}"
			>
		</div>
	</div>
	<div class="cart-promocode-form-summary-promocode-container-button">
		<button type="submit" class="cart-promocode-form-summary-button-apply-promocode">
			{{translate 'Apply'}}
		</button>
	</div>
	</div>
	<div data-type="promocode-error-placeholder">
		{{#if showErrorMessage}}
			{{displayMessage errorMessage 'error' true}}
		{{/if}}
	</div>
</form>
