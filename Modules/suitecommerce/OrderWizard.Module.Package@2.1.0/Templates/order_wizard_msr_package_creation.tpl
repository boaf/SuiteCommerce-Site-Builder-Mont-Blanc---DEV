{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div>
	{{#if isAnyUnsetLine}}
		<div class="order-wizard-msr-package-creation-header">
			<h5 class="order-wizard-msr-package-creation-header-subtitle"> 
				{{translate 'Select shipping address'}} 
			</h5>
		</div>
		<div class="order-wizard-msr-package-creation-header-row" >
			<div class="order-wizard-msr-package-creation-shipping-left">
				<select data-action="set-shipments-address-selector" class="order-wizard-msr-package-creation-multishipto-address-selector" >
					{{#each addresses}}
						<option value="{{addressId}}" {{#if isSelected}}selected{{/if}} >
							{{addressText}}
						</option>
					{{/each}}
				</select>
			</div>
			<div class="order-wizard-msr-package-creation-shipping-right" >
				<a href="{{editAddressesUrl}}"  class="order-wizard-msr-package-creation-shipping-add-edit-link"> {{translate 'Add / Edit Addresses'}} </a>
			</div>
		</div>
		<div>
			<h5 class="order-wizard-msr-package-creation-header-subtitle">
				{{translate 'Select products for this address'}} 
			</h5>
		</div>
		<div data-type="items-selection-control" class="order-wizard-msr-package-creation-items-remaining-list">
			<div class="order-wizard-msr-package-creation-row">
				<div class="order-wizard-msr-package-creation-multishipto-table-container">
					<table class="order-wizard-msr-package-creation-multishipto-table">
						<th colspan="3" data-action="select-unselect-all" class="order-wizard-msr-package-creation-multishipto-table-header-select">
							{{#if hasMultipleUnsetLines}}
							    <input type="checkbox" data-type="selectunselect-all-checkbox" {{#if areAllItemSelected}}checked{{/if}} />
							    <label style="display:inline;"> {{#if areAllItemSelected}} {{translate 'Unselect all'}} {{else}} {{translate 'Select all (<span data-type="item-remaining-count">$(0)<span>)' allItemsLength}} {{/if}} </label>
							{{/if}}
						</th>
						<th class="order-wizard-msr-package-creation-multishipto-table-header-qty">{{translate 'Qty'}}</th>
						<th class="order-wizard-msr-package-creation-multishipto-table-header-unit-price">{{translate 'Unit Price'}}</th>
						<th class="order-wizard-msr-package-creation-multishipto-table-header-amount">{{translate 'Amount'}}</th>
					</table> 
				</div>

				<div data-type="items-remaining-list">
					<table class="order-wizard-msr-package-creation-products-table md2sm" data-view="ShippableItems.Collection"></table>
				</div>
			</div>
		</div>
		<div data-type="module-footer">
			{{#if isAnySelectedItem}}
				<div class="order-wizard-msr-package-creation-ship-address">
					<p class="order-wizard-msr-package-creation-item-count">
						{{#if isSelectedItemsLengthGreaterThan1}}
							{{translate 'The <span data-type="item-selected-count">$(0)</span> products you selected will be shipped to:' selectedItemsLength}}
						{{else}}
							{{translate '<span data-type="item-selected-count" class="hidden">$(0)</span>The product you selected will be shipped to:' selectedItemsLength}}
						{{/if}}
					</p>

					<div data-type="multishipto-address-selected" class="order-wizard-msr-package-creation-multishipto-address-selected" >
						<div data-view="Address.Details" class="order-wizard-msr-package-creation-single-address"></div>
					</div>
				</div>
			{{else}}
				<p class="order-wizard-msr-package-creation-item-count">{{translate '<span data-type="item-selected-count">$(0)</span> products selected' selectedItemsLength}}</p>
			{{/if}}
				
			<button data-action="create-shipments" class="order-wizard-msr-package-creation-button-create" {{#unless isCreateShipmentEnabled}}disabled="disabled"{{/unless}}>
				{{createShipmentLabel}}
			</button>
		</div>
	{{/if}}
</div>