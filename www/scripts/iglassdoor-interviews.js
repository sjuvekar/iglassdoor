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
	el = $("<li></li>")
			.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "_blank")
				.append($("<h1></h1>").html(title).css("white-space", "normal"))
					.append($("<p></p>").html(description).css("white-space", "normal"))
		);
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
	.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "_blank")
		.append($("<h1></h1>").html(title).css("white-space", "normal"))
			.append($("<p></p>").html(description).css("white-space", "normal"))
	);
	return el;
}

var printEmployerHeader = function(return_html) {
	if (return_html.find("p.seeAllEmployersLink").length > 0) {
		all_employers = return_html.find("p.seeAllEmployersLink").find("a");
		el = $("<a></a>").attr("href", all_employers.attr("href")).attr("target", "_blank")
				.append($("<h2>" + all_employers.text() + "</h2>"));
		return el;
	}
	return undefined;
}

var handleInterviewsClick = function(tabName, passed_url) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
    if (passed_url)
		url = __SEARCH_GET_URLS__ + "url=" + passed_url;
	else
		url = getURL(tabName);
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
        $("#results-" + tabName + "-header-alt").append($("<h2>More Interview Questions</h2>"))
        interviewQuestionList = return_html.find("div.interviewQuestionsList").find("div");
        for(var i = 0; i < interviewQuestionList.length; i++) {
        	my_id = $(interviewQuestionList[i]).attr("id");
        	if (!my_id || !my_id.match("InterviewQuestionResult_.*"))
        		continue;
        	el = createInterviewElement(interviewQuestionList[i]);
        	if (el === undefined) continue;
        	$("#results-" + tabName + "-alt").append(el);
            $("#results-" + tabName + "-alt").listview("refresh");
        }
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
