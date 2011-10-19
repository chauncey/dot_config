var WebDeveloper = {};

WebDeveloper.Common = {};

// Adds a class to an element
WebDeveloper.Common.addClass = function(element, className)
{
	// If the element and class name are set and the element does not already have this class
	if(element && className && !WebDeveloper.Common.hasClass(element, className))
	{
		element.className = WebDeveloper.Common.trim(element.className + " " + className);
	}
};

// Returns the document body element
WebDeveloper.Common.getDocumentBodyElement = function(contentDocument)
{
	// If there is a body element
	if(contentDocument.body)
	{
		return contentDocument.body;
	}
	else
	{
		var bodyElement = contentDocument.querySelector("body");

		// If there is a body element
		if(bodyElement)
		{
			return bodyElement;
		}
	}

	return contentDocument.documentElement;
};

// Returns the document head element
WebDeveloper.Common.getDocumentHeadElement = function(contentDocument)
{
	var headElement = contentDocument.querySelector("head");

	// If there is a head element
	if(headElement)
	{
		return headElement;
	}

	return contentDocument.documentElement;
};

// Returns all of the images in the document
WebDeveloper.Common.getDocumentImages = function(contentDocument)
{
	var uniqueImages = [];

	// If the content document is set
	if(contentDocument)
	{
		var backgroundImage = null;
		var computedStyle		= null;
		var cssURI					= CSSPrimitiveValue.CSS_URI;
		var documentURL			= contentDocument.documentURI;
		var image						= null;
		var images					= [];
		var node						= null;
		var treeWalker			= contentDocument.createTreeWalker(contentDocument, NodeFilter.SHOW_ELEMENT, null, false);

		// While the tree walker has more nodes
		while((node = treeWalker.nextNode()) !== null)
		{
			// If this is an image element
			if(node.tagName.toLowerCase() == "img")
			{
				images.push(node);
			}
			else if(node.tagName.toLowerCase() == "input" && node.src && node.type && node.type.toLowerCase() == "image")
			{
				image			= new Image();
				image.src = node.src;

				// If this is not a chrome image
				if(image.src.indexOf("chrome://") !== 0)
				{
					images.push(image);
				}
			}
			else if(node.tagName.toLowerCase() == "link" && node.href && node.href.indexOf("chrome://") !== 0 && node.rel && node.rel.indexOf("icon") != -1)
			{
				image			= new Image();
				image.src = node.href;

				images.push(image);
			}
			else
			{
				computedStyle = node.ownerDocument.defaultView.getComputedStyle(node, null);

				// If the computed style is set
				if(computedStyle)
				{
					backgroundImage = computedStyle.getPropertyCSSValue("background-image");

					// If this element has a background image and it is a URI
					if(backgroundImage && backgroundImage.primitiveType == cssURI)
					{
						image			= new Image();
						image.src = backgroundImage.getStringValue();

						// If this is not a chrome image
						if(image.src.indexOf("chrome://") !== 0)
						{
							images.push(image);
						}
					}
				}
			}
		}

		images.sort(WebDeveloper.Common.sortImages);

		// Loop through the images
		for(var i = 0, l = images.length; i < l; i++)
		{
			image = images[i];

			// If this is not the last image and the image is the same as the next image
			if(i + 1 < l && image.src == images[i + 1].src)
			{
				continue;
			}

			uniqueImages.push(image);
		}
	}

	return uniqueImages;
};

// Get the position of an element
WebDeveloper.Common.getElementPosition = function(element, xPosition)
{
  var position = 0;

  // If the element is set
  if(element)
  {
    var elementOffsetParent = element.offsetParent;

    // If the element has an offset parent
    if(elementOffsetParent)
    {
      // While there is an offset parent
      while((elementOffsetParent = element.offsetParent) !== null)
      {
        // If getting the x position
        if(xPosition)
        {
          position += element.offsetLeft;
        }
        else
        {
          position += element.offsetTop;
        }

        element = elementOffsetParent;
      }
    }
    else
    {
      // If getting the x position
      if(xPosition)
      {
        position = element.offsetLeft;
      }
      else
      {
        position = element.offsetTop;
      }
    }
  }

  return position;
};

