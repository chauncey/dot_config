WebDeveloper.Dashboard = {};

// Converts a title to an id
WebDeveloper.Dashboard.convertTitleToId = function(title)
{
	return "web-developer-" + title.toLowerCase().replace(" ", "-");
};

// Formats a URL
WebDeveloper.Dashboard.formatURL = function(url)
{
	// If the URL is set
	if(url)
	{
		var lastSlashIndex = url.lastIndexOf("/");
		
		return url.substring(lastSlashIndex + 1);
	}

	return url;
};
WebDeveloper.Dashboard = WebDeveloper.Dashboard || {};

WebDeveloper.Dashboard.defaultSize   = 250;
WebDeveloper.Dashboard.mainTabHeight = 32;
WebDeveloper.Dashboard.minimumSize   = 130;
WebDeveloper.Dashboard.subTabHeight  = 56;

WebDeveloper.Dashboard.css = "" +
'body { background-color: #eee; color: #000; font: 13px/1 verdana, "bitstream vera sans", sans-serif; margin: 0; } ' +
"#web-developer-dashboard-header { background: url(" + chrome.extension.getURL("dashboard/images/logo.png") + ") no-repeat center right !important; float: right !important; font-size: 15px !important; font-weight: normal !important; margin: 2px 5px 0 0 !important; padding-right: 25px !important; text-shadow: 0 1px 0 #fff; } " +
"#web-developer-dashboard-panels { clear: both; } " +
"#web-developer-dashboard-resizer { background: -webkit-gradient(linear, left top, left bottom, from(#bbb), to(#ccc)); cursor: n-resize; height: 3px; } " +
"#web-developer-dashboard-tabs { float: left; } " +
"#web-developer-edit-css-panels textarea { border-color: #aaa; border-style: solid; border-width: 1px 0 0 0; font-family: monospace; font-size: 13px; height: 100%; outline: none; padding: 2px 5px; width: 100%; } " +
"#web-developer-edit-css-tabs { padding-top: 0; } " +
".panel { display: none; } " +
".panel.selected { display: block; } " +
".tab { background: -webkit-gradient(linear, left top, left bottom, from(#ddd), to(#eee)); border-color: #aaa; border-style: solid; border-width: 0 1px 1px 1px; -webkit-border-bottom-left-radius: 5px; -webkit-border-bottom-right-radius: 5px; cursor: pointer; display: inline-block; line-height: 18px; margin-right: -1px; max-width: 200px; overflow: hidden; padding: 2px 10px; position: relative; text-shadow: 0 1px 0 #fff; top: -1px; white-space: nowrap; } " +
".tab::selection { background-color: transparent; } " +
".tab span { background: url(" + chrome.extension.getURL("dashboard/images/close.png") + ") no-repeat 0 0; cursor: pointer; display: none; height: 16px; margin-left: 10px; vertical-align: top; width: 16px; } " +
".tab.selected { background: -webkit-gradient(linear, left top, left bottom, from(#ccc), to(#ddd)); cursor: default; font-weight: bold; position: static; } " +
".tab.selected span { display: inline-block; } " +
".tab-bar { background-color: #eee; list-style-type: none; margin: 0; padding: 0 5px 5px 5px; } " +
".tab-bar.bottom-tabs { padding: 5px 5px 0 5px; } " +
".tab-bar.bottom-tabs .tab { border-width: 1px 1px 0 1px; -webkit-border-bottom-left-radius: 0; -webkit-border-bottom-right-radius: 0; -webkit-border-top-left-radius: 5px; -webkit-border-top-right-radius: 5px; top: 0; } " +
".tab-bar.bottom-tabs .tab.selected { padding-bottom: 3px; position: relative; top: 1px; } " +
"";

WebDeveloper.Dashboard.html = '<div id="web-developer-dashboard-resizer"></div><ul id="web-developer-dashboard-tabs" class="tab-bar"></ul><h1 id="web-developer-dashboard-header">Web Developer Dashboard</h1><div id="web-developer-dashboard-panels"></div>';

WebDeveloper.Dashboard.size = "" +
"#web-developer-dashboard-panels div { height: %1; } " + 
"#web-developer-dashboard-panels #web-developer-edit-css-panels { height: %2; } " + 
"";

// Closes a dashboard tab
WebDeveloper.Dashboard.closeDashboardTab = function(title, contentDocument)
{
	var dashboard = contentDocument.getElementById("web-developer-dashboard");

	// If the dashboard is set
	if(dashboard)
	{
		var tabId = WebDeveloper.Dashboard.convertTitleToId(title);

		WebDeveloper.Common.removeMatchingElements("#" + tabId + "-panel, #" + tabId + "-tab", dashboard.contentDocument);

		// If the last tab on the dashboard was closed
		if(dashboard.contentDocument.querySelectorAll("#web-developer-dashboard-tabs li").length === 0)
		{
			dashboard.style.display = "none";
		}
	}
};

