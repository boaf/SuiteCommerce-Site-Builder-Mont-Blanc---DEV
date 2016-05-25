/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module BackboneExtras
#Backbone.View.Plugins
Define the default plugins to execute by Backbone.View.render method. These plugins hook into the Backobne.view
render() life cycle and modify the view's output somehow, for example removing marked nodes that current user
has not permission to see, installing bootstrap widgets after a view is rendered, etc.
*/
define('Backbone.View.Plugins'
,	[
		'Backbone.View.render'

	,	'underscore'
	,	'jQuery'
	,	'Backbone'
	,	'Utils'
	,	'bootstrap-datepicker'
	]
,	function (
		BackboneView

	,	_
	,	jQuery
	,	Backbone
	,	Utils
	)
{
	'use strict';

	return  {
		mountToApp: function ()
		{
			if (!SC.isPageGenerator())
			{
				BackboneView.postCompile.install({
					name: 'debugTemplateName'
				,	priority: 10
				,	execute: function (tmpl_str, view)
					{
						var template_name = view.template.name || view.template.Name
						,	prefix = Utils.isPageGenerator() ? '' : '\n\n<!-- TEMPLATE STARTS: '+ template_name +'-->\n'
						,	posfix = Utils.isPageGenerator() ? '' : '\n<!-- TEMPLATE ENDS: '+ template_name +' -->\n';

						tmpl_str = prefix + tmpl_str + posfix;

						return tmpl_str;
					}
				}); 
			}

			if (Utils.oldIE())
			{
				BackboneView.postCompile.install({
					name: 'oldIEFix'
				,	priority: 20
					// Workaround for internet explorer 7. href is overwritten with the absolute path so we save the original href
					// in data-href (only if we are in IE7)
					// IE7 detection courtesy of Backbone
					// More info: http://www.glennjones.net/2006/02/getattribute-href-bug/
				,	execute: function (tmpl_str)
					{
						return (tmpl_str || '').replace(/href="(.+?)(?=")/g,'$&" data-href="$1');
					}
				});
			}

			// wrap all images with noscript tag in the page generator output so they are not automatically loaded by the browser and compete with our core resources.
			if (SC.isPageGenerator())
			{
				BackboneView.postCompile.install({
					name: 'pageGeneratorWrapImagesNoscript'
				,	priority: 30
				,	execute: function (tmpl_str)
					{
						return tmpl_str.replace(/(<img\s+[^>]*>\s*<\/img>|<img\s+[^>]*\/>|(?:<img\s+[^>]*>)(?!\s*<\/img>))(?!\s*<\s*\/noscript\s*>)/gmi,'<noscript>$1</noscript>');
					}
				});
			}

			if (!SC.isPageGenerator())
			{
				BackboneView.postRender.install({
					name: 'applyPermissions'
				,	priority: 10
					// Given a DOM template, removes the elements from the DOM that
					// do not comply with the list of permissions level
					// The permission level is specified by using the data-permissions attribute and data-permissions-operator (the latter is optional)
					// on any html tag in the following format:
					// <permission_category>.<permission_name>.<minimum_level>
					// permission_category and permission_name come from SC.ENVIRONMENT.permissions. (See commons.js)
					// e.g:
					//     <div data-permissions="transactions.tranFind.1"></div>
					//     <div data-permissions="transactions.tranCustDep.3,transactions.tranDepAppl.1 lists.tranFind.1"></div>
					// Notice several permissions can be separated by space or comma, by default (in case that data-permissions-operator is missing) all permission will be evaluates
					// as AND, otherwise data-permissions-operator should have the value OR
					// e.g:
					//     <div data-permissions="transactions.tranFind.1"></div>
					//     <div data-permissions="transactions.tranCustDep.3,transactions.tranDepAppl.1 lists.tranFind.1" data-permissions-operator="OR" ></div>
				,	execute: function (template)
					{
						// We need to wrap the template in a container so then we can find
						// and remove parent nodes also (jQuery.find only works in descendants).
						var $permissioned_elements = template.find('[data-permissions]');

						$permissioned_elements.each(function ()
						{
							var $el = jQuery(this)
							,	element_permission = $el.data('permissions')
							,	perms = element_permission.split(/[\s,]+/)
							,	perm_operator = $el.data('permissions-operator') || 'AND'
							,	perm_eval
							,	perm_evaluation = perm_operator !== 'OR';

							_.each(perms, function (perm)
							{
								var perm_tokens = perm.split('.');

								perm_eval = !(perm_tokens.length === 3 &&
									perm_tokens[2] < 5 &&
									SC.ENVIRONMENT.permissions &&
									SC.ENVIRONMENT.permissions[perm_tokens[0]] &&
									SC.ENVIRONMENT.permissions[perm_tokens[0]][perm_tokens[1]] < perm_tokens[2]);

								if (perm_operator === 'OR')
								{
									perm_evaluation = perm_evaluation || perm_eval;
								}
								else
								{
									perm_evaluation = perm_evaluation &&  perm_eval;
								}
							});

							if (!perm_evaluation)
							{
								$el.remove();
							}
						});

						return template;
					}
				});
			}
			
			if (!SC.isPageGenerator())
			{
				BackboneView.postRender.install({
					name: 'HTMLBootstrap'
				,	priority: 10
					//Fix all HTML bootstrap tooltips
				,	execute: function ($el, view)
					{
						view.$('[data-toggle="tooltip"]').tooltip({html: true});
						view.$('[data-toggle="dropdown"]').dropdown();
						//view.$('[data-toggle="collapse"]').collapse();

						//initialize bootstrap date picker
						if (_.isNativeDatePickerSupported() === false || _.isDesktopDevice())
						{
							view.$('input[type="date"]').each(function()
							{
								var $date_picker = jQuery(this);
								try
								{
									$date_picker.attr('type', 'text');
								}
								catch(ex)
								{
									//Attempting to change the type attribute (or property) of an input element created via HTML or already in an HTML document will
									//result in an error being thrown by Internet Explorer 6, 7, or 8. That's OK since IE wont understand type="date", but chrome and others should change it.
								}
								$date_picker.datepicker({
										format: $date_picker.data('format')
									,	startDate: $date_picker.data('start-date')
									,	endDate: $date_picker.data('end-date')
									,	autoclose: true
									,	todayHighlight: $date_picker.data('todayhighlight')
								});
							});
						}
					}
				});
			}
		}
	};
});
