/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module Backbone.CompositeView @class Backbone.CompositeView
#Description

The module Backbone.CompositeView adds support for Backbone Views composition.

#Define a Composite View

To make a Backbone.View to be a CompositeView you must indicate it in the initialize method like this:

	var CompositeView = require('Backbone.CompositeView');
	var MyView = new backbone.View.extend({
		initialize: function()
		{
			CompositeView.add(this);
			//now this view is a composite view!
		}
	});

#Composition by View definition

First, the parent view needs to declare a place holder element in its template to render the children
in it. Children are referenced by name, given in the data-view HTML attribute:

```html
	<div data-view="Promocode"></div>
```

The parent view must also declare how its sub views will be created. For doing so it declares the *childViews* property
which is an object with properties that can be either functions or Backbone.View subclasses. Each defined function must return
an instance of a Backbone.View. For instance

```js
	childViews: {
		'Promocode': function()
		{
			return new PromocodeView({model: this.model.get('promocode')});
		}
	,	'SomeWidget': SomeWidget
	}
```

The function callback takes as an arguments the data attributes of the element placeholder. For example if a placeholder
element contains a data attribute named color

```html
<div data-view="Rectangle.View" data-color="#FF0000"></div>
```

The function callback will have an key named color using that value.

```js
	childViews: {
		'Rectangle.View': function(options)
		{
			return new RectangleView({ color: options.color });
		}
	}
```

In the case of Backbone.View subclasses in the childViews properties the options are passed to the initialize function.
So the previous example could be written as

```js
	childViews: {
		'Rectangle.View': RectangleView
	}
```

##Summary

So in summary, the parent view has all the responsibility of declaring the location of the child
views in the markup and to instantiate its child views by name. Also has the responsibility of
destroying its children and this is done automatically.

Children constructor functions and children instances are available in the parent view, but there
aren't children to parent references, only a boolean hasParent.

#Composition by Extension

Any view declared as Composite View can be extended with new child views externally by passing certain properties when initializing it.
This is extremely useful when developing components.

In this case, as in Composition by View definition, the template must indicate the location where the child view will be located by
adding a data-view attribute.

```html
	<div data-view="ExtraChildView"></div>
```

When initializing a component view that is composite you can pass in its options a property called *extraChildViews* that resemble the
*childViews* but where each value must be a function that when evaluated returns the same function as it was declared in the view's
childViews.
Example:

```js

//...

var component = new MyComponent({
	extraChildViews: {
		ExtraChildView: function (component_model) //<< This is the extra wrapper function
		{
			return function ()
			{
				return new RectangleView();
		}
		}
	}
})


```

The wrapper function is used initialize the extra child view function giving it access to the component's model is any.

*/

