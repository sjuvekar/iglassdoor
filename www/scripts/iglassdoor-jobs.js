/// Create a new dom element to insert in the page given original element
var createJobDomElement = function(jobListing) {
	var title = "";
	var url = "";
	var job_location = "";
	var job_description = "";
	jobTitle = $(jobListing).find("h3.jobTitle");
	jobListingData = $(jobListing).find("div.jobListingData");
	if (jobTitle == undefined && jobListingData == undefined)
		return undefined;
	if (jobTitle) {
		var a = jobTitle.find("a");
		if (a) {
			title = a.text();
			url = a.attr("href");
		}
	}
	if (jobListingData) {
		job_location = jobListingData.find("span.location").text();
		job_description = jobListingData.find("p.desc").text();
	}
	el = $("<li><li>")
		.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
			.append($("<h1></h1>").html(title).css("white-space", "normal"))
				.append($("<p></p>").html(job_location).css("margin-left", "10px"))
					.append($("<p></p>").html(job_description).css("white-space", "normal"))
		);
	return el;
}

/// A method to handle click event for a given tab. Pass appropriate tab string name
var handleJobsClick = function(tabName, url) {
	$.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents);
    	new_h1 = return_html.find("h1.pad, h1.h");
    	if (new_h1 && new_h1 != "")
    		$("#results-" + tabName + "-header").append($("<b>" + new_h1.text() + "</b>"));
    	jobs = return_html.find("div.jobListing");
    	for (var i = 0; i < jobs.length; i++) {
    		var el = createJobDomElement(jobs[i]);
    		if (el)
    			$("#results-" + tabName).append(el);
        }
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
