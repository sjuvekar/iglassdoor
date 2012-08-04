var createCompaniesElement = function(company_data) {
	var title = "";
	var url = "";
	var tightTop = $(company_data).find("h3.tightTop").find("a");
	if (tightTop && tightTop.length > 0) {
		title = tightTop.text();
		url = tightTop.attr("href");
	}
	a_element = $("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
					.append($("<h2></h2>").html(title + " (more...)").css("white-space", "normal"));
	a_element.click( function(event) {
		event.preventDefault();
		delegateSearchClick("companies", __SEARCH_GET_URLS__ + "url=" + __GLASSDOOR_URL__ + url);
	});
	el = $("<li></li>").attr("data-role", "list-divider").attr("data-theme", "a").append(a_element);
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
				.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + employee_url).attr("target", "_blank")
					.append($("<h1></h1>").html(employee).css("white-space", "normal"))
						.append($("<p></p>").html(summary).css("white-space", "normal"))
	);
	return summary;
}


var createSingleCompanyHeader = function(company_data) {
	title = "";
	url = "";
	url_tag = $(company_data).find("p.seeMore").find("a");
	url = url_tag.attr("href");
	title = url_tag.text();
	a_element = $("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
					.append($("<h2></h2>").html(title).css("white-space", "normal"));
	a_element.click( function(event) {
		event.preventDefault();
		delegateSearchClick("companies", __SEARCH_GET_URLS__ + "url="  + __GLASSDOOR_URL__ + url);
	});
	el = $("<li></li>").attr("data-role", "list-divider").attr("data-theme", "a").append(a_element);
	return el;
}


var createSingleCompanyElement = function(company_data) {
	snippet = "";
	author = "";
	description = "";
	all_divs = $(company_data).find("div");
	for (var i = 0; i < all_divs.length; i++) {
		my_id = $(all_divs[i]).attr("id");
		if (my_id && my_id.match("EmpReview_chart_.*")) {
			snippet = $(all_divs[i]).html();
			break;
		}
	}
	author = $(company_data).find("p.authorInfo").text();
	description = $(company_data).find("div.description");
	all_as = description.find("a");
	for (var i = 0; i < all_as.length; i++) {
		$(all_as[i]).attr("href", "http://" + __GLASSDOOR_URL__ + $(all_as[i]).attr("href"));
		$(all_as[i]).attr("target", "_blank");
	}
	desc_el = ""
	if (author && description && author.length > 0 && description.length > 0)
		desc_el = $("<p><h2>Example Review:</h2></p>");
	el = $("<li></li>")
			.append($("<p></p>").html(snippet).css("white-space", "normal"))
				.append(desc_el)
					.append($("<p></p>").html(author).css("white-space", "normal"))
						.append($("<p></p>").html(description.html()).css("white-space", "normal"));
	return el;
}


var createAllReviewElement = function(review_element) {
	var title = "";
	var url = "";
	var description = "";
	summary_a = $(review_element).find("h2.summary").find("a");
	title = summary_a.text();
	url = summary_a.attr("href");
	description_el = $(review_element).find("div.description");
	all_ps = description_el.find("p");
	for (var i = 0; i < all_ps.length; i++)
		description += $(all_ps[i]).html() + "<br>";
	el = $("<li></li>")
			.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
				.append($("<h1></h1>").html(title).css("white-space", "normal"))
					.append($("<p></p>").html(description).css("white-space", "normal"))
			);
	return el;
}


var handleCompaniesClick = function(tabName, url) {
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
        else {
        	company_data = return_html.find("div#OverviewReview");
        	if (company_data && company_data.length > 0) {
        		header_el = createSingleCompanyHeader(company_data);
        		el = createSingleCompanyElement(company_data);
        		$("#results-" + tabName).append(header_el);
        		$("#results-" + tabName).append(el);
        		$("#results-" + tabName).append(snippet);
        	}
        	else {
        		all_reviews = return_html.find("div.employerReview");
        		var review_length = 0;
        		for (var i = 0; i < all_reviews.length; i++) {
        			el = createAllReviewElement(all_reviews[i]);
        			$("#results-" + tabName).append(el);
        			review_length += 1;
        		}
        		if (review_length == 0)
        			$("#results-" + tabName + "-header").append($("<h2>No results found</h2>"));
        	}
        }
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
