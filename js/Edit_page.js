// Edit This Page script.
// Loaded by activating the bookmarklet.
// In the case that this fails to load (downtime, CSP, etc), an alternative method built into the bookmarklet is used instead.

//https://github.com/GarboMuffin/garbomuffin.github.io/blob/master/edit-this-page/edit-this-page.js

(function () {
  "use strict";

  var VERSION = "1.1";
  var LATEST_LOADER_VERSION = 1;

  // window.__editThisPageLoader is defined by the bookmarklet with a magic number
  // we can compare that to the latest known version to show an update the first time the script loads on this page
  var loaderVersion = window.__editThisPageLoader;
  if (loaderVersion !== LATEST_LOADER_VERSION && !window.__editThisPageUpdateShown && loaderVersion !== undefined) {
    window.open("https://garbomuffin.github.io/edit-this-page/update.html?version=" + loaderVersion);
    window.__editThisPageUpdateShown = true;
  }

  // some actions should only occur once (eg. the first time the bookmarklet is run)
  var editThisPageAlreadyLoaded = typeof window.__editThisPageState !== "undefined";

  // support toggling between editable/not editable
  var editThisPageState = !window.__editThisPageState;
  window.__editThisPageState = editThisPageState;

  function stopPropagation(e) {
    if (window.__editThisPageState) {
      e.stopPropagation();
    }
  }

  // the main function, sets an element's "contenteditable" tag
  // recurses into iframes
  function setEditable(root, editable) {
    // add events to disable key events while edit-this-page is activated
    if (!editThisPageAlreadyLoaded) {
      document.addEventListener("keypress", stopPropagation, true);
      document.addEventListener("keyup", stopPropagation, true);
      document.addEventListener("keydown", stopPropagation, true);

      // TODO: cancel mouse events
      // document.addEventListener("mousedown", stopPropagation, true);
      // document.addEventListener("mouseup", stopPropagation, true);
      // document.addEventListener("mousemove", stopPropagation, true);
    }

    if (editable) {
      root.setAttribute("contenteditable", "true");
    } else {
      root.removeAttribute("contenteditable");
    }

    for (const frame of root.getElementsByTagName("iframe")) {
      // skip frames we cannot access
      if (!frame.contentDocument || !frame.contentDocument.body) {
        continue;
      }
      setEditable(frame.contentDocument.body, editable);
    }
  }

  // begin recursing on the current document's body
  setEditable(document.body, editThisPageState);
}());
