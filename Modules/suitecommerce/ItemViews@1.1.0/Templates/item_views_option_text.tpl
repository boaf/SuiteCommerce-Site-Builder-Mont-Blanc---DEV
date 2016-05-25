{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-option-text" data-id="{{itemOptionId}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
	<p>
		<label class="item-views-option-text-title" for="option-{{cartOptionId}}">
			{{label}} {{#if showRequiredFields}}<span class="item-views-option-text-title-required">*</span>{{/if}} 
		</label>
	</p>
	{{#if isTextArea}}
		<textarea 
			name="option-{{cartOptionId}}"
			id="option-{{cartOptionId}}"
			class="item-views-option-text-area"
			data-toggle="text-option"
			data-available="true"
			data-id="{{itemOptionId}}">{{#if showSelectedOption}}{{selectedOption.internalId}}{{/if}}</textarea>
	{{else}}
		<input 
			type="{{#if isEmail}}email{{else}}text{{/if}}"
			name="option-{{cartOptionId}}"
			id="option-{{cartOptionId}}"
			class="item-views-option-text-input" 
			value="{{#if showSelectedOption}}{{selectedOption.internalId}}{{/if}}" 
			data-toggle="text-option"
			data-id="{{itemOptionId}}"
			data-available="true">
	{{/if}}

</div>