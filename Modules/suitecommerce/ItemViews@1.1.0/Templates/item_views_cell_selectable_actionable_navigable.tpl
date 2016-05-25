{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr class="item-views-cell-selectable-actionable-navigable-row{{#if isLineChecked}} selected{{/if}}" data-action="{{actionType}}" data-id="{{lineId}}">
	<td class="item-views-cell-selectable-actionable-navigable-select">
		<input type="checkbox" value="{{itemId}}" data-action="select" {{#if isLineChecked}}checked{{/if}}>
	</td>

	<td class="item-views-cell-selectable-actionable-navigable-thumbnail">
		<img class="item-views-cell-selectable-actionable-navigable-thumbnail-image" src="{{resizeImage imageUrl 'thumbnail'}}" alt="{{altImageText}}">
	</td>

	<td class="item-views-cell-selectable-actionable-navigable-details">
		<div class="item-views-cell-selectable-actionable-navigable-name">
			<a {{{linkAttributes}}} class="">
				{{itemName}}
			</a>
		</div>

		<div class="item-views-cell-selectable-actionable-navigable-price">
			<div data-view="Item.Price"></div>
		</div>

		<div class="item-views-cell-selectable-actionable-navigable-sku">
			<span class="text-light">{{translate 'SKU:'}}</span>
			<span class="item-views-cell-selectable-actionable-navigable-sku-value">#{{itemSKU}}</span>
		</div>

		<div class="item-views-cell-selectable-actionable-navigable-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>
	</td>

	<td class="item-views-cell-selectable-actionable-navigable-extras">
		<div class="" data-view="Item.Summary.View"></div>
	</td>

	<td class="item-views-cell-selectable-actionable-navigable-actions">
		<div data-view="Item.Actions.View" class=""></div>
	</td>
</tr>
