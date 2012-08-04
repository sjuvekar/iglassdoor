var printEmployerHeader = function(return_html) {
	if (return_html.find("p.seeAllEmployersLink").length > 0) {
		all_employers = return_html.find("p.seeAllEmployersLink").find("a");
		url = all_employers.attr("href");
		el = $("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank").addClass("iglassdoor-interviews-employer")
				.append($("<h2>" + all_employers.text() + "</h2>"));
		el.click( function(event) {
			event.preventDefault();
			delegateSearchClick("interviews", __SEARCH_GET_URLS__ + "url=" + __GLASSDOOR_URL__ + url);
		});
		return el;
	}
	return undefined;
}


var createInterviewCompanyDomElement = function(interviewCompanyListing) {
	var title = "";
	var url = "";
	var description = "";
	companyDataLink = $(interviewCompanyListing).find("h3.tightTop").find("a");
	companyData = $(interviewCompanyListing).find("p.tightBot");
	if (companyDataLink === undefined && companyData === undefined)
		return undefined;
	if (companyDataLink) {
		title = companyDataLink.text();
		url = companyDataLink.attr("href");
	}
	if (companyData)
		description = companyData.text();
	a_element = $("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
					.append($("<h1></h1>").html(title).css("white-space", "normal"))
						.append($("<p></p>").html(description).css("white-space", "normal"));
	a_element.click( function(event) {
		event.preventDefault();
		delegateSearchClick("interviews", __SEARCH_GET_URLS__ + "url=" + __GLASSDOOR_URL__ + url);
	});
	el = $("<li></li>").append(a_element);
	return el;
}


var createInterviewElement = function(interviewQuestion) {
	var title = "";
	var url = "";
	var description = "";
	interview_title = $(interviewQuestion).find("h3").find("a");
	interview_detail = $(interviewQuestion).find("p.questionText");
	if (interview_title === undefined && interview_detail === undefined)
		return undefined;
	if (interview_title) {
		title = interview_title.text();
		url = interview_title.attr("href");
	}
	if (interview_detail)
		description = interview_detail.text();
	el = $("<li></li>")
	.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
		.append($("<h1></h1>").html(title).css("white-space", "normal"))
			.append($("<p></p>").html(description).css("white-space", "normal"))
	);
	return el;
}


var createInterviewDetailElement = function(singleQuestion) {
	var url = "";
	var title = "";
	var description = "";
	var question = "";
	header_div = $(singleQuestion).find("div.header").find("a");
	url = header_div.attr("href");
	title = header_div.text();
	all_ps = $(singleQuestion).find("p");
	for (var i = 0; i < all_ps.length; i++) {
		my_id = $(all_ps[i]).attr("id");
		if (my_id && my_id.match("Process-.*")) {
			description = $(all_ps[i]).text();
			break;
		}
	}
	question = $(singleQuestion).find("div.question").text();
	el = $("<li></li>")
		.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
			.append($("<h1></h1>").html(title).css("white-space", "normal"))
				.append($("<p></p>").html(description).css("white-space", "normal"))
					.append($("<p></p>").html("<b>Question: </b>" + question).css("white-space", "normal"))
	);
	return el;
}


var handleInterviewsClick = function(tabName, url) {
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents);
    	el = printEmployerHeader(return_html)
    	if (el)
    		$("#results-" + tabName + "-header").append(el)
    	searchResultCf = return_html.find(".searchResult.cf");
        for (var i = 0; i < searchResultCf.length; i++) {
        	el = createInterviewCompanyDomElement(searchResultCf[i]);
        	if (el === undefined) continue;
        	$("#results-" + tabName).append(el);
            $("#results-" + tabName).listview("refresh");
        }
        interviewQuestionList = return_html.find("div.interviewQuestionsList").find("div");
        var my_length = 0;
        for(var i = 0; i < interviewQuestionList.length; i++) {
        	my_id = $(interviewQuestionList[i]).attr("id");
        	if (!my_id || !my_id.match("InterviewQuestionResult_.*"))
        		continue;
        	el = createInterviewElement(interviewQuestionList[i]);
        	if (el === undefined) continue;
        	my_length += 1;
        	$("#results-" + tabName + "-alt").append(el);
            $("#results-" + tabName + "-alt").listview("refresh");
        }
        if  (my_length > 0)
        	$("#results-" + tabName + "-header-alt").append($("<h2>Interview Questions</h2>"));
        else {
        	all_divs = return_html.find("div.interviewReview");
        	for(var i = 0; i < all_divs.length; i++) {
        		el = createInterviewDetailElement(all_divs[i]);
        		$("#results-" + tabName + "-alt").append(el);
                $("#results-" + tabName + "-alt").listview("refresh");
        	}
        }
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
