window.addEventListener("load", function() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id,{code: "_20p.startApp();"});
  });
 }, false);
