var handleSalariesClick = function(tabName) {
	$.mobile.showPageLoadingMsg();
    clearStuff(tabName);
	url = getURL(tabName);
    $.getJSON(url, function(data){ 
    	$.mobile.hidePageLoadingMsg();
    	return_html = $(data.contents)
    	all_companies = return_html.find("div.jobListing, div.multiEmployer, div.groupedByEmployer");
    	table = return_html.find("table#SalaryChart")[0];
    	if(all_companies.length != 0) {
    		all_tbodies = $(table).find("tbody");
    		for(var i = 0; i < all_tbodies.length; i++) {
    			tr = $(all_tbodies[i]).find("tr.employer")[0];
    			if (tr == undefined || tr == "")
    				continue;
    			a = $(tr).find("a");
    			num_reports = "0 Salaries";
    			more_tr = $(all_tbodies[i]).find("tr.moreData")[0]
    			if (more_tr && more_tr != "")
    				num_reports = $(more_tr).find("p")[1];
    			
    			$("#results-" + tabName)
    				.append($("<li></li>")
    					.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + a.attr("href")).attr("target", "_blank")
    						.append($("<h1></h1>").html(a.text()).css("white-space", "normal"))
    							.append($("<p></p>").html(num_reports).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"))
    			));
    		}
    		$("#results-" + tabName).listview("refresh");
    	}
    	else {
    		all_tr = $(table).find("tr.dataRow");
    		for (var i = 0; i < all_tr.length; i++) {
    			all_td = $(all_tr[i]).find("td");
    			title = $(all_td[0]).find("strong");
    			url = $(all_td[0]).find("a").attr("href");
    			num_reports = $(all_td[0]).find("p.rowCounts");
    			mean_salary = $(all_td[1]).find("span")[0].innerHTML;
    			min_max = $(all_td[2]).find("span")
    			min_salary = min_max[0].innerHTML;
    			max_salary = min_max[1].innerHTML;
    			$("#results-" + tabName)
					.append($("<li></li>")
						.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + url).attr("target", "_blank")
							.append($("<h1></h1>").html(title).css("white-space", "normal"))
								.append($("<p></p>").html(num_reports).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"))
									.append($("<p></p>").html("<b>Average Salary:</b> " + mean_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"))
										.append($("<p></p>").html("<b>Min:</b> " + min_salary + "<b> , Max:</b> " + max_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"))
				));
    		}
    		$("#results-" + tabName).listview("refresh");
    	}
//        salaries = data.salaries_list;
//        for (var i = 0; i < salaries.length; i++) {
//        	$el = $("<li></li>");
//        	$el.append($("<a></a>").attr("href", __GLASSDOOR_URL__ + salaries[i].url));
//        	$el.append($("<h1></h1>").html(salaries[i].title).css("white-space", "normal"));
//        	if (salaries[i].num_reports != null)
//        		$el.append($("<p></p>").html(salaries[i].num_reports).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
//        	if (salaries[i].mean_salary != null)
//        		$el.append($("<p></p>").html("<b>Average Salary:</b> " + salaries[i].mean_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
//        	if (salaries[i].max_salary != null)
//        		$el.append($("<p></p>").html("<b>Min:</b> " + salaries[i].min_salary + " , <b>Max:</b> " + salaries[i].max_salary).css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal"));
//            $("#results-" + tabName).append($el);
//          
//        }
    	//$("#results-" + tabName).listview("refresh");
        //addPageLinks(data, tabName)
    });
	$("#search-" + tabName + "-collapsible").trigger("collapse");
}
