/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* exported service */
// LiveOrder.GiftCertificate.Service.ss
// ----------------
// Service to manage gift certificates in the live order
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		var data = JSON.parse(request.getBody() || '{}')
			// Cart model is defined on ssp library Models.js
		,	LiveOrder = require('LiveOrder.Model');

		switch (request.getMethod())
		{
			case 'POST':
				LiveOrder.setGiftCertificates(data.giftcertificates);
			break;

			default:
				// methodNotAllowedError is defined in ssp library commons.js
				return Application.sendError(methodNotAllowedError);
		}

		Application.sendContent(LiveOrder.get() || {});
	}
	catch (e)
	{
		Application.sendError(e);
	}
}
