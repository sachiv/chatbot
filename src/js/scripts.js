var bot_avatar_img_url = 'dist/images/bot-avatar.png',
    chatBotName = 'Cyborg',
    guest_name = 'Guest',
    apiURL = 'https://www.personalityforge.com/api/chat/',
    apiKey = '__YOUR__KEY__', // use your own key
    chatBotID = '63906';

var myApp = new Framework7();

var $$ = Dom7;

// Conversation flag
var conversationStarted = false;

// Init Messages
var myMessages = myApp.messages('.messages', {
    autoLayout: true
});

// Init Messagebar
var myMessagebar = myApp.messagebar('.messagebar', {
    maxHeight: 200
});

// Handle message
$$('.messagebar .link').on('click', function () {
    addMessage('sent');
});

function addMessage(messageType, messageText, chatBotName) {
    if (messageType == 'sent' || messageType == 'received') {
        // Avatar and name for received message
        var avatar, name;
        if (messageType === 'received') {
            avatar = bot_avatar_img_url;
            if (chatBotName) {
                name = chatBotName;
            } else {
                name = chatBotName;
            }
        } else {
            name = guest_name;
            // Message text
            if (!messageText) {
                messageText = myMessagebar.value().trim();
            }
            // Exit if empy message
            if (messageText.length === 0) return;

            // Empty messagebar
            myMessagebar.clear();
        }
        // Add message
        myMessages.addMessage({
            // Message text
            text: messageText,
            // Random message type
            type: messageType,
            // Avatar and name:
            avatar: avatar,
            name: name,
            // Day
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        })
        // Update conversation flag
        conversationStarted = true;

        if (messageType === 'sent') {
            askChatbot(messageText);
        }
    }
}

function askChatbot(messageText) {
    //do get request
    $$.get(apiURL, {
        apiKey: apiKey,
        chatBotID: chatBotID,
        externalID: guest_name,
        message: messageText
    }, function (data) {
        data = JSON.parse(data);
        if (data.success) {
            chatBotName = data.message.chatBotName;
            addMessage('received', data.message.message, chatBotName);
        } else {
            addMessage('received', data.errorType + " :: " + data.errorMessage, chatBotName);
        }
    });
}