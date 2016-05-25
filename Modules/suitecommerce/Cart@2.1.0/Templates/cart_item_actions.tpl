{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if isAdvanced}}
	<div class="cart-item-actions-item-list-actionable-edit-button">
		<a href="{{item._editUrl}}" data-toggle="show-in-modal" class="cart-item-actions-item-list-actionable-edit-button-edit">{{translate 'Edit'}}</a>
		<button type="button" class="cart-item-actions-item-list-actionable-edit-button-drop" data-toggle="dropdown">
			<i></i>
		</button>
		<ul class="cart-item-actions-item-list-actionable-edit-content" role="menu">
			<li>
				<a class="cart-item-actions-item-list-actionable-edit-content-remove" data-action="remove-item" data-internalid="{{lineId}}">
					{{translate 'Remove'}}
				</a>
			</li>
			<li>
				{{#if showSaveForLateButton}}
					<a class="cart-item-actions-item-list-actionable-edit-content-saveforlater" data-action="save-for-later-item" data-internalid="{{lineId}}">
						{{translate 'Save for Later'}}
					</a>
				{{/if}}
			</li>
		</ul>
	</div>
{{else}}
	<a class="cart-item-actions-item-list-actionable-edit-content-remove-sb" data-action="remove-item" data-internalid="{{lineId}}">
		{{translate 'Remove'}}
	</a>
{{/if}}
