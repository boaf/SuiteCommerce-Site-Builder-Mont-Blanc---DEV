{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="order-history-list-button-back">
		<i class="order-history-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="order-history-list">
	<header class="order-history-list-header">
		<h2>{{pageHeader}}</h2>
	</header>

	{{#if showStatusFilter}}
		<div class="order-history-list-open-list-header-nav">
			<div class="order-history-list-open-list-header-button-group">
				<span class="order-history-list-open-list-header-button-open">{{translate 'Open'}}</span>
				<a href="/purchasesAll" class="order-history-list-open-list-header-button-all">{{translate 'All'}}</a>
			</div>
		</div>
	{{/if}}

	<div data-view="ListHeader"></div>

	{{#if collectionLengthGreaterThan0}}
	<div class="order-history-list-recordviews-container">
		<table class="order-history-list-recordviews-actionable-table">
			<thead class="order-history-list-recordviews-actionable-header">
				<tr>
					<th class="order-history-list-recordviews-actionable-title-header">
						<span>{{translate 'Purchase No.'}}</span>
					</td>
					<th class="order-history-list-recordviews-actionable-date-header">
						<span>{{translate 'Date'}}</span>
					</th>
					<th class="order-history-list-recordviews-actionable-currency-header">
						<span>{{translate 'Amount'}}</span>
					</th>
					{{#if isSCISIntegrationEnabled}}
						<th class="order-history-list-recordviews-actionable-origin-header">
							<span>{{translate 'Origin'}}</span>
						</th>
					{{else}}
						<th class="order-history-list-recordviews-actionable-status-header">
							<span>{{translate 'Status'}}</span>
						</th>
					{{/if}}
					<th class="order-history-list-recordviews-actionable-actions-header">
						<span>{{translate 'Track Items'}}</span>
					</th>
				</tr>
			</thead>
			<tbody class="order-history-list" data-view="Order.History.Results"></tbody>
		</table>
	</div>

	{{else}}
		{{#if isLoading}}
			<p class="order-history-list-empty">{{translate 'Loading...'}}</p>
		{{else}}
			<div class="order-history-list-empty-section">
				<h5>{{translate 'You don\'t have any purchases in your account right now.'}}</h5>
			</div>
		{{/if}}

	{{/if}}

	{{#if showPagination}}
		<div class="order-history-list-case-list-paginator">
			<div data-view="GlobalViews.Pagination"></div>
			{{#if showCurrentPage}}
				<div data-view="GlobalViews.ShowCurrentPage"></div>
			{{/if}}
		</div>
	{{/if}}
</section>