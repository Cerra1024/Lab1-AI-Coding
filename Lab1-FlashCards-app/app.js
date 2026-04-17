/**
 * FLASHCARDS APP - APPLICATION STATE MANAGEMENT
 * ============================================================================
 * 
 * Global application state structure managing decks, cards, and UI state.
 * All state mutations should go through dedicated state management functions.
 */

/**
 * Global Application State Object
 * 
 * @typedef {Object} Deck
 * @property {string} id - Unique deck identifier
 * @property {string} name - Deck display name
 * @property {number} createdAt - Timestamp when deck was created
 * 
 * @typedef {Object} Card
 * @property {string} id - Unique card identifier
 * @property {string} front - Front side content
 * @property {string} back - Back side content
 * @property {number} updatedAt - Timestamp of last update
 * 
 * @typedef {Object} UIState
 * @property {number} activeCardIndex - Index of currently displayed card
 * @property {boolean} isCardFlipped - Whether card is flipped
 * @property {string} searchQuery - Current search/filter query
 * 
 * @typedef {Object} AppState
 * @property {Deck[]} decks - Array of all decks
 * @property {Object.<string, Card[]>} cardsByDeckId - Maps deckId to array of cards
 * @property {string|null} activeDeckId - Currently selected deck ID
 * @property {UIState} ui - UI state and view controls
 */

const appState = {
    /**
     * Array of deck objects
     * Each deck contains metadata about a study deck
     * @type {Array}
     */
    decks: [
        {
            id: 'deck-1',
            name: 'Spanish Vocabulary',
            createdAt: Date.now() - 86400000 // 1 day ago
        },
        {
            id: 'deck-2',
            name: 'Math Formulas',
            createdAt: Date.now() - 172800000 // 2 days ago
        },
        {
            id: 'deck-3',
            name: 'Biology Terms',
            createdAt: Date.now() - 259200000 // 3 days ago
        }
    ],

    /**
     * Object mapping deck IDs to arrays of cards
     * Allows efficient lookup of cards by their parent deck
     * @type {Object}
     */
    cardsByDeckId: {
        'deck-1': [
            {
                id: 'card-1-1',
                front: 'gato',
                back: 'cat',
                updatedAt: Date.now()
            },
            {
                id: 'card-1-2',
                front: 'perro',
                back: 'dog',
                updatedAt: Date.now()
            },
            {
                id: 'card-1-3',
                front: 'libro',
                back: 'book',
                updatedAt: Date.now()
            },
            {
                id: 'card-1-4',
                front: 'mesa',
                back: 'table',
                updatedAt: Date.now()
            },
            {
                id: 'card-1-5',
                front: 'casa',
                back: 'house',
                updatedAt: Date.now()
            }
        ],
        'deck-2': [
            {
                id: 'card-2-1',
                front: 'Area of a circle',
                back: 'A = πr²',
                updatedAt: Date.now()
            },
            {
                id: 'card-2-2',
                front: 'Pythagorean theorem',
                back: 'a² + b² = c²',
                updatedAt: Date.now()
            },
            {
                id: 'card-2-3',
                front: 'Quadratic formula',
                back: 'x = (-b ± √(b² - 4ac)) / 2a',
                updatedAt: Date.now()
            }
        ],
        'deck-3': [
            {
                id: 'card-3-1',
                front: 'Mitochondria',
                back: 'The powerhouse of the cell; responsible for ATP production',
                updatedAt: Date.now()
            },
            {
                id: 'card-3-2',
                front: 'Photosynthesis',
                back: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
                updatedAt: Date.now()
            },
            {
                id: 'card-3-3',
                front: 'DNA',
                back: 'Deoxyribonucleic acid; carries genetic instructions for life',
                updatedAt: Date.now()
            }
        ]
    },

    /**
     * ID of the currently active (selected) deck
     * null when no deck is selected
     * @type {string|null}
     */
    activeDeckId: 'deck-1',

    /**
     * UI State - Controls for user interface and view
     * @type {Object}
     */
    ui: {
        /**
         * Index of the currently displayed card in the active deck
         * Ranges from 0 to (cardsCount - 1)
         * @type {number}
         */
        activeCardIndex: 0,

        /**
         * Whether the current card is flipped to show the back
         * @type {boolean}
         */
        isCardFlipped: false,

        /**
         * Search/filter query for cards
         * @type {string}
         */
        searchQuery: ''
    }
};

