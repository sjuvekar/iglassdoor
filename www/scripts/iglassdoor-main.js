// URL for searching location .JSON
var __LOCATION_SEARCH_URL__ = "http://www.glassdoor.com/findLocationsByFullTextAjax.htm?locationSearchString="

// Glassdoor main url
var __GLASSDOOR_URL__ = "www.glassdoor.com"

/// A hash table for maintaining search get urls
//var __SEARCH_GET_URLS__ = "http://www.iglassdoor-sjuvekar.appspot.com/search?"
var __SEARCH_GET_URLS__ = "http://www.sudeep-juvekar.com/search.php?"

/// A hash table for display string after searching
__DISPLAY_STRING__ = new Object()
__DISPLAY_STRING__["jobs"] = "Jobs"
__DISPLAY_STRING__["companies"] = "Company Reviews"
__DISPLAY_STRING__["salaries"] = "Salaries"
__DISPLAY_STRING__["interviews"] = "Interviews"


/// A method to set cookie
var setCookie = function(cookieName) {
	$.cookie("rm", cookieName, {domain: "www.glassdoor.com"});
}


var delegateSearchClick = function(tabName, passed_url) {
	$.mobile.showPageLoadingMsg();
	clearStuff(tabName);
	if (passed_url && passed_url != "") {
		handleAppropriateClick(tabName, passed_url);
	}
    else {
    	locId = "";
    	locT = "";
    	company = $("#search-" + tabName).val();
		if (!company || company === "") {
            $.mobile.hidePageLoadingMsg();
            alert("Please enter a company name");
			return;
		}
		company = company.replace(/\s/g, "-");
		url = __SEARCH_GET_URLS__ + "type=" + tabName + "&company=" + company
        my_title = $("#search-" + tabName + "-title").val();
        if (my_title && my_title != "") {
            my_title = my_title.replace(/\s/g, "-");
            url += "&title=" + my_title;
        }
		my_location = $("#search-" + tabName + "-location").val();
		my_location = my_location.replace(/\s/g, "-");	
		if (my_location && my_location != "") {
            $("#search-" + tabName + "-collapsible").trigger("collapse");
            $.getJSON(__LOCATION_SEARCH_URL__ + my_location + "&callback=", function(data) {
				if (data.locations.length == 0) {
					url += "&callback=?";
		                handleAppropriateClick(tabName, url);
				}
				first_location = data.locations[0];
				locId = first_location.id;
				locT = first_location.type;
				url += "&locId=" + locId + "&locT=" + locT + "&callback=?"; 
				handleAppropriateClick(tabName, url);
			});
		}
		else {
			url += "&callback=?";
			handleAppropriateClick(tabName, url);
		}
    }
}


var handleAppropriateClick = function(tabName, url) {
	if (tabName === "jobs")
		handleJobsClick(tabName, url);
	else if (tabName === "salaries")
		handleSalariesClick(tabName, url);
	else if (tabName === "companies")
		handleCompaniesClick(tabName, url);
	else if (tabName === "interviews")
		handleInterviewsClick(tabName, url);
};


/// Add link pages
var addPageLinks = function(data, tabName) {
	return_html = $(data.contents);
	pages = return_html.find("div.pagingControls");
	if (pages && pages.length > 0) {
		all_links = pages.find("li");
		var my_length = 0;
		for (var i = 0; i < all_links.length; i++) {
			if ($(all_links[i]).is(".prevBtn,.currPage,.seqBreak,.nextBtn")) continue;
			a = $(all_links[i]).find("a");
			$("#pages-" + tabName)
    			.append($("<li></li>")
    				.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + a.attr("href")).addClass("pagelinks-" + tabName)
    					.append($("<h1></h1>").html("Page: " + a.text())
    		)));
			my_length += 1;
			$("#pages-" + tabName).listview("refresh");
		}
		if (my_length > 0)
			$("#inset-" + tabName).prepend($("<h3></h3>").html("More Results"));
		
	}
	
	$("a.pagelinks-" + tabName).click( function(event) {
		url = $(this).data("href");
		event.preventDefault();
		delegateSearchClick(tabName, __SEARCH_GET_URLS__ + "url=" + url);
	});
}


/// Clear all divs
var clearStuff = function(tabName) {
	$("#results-" + tabName).empty();
	$("#results-" + tabName + "-header").empty();
	$("#pages-" + tabName).empty();
	$("#inset-" + tabName).html("");
	$("#results-" + tabName + "-alt").empty();
	$("#results-" + tabName + "-header-alt").empty();
}


/// A global document oninit method
$(document).bind("pageinit", function(event) {
	
    $("#search-jobs-button").click(  function() { delegateSearchClick("jobs"); });
    $("#search-companies-button").click(  function() { delegateSearchClick("companies"); });
    $("#search-salaries-button").click(  function() { delegateSearchClick("salaries"); });
    $("#search-interviews-button").click(  function() { delegateSearchClick("interviews"); });

    /// Events after clicking Blog in more
    $("#iglassdoor-blog").live("pageshow", function() { handleBlogClick(); });
    
    /// Events after clicking Twitter in more
    $("#iglassdoor-twitter").live("pageshow", function() { handleTwitterClick(); });

});
