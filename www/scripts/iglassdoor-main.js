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

/// A method to set cookie
var setCookie = function(cookieName) {
	$.cookie("rm", cookieName, {domain: "www.glassdoor.com"});
}

/// Add link pages
var addPageLinks = function(data, tabName) {
	$("#inset-" + tabName).prepend($("<h3></h3>").html("More Results"));
	pages = data.pages
    for (var key in pages) {
    	$("#pages-" + tabName)
    		.append($("<li></li>")
    			.append($("<a></a>").attr("href", __GLASSDOOR_URL__ +  pages[key])
    				.append($("<h1></h1>").html("Page: " + key)
    	)));
    	$("#pages-" + tabName).listview("refresh");
    }
}

var getURL = function(tabName) {
	company = $("#search-" + tabName).val()	;
    company = company.replace(/\s/g, "-");
    url = __SEARCH_GET_URLS__ + "type=" + tabName + "&company=" + company + "&callback=";
    return url;
};

/// Clear all divs
var clearStuff = function(tabName) {
	$("#results-" + tabName).empty();
	$("#pages-" + tabName).empty();
	$("#inset-" + tabName).html("");
}

/// A method to handle click event for a given tab. Pass appropriate tab string name
var handleJobsClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    url = getURL(tabName);
    clearStuff(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
        jobs = data.jobs_list;
        for (var i = 0; i < jobs.length; i++) {
            $("#results-" + tabName).
              append($("<li></li>")
                .append($("<a></a>").attr("href", __GLASSDOOR_URL__ + jobs[i].url)
                    .append($("<h1></h1>").html(jobs[i].title).css("white-space", "normal")
                        .append($("<p></p>").html(jobs[i].location).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal")
                        		.append($("<p></p>").html(jobs[i].description).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal")
            )))));
        }
        $("#results-" + tabName).listview("refresh");
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}

var handleCompaniesClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    url = getURL(tabName);
    clearStuff(tabName);
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

var handleSalariesClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    url = getURL(tabName);
    clearStuff(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
        salaries = data.salaries_list;
        for (var i = 0; i < salaries.length; i++) {
        	$el = $("<li></li>");
        	$el.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + salaries[i].url));
        	$el.append($("<h1></h1>").html(salaries[i].title).css("white-space", "normal"));
        	if (salaries[i].num_reports != null)
        		$el.append($("<p></p>").html(salaries[i].num_reports).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
        	if (salaries[i].mean_salary != null)
        		$el.append($("<p></p>").html("<b>Average Salary:</b> " + salaries[i].mean_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
        	if (salaries[i].max_salary != null)
        		$el.append($("<p></p>").html("<b>Min:</b> " + salaries[i].min_salary + " , <b>Max:</b> " + salaries[i].max_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
            $("#results-" + tabName).append($el);
            $("#results-" + tabName).listview("refresh");
        }
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}

var handleInterviewsClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    url = getURL(tabName);
    clearStuff(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
        interviews = data.interviews_list;
        for (var i = 0; i < interviews.length; i++) {
            $("#results-" + tabName).
              append($("<li></li>")
                .append($("<a></a>").attr("href", __GLASSDOOR_URL__ + interviews[i].url)
                    .append($("<h1></h1>").html(interviews[i].title).css("white-space", "normal")
                        .append($("<p></p>").html(interviews[i].description).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal")
            ))));
            $("#results-" + tabName).listview("refresh");
        }
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
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
	$.getJSON("http://twitter.com/status/user_timeline/" + username + ".json?count=" + count + "&callback=?", function(data){
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
                 
    $("#search-jobs-button").click(  function() { handleJobsClick("jobs"); });
    $("#search-companies-button").click(  function() { handleCompaniesClick("companies"); });
    $("#search-salaries-button").click(  function() { handleSalariesClick("salaries"); });
    $("#search-interviews-button").click(  function() { handleInterviewsClick("interviews"); });

    /// Events after clicking Blog in more
    $("#blog-list-item").click( function() { handleBlogClick(); }); 
        
    /// Events after clicking Twitter in more
    $("#twitter-list-item").click( function() { handleTwitterClick(); });

    //setCookie(__HARDCODED_COOKIE__);
});
