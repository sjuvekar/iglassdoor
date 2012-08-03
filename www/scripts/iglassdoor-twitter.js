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
					.append($("<a></a>").attr("href", "http://www.twitter.com/" + username + "/status/" + item.id_str).attr("target", "_blank")						
						.append($("<img />").attr("src", "icons/twitter-list.png").addClass("ui-li-icon"))
							.append($("<strong></strong>").html("Glassdoor&nbsp;"))
								.append($("<i></i>").css("font-weight", "normal").css("font-size", "10px").html("@Glassdoordotcom"))
									.append($("<p></p>").css("margin-top", "10px").css("margin-left", "10px").css("white-space", "normal").html(item.text)
			)));
		});
		$("#results-twitter").listview("refresh")         
	});
};