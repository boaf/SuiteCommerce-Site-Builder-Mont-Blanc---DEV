{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if isTrackingNumberCollectionEmpty}}
	{{#if showContentOnEmpty}}
		<span class="order-history-list-tracking-number-not-available-label">{{translate 'Tracking Number:'}}</span>
		<span class="order-history-list-tracking-number-not-available {{contentClass}}">
			{{translate 'N/A'}}
		</span>
	{{/if}}
{{else}}
	{{#if isTrackingNumberCollectionLengthEqual1}}
		{{#if showTrackPackagesLabel}}
			<span class="order-history-list-tracking-number-label">
				{{translate 'Track Packages'}}: 
			</span>
		{{/if}}
			<span class="order-history-list-tracking-number-available-label">{{translate 'Tracking Number:'}} </span>
		{{#if firstTrackingNumberName}}
			<a target="_blank" class="order-history-list-tracking-number-control-numbers-link" data-action="tracking-number" href="{{firstTrackingNumberURL}}">{{firstTrackingNumberName}} {{firstTrackingNumberText}}</a>
		{{else}}
			<a target="_blank" class="order-history-list-tracking-number-control-numbers-link" data-action="tracking-number" href="{{firstTrackingNumberURL}}">{{firstTrackingNumberText}}</a>
		{{/if}}
	{{else}}
		<div class="order-history-list-tracking-number-control">
			<button class="order-history-list-tracking-number-control-button"  data-toggle="dropdown">
				{{translate 'Track Packages'}}
				<i class="order-history-list-tracking-number-control-toggle-icon"></i>
			</button>
			<div class="order-history-list-tracking-number-control-numbers {{#if collapseElements}}collapsed{{/if}}">
				<ul>
				{{#each trackingNumbers}}
					<li>
						<a target="_blank" class="order-history-list-tracking-number-control-numbers-link" data-action="tracking-number" href="{{serviceURL}}">{{trackingNumber}}</a>
						{{serviceName}}
					</li>
				{{/each}}
				</ul>
			</div>
		</div>
	{{/if}}
{{/if}}