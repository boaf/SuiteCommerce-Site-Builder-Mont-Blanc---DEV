{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="global-views-confirmation-body">
	{{body}}
</div>
<div class="global-views-confirmation-footer">
	<button class="global-views-confirmation-confirm-button" data-action="confirm">
		{{#if hasConfirmLabel}}
			{{confirmLabel}}
		{{else}}
			{{translate 'Yes'}}
		{{/if}}
	</button>
	<button class="global-views-confirmation-cancel-button" data-dismiss="modal" data-action="cancel">
		{{#if hasCancelLabel}}
			{{cancelLabel}}
		{{else}}
			{{translate 'Cancel'}}
		{{/if}}
	</button>
</div>