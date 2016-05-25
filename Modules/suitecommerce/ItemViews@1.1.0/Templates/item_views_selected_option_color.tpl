{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showOption}}
	<div class="item-views-selected-option-color">
		<ul class="item-views-selected-option-color-tiles-container">
			<li class="item-views-selected-option-color-label">
				<label class="item-views-selected-option-color-label-text">{{label}}:</label>
			</li>
			<li>
				<span class="item-views-selected-option-color-tile">
					{{#if isImageTile}}
						<img 
							src="{{image.src}}" 
							alt="{{value}}"
							width="{{image.width}}" 
							height="{{image.height}}">
					{{/if}}
					{{#if isColorTile}}
						<span {{#if isLightColor}}class="white-border"{{/if}} style="background: {{color}}"></span>
					{{/if}}
				</span>
			</li>
			<li class="item-views-selected-option-color-text">
				{{value}}
			</li>
		</ul>
	</div>
{{/if}}