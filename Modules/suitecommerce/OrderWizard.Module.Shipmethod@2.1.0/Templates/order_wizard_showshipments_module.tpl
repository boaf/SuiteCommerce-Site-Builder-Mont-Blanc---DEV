{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showShippingInformation}}
	<section class="order-wizard-showshipments-module-shipping-details">
		<div class="order-wizard-showshipments-module-shipping-details-body">

			<div class="order-wizard-showshipments-module-shipping-details-address">
				<h3 class="order-wizard-showshipments-module-shipping-title">
					{{translate 'Shipping Address'}}
				</h3>
				{{#if showShippingAddress}}
					<div data-view="Shipping.Address"></div>
					{{#if showEditButton}}
						<a data-action="edit-module" href="{{{editUrl}}}?force=true" class="order-wizard-showshipments-module-shipping-details-address-link">
							{{translate 'Back to edit shipping information'}}
						</a>
					{{/if}}
				{{else}}
					<a data-action="edit-module" href="{{{editUrl}}}?force=true" class="order-wizard-showshipments-module-shipping-details-address-link">
						{{translate 'Please select a valid shipping address'}}
					</a>
				{{/if}}
			</div>

			{{#if showShippingMetod}}
			<div class="order-wizard-showshipments-module-shipping-details-method">
				<h3 class="order-wizard-showshipments-module-shipping-title">
					{{translate 'Delivery Method'}}
				</h3>
				{{#if showEditButton}}
					<select id="delivery-options" data-action="change-delivery-options" data-type="edit-module" class="order-wizard-showshipments-module-shipping-options" name="delivery-options">
						{{#unless showSelectedShipmethod}}
							<option>{{translate 'Please select a delivery method'}}</option>
						{{/unless}}
						{{#each shippingMethods}}
							<option value="{{internalid}}" {{#if isActive}}selected{{/if}} >
								{{rate_formatted}} - {{name}}
							</option>
						{{/each}}
					</select>
				{{else}}
					{{#if showSelectedShipmethod}}
						<div class="order-wizard-showshipments-module-shipping-details-method-info-card">
							<span class="order-wizard-showshipments-module-shipmethod-name">
									{{selectedShipmethod.name}}:
							</span>

							<span class="order-wizard-showshipments-module-shipmethod-rate">
								{{selectedShipmethod.rate_formatted}}
							</span>
						</div>
					{{/if}}
				{{/if}}
			</div>
{{/if}}

	</div>
	</section>
			{{/if}}