define(
	'Backbone.CompositeView'
,	[
		'Backbone'
	,	'jQuery'
	,	'underscore'
	,	'Utils'
	,	'Backbone.CollectionView'
	,	'PluginContainer'
	,	'Backbone.View'
	,	'Backbone.View.render'
	]
,	function(
		Backbone
	,	jQuery
	,	_
	,	Utils
	,	BackboneCollectionView
	,	PluginContainer
	)
{
	'use strict';

	// @module Backbone @class Backbone.View
	// @property {PluginContainer} afterCompositeViewRender Plugins registered here will be called when
	// a composite view finish rendering it self and all its children.
	Backbone.View.afterCompositeViewRender = new PluginContainer();

	// @method {PluginContainer} addExtraChildrenViews Allows adding extra child view to any view.
	// This property will be read by the class Backbone.CompositeView when initializing a view
	// @param {ExtraChildView} option_views
	// @return {Void}
	// @static
	Backbone.View.addExtraChildrenViews = function (option_views)
	{
		this.extraChildViews = this.extraChildViews || {};
		var self = this;

		_.each(_.keys(option_views), function (extra_child_view_name)
		{
			if (self.extraChildViews[extra_child_view_name])
			{
				throw new Error('Invalid Child View Name Error. Backbone Composite View was used to add an extra child view with a duplicated name. Name: ' + extra_child_view_name);
			}
			self.extraChildViews[extra_child_view_name] = option_views[extra_child_view_name];
		});
	};

	// @module Backbone.CompositeView
	// @class Backbone.CompositeView
	return {

		// @method add install makes the passed view a Composite View. Views that want to be composite should call this method at initialize @static
		// @param {Backbone.View} view the view instance we want to transform in a CompositeView.
		add: function (view)
		{
			view.childViews = view.childViews || {};
			view.childViewInstances = view.childViewInstances || {};
			var self = this;

			//Add extra child views from view's static extraChildViews property
			self._addExtraChildrenViews(view.constructor.extraChildViews, view);

			//Add extra child views from view's initialization options
			self._addExtraChildrenViews(view.options.extraChildViews, view);

			view.renderChilds = function (fn)
			{
				// call super.render() - then iterate on [data-view] placeholders and render the children inside.
				var result = fn ? fn.apply(this, Array.prototype.slice.call(arguments)) : this;

				this.$el.find('[data-view]').each(function ()
				{
					view.renderChild(this, true);
				});

				// @event beforeCompositeViewRender triggered just before a view's children finish rendering in the DOM
				this.trigger('beforeCompositeViewRender', this);

				Backbone.View.afterCompositeViewRender.executeAll(this);

				// @event afterCompositeViewRender triggered when a view's children finish rendering in the DOM
				this.trigger('afterCompositeViewRender', this);

				return result;
			};

			//@method Renders the child view specified in elementOrViewName. Appends content if flag append is true
			//@param {DOM element or String} elementOrViewName. DOM element or View name as registered in childViews. Used to get the actual child view
			//@param {boolean} append. Flag to append content or empty the view before rendering the child.
			view.renderChild = function (elementOrViewName, append)
			{
				var element;
				if(typeof(elementOrViewName) === 'string')
				{
					element = this.$el.find('[data-view="' + elementOrViewName + '"]');
				}
				else
				{
					element = elementOrViewName;
				}

				element = jQuery(element);


				var element_data = element.data()
				,	child_name = element_data && element_data.view;

				if (!view.childViews[child_name])
				{
					return;
				}

				var child_view = view.childViewInstances[child_name];

				if(!append && child_view)
				{
					// soft destroys view (preserves div element)
					child_view._destroy(true);
				}

				var childViewGenerator = view.childViews[child_name];

				if(childViewGenerator.extend === Backbone.View.extend)
				{
					// special case of 'Some.View': SomeView
					child_view = view.childViewInstances[child_name] = new childViewGenerator(element_data);
				}
				else
				{
					// common case 'Some.View': function() { ... }
					child_view = view.childViewInstances[child_name] = view.childViews[child_name].call(view, element_data);
				}

				if(!child_view)
				{
					// if the childViews returned a null (or undefined reference) cancel the whole thing.
					return;
				}

				child_view.hasParent = true;
				child_view.placeholderData = element_data || {};

				if (child_view instanceof BackboneCollectionView)
				{
					// Override template if collection views
					self._setCustomTemplate(element, child_view, 'cell');
					self._setCustomTemplate(element, child_view, 'row');
					self._setCustomTemplate(element, child_view, 'child');
				}
				else
				{
					// Default template extension point
					self._setCustomTemplate(element, child_view);
				}

				self._finishRender(child_view, element);

				return child_view;
			};

			view.render = _.wrap(view.render, view.renderChilds);

			// @method destroyChilds destroy() the children views of this view but not self.
			// @param {boolean} softDestroy. Flag to empty child views, leaving the container div instead of deleting it.
			view.destroyChilds = function (softDestroy)
			{
				_(this.childViewInstances).each(function (child)
				{
					child.destroy(softDestroy);
				});

				if(!softDestroy)
				{
					this.childViewInstances = null;
				}
			};

			// overrides destroy() so we first destroy its children and then ourself.
			view.destroy = _.wrap(view.destroy, function (fn)
			{
				_(view.childViewInstances).each(function (child)
				{
					child && child.destroy();
				});
				fn.apply(this, Array.prototype.slice.call(arguments));
			});

			// @method visitChildren recursively visit all the children @param {Function} visitor
			view.visitChildren = function (visitor)
			{
				_(view.childViewInstances).each(function (child)
				{
					visitor(child);
					if (child.visitChildren)
					{
						child.visitChildren(visitor);
					}
				});
			};
		}

		//@method _addExtraChildrenViews Internal method used to add extra child views in a given view
		//@param {ExtraChildView} children_views
		//@param {Backbone.View} view
		//@return {Void}
	,	_addExtraChildrenViews: function (children_views, view)
		{
			children_views = children_views || {};
			view.childViews = view.childViews || {};

			_.each(_.keys(children_views), function (extra_child_view_name)
			{
				var extra_child_function = children_views[extra_child_view_name];

				if (_.isFunction(extra_child_function))
				{
					view.childViews[extra_child_view_name] = extra_child_function(view.model);
				}
			});
		}

		// @method _setCustomTemplate Select the best templated based on the current view port with and set it to the child view
		// @param {jQuery} placeholder Element container of the child. This is the div that contains the tag data-view="..."
		// @param {Backbone.View} child_view Instance of the child view to be inserted
		// @param {String} template_prefix Prefix of the templates. This is used with Collections Views that have multiples data templates, like data-row-template, data-cell-template, etc
	,	_setCustomTemplate: function (placeholder, child_view, template_prefix)
		{
			template = template || '';
			var data_template_prefix = template_prefix ? template_prefix + '-' : ''
			,	template_name = child_view.placeholderData[data_template_prefix + 'template'];

			var definitive_template_name = Utils.selectByViewportWidth({
				phone: child_view.placeholderData[data_template_prefix + 'phoneTemplate'] //remember that data-phone-template get's converted in phoneTemplate when we use jQuery.data()
			,	tablet: child_view.placeholderData[data_template_prefix + 'tabletTemplate']
			,	desktop: template_name
			}, template_name);

			if (definitive_template_name)
			{
				// IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
				// be ALREADY loaded. This take importance when doing unit tests!
				var template = Utils.requireModules(definitive_template_name + '.tpl');
				child_view[template_prefix ? template_prefix + 'Template' : 'template'] = template;
			}

		}

		// @method _finishRender Render the chidlview and insert its result into the placeholder
		// @param {Backbone.View} child_view Instance of the view to be inserted
		// @param {jQuery} $placeholder Element container of the child. This is the div that contains the tag data-view="..."
	,	_finishRender: function (child_view, $placeholder)
		{
			//HEADS UP! we use the placeholder as the children view's container element ($el)
			child_view.$el = $placeholder;

			// keep the placeholder classes
			var placeholder_class = $placeholder.attr('class');
			child_view.className = (child_view.className||'') + ' ' + (placeholder_class||'');

			child_view.render();
		}
	};

});

//@class ChildViews This class defines the type used on each childView property on composite views
//Each property on this object will be related with a child view and the its value must a function that when evaluated returns the instance
//of a Backbone View, or the constructor of a Backbone.View
//Example
//
//,	childView: {
//		'PromoCodeForm': function ()
//		{
//			return new PromocodeFormView({});
//		}
//	}
//
//
//

//@class ExtraChildView This class define the type used to add extra children views into a view by specifying them on the view options when
//creating a new composite view (this is a common scenario when creating components), and by specifying extra child views statically using
//the addExtraChildrenViews method present in all Backbone Views when the Backbone.CompositeView module is loaded
//Example
//
//	SomeView.addExtraChildrenViews({
//		'ExtraChildViewName': function wrapperFunction (some_view_model)
//		{
//			return function ()
//			{
//				return new ExtraChildView({model: some_view_model});
//			};
//		}
//	});
//