/**
 * ============================================================================
 * STATE MANAGEMENT UTILITIES
 * ============================================================================
 * Helper functions for safe state mutations and queries
 */

/**
 * Get the active deck object
 * @returns {Object|null} Active deck or null if none selected
 */
function getActiveDeck() {
    if (!appState.activeDeckId) return null;
    return appState.decks.find(deck => deck.id === appState.activeDeckId);
}

/**
 * Get cards for a specific deck
 * @param {string} deckId - The deck ID
 * @returns {Array} Array of cards or empty array if not found
 */
function getCardsByDeckId(deckId) {
    return appState.cardsByDeckId[deckId] || [];
}

/**
 * Get cards for the active deck
 * @returns {Array} Cards in active deck or empty array
 */
function getActiveCards() {
    if (!appState.activeDeckId) return [];
    return getCardsByDeckId(appState.activeDeckId);
}

/**
 * Get the currently displayed card
 * @returns {Object|null} Current card or null if unavailable
 */
function getCurrentCard() {
    const cards = getActiveCards();
    if (cards.length === 0) return null;
    return cards[appState.ui.activeCardIndex] || null;
}

/**
 * Set the active deck by ID
 * @param {string} deckId - The deck ID to activate
 * @returns {boolean} Success status
 */
function setActiveDeck(deckId) {
    const deck = appState.decks.find(d => d.id === deckId);
    if (!deck) return false;
    
    appState.activeDeckId = deckId;
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    return true;
}

/**
 * Move to the next card
 * Loops back to first card when reaching the end
 * @returns {boolean} True if moved, false if no cards
 */
function nextCard() {
    const cards = getActiveCards();
    if (cards.length === 0) return false;
    
    appState.ui.activeCardIndex = (appState.ui.activeCardIndex + 1) % cards.length;
    appState.ui.isCardFlipped = false;
    return true;
}

/**
 * Move to the previous card
 * Loops back to last card when reaching the start
 * @returns {boolean} True if moved, false if no cards
 */
function previousCard() {
    const cards = getActiveCards();
    if (cards.length === 0) return false;
    
    appState.ui.activeCardIndex = appState.ui.activeCardIndex === 0 
        ? cards.length - 1 
        : appState.ui.activeCardIndex - 1;
    appState.ui.isCardFlipped = false;
    return true;
}

/**
 * Toggle the card flip state
 * @returns {boolean} New flip state
 */
function toggleCardFlip() {
    appState.ui.isCardFlipped = !appState.ui.isCardFlipped;
    return appState.ui.isCardFlipped;
}

/**
 * Shuffle the active deck's cards
 * @returns {boolean} Success status
 */
function shuffleActiveDeck() {
    if (!appState.activeDeckId) return false;
    
    const cards = appState.cardsByDeckId[appState.activeDeckId];
    if (!cards) return false;
    
    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    return true;
}

/**
 * Set the search query and filter cards
 * @param {string} query - Search query string
 */
function setSearchQuery(query) {
    appState.ui.searchQuery = query.toLowerCase().trim();
}

/**
 * Get filtered cards based on current search query
 * @returns {Array} Filtered cards
 */
function getFilteredCards() {
    const cards = getActiveCards();
    const query = appState.ui.searchQuery;
    
    if (!query) return cards;
    
    return cards.filter(card =>
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query)
    );
}

/**
 * Add a new card to the active deck
 * @param {string} front - Front content
 * @param {string} back - Back content
 * @returns {Object|null} Created card or null on failure
 */
function addCard(front, back) {
    if (!appState.activeDeckId || !front || !back) return null;
    
    const cards = appState.cardsByDeckId[appState.activeDeckId];
    if (!cards) return null;
    
    const newCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        front: front.trim(),
        back: back.trim(),
        updatedAt: Date.now()
    };
    
    cards.push(newCard);
    
    // Reset activeCardIndex to show the newly added card
    appState.ui.activeCardIndex = cards.length - 1;
    appState.ui.isCardFlipped = false;
    
    return newCard;
}