// Get the x position of an element
WebDeveloper.Common.getElementPositionX = function(element)
{
  return WebDeveloper.Common.getElementPosition(element, true);
};

// Get the y position of an element
WebDeveloper.Common.getElementPositionY = function(element)
{
	return WebDeveloper.Common.getElementPosition(element, false);
};

// Returns the text from an element
WebDeveloper.Common.getElementText = function(element)
{
  var elementText = "";

  // If the element is set
  if(element)
  {
    var childNode     = null;
    var childNodes    = element.childNodes;
    var childNodeType = null;

    // Loop through the child nodes
    for(var i = 0, l = childNodes.length; i < l; i++)
    {
      childNode     = childNodes[i];
      childNodeType = childNode.nodeType;

      // If the child node type is an element
      if(childNodeType == Node.ELEMENT_NODE)
      {
        elementText += WebDeveloper.Common.getElementText(childNode);
      }
      else if(childNodeType == Node.TEXT_NODE)
      {
        elementText += childNode.nodeValue + " ";
      }
    }
  }

  return elementText;
};

// Returns true if an element has the specified class
WebDeveloper.Common.hasClass = function(element, className)
{
	// If the element and class name are set
	if(element && className)
	{
		var classes = element.className.split(" ");
		
		// Loop through the classes
		for(var i = 0, l = classes.length; i < l; i++)
		{
			// If the classes match
			if(className == classes[i])
			{
				return true;
			}
		}
	}

	return false;
};

// Returns true if the ancestor element is an ancestor of the element
WebDeveloper.Common.isAncestor = function(element, ancestorElement)
{
  // If the element and ancestor element are set
  if(element && ancestorElement)
  {
    var parentElement = null;

    // Loop through the parent elements
    while((parentElement = element.parentNode) !== null)
    {
      // If the parent element is the ancestor element
      if(parentElement == ancestorElement)
      {
        return true;
      }
      else
      {
        element = parentElement;
      }
    }
  }

  return false;
};

// Removes a class from an element
WebDeveloper.Common.removeClass = function(element, className)
{
	// If the element and class name are set
	if(element && className)
	{
		var classes = element.className.split(" ");
		
		// Loop through the classes
		for(var i = 0, l = classes.length; i < l; i++)
		{
			// If the classes match
			if(className == classes[i])
			{
				classes.splice(i, 1);
				
				element.className = WebDeveloper.Common.trim(classes.join(" "));
				
				break;
			}
		}
	}
};

// Removes all matching elements from a document
WebDeveloper.Common.removeMatchingElements = function(selector, contentDocument)
{
	var matchingElement	 = null;
	var matchingElements = contentDocument.querySelectorAll(selector);
	
	// Loop through the matching elements
	for(var i = 0, l = matchingElements.length; i < l; i++)
	{
		matchingElement = matchingElements[i];

		// If the matching element has a parent node
		if(matchingElement.parentNode)
		{
			matchingElement.parentNode.removeChild(matchingElement);
		}
	}
};

// Removes a style sheet from a document
WebDeveloper.Common.removeStyleSheet = function(id, contentDocument)
{
	var styleSheet = contentDocument.getElementById(id);
	
	// If the style sheet is in the document
	if(styleSheet)
	{
		// If the style sheet has a parent node
		if(styleSheet.parentNode)
		{
			styleSheet.parentNode.removeChild(styleSheet);
		}
	}
};

// Removes a substring from a string
WebDeveloper.Common.removeSubstring = function(string, substring)
{
	// If the string and substring are not empty
	if(string && substring)
	{
		var substringStart = string.indexOf(substring);

		// If the substring is found in the string
		if(substring && substringStart != -1)
		{
			return string.substring(0, substringStart) + string.substring(substringStart + substring.length, string.length);
		}

		return string;
	}

	return "";
};

// Sorts two images
WebDeveloper.Common.sortImages = function(imageOne, imageTwo)
{
	// If both images are set
	if(imageOne && imageTwo)
	{
		var imageOneSrc = imageOne.src;
		var imageTwoSrc = imageTwo.src;

		// If the images are equal
		if(imageOneSrc == imageTwoSrc)
		{
			return 0;
		}
		else if(imageOneSrc < imageTwoSrc)
		{
			return -1;
		}
	}

	return 1;
};

