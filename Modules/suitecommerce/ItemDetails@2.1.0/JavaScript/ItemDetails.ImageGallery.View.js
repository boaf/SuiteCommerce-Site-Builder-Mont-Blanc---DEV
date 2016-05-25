/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ItemDetails
define(
	'ItemDetails.ImageGallery.View'
,	[
		'SC.Configuration'
	,	'Utilities.ResizeImage'
	,	'SocialSharing.Flyout.Hover.View'

	,	'item_details_image_gallery.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'jQuery'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	resizeImage
	,	SocialSharingFlyoutHoverView

	,	item_details_image_gallery_tpl

	,	Backbone
	,	BackboneCompositeView
	,	jQuery
	,	_
	,	Utils
	)
{
	'use strict';

	var previous_position = 0
	,	previous_images = [];

	//@class ItemDetails.ImageGallery.View @extends Backbone.View
	return Backbone.View.extend({

		template: item_details_image_gallery_tpl

	,	initialize: function()
		{
			BackboneCompositeView.add(this);

			var self = this;

			this.on('afterViewRender', function()
			{
				self.initSlider();
				self.initZoom();
			});
		}

		// @method destroy @returns {Void}
	,	destroy: function ()
		{
			if (this.$slider)
			{
				previous_position = this.$slider.getCurrentSlide();
			}
			previous_images = this.options.images;
			this._destroy();
		}

		// @method hasSameImages @returns {Boolean}
	,	hasSameImages: function ()
		{
			return this.options.images.length === previous_images.length && _.difference(this.options.images, previous_images).length === 0;
		}

		// @method initSlider
	,	initSlider: function ()
		{
			if (this.options.images.length > 1)
			{
				this.$slider = this.$('[data-slider]');
				_.initBxSlider(this.$slider, {
					buildPager: jQuery.proxy(this.buildSliderPager, this)
				,	startSlide: this.hasSameImages() ? previous_position : 0
				,	adaptiveHeight: true
				,	touchEnabled: true
				,	nextText: '<a class="item-details-gallery-next-icon"></a>'
				,	prevText: '<a class="item-details-gallery-prev-icon"></a>'
				, 	controls: true
				});
			}
		}

		//@property {Object} childViews
	,	childViews: {
			'SocialSharing.Flyout.Hover': function()
			{
				return new SocialSharingFlyoutHoverView();
			}
		}

		// @method initZoom
	,	initZoom: function ()
		{
			if (!SC.ENVIRONMENT.isTouchEnabled)
			{
				var images = this.options.images;

				this.$el.find('[data-zoom]').each(function (slide_index)
				{
					jQuery(this).zoom({
						url: resizeImage(images[slide_index].url, 'zoom')
					,	callback: function()
						{
							var $this = jQuery(this);

							if ($this.width() <= $this.parent().width())
							{
								$this.remove();
							}

							return this;
						}
					});
				});
			}
		}

		// @method buildSliderPager @param {Number}slide_index
	,	buildSliderPager: function (slide_index)
		{
			var image = this.options.images[slide_index];
			return '<img src="' + resizeImage(image.url, 'tinythumb') + '" alt="' + image.altimagetext + '">';
		}

		//@method getContext @returns {ItemDetails.ImageGallery.View.Context}
	,	getContext: function ()
		{
			// @class ItemDetails.ImageGallery.View.Context
			return {
				// @property {String} imageResizeId
				imageResizeId: Utils.getViewportWidth() < 768 ? 'thumbnail' : 'main'
				//@property {Array<ItemDetails.ImageGallery.View.Image>} images
			,	images: this.options.images || []
				//@property {ItemDetails.ImageGallery.View.Image} firstImage
			,	firstImage: this.options.images[0] || {}
				// @property {Boolean} showImages
			,	showImages: this.options.images.length > 0
				// @property {Boolean} showImageSlider
			,	showImageSlider: this.options.images.length > 1
			};
		}

	});
});