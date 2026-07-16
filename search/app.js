// App State
let config = {
    service: 'formspree',
    endpoint: 'https://formspree.io/f/xpqvqgra',
    captcha: true,
    submissionMode: 'ajax'
};

let searchHistory = [];

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchSubmitBtn = document.getElementById('searchSubmitBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const settingsDrawer = document.getElementById('settingsDrawer');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const serviceSelect = document.getElementById('serviceSelect');
const endpointLabel = document.getElementById('endpointLabel');
const endpointInput = document.getElementById('endpointInput');
const formsubmitExtraGroup = document.getElementById('formsubmitExtraGroup');
const captchaToggle = document.getElementById('captchaToggle');
const submissionModeSelect = document.getElementById('submissionModeSelect');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const drawerOverlay = document.querySelector('.drawer-overlay');

const suggestionTags = document.querySelectorAll('.tag');
const historyContainer = document.getElementById('historyContainer');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const resultsSection = document.getElementById('resultsSection');
const resultQueryVal = document.getElementById('resultQueryVal');
const resultEndpointVal = document.getElementById('resultEndpointVal');
const resultModeVal = document.getElementById('resultModeVal');
const resultPayloadVal = document.getElementById('resultPayloadVal');

// Default Config Constant
const DEFAULT_CONFIG = {
    service: 'formspree',
    endpoint: 'https://formspree.io/f/xpqvqgra',
    captcha: true,
    submissionMode: 'ajax'
};

// -------------------------------------------------------------
// Initialization
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadHistory();
    setupEventListeners();
    applyConfigToForm();
});

// -------------------------------------------------------------
// Local Storage Handling
// -------------------------------------------------------------
function loadSettings() {
    const savedConfig = localStorage.getItem('aura_search_config');
    if (savedConfig) {
        try {
            config = { ...config, ...JSON.parse(savedConfig) };
        } catch (e) {
            console.error('Failed to parse saved config, using default', e);
        }
    }
    
    // Sync configuration UI elements
    serviceSelect.value = config.service;
    endpointInput.value = config.endpoint;
    captchaToggle.checked = config.captcha;
    submissionModeSelect.value = config.submissionMode;
    
    updateSettingsFormState();
}

function saveSettings() {
    let endpoint = endpointInput.value.trim();
    if (!endpoint) {
        alert('Please specify a valid form endpoint or ID.');
        return;
    }

    config.service = serviceSelect.value;
    config.endpoint = endpoint;
    config.captcha = captchaToggle.checked;
    config.submissionMode = submissionModeSelect.value;

    localStorage.setItem('aura_search_config', JSON.stringify(config));
    applyConfigToForm();
    closeSettings();
    
    // Pulse animation indicating changes applied
    const card = document.querySelector('.search-card');
    card.style.boxShadow = '0 0 40px rgba(168, 85, 247, 0.4)';
    setTimeout(() => {
        card.style.boxShadow = '';
    }, 1000);
}

function resetSettings() {
    if (confirm('Are you sure you want to reset settings to default Formspree values?')) {
        config = { ...DEFAULT_CONFIG };
        localStorage.setItem('aura_search_config', JSON.stringify(config));
        
        serviceSelect.value = config.service;
        endpointInput.value = config.endpoint;
        captchaToggle.checked = config.captcha;
        submissionModeSelect.value = config.submissionMode;
        
        updateSettingsFormState();
        applyConfigToForm();
        closeSettings();
    }
}

// -------------------------------------------------------------
// History Management
// -------------------------------------------------------------
function loadHistory() {
    const savedHistory = localStorage.getItem('aura_search_history');
    if (savedHistory) {
        try {
            searchHistory = JSON.parse(savedHistory);
        } catch (e) {
            searchHistory = [];
        }
    }
    renderHistory();
}

