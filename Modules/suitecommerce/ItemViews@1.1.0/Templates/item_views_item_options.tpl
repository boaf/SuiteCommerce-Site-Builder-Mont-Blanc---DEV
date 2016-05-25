{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#each options}}
	{{#if showValue}}
		<p class="item-views-item-options-container" item-option={{id}}>
			<span class="item-views-item-options">{{name}}</span> 
			<span class="item-views-item-options-value"> {{displayValue}}</span>
		</p>
	{{/if}}
{{/each}}