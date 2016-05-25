{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-address-module">
	<div class="order-wizard-address-module-show-addresses-container">
		{{#if showTitle}}
			<h3 class="order-wizard-address-module-title">
				{{title}}
			</h3>
		{{/if}}
		{{#if isSameAsEnabled}}
			<label class="order-wizard-address-module-checkbox">
				<input
					{{#if isSameAsCheckBoxDisable}}disabled="disabled"{{/if}}
					type="checkbox"
					name="same-as-address"
					data-action="same-as"
					value="1"
					{{#if isSameAsSelected}}checked{{/if}}
				>
				{{sameAsMessage}}
			</label>
		{{/if}}

		{{#if showSingleAddressDetails}}
			<div data-view="Single.Address.Details" class="order-wizard-address-module-single"></div>
		{{else}}
			{{#if showAddressList}}
				<div id="order-wizard-address-module-placeholder" {{#if showManageValue}}data-manage="{{manageValue}}"{{/if}} class="order-wizard-address-module-list-placeholder">
					<p>
						<a class="order-wizard-address-module-new-button" href="/addressbook/new" data-toggle="show-in-modal">
							{{translate 'Add New Address'}}
						</a>
					</p>
					<div class="order-wizard-address-module-address-container">
						<div data-view="Address.List"></div>
					</div>
				</div>
			{{else}}
				<div id="address-module-form-placeholder" {{#if showManageValue}}data-manage="{{manageValue}}"{{/if}} class="order-wizard-address-module-form-placeholder">
					<div data-view="New.Address.Form"></div>

					{{#if showSaveButton}}
						<div class="order-wizard-address-module-form-actions">
							<button type="submit" class="order-wizard-address-module-save-button" data-action="submit">
								{{translate 'Save Address'}}
							</button>
						</div>
					{{/if}}
				</div>
			{{/if}}
		{{/if}}
	</div>
</div>