/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Category.js
// -----------
// Handles the Category tree
define('Categories.Model', ['SC.Model'], function (SCModel)
{
	'use strict';
	return SCModel.extend({
		name: 'Category'

		// if the root_id is blank then we should get all the top level categories of the site
	,	get: function ()
		{
			return this.fixCategories(session.getSiteCategoryContents(true));
		}

	,	fixCategories: function (categories)
		{
			var result = {}
			,	self = this;

			_.each(categories, function (category)
			{
				category.urlcomponent = category.urlcomponent || category.itemid;
				result[category.urlcomponent] = category;

				if (category.categories && category.categories.length)
				{
					category.categories = self.fixCategories(category.categories);
				}
			});

			return result;
		}
	});
});