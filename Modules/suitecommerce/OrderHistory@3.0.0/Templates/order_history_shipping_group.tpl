{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-history-shipping-group-shipping-information" data-id="{{model.shipaddress.internalid}}">
	<h3 class="order-history-shipping-group-shipping-title">{{translate 'Shipped Items'}}</h3>
	<div class="order-history-shipping-group-shipping-accordion-divider">
		<div class="order-history-shipping-group-accordion-head">
			
			<a class="order-history-shipping-group-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#{{targetAddressId}}" aria-expanded="true" aria-controls="unfulfilled-items">
				{{#if showOrderAddress}}
					{{translate 'Ship to:'}} 
					<span class="order-history-shipping-group-shipto-name">{{orderAddress}}</span>
				{{else}}
					{{translate 'Shipping Address'}}
				{{/if}}
				<i class="order-history-shipping-group-accordion-toggle-icon-secondary"></i>
			</a>
		</div>
		<div class="order-history-shipping-group-accordion-body collapse" id="{{targetAddressId}}" role="tabpanel" data-target="#{{targetAddressId}}">
			<div class="order-history-shipping-group-accordion-container">
				<div class="order-history-shipping-group-info-card-container">
					<!-- SHIPPING INFORMATION -->
					<div class="order-history-shipping-group-info-card">
						<h5 class="order-history-shipping-group-info-card-title">
							{{translate 'Shipping Address'}}
						</h5>
						<div class="order-history-shipping-group-info-card-info-shipping">
							<div data-view="Shipping.Address.View"></div>
						</div>
					</div>
					<div class="order-history-shipping-group-info-card">
						<h5 class="order-history-shipping-group-info-card-title">
							{{translate 'Delivery Method'}}
						</h5>
						<div class="order-history-shipping-group-info-card-info">
							<div class="order-history-shipping-group-details-info-card-delivery-method">
								{{deliveryMethodName}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	{{#if showFulfillment}}
		<div class="order-history-shipping-group-acordion-divider">

			{{#if showFulfillmentAcordion}}
				<div class="order-history-shipping-group-accordion-head">
					<a class="order-history-shipping-group-accordion-head-toggle {{initiallyCollapsedArrow}}" data-toggle="collapse" data-target="#{{targetId}}" aria-expanded="true" aria-controls="unfulfilled-items">
						{{translate 'Products shipped'}}
						<i class="order-history-shipping-group-accordion-toggle-icon"></i>
					</a>
				</div>
				<div class="order-history-shipping-group-accordion-body collapse {{initiallyCollapsed}}" id="{{targetId}}" role="tabpanel" data-target="#{{targetId}}">
					<div class="order-history-shipping-group-accordion-container" data-content="order-items-body">
						<div data-view="Fullfillments.Collection"></div>
					</div>
				</div>
			{{else}}
				<div class="order-history-shipping-group-body-no-header collapse in" id="{{targetId}}" role="tabpanel" data-target="#{{targetId}}">
					<div class="order-history-shipping-group-accordion-container" data-content="order-items-body">
						<div data-view="Fullfillments.Collection"></div>
					</div>
				</div>
			{{/if}}
		</div>
	{{/if}}

	{{#if showPendingLines}}
	<div class="order-history-shipping-group-acordion-divider">

		<div class="order-history-shipping-group-accordion-head">
			<a class="order-history-shipping-group-accordion-head-toggle-secondary collapsed" data-toggle="collapse" data-target="#{{targetPendingId}}" aria-expanded="true" aria-controls="unfulfilled-items">
				{{translate 'Products pending shipment'}}
				<i class="order-history-shipping-group-accordion-toggle-icon-secondary"></i>
			</a>
		</div>

		<div class="order-history-shipping-group-accordion-body collapse" id="{{targetPendingId}}" role="tabpanel" data-target="#{{targetPendingId}}">
			<div class="order-history-shipping-group-accordion-container" data-content="order-items-body">
				<table data-view="PendingLines" class="order-history-shipping-group-pending-table"></table>
			</div>
		</div>
	</div>
	{{/if}}
</div>
