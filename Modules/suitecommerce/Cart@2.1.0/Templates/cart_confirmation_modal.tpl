{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="cart-confirmation-modal">
	<div class="cart-confirmation-modal-img">
		<img data-loader="false" src="{{resizeImage item._thumbnail.url 'main'}}" alt="{{item._thumbnail.altimagetext}}">
	</div>
	<div class="cart-confirmation-modal-details">
		<a href="{{item._url}}" class="cart-confirmation-modal-item-name">{{item._name}}</a>
		<div class="cart-confirmation-modal-price">
			<span data-view="Item.Price"></span>
		</div>
		<!-- SKU -->
		<div class="cart-confirmation-modal-sku">
			<span class="cart-confirmation-modal-sku-label">{{translate 'SKU: '}}</span> 
			<span class="cart-confirmation-modal-sku-value">{{itemPropSku}}</span>
		</div>
		<!-- Item Options -->
		<div class="cart-confirmation-modal-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>
		<!-- Quantity -->
		{{#if showQuantity}}
		<div class="cart-confirmation-modal-quantity">
			<span class="cart-confirmation-modal-quantity-label">{{translate 'Quantity: '}}</span>
			<span class="cart-confirmation-modal-quantity-value">{{line.quantity}}</span>
		</div>
		{{/if}}
		<div class="cart-confirmation-modal-actions">
			<div class="cart-confirmation-modal-view-cart">
				<a href="/cart" class="cart-confirmation-modal-view-cart-button" data-trigger="go-to-cart">{{translate 'View Cart &amp; Checkout'}}</a>
			</div>
			<div class="cart-confirmation-modal-continue-shopping">
				<button class="cart-confirmation-modal-continue-shopping-button" data-dismiss="modal">{{translate 'Continue Shopping'}}</button>
			</div>
		</div>
	</div>
</div>