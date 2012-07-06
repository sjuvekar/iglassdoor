var url="";

function init()
{
    $("#iglassdoor-blog").bind("pageshow", function onPageShow(event, ui)
    {
        $.mobile.pageLoading();
        refreshFeed();
    });

    $("#iglassdoor-blog").bind("pagehide", function onPageHide(event, ui)
    {
        $("#iglassdoor-blog ul").empty();
    });
}

function refreshFeed()
{
    jQuery.getFeed({
       url: "php/proxy.php?url="+url,
       success: function(feed)
       {
            $("#iglassdoor-blog ul").append('<li data-role="divider" data-theme="b">'+feed.title+'</li>');

            for(var i = 0; i < feed.items.length && i < 10; i++)
            {
                var item = feed.items[i];
                $("#iglassdoor-blog ul").append('<li><a href="'+item.link+'">'+item.title+'</a></li>');
            }

            $('#iglassdoor-blog ul').listview('refresh');
            $.mobile.pageLoading( true );
       }
    });
}
