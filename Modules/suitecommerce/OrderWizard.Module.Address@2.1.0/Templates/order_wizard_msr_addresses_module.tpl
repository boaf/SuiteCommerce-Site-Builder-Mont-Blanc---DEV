{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showTitle}}
	<h3 class="order-wizard-msr-addresses-module-section-header">
		{{title}}
	</h3>
{{/if}}

<div data-type="alert-placeholder-module"></div>


{{#if showCollapsedView}}
	<a class="order-wizard-msr-addresses-module-address-link" data-action="add-edit-addreses-link">{{translate 'Add/Edit Addresses'}}</a>
{{else}}
	{{#if isAddressListLengthGreaterThan0}}
		<div id="address-module-list-placeholder" {{#if showManageValue}}data-manage="{{manageValue}}"{{/if}} class="order-wizard-msr-addresses-module-container">
			{{#if hasEnoughValidAddresses}}
				<p>
					<a class="order-wizard-msr-addresses-module-new-button" href="/addressbook/new" data-toggle="show-in-modal">
						{{translate 'Add New Address'}}
					</a>
				</p>
			{{/if}}

			<div data-view="Address.List"></div>

			{{#unless hasEnoughValidAddresses}}
				<p class="order-wizard-msr-addresses-module-new-address-title">{{translate 'New Address'}}</p>
				<div id="address-module-form-placeholder" {{#if showManageValue}}data-manage="{{manageValue}}"{{/if}} class="order-wizard-msr-addresses-module-form-placeholder">

					<div data-view="New.Address.Form"></div>

					{{#if showSaveButton}}
						<div class="form-actions">
							<button type="submit" class="order-wizard-msr-addresses-module-save-button" data-action="submit">
								{{translate 'Save Address'}}
							</button>
						</div>
					{{/if}}

				</div>
			{{/unless}}
		</div>
	{{else}}
		<p class="order-wizard-msr-addresses-module-new-address-title">{{translate 'New Address'}}</p>
		<div id="address-module-form-placeholder" {{#if showManageValue}}data-manage="{{manageValue}}"{{/if}} class="order-wizard-msr-addresses-module-form-placeholder">

			<div data-view="New.Address.Form"></div>

			{{#if showSaveButton}}
				<div class="form-actions">
					<button type="submit" class="order-wizard-msr-addresses-module-save-button" data-action="submit">
						{{translate 'Save Address'}}
					</button>
				</div>
			{{/if}}

		</div>
	{{/if}}
{{/if}}