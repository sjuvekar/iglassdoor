var createInterviewCompanyDomElement = function(interviewCompanyListing) {
	var title = "";
	var url = "";
	description = "";
	companyDataLink = $(interviewCompanyListing).find("h3.tightTop").find("a");
	companyData = $(interviewCompanyListing).find("p.tightBot");
	if (companyDataLink == undefined && companyData == undefined)
		return undefined;
	if (companyDataLink) {
		title = companyDataLink.text();
		url = companyDataLink.attr("href");
	}
	if (companyData)
		description = companyData.text();
	el = $("<li></li>")
			.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "_blank")
				.append($("<h1></h1>").html(title).css("white-space", "normal"))
					.append($("<p></p>").html(description).css("white-space", "normal"))
		);
	return el;
}

var handleInterviewsClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
	url = getURL(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents);
    	all_employers = return_html.find("p.seeAllEmployersLink").find("a");
    	if (all_employers)
    		$("#results-" + tabName + "-header")
    			.append($("<a></a>").attr("href", all_employers.attr("href")).attr("target", "_blank")
    				.append($("<h3>" + all_employers.text() + "</h3>"))
    		);
    	searchResultCf = return_html.find(".searchResult.cf");
        for (var i = 0; i < searchResultCf.length; i++) {
        	el = createInterviewCompanyDomElement(searchResultCf[i]);
        	if (el == undefined) continue;
        	$("#results-" + tabName).append(el);
            $("#results-" + tabName).listview("refresh");
        }
        
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