// Trims a string
WebDeveloper.Common.trim = function(string)
{
	return string.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
};
WebDeveloper.Common = WebDeveloper.Common || {};

// Toggles a style sheet in a document
WebDeveloper.Common.toggleStyleSheet = function(url, id, contentDocument, insertFirst)
{
	var styleSheet = contentDocument.getElementById(id);
	
	// If the style sheet is already in the document
	if(styleSheet)
	{
		WebDeveloper.Common.removeStyleSheet(id, contentDocument);
	}
	else
	{
		var headElement = WebDeveloper.Common.getDocumentHeadElement(contentDocument);
		var firstChild	= headElement.firstChild;
		var linkElement = contentDocument.createElement("link");

		linkElement.setAttribute("href", chrome.extension.getURL(url));
		linkElement.setAttribute("id", id);
		linkElement.setAttribute("rel", "stylesheet");

		// If there is a first child
		if(insertFirst && firstChild)
		{
			 headElement.insertBefore(linkElement, firstChild);
		}
		else
		{
			 headElement.appendChild(linkElement);
		}
	}
};
WebDeveloper.CSS = {};

// Returns true if this is an alternate style sheet
WebDeveloper.CSS.isAlternateStyleSheet = function(styleSheet)
{
  // If the style sheet is set
  if(styleSheet)
  {
    var ownerNode = styleSheet.ownerNode;

    // If the owner node is set
    if(ownerNode)
    {
      // If the owner node is a processing instruction
      if(ownerNode.nodeType == Node.PROCESSING_INSTRUCTION_NODE)
      {
        // If the processing instruction data contains alternate="yes"
        if(ownerNode.data.indexOf('alternate="yes"') != -1)
        {
          return true;
        }
      }
      else if(ownerNode.hasAttribute("rel") && ownerNode.getAttribute("rel").toLowerCase() == "alternate stylesheet")
      {
        return true;
      }
    }
  }

  return false;
};

// Returns true if this style sheet is for this media type
WebDeveloper.CSS.isMediaStyleSheet = function(styleSheet, mediaType)
{
  // If the style sheet and media type are set
  if(styleSheet && mediaType)
  {
    var media               = styleSheet.media;
    var mediaLength         = media.length;
    var styleSheetMediaType = null;

    // If there is no media and the match media type is screen
    if(mediaLength === 0 && mediaType == "screen")
    {
      return true;
    }

    // Loop through the media
    for(var i = 0; i < mediaLength; i++)
    {
      styleSheetMediaType = media.item(i).toLowerCase();

      // If the style sheet media type is all or matches the media type
      if(styleSheetMediaType == "all" || styleSheetMediaType == mediaType)
      {
        return true;
      }
    }
  }

  return false;
};

// Returns true if this is a valid style sheet
WebDeveloper.CSS.isValidStyleSheet = function(styleSheet)
{
  // If the style sheet is set
  if(styleSheet)
  {
    var styleSheetHref = styleSheet.href;

    // If the style sheet href is not set or this is not a chrome style sheet
    if(!styleSheetHref || (styleSheetHref.indexOf("chrome://") !== 0 && styleSheetHref.indexOf("chrome-extension://") !== 0))
    {
      return true;
    }
  }

  return false;
};

// Toggles all the style sheets in a document
WebDeveloper.CSS.toggleAllStyleSheets = function(disable, contentDocument)
{
	var styleSheet  = null;
  var styleSheets = contentDocument.styleSheets;

  // Loop through the style sheets
  for(var i = 0, l = styleSheets.length; i < l; i++)
  {
    styleSheet = styleSheets[i];

    // If this is a valid style sheet and is not an alternate style sheet or style sheets are being disabled
    if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && (!WebDeveloper.CSS.isAlternateStyleSheet(styleSheet) || disable))
    {
			styleSheet.disabled = disable;
		}
  }
};
WebDeveloper.Content = {};

