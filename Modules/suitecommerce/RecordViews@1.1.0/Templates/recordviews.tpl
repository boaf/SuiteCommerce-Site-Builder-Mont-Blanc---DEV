{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr class="recordviews-row" data-item-id="{{id}}" data-navigation-hashtag="{{detailsURL}}" data-action="navigate">
	<td class="recordviews-title" data-name="title">
		<span class="recordviews-title-value">
			{{#if isNavigable}}
			<a class="recordviews-title-anchor" href="#" data-touchpoint="{{touchpoint}}" data-id="{{id}}" data-hashtag="{{detailsURL}}" {{#if showInModal}}data-toggle="show-in-modal"{{/if}}>
			{{/if}}
				{{title}}
			{{#if isNavigable}}
			</a>
			{{/if}}
		</span>
	</td>

{{#each columns}}
	<td class="recordviews-{{type}}" data-name="{{name}}">
		{{#if showLabel}}
			<span class="recordviews-label">{{label}}</span>
		{{/if}}
		{{#if isComposite}}
			<span class="recordviews-value" data-view="{{compositeKey}}"></span>
		{{else}}
			<span class="recordviews-value">{{value}}</span>
		{{/if}}
	</td>
{{/each}}
</tr>
