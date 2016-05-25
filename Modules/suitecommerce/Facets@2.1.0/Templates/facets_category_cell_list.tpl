{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if hasTwoOrMoreFacets}}
	<div class="facets-category-cell-list">
		<span class="facets-category-cell-list-heading">
			{{name}}
		</span>
		<a href="/{{url}}" class="facets-category-cell-list-anchor">
			{{translate 'Shop All &gt;'}}
		</a>
	</div>
{{/if}}

<div data-view="Facets.CategoryCells"></div>