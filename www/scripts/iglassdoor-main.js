// URL for searching location .JSON
var __LOCATION_SEARCH_URL__ = "http://www.glassdoor.com/findLocationsByFullTextAjax.htm?locationSearchString="
var __HARDCODED_COOKIE__ = '"c3VkanV2ZWthckB5YWhvby5jb206MTM3Mjg5NDg1MTIzMjpmMWY3NjVmZTRhZjkzNjM1YzQ4ZGQ5ODQ5MmU4YTBjMA=="'

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

/// A method to handle click event for a given tab. Pass appropriate tab string name
var handleTabClick = function(tabName) {
	company = $("#search-" + tabName).val()	
    company = company.replace(/\s/g, "-")
	$("#results-" + tabName).empty()
    url = __SEARCH_GET_URLS__ + "type=" + tabName + "&company=" + company + "&callback=?"
	$.getJSON(url, function(data){ 
		$.each(data, function(i, item) {
			$("#results-" + tabName).
				append($("<li></li>")
					.append($("<a></a>").attr("href", url)
						.append($("<h1></h1>").text(item)
			)));
		});
	});
	$("#results-" + tabName).listview("refresh");
	$("#search-" + tabName + "-collapsible").trigger("collapse");

};

/// A function to handle blog click
var handleBlogClick = function() {
	$.jGFeed("http://feeds2.feedburner.com/glassdoor", function(feeds) {
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
	var username = "Glassdoordotcom";   
	var count = 10;
	$("#results-twitter").empty();     
	$.getJSON("http://twitter.com/status/user_timeline/" + username + ".json?count=" + count + "&callback=?", function(data){ 
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
                 
    $("#search-jobs-button").click(  function() { handleTabClick("jobs"); });
    $("#search-companies-button").click(  function() { handleTabClick("companies"); });
    $("#search-salaries-button").click(  function() { handleTabClick("salaries"); });
    $("#search-interviews-button").click(  function() { handleTabClick("interviews"); });

    /// Events after expanding the collapsible search button
    $("#search-companies-collapsible").bind("expand", function() {
        $("#results-companies").empty();
    });
    $("#search-jobs-collapsible").bind("expand", function() {
        $("#results-jobs").empty();
    });
    $("#search-salaries-collapsible").bind("expand", function() {
        $("#results-salaries").empty();
    });
    $("#search-interviews-collapsible").bind("expand", function() {
        $("#results-interviews").empty();
    });

    /// Events after clicking Blog in more
    $("#blog-list-item").click( function() { handleBlogClick(); }); 
        
    /// Events after clicking Twitter in more
    $("#twitter-list-item").click( function() { handleTwitterClick(); });

    setCookie(__HARDCODED_COOKIE__);
});
