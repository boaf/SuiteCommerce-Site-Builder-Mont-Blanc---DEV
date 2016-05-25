/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
// Supports infrastructure for defining model classes by using SCModel. 
define('SC.Model', 
	[
		'Application'
	,	'Backbone.Validation'
	,	'underscore'
	]
,	function (
			Application
		,	BackboneValidation
		,	_
	)
{
	'use strict';
	/*
	@class SCModel Subclasses of SCModel are used to implement the RESTFUL methods for accessing a particular 
	resource, in general a netsuite record like commerce order, session, or custom record. 

	Note: When using SCModel for defining models think more on object singletons like in classes.
	
	Note: Also SCModel instances support Aspect Oriented functionality on methods so users can register to before or after a method of model is called. 
	For example, we can hook to the time when an LiveOrder is submitted so we can customize its behavior like this:
	
	Application.on('before:LiveOrder:save', function()
	{
		... do something before submitting a live order ... 
	})

	*/
	var SCModel = {

		//@property {String} name the name identifying the type of this model

		/*
		@method extend use SCModel.extend to define new models. Example: 

		var MyCoolThing = SCModel.extend({
			name: 'MyCoolThing'
		,	get: function(id)
			{
				return this.serialize(nlapiLoadRecord('MyCoolThingRecordType', id));
			}
		,	serialize: function() {...TODO...}
		}); 

		@param {name:String} model the properties and methods of the new class. The name is mandatory
		@return {SCModel} the new instance model with the new properties added ready to be used
		*/
		extend: function (model)
		{
			if (!model.name && !this.name)
			{
				throw {
					status: 400
				,	code: 'ERR_MISSING_MODEL_NAME'
				,	message: 'Missing model name.'
				};
			}

			var new_model = {};

			_.extend(new_model, this, model);

			addValidation(new_model);

			_.each(new_model, function (value, key)
			{
				if (typeof value === 'function' && key !== 'extend')
				{
					new_model[key] = wrapFunctionWithEvents(key, new_model, value);
				}
			});

			return new_model;
		}
	};

	function wrapFunctionWithEvents (methodName, model, fn)
	{
		return _.wrap(fn, function (func)
		{
			// Gets the arguments passed to the function from the execution code (removes func from arguments)
			var args = _.toArray(arguments).slice(1);

			// Fires the 'before:ObjectName.MethodName' event most common 'before:Model.method'
			Application.trigger.apply(Application, ['before:' + model.name + '.' + methodName, this].concat(args));

			// Executes the real code of the method
			var result = func.apply(this, args);

			// Fires the 'before:ObjectName.MethodName' event adding result as 1st parameter
			Application.trigger.apply(Application, ['after:' + model.name + '.' + methodName, this, result].concat(args));

			// Returns the result from the execution of the real code, modifications may happend in the after event
			return result;
		});
	}

	function addValidation (model)
	{
		//Is the model does not have already defined a validate function
		if (!model.validate)
		{
			model.validate = function (data)
			{
				//if the model has specified validation logic
				if (this.validation)
				{
					var validator = _.extend({
							validation: this.validation
						,	attributes: data
						}, BackboneValidation.mixin)

					,	invalidAttributes = validator.validate();

					if (!validator.isValid())
					{
						throw {
							status: 400
						,	code: 'ERR_BAD_REQUEST'
						,	message: invalidAttributes
						};
					}
				}
			};
		}
	}

	return SCModel;
});
