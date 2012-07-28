var handleSalariesClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
	url = getURL(tabName);
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
