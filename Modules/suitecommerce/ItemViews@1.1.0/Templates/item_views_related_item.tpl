{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div itemprop="itemListElement" data-item-id="{{itemId}}" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
	<a class="item-views-related-item-thumbnail" {{linkAttributes}}>
		<img src="{{resizeImage thumbnailURL 'thumbnail'}}" alt="{{thumbnailAltImageText}}" />
	</a>
	<a {{linkAttributes}} class="item-views-related-item-title">
		<span itemprop="name">{{itemName}}</span>
	</a>
	<div class="item-views-related-item-price" data-view="Item.Price">
	</div>

	{{#if showRating}}
	<div class="item-views-related-item-rate" data-view="Global.StarRating">
	</div>
	{{/if}}
</div>
