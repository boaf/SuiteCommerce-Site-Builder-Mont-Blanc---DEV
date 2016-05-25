{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showActions}}
	<a 
		class="order-history-item-actions-reorder" 
		data-action="add-to-cart" 
		data-line-id="{{lineId}}" 
		data-item-id="{{itemId}}" 
		data-item-quantity="{{line.quantity}}"
		data-partial-quantity="{{line.partial_quantity}}" 
		data-parent-id="{{itemParentId}}" 
		data-item-options="{{lineFormatOptions}}">
		{{#if isQuantityGreaterThan1}}
			{{translate 'Reorder these Items'}}
		{{else}}
			{{translate 'Reorder this Item'}}
		{{/if}}
	</a>
{{/if}}