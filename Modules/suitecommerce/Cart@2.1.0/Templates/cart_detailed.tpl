{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="cart-detailed">
{{#if showLines}}
	<div class="cart-detailed-view-header">
		<header class="cart-detailed-header">
			<h1 class="cart-detailed-title">
				{{pageHeader}}
				<small class="cart-detailed-title-details-count">
					{{productsAndItemsCount}}
				</small>
			</h1>
		</header>
	</div>
	<div class="cart-detailed-body">
		<section class="cart-detailed-left">
			<div class="cart-detailed-proceed-to-checkout-container">
				<a class="cart-detailed-proceed-to-checkout" data-action="sticky" href="#" data-touchpoint="checkout" data-hashtag="#">
						{{translate 'Proceed to Checkout'}}
				</a>
			</div>
			<div data-confirm-message class="cart-detailed-confirm-message"></div>

			<table class="cart-detailed-item-view-cell-actionable-table cart-detailed-table-row-with-border">
				<tbody data-view="Item.ListNavigable">
				</tbody>
			</table>

		</section>
		<section class="cart-detailed-right">
			<div data-view="Cart.Summary"></div>
		</section>
	</div>
	<div class="cart-detailed-footer">
		<div data-type="saved-for-later-placeholder" class="cart-detailed-savedforlater">
		</div>

		<div data-view="RecentlyViewed.Items" class="cart-detailed-recently-viewed"></div>
		<div data-view="Related.Items" class="cart-detailed-related"></div>
		<div data-view="Correlated.Items" class="cart-detailed-correlated"></div>
	</div>
{{else}}
	<section class="cart-detailed-body-empty">
		<h2 class="cart-detailed-body-empty-title">{{translate 'Your Shopping Cart is empty'}}</h2>
		<p class="cart-detailed-body-empty-info">
			{{translate 'Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>' }}
		</p>
		<div data-type="saved-for-later-placeholder" class="cart-detailed-row-fluid"></div>
	</section>
{{/if}}
</div>