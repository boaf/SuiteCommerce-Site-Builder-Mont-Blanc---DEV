/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Detailed.View'
,	[	'ErrorManagement'
	,	'Backbone.CompositeView'
	,	'Cart.Summary.View'
	,	'GlobalViews.Message.View'
	,	'Backbone.CollectionView'
	,	'ItemViews.Cell.Actionable.View'
	,	'ItemViews.RelatedItem.View'
	,	'RecentlyViewedItems.View'
	,	'ItemRelations.Related.View'
	,	'ItemRelations.Correlated.View'
	,	'Cart.Item.Summary.View'
	,	'Cart.Item.Actions.View'
	,	'SC.Configuration'
	,	'Backbone.FormView'

	,	'cart_detailed.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	,	'Utils'

	,	'jQuery.scStickyButton'
	]
,	function (
		ErrorManagement
	,	BackboneCompositeView
	,	CartSummaryView
	,	GlobalViewsMessageView
	,	BackboneCollectionView
	,	ItemViewsActionableView
	,	ItemViewsRelatedItemView
	,	RecentlyViewedItemsView
	,	ItemRelationsRelatedView
	,	ItemRelationsCorrelatedView
	,	CartItemSummaryView
	,	CartItemActionsView
	,	Configuration
	,	BackboneFormView

	,	cart_detailed_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	var colapsibles_states = {};

	// @class Cart.Detailed.View This is the Shopping Cart view @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_detailed_tpl

		// @property {String} title
	,	title: _('Shopping Cart').translate()

		// @property {String} page_header
	,	page_header: _('Shopping Cart').translate()

		// @property {Object} attributes
	,	attributes: {
			'id': 'shopping-cart'
		}
		
	,	bindings: {
			'[name="zip"]': 'zip'
		}

		// @property {Object} events
	,	events: {
			'change [name="quantity"]': 'debouncedUpdateItemQuantity'
		,	'keypress [name="quantity"]': 'debouncedUpdateItemQuantity'
		,	'submit [data-action="update-quantity"]': 'updateItemQuantityFormSubmit'

		,	'click [data-action="remove-item"]': 'removeItem'

		,	'submit form[data-action="apply-promocode"]': 'applyPromocode'
		,	'click [data-action="remove-promocode"]': 'removePromocode'

		,	'submit form[data-action="estimate-tax-ship"]': 'estimateTaxShip'
		,	'click [data-action="remove-shipping-address"]': 'removeShippingAddress'
		,	'change [data-action="estimate-tax-ship-country"]': 'changeCountry'
		}

		// @method initialize
	,	initialize: function (options)
		{
			this.application = options.application;
			BackboneCompositeView.add(this);
			BackboneFormView.add(this);
			this.showEstimated = false;
		}

		// @method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {href: '/cart', text: _('Shopping Cart').translate()};
		}

	,	initSlider: function()
		{
			var element = this.$el.find('[data-type="carousel-items"]');
			this.$slider = _.initBxSlider(element, Configuration.bxSliderDefaults);
		}

		// @method initPlugins
		// initialize plugins
	,	initPlugins: function()
		{
			if(this.application.getConfig('siteSettings.sitetype') === 'ADVANCED')
			{
				this.$el.find('[data-action="sticky"]').scStickyButton();
			}
		}

		// @method showContent
		// calls the layout's default show content method
	,	showContent: function ()
		{
			var self = this;
			return this.application.getLayout().showContent(this, true).done(function()
			{
				self.initPlugins();
			});
		}

		// @method hideError
	,	hideError: function (selector)
		{
			var el = (selector)? selector.find('[data-type="alert-placeholder"]') : this.$('[data-type="alert-placeholder"]');
			el.empty();
		}

		// @method showError
	,	showError: function (message, line, error_details)
		{
			var placeholder;

			this.hideError();

			if (line)
			{
				// if we detect its a rolled back item, (this i an item that was deleted
				// but the new options were not valid and was added back to it original state)
				// We will move all the references to the new line id
				if (error_details && error_details.status === 'LINE_ROLLBACK')
				{
					var new_line_id = error_details.newLineId;

					line.attr('id', new_line_id);

					line.find('[name="internalid"]').attr({
						id: 'update-internalid-' + new_line_id
					,	value: new_line_id
					});
				}

				placeholder = line.find('[data-type="alert-placeholder"]');
				this.hideError(line);
			}
			else
			{
				placeholder = this.$('[data-type="alert-placeholder"]');
				this.hideError();
			}

			// Finds or create the placeholder for the error message
			if (!placeholder.length)
			{
				placeholder = jQuery('<div/>', {'data-type': 'alert-placeholder'});
				this.$el.prepend(placeholder);
			}

			var global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'error'
				,	closable: true
			});

			// Renders the error message and into the placeholder
			placeholder.append(global_view_message.render().$el.html());

			// Re Enables all posible disableded buttons of the line or the entire view
			if (line)
			{
				line.find(':disabled').attr('disabled', false);
			}
			else
			{
				this.$(':disabled').attr('disabled', false);
			}
		}

		// @method validInputValue
		// Check if the input[type="number"] has empty string or NaN value
		// input.val() == '' && validInput == false: NaN
		// input.val() == '' && validInput == true: empty string
	,	validInputValue: function(input)
		{
			// if html5 validation says it's bad: it's bad
			if ((input.validity) && (!input.validity.valid))
			{
				return false;
			}

			// Fallback to browsers that don't yet support html5 input validation
			return !isNaN(input.value);
		}

		// @method updateItemQuantity
		// Finds the item in the cart model, updates its quantity and saves the cart model
	,	updateItemQuantity:  function(e)
		{
			var self = this
			,	$line = null
			,	$form = jQuery(e.target).closest('form')
			,	options = $form.serializeObject()
			,	internalid = options.internalid
			,	line = this.model.get('lines').get(internalid)
			,	$input = $form.find('[name="quantity"]')
			,	validInput = this.validInputValue($input[0]);


			if (!line || this.isRemoving)
			{
				return;
			}

			if (!validInput || options.quantity)
			{
				var	new_quantity = parseInt(options.quantity, 10)
				,	item = line.get('item')
				,	min_quantity = item ? item.get('_minimumQuantity', true) : line.get('minimumquantity')
				,	current_quantity = parseInt(line.get('quantity'), 10);

				
				new_quantity = (new_quantity >= min_quantity) ? new_quantity : current_quantity;
				$input.val(new_quantity);
				this.storeColapsiblesState();

				if (new_quantity !==  current_quantity)
				{

					$line = this.$('#' + internalid);
					$input.val(new_quantity).prop('disabled', true);
					line.set('quantity', new_quantity);

					var invalid = line.validate();

					if (!invalid)
					{
						var update_promise = this.model.updateLine(line);

						this.disableElementsOnPromise(update_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');

						update_promise.done(function ()
						{
							self.showContent().done(function (view)
							{
								view.resetColapsiblesState();
							});
						}).fail(function (jqXhr)
						{
							jqXhr.preventDefault = true;
							var result = JSON.parse(jqXhr.responseText);

							self.showError(result.errorMessage, $line, result.errorDetails);
							line.set('quantity', current_quantity);
						}).always(function ()
						{
							$input.prop('disabled', false);
						});
					}
					else
					{
						var placeholder = this.$('#' + internalid + ' [data-type="alert-placeholder"]');
						placeholder.empty();

						_.each(invalid, function(value)
						{
							var global_view_message = new GlobalViewsMessageView({
									message: value
								,	type: 'error'
								,	closable: true
							});

							placeholder.append(global_view_message.render().$el.html());
						});

						$input.prop('disabled', false);
						line.set('quantity', current_quantity);
					}
				}
			}
		}

	,	debouncedUpdateItemQuantity: _.debounce(function(e)
		{
			this.updateItemQuantity(e);
		}, 1000)

		// @method updateItemQuantityFormSubmit
	,	updateItemQuantityFormSubmit: function (e)
		{
			e.preventDefault();
			this.updateItemQuantity(e);
		}

		// @method removeItem
		// handles the click event of the remove button
		// removes the item from the cart model and saves it.
	,	removeItem: function (e)
		{
			this.storeColapsiblesState();

			var self = this
			,	product = this.model.get('lines').get(jQuery(e.target).data('internalid'))
			,	remove_promise = this.model.removeLine(product)
			,	internalid = product.get('internalid');

			this.isRemoving = true;

			this.disableElementsOnPromise(remove_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');

			remove_promise
				.done(function ()
				{
					self.showContent().done(function (view)
					{
						view.resetColapsiblesState();
					});
				})
				.always(function ()
				{
					self.isRemoving = false;
				});

			return remove_promise;
		}

		// @method validateGiftCertificate validates the passed gift cert item and return false and render an error message if invalid.
	,	validateGiftCertificate: function (item)
		{
			if (item.itemOptions && item.itemOptions.GIFTCERTRECIPIENTEMAIL)
			{
				if (!Backbone.Validation.patterns.email.test(item.itemOptions.GIFTCERTRECIPIENTEMAIL.label))
				{
					this.render(); //for unchecking the just checked checkbox
					this.showError(_('Recipient email is invalid').translate());
					return false;
				}
			}
			return true;
		}

	,	renderPromcodeError: function (message, target)
		{
			var global_view_message = new GlobalViewsMessageView({
				message: message
			,	type: 'error'
			,	closable: true
			});
			
			this.$('[data-type=promocode-error-placeholder]').html(global_view_message.render().$el.html());
			
			target.find('input[name=promocode]').val('').focus();
		}

		// @method applyPromocode
		// Handles the submit of the apply promo code form
	,	applyPromocode: function (e)
		{
			e.preventDefault();			

			this.$('[data-type=promocode-error-placeholder]').empty();
			
			var self = this
			,	$target = jQuery(e.target)
			,	options = $target.serializeObject();		

			if (!options.promocode)
			{
				this.renderPromcodeError(_('Promo Code is required').translate(), $target);

				return;
			}			

			// disable inputs and buttons
			$target.find('input, button').prop('disabled', true);

			var promise = this.saveForm(e, null, {
				promocode: {
					code: options.promocode
				}});

			if (promise)
			{
				promise.fail(function (jqXhr)
				{
					self.model.unset('promocode');
					jqXhr.preventDefault = true;
					
					var message = ErrorManagement.parseErrorMessage(jqXhr, self.options.application.getLayout().errorMessageKeys);
					
					self.renderPromcodeError(message, $target);

					// enable inputs and buttons
					$target.find('input, button').prop('disabled', false);
				}).done(function ()
				{
					self.showContent();
				});
			}
		}

		// @method removePromocode
		// Handles the remove promocode button
	,	removePromocode: function (e)
		{
			e.preventDefault();

			var self = this;

			this.model.save({promocode: null}).done(function ()
			{
				self.showContent();
			});
		}

		// @method estimateTaxShip
		// Sets a fake address with country and zip code based on the options.
	,	estimateTaxShip: function (e)
		{
			var options = jQuery(e.target).serializeObject()
			,	address_internalid = options.zip + '-' + options.country + '-null';

			e.preventDefault();

			this.model.get('addresses').push({
				internalid: address_internalid
			,	zip: options.zip
			,	country: options.country
			});

			this.model.set('shipaddress', address_internalid);

			var promise = this.saveForm(e);

			if (promise)
			{
				this.swapEstimationStatus();
				promise.done(jQuery.proxy(this, 'showContent'));
			}

		}

		// @method changeEstimationStatus
	,	swapEstimationStatus: function ()
		{
			this.showEstimated = !this.showEstimated;
		}

		// @method removeShippingAddress
		// sets a fake null address so it gets removed by the backend
	,	removeShippingAddress: function (e)
		{
			e.preventDefault();

			this.swapEstimationStatus();

			var self = this;

			this.model.save({
				shipmethod: null
			,	shipaddress: null
			}).done(function ()
			{
				self.showContent();
			});
		}

		// @method changeCountry
	,	changeCountry: function (e)
		{
			e.preventDefault();
			this.storeColapsiblesState();
			var options = jQuery(e.target).serializeObject()
			,	AddressModel = this.model.get('addresses').model;

			this.model.get('addresses').add(new AddressModel({ country: options.country, internalid: options.country }));
			this.model.set({ shipaddress: options.country });

			this.showContent().done(function (view)
			{
				view.resetColapsiblesState();
			});

		}

		// @method resetColapsiblesState
		// @return {Void}
	,	resetColapsiblesState: function ()
		{
			var self = this;
			_.each(colapsibles_states, function (is_in, element_selector)
			{
				self.$(element_selector)[ is_in ? 'addClass' : 'removeClass' ]('in').css('height',  is_in ? 'auto' : '0');
			});
		}

		// @method storeColapsiblesState
		// @return {Void}
	,	storeColapsiblesState: function ()
		{
			this.storeColapsiblesStateCalled = true;
			this.$('.collapse').each(function (index, element)
			{
				colapsibles_states[SC.Utils.getFullPathForElement(element)] = jQuery(element).hasClass('in');
			});
		}

		// @property {ChildViews} childViews
	,	childViews: {
				'Cart.Summary': function ()
				{
					return new CartSummaryView({model: this.model, showEstimated: this.showEstimated});
				}
			,	'Item.ListNavigable': function ()
				{
					return new BackboneCollectionView({
							collection: this.model.get('lines')
						,	viewsPerRow: 1
						,	childView: ItemViewsActionableView
						,	childViewOptions: {
								navigable: true
							,	useLinePrice: true
							,	application: this.application
							,	SummaryView: CartItemSummaryView
							,	ActionsView: CartItemActionsView							
							,	showAlert: false
							}
					});
				}
			,	'RecentlyViewed.Items' : function ()
				{
					return new RecentlyViewedItemsView({ application: this.application });
				}
			,	'Correlated.Items': function ()
				{
					return new ItemRelationsCorrelatedView({ itemsIds: this.model.getItemsIds(), application: this.application });
				}
			,	'Related.Items': function ()
				{
					return new ItemRelationsRelatedView({ itemsIds: this.model.getItemsIds(), application: this.application });
				}
		}

		// @method getContext @return {Cart.Detailed.View.Context}
	,	getContext: function ()
		{
			var lines = this.model.get('lines')
			,	product_count = lines.length
			,	item_count = _.reduce(lines.models, function(memo, line){ return memo + line.get('quantity'); }, 0)
			,	product_and_items_count = '';

			if (product_count === 1)
			{
				if (item_count === 1)
				{
					product_and_items_count =  _('1 Product, 1 Item').translate();
				}
				else
				{
					product_and_items_count = _('1 Product, $(0) Items').translate(item_count);
				}
			}
			else
			{
				if (item_count === 1)
				{
					product_and_items_count = _('$(0) Products, 1 Item').translate(product_count);
				}
				else
				{
					product_and_items_count = _('$(0) Products, $(1) Items').translate(product_count, item_count);
				}
			}

			// @class Cart.Detailed.View.Context
			return {

					//@property {Boolean} showLines
					showLines: !!(lines && lines.length)
					//@property {Orderline.Collection} lines
				,	lines: lines
					//@property {String} productsAndItemsCount
				,	productsAndItemsCount: product_and_items_count
					//@property {Number} productCount
				,	productCount: product_count
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {String} pageHeader
				,	pageHeader: this.page_header
			};
			// @class Cart.Detailed.View
		}
	});
});
