// TLCSDM Quick Access Plugin - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  // Get all link items
  const links = document.querySelectorAll('.link-item');
  
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('data-url') || this.getAttribute('href');
      
      // Open URL in a new window
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: url });
      } else if (typeof browser !== 'undefined' && browser.tabs) {
        // Firefox/Edge compatibility
        browser.tabs.create({ url: url });
      } else {
        // Fallback for testing in regular browser
        window.open(url, '_blank');
      }
    });
  });
});
