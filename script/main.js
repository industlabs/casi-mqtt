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

// display all delivered messages
client.onMessageDelivered = function onMessageDelivered (message) {
    log('Message "' + message.payloadString + '" delivered');
    var undeliveredMessage = undeliveredMessages.pop();
    if (undeliveredMessage.onMessageDeliveredCallback) {
        undeliveredMessage.onMessageDeliveredCallback();
    }
};

function createDevice () {
    // register a new device
    publish("s/us", "100," + device_name + ",c8y_MQTTDevice", function() {
        // set hardware information
        publish("s/us", "110,S123456789,MQTT test model,Rev0.1", function() {
            publish('s/us', '114,c8y_Restart', function() {
                log('Enable restart operation support');
                //listen for operation
               // client.subscribe("s/ds");
                  client.subscribe("room/light");
            })

            // send temperature measurement
            setInterval(function() {
                publish("s/us", '211,'+temperature);
                temperature += 0.5 - Math.random();
            }, 3000);
        });
    });
}

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
