var WebDeveloper = WebDeveloper || {};

WebDeveloper.Analytics = WebDeveloper.Analytics || {};

if(false)
{
	// If analytics are not disabled
	if(!window.localStorage.getItem("disable-analytics"))
	{
		// Google Analytics
		var _gaq = _gaq || [];
		_gaq.push(["_setAccount", "UA-80819-6"], ["_setCustomVar", 1, "Version", "0.3.1", 2], ["_trackPageview"]);
		
		(function() {
		  var ga = document.createElement("script"); ga.async = true;
		  ga.src = "https://ssl.google-analytics.com/ga.js";
		  var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
		})();
	}
}

// Tracks a feature
WebDeveloper.Analytics.trackFeature = function(feature)
{
	if(false)
	{
		// If analytics are not disabled and the feature is set
		if(!window.localStorage.getItem("disable-analytics") && feature)
		{
			_gaq.push(["_trackEvent", feature.attr("id"), "activated"]);
		}
	}
};

// Tracks a toggle feature
WebDeveloper.Analytics.trackToggleFeature = function(feature)
{
	if(false)
	{
		// If analytics are not disabled and the feature is set and is open
		if(!window.localStorage.getItem("disable-analytics") && feature && feature.hasClass("active"))
		{
			WebDeveloper.Analytics.trackFeature(feature);
		}
	}
};

// Tracks a menu
WebDeveloper.Analytics.trackMenu = function(menu)
{
	if(false)
	{
		// If analytics are not disabled and the menu is set and is open
		if(!window.localStorage.getItem("disable-analytics") && menu && menu.is(":visible"))
		{
			_gaq.push(["_trackEvent", menu.attr("id"), "opened"]);
		}
	}
};
