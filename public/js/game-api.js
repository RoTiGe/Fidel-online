/**
 * Game API Client
 * Handles all communication with the backend game server
 * Protects game logic and translations from being exposed to the browser
 */

class GameAPI {
    constructor() {
        this.sessionId = null;
        this.baseURL = window.location.origin;
    }

    /**
     * Initialize a new game session
     * @param {string} gameType - Type of game (platformer, derder, etc.)
     * @param {string} language - Language selection (amharic, tigrinya, etc.)
     * @returns {Promise<Object>} Session data
     */
    async initGame(gameType, language = 'amharic') {
        try {
            const response = await fetch(`${this.baseURL}/api/game/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameType, language })
            });

            if (!response.ok) {
                throw new Error('Failed to initialize game');
            }

            const data = await response.json();
            this.sessionId = data.sessionId;
            return data;
        } catch (error) {
            console.error('Game initialization error:', error);
            throw error;
        }
    }

    /**
     * Get the current word to translate
     * @returns {Promise<Object>} Word data with translation
     */
    async getCurrentWord() {
        if (!this.sessionId) {
            throw new Error('No active game session');
        }

        try {
            const response = await fetch(`${this.baseURL}/api/game/word`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: this.sessionId })
            });

            if (!response.ok) {
                throw new Error('Failed to get word');
            }

            return await response.json();
        } catch (error) {
            console.error('Get word error:', error);
            throw error;
        }
    }

    /**
     * Submit completed word for validation
     * @param {string} word - The English word
     * @param {string} collectedLetters - The letters collected by player
     * @param {number} timeSpent - Time spent in milliseconds
     * @returns {Promise<Object>} Validation result with score
     */
    async completeWord(word, collectedLetters, timeSpent) {
        if (!this.sessionId) {
            throw new Error('No active game session');
        }

        try {
            const response = await fetch(`${this.baseURL}/api/game/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    word,
                    collectedLetters,
                    timeSpent
                })
            });

            if (!response.ok) {
                throw new Error('Failed to complete word');
            }

            return await response.json();
        } catch (error) {
            console.error('Complete word error:', error);
            throw error;
        }
    }

    /**
     * Advance to next stage/category
     * @returns {Promise<Object>} Next stage data or game over status
     */
    async advanceStage() {
        if (!this.sessionId) {
            throw new Error('No active game session');
        }

        try {
            const response = await fetch(`${this.baseURL}/api/game/advance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: this.sessionId })
            });

            if (!response.ok) {
                throw new Error('Failed to advance stage');
            }

            return await response.json();
        } catch (error) {
            console.error('Advance stage error:', error);
            throw error;
        }
    }

    /**
     * Get Geez alphabet for rendering (minimal data exposure)
     * @param {string} language - Language selection
     * @returns {Promise<Object>} Alphabet mapping
     */
    async getAlphabet(language = 'amharic') {
        try {
            const response = await fetch(`${this.baseURL}/api/alphabet/${language}`);

            if (!response.ok) {
                throw new Error('Failed to get alphabet');
            }

            return await response.json();
        } catch (error) {
            console.error('Get alphabet error:', error);
            throw error;
        }
    }

    /**
     * Clear current session
     */
    clearSession() {
        this.sessionId = null;
    }
}

// Export for use in games
window.GameAPI = GameAPI;