// Create the dashboard
WebDeveloper.Dashboard.createDashboard = function(contentDocument)
{
	var dashboard         = contentDocument.createElement("iframe");
	var dashboardDocument = null;
	var resizer           = null;

	dashboard.setAttribute("id", "web-developer-dashboard");

	WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(dashboard);
  WebDeveloper.Common.toggleStyleSheet("dashboard/style-sheets/dashboard.css", "web-developer-dashboard-styles", contentDocument, false);

	dashboardDocument = dashboard.contentDocument;

	dashboardDocument.write('<html id="web-developer-dashboard-iframe" lang="en"><head><meta charset="utf-8"><title>Web Developer Dashboard</title><style>' + WebDeveloper.Dashboard.css + '</style><style id="web-developer-dashboard-size"></style></head><body>' + WebDeveloper.Dashboard.html + "</body></html>");
	WebDeveloper.Dashboard.resizeDashboard(WebDeveloper.Dashboard.defaultSize, dashboard, dashboardDocument);

	resizer = dashboardDocument.getElementById("web-developer-dashboard-resizer");

	resizer.addEventListener("mousedown", function() { dashboardDocument.addEventListener("mousemove", WebDeveloper.Dashboard.resizerMouseMove); }, false);
	resizer.addEventListener("mouseup", function() { dashboardDocument.removeEventListener("mousemove", WebDeveloper.Dashboard.resizerMouseMove); }, false);

	return dashboard;
};

// Opens a dashboard tab
WebDeveloper.Dashboard.openDashboardTab = function(title, contentDocument)
{
	var dashboard         = contentDocument.getElementById("web-developer-dashboard");
	var dashboardDocument = null;
	var panels            = null;
	var tabId             = WebDeveloper.Dashboard.convertTitleToId(title);
	var tabs              = null;

	// If the dashboard exists
	if(dashboard)
	{
		dashboard.style.display = "block";
	}
	else
	{
		dashboard = WebDeveloper.Dashboard.createDashboard(contentDocument);
	}
	
	dashboardDocument = dashboard.contentDocument;
	panels            = dashboardDocument.getElementById("web-developer-dashboard-panels");
	tabs              = dashboardDocument.getElementById("web-developer-dashboard-tabs");

	panels.innerHTML = panels.innerHTML + '<div id ="' + tabId + '-panel" class="panel selected"></div>';
	tabs.innerHTML   = tabs.innerHTML + '<li id ="' + tabId + '-tab" class="tab selected">' + title + '</li>';

	return dashboardDocument;
};

// Resizes the dashboard
WebDeveloper.Dashboard.resizeDashboard = function(size, dashboard, dashboardDocument)
{
	// If the size is more than the minimum dashboard size
	if(size > WebDeveloper.Dashboard.minimumSize)
	{
		dashboard.style.height                                                     = size + "px";
		dashboardDocument.getElementById("web-developer-dashboard-size").innerText = WebDeveloper.Dashboard.size.replace("%1", size - WebDeveloper.Dashboard.mainTabHeight + "px").replace("%2", size - WebDeveloper.Dashboard.subTabHeight + "px");
	}
};

// Handles the dashboard resizer being moved
WebDeveloper.Dashboard.resizerMouseMove = function(event)
{
	var dashboard = window.document.getElementById("web-developer-dashboard");

	WebDeveloper.Dashboard.resizeDashboard(dashboard.offsetHeight - event.pageY, dashboard, event.target.ownerDocument);
};

// Handles a tab bar being clicked
WebDeveloper.Dashboard.tabBarClicked = function(event)
{
	var eventTarget = event.target;

	// If a tab was clicked
	if(WebDeveloper.Common.hasClass(eventTarget, "tab"))
	{
		var eventDocument = eventTarget.ownerDocument;
		var panel					= eventDocument.getElementById(eventTarget.getAttribute("id").replace("tab", "panel"));
		var tabs					= eventTarget.parentElement;
		var panels				= eventDocument.getElementById(tabs.getAttribute("id").replace("tabs", "panels"));
		
		WebDeveloper.Common.removeClass(tabs.querySelector(".selected"), "selected");
		WebDeveloper.Common.removeClass(panels.querySelector(".selected"), "selected");

		WebDeveloper.Common.addClass(eventTarget, "selected");
		WebDeveloper.Common.addClass(panel, "selected");
	}
};
WebDeveloper.Dashboard = WebDeveloper.Dashboard || {};