// Returns any anchors in the document
WebDeveloper.Content.getAnchors = function()
{
	var anchor						 = null;
	var anchors						 = {};
	var contentDocument		 = null;
	var contentDocuments	 = WebDeveloper.Content.getDocuments(window);
	var documentAllAnchors = null;
	var documentAnchors		 = null;
	var nonUniqueAnchors	 = null;
	
	anchors.documents = [];
	anchors.pageTitle = document.title;
	anchors.pageURL	  = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument				  = contentDocuments[i];
		documentAllAnchors			= contentDocument.querySelectorAll("[id]");
		documentAnchors					= {};
		documentAnchors.anchors = [];
		documentAnchors.url		  = contentDocument.documentURI;
		nonUniqueAnchors				= [];

		// Loop through the id anchors
		for(var j = 0, m = documentAllAnchors.length; j < m; j++)
		{
			nonUniqueAnchors.push(documentAllAnchors[j].getAttribute("id"));
		}

		documentAllAnchors = contentDocument.querySelectorAll("a[name]");

		// Loop through the name anchors
		for(j = 0, m = documentAllAnchors.length; j < m; j++)
		{
			nonUniqueAnchors.push(documentAllAnchors[j].getAttribute("name"));
		}

		nonUniqueAnchors.sort();

		// Loop through the anchors
		for(j = 0, m = nonUniqueAnchors.length; j < m; j++)
		{
			anchor = nonUniqueAnchors[j];

			// If this is not the last anchor and the anchor is the same as the next anchor
			if(j + 1 < m && anchor == nonUniqueAnchors[j + 1])
			{
				continue;
			}

			documentAnchors.anchors.push(anchor);
		}

		anchors.documents.push(documentAnchors);
	}
	
	return anchors;
};

// Returns any broken images in the document
WebDeveloper.Content.getBrokenImages = function()
{
	var brokenImages			= {};
	var contentDocument	  = null;
	var contentDocuments	= WebDeveloper.Content.getDocuments(window);
	var documentAllImages = null;
	var documentImages		= null;
	var image						  = null;
	
	brokenImages.documents = [];
	brokenImages.pageTitle = document.title;
	brokenImages.pageURL	 = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument			  = contentDocuments[i];
		documentAllImages			= WebDeveloper.Common.getDocumentImages(contentDocument);
		documentImages				= {};
		documentImages.images = [];
		documentImages.url	  = contentDocument.documentURI;

		// Loop through the images
		for(var j = 0, m = documentAllImages.length; j < m; j++)
		{
			image = documentAllImages[j];

			// If the image is broken
			if(!image.naturalWidth && !image.naturalHeight)
			{
				documentImages.images.push(image.src);
			}
		}

		brokenImages.documents.push(documentImages);
	}
	
	return brokenImages;
};

// Returns all the CSS for the document
WebDeveloper.Content.getCSS = function()
{
	var contentDocument	 = null;
	var contentDocuments = WebDeveloper.Content.getDocuments(window);
	var css							 = {};
	var documentCSS			 = null;
	var embeddedStyles	 = null;
	var styleSheet			 = null;
	var styleSheets			 = null;
	
	css.documents = [];
	css.pageTitle = document.title;
	css.pageURL		= document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		css.documents.push(WebDeveloper.Content.getDocumentCSS(contentDocuments[i]));
	}
	
	return css;
};

// Returns the CSS for the specified document
WebDeveloper.Content.getDocumentCSS = function(contentDocument)
{
	var documentCSS		 = {};
	var embeddedStyles = "";
	var styleSheet		 = null;
	var styleSheets		 = contentDocument.querySelectorAll("style");

	documentCSS.url					= contentDocument.documentURI;
	documentCSS.styleSheets = [];

	// Loop through the embedded style sheets
	for(var i = 0, l = styleSheets.length; i < l; i++)
	{
		styleSheet = styleSheets[i];
		
		// If this is a valid style sheet
		if(WebDeveloper.CSS.isValidStyleSheet(styleSheet.sheet))
		{
			embeddedStyles += WebDeveloper.Common.trim(styleSheet.innerHTML) + "\n\n";
		}
	}
	
	styleSheets = contentDocument.styleSheets;
	
	// Loop through the style sheets
	for(i = 0, l = styleSheets.length; i < l; i++)
	{
		styleSheet = styleSheets[i];
		
		// If this is a valid style sheet and is not an inline style sheet
		if(WebDeveloper.CSS.isValidStyleSheet(styleSheet) && styleSheet.href && styleSheet.href != contentDocument.documentURI)
		{
			documentCSS.styleSheets.push(styleSheet.href);
		}
	}
	
	// If there are embedded styles
	if(embeddedStyles)
	{
		documentCSS.embedded = embeddedStyles;
	}
		
	return documentCSS;
};

