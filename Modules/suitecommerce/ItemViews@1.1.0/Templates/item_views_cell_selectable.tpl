{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

	<tr class="item-{{itemId}}  {{#if isLineSelected}}item-views-cell-selectable-multishipto-line-selected{{/if}}" data-item-id="{{itemId}}" data-type="row" data-line-id="{{lineId}}"  data-action="select-unselected-item">
		<td class="item-views-cell-selectable-item-selector">
				<input data-type="checkbox-item-selector" type="checkbox" {{#if isLineSelected}}checked{{/if}} />
			</td>

			<td class="item-views-cell-selectable-item-image">
				<img src="{{resizeImage itemImageURL 'tinythumb'}}" alt="{{itemImageAltText}}">
			</td>
			<td class="item-views-cell-selectable-item-details">

				<p class="item-views-cell-selectable-item-displayname">
					{{#if isNavigable}}
						<a {{{itemURLAttributes}}}>{{itemName}}</a>
					{{else}}
						<span class="item-views-cell-selectable-item-displayname-viewonly">{{itemName}}</span>
					{{/if}}
				</p>
				<p class="item-views-cell-selectable-item-sku">
					<span>{{translate 'SKU:'}}</span>
					<span>{{itemSKU}}</span>
				</p>
				<p class="item-views-cell-selectable-stock" data-view="ItemViews.Stock.View">
				</p>
				{{#if showOptions}}
					<div data-view="Item.Options"></div>
				{{/if}}
			</td>
			<td class="item-views-cell-selectable-item-qty">
					{{#if isDetail1Composite}}
					<div data-view="Detail1.View"></div>
				{{else}}
					{{#if showDetail1Title}}
						<span class="item-views-cell-selectable-visible-phone">{{detail1Title}}</span>
					{{/if}}
					{{detail1}}
				{{/if}}
			</td>
			<td class="item-views-cell-selectable-item-unit-price">
				<p>
				{{#if showDetail2Title}}
					<span class="item-views-cell-selectable-item-unit-price-label">{{detail2Title}}</span>
				{{/if}}
				<span class="item-views-cell-selectable-item-unit-price-value">
					{{detail2}}
				</span>
				</p>
			</td>
			<td class="item-views-cell-selectable-item-amount">
				<p>
				{{#if showDetail3Title}}
					<span class="item-views-cell-selectable-item-amount-label">{{detail3Title}}</span>
				{{/if}}
				<span class="item-views-cell-selectable-item-amount-value">
					{{detail3}}
				</span>
				</p>
			</td>
	</tr>

