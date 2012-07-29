var createCompaniesElement = function(company_data) {
	var title = "";
	var url = "";
	var tightTop = $(company_data).find("h3.tightTop").find("a");
	if (tightTop && tightTop.length > 0) {
		title = tightTop.text();
		url = tightTop.attr("href");
	}
	el = $("<li></li>").attr("data-role", "list-divider").attr("data-theme", "a")
			.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "_blank")
				.append($("<h2></h2>").html(title + " (more...)").css("white-space", "normal"))
		);
	return el;
}


var createCompaniesSnippetElement = function(company_data) {
	var employee = "";
	var summary = "";
	var employee_url = "";
	var reviewSnippet = $(company_data).find("div.reviewSnippet");
	if (reviewSnippet && reviewSnippet.length > 0) {
		p = reviewSnippet.find("p");
		if (p.length > 1)
			employee = $(p[0]).find("strong").text() + " said";
		reviewSummary = reviewSnippet.find("p.reviewSummary").find("a");
		if (reviewSummary && reviewSummary.length > 0) {
			employee_url = reviewSummary.attr("href");
			summary = reviewSummary.html();
		}
	}
	summary = $("<li></li>")
				.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + employee_url).attr("target", "_blank")
					.append($("<h1></h1>").html(employee).css("white-space", "normal"))
						.append($("<p></p>").html(summary).css("white-space", "normal"))
	);
	return summary;
}

var handleCompaniesClick = function(tabName, passed_url) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
    if (passed_url)
		url = __SEARCH_GET_URLS__ + "url=" + passed_url;
	else
		url = getURL(tabName);
    $.getJSON(url, function(data){
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents)
        companies = return_html.find("div");
    	var my_length = 0;
        for (var i = 0; i < companies.length; i++) {
        	my_id = $(companies[i]).attr("id");
        	if (my_id && my_id.match("SearchResult_.*")) {
        		my_length += 1;
        		var el = createCompaniesElement(companies[i]); 
        		var snippet = createCompaniesSnippetElement(companies[i]);
        		$("#results-" + tabName).append(el);
        		$("#results-" + tabName).append(snippet);
        	}
        }
        if (my_length > 0)
        	$("#results-" + tabName + "-header").append($("<h2>Showing " + my_length + " results</h2>"));
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}