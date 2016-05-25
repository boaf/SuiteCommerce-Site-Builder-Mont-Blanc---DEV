{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<aside class="merchandising-zone">
	<h3> {{translate zoneTitle}}</h3>
	{{#if isZoneDescription}}
		<p class="merchandising-zone-description"> {{zoneDescription}} </p>
	{{/if}}

	<div class="merchandising-zone-container">
		<div data-view="Zone.Items"></div>
	</div>
</aside>