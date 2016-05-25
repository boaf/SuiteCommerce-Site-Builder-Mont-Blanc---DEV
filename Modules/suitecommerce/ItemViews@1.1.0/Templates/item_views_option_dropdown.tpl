{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-option-dropdown-color" data-id="{{itemOptionId}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
	<p class="item-views-option-dropdown-color-label">
		{{label}}
		{{#if showSelectedOption}}
			: <span>{{selectedOption.label}}</span>
		{{/if}}
	</p>

	<select name="{{cartOptionId}}" id="{{cartOptionId}}" class="item-views-option-dropdown-select" data-toggle="select-option">

		{{#each options}}
			{{#if internalId}}
				<option
					class="{{#if isActive}}active{{/if}} {{#unless isAvailable}}muted{{/unless}}"
					value="{{internalId}}"
					{{#if isActive}}selected{{/if}}
					data-active="{{isActive}}"
					data-available="{{isAvailable}}">
						{{label}}
				</option>
			{{/if}}
		{{/each}}

	</select>
</div>