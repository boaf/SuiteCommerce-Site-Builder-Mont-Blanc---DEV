{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="return-authorization-cancel-modal">
	<h4>{{translate 'Are you sure you want to cancel this return request?'}}</h4>
	<p>{{translate 'The status of the request will change to "Cancelled" but it won\'t be removed.'}}</p>
	<div class="return-authorization-cancel-modal-actions">
		<button class="return-authorization-cancel-modal-cancel-button" data-action="delete">
			{{translate 'Cancel Return'}}
		</button>
		<button class="return-authorization-cancel-modal-close-button" data-dismiss="modal" data-action="cancel">
			{{translate 'Close'}}
		</button>
	</div>
</div>