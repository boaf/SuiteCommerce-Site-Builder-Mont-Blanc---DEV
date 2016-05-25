{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showHeader}}
	<div class="list-header-view" data-type="accordion">
		<div class="list-header-view-accordion" data-action="accordion-header">

			<div class="list-header-view-accordion-link">{{headerMarkup}}</div>
			{{#if showHeaderExpandable}}
			<div class="list-header-view-accordion-header">
				<button class="list-header-view-filter-button" data-action="toggle-filters">
					{{translate 'Filter'}} <i class="list-header-view-filter-button-icon" ></i>
				</button>
			</div>
			<div class="list-header-view-accordion-body {{initiallyCollapsed}}" data-type="accordion-body" {{{accordionStyle}}}>
				<!-- Todo: Each component should be a macro -->
				<div class="list-header-view-accordion-body-header {{classes}}">

					{{#if rangeFilter}}

						<label class="list-header-view-from" for="from">
							<span>{{rangeFilterLabel}}</span>
							
							<input class="list-header-view-accordion-body-input" id="from" name="from" type="date" placeholder="{{translate 'YYYY-MM-DD'}}" autocomplete="off" data-format="yyyy-mm-dd" data-start-date="{{rangeFilterFromMin}}" data-end-date="{{rangeFilterFromMax}}" value="{{selectedRangeFrom}}" data-action="range-filter" data-todayhighlight="true"/>
							
							<i class="list-header-view-accordion-body-calendar-icon"></i>
							<a class="list-header-view-accordion-body-clear" data-action="clear-value">
								<i class="list-header-view-accordion-body-clear-icon"></i>
							</a>
						</label>
						<label class="list-header-view-to" for="to">
							<span>{{translate 'to'}}</span>
							
							<input class="list-header-view-accordion-body-input" id="to" name="to" type="date" placeholder="{{translate 'YYYY-MM-DD'}}" autocomplete="off" data-format="yyyy-mm-dd" data-start-date="{{rangeFilterToMin}}" data-end-date="{{rangeFilterToMax}}" value="{{selectedRangeTo}}" data-action="range-filter" data-todayhighlight="true"/>
							
							<i class="list-header-view-accordion-body-calendar-icon"></i>
							<a class="list-header-view-accordion-body-clear" data-action="clear-value">
								<i class="list-header-view-accordion-body-clear-icon"></i>
							</a>
						</label>
					{{/if}}


					{{#if sorts}}
						<label class="list-header-view-sorts">
							<select name="sort" id="" class="list-header-view-accordion-body-select" data-action="sort">
								{{#each sorts}}
									<option value="{{value}}" data-permissions="{{permission}}" {{#if selected}} selected {{/if}}>{{name}}</option>
								{{/each}}
							</select>

							<button class="list-header-view-accordion-body-button-sort" data-action="toggle-sort">
								<i class="list-header-view-accordion-body-button-sort-up {{sortIconUp}}"></i>
								<i class="list-header-view-accordion-body-button-sort-down {{sortIconDown}}"></i>
							</button>
						</label>
					{{/if}}

					{{#if filters}}
						<label class="list-header-view-filters">
							<select name="filter" id="" class="list-header-view-accordion-body-select" data-action="filter">
								{{#each filters}}
									<option value="{{itemValue}}" class="{{cssClassName}}" data-permissions="{{permission}}" {{#if selected}} selected {{/if}}>{{name}}</option>
								{{/each}}
							</select>
						</label>
					{{/if}}
				</div>
			</div>
			{{/if}}
		</div>
	</div>
{{/if}}

{{#if showSelectAll}}
	<div class="list-header-view-select-all">
		<label class="list-header-view-select-all-label" for="select-all">
			{{#if unselectedLength}}
				<input type="checkbox" name="select-all" id="select-all" data-action="select-all">{{translate 'Select All ($(0))' collectionLength}}
			{{else}}
				<input type="checkbox" name="select-all" id="select-all" data-action="unselect-all" checked>{{translate 'Unselect All ($(0))' collectionLength}}
			{{/if}}
		</label>
	</div>
{{/if}}

{{#if showPagination}}
	<div class="list-header-view-paginator">
		<div data-view="GlobalViews.Pagination"></div>
		{{#if showCurrentPage}}
			<div data-view="GlobalViews.ShowCurrentPage"></div>
		{{/if}}
	</div>
{{/if}}