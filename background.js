const searchEngines = [
  {
    id: "google",
    title: "Google",
    url: "https://www.google.com/search?q=",
    icon: "icons/google.png"
  },
  {
    id: "youtube",
    title: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    icon: "icons/youtube.png"
  },
  {
    id: "x",
    title: "X (Twitter)",
    url: "https://twitter.com/search?q=",
    icon: "icons/x.png"
  },
  {
    id: "facebook",
    title: "Facebook",
    url: "https://www.facebook.com/search/top?q=",
    icon: "icons/facebook.png"
  }
];

browser.contextMenus.create({
  id: "search-parent",
  title: "Wyszukaj w internecie",
  contexts: ["selection"]
});

searchEngines.forEach(engine => {
  browser.contextMenus.create({
    id: engine.id,
    parentId: "search-parent",
    title: engine.title,
    contexts: ["selection"],
    icons: {
      "16": engine.icon
    }
  });
});

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

browser.contextMenus.onShown.addListener((info) => {
  if (info.contexts.includes("selection") && info.selectionText) {
    const displayText = info.selectionText.length > 30 
      ? info.selectionText.substring(0, 30) + "..." 
      : info.selectionText;
    
    browser.contextMenus.update("search-parent", {
      title: `Wyszukaj "${displayText}" w`
    });
    browser.contextMenus.refresh();
  }
});

browser.contextMenus.onClicked.addListener((info, tab) => { 
  if (info.selectionText) {
    const engine = searchEngines.find(e => e.id === info.menuItemId);
    
    if (engine) {
      let searchQuery = info.selectionText;
      
      searchQuery = encodeURIComponent(searchQuery);
      
      if (engine.id === "google" || engine.id === "youtube") {
        searchQuery = searchQuery.replace(/%20/g, '+');
      }
      
      const searchUrl = engine.url + searchQuery;
      browser.tabs.create({ url: searchUrl }).then(onCreated, onError);
    }
  }
});