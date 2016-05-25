{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-history-summary-summary-col">
	<div class="order-history-summary-summary-container">
		<!-- SUMMARY -->
		<h3 class="order-history-summary-summary-title">
			{{translate 'Summary'}}
		</h3>
		<div class="order-history-summary-summary-subtotal">
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-subtotal">
					{{model.summary.subtotal_formatted}}
				</span>
				{{translate 'Subtotal'}}
			
			</p>
		</div>

		{{#if showSummaryHandlingCost}}
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-handling">
					{{model.summary.handlingcost_formatted}}
				</span>
				{{translate 'Handling Total'}}
			</p>
		{{/if}}

		{{#if showSummaryGiftCertificateTotal}}
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-certificate">
					{{model.summary.giftcertapplied_formatted}}
				</span>
				{{translate 'Gift Cert Total'}}
			</p>
		{{/if}}

		{{#if showSummaryPromocode}}
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-promocode">
					<strong>{{model.summary.discountrate_formatted}}</strong>
				</span>
				{{translate 'Promo Code applied'}}<br>{{model.promocode.code}}
			</p>
		{{/if}}

		{{#if showSummaryDiscount}}
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-discount">
					{{model.summary.discounttotal_formatted}}
				</span>
				{{translate 'Discount Total'}}
			</p>
		{{/if}}

		{{#if showSummaryShippingCost}}
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-shipping">
					{{model.summary.shippingcost_formatted}}
				</span>
				{{translate 'Shipping Total'}}
			</p>
		{{/if}}

		<p class="order-history-summary-summary-grid-float">
			<span class="order-history-summary-summary-amount-tax">
				{{model.summary.taxtotal_formatted}}
			</span>
			{{translate 'Tax Total'}}
		</p>
		<div class="order-history-summary-summary-total">
			<p class="order-history-summary-summary-grid-float">
				<span class="order-history-summary-summary-amount-total">
					{{model.summary.total_formatted}}
				</span>
				{{translate 'Total'}}
			</p>
		</div>
	</div>

	<div class="order-history-summary-row-fluid">
		{{#if showReorderAllItemsButton}}
			<!-- REORDER ALL ITEMS -->
			<a href="/reorderItems?order_id={{model.internalid}}&order_number={{model.tranid}}" class="order-history-summary-button-reorder">
				{{translate 'Reorder All Items'}}
			</a>
		{{/if}}

		<!-- DOWNLOAD AS PDF -->
		<a href="{{pdfUrl}}" target="_blank" class="order-history-summary-button-download-pdf">
			{{translate 'Download PDF'}}
		</a>

		{{#if showRequestReturnButton}}
			<a data-permissions="transactions.tranRtnAuth.2" href="/returns/new/{{model.recordtype}}/{{model.internalid}}" class="order-history-summary-button-request-return">
				{{translate 'Request a Return'}}
			</a>
		{{/if}}

		{{#if showCancelButton}}
			<a class="order-history-summary-button-cancel-order" data-action="cancel">
				{{translate 'Cancel Purchase'}}
			</a>
		{{/if}}

		{{#if showViewInvoiceButton}}
			<a data-permissions="" href="/invoices/{{invoiceModel.internalid}}" data-id="{{invoiceModel.internalid}}" class="order-history-summary-button-view-invoice">
				{{translate 'View Invoice'}}
			</a>
		{{/if}}
	</div>
</div>