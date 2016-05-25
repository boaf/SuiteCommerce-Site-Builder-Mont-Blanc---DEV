{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<section class="quote-details">
	<div class="quote-details-view">
		<header>
			<a href="/quotes" class="quote-details-header-back-btn">
				{{translate '&lt; Back to quotes'}}
			</a>
			<h2 class="quote-details-header-title">
				{{{pageHeader}}}
				<span class="quote-details-header-amount-total">
					{{totalFormatted}}
				</span>
			</h2>

		</header>

		<!--GENERATE HEADER -->
		<div class="quote-details-header-information">
			<div class="quote-details-row">
				<div class="quote-details-header-col-left">
					{{#if checkSalesrep}}
					<p class="quote-details-header-info-sales">
						{{translate '<span class="quote-details-header-label-salesrep">Sales rep: </span><span class="quote-details-header-value-salesrep">$(0)</span>' model.salesrep}}
					</p>
					{{/if}}
					<p class="quote-details-header-info-request-date">
						{{translate '<span class="quote-details-header-label-request-date">Request date: </span><span class="quote-details-header-value-date">$(0)</span>' model.trandate}}
					</p>
					<p class="quote-details-header-info-expiration-date">
						{{#if duedate}}
							{{#if model.isOverdue }}
								<span class="quote-details-header-label-expiration-date">{{translate 'Expiration date:'}}</span>
								<span class="quote-details-expiration-date-value">{{ duedate}}</span>
								<i class="quote-details-header-label-date-icon"></i>
							{{else}}
								{{#if model.isCloseOverdue}}
									{{translate '<span class="quote-details-header-label-date-closeoverdue">Expiration date: </span><span class="quote-details-header-value-date-closeoverdue">$(0)</span>' duedate}}<i class="quote-details-header-label-date-icon"></i>
								{{else}}
									{{translate '<span class="quote-details-header-label-date">Expiration date: </span><span class="quote-details-header-value-expiration-date">$(0)</span>' duedate}}
								{{/if}}
							{{/if}}
						{{else}}
							<span>{{translate 'Expiration date: Not specified'}}</span>
						{{/if}}
					</p>
					<p class="quote-details-header-info-amount">
						{{translate '<span class="quote-details-header-label-amount">Amount: </span><span class="quote-details-header-value-amount">$(0)</span>' totalFormatted}}
					</p>
				</div>
				<div class="quote-details-header-col-right">
					<p class="quote-details-header-info-status">
						{{translate '<span class="quote-details-header-label-status">Status: </span> <span class="quote-details-header-value-status">$(0)</span>' entitystatus}}
					</p>
				</div>
			</div>
		</div>

		<div class="quote-details-row">
			<div class="quote-details-content-col">

			<div class="quote-details-accordion-divider">
				<div class="quote-details-accordion-head">
					<a class="quote-details-accordion-head-toggle" data-toggle="collapse" data-target="#quote-products" aria-expanded="true" aria-controls="#quote-products">
						{{translate 'Products ($(0))' lineItemsLength}}
						<i class="quote-details-accordion-toggle-icon"></i>
					</a>
				</div>

				<div class="quote-details-accordion-body collapse in" id="quote-products" role="tabpanel" data-target="#quote-products">
					<table class="quote-details-products-table lg2sm-first">
						<thead class="quote-details-accordion-table-header">
							<th class="quote-details-products-table-header-image"></th>
							<th class="quote-details-products-table-header-product">{{translate 'Product'}}</th>
							<th class="quote-details-products-table-header-qty">{{translate 'Qty'}}</th>
							<th class="quote-details-products-table-header-unitprice">{{translate 'Unit price'}}</th>
							<th class="quote-details-products-table-header-amount">{{translate 'Amount'}}</th>
						</thead>
						<tbody data-view="Items.Collection"></tbody>
					</table>
				</div>
			</div>


				<!-- ITEMSEXTRADATA -->
				<div class="quote-details-accordion-divider">
					<div class="quote-details-accordion-head">
						<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-discount-info" aria-expanded="false" aria-controls="#quote-discount-info">
							{{translate 'Discount information'}}
							<i class="quote-details-accordion-toggle-icon"></i>
						</a>
					</div>

					<div class="quote-details-accordion-body collapse" id="quote-discount-info" role="tabpanel" data-target="#quote-discount-info">
						<div class="quote-details-accordion-container">
								{{#if itemsExtradata}}
									<div class="quote-details-accordion-row">
										<span class="quote-details-accordion-label-coupon-code">{{translate 'Coupon Code: '}}</span>
										<span class="quote-details-accordion-value-coupon-code">{{translate itemsExtradata.couponcode}}</span>
									</div>
									<div class="quote-details-accordion-row">
										<span class="quote-details-accordion-label-promo-code">{{translate 'Promotion: '}}</span>
										<span class="quote-details-accordion-value-promo-code">{{translate itemsExtradata.promocode}}</span>
									</div>
									<div class="quote-details-accordion-row">
										<span class="quote-details-accordion-label-discount">{{translate 'Discount: '}}</span>
										<span class="quote-details-accordion-value-discount">{{translate itemsExtradata.discountitem}}</span>
									</div>
									<div class="quote-details-accordion-row">
										<span class="quote-details-accordion-label-rate">{{translate 'Rate: '}}</span>
										<span class="quote-details-accordion-value-rate">{{translate itemsExtradata.discountrate}}</span>
									</div>
								{{else}}
									{{translate 'N/A'}}
								{{/if}}
						</div>
					</div>
				</div>

				<!-- BILLADDRESS -->
				<div class="quote-details-accordion-divider">
					<div class="quote-details-accordion-head">
						<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-billing-info" aria-expanded="false" aria-controls="#quote-billing-info">
							{{translate 'Billing address'}}
							<i class="quote-details-accordion-toggle-icon"></i>
						</a>
					</div>
					<div class="quote-details-accordion-body collapse" id="quote-billing-info" role="tabpanel" data-target="quote-billing-info">
						<div class="quote-details-accordion-container">
							<h5 class="quote-details-billing-info-card-title">
								{{translate 'Bill to:'}}
							</h5>
							<div class="quote-details-billing-info-card">
								<address>
									{{{billaddress}}}
								</address>
							</div>
						</div>
					</div>
				</div>


				<!-- MESSAGE -->
				<div class="quote-details-accordion-divider">

					<div class="quote-details-accordion-head">
						<a class="quote-details-accordion-head-toggle collapsed" data-toggle="collapse" data-target="#quote-messages" aria-expanded="false" aria-controls="#quote-messages">
							{{translate 'Message'}}
							<i class="quote-details-accordion-toggle-icon"></i>
						</a>
					</div>

					<div class="quote-details-accordion-body collapse" id="quote-messages" role="tabpanel" data-target="quote-messages">
							<div class="quote-details-accordion-container">
								{{message}}
							</div>
					</div>
				</div>
			</div>

			<div class="quote-details-summary-col">
					<div class="quote-details-summary-container">
						<h3 class="quote-details-summary-title">
							{{translate 'SUMMARY'}}
						</h3>
						<div class="quote-details-summary-subtotal">
							<p class="quote-details-summary-grid-float">
								<span class="quote-details-summary-amount-subtotal">
									{{translate summary.subtotal_formatted}}
								</span>
								{{translate 'Subtotal'}}
							</p>
						</div>

						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-discount">
								{{translate summary.discounttotal_formatted}}
							</span>
							{{translate 'Discount'}}
						</p>

						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-tax">
								{{translate summary.taxtotal_formatted}}
							</span>
							{{translate 'Tax Total'}}
						</p>

						<p class="quote-details-summary-grid-float">
							<span class="quote-details-summary-amount-shipping">
								{{translate summary.shippingcost_formatted}}
							</span>
							{{translate 'Shipping Cost'}}
						</p>

						<div class="quote-details-summary-total">
							<p class="quote-details-summary-grid-float">
								<span class="quote-details-summary-amount-total">
									{{totalFormatted}}
								</span>
								{{translate 'Total'}}
							</p>
						</div>
					</div>
					<div class="quote-details-row-fluid">
						<a href="{{pdfUrl}}" target="_blank" class="quote-details-button-download-pdf">{{translate 'Download as PDF'}}</a>
					</div>
		</div>
	</div>
</section>
