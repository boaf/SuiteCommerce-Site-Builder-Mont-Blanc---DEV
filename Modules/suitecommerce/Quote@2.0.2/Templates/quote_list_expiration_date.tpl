{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<span class="quote-list-expiration-date">
	{{#if model.duedate}}
		{{#if model.isOverdue}}
			<span class="quote-list-expiration-date-overdue">{{model.duedate}}</span> <i class="quote-list-expiration-date-icon-flag"></i>
		{{else}}
			{{#if model.isCloseOverdue}}
				<span class="quote-list-expiration-date-closeoverdue">{{model.duedate}}</span> <i class="quote-list-expiration-date-icon-flag"></i>
			{{else}}
				{{model.duedate}}
			{{/if}}
		{{/if}}
	{{else}}
		<span>{{translate 'Not specified'}}</span>
	{{/if}}
</span>