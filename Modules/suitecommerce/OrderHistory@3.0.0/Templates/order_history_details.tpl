{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<a href="/purchases" class="order-history-details-back-btn">{{translate '&lt; Back to Purchases'}}</a>
<section>
	<header>
		<h2 class="order-history-details-order-title" data-origin='{{originName}}'>
			<span class="order-history-details-order-title">{{title}} </span><b> <span class="order-history-details-order-number">{{model.tranid}}</span></b>
			<span class="order-history-details-total-formatted">
				{{model.summary.total_formatted}}
			</span>
		</h2>
	</header>

	<div data-type="alert-placeholder"></div>

	{{#if showReturnAuthorizations}}
		<div class="order-history-details-message-warning" data-action="go-to-returns">
			{{translate 'You have returns associated with this order. <a href="#">View Details</a>'}}
		</div>
	{{/if}}

	{{#if showPaymentEventFail}}
		<div class="order-history-details-message-warning">
			{{translate 'The checkout process of this purchase was not completed. To place order, please <a href="$(0)">finalize your payment.</a>' model.paymentevent.redirecturl}}
		</div>
	{{/if}}

	<!-- HEADER INFORMATION -->
	<div class="order-history-details-header-information">
		<div class="order-history-details-header-row">
			<div class="order-history-details-header-col-left">
				<p class="order-history-details-header-date-info">
					{{translate '<span class="order-history-details-header-date-info-date-label">Date: </span> <span class="order-history-details-header-date">$(0)</span>' model.trandate}}
				</p>
			</div>
			<div class="order-history-details-header-col-right">
				<p class="order-history-details-header-status-info">
					{{translate '<strong>Status: </strong> <span class="order-history-details-header-status">$(0)</span>' model.status.name}}
				</p>
			</div>
			<div class="order-history-details-header-amount">
				<p class="order-history-details-header-amount-info">
					{{translate '<span class="order-history-details-header-amount-info-amount-label">Amount: </span> <span class="order-history-details-header-amount-number">$(0)</span>' model.summary.total_formatted}}
				</p>
			</div>

		</div>
	</div>

	<div class="order-history-details-row">
		<div class="order-history-details-content-col">

			<div class="order-history-details-shipping-groups" data-view="ShipGroups"></div>

			{{#if showNonShippableLines}}

				<div class="order-history-details-accordion-divider">
					<div class="order-history-details-accordion-head">
						<a class="order-history-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#products-not-shipp" aria-expanded="true" aria-controls="products-not-shipp">
							{{#if nonShippableItemsLengthGreaterThan1}}
								{{translate 'Products that don\'t require shipping ($(0))' nonShippableLines.length}}
							{{else}} 
								{{translate 'Product that doesn\'t require shipping ($(0))' nonShippableLines.length}}
							{{/if}}
						<i class="order-history-details-accordion-toggle-icon-secondary"></i>
						</a>
					</div>
					<div class="order-history-details-accordion-body collapse" id="products-not-shipp" role="tabpanel" data-target="#products-not-shipp">
						<div class="order-history-details-accordion-container" data-content="order-items-body">
							<table class="order-history-details-non-shippable-table">
								<tbody data-view="NonShippableLines"></tbody>
							</table>
						</div>
					</div>
				</div>

			{{/if}}

			{{#if showInStoreLines}}
				<div class="order-history-details-shipping-information">
					<h3 class="order-history-details-shipping-title">
						{{#if inStoreLinesLengthGreaterThan1}}
							{{translate 'Items picked up in store'}}
						{{else}}
							{{translate 'Item picked up in store'}}
						{{/if}}
					</h3>
					{{#if showInStoreLinesAccordion}}
						<div class="order-history-details-accordion-head">
		
							<a class="order-history-details-accordion-head-toggle {{initiallyCollapsedArrow}}" data-toggle="collapse" data-target="#products-not-shipp" aria-expanded="true" aria-controls="products-not-shipp">
								{{#if inStoreLinesLengthGreaterThan1}}
									{{translate 'Items picked up in store'}}
								{{else}}
									{{translate 'Item picked up in store'}}
								{{/if}}
								<i class="order-history-details-accordion-toggle-icon"></i>
							</a>
						</div>
						<div class="order-history-details-accordion-body collapse {{initiallyCollapsed}}" id="products-not-shipp" role="tabpanel" data-target="#products-not-shipp">
							<div class="order-history-details-accordion-container" data-content="order-items-body">
								<table class="order-history-details-non-shippable-table">
									<tbody data-view="InStoreLines"></tbody>
								</table>
							</div>
						</div>
					{{else}}
						<div class="order-history-details-accordion-body-no-header collapse {{#unless showInStoreLinesAccordion}}in{{/unless}}" id="products-not-shipp" role="tabpanel" data-target="#products-not-shipp">
							<div class="order-history-details-accordion-container" data-content="order-items-body">
								<table class="order-history-details-non-shippable-table">
									<tbody data-view="InStoreLines"></tbody>
								</table>
							</div>
						</div>
					{{/if}}
				</div>
			{{/if}}


			<!-- PAYMENT INFORMATION -->
			<div class="order-history-details-accordion-divider">
				<div class="order-history-details-accordion-head">
					<a class="order-history-details-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#order-payment-info" aria-expanded="true" aria-controls="order-payment-info">{{translate 'Payment Information'}}
					<i class="order-history-details-accordion-toggle-icon-secondary"></i>
					</a>
				</div>
				<div class="order-history-details-accordion-body collapse" id="order-payment-info" role="tabpanel" data-target="#order-payment-info">
					<div class="order-history-details-accordion-container" data-content="order-items-body">

						{{#if showPaymentMethod}}
							<div class="order-history-details-payment-info-cards">
								<div class="order-history-details-info-card">
									<h5 class="order-history-details-info-card-title">
										{{translate 'Payment Method'}}
									</h5>
									<div class="order-history-details-info-card-info">
										<div data-view='FormatPaymentMethod'></div>
									</div>
								</div>
								{{#if showBillAddress}}
								<div class="order-history-details-info-card">
									<h5 class="order-history-details-info-card-title">
										{{translate 'Bill to'}}
									</h5>
									<div class="order-history-details-info-card-info-billing">
										<div data-view="Billing.Address.View"></div>
									</div>
								</div>
								{{/if}}
							</div>
						{{/if}}


						<div class="order-history-details-payment" data-view="Payments"></div>

						<div class="order-history-details-payment-others" data-view="OtherPayments"></div>
						
					</div>
				</div>
			</div>	

			<!-- PAYMENT INFORMATION ENDS -->

			{{#if showReturnAuthorizations}}
				<!-- RETURNS AUTHORIZATIONS -->
				<div class="order-history-details-accordion-divider">
					<div class="order-history-details-accordion-head collapsed">
						<a class="order-history-details-accordion-head-toggle-secondary" data-toggle="collapse" data-target="#returns-authorizations" aria-expanded="true" aria-controls="returns-authorizations">
						{{translate '<span>Returns ($(0))</span>' returnAuthorizations.totalLines}}
						<i class="order-history-details-accordion-toggle-icon-secondary"></i>
						</a>
					</div>
					<div class="order-history-details-accordion-body collapse" id="returns-authorizations" role="tabpanel" data-target="#returns-authorizations">
						<div class="order-history-details-accordion-container" data-content="order-items-body">
							<div data-view="ReturnAutorization"></div>
						</div>
					</div>
				</div>
				<!-- RETURNS AUTHORIZATIONS ENDS -->
			{{/if}}
		</div>

		<!-- SUMMARY -->
		<div class="order-history-details-summary" data-view="Summary"></div>
		<!-- SUMMARY ENDS -->
	</div>
</section>
