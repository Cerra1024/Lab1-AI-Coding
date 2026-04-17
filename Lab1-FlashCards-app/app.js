/**
 * FLASHCARDS APP - APPLICATION STATE MANAGEMENT
 */

const appState = {
    decks: [
  {
    id: 'deck-1',
    name: 'French Vocabulary',
    createdAt: Date.now()
  },
  {
    id: 'deck-2',
    name: 'Human Anatomy',
    createdAt: Date.now()
  },
  {
    id: 'deck-3',
    name: 'Calculus Concepts',
    createdAt: Date.now()
  }
],

    cardsByDeckId: {
        'deck-1': [
            { id: 'card-1-1', front: 'bonjour', back: 'hello', updatedAt: Date.now() },
            { id: 'card-1-2', front: 'merci', back: 'thank you', updatedAt: Date.now() },
            { id: 'card-1-3', front: 'au revoir', back: 'goodbye', updatedAt: Date.now() },
            { id: 'card-1-4', front: 's’il vous plaît', back: 'please (formal)', updatedAt: Date.now() },
            { id: 'card-1-5', front: 'fromage', back: 'cheese', updatedAt: Date.now() }
        ],
        'deck-2': [
        { id: 'card-2-1', front: 'Heart', back: 'Pumps blood through the body', updatedAt: Date.now() },
        { id: 'card-2-2', front: 'Lungs', back: 'Responsible for gas exchange (oxygen and carbon dioxide)', updatedAt: Date.now() },
        { id: 'card-2-3', front: 'Brain', back: 'Controls body functions and processes information', updatedAt: Date.now() },
        { id: 'card-2-4', front: 'Femur', back: 'The longest bone in the human body', updatedAt: Date.now() },
        { id: 'card-2-5', front: 'Skin', back: 'Largest organ that protects the body', updatedAt: Date.now() }
    ],
        'deck-3': [
        { id: 'card-3-1', front: 'Derivative', back: 'Represents the rate of change of a function', updatedAt: Date.now() },
        { id: 'card-3-2', front: 'Integral', back: 'Represents accumulation or area under a curve', updatedAt: Date.now() },
        { id: 'card-3-3', front: 'Derivative of cos(x)?', back: '-sin(x)', updatedAt: Date.now() },
        { id: 'card-3-4', front: 'What does a positive slope mean?', back: 'The graph is going up', updatedAt: Date.now() },
        { id: 'card-3-5', front: 'f(x) = x² derivative', back: 'f’(x) = 2x', updatedAt: Date.now() }
    ]
    },

    activeDeckId: 'deck-1',

    ui: {
        activeCardIndex: 0,
        isCardFlipped: false,
        searchQuery: ''
    }
};

const STORAGE_KEY = 'flashcards-app-state';

