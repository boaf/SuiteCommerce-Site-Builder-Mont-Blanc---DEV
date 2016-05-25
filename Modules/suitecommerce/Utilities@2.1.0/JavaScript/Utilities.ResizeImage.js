/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define(
	'Utilities.ResizeImage'
,	[
		'SC.Configuration'
	,	'Utils'

	,	'underscore'
	]
,	function (
		Configuration
	,	Utils

	,	_
	)
{
	'use strict';

	return function resizeImage(url, size)
	{
		url = url || Configuration.imageNotAvailable ||  Utils.getAbsoluteUrl('img/no_image_available.jpeg');
		size = Configuration['imageSizeMapping.'+ size] || size;

		var resize = _.where(SC.ENVIRONMENT.siteSettings.imagesizes, {name: size})[0];

		if (!!resize)
		{
			return url + (~url.indexOf('?') ? '&' : '?') + resize.urlsuffix;
		}

		return url;
	};
});