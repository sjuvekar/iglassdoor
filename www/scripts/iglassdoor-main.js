// URL for searching location .JSON
var __LOCATION_SEARCH_URL__ = "http://www.glassdoor.com/findLocationsByFullTextAjax.htm?locationSearchString="
var __HARDCODED_COOKIE__ = '"c3VkanV2ZWthckB5YWhvby5jb206MTM3Mjg5NDg1MTIzMjpmMWY3NjVmZTRhZjkzNjM1YzQ4ZGQ5ODQ5MmU4YTBjMA=="'

// Glassdoor main url
var __GLASSDOOR_URL__ = "http://www.glassdoor.com"

/// A hash table for maintaining search get urls
var __SEARCH_GET_URLS__ = "http://www.iglassdoor-sjuvekar.appspot.com/search?"

/// A hash table for display string after searching
__DISPLAY_STRING__ = new Object()
__DISPLAY_STRING__["jobs"] = "Jobs"
__DISPLAY_STRING__["companies"] = "Company Reviews"
__DISPLAY_STRING__["salaries"] = "Salaries"
__DISPLAY_STRING__["interviews"] = "Interviews"

// Location_id dict
__GLOBAL_LOCATION_ID__ = {};
var __RESET_GLOBAL_LOCATION_ID__ = function() {
	__GLOBAL_LOCATION_ID__["locId"] = "";
	__GLOBAL_LOCATION_ID__["locT"] = "";
	__GLOBAL_LOCATION_ID__["name"] = "";
}

/// A method to set cookie
var setCookie = function(cookieName) {
	$.cookie("rm", cookieName, {domain: "www.glassdoor.com"});
}

// Get Location id from url
var getLocationId = function(url) {
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		success: function(data) { 
			if (data.locations != null) {
				first_location = data.locations[0];
				__GLOBAL_LOCATION_ID__["locId"] = "&locId=" + first_location.id;
				__GLOBAL_LOCATION_ID__["locT"] = "&locT=" + first_location.type;
				__GLOBAL_LOCATION_ID__["locName"] = first_location.name;
			}
		},
		data: "",
		async: false
	});
}

var getURL = function(tabName) {
	locId = "";
	locT = "";
	company = $("#search-" + tabName).val()	;
	company = company.replace(/\s/g, "-");	
	my_location = $("#search-" + tabName + "-location").val();
	my_location = my_location.replace(/\s/g, "-");
	if (my_location != null && my_location != "") {
		getLocationId(__LOCATION_SEARCH_URL__ + my_location + "&callback=");
		locId = __GLOBAL_LOCATION_ID__["locId"];
		locT = __GLOBAL_LOCATION_ID__["locT"];
		__RESET_GLOBAL_LOCATION_ID__();
	}
	url = __SEARCH_GET_URLS__ + "type=" + tabName + "&company=" + company + locId + locT + "&callback=";
    return url;
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
		if (tabName === "jobs")
			handleJobsClick(tabName, url);
		else if (tabName === "salaries")
			handleSalariesClick(tabName, url);
		else if (tabName === "companies")
			handleCompaniesClick(tabName, url);
		else if (tabName === "interviews")
			handleInterviewsClick(tabName, url);
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



/// A function to handle blog click
var handleBlogClick = function() {
	$.mobile.showPageLoadingMsg();
	$.jGFeed("http://feeds2.feedburner.com/glassdoor", function(feeds) {
		$.mobile.hidePageLoadingMsg();
		if (!feeds) 
			$("#results-blog").empty().append($("<li></li>").html("No feed"))
		else {
			$("#results-blog").empty()
			for(var i=0; i<feeds.entries.length; i++){
				var blog_post = feeds.entries[i];
				$("#results-blog")
					.append($("<li></li>")
						.append($("<a></a>").attr("href", blog_post.link)
							.append($("<img>").attr("src", "icons/blog-list.png"))
			                                .append($("<h1></h1>").html(blog_post.title).css("white-space", "normal")
				)));
			}
            	$("#results-blog").listview("refresh");
		}
	}, 10);	
};

/// A function to get tweets from GlassDoor
var handleTwitterClick = function() {
	$.mobile.showPageLoadingMsg();
	var username = "Glassdoordotcom";   
	var count = 10;
	$("#results-twitter").empty();     
	$.getJSON("http://twitter.com/status/user_timeline/" + username + ".json?count=" + count + "&callback=", function(data){
		$.mobile.hidePageLoadingMsg();
		$.each(data, function(i, item) {
			$("#results-twitter")
				.append($("<li></li>")
					.append($("<a></a>").attr("href", "http://www.twitter.com/" + username + "/status/" + item.id_str)						
						.append($("<img />").attr("src", "icons/twitter-list.png"))
							.append($("<strong></strong>").html("Glassdoor&nbsp;"))
								.append($("<i></i>").css("font-weight", "normal").css("font-size", "10px").html("@Glassdoordotcom"))
									.append($("<p></p>").css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal").html(item.text)
			)));
		});
		$("#results-twitter").listview("refresh")         
	});
};

/// A global document oninit method
$(document).bind("pageinit", function(event) {
	// Reset locations
	__RESET_GLOBAL_LOCATION_ID__();
	
    $("#search-jobs-button").click(  function() { handleJobsClick("jobs"); });
    $("#search-companies-button").click(  function() { handleCompaniesClick("companies"); });
    $("#search-salaries-button").click(  function() { handleSalariesClick("salaries"); });
    $("#search-interviews-button").click(  function() { handleInterviewsClick("interviews"); });

    $("#results-interviews a").click( function() {
    	$(this).preventDefault();
        alert("Interviews")
    	handleInterviewsClick("interviews");
    });
    /// Events after clicking Blog in more
    $("#blog-list-item").click( function() { handleBlogClick(); }); 
        
    /// Events after clicking Twitter in more
    $("#twitter-list-item").click( function() { handleTwitterClick(); });

    //setCookie(__HARDCODED_COOKIE__);
});
