document.addEventListener('DOMContentLoaded', () => {
    // === DOM Element Selectors ===
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const personaCards = document.querySelectorAll('.persona-card');
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const chatMain = document.querySelector('.chat-main');
    const welcomeSection = document.querySelector('.welcome-section');

    // === Application State ===
    let currentQuery = '';
    let currentPersonaContainer = null;

    // === Configuration ===
    const BACKEND_URL = 'http://localhost:3000/api/echo'; 

    // === Event Listeners ===
    sendBtn.addEventListener('click', handleSendMessage);

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = `${Math.min(userInput.scrollHeight, 120)}px`;
    });

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    personaCards.forEach(card => {
        card.addEventListener('click', () => {
            if (currentQuery) {
                handlePersonaClick(card);
            }
        });
    });

    // === Helper Functions ===

    /**
     * Converts basic Markdown to HTML.
     */
    function markdownToHtml(markdown) {
        let html = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
        html = html.replace(/^(<li>.*<\/li>)/gms, '<ul>$1</ul>');
        html = html.replace(/\n/g, '<br>');
        return '<p>' + html + '</p>';
    }

    /**
     * Copies the text content of the message bubble to the clipboard.
     */
    function copyResponse(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.classList.add('copied');
            button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            const parent = button.parentElement;
            const errorMsg = document.createElement('span');
            errorMsg.textContent = 'Failed to copy';
            errorMsg.classList.add('copy-error');
            parent.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 2000);
        });
    }

    // === Main Functions ===

    /**
     * Handles the user's message submission.
     */
    function handleSendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        currentQuery = userMessage;

        if (personaCards.length === 0) {
            displayMessage("Error: Persona cards missing in HTML.", 'error');
            return;
        }

        welcomeSection.style.display = 'none';
        displayMessage(userMessage, 'user');

        const personaCardContainer = document.createElement('div');
        personaCardContainer.classList.add('persona-card-container');

        personaCards.forEach(card => {
            const clonedCard = card.cloneNode(true);
            clonedCard.classList.remove('active');
            
            clonedCard.addEventListener('click', () => {
                handlePersonaClick(clonedCard);
            });
            personaCardContainer.appendChild(clonedCard);
        });

        currentPersonaContainer = personaCardContainer;
        chatMessages.appendChild(currentPersonaContainer);

        userInput.value = '';
        userInput.style.height = 'auto';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Helper to clean up the persona selection container.
     */
    function removePersonaContainer() {
        if (currentPersonaContainer && chatMessages.contains(currentPersonaContainer)) {
            currentPersonaContainer.remove();
            currentPersonaContainer = null;
        }
    }

    /**
     * Handles the click on a persona card and triggers the backend call.
     */
    function handlePersonaClick(clickedCard) {
        const persona = clickedCard.getAttribute('data-persona');
        
        if (!currentQuery) {
            removePersonaContainer(); 
            displayMessage("Please type a message first!", 'error');
            return;
        }

        document.querySelectorAll('.persona-card').forEach(card => card.classList.remove('active'));
        clickedCard.classList.add('active');

        removePersonaContainer();
        displayThinkingIndicator(persona);

        sendBackendRequest(currentQuery, persona);
    }

    /**
     * Creates and displays a message bubble in the chat.
     */
    function displayMessage(message, type) {
        const personaDisplayNames = {
            optimistic: 'Optimistic',
            sarcastic: 'Sarcastic',
            philosophical: 'Philosophical',
            realistic: 'Practical', 
            error: 'Error'
        };

        const messageElement = document.createElement('div');
        messageElement.classList.add('echo-bubble');

        if (type === 'user') {
            messageElement.classList.add('user-message');
            messageElement.textContent = message;
        } else {
            messageElement.classList.add(type);
            
            const personaHeader = document.createElement('div');
            personaHeader.classList.add('persona-header');

            const personaLabel = document.createElement('span');
            personaLabel.classList.add('persona-label');
            personaLabel.textContent = personaDisplayNames[type] || type; 
            personaHeader.appendChild(personaLabel);

            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            
            copyBtn.addEventListener('click', () => {
                copyResponse(message, copyBtn); 
            });
            personaHeader.appendChild(copyBtn);
            
            messageElement.appendChild(personaHeader);

            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            messageContent.innerHTML = markdownToHtml(message);
            messageElement.appendChild(messageContent);
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Displays a temporary 'thinking' indicator.
     */
    function displayThinkingIndicator(persona) {
        const thinkingElement = document.createElement('div');
        thinkingElement.classList.add('echo-bubble', 'thinking', persona);
        thinkingElement.setAttribute('id', 'thinking-indicator');

        const personaLabel = document.createElement('div');
        personaLabel.classList.add('persona-label');
        personaLabel.textContent = persona; 
        thinkingElement.appendChild(personaLabel);

        const dots = document.createElement('div');
        dots.classList.add('typing-dots');
        dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        thinkingElement.appendChild(dots);

        chatMessages.appendChild(thinkingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return thinkingElement;
    }

    /**
     * Removes the 'thinking' indicator from the chat.
     */
    function removeThinkingIndicator() {
        const indicator = document.getElementById('thinking-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Sends the message to the backend using the Fetch API.
     */
    async function sendBackendRequest(userMessage, persona) {
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: userMessage, 
                    persona: persona,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const echoMessage = data.response || "Error: Backend did not return a valid 'response' field."; 

            removeThinkingIndicator();
            displayMessage(echoMessage, persona);

        } catch (error) {
            removeThinkingIndicator();
            displayMessage(`[NETWORK ERROR] Could not connect. Ensure your backend is running on ${BACKEND_URL}. Details: ${error.message}`, 'error');
        }
    }
});
