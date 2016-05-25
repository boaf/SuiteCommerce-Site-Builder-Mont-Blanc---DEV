{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr id="{{lineId}}" data-item-id="{{itemId}}" data-type="order-item" {{#if showGeneralClass}} class="{{generalClass}}" {{/if}} >
	<td class="item-views-cell-actionable-expanded-table-first">
		<div class="item-views-cell-actionable-expanded-thumbnail">
			{{#if isNavigable}}
				<a {{linkAttributes}}>
					<img src="{{resizeImage item._thumbnail.url 'thumbnail'}}" alt="{{item._thumbnail.altimagetext}}">
				</a>
			{{else}}
				<img src="{{resizeImage item._thumbnail.url 'thumbnail'}}" alt="{{item._thumbnail.altimagetext}}">
			{{/if}}
		</div>
	</td>
	<td class="item-views-cell-actionable-expanded-table-middle">
		<div class="item-views-cell-actionable-expanded-name">
		{{#if isNavigable}}
			<a {{linkAttributes}} class="item-views-cell-actionable-expanded-name-link">
				{{item._name}}
			</a>
		{{else}}
				<span class="item-views-cell-actionable-expanded-name-viewonly">{{item._name}}</span>
		{{/if}}
		</div>
		<div class="item-views-cell-actionable-expanded-price">
			<div data-view="Item.Price"></div>
		</div>
		<div class="item-views-cell-actionable-expanded-sku">
			<p>
				<span class="item-views-cell-actionable-expanded-sku-label">{{translate 'SKU: '}}</span>
				<span class="item-views-cell-actionable-expanded-sku-value">{{item._sku}}</span>
			</p>
		</div>
		<div class="item-views-cell-actionable-expanded-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>
		<div class="item-views-cell-actionable-expanded-stock" data-view="ItemViews.Stock.View">
		</div>
		
	</td>
	<td class="item-views-cell-actionable-expanded-table-middle">
		{{#if showSummaryView}}
			<div class="item-views-cell-actionable-expanded-summary" data-view="Item.Summary.View"></div>
		{{/if}}
	</td>
	<td class="item-views-cell-actionable-expanded-table-last">
		<div data-view="Item.Actions.View"></div>
		
		{{#if showAlert}}
			<div class="item-views-cell-actionable-expanded-alert-placeholder" data-type="alert-placeholder"></div>
		{{/if}}

		{{#if showCustomAlert}}
			<div class="alert alert-{{customAlertType}}">
				{{item._cartCustomAlert}}
			</div>
		{{/if}}
	</td>
</tr>
