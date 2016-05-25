{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="global-views-message {{type}} alert" role="alert">
	<div>
		{{#if showMultipleMessage}}
			<ul>
			{{#each messages}}
				<li>{{{this}}}</li>
			{{/each}}
			<ul>
		{{else}}
			{{{message}}}
		{{/if}}
	</div>
	{{#if closable}}
		<button class="global-views-message-button" data-action="close-message" type="button" data-dismiss="alert">&times;</button>
	{{/if}}
</div>
