{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="item-views-option-color" data-id="{{itemOptionId}}" data-type="option" data-cart-option-id="{{cartOptionId}}">
	<p class="item-views-option-color-label">
		{{label}}
		{{#if showSelectedOption}}
			: <span>{{selectedOption.label}}</span>
		{{/if}}
	</p>
	<ul class="item-views-option-color-tiles-container" data-id="{{itemOptionId}}">
		{{#each options}}
			{{#if internalId}}
				<li>
					<a	href="{{link}}"
						class="item-views-option-color-tile {{#if isLightColor}}white-border{{/if}} {{#if isActive}}active{{/if}}  {{#unless isAvailable}}disabled{{/unless}}"
						title="{{label}}"
						data-value="{{internalId}}"
						data-toggle="set-option"
						data-active="{{isActive}}"
						data-available="{{isAvailable}}">
						{{#if isImageTile}}
							<img
								src="{{image.src}}"
								alt="{{label}}"
								width="{{image.width}}"
								height="{{image.height}}">
						{{/if}}
						{{#if isColorTile}}
						<span style="background: {{color}}"></span>
						{{/if}}
					</a>
				</li>
			{{/if}}
		{{/each}}

	</ul>
</div>