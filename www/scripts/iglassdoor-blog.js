/// A function to handle blog click
var handleBlogClick = function() {
	$.mobile.showPageLoadingMsg();
	$.jGFeed("http://feeds2.feedburner.com/glassdoor", function(feeds) {
		$.mobile.hidePageLoadingMsg();
		if (!feeds) 
			$("#results-blog").empty().append($("<li></li>").html("No blog!"))
		else {
			$("#results-blog").empty()
			for(var i=0; i<feeds.entries.length; i++){
				var blog_post = feeds.entries[i];
				$("#results-blog")
					.append($("<li></li>")
							.append($("<a></a>").attr("href", blog_post.link).attr("target", "_blank")
								.append($("<img></img>").attr("src", "icons/blog-list.png").addClass("ui-li-icon"))
			                		.append($("<h1></h1>").html(blog_post.title).css("white-space", "normal")
				)));
			}
            	$("#results-blog").listview("refresh");
		}
	}, 10);	
};