// client, user and device details
var serverUrl   = "wss://mqtt.casi.io:8084/mqtt";     /* wss://mqtt.cumulocity.com/mqtt for a secure connection */
var clientId    = "casi-1020";
var device_name = "My JS MQTT device";
var tenant      = "";
var username    = "admin";
var password    = "4887_Alpha";

var undeliveredMessages = [];
var temperature = 25;

// configure the client to Cumulocity IoT
var client = new Paho.MQTT.Client(serverUrl, clientId);

// display all incoming messages
client.onMessageArrived = function (message) {
    log('Received operation "' + message.payloadString + '"');
    if (message.payloadString.indexOf("510") == 0) {
        log("Simulating device restart...");
        publish("s/us", "501,c8y_Restart");
        log("...restarting...");
        setTimeout(function() {
            publish("s/us", "503,c8y_Restart");
        }, 1000);
        log("...done...");
    }
};

// display all delivered messages
client.onMessageDelivered = function onMessageDelivered (message) {
    log('Message "' + message.payloadString + '" delivered');
    var undeliveredMessage = undeliveredMessages.pop();
    if (undeliveredMessage.onMessageDeliveredCallback) {
        undeliveredMessage.onMessageDeliveredCallback();
    }
};


// send a message
function publish (topic, message, onMessageDeliveredCallback) {
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    undeliveredMessages.push({
        message: message,
        onMessageDeliveredCallback: onMessageDeliveredCallback
    });
    client.send(message);
}

// connect the client to Cumulocity IoT
function init () {
    client.connect({
        userName: username,
        password: password,
        onSuccess: createDevice
    });
}

// display all messages on the page
function log (message) {
    document.getElementById('logger').insertAdjacentHTML('beforeend', '<div>' + message + '</div>');
}

init();