// Returns the details for the document
WebDeveloper.Content.getDocumentDetails = function()
{
	var documentDetails = {};
	
	documentDetails.pageTitle = document.title;
	documentDetails.pageURL		= document.documentURI;
	
	return documentDetails;
};

// Returns the outline for a document
WebDeveloper.Content.getDocumentOutline = function()
{
	var contentDocument		  = null;
	var contentDocuments	  = WebDeveloper.Content.getDocuments(window);
	var documentAllHeadings = null;
	var documentHeading			= null;
	var documentHeadings	  = null;
	var documentOutline		  = null;
	var heading						  = null;
	var headingImages       = null;
	var headingText				  = null;
	var outline						  = {};
	
	outline.documents = [];
	outline.pageTitle = document.title;
	outline.pageURL	  = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument					 = contentDocuments[i];
		documentAllHeadings			 = contentDocument.querySelectorAll("h1, h2, h3, h4, h5, h6");
		documentOutline					 = {};
		documentOutline.headings = [];
		documentOutline.url			 = contentDocument.documentURI;

		// Loop through the headers
		for(var j = 0, m = documentAllHeadings.length; j < m; j++)
		{
			documentHeading			  = {};
			heading								= documentAllHeadings[j];
      headingText						= WebDeveloper.Common.trim(WebDeveloper.Common.getElementText(heading));
			documentHeading.level = parseInt(heading.tagName.toLowerCase().substring(1), 10);
		 
      // If there is no heading text
      if(!headingText)
      {
				headingImages = heading.querySelectorAll("img[alt]");
 
				// Loop through the heading images
				for(var k = 0, n = headingImages.length; k < n; k++)
				{
					headingText += headingImages[k].getAttribute("alt") + " ";
				}
           
				headingText = WebDeveloper.Common.trim(headingText);
           
				// If there is heading text
				if(headingText)
				{
					headingText = "[" + headingText + "]";
				}
				else
				{
					headingText = "[No heading text]";
				}
      }

			documentHeading.text = headingText;
			
			documentOutline.headings.push(documentHeading);
		}

		outline.documents.push(documentOutline);
	}
	
	return outline;
};

// Returns all the documents under a frame
WebDeveloper.Content.getDocuments = function(frame)
{
	var documents = [];

	// If the frame is set
	if(frame)
	{
		var frames = frame.frames;
 
		// If the frame document exists
		if(frame.document)
		{
			documents.push(frame.document);
		}

		// Loop through the frames
		for(var i = 0, l = frames.length; i < l; i++)
		{
			documents = documents.concat(WebDeveloper.Content.getDocuments(frames[i]));
		}
	}

	return documents;
};

