/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Merchandising
// Module to handle MerchandisingZones (ex: Featured Items section)
define('Merchandising'
,	[	'Merchandising.ItemCollection'
	,	'Merchandising.Rule'
	,	'Merchandising.jQueryPlugin'

	,	'underscore'
	]
,	function (
		ItemCollection
	,	Rule
	,	jQueryPlugin

	,	_
	)
{
	'use strict';

	return {
		// @class Merchandising It will listen onAfterAppendView to see if there is a new placeholder on 
		// which to attach a merchandising @extends ApplicationModule
		mountToApp: function (application)
		{
			if (SC.ENVIRONMENT.MERCHANDISING)
			{
				// we need to turn it into an array
				var definitions = _.map(SC.ENVIRONMENT.MERCHANDISING, function (value, key)
				{
					value.internalid = key;
					return value;
				});

				Rule.Collection.getInstance().reset(definitions);
				delete SC.ENVIRONMENT.MERCHANDISING;
			}

			// we add the default options to be added when fetching the items
			// this includes language and shoper's currency
			ItemCollection.prototype.searchApiMasterOptions = application.getConfig('searchApiMasterOptions.merchandisingZone');

			// afterAppendView is triggered whenever a view or modal is appended
			application.getLayout()
				.on('afterAppendView', function ()
				{
					// we dont want to discover unwanted merch zones, specifically
					// those in a the main screen (layout) behind the current modal.
					// give preference to modalCurrentView if available
					// otherwise inspect layout since merch zones can live outside of the currentview.
					var currentView = this.modalCurrentView || this; // "this" is current layout!

					currentView.$('[data-type="merchandising-zone"]').merchandisingZone({
						application: application
					});
				})
				// content service triggers this event when rendering a new enhanced page
				.on('renderEnhancedPageContent', function (view, content_zone)
				{
					// if the type of the content zone is merchandising
					if (content_zone.contenttype === 'merchandising')
					{
						var target = content_zone.target
						,	$view_target = view.$(target)
						,	merchandising_zone_options = {
								application: application
							,	id: content_zone.content
							};

						// if the target is in the current view
						// we add the merchandising zone there
						if ($view_target.length)
						{
							$view_target.merchandisingZone(merchandising_zone_options);
						}
						else
						{
							// else, we search for the target in the layout
							this.$(target)
								.filter(':empty')
								.merchandisingZone(merchandising_zone_options);
						}
					}
				});

			// @module ApplicationSkeleton @class ApplicationSkeleton @method getMerchandisingRules @return {MerchandisingRule.Collection}
			application.getMerchandisingRules = function getMerchandisingRules ()
			{
				return Rule.Collection.getInstance();
			};
		}
	};
});
