var handleCompaniesClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
	url = getURL(tabName);
    $.getJSON(url, function(data){
    	$.mobile.hidePageLoadingMsg();
        companies = data.companies_list;
        for (var i = 0; i < companies.length; i++) {
        	$el = $("<li></li>")
        	if (companies[i].url != null) {
        		$el.append("<a></a>").attr("href", __GLASSDOOR_URL__ + companies[i].url);
        	}
        	$el.append($("<h1></h1>").html(companies[i].title).css("white-space", "normal"));
        	if (companies[i].Rating != null) {
        		$el.append($("<p></p>").html("Average Rating: " + companies[i].Rating).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
        	} 
        	if (companies[i].description != null) {
        		$el.append($("<p></p>").html(companies[i].description).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
        	}
            $("#results-" + tabName).append($el);
        }
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}