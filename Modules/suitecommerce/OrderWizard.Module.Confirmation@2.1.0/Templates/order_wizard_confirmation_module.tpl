{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="order-wizard-confirmation-module alert fade in">
	<h2 class="order-wizard-confirmation-module-title">{{translate 'Thank you for shopping with us!'}}</h2>
	<p class="order-wizard-confirmation-module-body" name="orderNumber">{{translate 'Your order number is'}}
		{{#if isGuestAndCustomerCenter}}
			<a href="#" data-touchpoint="customercenter" data-hashtag="#/purchases/view/salesorder/{{orderId}}">{{confirmationNumber}}</a>.
		{{else}}
			{{confirmationNumber}}
		{{/if}}
	</p>
	<p class="order-wizard-confirmation-module-body">{{translate 'We received your order and will process it right away.'}}</p>
	{{#if additionalConfirmationMessage}}
		<p class="order-wizard-confirmation-module-body" data-type="additional-confirmation-message">{{additionalConfirmationMessage}}</p>
	{{/if}}
	<a class="order-wizard-confirmation-module-continue" href="{{continueURL}}" {{#if touchPoint}}data-touchpoint="home"{{/if}} data-hashtag="#/">{{translate 'Continue shopping'}}</a>
		<!-- DOWNLOAD AS PDF -->
	<a href="{{pdfUrl}}" target="_blank" class="order-wizard-confirmation-module-download-pdf">
		{{translate 'Download PDF'}}
	</a>
</div>