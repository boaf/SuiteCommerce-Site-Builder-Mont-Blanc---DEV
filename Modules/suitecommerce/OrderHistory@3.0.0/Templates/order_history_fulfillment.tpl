{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-history-fulfillment-container">
	<div class="order-history-fulfillment-header" data-id="{{model.internalid}}">
		<div class="order-history-fulfillment-header-container">
			{{#if showDeliveryStatus}}
				<div class="order-history-fulfillment-header-col">
					<span class="order-history-fulfillment-shipped-status-label">{{translate 'Status: '}}</span> 
					<span class="order-history-fulfillment-shipped-status-value">{{deliveryStatus}}</span>
				</div>
			{{/if}}
			{{#if showDeliveryMethod}}
				<div class="order-history-fulfillment-header-col">
					<span class="order-history-fulfillment-delivery-label">
						{{translate 'Delivery Method: '}}
					</span>
					<span class="order-history-fulfillment-delivery-value">
						{{#if showDeliveryMethod}}
							{{deliveryMethodName}}
						{{/if}}
					</span>
				</div>
			{{/if}}
			{{#if showDate}}
				<div class="order-history-fulfillment-header-col">
					<span class="order-history-fulfillment-shipped-date-label">{{translate 'Shipped on: '}}</span> 
					<span class="order-history-fulfillment-shipped-date-value">{{date}}</span>
				</div>
			{{/if}}
			<div data-view="TrackingNumbers"></div>
		</div>
	</div>

	<div class="order-history-fulfillment-body">
		<table class="order-history-fulfillment-items-table">
			<tbody data-view="Items.Collection">
			</tbody>
		</table>
	</div>
</div>
