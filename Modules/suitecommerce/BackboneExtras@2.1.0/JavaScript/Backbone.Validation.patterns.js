/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Backbone.Validation.patterns'
,	[	'Backbone'
	,	'underscore'
	,	'Backbone.Validation'
	]
,	function (
		Backbone
	,	_
	)
{
	'use strict';

	_.extend(Backbone.Validation.patterns,
	{
		// Same as email but is more restrictive and matches the same emails as the Netsuite backend UI
	    // Source: https://system.netsuite.com/javascript/NLUtil.jsp__NS_VER=2014.1.0&minver=154&locale=en_US.nlqs
	    //        (Search for NLValidationUtil_SIMPLE_EMAIL_PATTERN)
		email: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]+(?:-+[a-z0-9]+)*\.)+(?:xn--[a-z0-9]+|[a-z]{2,16})$/i
	});

	return Backbone.Validation.patterns;
});
