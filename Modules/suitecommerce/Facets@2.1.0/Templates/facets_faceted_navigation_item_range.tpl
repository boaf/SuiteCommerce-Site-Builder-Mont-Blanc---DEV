{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showFacet}}
	<div class="facets-faceted-navigation-item-range-facet-group" id="{{htmlId}}" data-type="rendered-facet" data-facet-id="{{facetId}}">
		{{#if showHeading}}
			{{#if isUncollapsible}}
				<div class="facets-faceted-navigation-item-range-facet-group-expander">
					<h4 class="facets-faceted-navigation-item-range-facet-group-title">
						{{facetDisplayName}}
						{{#if showRemoveLink}}
						<a class="facets-faceted-navigation-item-range-filter-delete" href="{{removeLink}}">
							<i class="facets-faceted-navigation-item-range-filter-delete-icon"></i>
						</a>
						{{/if}}
					</h4>
				</div>
			{{else}}
				<a href="#" class="facets-faceted-navigation-item-range-facet-group-expander" data-toggle="collapse" data-target="#{{htmlId}} .facets-faceted-navigation-item-range-facet-group-wrapper" data-type="collapse" title="{{facetDisplayName}}">
					<i class="facets-faceted-navigation-item-range-facet-group-expander-icon"></i>
					<h4 class="facets-faceted-navigation-item-range-facet-group-title">{{facetDisplayName}}</h4>
					{{#if showRemoveLink}}
						<a class="facets-faceted-navigation-item-range-filter-delete" href="{{removeLink}}">
							<i class="facets-faceted-navigation-item-range-filter-delete-icon"></i>
						</a>
					{{/if}}
				</a>
			{{/if}}
		{{/if}}

	{{#if isUncollapsible}}
	<div class="facets-faceted-navigation-item-range-facet-group-wrapper">
	{{else}}
	<div class="facets-faceted-navigation-item-range-facet-group-wrapper {{#if isCollapsed}} collapse{{else}} in{{/if}}">
	{{/if}}
		<span class="facets-faceted-navigation-item-range-end" data-range-indicator="end">{{rangeToLabel}}</span>
		<span class="facets-faceted-navigation-item-range-start" data-range-indicator="start">{{rangeFromLabel}}</span>

		<div
			class="facets-faceted-navigation-item-range-slider"
			data-toggle="slider"
			data-facet-id="{{facetId}}"
			data-min="{{rangeMin}}"
			data-max="{{rangeMax}}"
			data-low="{{rangeFrom}}"
			data-high="{{rangeTo}}">
						<div class="facets-faceted-navigation-item-range-slider-bar" data-control="bar" style="left: 0%; width: 100%;"></div>
						<button class="facets-faceted-navigation-item-range-slider-bar-right" data-control="low" style="left: 0%;"></button>
						<button class="facets-faceted-navigation-item-range-slider-bar-left" data-control="high" style="left: 100%;"></button>
					</div>

	</div>
</div>
{{/if}}