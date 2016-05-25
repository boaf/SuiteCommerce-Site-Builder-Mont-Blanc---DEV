/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module CheckoutApplication
@class SCA.Checkout.Configuration
The front end Configuration file for Checkout application.

The most important part is the property checkoutSteps that defines the full checkout wizard experience and it is fully configurable by declaring steps and steps groups that contains WizardModules, this are, views that ask the user for a certain information required by te Checkout process.

There are three supported and well-tested checkout steps configurations: The 'Standard flow', the 'One Page Checkout' (OPC) and the 'Billing first' flow.

By defuault the Standard Flow is used, but you can easily switch to OPC by just replacing the dependency 'SC.Checkout.Configuration.Steps.Standard' with 'SC.Checkout.Configuration.Steps.OPC' in this file.
*/
define(
	'SC.Checkout.Configuration'
,	[
		'SC.Configuration'
	,	'underscore'
	,	'jQuery'
	,	'Utils'

		// Checkout steps! Change below to switch the flow options:
		// Standard 	 : 	'SC.Checkout.Configuration.Steps.Standard'
		// OPC 			 : 	'SC.Checkout.Configuration.Steps.OPC'
		// billing first :  'SC.Checkout.Configuration.Steps.BillingFirst'

	,	'SC.Checkout.Configuration.Steps.Standard'

	]
,	function (
		BaseConfiguration
	,	_
	,	jQuery
	,	Utils
	,	CheckoutConfigurationSteps
	)
{
	'use strict';

	//window.screen = false; //always comment this line on production !!
	// Calculates the width of the device, it will try to use the real screen size.
	var screen_width = Utils.getViewportWidth();

	var Configuration = {

		notShowCurrencySelector: true

		// depending on the application we are configuring, used by the NavigationHelper.js
	,	currentTouchpoint: _.isSecureDomain() ? 'checkout' : 'viewcart'

	,	modulesConfig: {
			'ItemDetails':  {startRouter: true}
		,	'Cart':  {startRouter: !_.isSecureDomain()}
		,	'LoginRegister': {startRouter: _.isSecureDomain()}
		}

	,	startCheckoutWizard: _.isSecureDomain()
/*
@property {Array} checkoutSteps

Defines the entire Checkout experience. It is based on a Wizard, this is a list of steps that the user secuentially
complete submitting the order at the end. Each step contains one or more modules that perform a logic task like
showing or asking the user certain information.

There are three supported and well-tested checkoutSteps: Standard flow, One page checkout (OPC) and Billing first flow.
These steps are defined in modules SCA.Checkout.Configuration.Steps.BillingFirst.js for example. Just change the
dependency 'SC.Checkout.Configuration.Steps.Standard' in this file to use other checkout steps, for example
'SC.Checkout.Configuration.Steps.BillingFirst'

The following describes the format of the checkoutSteps property:

	checkoutSteps: [											//an array with the step groups conforming The Checkout
		{
			name: 'Step Group'									//the name of this Step Group
		,	steps: [											//an array of the steps of this step group
				{
					name: 'Step'								//literal name for this step
				,	getName: function()	{return 'a name'; }		//dynamic name for this step. If there is no getName() defined, name property will be used instead
				,	url: 'step-url'								//this step's url. Must be unique among all the steps
				,	continueButtonLabel: "Continue"				//The label of the 'Continue' button for this step, for example, for One Page Checkout it could be 'Place Order'
				,	hideBackButton: true						//if true the "Back" button will be hidden for this step
				,	hideContinueButton: true					//if true the "Continue" buttons in the page will be hidden for this step
				,	hideSecondContinueButtonOnPhone: true		//if true the second "Continue" button in the page will be hidden when displayed on a smart phone. Use this if there are too many "Continue" buttons in a step (i.e. top, bottom and summary buttons)
				,	hideSummaryItems: true						//if true the cart summary's items are not showed on this step
				,	hideBreadcrumb: true						//if true the breadcrumb in the page will be hidden for this step
				,	headerView: 'Header'						//each step can define which main site header to show when the user is placed on it. By default the simplified header is used, but the normal 'header' (or a custom one) can be used
				,	footerView: 'Footer'						//as with the header, each step can define which site footer to use, by default the simplified footer is used.
				,	bottomMessage: 'Some message at the bottom' //a message that will appear at the bottom of the step, under the "continue" and "back" buttons
				,	bottomMessageClass: 'classname'				//a class that the bottom message can have
				,	isActive: function(){return boolean;}		//Indicate if the entire step should be shown or not. The default implementation of this function check that all modules in the step are active (isActive) or not.
				,	modules: [									//Required, the list modules that form this step, the order will be respected visually from top to bottom.
						'Module.Name'							//three different module syntax are supported String, array or object.
					,	['Module2', {edit_url: '/someurl'}]		//individual modules may accept configuration parameters that will be applied to the module for this step. In this case the edit_url is accepted by those modules that ask the user to edit data from modules in ahother step, so it must be a valid step url.
					,	{name: 'Module3', title: 'My module!'}	//also modules accept the property 'title' for showing a small title on top of the module.
					]
				,	save: function()							//a custom save function which 'this' context will be the Step (a Backbone view)
					{
						return this.wizard.model.submit();
					}
				}
			]
		}
	]
*/
	,	checkoutSteps: CheckoutConfigurationSteps

		// Whether to show or not the Credit Cards help
	,	showCreditCardHelp: true

		// Credit Card help title
	,	creditCardHelpTitle: _('Where to find your Security Code').translate()

		// CVV All cards image
	,	imageCvvAllCards: Utils.getAbsoluteUrl('img/cvv_all_cards.jpg')

		// CVV American card image
	,	imageCvvAmericanCard: Utils.getAbsoluteUrl('img/cvv_american_card.jpg')

		// define the url of paypal logo.
	,	paypal_logo: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg'

		//Invoice payment method terms and conditions text
	,	invoiceTermsAndConditions: _('<h4>Invoice Terms and Conditions</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>').translate()

		//CreditCard showSecureInfo text
	,	creditCardShowSecureInfo: _('<p class="order-wizard-paymentmethod-creditcard-secure-info">We take all reasonable steps to protect our customers personal information against loss, misuse and alteration. We use encryption technology whenever receiving and transferring your personal information on our site. <strong>When you are viewing a page that is requesting personal information, the URL in the address bar at top of your browser will start with "https". </strong> This indicates your transaction session is secured through Secure Sockets Layer (SSL). If the web page you are viewing does not start with "https", please contact us.</p>').translate()

	,	collapseElements: false

		// Analytics Settings
		// You need to set up both popertyID and domainName to make the default trackers work
	,	tracking: {
			// [Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/)
			googleUniversalAnalytics: {
				propertyID: ''
			,	domainName: ''
			}
			// [Google AdWords](https://support.google.com/adwords/answer/1722054/)
		,	googleAdWordsConversion: {
				id: 0
			,	value: 0
			,	label: ''
			}
		}
	};

	// Phone Specific
	if (screen_width < 768)
	{
		_.extend(Configuration, {
			collapseElements: true
		});
	}
	// Tablet Specific
	else if (screen_width >= 768 && screen_width <= 978)
	{
		_.extend(Configuration, {});
	}
	// Desktop Specific
	else
	{
		_.extend(Configuration, {});
	}

	//Deep extend
	jQuery.extend(true, BaseConfiguration, Configuration);

	return BaseConfiguration;

});
