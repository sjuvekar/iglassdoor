/// A method to handle click event for a given tab. Pass appropriate tab string name
var handleJobsClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
	clearStuff(tabName);
	url = getURL(tabName);
	$.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents)
    	jobs = return_html.find("div.jobListing");
    	for (var i = 0; i < jobs.length; i++) {
    		jobTitle = $(jobs[i]).find("h3.jobTitle");	
        	jobListingData = $(jobs[i]).find("div.jobListingData")[0];
        	title = $(jobTitle).find("strong")[0];
        	url = $(jobTitle).find("a").attr("href");
        	job_location = $(jobListingData).find("span.location")[0];
        	description = $(jobListingData).find("p.desc")[0];
            
        	$("#results-" + tabName)
              .append($("<li></li>")
                .append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "blank")
                    .append($("<h1></h1>").html(title).css("white-space", "normal"))
                        .append($("<p></p>").html(job_location).css("margin-left", "10px").css("white-space", "normal"))
                        		.append(description).css("white-space", "normal")
            ));
        }
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}