{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-shipmethod-module">
	{{#if showTitle}}
		<h3 class="order-wizard-shipmethod-module-title">
			{{title}}
		</h3>
	{{/if}}
	
	{{#if showEnterShippingAddressFirst}}
		<div class="order-wizard-shipmethod-module-message">
			{{translate 'Warning: Please enter a valid shipping address first'}}
		</div>
	{{else}}
		{{#if showLoadingMethods}}
			<div class="order-wizard-shipmethod-module-message">
				{{translate 'Loading...'}}
			</div>
		{{else}}
			{{#if hasShippingMethods}}
				{{#if showSelectForShippingMethod}}
					<select data-action="select-delivery-option" data-action="edit-module" class="order-wizard-shipmethod-module-option-select">
						<option>{{translate 'Select a delivery method'}}</option>
						{{#each shippingMethods}}
							<option 
							{{#if isActive}}selected{{/if}} 
							value="{{internalid}}"
							id="delivery-options-{{internalid}}">
								{{#if ShippingRateNA}} {{else}} {{rate_formatted}} - {{/if}}{{name}}
							</option>
						{{/each}}
					</select>
				{{else}}
					{{#each shippingMethods}}
						<a data-action="select-delivery-option-radio" 
						class="order-wizard-shipmethod-module-option {{#if isActive}}order-wizard-shipmethod-module-option-active{{/if}}"
						data-value="{{internalid}}">
							<input type="radio" name="delivery-options" data-action="edit-module" class="order-wizard-shipmethod-module-checkbox" 
							{{#if isActive}}checked{{/if}}
							value="{{internalid}}" 
							id="delivery-options-{{internalid}}" />
							
							<span class="order-wizard-shipmethod-module-option-name">{{name}}
								<span class="order-wizard-shipmethod-module-option-price">{{rate_formatted}}</span>	
							</span>
						</a>
					{{/each}}
				{{/if}}
			{{else}}
				<div class="order-wizard-shipmethod-module-message">
					{{translate 'Warning: No Delivery Methods are available for this address'}}
				</div>
			{{/if}}
		{{/if}}
	{{/if}}
</div>