function addToHistory(query) {
    // Remove if already exists to put it on top
    searchHistory = searchHistory.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add to start
    searchHistory.unshift({
        query: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    // Cap at 5 items
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    
    localStorage.setItem('aura_search_history', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    if (searchHistory.length === 0) {
        historyContainer.classList.add('hidden');
        return;
    }
    
    historyContainer.classList.remove('hidden');
    historyList.innerHTML = '';
    
    searchHistory.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        li.innerHTML = `
            <span class="history-text" data-query="${escapeHtml(item.query)}">${escapeHtml(item.query)}</span>
            <div class="history-meta">
                <span class="history-time">${item.timestamp}</span>
                <button class="history-del-btn" data-index="${index}" title="Remove">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        
        historyList.appendChild(li);
    });
}

function deleteHistoryItem(index) {
    searchHistory.splice(index, 1);
    localStorage.setItem('aura_search_history', JSON.stringify(searchHistory));
    renderHistory();
}

function clearHistory() {
    if (confirm('Clear all search history?')) {
        searchHistory = [];
        localStorage.removeItem('aura_search_history');
        renderHistory();
    }
}

// -------------------------------------------------------------
// UI State Sync
// -------------------------------------------------------------
function updateSettingsFormState() {
    const isFormspree = serviceSelect.value === 'formspree';
    
    if (isFormspree) {
        endpointLabel.textContent = 'Formspree Form URL / ID';
        endpointInput.placeholder = 'e.g. https://formspree.io/f/xpqvqgra or xpqvqgra';
        formsubmitExtraGroup.classList.add('hidden');
    } else {
        endpointLabel.textContent = 'FormSubmit Recipient Email';
        endpointInput.placeholder = 'e.g. your-email@example.com';
        formsubmitExtraGroup.classList.remove('hidden');
    }
}

function applyConfigToForm() {
    const finalUrl = getFormActionUrl();
    searchForm.action = finalUrl;
    
    // Clear old hidden inputs from form
    const oldHidden = searchForm.querySelectorAll('input[type="hidden"]');
    oldHidden.forEach(el => el.remove());
    
    // FormSubmit custom configurations using hidden elements
    if (config.service === 'formsubmit') {
        // Disable Captcha if requested
        if (!config.captcha) {
            addHiddenField('_captcha', 'false');
        }
        // Custom redirection URL if redirection submission is used
        if (config.submissionMode === 'redirect') {
            const redirectUrl = window.location.href;
            addHiddenField('_next', redirectUrl);
        }
        // Subject line
        addHiddenField('_subject', 'Aura Search Query Captured');
        // Prevent autoresponse email back to sender
        addHiddenField('_autoresponse', 'false');
    }
}

function getFormActionUrl() {
    const rawVal = config.endpoint.trim();
    
    if (config.service === 'formspree') {
        // Normalise Formspree URL
        if (rawVal.startsWith('http://') || rawVal.startsWith('https://')) {
            return rawVal;
        } else {
            // Assume it's just the ID
            return `https://formspree.io/f/${rawVal}`;
        }
    } else {
        // FormSubmit
        const isEmail = rawVal.includes('@');
        let email = isEmail ? rawVal : 'your-email@example.com';
        
        if (config.submissionMode === 'ajax') {
            return `https://formsubmit.co/ajax/${email}`;
        } else {
            return `https://formsubmit.co/${email}`;
        }
    }
}

function addHiddenField(name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    searchForm.appendChild(input);
}

// Drawer animations
function openSettings() {
    settingsDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    settingsDrawer.classList.add('hidden');
    document.body.style.overflow = '';
}

// -------------------------------------------------------------
// Form Submission & Request Executions
// -------------------------------------------------------------
async function handleSearchSubmit(e) {
    const query = searchInput.value.trim();
    if (!query) return;
    
    // Save to history list immediately
    addToHistory(query);

    // If redirection mode is active, execute standard HTML form submission
    if (config.submissionMode === 'redirect') {
        return; // Let standard form action proceed
    }

    // Otherwise prevent standard HTML submission and run via AJAX
    e.preventDefault();
    
    // UI Loading State
    statusIndicator.classList.remove('hidden');
    searchSubmitBtn.disabled = true;
    resultsSection.classList.add('hidden');
    
    const targetUrl = getFormActionUrl();
    const payload = {};
    
    if (config.service === 'formspree') {
        payload['search_query'] = query;
        payload['_timestamp'] = new Date().toISOString();
    } else {
        payload['Search Query'] = query;
        payload['Timestamp'] = new Date().toString();
        // Include captcha flag
        if (!config.captcha) {
            payload['_captcha'] = 'false';
        }
    }
    
    try {
        statusText.textContent = 'Transmitting telemetry query...';
        await new Promise(resolve => setTimeout(resolve, 800)); // Smooth animation delay
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok || data.success === 'true' || data.success === true) {
            statusText.textContent = 'Query logged successfully!';
            statusIndicator.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
            statusIndicator.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            statusIndicator.style.color = '#10b981';
            
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Present Results UI
            resultQueryVal.textContent = `"${query}"`;
            resultEndpointVal.textContent = targetUrl;
            resultModeVal.textContent = `AJAX Background (${config.service === 'formspree' ? 'Formspree' : 'FormSubmit'})`;
            resultPayloadVal.textContent = JSON.stringify(payload, null, 2);
            resultsSection.classList.remove('hidden');
            
            // Scroll results into view
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset input
            searchInput.value = '';
        } else {
            throw new Error(data.message || 'Transmission failed. Service returned error status.');
        }
    } catch (err) {
        console.error(err);
        statusText.textContent = `Error: ${err.message || 'Endpoint connection failed'}`;
        statusIndicator.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
        statusIndicator.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        statusIndicator.style.color = '#ef4444';
        
        // FormSubmit AJAX first-use error fallback
        if (config.service === 'formsubmit') {
            statusText.innerHTML = `Submission failed. If this is a new email, please verify the activation link in your inbox.`;
        }
        
        await new Promise(resolve => setTimeout(resolve, 4000));
    } finally {
        // Reset loader UI
        statusIndicator.classList.add('hidden');
        statusIndicator.style.backgroundColor = '';
        statusIndicator.style.borderColor = '';
        statusIndicator.style.color = '';
        statusText.textContent = 'Logging telemetry query...';
        searchSubmitBtn.disabled = false;
    }
}

