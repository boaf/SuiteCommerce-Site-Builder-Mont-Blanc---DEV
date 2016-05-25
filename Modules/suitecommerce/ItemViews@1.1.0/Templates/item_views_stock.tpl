{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-stock">
	{{#if isAvailableInStore}}
		<div class='item-views-stock-msg-not-available'>{{translate 'This item is no longer available'}}</div>
	{{else}}
		{{#if showOutOfStockMessage}}
			<p class="item-views-stock-msg-out">
				<span class="item-views-stock-icon-out">
					<i></i>	
				</span>
				<span class="item-views-stock-msg-out-text">{{stockInfo.outOfStockMessage}}</span>
			</p>
		{{/if}}
		{{#if showInStockMessage}}
			<p class="item-views-stock-msg-in">
				<span class="item-views-stock-icon-in">
					<i></i>
				</span>
				{{stockInfo.inStockMessage}}
			</p>
		{{/if}}
		{{#if showStockDescription}}
			<p class="item-views-stock-msg-description {{stockInfo.stockDescriptionClass}}">
				<i class="item-views-stock-icon-description"></i>
				{{stockInfo.stockDescription}}
			</p>
		{{/if}}
	{{/if}}
</div>