{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div id="{{htmlIdContainer}}" class="{{htmlIdContainer}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
	<p class="item-views-option-radio-label">
		{{label}}
		{{#if showSelectedOption}}
			: <span>{{selectedOption.label}}</span>
		{{/if}}
	</p>
	<div id="{{htmlId}}" class="{{htmlId}}">
		{{#each options}}
			{{#if internalId}}
				<label class="radio {{#unless isAvailable}}muted{{/unless}}">
					<input 
						type="radio"
						name="{{htmlId}}" 
						value="{{internalId}}"
						{{#if isActive}}checked{{/if}}
						data-toggle="set-option" 
						data-active="{{isActive}}" 
						data-available="{{isAvailable}}">
					{{label}}
				</label>
			{{/if}}
		{{/each}}
	</div>
</div>