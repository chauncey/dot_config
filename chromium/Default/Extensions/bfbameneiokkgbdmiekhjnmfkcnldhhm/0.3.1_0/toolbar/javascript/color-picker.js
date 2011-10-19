WebDeveloper.ColorPicker = {};

WebDeveloper.ColorPicker.html = '<h1>Web Developer Color Picker</h1><div id="web-developer-color-picker-color"></div><span id="web-developer-color-picker-hex">#ffffff</span>';

// Creates the color picker
WebDeveloper.ColorPicker.createColorPicker = function(contentDocument)
{
	var colorPicker = contentDocument.createElement("div");

	colorPicker.setAttribute("id", "web-developer-color-picker");
	colorPicker.setAttribute("class", "web-developer-toolbar");

	colorPicker.innerHTML = WebDeveloper.ColorPicker.html;

	WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(colorPicker);

	contentDocument.addEventListener("click", WebDeveloper.ColorPicker.click, true);
};

// Handles the click event
WebDeveloper.ColorPicker.click = function(event)
{
  // If the click was not a right click
  if(event.button != 2)
  {
	  var eventTarget = event.target;
	
	  // If the event target is set
	  if(eventTarget)
	  {
	    var ownerDocument = eventTarget.ownerDocument;
	
	    // If the owner document is set
	    if(ownerDocument)
	    {
	      var colorPicker = ownerDocument.getElementById("web-developer-color-picker");
	
	      // If the color picker was found
	      if(colorPicker)
	      {
		      var tagName = eventTarget.tagName;

	        // If the event target is not the color picker, the color picker is not an ancestor of the event target and the event target is not a scrollbar
	        if(eventTarget != colorPicker && !WebDeveloper.Common.isAncestor(eventTarget, colorPicker) && tagName && tagName.toLowerCase() != "scrollbar")
	        {
						chrome.extension.sendRequest({type: "get-color", x: event.clientX, y: event.clientY});
					}
			
			    event.stopPropagation();
			    event.preventDefault();
				}
      }
    }
  }
};

// Displays the color picker
WebDeveloper.ColorPicker.displayColorPicker = function(display, contentDocument)
{
	// If displaying the color picker
	if(display)
	{
		WebDeveloper.ColorPicker.createColorPicker(contentDocument);
	}
	else
	{			
		WebDeveloper.ColorPicker.removeColorPicker(contentDocument);
	}

  WebDeveloper.Common.toggleStyleSheet("toolbar/color-picker.css", "web-developer-color-picker-styles", contentDocument, false);
};

// Removes the color picker
WebDeveloper.ColorPicker.removeColorPicker = function(contentDocument)
{
	WebDeveloper.Common.removeMatchingElements("#web-developer-color-picker", contentDocument);

	contentDocument.removeEventListener("click", WebDeveloper.ColorPicker.getColor, true);
};