/**
 * Create a new deck
 * @param {string} name - Deck name
 * @returns {Object|null} Created deck or null on failure
 */
function createDeck(name) {
    if (!name || typeof name !== 'string') return null;
    
    const newDeck = {
        id: `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        createdAt: Date.now()
    };
    
    appState.decks.push(newDeck);
    appState.cardsByDeckId[newDeck.id] = [];
    
    // Auto-activate the new deck
    appState.activeDeckId = newDeck.id;
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    
    return newDeck;
}

/**
 * Get deck statistics
 * @param {string} deckId - The deck ID
 * @returns {Object} Stats object with count and metadata
 */
function getDeckStats(deckId) {
    const cards = getCardsByDeckId(deckId);
    const deck = appState.decks.find(d => d.id === deckId);
    
    return {
        name: deck?.name || 'Unknown',
        cardCount: cards.length,
        createdAt: deck?.createdAt || null
    };
}

/**
 * Log current app state (for debugging)
 */
function logAppState() {
    console.group('App State');
    console.log('Decks:', appState.decks);
    console.log('Active Deck:', getActiveDeck());
    console.log('Active Cards:', getActiveCards());
    console.log('Current Card:', getCurrentCard());
    console.log('UI State:', appState.ui);
    console.groupEnd();
}

/**
 * ============================================================================
 * LOCALSTORAGE PERSISTENCE
 * ============================================================================
 * Save and load app state from browser localStorage with error handling
 */

const STORAGE_KEY = 'flashcards-app-state';

/**
 * Create a default/initial app state
 * Used when no saved state exists or on parse errors
 * @returns {Object} Default app state
 */
function getDefaultState() {
    return {
        decks: [
            {
                id: 'deck-1',
                name: 'Spanish Vocabulary',
                createdAt: Date.now() - 86400000
            },
            {
                id: 'deck-2',
                name: 'Math Formulas',
                createdAt: Date.now() - 172800000
            },
            {
                id: 'deck-3',
                name: 'Biology Terms',
                createdAt: Date.now() - 259200000
            }
        ],
        cardsByDeckId: {
            'deck-1': [
                { id: 'card-1-1', front: 'gato', back: 'cat', updatedAt: Date.now() },
                { id: 'card-1-2', front: 'perro', back: 'dog', updatedAt: Date.now() },
                { id: 'card-1-3', front: 'libro', back: 'book', updatedAt: Date.now() },
                { id: 'card-1-4', front: 'mesa', back: 'table', updatedAt: Date.now() },
                { id: 'card-1-5', front: 'casa', back: 'house', updatedAt: Date.now() }
            ],
            'deck-2': [
                { id: 'card-2-1', front: 'Area of a circle', back: 'A = πr²', updatedAt: Date.now() },
                { id: 'card-2-2', front: 'Pythagorean theorem', back: 'a² + b² = c²', updatedAt: Date.now() },
                { id: 'card-2-3', front: 'Quadratic formula', back: 'x = (-b ± √(b² - 4ac)) / 2a', updatedAt: Date.now() }
            ],
            'deck-3': [
                { id: 'card-3-1', front: 'Mitochondria', back: 'The powerhouse of the cell; responsible for ATP production', updatedAt: Date.now() },
                { id: 'card-3-2', front: 'Photosynthesis', back: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂', updatedAt: Date.now() },
                { id: 'card-3-3', front: 'DNA', back: 'Deoxyribonucleic acid; carries genetic instructions for life', updatedAt: Date.now() }
            ]
        },
        activeDeckId: 'deck-1',
        ui: {
            activeCardIndex: 0,
            isCardFlipped: false,
            searchQuery: ''
        }
    };
}

/**
 * Save the current app state to localStorage
 * Automatically called after state mutations
 * @returns {boolean} Success status
 */
function saveState() {
    try {
        const serialized = JSON.stringify(appState);
        localStorage.setItem(STORAGE_KEY, serialized);
        console.log('✓ State saved to localStorage');
        return true;
    } catch (error) {
        console.error('✗ Failed to save state:', error.message);
        
        // Handle quota exceeded errors
        if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded');
        }
        return false;
    }
}

/**
 * Load app state from localStorage
 * Safely handles missing data and JSON parse errors
 * Falls back to default state if needed
 * @returns {boolean} Success status (true if loaded or used default)
 */
function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        // No saved state exists - use default
        if (!stored) {
            console.log('ℹ No saved state found - using default');
            const defaultState = getDefaultState();
            Object.assign(appState, defaultState);
            return true;
        }
        
        // Parse and validate the stored state
        const parsed = JSON.parse(stored);
        
        // Validate required properties exist
        if (!parsed.decks || !parsed.cardsByDeckId || !parsed.ui) {
            throw new Error('Invalid state structure');
        }
        
        // Merge parsed state into appState
        Object.assign(appState, parsed);
        console.log('✓ State loaded from localStorage');
        return true;
        
    } catch (error) {
        console.error('✗ Failed to load state:', error.message);
        
        // Fallback to default state on any error
        console.log('ℹ Falling back to default state');
        const defaultState = getDefaultState();
        Object.assign(appState, defaultState);
        return true;
    }
}

/**
 * Clear saved state from localStorage
 * Useful for debugging or user reset
 * @returns {boolean} Success status
 */
function clearSavedState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Saved state cleared from localStorage');
        return true;
    } catch (error) {
        console.error('✗ Failed to clear state:', error.message);
        return false;
    }
}

/**
 * Initialize app state on page load
 * Call this function once when the app starts
 */
function initializeApp() {
    const loaded = loadState();
    if (loaded) {
        console.log('App initialized successfully');
        return true;
    }
    return false;
}

/**
 * ============================================================================
 * UI RENDERING & DOM MANAGEMENT
 * ============================================================================
 * Functions for rendering deck list and handling user interactions
 */

/**
 * Render the decks list in the sidebar
 * Clears and recreates the list to avoid duplicate event listeners
 */
function renderDeckList() {
    const decksList = document.getElementById('decks-list');
    if (!decksList) {
        console.error('Decks list element not found');
        return;
    }

    // Clear existing list items
    decksList.innerHTML = '';

    // Create list items for each deck
    appState.decks.forEach(deck => {
        const isActive = deck.id === appState.activeDeckId;
        const cardCount = (appState.cardsByDeckId[deck.id] || []).length;

        const li = document.createElement('li');
        li.className = `deck-item ${isActive ? 'active' : ''}`;
        li.setAttribute('role', 'listitem');

        const button = document.createElement('button');
        button.className = 'deck-button';
        button.textContent = `${deck.name} (${cardCount} cards)`;
        button.dataset.deckId = deck.id;
        
        if (isActive) {
            button.setAttribute('aria-current', 'page');
        }

        // Click handler for deck selection
        button.addEventListener('click', () => {
            handleDeckClick(deck.id);
        });

        li.appendChild(button);
        decksList.appendChild(li);
    });

    console.log('✓ Deck list rendered');
}

/**
 * Handle deck selection
 * Updates active deck and re-renders UI
 * @param {string} deckId - The deck ID to activate
 */
function handleDeckClick(deckId) {
    const success = setActiveDeck(deckId);
    if (success) {
        saveState();
        rerenderUI();
        console.log(`✓ Switched to deck: ${deckId}`);
    }
}

/**
 * Handle "New Deck" button click
 * Prompts user for deck name and creates new deck
 */
function handleNewDeckClick() {
    const deckName = prompt('Enter deck name:');
    
    if (!deckName) {
        console.log('ℹ New deck cancelled');
        return;
    }

    const newDeck = createDeck(deckName);
    if (newDeck) {
        saveState();
        rerenderUI();
        console.log(`✓ Created new deck: ${newDeck.name}`);
    } else {
        alert('Error creating deck. Please try again.');
        console.error('Failed to create deck');
    }
}

/**
 * Handle "New Card" button click
 * Prompts user for front/back content and adds card to active deck
 */
function handleNewCardClick() {
    if (!appState.activeDeckId) {
        alert('Please select a deck first.');
        return;
    }

    const front = prompt('Enter front of card:');
    if (!front) {
        console.log('ℹ New card cancelled');
        return;
    }

    const back = prompt('Enter back of card:');
    if (!back) {
        console.log('ℹ New card cancelled');
        return;
    }

    const newCard = addCard(front, back);
    if (newCard) {
        saveState();
        rerenderUI();
        console.log(`✓ Added new card to deck: ${newCard.id}`);
    } else {
        alert('Error adding card. Please try again.');
        console.error('Failed to add card');
    }
}

/**
 * Handle flip card button click
 * Toggles the card flip state and updates UI
 */
function handleFlipClick() {
    const cards = getActiveCards();
    if (cards.length === 0) {
        console.log('ℹ No cards to flip');
        return;
    }

    toggleCardFlip();
    updateCardFlipUI();
    console.log(`✓ Card flipped: ${appState.ui.isCardFlipped ? 'back' : 'front'}`);
}

/**
 * Handle next card button click
 * Moves to next card and updates UI
 */
function handleNextClick() {
    const success = nextCard();
    if (success) {
        saveState();
        rerenderUI();
        console.log(`✓ Moved to next card: ${appState.ui.activeCardIndex + 1}`);
    } else {
        console.log('ℹ No cards to navigate');
    }
}

/**
 * Handle previous card button click
 * Moves to previous card and updates UI
 */
function handlePrevClick() {
    const success = previousCard();
    if (success) {
        saveState();
        rerenderUI();
        console.log(`✓ Moved to previous card: ${appState.ui.activeCardIndex + 1}`);
    } else {
        console.log('ℹ No cards to navigate');
    }
}

/**
 * Handle shuffle button click
 * Shuffles the active deck and updates UI
 */
function handleShuffleClick() {
    if (!appState.activeDeckId) {
        alert('Please select a deck first.');
        return;
    }

    const success = shuffleActiveDeck();
    if (success) {
        saveState();
        rerenderUI();
        console.log('✓ Deck shuffled');
    } else {
        alert('Error shuffling deck. Please try again.');
        console.error('Failed to shuffle deck');
    }
}

/**
 * Attach event listener to "New Deck" button
 * Should only be called once during initialization
 */
function attachNewDeckListener() {
    const newDeckBtn = document.getElementById('new-deck-btn');
    if (!newDeckBtn) {
        console.error('New Deck button element not found');
        return;
    }

    // Remove any existing listeners by cloning the element
    const newDeckBtnClone = newDeckBtn.cloneNode(true);
    newDeckBtn.parentNode.replaceChild(newDeckBtnClone, newDeckBtn);

    // Add fresh listener
    const freshButton = document.getElementById('new-deck-btn');
    freshButton.addEventListener('click', handleNewDeckClick);
    console.log('✓ New Deck listener attached');
}

/**
 * Attach event listener to "New Card" button
 * Should only be called once during initialization
 */
function attachNewCardListener() {
    const newCardBtn = document.getElementById('new-card-btn');
    if (!newCardBtn) {
        console.error('New Card button element not found');
        return;
    }

    // Remove any existing listeners by cloning the element
    const newCardBtnClone = newCardBtn.cloneNode(true);
    newCardBtn.parentNode.replaceChild(newCardBtnClone, newCardBtn);

    // Add fresh listener
    const freshButton = document.getElementById('new-card-btn');
    freshButton.addEventListener('click', handleNewCardClick);
    console.log('✓ New Card listener attached');
}

/**
 * Attach event listeners to study control buttons
 * Should only be called once during initialization
 */
function attachStudyControlListeners() {
    // Flip button
    const flipBtn = document.getElementById('flip-btn');
    if (flipBtn) {
        const flipBtnClone = flipBtn.cloneNode(true);
        flipBtn.parentNode.replaceChild(flipBtnClone, flipBtn);
        const freshFlipBtn = document.getElementById('flip-btn');
        freshFlipBtn.addEventListener('click', handleFlipClick);
    } else {
        console.error('Flip button element not found');
    }

    // Next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        const nextBtnClone = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(nextBtnClone, nextBtn);
        const freshNextBtn = document.getElementById('next-btn');
        freshNextBtn.addEventListener('click', handleNextClick);
    } else {
        console.error('Next button element not found');
    }

    // Previous button
    const prevBtn = document.getElementById('prev-btn');
    if (prevBtn) {
        const prevBtnClone = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(prevBtnClone, prevBtn);
        const freshPrevBtn = document.getElementById('prev-btn');
        freshPrevBtn.addEventListener('click', handlePrevClick);
    } else {
        console.error('Previous button element not found');
    }

    // Shuffle button
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
        const shuffleBtnClone = shuffleBtn.cloneNode(true);
        shuffleBtn.parentNode.replaceChild(shuffleBtnClone, shuffleBtn);
        const freshShuffleBtn = document.getElementById('shuffle-btn');
        freshShuffleBtn.addEventListener('click', handleShuffleClick);
    } else {
        console.error('Shuffle button element not found');
    }

    console.log('✓ Study control listeners attached');
}

/**
 * Render the main content area (deck title and stats)
 */
function renderMainContent() {
    const activeDeck = getActiveDeck();
    if (!activeDeck) {
        console.warn('No active deck available');
        return;
    }

    const deckTitle = document.getElementById('deck-title');
    const deckStats = document.querySelector('.deck-stats');

    if (deckTitle) {
        deckTitle.textContent = activeDeck.name;
    }

    if (deckStats) {
        const cards = getActiveCards();
        const currentCard = appState.ui.activeCardIndex + 1;
        const totalCards = cards.length;
        
        if (totalCards === 0) {
            deckStats.textContent = 'No cards in this deck';
        } else {
            deckStats.textContent = `Card ${currentCard} of ${totalCards}`;
        }
    }

    console.log('✓ Main content rendered');
}

/**
 * Render the flashcard display
 */
function renderFlashcard() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) {
        console.error('Flashcard element not found');
        return;
    }

    const currentCard = getCurrentCard();

    if (!currentCard) {
        flashcard.innerHTML = '<p style="padding: 2rem; text-align: center; color: #999;">No cards available</p>';
        flashcard.classList.remove('is-flipped');
        return;
    }

    // Apply flip state class
    if (appState.ui.isCardFlipped) {
        flashcard.classList.add('is-flipped');
    } else {
        flashcard.classList.remove('is-flipped');
    }

    // Update card content
    const frontSide = flashcard.querySelector('.card-front');
    const backSide = flashcard.querySelector('.card-back');

    if (frontSide && backSide) {
        frontSide.innerHTML = `<p class="card-label">Front</p><p class="card-content">${escapeHtml(currentCard.front)}</p>`;
        backSide.innerHTML = `<p class="card-label">Back</p><p class="card-content">${escapeHtml(currentCard.back)}</p>`;
    }

    console.log('✓ Flashcard rendered');
}

/**
 * Update only the card flip UI state
 * Used for flip button to avoid full re-render
 */
function updateCardFlipUI() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) {
        console.error('Flashcard element not found');
        return;
    }

    if (appState.ui.isCardFlipped) {
        flashcard.classList.add('is-flipped');
    } else {
        flashcard.classList.remove('is-flipped');
    }

    console.log('✓ Card flip UI updated');
}

/**
 * Master re-render function
 * Call this after any state change to update the UI
 */
function rerenderUI() {
    try {
        renderDeckList();
        renderMainContent();
        renderFlashcard();
        console.log('✓ UI re-rendered');
    } catch (error) {
        console.error('Error during UI re-render:', error);
    }
}

/**
 * Initialize UI event listeners
 * Call this once when the app starts
 */
function initializeUIListeners() {
    attachNewDeckListener();
    attachNewCardListener();
    attachStudyControlListeners();
    console.log('✓ UI listeners initialized');
}

/**
 * Complete app startup
 * Call this function once on DOMContentLoaded
 */
function startApp() {
    console.log('🚀 Starting Flashcards App...');
    
    const appReady = initializeApp();
    if (appReady) {
        initializeUIListeners();
        rerenderUI();
        console.log('✓ App ready!');
    } else {
        console.error('Failed to initialize app');
    }
}

// Export for testing (if using modules)
// export { appState, saveState, loadState, initializeApp, startApp, ... };

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    startApp();
});