// Returns any forms in the document
WebDeveloper.Content.getForms = function()
{
	var allForms						= null;
	var contentDocument		  = null;
	var contentDocuments		= WebDeveloper.Content.getDocuments(window);
	var documentForm				= null;
	var documentFormElement = null;
	var documentForms			  = null;
	var elementType				  = null;
	var form								= null;
	var formElement				  = null;
	var formElements				= null;
	var forms							  = {};
	
	forms.documents = [];
	forms.pageTitle = document.title;
	forms.pageURL	  = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument		  = contentDocuments[i];
		allForms						= contentDocument.forms;
		documentForms				= {};
		documentForms.forms = [];
		documentForms.url	  = contentDocument.documentURI;

		 // Loop through the forms
		 for(var j = 0, m = allForms.length; j < m; j++)
		 {
			documentForm					= {};
			documentForm.elements = [];
			form									= allForms[j];
			formElements					= form.elements;

			// If the form has an action attribute
			if(form.hasAttribute("action"))
			{
				documentForm.action = form.getAttribute("action");
			}

			// If the form has an id attribute
			if(form.hasAttribute("id"))
			{
				documentForm.id = form.getAttribute("id");
			}

			// If the form has a method attribute
			if(form.hasAttribute("method"))
			{
				documentForm.method = form.getAttribute("method");
			}

			// If the form has a name attribute
			if(form.hasAttribute("name"))
			{
				documentForm.name = form.getAttribute("name");
			}

			// Loop through the form elements
			for(var k = 0, n = formElements.length; k < n; k++)
			{
				documentFormElement = {};
				formElement					= formElements[k];
				elementType					= formElement.tagName.toLowerCase();

				// If this is an input element
				if(elementType == "input")
				{
					documentFormElement.value = formElement.value;
					
					// If the form element has a type attribute
					if(formElement.hasAttribute("type"))
					{
						 elementType = formElement.getAttribute("type");
					}
				}
				else if(elementType == "textarea")
				{
					documentFormElement.value = formElement.value;
				}

				// If the form element has an id attribute
				if(formElement.hasAttribute("id"))
				{
					documentFormElement.id = formElement.getAttribute("id");
				}

				// If the form element has a maxlength attribute
				if(formElement.hasAttribute("maxlength"))
				{
					documentFormElement.maximumLength = formElement.getAttribute("maxlength");
				}

				// If the form element has a name attribute
				if(formElement.hasAttribute("name"))
				{
					documentFormElement.name = formElement.getAttribute("name");
				}

				// If the form element has a size attribute
				if(formElement.hasAttribute("size"))
				{
					documentFormElement.size = formElement.getAttribute("size");
				}
				
				documentFormElement.type = elementType;
				
				documentForm.elements.push(documentFormElement);
			}

			documentForms.forms.push(documentForm);
		}

		forms.documents.push(documentForms);
	}
	
	return forms;
};

// Returns any images in the document
WebDeveloper.Content.getImages = function()
{
	var allImages				 = null;
	var contentDocument	 = null;
	var contentDocuments = WebDeveloper.Content.getDocuments(window);
	var documentImage		 = null;
	var documentImages	 = null;
	var image						 = null;
	var images					 = {};
	
	images.documents = [];
	images.pageTitle = document.title;
	images.pageURL	 = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument			  = contentDocuments[i];
		allImages						  = WebDeveloper.Common.getDocumentImages(contentDocument);
		documentImages				= {};
		documentImages.images = [];
		documentImages.url		= contentDocument.documentURI;

		// Loop through the images
		for(var j = 0, m = allImages.length; j < m; j++)
		{
			documentImage = {};
			image					= allImages[j];

			// If the image has an alt attribute
			if(image.hasAttribute("alt"))
			{
				documentImage.alt = image.getAttribute("alt");
			}

			documentImage.height = image.naturalHeight;
			documentImage.src		 = image.src;
			documentImage.width	 = image.naturalWidth;

			documentImages.images.push(documentImage);
		}

		images.documents.push(documentImages);
	}
	
	return images;
};

// Returns any JavaScript for the document
WebDeveloper.Content.getJavaScript = function()
{
	var contentDocument		 = null;
	var contentDocuments	 = WebDeveloper.Content.getDocuments(window);
	var documentJavaScript = null;
	var embeddedJavaScript = null;
	var javaScript				 = {};
	var script						 = null;
	var scripts						 = null;
	
	javaScript.documents = [];
	javaScript.pageTitle = document.title;
	javaScript.pageURL	 = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument		 = contentDocuments[i];
		documentJavaScript = {};
		embeddedJavaScript = "";
		scripts						 = contentDocument.querySelectorAll("script");
	
		documentJavaScript.url				= contentDocument.documentURI;
		documentJavaScript.javaScript = [];

		// Loop through the scripts
		for(var j = 0, m = scripts.length; j < m; j++)
		{
			script = scripts[j];
	
			// If this is a valid external script
			if(script.src)
			{
				documentJavaScript.javaScript.push(script.src);
			}
			else
			{
				embeddedJavaScript += WebDeveloper.Common.trim(script.innerHTML) + "\n\n";
			}
		}
		
		// If there is embedded JavaScript
		if(embeddedJavaScript)
		{
			documentJavaScript.embedded = embeddedJavaScript;
		}
		
		javaScript.documents.push(documentJavaScript);
	}
	
	return javaScript;
};

