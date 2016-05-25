/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

function service(request, response) {
	var tree = {};
 	processCategories(tree, loadCategories(request.getParameter("catId")));

	response.setContentType("JSON");
	response.write(JSON.stringify(tree)); 	
}

function processCategories(tree, cats) {	
	for(var i = 0; i < cats.length; i++) {
		var cat = cats[i];
		
		if(cat.itemtype === "sitecategory") {
		  	tree[cat.urlcomponent] = {
		  								internalid:cat.internalid, 
		  								id:cat.itemid, 
		  								desc:cat.storedetaileddescription,
		  								title:cat.pagetitle2, 
		  								thumbnail:cat.storedisplaythumbnail,
		  								sub:{}
		  							};		 

		  	processCategories(tree[cat.urlcomponent].sub, loadCategories(cat.internalid));	
		}
	}	
}	

function loadCategories(catId) {
	 return nlapiGetWebContainer().getShoppingSession().getSiteCategoryContents({internalid:catId});
}