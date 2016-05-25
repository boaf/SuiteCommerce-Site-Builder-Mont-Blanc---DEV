{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showQuantity}}
	<p>{{translate '<span class="item-views-item-quantity-label">Quantity: </span> <span class="item-views-item-quantity-value">$(0)</span>' line.quantity }}</p>
{{/if}}

{{#if showAmount}}
	<p>
		<span class="item-views-item-quantity-label">{{translate 'Total Amount:'}}</span>
		{{#if showDiscount}}
			<span class="item-views-item-quantity-item-amount">
				{{line.total_formatted}}
			</span>
			<span class="item-views-item-quantity-non-discounted-amount">
				{{line.amount_formatted}}
			</span>
		{{else}}
			<span class="item-views-item-quantity-item-amount">
				{{line.amount_formatted}}
			</span>
		{{/if}}
	</p>
{{/if}}