// Returns any links in the document
WebDeveloper.Content.getLinks = function()
{
	var contentDocument	 = null;
	var contentDocuments = WebDeveloper.Content.getDocuments(window);
	var documentAllLinks = null;
	var documentLinks		 = null;
	var link						 = null;
	var links						 = {};
	var nonUniqueLinks	 = null;
	
	links.documents = [];
	links.pageTitle = document.title;
	links.pageURL	  = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument		  = contentDocuments[i];
		documentAllLinks		= contentDocument.links;
		documentLinks				= {};
		documentLinks.links = [];
		documentLinks.url	  = contentDocument.documentURI;
		nonUniqueLinks			= [];

		// Loop through the links
		for(var j = 0, m = documentAllLinks.length; j < m; j++)
		{
			nonUniqueLinks.push(documentAllLinks[j].href);
		}

		nonUniqueLinks.sort();

		// Loop through the links
		for(j = 0, m = nonUniqueLinks.length; j < m; j++)
		{
			link = nonUniqueLinks[j];

			// If this is not the last link and the link is the same as the next link
			if(j + 1 < m && link == nonUniqueLinks[j + 1])
			{
				continue;
			}

			documentLinks.links.push(link);
		}

		links.documents.push(documentLinks);
	}
	
	return links;
};

// Returns any meta tags in the document
WebDeveloper.Content.getMetaTags = function()
{
	var contentDocument		  = null;
	var contentDocuments		= WebDeveloper.Content.getDocuments(window);
	var documentAllMetaTags = null;
	var documentMetaTag		  = null;
	var documentMetaTags		= null;
	var metaTag						  = null;
	var metaTags						= {};
	
	metaTags.documents = [];
	metaTags.pageTitle = document.title;
	metaTags.pageURL	 = document.documentURI;

	// Loop through the documents
	for(var i = 0, l = contentDocuments.length; i < l; i++)
	{
		contentDocument					  = contentDocuments[i];
		documentAllMetaTags				= contentDocument.querySelectorAll("meta");
		documentMetaTags					= {};
		documentMetaTags.metaTags = [];
		documentMetaTags.url			= contentDocument.documentURI;

		// Loop through the meta tags
		for(var j = 0, m = documentAllMetaTags.length; j < m; j++)
		{
			documentMetaTag	= {};
			metaTag					= documentAllMetaTags[j];
		 
			// If the meta tag has a name attribute
			if(metaTag.hasAttribute("name"))
			{
				documentMetaTag.content = metaTag.getAttribute("content");
				documentMetaTag.name    = metaTag.getAttribute("name");
			}
			else if(metaTag.hasAttribute("http-equiv"))
			{
				documentMetaTag.content = metaTag.getAttribute("content");
				documentMetaTag.name    = metaTag.getAttribute("http-equiv");
			}
			else if(metaTag.hasAttribute("charset"))
			{
				documentMetaTag.content = metaTag.getAttribute("charset");
				documentMetaTag.name    = "charset";
			}

			documentMetaTags.metaTags.push(documentMetaTag);
		}

		metaTags.documents.push(documentMetaTags);
	}
	
	return metaTags;
};

// Returns the window size
WebDeveloper.Content.getWindowSize = function()
{
	var size = {};

	size.innerHeight = window.innerHeight;
	size.innerWidth	 = window.innerWidth;
	size.outerHeight = window.outerHeight;
	size.outerWidth	 = window.outerWidth;

	return size;
};

