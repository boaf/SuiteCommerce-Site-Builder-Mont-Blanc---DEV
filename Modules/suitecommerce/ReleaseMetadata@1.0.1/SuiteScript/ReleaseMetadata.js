/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//! © 2015 NetSuite Inc.

/* global release_metadata  */
define(
	'ReleaseMetadata'
,	[ 'underscore' ]
,	function(_)
{
	'use strict';
	return {
		available: function()
		{	
			return release_metadata !== undefined;	
		}

	,	get: function()
		{
			return release_metadata;
		}

	,	asHTMLComment: function()
		{
			if(!release_metadata)
			{
				return '';
			}

			// Generates something like [ bundle_id "48040" ] [ baselabel "POS_ML" ] ...
			var bracketVals = _.chain(release_metadata)
				.omit('name')
				.map(function(value, key)
				{
					return '[ ' + key + ' ' + JSON.stringify(value) + ' ]';
				})
				.value()
				.join(' ');

			return '<!-- ' + release_metadata.name + ' ' + bracketVals + ' -->';
		}
	};
});