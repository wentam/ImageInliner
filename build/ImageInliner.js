var ImageInliner = {};


(function() {

  var recursivelyInline = function(sourceElement, targetElement, flags) {
    if (flags == null) { flags = {}; }
    if (flags.isRecursion == null) { flags.isRecursion = false }

    // inline image the element if it's an image
    if (sourceElement.tagName == "IMG") {
      ImageInliner.inlineImage(targetElement, flags);
    }

    // handle recursion
    var childElements = sourceElement.children;
    var targetChildElements = targetElement.children;
    for (var i = 0; i < childElements.length; i++) {
      flags.isRecursion = true;
      recursivelyInline(childElements[i], targetChildElements[i], flags);
    }

    return targetElement;
  }

  // ImageInliner.inlineImage
  //
  // Params:
  // image: The element that will have it's images inlined
  // flags: A map of options. All are optional.
  //   Valid flags:
  //     makeCopy (Default false): If true, will create a copy with inlined styles rather than inlining directly into the object passed.
  //
  // Return value:
  // The element with inlined images. Will be a copy of the input element if makeCopy is true;
  ImageInliner.inlineImage = function(image, flags) {
    if (flags == null) { flags = {}; }

    if (image.tagName != "IMG") {
      throw "Passed element is not an image!";
      return;
    }


    var buffer = document.createElement('canvas');
    var ctx = buffer.getContext('2d');

    buffer.width = image.naturalWidth;
    buffer.height = image.naturalHeight;

    ctx.drawImage(image,0,0);

    var imageData;

    try {
      imageData = buffer.toDataURL();
      image.src = imageData;
    } catch (e) {
      if (e instanceof DOMException && e.name == "SecurityError") {
        console.log("ImageInliner warning: can't inline image "+image+" due to the same-origin policy.");
      } else {
        throw e;
      }
    }
  }

  // ImageInliner.inlineImages
  //
  // Params:
  // element: The element that will have it's images inlined
  // flags: A map of options. All are optional.
  //   Valid flags:
  //     makeCopy (Default false): If true, will create a copy with inlined styles rather than inlining directly into the object passed.
  //
  // Return value:
  // The element with inlined images. Will be a copy of the input element if makeCopy is true;
  ImageInliner.inlineImages = function(element, flags) {
    if (flags == null) { flags = {}; }

    if (flags.makeCopy == null) { flags.makeCopy = false; }

    if (element.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError("Invalid element passed");
      return;
    }

    var targetElement;
    if (flags.makeCopy) {
      targetElement = element.cloneNode(true);
    } else {
      targetElement = element;
    }

    return recursivelyInline(element,targetElement,flags);
  }
}());
