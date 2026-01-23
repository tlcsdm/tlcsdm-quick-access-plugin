// TLCSDM Quick Access Plugin - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  // Apply i18n translations
  applyTranslations();
  
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

/**
 * Apply i18n translations to elements with data-i18n attribute
 */
function applyTranslations() {
  // Check if chrome.i18n is available (running as extension)
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(element) {
      const messageKey = element.getAttribute('data-i18n');
      const message = chrome.i18n.getMessage(messageKey);
      if (message) {
        element.textContent = message;
      }
    });
    
    // Update document title
    const title = chrome.i18n.getMessage('title');
    if (title) {
      document.title = title;
    }
    
    // Update document lang attribute based on locale
    const uiLanguage = chrome.i18n.getUILanguage();
    if (uiLanguage) {
      document.documentElement.lang = uiLanguage;
    }
  }
}
