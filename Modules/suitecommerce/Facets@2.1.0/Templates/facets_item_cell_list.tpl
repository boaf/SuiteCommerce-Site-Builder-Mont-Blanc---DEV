{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="facets-item-cell-list" itemprop="itemListElement"  data-item-id="{{itemId}}" itemscope itemtype="http://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
	<div class="facets-item-cell-list-left">
		<div class="facets-item-cell-list-image-wrapper">
			{{#if itemIsNavigable}}
				<a class="facets-item-cell-list-anchor" href='{{url}}'>
					<img class="facets-item-cell-list-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image">
				</a>
			{{else}}
				<img class="facets-item-cell-list-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image">
			{{/if}}
			{{#if isEnvironmentBrowser}}
				<div class="facets-item-cell-list-quick-view-wrapper">
					<a href="{{url}}" class="facets-item-cell-list-quick-view-link" data-toggle="show-in-modal">
						<i class="facets-item-cell-list-quick-view-icon"></i>
						{{translate 'Quick View'}}
					</a>
				</div>
			{{/if}}
		</div>
	</div>
	<div class="facets-item-cell-list-right">
		<meta itemprop="url" content="{{url}}">
		<h2 class="facets-item-cell-list-title">
			{{#if itemIsNavigable}}
				<a class="facets-item-cell-list-name" href='{{url}}'>
					<span itemprop="name">
						{{name}}
					</span>
				</a>
			{{else}}
				<span itemprop="name">
					{{name}}
				</span>
			{{/if}}
		</h2>

		<div class="facets-item-cell-list-price">
			<div data-view="ItemViews.Price"></div>
		</div>

		{{#if showRating}}
		<div class="facets-item-cell-list-rating" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating"  data-view="GlobalViews.StarRating">
		</div>
		{{/if}}

		<div data-view="ItemDetails.Options"></div>

		{{#if canAddToCart}}
			<form class="facets-item-cell-list-add-to-cart" data-toggle="add-to-cart">
				<input class="facets-item-cell-list-add-to-cart-itemid" type="hidden" value="{{itemId}}" name="item_id">
				<input class="facets-item-cell-list-add-to-cart-quantity" name="quantity" type="number" min="1" value="{{minQuantity}}">
				<input class="facets-item-cell-list-add-to-cart-button" type="submit" value="{{translate 'Add to Cart'}}">
			</form>
		{{/if}}
		<div class="facets-item-cell-list-stock">
			<div data-view="ItemViews.Stock"></div>
		</div>
	</div>
</div>
