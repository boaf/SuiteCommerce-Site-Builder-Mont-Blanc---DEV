{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr class="item-views-cell-navigable {{cellClassName}} item-{{itemId}}" data-id="{{itemId}}" data-item-type="{{itemType}}">
	<td class="item-views-cell-navigable-item-image" name="item-image">
		<img src="{{resizeImage itemImageURL 'thumbnail'}}" alt="{{itemImageAltText}}">
	</td>
	<td class="item-views-cell-navigable-details" name="item-details">
		<p class="item-views-cell-navigable-product-name">
			{{#if isNavigable}}
				<a class="item-views-cell-navigable-product-title-anchor" {{{itemURLAttributes}}}>{{itemName}}</a>
			{{else}}
				<span class="item-views-cell-navigable-product-title">
					{{itemName}}
				</span>
			{{/if}}
		</p>
		<p>
			<div data-view="Item.Price"></div>
		</p>
		<p>
			<span class="item-views-cell-navigable-sku-label">{{translate 'SKU:'}} </span>
			<span class="item-views-cell-navigable-sku-value">{{itemSKU}}</span>
		</p>
		{{#if showOptions}}
			<div data-view="Item.Options"></div>
		{{/if}}
		<p>
			<span class="item-views-cell-navigable-stock" data-view="ItemViews.Stock.View">
		</p>
	</td>
	<td class="item-views-cell-navigable-item-unit-price" name="item-totalprice">
	{{#if showBlockDetail2}}
		<p>
		{{#if showDetail2Title}}
			<span class="item-views-cell-navigable-item-unit-price-label">{{detail2Title}} </span>
		{{/if}}
		<span class="item-views-cell-navigable-item-reason-value">{{detail2}}</span>
		</p>
	{{/if}}
	</td>
	<td class="item-views-cell-navigable-item-quantity" name="item-quantity">
		<p>
			<span class="item-views-cell-navigable-item-quantity-label">{{translate 'Quantity:'}} </span>
			<span class="item-views-cell-navigable-item-quantity-value">{{quantity}}</span>
		</p>
	</td>
	<td class="item-views-cell-navigable-amount" name="item-amount">
		<p>
		{{#if showDetail3Title}}
			<span class="item-views-cell-navigable-item-amount-label">{{detail3Title}} </span>
		{{/if}}
		<span class="item-views-cell-navigable-item-amount-value">{{detail3}}</span>
		{{#if showComparePrice}}
			<small class="item-views-cell-navigable-item-old-price">{{comparePriceFormatted}}</small>
		{{/if}}
		</p>
	</td>
</tr>