WebDeveloper.Dashboard.editCSSUpdateFrequency = 3000;

// Adds an edit CSS tab
WebDeveloper.Dashboard.addEditCSSTab = function(title, css, position, dashboardDocument)
{
	var panels   = dashboardDocument.getElementById("web-developer-edit-css-panels");
	var selected = "";
	var tabs     = dashboardDocument.getElementById("web-developer-edit-css-tabs");

	// If this is the first tab
	if(position == 1)
	{
		selected = " selected";
	}

	panels.innerHTML = panels.innerHTML + '<textarea id="web-developer-edit-css-panel-' + position + '" class="panel' + selected + '">' + css + '</textarea>';
	tabs.innerHTML   = tabs.innerHTML + '<li id="web-developer-edit-css-tab-' + position + '" class="tab' + selected + '">' + title + '</li>';
};

// Applies the edit CSS
WebDeveloper.Dashboard.applyEditCSS = function(dashboardDocument, contentDocument)
{
	var editStyles = contentDocument.getElementById("web-developer-edit-css-styles");

	// If the edit styles element exists
	if(editStyles)
	{
		var styles    = "";
		var textAreas = dashboardDocument.querySelectorAll("#web-developer-edit-css-panel textarea");
		
	  WebDeveloper.Dashboard.stopEditCSSUpdate();

		// Loop through the text areas
		for(var i = 0, l = textAreas.length; i < l; i++)
		{
			styles += textAreas[i].value;
		}
		
		// If the styles have changed
		if(editStyles.innerText != styles)
		{
			editStyles.innerText = styles;
		}

	  WebDeveloper.Dashboard.startEditCSSUpdate(dashboardDocument, contentDocument);
	}
};

// Edits the CSS of the page
WebDeveloper.Dashboard.editCSS = function(edit, contentDocument)
{
	var title = "Edit CSS";

	// If editing the CSS
	if(edit)
	{
		var documentCSS			  = WebDeveloper.Content.getDocumentCSS(contentDocument);
		var dashboardDocument = WebDeveloper.Dashboard.openDashboardTab(title, contentDocument);
		var tabId             = WebDeveloper.Dashboard.convertTitleToId(title);
				
		dashboardDocument.getElementById(tabId + "-panel").innerHTML = '<ul id="web-developer-edit-css-tabs" class="tab-bar bottom-tabs"></ul><div id="web-developer-edit-css-panels"></div>';

		chrome.extension.sendRequest({type: "get-content-from-urls", urls: documentCSS.styleSheets}, function(response) 
		{
			var position   = 1;
			var styleSheet = null;

			// Loop through the style sheets
			for(var i = 0, l = response.length; i < l; i++)
			{
				styleSheet = response[i];
			
				WebDeveloper.Dashboard.addEditCSSTab(WebDeveloper.Dashboard.formatURL(styleSheet.url), styleSheet.content, position, dashboardDocument);
				
				position++;
			}
			
			// If there are embedded styles
			if(documentCSS.embedded)
			{
				WebDeveloper.Dashboard.addEditCSSTab("Embedded styles", documentCSS.embedded, position, dashboardDocument);
			}
			
			WebDeveloper.CSS.toggleAllStyleSheets(true, contentDocument);

			styleSheet = contentDocument.createElement("style");
			
			styleSheet.setAttribute("id", "web-developer-edit-css-styles");
			WebDeveloper.Common.getDocumentHeadElement(contentDocument).appendChild(styleSheet);
			
			dashboardDocument.getElementById("web-developer-edit-css-tabs").addEventListener("click", WebDeveloper.Dashboard.tabBarClicked, false);

			WebDeveloper.Dashboard.applyEditCSS(dashboardDocument, contentDocument);
		});
	}
	else
	{			
    WebDeveloper.Dashboard.stopEditCSSUpdate();
    WebDeveloper.Common.removeMatchingElements("#web-developer-edit-css-styles", contentDocument);
		WebDeveloper.CSS.toggleAllStyleSheets(false, contentDocument);
		WebDeveloper.Dashboard.closeDashboardTab(title, contentDocument);
	}
};

// Starts the CSS updating
WebDeveloper.Dashboard.startEditCSSUpdate = function(dashboardDocument, contentDocument)
{
	window.WebDeveloper.editCSSInterval = window.setInterval(function() { WebDeveloper.Dashboard.applyEditCSS(dashboardDocument, contentDocument); }, WebDeveloper.Dashboard.editCSSUpdateFrequency);
};

// Stops the CSS updating
WebDeveloper.Dashboard.stopEditCSSUpdate = function()
{
  window.clearInterval(window.WebDeveloper.editCSSInterval);
};
