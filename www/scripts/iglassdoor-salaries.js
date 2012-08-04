var createSalariesElement = function(salaryTbodyListing) {
	var company_title = "";
	var company_url = "";
	tr = $(salaryTbodyListing).find("tr.employer");
	if (!tr || tr.length <= 0)
		return undefined;
	company_element = tr.find("h3").find("a");
	company_title = company_element.text();
	company_url = company_element.attr("href");
	a_element = $("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + company_url).attr("target", "_blank")
					.append($("<h2></h2>").html(company_title + " (more...)").css("white-space", "normal"));
	a_element.click( function(event) {
		event.preventDefault();
		delegateSearchClick("salaries", __SEARCH_GET_URLS__ + "url=" + __GLASSDOOR_URL__ + company_url);
	});
	el = $("<li></li>").attr("data-role", "list-divider").attr("data-theme", "a").append(a_element);
	return el;
}

var createSalariesIndividualElement = function(dataRow) {
	title = "-";
	url = "-";
	num_reports = "-";
	mean_salary = "-";
	min_salary = "-";
	max_salary = "-";
	occ = $(dataRow).find("td.occ").find("p");
	if (occ.length > 1) {
		a = $(occ[0]).find("a");
		title = a.text();
		url = a.attr("href");
	}
	num_reports = $(dataRow).find("p.rowCounts").text();
	mean_salary = $(dataRow).find("td.mean").text();
	salary_graph = $(dataRow).find("td.salaryGraph");
	if (salary_graph && salary_graph.length > 0) {
		min_salary = salary_graph.find("div.lowValue").text();
		max_salary = salary_graph.find("div.highValue").text();
	}
	el = $("<li></li>")
			.append($("<a></a>").attr("href", "http://" + __GLASSDOOR_URL__ + url).attr("target", "_blank")
				.append($("<h1></h1>").html(title).css("white-space", "normal"))
					.append($("<p></p>").html(num_reports).css("white-space", "normal"))
						.append($("<p></p>").html("<b>Average Salary:</b> " + mean_salary).css("margin-left", "10px"))
							.append($("<p></p>").html("<b>Min:</b> " + min_salary + " , <b>Max:</b> " + max_salary).css("margin-left", "10px"))
		);
	return el;
}

var handleSalariesClick = function(tabName, url) {
	$.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents)
    	table = return_html.find("table#SalaryChart");
    	if (!table || table.length <= 0)
    		$("#results-" + tabName).append("<h3>No results found</h3>");
    	else {
    		tBodyList = $(table).find("tbody");
    		if (tBodyList.length == 0)
    			tBodyList = table;
    		var my_length = 0;
    		for (var i = 0; i < tBodyList.length; i++) {
    			my_id = $(tBodyList[i]).attr("id");
                if (my_id && my_id.match("SalarySearchResult_.*")) {
                    el = createSalariesElement(tBodyList[i]);
                    if (el) {
                        $("#results-" + tabName).append(el);
                        $("#results-" + tabName).listview("refresh");
                        my_length += 1;
                    }
                }
    			dataRow = $(tBodyList[i]).find("tr.dataRow");
                individual_length = 0;
    			for (var j = 0; j < dataRow.length; j++) {
    				el = createSalariesIndividualElement(dataRow[j]);
    				$("#results-" + tabName).append(el);
    				$("#results-" + tabName).listview("refresh");
                    individual_length += 1;
                }
    		}
            if (my_length > 0)
              $("#results-" + tabName + "-header").append($("<h2> Showing " + my_length + " results</h2>"));
            else if (individual_length > 0)
              $("#results-" + tabName + "-header").append($("<h2> Showing " + individual_length + " results</h2>"));
            else
              $("#results-" + tabName + "-header").append($("<h2> No results found!</h2>"));
    	}
    	addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