/* ============================================================================
   HELPERS
   ============================================================================ */

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getDefaultState() {
    return {
        decks: [
            { id: 'deck-1', name: 'French Vocabulary', createdAt: Date.now() },
            { id: 'deck-2', name: 'Human Anatomy', createdAt: Date.now() },
            { id: 'deck-3', name: 'Calculus Concepts', createdAt: Date.now() }
        ],
        cardsByDeckId: {
            'deck-1': [
                { id: 'card-1-1', front: 'bonjour', back: 'hello', updatedAt: Date.now() },
                { id: 'card-1-2', front: 'merci', back: 'thank you', updatedAt: Date.now() },
                { id: 'card-1-3', front: 'au revoir', back: 'goodbye', updatedAt: Date.now() },
                { id: 'card-1-4', front: 's’il vous plaît', back: 'please (formal)', updatedAt: Date.now() },
                { id: 'card-1-5', front: 'fromage', back: 'cheese', updatedAt: Date.now() }
            ],
            'deck-2': [
                { id: 'card-2-1', front: 'Heart', back: 'Pumps blood through the body', updatedAt: Date.now() },
                { id: 'card-2-2', front: 'Lungs', back: 'Gas exchange (oxygen & carbon dioxide)', updatedAt: Date.now() },
                { id: 'card-2-3', front: 'Brain', back: 'Controls body and thinking', updatedAt: Date.now() },
                { id: 'card-2-4', front: 'Femur', back: 'Longest bone in the body', updatedAt: Date.now() },
                { id: 'card-2-5', front: 'Skin', back: 'Protects the body', updatedAt: Date.now() }
            ],
            'deck-3': [
                { id: 'card-3-1', front: 'What is a derivative?', back: 'The rate of change', updatedAt: Date.now() },
                { id: 'card-3-2', front: 'What is an integral?', back: 'Area under a curve', updatedAt: Date.now() },
                { id: 'card-3-3', front: 'What is a limit?', back: 'Value a function approaches', updatedAt: Date.now() },
                { id: 'card-3-4', front: 'Derivative of x²?', back: '2x', updatedAt: Date.now() },
                { id: 'card-3-5', front: 'Derivative of x³?', back: '3x²', updatedAt: Date.now() }
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


/* ============================================================================
   STATE GETTERS
   ============================================================================ */

function getActiveDeck() {
    if (!appState.activeDeckId) return null;
    return appState.decks.find(deck => deck.id === appState.activeDeckId) || null;
}

function getCardsByDeckId(deckId) {
    return appState.cardsByDeckId[deckId] || [];
}

function getActiveCards() {
    if (!appState.activeDeckId) return [];
    return getCardsByDeckId(appState.activeDeckId);
}

function getFilteredCards() {
    const cards = getActiveCards();
    const query = appState.ui.searchQuery.trim().toLowerCase();

    if (!query) return cards;

    return cards.filter(card =>
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query)
    );
}

function getCurrentFilteredCard() {
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return null;
    return filteredCards[appState.ui.activeCardIndex] || null;
}

/* ============================================================================
   STATE MUTATIONS
   ============================================================================ */

function validateAndFixCardIndex() {
    const cards = getFilteredCards();
    const maxIndex = Math.max(0, cards.length - 1);

    if (appState.ui.activeCardIndex > maxIndex) {
        appState.ui.activeCardIndex = maxIndex;
    }

    if (appState.ui.activeCardIndex < 0) {
        appState.ui.activeCardIndex = 0;
    }
}

function setActiveDeck(deckId) {
    const deck = appState.decks.find(d => d.id === deckId);
    if (!deck) return false;

    appState.activeDeckId = deckId;
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    appState.ui.searchQuery = '';
    validateAndFixCardIndex();

    return true;
}

function nextCard() {
    const cards = getFilteredCards();
    if (cards.length === 0) return false;

    appState.ui.activeCardIndex = (appState.ui.activeCardIndex + 1) % cards.length;
    appState.ui.isCardFlipped = false;
    return true;
}

function previousCard() {
    const cards = getFilteredCards();
    if (cards.length === 0) return false;

    appState.ui.activeCardIndex =
        appState.ui.activeCardIndex === 0
            ? cards.length - 1
            : appState.ui.activeCardIndex - 1;

    appState.ui.isCardFlipped = false;
    return true;
}

function toggleCardFlip() {
    appState.ui.isCardFlipped = !appState.ui.isCardFlipped;
    return appState.ui.isCardFlipped;
}

function shuffleActiveDeck() {
    if (!appState.activeDeckId) return false;

    const cards = appState.cardsByDeckId[appState.activeDeckId];
    if (!cards || cards.length === 0) return false;

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    appState.ui.searchQuery = '';
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    return true;
}

function setSearchQuery(query) {
    appState.ui.searchQuery = query.toLowerCase().trim();
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    validateAndFixCardIndex();
}

function addCard(front, back) {
    if (!appState.activeDeckId || !front || !back) return null;

    const cards = appState.cardsByDeckId[appState.activeDeckId];
    if (!cards) return null;

    const newCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        front: front.trim(),
        back: back.trim(),
        updatedAt: Date.now()
    };

    cards.push(newCard);
    appState.ui.activeCardIndex = cards.length - 1;
    appState.ui.isCardFlipped = false;

    return newCard;
}

function createDeck(name) {
    if (!name || typeof name !== 'string' || !name.trim()) return null;

    const newDeck = {
        id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: name.trim(),
        createdAt: Date.now()
    };

    appState.decks.push(newDeck);
    appState.cardsByDeckId[newDeck.id] = [];
    appState.activeDeckId = newDeck.id;
    appState.ui.activeCardIndex = 0;
    appState.ui.isCardFlipped = false;
    appState.ui.searchQuery = '';

    return newDeck;
}

/* ============================================================================
   STORAGE
   ============================================================================ */

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        return true;
    } catch (error) {
        console.error('Failed to save state:', error);
        return false;
    }
}

