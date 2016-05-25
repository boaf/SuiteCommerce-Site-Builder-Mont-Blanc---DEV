{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-option-tile" data-id="{{itemOptionId}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
	<p class="item-views-option-tile-title">
		<strong>{{label}}</strong>
		{{#if showSelectedOption}}
			{{selectedOption.label}}
		{{/if}}
	</p>
	<ul class="item-views-option-tile-picker" data-id="{{itemOptionId}}">
		{{#each options}}
			{{#if internalId}}
				<li>
					<a
						href="{{link}}"
						class="item-views-option-tile-anchor {{#if isActive}}active{{/if}} {{#unless isAvailable}}disabled{{/unless}}"
						data-value="{{internalId}}"
						data-toggle="set-option"
						data-active="{{isActive}}"
						data-available="{{isAvailable}}">
							<span>{{label}}</span>
					</a>
				</li>
			{{/if}}
		{{/each}}
	</ul>
</div>