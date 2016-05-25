{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-cart-summary-container">
		<h3 class="order-wizard-cart-summary-title">
			{{translate 'Order Summary'}}
		</h3>

	<div class="order-wizard-cart-summary-body">
		{{#if showEditCartMST}}
		<div class="order-wizard-cart-summary-edit-cart-label-mst">
			<a href="#" class="order-wizard-cart-summary-edit-cart-link" data-touchpoint="viewcart">
				{{translate 'Edit Cart'}}
			</a>
		</div>
		{{/if}}
		<div class="order-wizard-cart-summary-subtotal">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-grid-right" >
					{{model.summary.subtotal_formatted}}
				</span>
				<span class="order-wizard-cart-summary-subtotal-label">
					{{#if itemCountGreaterThan1}}
						{{translate 'Subtotal <span class="order-wizard-cart-summary-item-quantity-subtotal" data-type="cart-summary-subtotal-count">$(0) items</span>' itemCount}}
					{{else}}
						{{translate 'Subtotal <span class="order-wizard-cart-summary-item-quantity-subtotal" data-type="cart-summary-subtotal-count">$(0) item</span>' itemCount}}
					{{/if}}
				</span>
			</p>
		</div>


		{{#if showPromocode}}
			<div class="order-wizard-cart-summary-promocode-applied">
				<p class="order-wizard-cart-summary-promo-code-applied">
					{{translate 'Promo Code Applied'}} {{model.summary.discountrate_formatted}}
				</p>
				<div class="order-wizard-cart-summary-grid">
					<div class="order-wizard-cart-summary-promocode-text-success">
						<span class="order-wizard-cart-summary-promocode-code">#{{model.promocode.code}} - {{translate 'Instant Rebate'}}</span>
					{{#if showRemovePromocodeButton}}
						<a href="#" data-action="remove-promocode">
							<span class="order-wizard-cart-summary-remove-container">
								<i class="order-wizard-cart-summary-remove-icon"></i>
							</span>
						</a>
					{{/if}}
			</div>
				</div>
			</div>
		{{/if}}

		{{#if showDiscount}}
			<div class="order-wizard-cart-summary-discount-applied">
				<p class="order-wizard-cart-summary-grid-float">
					<span class="order-wizard-cart-summary-discount-total">
						{{model.summary.discounttotal_formatted}}
					</span>
					{{translate 'Discount Total'}}
				</p>
			</div>
		{{/if}}

		{{#if showGiftCertificates}}
			<div class="order-wizard-cart-summary-giftcertificate-applied">
				<p class="order-wizard-cart-summary-gift-certificate">{{translate 'Gift Certificates Applied ($(0))' giftCertificates.length}}</p>
				<div data-view="GiftCertificates"></div>
			</div>
		{{/if}}


		<div class="order-wizard-cart-summary-shipping-cost-applied">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-shipping-cost-formatted">
					{{model.summary.shippingcost_formatted}}
				</span>
				{{translate 'Shipping'}}
			</p>

			{{#if showHandlingCost}}
				<p class="order-wizard-cart-summary-grid-float">
					<span class="order-wizard-cart-summary-handling-cost-formatted">
						{{model.summary.handlingcost_formatted}}
					</span>
					{{translate 'Handling'}}
				</p>
			{{/if}}
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-tax-total-formatted" >
					{{model.summary.taxtotal_formatted}}
				</span>
				{{translate 'Tax'}}
			</p>
		</div>

		<div class="order-wizard-cart-summary-total">
			<p class="order-wizard-cart-summary-grid-float">
				<span class="order-wizard-cart-summary-grid-right" >
					{{model.summary.total_formatted}}
				</span>
				{{translate 'Total'}}
			</p>
		</div>
		{{#if showWarningMessage}}
		<div class="order-wizard-cart-summary-warning" role="alert">
			<div>{{warningMessage}}</div>
</div>
	{{/if}}
	</div>
		</div>