function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            Object.assign(appState, getDefaultState());
            return true;
        }

        const parsed = JSON.parse(stored);

        if (!parsed.decks || !parsed.cardsByDeckId || !parsed.ui) {
            throw new Error('Invalid saved state structure');
        }

        Object.assign(appState, parsed);
        validateAndFixCardIndex();
        return true;
    } catch (error) {
        console.error('Failed to load state:', error);
        Object.assign(appState, getDefaultState());
        return true;
    }
}

/* ============================================================================
   RENDERING
   ============================================================================ */

function renderDeckList() {
    const decksList = document.getElementById('decks-list');
    if (!decksList) return;

    decksList.innerHTML = '';

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

        li.appendChild(button);
        decksList.appendChild(li);
    });
}

function renderMainContent() {
    const activeDeck = getActiveDeck();
    const deckTitle = document.getElementById('deck-title');
    const deckStats = document.querySelector('.deck-stats');

    if (!deckTitle || !deckStats) return;

    if (!activeDeck) {
        deckTitle.textContent = 'No Deck Selected';
        deckStats.textContent = 'Select or create a deck';
        return;
    }

    deckTitle.textContent = activeDeck.name;

    const filteredCards = getFilteredCards();
    const allCards = getActiveCards();
    const currentCard = filteredCards.length > 0 ? appState.ui.activeCardIndex + 1 : 0;

    if (allCards.length === 0) {
        deckStats.textContent = 'No cards in this deck';
    } else if (appState.ui.searchQuery && filteredCards.length === 0) {
        deckStats.textContent = 'No cards match your search';
    } else if (appState.ui.searchQuery) {
        deckStats.textContent = `Card ${currentCard} of ${filteredCards.length} (filtered from ${allCards.length})`;
    } else {
        deckStats.textContent = `Card ${currentCard} of ${allCards.length}`;
    }
}

function renderSearchInput() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value !== appState.ui.searchQuery) {
        searchInput.value = appState.ui.searchQuery;
    }
}

function renderFlashcard() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    const frontSide = flashcard.querySelector('.card-front');
    const backSide = flashcard.querySelector('.card-back');

    if (!frontSide || !backSide) return;

    const allCards = getActiveCards();
    const filteredCards = getFilteredCards();
    const currentCard = getCurrentFilteredCard();

    if (allCards.length === 0) {
        frontSide.innerHTML = `<p class="card-label">Front</p><p class="card-content">No cards available</p>`;
        backSide.innerHTML = `<p class="card-label">Back</p><p class="card-content">Add a card to begin</p>`;
        flashcard.classList.remove('is-flipped');
        return;
    }

    if (appState.ui.searchQuery && filteredCards.length === 0) {
        frontSide.innerHTML = `<p class="card-label">Front</p><p class="card-content">No cards found</p>`;
        backSide.innerHTML = `<p class="card-label">Back</p><p class="card-content">Try another search</p>`;
        flashcard.classList.remove('is-flipped');
        return;
    }

    if (!currentCard) {
        frontSide.innerHTML = `<p class="card-label">Front</p><p class="card-content">Card not found</p>`;
        backSide.innerHTML = `<p class="card-label">Back</p><p class="card-content">Please try again</p>`;
        flashcard.classList.remove('is-flipped');
        return;
    }

    frontSide.innerHTML = `
        <p class="card-label">Front</p>
        <p class="card-content">${escapeHtml(currentCard.front)}</p>
    `;

    backSide.innerHTML = `
        <p class="card-label">Back</p>
        <p class="card-content">${escapeHtml(currentCard.back)}</p>
    `;

    frontSide.setAttribute('aria-hidden', appState.ui.isCardFlipped ? 'true' : 'false');
    backSide.setAttribute('aria-hidden', appState.ui.isCardFlipped ? 'false' : 'true');

    if (appState.ui.isCardFlipped) {
        flashcard.classList.add('is-flipped');
    } else {
        flashcard.classList.remove('is-flipped');
    }
}

