const gogoWebhookURL = 'https://discord.com/api/webhooks/1260535961956253739/_GPFgJKJuXpH4Dh_LlMRw_BKNwOJaQ5rEGmwnDbJm9927nt_OQLHGf2z6oIzgOLW_8wn';
const tukrkeyWebhookURL = 'https://discord.com/api/webhooks/1260536248960024719/uGehNhngx0oeskZPWI5e2_JLb_qsNIjAXKqwEMnE3JQSeNqyJ-YKflnMkUptybd907_M';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if ((username === 'gogo' && password === '898974') || (username === 'tukrkey' && password === '123456789')) {
        localStorage.setItem('username', username);
        window.location.href = 'message.html';
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const username = localStorage.getItem('username');
    if (window.location.pathname.endsWith('message.html') && !username) {
        window.location.href = 'index.html';
    } else {
        fetchMessages();
        setInterval(fetchMessages, 3000);
    }
});

function sendMessage() {
    const message = document.getElementById('message').value;
    const username = localStorage.getItem('username');
    if (message.trim() !== '') {
        const webhookURL = username === 'gogo' ? gogoWebhookURL : tukrkeyWebhookURL;
        const messageData = {
            content: `${username}: ${message}`
        };
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('message').value = '';
                fetchMessages();
            } else {
                console.error('Error sending message:', response.statusText);
            }
        })
        .catch(error => console.error('Error sending message:', error));
    }
}

function fetchMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear previous messages
    // Fetch messages from both webhooks
    const fetchGogoMessages = fetch(gogoWebhookURL).then(response => response.json());
    const fetchTukrkeyMessages = fetch(tukrkeyWebhookURL).then(response => response.json());

    Promise.all([fetchGogoMessages, fetchTukrkeyMessages])
        .then(responses => {
            const allMessages = [...responses[0], ...responses[1]];
            allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort messages by timestamp
            allMessages.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.textContent = msg.content;
                messagesDiv.appendChild(messageElement);
            });
        })
        .catch(error => console.error('Error fetching messages:', error));
}