// Validates the HTML of the local page
WebDeveloper.Content.validateLocalHTML = function()
{
	var body		= WebDeveloper.Common.getDocumentBodyElement(document);
	var form		= document.createElement("form");
	var input		= document.createElement("input");
	var request = new XMLHttpRequest();
	
	request.open("get", document.documentURI, false);
	request.send(null);

	form.action	 = "http://validator.w3.org/check";
	form.enctype = "multipart/form-data";
	form.method	 = "post";
	form.target	 = "_blank";
	
	input.name	= "fragment";
	input.value = request.responseText;
	
	form.appendChild(input);

	input			  = document.createElement("input");		
	input.name	= "verbose";
	input.value = "1";
	
	form.appendChild(input);
	
	body.appendChild(form);
	form.submit();
	body.removeChild(form);	

	return {};
};
WebDeveloper.Content = WebDeveloper.Content || {};

// Validates the CSS of the local page
WebDeveloper.Content.validateLocalCSS = function()
{
	var contentDocument = null;
	var css							= "";
	var documentCSS			= WebDeveloper.Content.getCSS();
	var documents				= documentCSS.documents;
	var styleSheets			= [];

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];
		styleSheets			= styleSheets.concat(contentDocument.styleSheets);

		// If there are embedded styles
		if(contentDocument.embedded)
		{
			css += contentDocument.embedded;
		}
	}

	chrome.extension.sendRequest({type: "get-content-from-urls", urls: styleSheets}, function(response) 
	{
		var body	= WebDeveloper.Common.getDocumentBodyElement(document);
		var form	= document.createElement("form");
		var input = document.createElement("input");

		// Loop through the style sheets
		for(i = 0, l = response.length; i < l; i++)
		{
			css += response[i].content;
		}
		 
		form.action	= "http://jigsaw.w3.org/css-validator/validator";
		form.enctype = "multipart/form-data";
		form.method	= "post";
		form.target	= "_blank";
		
		input.name	= "text";
		input.value = css;
		 
		form.appendChild(input);

		input				= document.createElement("input");		 
		input.name	= "profile";
		input.value = "css3";
		 
		form.appendChild(input);

		input				= document.createElement("input");		 
		input.name	= "warning";
		input.value = "2";
		 
		form.appendChild(input);
		 
		body.appendChild(form);
		form.submit();
		body.removeChild(form);	
	});

	return {};
};

// Handles any content requests
WebDeveloper.Content.request = function(request, sender, sendResponse) 
{
	// If the request type is to get anchors
	if(request.type == "get-anchors")
	{
		sendResponse(WebDeveloper.Content.getAnchors());
	}
	else if(request.type == "get-broken-images")
	{
		sendResponse(WebDeveloper.Content.getBrokenImages());
	}
	else if(request.type == "get-css")
	{
		sendResponse(WebDeveloper.Content.getCSS());
	}
	else if(request.type == "get-document-details")
	{
		sendResponse(WebDeveloper.Content.getDocumentDetails());
	}
	else if(request.type == "get-document-outline")
	{
		sendResponse(WebDeveloper.Content.getDocumentOutline());
	}
	else if(request.type == "get-forms")
	{
		sendResponse(WebDeveloper.Content.getForms());
	}
	else if(request.type == "get-images")
	{
		sendResponse(WebDeveloper.Content.getImages());
	}
	else if(request.type == "get-javascript")
	{
		sendResponse(WebDeveloper.Content.getJavaScript());
	}
	else if(request.type == "get-links")
	{
		sendResponse(WebDeveloper.Content.getLinks());
	}
	else if(request.type == "get-meta-tags")
	{
		sendResponse(WebDeveloper.Content.getMetaTags());
	}
	else if(request.type == "get-window-size")
	{
		sendResponse(WebDeveloper.Content.getWindowSize());
	}
	else if(request.type == "validate-local-css")
	{
		sendResponse(WebDeveloper.Content.validateLocalCSS());
	}
	else if(request.type == "validate-local-html")
	{
		sendResponse(WebDeveloper.Content.validateLocalHTML());
	}
	else
	{
		// Unknown request	
		sendResponse({});
	}
};

chrome.extension.onRequest.addListener(WebDeveloper.Content.request);
