/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('BrontoIntegration'
,	[
		'jQuery'
	]
,	function (
		jQuery
	)
{
	'use strict';
	
	return {
		instanceId: ''
	,	loadScript: function ()
		{
			if (SC.ENVIRONMENT.jsEnvironment === 'browser') 
			{
				jQuery('body').append(jQuery('<script src="https://cdn.bronto.com/netsuite/configure.js" data-bronto-integrations="' + this.instanceId + '"></script>'));
			}
		}
	,	mountToApp: function (application)
		{
			var bronto_config = application.getConfig('bronto');
			
			if (bronto_config && bronto_config.accountId)
			{
				this.instanceId = bronto_config.accountId;		
				application.getLayout().once('afterAppendView', jQuery.proxy(this, 'loadScript'));
			}
		}	
	};
});