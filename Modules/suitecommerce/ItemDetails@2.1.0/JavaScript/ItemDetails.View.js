/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ItemDetails
define(
	'ItemDetails.View'
,	[
		'Facets.Translator'
	,	'ItemDetails.Collection'

	,	'item_details.tpl'
	,	'quick_view.tpl'

	,	'Backbone.CollectionView'
	,	'ItemDetails.ImageGallery.View'
	,	'ItemViews.Price.View'
	,	'GlobalViews.StarRating.View'
	,	'ProductReviews.Center.View'
	,	'ItemViews.Option.View'
	,	'ItemViews.Stock.View'
	,	'ItemViews.RelatedItem.View'
	,	'ItemRelations.Correlated.View'
	,	'ItemRelations.Related.View'
	,	'SocialSharing.Flyout.View'
	,	'Profile.Model'
	,	'Tracker'

	,	'SC.Configuration'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'underscore'
	,	'jQuery'
	,	'RecentlyViewedItems.Collection'
	,	'LiveOrder.Model'

	,	'jquery.zoom'
	,	'jQuery.bxSlider'
	,	'jQuery.scPush'
	,	'jQuery.scSeeMoreLess'
	,	'jQuery.overflowing'
	]
,	function (
		FacetsTranslator
	,	ItemDetailsCollection

	,	item_details_tpl
	,	quick_view_tpl

	,	BackboneCollectionView
	,	ItemDetailsImageGalleryView
	,	ItemViewsPriceView
	,	GlobalViewsStarRatingView
	,	ProductReviewsCenterView
	,	ItemViewsOptionView
	,	ItemViewsStockView
	,	ItemViewsRelatedItemView
	,	ItemRelationsCorrelatedView
	,	ItemRelationsRelatedView
	,	SocialSharingFlyoutView
	,	ProfileModel
	,	Tracker

	,	Configuration
	,	Backbone
	,	BackboneCompositeView
	,	_
	,	jQuery
	,	RecentlyViewedItemsCollection
	,	LiveOrderModel
	)
{
	'use strict';

	var colapsibles_states = {};

	//@class ItemDetails.View Handles the PDP and quick view @extend Backbone.View
	return Backbone.View.extend({

		//@property {String} title
		title: ''

		//@property {String} page_header
	,	page_header: ''

		//@property {Function} template
	,	template: item_details_tpl

		//@property {String} modalClass
	,	modalClass: 'global-views-modal-large'

		//@property {Boolean} showModalPageHeader
	,	showModalPageHeader: false

		//@property {Object} attributes List of HTML attributes applied by Backbone into the $el
	,	attributes: {
			'id': 'product-detail'
		,	'class': 'view product-detail'
		}

		//TODO ALWAYS USE [data-action=""] WHEN ATTACHING EVENTS INTO THE DOM!
		//@property {Object} events
	,	events: {
			'blur [data-toggle="text-option"]': 'setOption'
		,	'click [data-toggle="set-option"]': 'setOption'
		,	'change [data-toggle="select-option"]': 'setOption'

		,	'keydown [data-toggle="text-option"]': 'tabNavigationFix'
		,	'focus [data-toggle="text-option"]': 'tabNavigationFix'

		,	'click [data-action="plus"]': 'addQuantity'
		,	'click [data-action="minus"]': 'subQuantity'

		,	'change [name="quantity"]': 'updateQuantity'
		,	'keypress [name="quantity"]': 'submitOnEnter'

		,	'click [data-type="add-to-cart"]': 'addToCart'

		,	'shown .collapse': 'storeColapsiblesState'
		,	'hidden .collapse': 'storeColapsiblesState'

		,	'click [data-action="show-more"]': 'showMore'
		}

		//@method initialize
		//@param {ItemDetails.View.Initialize.Parameters}
		//@return {Void}
	,	initialize: function (options)
		{
			this.application = options.application;
			this.reviews_enabled = SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled;

			BackboneCompositeView.add(this);
			Backbone.Validation.bind(this);

			if (!this.model)
			{
				throw new Error('A model is needed');
			}
		}

		// @method getBreadcrumbPages Returns the breadcrumb for the current page based on the current item
		// @return {Array<BreadcrumbPage>} breadcrumb pages
	,	getBreadcrumbPages: function ()
		{
			return this.model.get('_breadcrumb');
		}

		//@property {Object} childViews
	,	childViews: {
			'ItemDetails.ImageGallery': function ()
			{
				return new ItemDetailsImageGalleryView({images: this.model.get('_images', true)});
			}
		,	'Item.Price': function ()
			{
				return new ItemViewsPriceView({
					model: this.model
				,	origin: this.inModal ? 'PDPQUICK' : 'PDPFULL'
				});
			}
		,	'Global.StarRating': function ()
			{
				return new GlobalViewsStarRatingView({
					model: this.model
				,	showRatingCount: true
				});
			}
		,	'ProductReviews.Center': function ()
			{
				return new ProductReviewsCenterView({ item: this.model, application: this.application });
			}
		,	'ItemDetails.Options': function ()
			{
				var options_to_render = this.model.getPosibleOptions();

				_.each(options_to_render, function (option)
				{
					// If it's a matrix it checks for valid combinations
					if (option.isMatrixDimension)
					{
						var available = this.model.getValidOptionsFor(option.itemOptionId);
						_.each(option.values, function (value)
						{
							value.isAvailable = _.contains(available, value.label);
						});
					}
				}, this);

				return new BackboneCollectionView({
					collection: new Backbone.Collection(options_to_render)
				,	childView: ItemViewsOptionView
				,	viewsPerRow: 1
				,	childViewOptions: {
						item: this.model
					}
				});
			}
		,	'Item.Stock': function ()
			{
				return new ItemViewsStockView({model: this.model});
			}
		,	'Correlated.Items': function ()
			{
				return new ItemRelationsCorrelatedView({ itemsIds: this.model.get('internalid'), application: this.application });
			}
		,	'Related.Items': function ()
			{
				return new ItemRelationsRelatedView({ itemsIds: this.model.get('internalid'), application: this.application });
			}
		,	'SocialSharing.Flyout': function ()
			{
				return new SocialSharingFlyoutView();
			}
		}

		// @method storeColapsiblesState
		// Since this view is re-rendered every time you make a selection we need to keep the state of the collapsed parts for the next render
		// This method save the status (collapsed/expanded) of all elements with the class .collapse
	,	storeColapsiblesState: function ()
		{
			//TODO This should be a plugin or be located in some external part!
			this.storeColapsiblesStateCalled = true;

			this.$('.collapse').each(function (index, element)
			{
				colapsibles_states[SC.Utils.getFullPathForElement(element)] = jQuery(element).hasClass('in');
			});
		}

		// @method resetColapsiblesState
		// As we keep track of the state (See storeColapsiblesState method), we need to reset the value of the collapsable items onces we render the first time
	,	resetColapsiblesState: function ()
		{
			//TODO This should be a plugin or be located in some external part!
			var self = this;
			_.each(colapsibles_states, function (is_in, element_selector)
			{
				self.$(element_selector)[is_in ? 'addClass' : 'removeClass']('in').css('height', is_in ? 'auto' : '0');
			});
		}

		//@method updateQuantity Updates the quantity of the model
		//@param {jQuery.Event} e
		//@return {Void}
	,	updateQuantity: function (e)
		{
			var new_quantity = parseInt(jQuery(e.target).val(), 10)
			,	current_quantity = this.model.get('quantity')
			,	isOptimistic = this.application.getConfig('addToCartBehavior') === 'showCartConfirmationModal'
			,	min_quantity =  this.model.get('_minimumQuantity', true);

			if (new_quantity < this.model.get('_minimumQuantity', true))
			{
				if (require('LiveOrder.Model').loadCart().state() === 'resolved') // TODO: resolve error with dependency circular.
				{
					var itemCart = SC.Utils.findItemInCart(this.model, require('LiveOrder.Model').getInstance()) // TODO: resolve error with dependency circular.
					,	total = itemCart && itemCart.get('quantity') || 0;

					if ((total + new_quantity) < this.model.get('_minimumQuantity', true))
					{
						new_quantity = min_quantity;
					}
				}
			}

			jQuery(e.target).val(new_quantity);

			if (new_quantity !== current_quantity)
			{
				this.model.setOption('quantity', new_quantity);

				if (!this.$containerModal || !isOptimistic)
				{
					this.refreshInterface(e);
				}
			}

			if (this.$containerModal)
			{
				this.refreshInterface(e);

				// need to trigger an afterAppendView event here because, like in the PDP, we are really appending a new view for the new selected matrix child
				this.application.getLayout().trigger('afterAppendView', this);
			}
		}

		// @method addQuantity Increase the product's Quantity by 1
		// @param {jQuery.Event} e
		//@return {Void}
	,	addQuantity: function (e)
		{
			e.preventDefault();
			var input_quantity = this.$('[name="quantity"]')
			,	old_value = parseInt(input_quantity.val(), 10);

			input_quantity.val(old_value + 1);
			input_quantity.trigger('change');
		}

		// @method subQuantity Decreases the product's Quantity by 1
		// @param {jQuery.Event} e
	,	subQuantity: function (e)
		{
			e.preventDefault();

			var input_quantity = this.$('[name="quantity"]')
			,	old_value = parseInt(input_quantity.val(), 10);

			input_quantity.val(old_value-1);
			input_quantity.trigger('change');

		}

		// @method submitOnEnter Submit the form when user presses enter in the quantity input text
		// @param {jQuery.Event} e
		//@return {Void}
	,	submitOnEnter: function (e)
		{
			if (e.keyCode === 13)
			{
				e.preventDefault();
				e.stopPropagation();
				this.addToCart(e);
			}
		}

		// @method addToCart Updates the Cart to include the current model
		// also takes care of updating the cart if the current model is already in the cart
		// @param {jQuery.Event} e
		//@return {Void}
	,	addToCart: function (e)
		{
			e.preventDefault();

			// Updates the quantity of the model
			var quantity = this.$('[name="quantity"]').val();
			this.model.setOption('quantity', quantity);

			if (this.model.isValid(true) && this.model.isReadyForCart())
			{
				var self = this
				,	cart = LiveOrderModel.getInstance()
				,	layout = this.application.getLayout()
				,	cart_promise
				,	error_message = _('Sorry, there is a problem with this Item and can not be purchased at this time. Please check back later.').translate()
				,	isOptimistic = this.application.getConfig('addToCartBehavior') === 'showCartConfirmationModal';

				if (this.model.itemOptions && this.model.itemOptions.GIFTCERTRECIPIENTEMAIL)
				{
					if (!Backbone.Validation.patterns.email.test(this.model.itemOptions.GIFTCERTRECIPIENTEMAIL.label))
					{
						self.showError(_('Recipient email is invalid').translate());
						return;
					}
				}

				if (isOptimistic)
				{
					//Set the cart to use optimistic when using add to cart
					// TODO pass a param to the add to cart instead of using this hack!
					cart.optimistic = {
						item: this.model
					,	quantity: quantity
					};
				}

				// If the item is already in the cart
				if (this.model.cartItemId)
				{
					cart_promise = cart.updateItem(this.model.cartItemId, this.model).done(function ()
					{
						//If there is an item added into the cart
						if (cart.getLatestAddition())
						{
							if (self.$containerModal)
							{
								self.$containerModal.modal('hide');
							}

							if (layout.currentView instanceof require('Cart.Detailed.View'))
							{
								layout.currentView.showContent();
							}
						}
						else
						{
							self.showError(error_message);
						}
					});
				}
				else
				{
					cart_promise = cart.addItem(this.model).done(function ()
					{
						//If there is an item added into the cart
						if (cart.getLatestAddition())
						{
							if (!isOptimistic)
							{
								layout.showCartConfirmation();
							}
						}
						else
						{
							self.showError(error_message);
						}
					});

					if (isOptimistic)
					{
						cart.optimistic.promise = cart_promise;
						layout.showCartConfirmation();
					}
				}

				// Handle errors. Checks for rollback items.
				cart_promise.fail(function (jqXhr)
				{
					var error_details = null;
					try
					{
						var response = JSON.parse(jqXhr.responseText);
						error_details = response.errorDetails;
					}
					finally
					{
						if (error_details && error_details.status === 'LINE_ROLLBACK')
						{
							var new_line_id = error_details.newLineId;
							self.model.cartItemId = new_line_id;
						}

						self.showError(_('We couldn\'t process your item').translate());

						if (isOptimistic)
						{
							self.showErrorInModal(_('We couldn\'t process your item').translate());
						}
					}
				});

				// Disables the button while it's being saved then enables it back again
				if (e && e.target)
				{
					var $target = jQuery(e.target).attr('disabled', true);

					cart_promise.always(function ()
					{
						$target.attr('disabled', false);
					});
				}
			}
		}

		// @method refreshInterface
		// Computes and store the current state of the item and refresh the whole view, re-rendering the view at the end
		// This also updates the URL, but it does not generates a history point
		//@return {Void}
	,	refreshInterface: function ()
		{
			var self = this;

			var focused_element = this.$(':focus').get(0);

			this.focusedElement = focused_element ? SC.Utils.getFullPathForElement(focused_element) : null;

			if (!this.inModal)
			{
				Backbone.history.navigate(this.options.baseUrl + this.model.getQueryString(), {replace: true});
			}

			//TODO This should be a render, as the render aim to re-paint a view and the showContent aims to navigations
			self.showContent({dontScroll: true});
		}

		// @method showInModal overrides the default implementation to take care of showing the PDP in a modal by changing the template
		// This doesn't trigger the after events because those are triggered by showContent
		// @param {Object} options Any options valid to show content
		// @return {jQuery.Deferred}
	,	showInModal: function (options)
		{
			this.template = quick_view_tpl;

			return this.application.getLayout().showInModal(this, options);
		}

		// @method prepareViewToBeShown
		// Prepares the model and other internal properties before view.showContent
		// Prepares the view to be shown. Set its title, header and the items options are calculated
		//@return {Void}
	,	prepareViewToBeShown: function ()
		{
			// TODO Change this. This method is called by the itemDetails.router before call showContent of this view.
			// As each time an option change the view is re-painted by using showContent, we cannot add this code in the showContent code
			// the correct way to do this is call render for each re-paint.
			this.title = this.model.get('_pageTitle');
			this.page_header = this.model.get('_pageHeader');

			this.computeDetailsArea();
		}

		// @method computeDetailsArea
		// Process what you have configured in itemDetails as item details.
		// In the PDP extra information can be shown based on the itemDetails property in the Shopping.Configuration.
		// These are extra field extracted from the item model
		//@return {Void}
	,	computeDetailsArea: function ()
		{
			var self = this
			,	details = [];

			_.each(this.application.getConfig('itemDetails', []), function (item_details)
			{
				var content = '';

				if (item_details.contentFromKey)
				{
					content = self.model.get(item_details.contentFromKey);
				}

				if (jQuery.trim(content))
				{
					details.push({
						name: item_details.name
					,	isOpened: item_details.opened
					,	content: content
					,	itemprop: item_details.itemprop
					});
				}
			});

			this.details = details;
		}

		// @method getMetaKeywords
		// @return {String}
	,	getMetaKeywords: function ()
		{
			// searchkeywords is for alternative search keywords that customers might use to find this item using your Web store's internal search
			// they are not for the meta keywords
			// return this.model.get('_keywords');
			return this.getMetaTags().filter('[name="keywords"]').attr('content') || '';
		}

		// @method getMetaTags
		// @return {Array<HTMLElement>}
	,	getMetaTags: function ()
		{
			return jQuery('<head/>').html(
				jQuery.trim(
					this.model.get('_metaTags')
				)
			).children('meta');
		}

		// @method getMetaDescription
		// @return {String}
	,	getMetaDescription: function ()
		{
			return this.getMetaTags().filter('[name="description"]').attr('content') || '';
		}

		// @method tabNavigationFix
		// When you blur on an input field the whole page gets rendered,
		// so the function of hitting tab to navigate to the next input stops working
		// This solves that problem by storing a a ref to the current input
		// @param {jQuery.Event} e
		//@return {Void}
	,	tabNavigationFix: function (e)
		{
			var self = this;
			this.hideError();

			// We need this timeout because sometimes a view is rendered several times and we don't want to loose the tabNavigation
			if (!this.tabNavigationTimeout)
			{
				// If the user is hitting tab we set tabNavigation to true, for any other event we turn it off
				this.tabNavigation = e.type === 'keydown' && e.which === 9;
				this.tabNavigationUpsidedown = e.shiftKey;
				this.tabNavigationCurrent = SC.Utils.getFullPathForElement(e.target);
				if (this.tabNavigation)
				{
					this.tabNavigationTimeout = setTimeout(function ()
					{
						self.tabNavigationTimeout = null;
						this.tabNavigation = false;
					}, 5);
				}
			}
		}

		//@method showContent
		//@param {Object<dontScroll:Boolean>} options
		//@return {Void}
	,	showContent: function (options)
		{
			var self = this;

			// Once the showContent has been called, this make sure that the state is preserved
			// REVIEW: the following code might change, showContent should receive an options parameter
			this.application.getLayout().showContent(this, options && options.dontScroll).done(function ()
			{
				Tracker.getInstance().trackProductView(self.model);

				self.afterAppend();
				self.initPlugins();

				self.$('[data-type="add-to-cart"]').attr('disabled', true);
				LiveOrderModel.loadCart().done(function()
				{
					if (self.model.isReadyForCart())
					{
						self.$('[data-type="add-to-cart"]').attr('disabled', false);
					}
				});
			});
		}

		//@method afterAppend
		//@return {Void}
	,	afterAppend: function ()
		{
			var overflow = false;
			this.focusedElement && this.$(this.focusedElement).focus();

			if (this.tabNavigation)
			{
				var current_index = this.$(':input').index(this.$(this.tabNavigationCurrent).get(0))
				,	next_index = this.tabNavigationUpsidedown ? current_index - 1 : current_index + 1;

				this.$(':input:eq('+ next_index +')').focus();
			}

			this.storeColapsiblesStateCalled ? this.resetColapsiblesState() : this.storeColapsiblesState();

			RecentlyViewedItemsCollection.getInstance().addHistoryItem(this.model);

			if (this.inModal)
			{
				var $link_to_fix = this.$el.find('[data-name="view-full-details"]');
				$link_to_fix.mousedown();
				$link_to_fix.attr('href', $link_to_fix.attr('href') + this.model.getQueryString());
			}

			this.$('#item-details-content-container-0').overflowing('#item-details-info-tab-0', function ()
			{
				overflow = true;
			});

			if(!overflow)
			{
				this.$('.item-details-more').hide();
			}
		}

		// @method initPlugins
		//@return {Void}
	,	initPlugins: function ()
		{
			this.$el.find('[data-action="pushable"]').scPush();
			this.$el.find('[data-action="tab-content"]').scSeeMoreLess();
		}

		// @method setOption When a selection is change, this computes the state of the item to then refresh the interface.
		// @param {jQuery.Event} e
		// @return {Void}
	,	setOption: function (e)
		{
			var self = this
			,	$target = jQuery(e.currentTarget)
			,	value = $target.val() || $target.data('value') || null
			,	cart_option_id = $target.closest('[data-type="option"]').data('cart-option-id');

			// prevent from going away
			e.preventDefault();

			// if option is selected, remove the value
			if ($target.data('active'))
			{
				value = null;
			}

			// it will fail if the option is invalid
			try
			{
				this.model.setOption(cart_option_id, value);
			}
			catch (error)
			{
				// Clears all matrix options
				_.each(this.model.getPosibleOptions(), function (option)
				{
					option.isMatrixDimension && self.model.setOption(option.cartOptionId, null);
				});

				// Sets the value once again
				this.model.setOption(cart_option_id, value);
			}

 			this.refreshInterface(e);

			// Need to trigger an afterAppendView event here because, like in the PDP, we are really appending a new view for the new selected matrix child
			if (this.$containerModal)
			{
				this.application.getLayout().trigger('afterAppendView', this);
			}
		}

		//@method showMore Toggle the content of an options, and change the label Show Less and Show More by adding a class
		//@return {Void}
	,	showMore: function ()
		{
			this.$el.find('.item-details-tab-content').toggleClass('show');
		}

		//@method getContext
		//@return {ItemDetails.View.Context}
	,	getContext: function ()
		{
			var model = this.model
			,	thumbnail = model.get('_images', true)[0] || model.get('_thumbnail')
			,	selected_options = model.getSelectedOptions()

			,	quantity = model.get('quantity')
			,	min_quantity = model.get('_minimumQuantity', true)
			,	min_disabled = false;


			if (model.get('quantity') <= model.get('_minimumQuantity', true))
			{
				// TODO: resolve error with dependency circular.
				if (require('LiveOrder.Model').loadCart().state() === 'resolved')
				{
					// TODO: resolve error with dependency circular.
					var itemCart = SC.Utils.findItemInCart(model, require('LiveOrder.Model').getInstance())
					,	total = itemCart && itemCart.get('quantity') || 0;

					if ((total + model.get('quantity')) <= model.get('_minimumQuantity', true))
					{
						min_disabled = true;
					}
				}
				else
				{
					min_disabled = false;
				}
			}

			//@class ItemDetails.View.Context
			return {
				//@property {ItemDetails.Model} model
				model: model
				//@property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
				//@property {Array<ItemDetailsField>} details
			,	details: this.details
				//@property {Boolean} showDetails
			,	showDetails: this.details.length > 0
				//@property {Boolean} isItemProperlyConfigured
			,	isItemProperlyConfigured: model.isProperlyConfigured()
				//@property {Boolean} showQuantity
			,	showQuantity: model.get('_itemType') === 'GiftCert'
				//@property {Boolean} showRequiredReference
			,	showRequiredReference: model.get('_itemType') === 'GiftCert'
				//@property {Boolean} showSelectOptionifOutOfStock
			,	showSelectOptionMessage : !model.isSelectionComplete() && model.get('_itemType') !== 'GiftCert'
				//@property {Boolean} showMinimumQuantity
			,	showMinimumQuantity: !! min_quantity && min_quantity > 1
				//@property {Boolean} isReadyForCart
			,	isReadyForCart: model.isReadyForCart()
				//@property {Boolean} showReviews
			,	showReviews: this.reviews_enabled
				//@property {String} itemPropSku
			,	itemPropSku: '<span itemprop="sku">' + model.get('_sku', true) + '</span>'
				//@property {String} item_url
			,	item_url : model.get('_url') + model.getQueryString()
				//@property {String} thumbnailUrl
			,	thumbnailUrl : this.options.application.resizeImage(thumbnail.url, 'main')
				//@property {String} thumbnailAlt
			,	thumbnailAlt : thumbnail.altimagetext
				//@property {String} sku
			,	sku : model.get('_sku', true)
				//@property {Boolean} isMinQuantityOne
			,	isMinQuantityOne : model.get('_minimumQuantity', true) === 1
				//@property {Number} minQuantity
			,	minQuantity : min_quantity
				//@property {Number} quantity
			,	quantity : quantity
				//@property {Boolean} isMinusButtonDisabled
			,	isMinusButtonDisabled: min_disabled || model.get('quantity') === 1
				//@property {Boolean} hasCartItem
			,	hasCartItem : !!model.cartItemId
				//@property {Array} selectedOptions
			,	selectedOptions: selected_options
				//@property {Boolean} hasSelectedOptions
			,	hasSelectedOptions: !!selected_options.length
				//@property {Boolean} hasAvailableOptions
			,	hasAvailableOptions: !!model.getPosibleOptions().length
				//@property {Boolean} isReadyForWishList
			,	isReadyForWishList: model.isReadyForWishList()

			};
		}
	});
});

//@class ItemDetails.View.Initialize.Parameters
//@property {ItemDetails.Model} model
//@property {String} baseUrl
//@property {ApplicationSkeleton} application