function updateCardFlipUI() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    const frontSide = flashcard.querySelector('.card-front');
    const backSide = flashcard.querySelector('.card-back');

    if (appState.ui.isCardFlipped) {
        flashcard.classList.add('is-flipped');
    } else {
        flashcard.classList.remove('is-flipped');
    }

    if (frontSide && backSide) {
        frontSide.setAttribute('aria-hidden', appState.ui.isCardFlipped ? 'true' : 'false');
        backSide.setAttribute('aria-hidden', appState.ui.isCardFlipped ? 'false' : 'true');
    }
}

function rerenderUI() {
    renderDeckList();
    renderMainContent();
    renderSearchInput();
    renderFlashcard();
}

/* ============================================================================
   EVENT HANDLERS
   ============================================================================ */

function handleDeckClick(deckId) {
    if (setActiveDeck(deckId)) {
        saveState();
        rerenderUI();
    }
}

function handleNewDeckClick() {
    const deckName = prompt('Enter deck name:');
    if (!deckName) return;

    const newDeck = createDeck(deckName);
    if (newDeck) {
        saveState();
        rerenderUI();
    }
}

function handleNewCardClick() {
    if (!appState.activeDeckId) {
        alert('Please select a deck first.');
        return;
    }

    const front = prompt('Enter front of card:');
    if (!front) return;

    const back = prompt('Enter back of card:');
    if (!back) return;

    const newCard = addCard(front, back);
    if (newCard) {
        saveState();
        rerenderUI();
    }
}

function handleFlipClick() {
    if (getFilteredCards().length === 0) return;
    toggleCardFlip();
    updateCardFlipUI();
    saveState();
}

function handleNextClick() {
    if (nextCard()) {
        saveState();
        rerenderUI();
    }
}

function handlePrevClick() {
    if (previousCard()) {
        saveState();
        rerenderUI();
    }
}

function handleShuffleClick() {
    if (!appState.activeDeckId) {
        alert('Please select a deck first.');
        return;
    }

    if (shuffleActiveDeck()) {
        saveState();
        rerenderUI();
    }
}

function handleSearchInput(event) {
    setSearchQuery(event.target.value);
    saveState();
    rerenderUI();
}

function handleKeyboardControls(event) {
    const cards = getFilteredCards();
    if (cards.length === 0) return;

    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    switch (event.code) {
        case 'Space':
        case 'KeyF':
            event.preventDefault();
            handleFlipClick();
            break;
        case 'ArrowRight':
        case 'KeyN':
            event.preventDefault();
            handleNextClick();
            break;
        case 'ArrowLeft':
        case 'KeyP':
            event.preventDefault();
            handlePrevClick();
            break;
        case 'KeyS':
            event.preventDefault();
            handleShuffleClick();
            break;
    }
}

/* ============================================================================
   LISTENERS
   ============================================================================ */

function initializeUIListeners() {
    const newDeckBtn = document.getElementById('new-deck-btn');
    const newCardBtn = document.getElementById('new-card-btn');
    const flipBtn = document.getElementById('flip-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const searchInput = document.getElementById('search-input');
    const flashcard = document.getElementById('flashcard');
    const decksList = document.getElementById('decks-list');

    if (newDeckBtn) newDeckBtn.addEventListener('click', handleNewDeckClick);
    if (newCardBtn) newCardBtn.addEventListener('click', handleNewCardClick);
    if (flipBtn) flipBtn.addEventListener('click', handleFlipClick);
    if (nextBtn) nextBtn.addEventListener('click', handleNextClick);
    if (prevBtn) prevBtn.addEventListener('click', handlePrevClick);
    if (shuffleBtn) shuffleBtn.addEventListener('click', handleShuffleClick);
    if (searchInput) searchInput.addEventListener('input', handleSearchInput);

    if (flashcard) {
        flashcard.addEventListener('click', handleFlipClick);
        flashcard.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                event.preventDefault();
                handleFlipClick();
            }
        });
    }

    if (decksList) {
        decksList.addEventListener('click', (event) => {
            const button = event.target.closest('.deck-button');
            if (!button) return;
            handleDeckClick(button.dataset.deckId);
        });
    }

    document.addEventListener('keydown', handleKeyboardControls);
}

/* ============================================================================
   APP START
   ============================================================================ */

function initializeApp() {
    return loadState();
}

function startApp() {
    const appReady = initializeApp();

    if (appReady) {
        initializeUIListeners();
        rerenderUI();
        console.log('Flashcards app ready');
    } else {
        console.error('Failed to initialize app');
    }
}

document.addEventListener('DOMContentLoaded', startApp);

