{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if hasCategories}}
	<div class="facets-faceted-navigation-facet-group">
	<div class="facets-faceted-navigation-title">
		{{translate 'Shop: $(0)' categoryItemId}}
	</div>
	<div class="facets-faceted-navigation-category-wrapper">
		<div data-type="facet" data-facet-id="category"></div>
	</div>
</div>
{{/if}}

{{#if hasFacetsOrAppliedFacets}}

<h3 class="facets-faceted-navigation-title">{{translate 'Narrow By'}}</h3>

<h4 class="facets-faceted-navigation-results">
	{{#if keywords}}
		{{#if isTotalProductsOne}}
			{{translate '1 Result for <span class="facets-faceted-navigation-title-alt">$(0)</span>' keywords}}
		{{else}}
			{{translate '$(0) Results for <span class="facets-faceted-navigation-title-alt">$(1)</span>' totalProducts keywords}}
		{{/if}}
	{{else}}
		{{#if isTotalProductsOne}}
			{{translate '1 Product'}}
		{{else}}
			{{translate '$(0) Products' totalProducts}}
		{{/if}}
	{{/if}}
</h4>

{{#if hasAppliedFacets}}
<a href="{{clearAllFacetsLink}}" class="facets-faceted-navigation-facets-clear">
	{{translate 'Clear All'}}
	<i class="facets-faceted-navigation-facets-clear-icon"></i>
</a>
{{/if}}

<div data-view="Facets.FacetedNavigationItems"></div>
{{/if}}