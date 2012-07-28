var handleInterviewsClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
	url = getURL(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
        interviews = data.interviews_list;
        for (var i = 0; i < interviews.length; i++) {
        	$el = $("<li></li>");
        	if (interviews[i].url != null)
        		$el.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + interviews[i].url));
        	$el.append($("<h1></h1>").html(interviews[i].title).css("white-space", "normal"));
        	if (interviews[i].description != null)
        		$el.append($("<p></p>").html(interviews[i].description).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
        	if (interviews[i].status != null)
        		$el.append($("<p></p>").html(interviews[i].status).css("margin-top", "10px").css("white-space", "normal"));
        	if (interviews[i].review != null)
        		$el.append($("<p></p>").html("Review: " + interviews[i].review).css("margin-top", "10px").css("white-space", "normal"));
        	if (interviews[i].details != null)
        		$el.append($("<p></p>").html(interviews[i].details).css("margin-top", "10px").css("white-space", "normal"));
        	if (interviews[i].questions != null)
        		$el.append($("<p></p>").html(interviews[i].questions).css("margin-top", "10px").css("white-space", "normal"));
            $("#results-" + tabName).append($el);
            $("#results-" + tabName).listview("refresh");
        }
        addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