// -------------------------------------------------------------
// Event Listeners setup
// -------------------------------------------------------------
function setupEventListeners() {
    // Search form submission
    searchForm.addEventListener('submit', handleSearchSubmit);
    
    // Toggle Settings drawer
    settingsToggleBtn.addEventListener('click', openSettings);
    settingsCloseBtn.addEventListener('click', closeSettings);
    drawerOverlay.addEventListener('click', closeSettings);
    
    // Service selector change
    serviceSelect.addEventListener('change', () => {
        updateSettingsFormState();
    });
    
    // Settings actions
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);
    
    // Suggestions selection
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            searchInput.focus();
        });
    });
    
    // Search history interactions
    historyList.addEventListener('click', (e) => {
        const textBtn = e.target.closest('.history-text');
        const delBtn = e.target.closest('.history-del-btn');
        
        if (textBtn) {
            searchInput.value = textBtn.dataset.query;
            searchInput.focus();
        } else if (delBtn) {
            const idx = parseInt(delBtn.dataset.index);
            deleteHistoryItem(idx);
        }
    });
    
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Keyboard shortcuts listeners
    document.addEventListener('keydown', (e) => {
        // '/' key focuses the search input when not already typing
        if (e.key === '/' && document.activeElement !== searchInput && 
            document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape key closes settings or blurs search
        if (e.key === 'Escape') {
            if (!settingsDrawer.classList.contains('hidden')) {
                closeSettings();
            } else if (document.activeElement === searchInput) {
                searchInput.blur();
            }
        }
    });
}

// Helper: Escape HTML strings for safety
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
