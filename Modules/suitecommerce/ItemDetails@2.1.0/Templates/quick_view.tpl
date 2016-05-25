{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="quick-view-confirmation-modal">
	<div class="quick-view-confirmation-modal-img">
		<div data-view="ItemDetails.ImageGallery"></div>
	</div>
	<div class="quick-view-confirmation-modal-details">

		<h1 class="quick-view-confirmation-modal-item-name" itemprop="name">{{model._pageHeader}}</h1>

		<a class="quick-view-confirmation-modal-full-details" data-touchpoint="home" data-name="view-full-details" data-hashtag="#{{item_url}}" href="{{item_url}}">
			{{translate 'View full details'}}
		</a>

		<div class="quick-view-confirmation-modal-price">
			<div data-view="Item.Price"></div>
		</div>

		<!-- SKU -->
		<div class="quick-view-confirmation-modal-sku">
			<span class="quick-view-confirmation-modal-sku-label">{{translate 'SKU: '}}</span> 
			<span class="quick-view-confirmation-modal-sku-value">{{sku}}</span>
		</div>

		{{#if isItemProperlyConfigured}}
		<div class="quick-view-confirmation-modal-options">

			{{!--
			Render a single option placeholder:
			===================================
			Any HTML element that matches [data-type=option], if it's rendered by ItemDetails.View
			will be populated by the render of a single macro for a single option, especified by the attributes:
				data-cart-option-id: the id of the cart opion
				data-macro: the macro you want this option to be rendered with, if omited the default for the option will be used

			<div
				class="quick-view-options-container"
				data-type="option"
				data-cart-option-id="cart_option_id"
				data-macro="macroName">
			</div>
			Render all options placeholder:
			===============================
			Any HTML element that matches [data-type=all-options], if it's rendered by ItemDetails.View
			will be populated with the result of the execution of all the options with the macros,
			either the default one or the one configured in the itemOptions array.
			Use the data-exclude-options to select the options you dont want to be rendered here,
			this is a coma separated list, for instace: cart_option_id1, cart_option_id2
			--}}

			<div data-view="ItemDetails.Options"></div>
		</div>

			{{#if isPriceEnabled}}

		<div class="quick-view-confirmation-modal-quantity">
			<form action="#" class="quick-view-add-to-cart-form" data-validation="control-group">
				{{#if showQuantity}}
					<input type="hidden" name="quantity" id="quantity" value="1">
				{{else}}
					<div class="quick-view-options-quantity" data-validation="control">
						<label for="quantity" class="quick-view-options-quantity-title">
						{{translate 'Quantity'}}
						</label>

						<button class="quick-view-button-quantity-remove" data-action="minus">-</button>
						<input type="number" name="quantity" id="quantity" class="quick-view-quantity-value" value="{{model.quantity}}" min="1">
						<button class="quick-view-button-quantity-add" data-action="plus">+</button>

						{{#unless isMinQuantityOne}}
							<small class="quick-view-quantity-help">
								{{translate '(Minimum of $(0) required)' minQuantity}}
							</small>
						{{/unless}}
					</div>
				{{/if}}
				<div>
					<div data-view="Item.Stock"></div>
				</div>

				{{#unless isReadyForCart}}
					{{#if showSelectOptionMessage}}
						<p class="quick-view-add-to-cart-help">
							<i class="quick-view-add-to-cart-help-icon"></i>
							<span class="quick-view-add-to-cart-help-text">{{translate 'Please select options before adding to cart'}}</span>
						</p>
					{{/if}}
				{{/unless}}

				<div class="quick-view-confirmation-modal-actions">
					<div class="quick-view-confirmation-modal-add-to-cart">
						<button data-type="add-to-cart" class="quick-view-confirmation-modal-view-cart-button"{{#unless isReadyForCart}}disabled{{/unless}}>
							{{#if hasCartItem}}{{translate 'Update'}}{{else}}{{translate 'Add to Cart'}}{{/if}}
						</button>
					</div>
					<div class="quick-view-confirmation-modal-add-to-product-list">
						<div data-type="product-lists-control" {{#unless isReadyForWishList}} data-disabledbutton="true"{{/unless}}></div>
					</div>
				</div>
			</form>
		</div>
			{{/if}}

		<div data-type="alert-placeholder"></div>

		{{else}}
			<div class="quick-view-message-warning">
				{{translate '<b>Warning</b>: This item is not properly configured, please contact your administrator.'}}
			</div>
		{{/if}}
	</div>
</div>
