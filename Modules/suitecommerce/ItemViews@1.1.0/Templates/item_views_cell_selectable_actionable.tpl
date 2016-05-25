{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<article data-id="{{lineId}}" class="item-views-cell-selectable-actionable {{lineId}}" data-item-id="{{itemId}}">
	{{#if showCustomAlert}}
		<div class="item-views-cell-selectable-actionable-alert-placeholder" data-type="alert-placeholder">
			<div class="alert alert-{{customAlertType}}">
				{{alertText}}
			</div>
		</div>
	{{/if}}

	<div class="item-views-cell-selectable-actionable-item">
		<div class="item-views-cell-selectable-actionable-input-checkbox">
			<input type="checkbox" name="" value="{{lineId}}" {{#if isLineChecked}}checked{{/if}}>
		</div>

		<div class="item-views-cell-selectable-actionable-image">
			<div class="item-views-cell-selectable-actionable-thumbnail">
				{{#if isNavigable}}
					<a {{{linkAttributes}}}>
						<img src="{{resizeImage imageUrl 'thumbnail'}}" alt="{{altImageText}}">
					</a>
				{{else}}
					<img src="{{resizeImage imageUrl 'tinythumb'}}" alt="{{altImageText}}">
				{{/if}}
			</div>
		</div>
		<div class="item-views-cell-selectable-actionable-details">
				<div  class="item-views-cell-selectable-actionable-name">
				{{#if isNavigable}}
					<a {{{linkAttributes}}} class="item-views-cell-selectable-actionable-name-link">
						{{itemName}}
					</a>
				{{else}}
					{{itemName}}
				{{/if}}
				</div>
				<div class="item-views-cell-selectable-actionable-price">
					<div data-view="Item.Price"></div>
				</div>
				<div class="item-views-cell-selectable-actionable-sku">
					{{translate '<span class="item-views-cell-selectable-actionable-sku-text">SKU:</span> $(0)' itemSKU}}
				</div>
				<div class="item-views-cell-selectable-actionable-options">
					<div data-view="Item.SelectedOptions"></div>
				</div>
			{{#if showSummaryView}}
			<div class="item-views-cell-selectable-actionable-summary" data-view="Item.Summary.View">
			</div>
			{{/if}}
		</div>
	</div>
	{{#if showActionsView}}
	<div data-view="Item.Actions.View" class="item-views-cell-selectable-actionable-actions">
	</div>
	{{/if}}
</article>