{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr id="{{lineId}}" class="recordviews-actionable {{lineId}}" data-item-id="{{itemId}}" data-id="{{id}}" data-record-type="{{recordType}}" data-type="order-item" data-action="navigate">
	<td class="recordviews-actionable-title">
		<a href="#" data-touchpoint="{{touchpoint}}" data-hashtag="{{detailsURL}}">{{title}}</a>
	</td>

	{{#each columns}}
		<td class="recordviews-actionable-{{type}}" data-name="{{name}}">
			{{#if showLabel}}
				<span class="recordviews-actionable-label">{{label}}</span>
			{{/if}}
			{{#if isComposite}}
				<span class="recordviews-actionable-composite" data-view="{{compositeKey}}"></span>
			{{else}}
				<span class="recordviews-actionable-value">{{value}}</span>
			{{/if}}
		</td>
	{{/each}}

	<td class="recordviews-actionable-actions">
		<p class="recordviews-actionable-label"> {{actionTitle}} </p>
		<div data-view="Action.View" ></div>
	</td>
</tr>
