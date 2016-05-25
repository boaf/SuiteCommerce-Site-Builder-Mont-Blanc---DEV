/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Responsive.js
// -------------
// Handles the toggleing of the menu for the mobile version of the site
define('Responsive'
,	[	'Backbone'
	,	'jQuery'
	]
,	function (
		Backbone
	,	jQuery
	)
{
	'use strict';

	return {
		mountToApp: function (application)
		{
			// every time the view is appended
			application.getLayout().on('afterAppendView', function ()
			{
				// if it's the home and we are in a mobile
				if (jQuery(window).width() <= 767 && (Backbone.history.fragment === '' || Backbone.history.fragment === 'overview'))
				{
					// the show-nav hides the content and shows the sidebar
					this.application.getLayout().$el.addClass('show-side-nav').removeClass('hide-side-nav');
				}
				else
				{
					this.application.getLayout().$el.addClass('hide-side-nav').removeClass('show-side-nav');
				}
			});
		}
	};
});
