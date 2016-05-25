/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*exported service*/
function service (request)
{
	'use strict';

	var Application = require('Application');

	try
	{
		//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
		//Note that this condition is expressed with 'registrationmandatory' property being 'T'
		var isRegistrationDisabled = session.getSiteSettings(['registration']).registration.registrationmandatory === 'T';

		if (isRegistrationDisabled || !SC.Configuration.passwordProtectedSite || session.isLoggedIn2())
		{
			var method = request.getMethod()
			,	data = JSON.parse(request.getBody() || '{}')
			,	id = request.getParameter('internalid') ? request.getParameter('internalid') : data.internalid
				// ProductReview model is defined on ssp library Models.js
			,	ProductReview = require('ProductReviews.Model');

			switch (method)
			{
				case 'GET':
					var result;

					if (id)
					{
						// we get the review
						result = ProductReview.get(id);
						// if the review is not approved
						if (result.status !== ProductReview.approvedStatus || result.isinactive)
						{
							throw notFoundError;
						}
					}
					else
					{
						var params = request.getAllParameters()
						,	filters = {}
						,	param = '';

						for (param in params)
						{
							filters[param] = params[param];
						}

						result = ProductReview.search(filters, filters.order, filters.page, filters.limit);
					}
					// send either the individual review, or the search result
					Application.sendContent(result,{'cache': response.CACHE_DURATION_LONG});
				break;

				case 'POST':
					// send the reponse of creating a review
					Application.sendContent(ProductReview.create(data),{'status': 201});
				break;

				case 'PUT':
					// update review with the data
					ProductReview.update(id, data);
					// and send the review itself
					Application.sendContent(ProductReview.get(id));
				break;

				default:
					// methodNotAllowedError is defined in ssp library commons.js
					Application.sendError(methodNotAllowedError);
			}
		}
		else
		{
			// unauthorizedError is defined in ssp library commons.js
			Application.sendError(unauthorizedError);
		}
	}
	catch (e)
	{
		Application.sendError(e);
	}
}