{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if isCreditCards}}
	{{#if isVisaMasterOrDiscoverAvailable}}
		<p>{{translate 'VISA/Mastercard/Discover'}}</p>
		<p><img src="{{imageCvvAllCardsURL}}" alt=""></p>
	{{/if}}
	
	{{#if isAmexAvailable}}
		<p>{{translate 'American Express'}}</p>
		<p><img src="{{imageCvvAmericanCardURL}}" alt=""></p>
	{{/if}}
{{else}}
	<p>{{translate 'VISA/Mastercard/Discover'}}</p>
	<p><img src="{{imageCvvAllCardsURL}}" alt=""></p>

	<p>{{translate 'American Express'}}</p>
	<p><img src="{{imageCvvAmericanCardURL}}" alt=""></p>
{{/if}}


