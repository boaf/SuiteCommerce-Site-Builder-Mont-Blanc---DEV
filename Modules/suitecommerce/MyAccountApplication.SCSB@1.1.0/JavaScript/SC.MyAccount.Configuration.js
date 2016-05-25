/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Configuration.js
// ----------------
// All of the applications configurable defaults
// Each section is comented with a title, please continue reading
define(
	'SC.MyAccount.Configuration'
,	[
		'SC.Configuration'
	,	'underscore'
	,	'Utils'
	]

,	function (
		BaseConfiguration
	,	_
	)
{
	'use strict';

	var Configuration = {

		// depending on the application we are configuring, used by the NavigationHelper.js
		currentTouchpoint: 'customercenter'

	,	modulesConfig: {
			'ItemDetails':  {startRouter: false}
		,	'Cart':  {startRouter: false}
		,	'Address': {startRouter: SC.ENVIRONMENT.siteSettings.is_logged_in}
		,	'CreditCard': {startRouter: SC.ENVIRONMENT.siteSettings.is_logged_in}
		}
		// Whats your Customer support url
	,	customerSupportURL: ''

		// Whats your return policy url.
		// If this is set to some value, a link to "Return Items" will appear on order details
		// eg: returnPolicyURL: '/s.nl/sc.5/.f'
	,	returnPolicyURL: ''

		// If you configure an object here it will display it in the index of my account
		// Ideal for promotions for clients
	,	homeBanners: [
			// {
			//	imageSource: "img/banner1.jpeg",
			//	linkUrl: "",
			//	linkTarget: ""
			// }
		]

		// Whether the site is basic or premium
	,	isBasic: true

		// Whether to show or not the Credit Cards help
	,	showCreditCardHelp: true

		// Credit Card help title
	,	creditCardHelpTitle: _('Where to find your Security Code').translate()

		// CVV All cards image
	,	imageCvvAllCards: _.getAbsoluteUrl('img/cvv_all_cards.jpg')

		// CVV American card image
	,	imageCvvAmericanCard: _.getAbsoluteUrl('img/cvv_american_card.jpg')

		// This object will be merged with specific pagination settings for each of the pagination calls
		// You can use it here to toggle settings for all pagination components
		// For information on the valid options check the pagination_macro.txt
	,	defaultPaginationSettings: {
			showPageList: true
		,	pagesToShow: 9
		,	showPageIndicator: false
		}

	,	collapseElements: false
	,	notShowCurrencySelector: true
	,	filterRangeQuantityDays: 0
	,	homeRecentOrdersQuantity: 3
	,	productReviews: {
			maxRate: 5
		}

		// Return Authorization configuration
	,	returnAuthorization: {

			reasons: [
				{
					text: _('Wrong Item Shipped').translate()
				,	id:1
				,	order:1
				}
			,	{
					text: _('Did not fit').translate()
				,	id:2
				,	order:2
				}
			,	{
					text:_('Quality did not meet my standards').translate()
				,	id:3
				,	order:3
				}
			,	{
					text: _('Not as pictured on the Website').translate()
				,	id:4
				,	order:4
				}
			,	{
					text: _('Damaged during shipping').translate()
				,	id:5
				,	order:5
				}
			,	{
					text: _('Changed my mind').translate()
				,	id:6
				,	order:6
				}
			,	{
					text: _('Item was defective').translate()
				,	id:7
				,	order:7
				}
			,	{
					text: _('Arrived too late').translate()
				,	id:8
				,	order:8
				}
			,	{
					text: _('Other').translate()
				,	id:9
				,	order:9
				,	isOther: true
				}
			]
		}
	,	transactionRecordOriginMapping: {
			backend: {
				origjn: 0
			,	name: _.translate('')
			,	detailedName: _.translate('Purchase')
			}
		,	inStore: {
				origin: 1
			,	name: _.translate('In Store')
			,	detailedName: _.translate('In Store Purchase')
			}
		,	online: {
				origin: 2
			,	name: _.translate('Online')
			,	detailedName: _.translate('Online Purchase')
			}
		}
	};

	// window.screen = false;
	// Calculates the width of the device, it will try to use the real screen size.
	var screen_width = Utils.getViewportWidth();

	// Phone Specific
	if (screen_width < 768)
	{
		_.extend(Configuration, {
			defaultPaginationSettings: {
				showPageList: false
			,	showPageIndicator: true
			}
		,	collapseElements: true
		});
	}
	// Tablet Specific
	else if (screen_width >= 768 && screen_width <= 978)
	{
		_.extend(Configuration, {
			defaultPaginationSettings: {
				showPageList: true
			,	pagesToShow: 4
			,	showPageIndicator: false
			}
		,	collapseElements: true
		});
	}
	// Desktop Specific
	else
	{
		_.extend(Configuration, {});
	}

	_.extend(BaseConfiguration, Configuration);

	
	return BaseConfiguration;
});
