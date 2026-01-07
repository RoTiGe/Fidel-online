// Centralized translation loader - loads translations.json for all games
(function() {
    'use strict';
    
    // Load translations from JSON file
    fetch('/translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load translations');
            }
            return response.json();
        })
        .then(data => {
            window.translations = data;
            console.log('Translations loaded successfully:', Object.keys(data).length, 'words');
            
            // Trigger custom event to notify games that translations are ready
            window.dispatchEvent(new Event('translationsLoaded'));
        })
        .catch(error => {
            console.error('Error loading translations:', error);
            // Fallback to empty object if loading fails
            window.translations = {};
            window.dispatchEvent(new Event('translationsLoaded'));
        });
})();
