/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module BackboneExtras
#Backbone.View.render()
This file extends native Backbone.View with a custom rendering method. Basically a View must have the 'template'
property pointing to a Function and that function is evaluated using the result of view.getContext()
@module Backbone
@class Backbone.View
*/
define('Backbone.View.render'
,	[
		'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'PluginContainer'
	,	'Backbone.Validation'
	,	'Handlebars'
	,	'HandlebarsExtras'
	]
,	function (
		Backbone
	,	_
	,	jQuery
	,	PluginContainer
	)
{

	'use strict';

	_.extend(Backbone.View.prototype, {

		//@method getTemplateContext @return {Object} the exact object that is passed to the template function as parameter
		getTemplateContext: function()
		{
			var template_context;

			if (this.getContext)
			{
				template_context = this.getContext();
			}
			else
			{
				template_context = _.extend({}, {
					view: this
				});
			}
			return template_context;
		}

		//@method compileTemplate executes the template passing the context which generates a HTML string. @return {String}
	,	compileTemplate: function()
		{
			var template_context = this.getTemplateContext();

			this.template = Backbone.View.preCompile.executeAll(this.template, this, template_context) || this.template;
			var tmpl_str = this.template(template_context);

			tmpl_str = Backbone.View.postCompile.executeAll(tmpl_str, this);

			return tmpl_str;
		}

		// @method _render Implements the templates execution, rendering and append to DOM.
		// Plugins can be hooked in these interesting 'template rendering' moments to perform customizations.
	,	_render: function ()
		{
			if(this.events)
			{
				this.undelegateEvents();
			}

			var tmpl_str = this.compileTemplate();

			// Rendering: generating DOM from the HTML string
			var $tmpl = SC.ENVIRONMENT.jsEnvironment === 'server' ? jQuery('<div/>').append(tmpl_str) : jQuery(tmpl_str);

			$tmpl = Backbone.View.preRender.executeAll($tmpl, this);
			
			// @property {PluginContainer} preRenderPlugins Instance prerender plugins. Useful for extending the DOM using plugins per instance or per class using JavaScript
			$tmpl = this.preRenderPlugins ? this.preRenderPlugins.executeAll($tmpl, this) : $tmpl;

			this.$el.empty();

			this.trigger('beforeViewRender', this);

			// Appends/render the content HTML string to the view's element
			if (SC.ENVIRONMENT.jsEnvironment === 'server')
			{
				// in page generator we append the content this way because of envjs bug.
				this.$el[0].innerHTML = $tmpl[0].innerHTML;
			}
			else
			{
				this.$el.append($tmpl);
			}

			Backbone.View.postRender.executeAll(this.$el, this);

			this.trigger('afterViewRender', this);

			if(this.events)
			{
				this.delegateEvents();
			}

			return this;
		}

		//@method render public overridable render method used as a facade for the internal _render method
	,	render: function ()
		{
			return this._render();
		}
	});

	// Install the plugin containers
	_.extend(Backbone.View,
	{
		// @property {PluginContainer} preCompile These hooks are executed before the template function is executed and generates a HTML string
		// Each execute method of each plugin will receive: the template function, the view and the context where the template will execute. @static
		preCompile: new PluginContainer()

		//@property {PluginContainer} postCompile These hooks are executed after the template the template function is executed and generates a HTML string
		//Each execute method of each plugin will receive: the template string (result of having running the template) and the view. @static
	,	postCompile: new PluginContainer()

		//@property {PluginContainer} preRender These hooks are executed before the template result is appended to DOM
		//Each execute method of each plugin will receive: the template  DOM object (without begin insert into the DOM) and the view. @static
	,	preRender: new PluginContainer()

		//@property {PluginContainer} postRender These hooks are executed after the template is appended to DOM
		//Each execute method of each plugin will receive: the template DOM object (already in the DOM) and the view. @static
	,	postRender: new PluginContainer()
	});

	return Backbone.View;
});