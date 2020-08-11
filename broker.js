	//const consoleAdd = function (text) {
       // const main = document.getElementById('main');
       // main.innerHTML += text + '<br />';
      //  main.scrollTop = main.scrollHeight;
     // }

      // Connection to your MQTT server, using websocket protocol.
      // Note: you have to activate websocket support on Stackhero console, in your service configuration.
      // This example uses the library MQTT.js (https://github.com/mqttjs/MQTT.js)

      // IMPORTANT: you should create a dedicated user with limited rights.
      // Remember that any client using this page can read the source code and get those credentials!
      // Note: on Node-RED, the websocket URL ends with "/mqtt/"
     const url = 'wss://mqtt.casi.io:8084/mqtt';
     const username = 'admin';
     const password = '4887_Alpha';


      consoleAdd('⏳ Connecting to MQTT server ' + url + '...');

      // Connecting to MQTT server using websockets
      const client = mqtt.connect(url, { username, password });

      client.on('error', function (error) {
        consoleAdd('🚨 Error: ' + error);
      });

      client.on('close', function () {
        consoleAdd('🔌 Connection has been closed');
      });

      client.on('reconnect', function () {
        consoleAdd('⏳ Reconnecting...');
      });



      // On MQTT connection, we subscribe to the "presence" topic and send "Hello MQTT" to it.
      client.on('connect', function () {
        consoleAdd('✅ Connected!');

        const topic = 'presence';
        const topic2 = 'room/light';
	const message = 'Hello MQTT';

        // Subscribe to topic "presence"
        client.subscribe(topic2, function (err, res) {
          if (err) {
            consoleAdd('🚨 Error when subscribing to topic ' + topic2 + ': ' + err);
            return;
          }

          // Sending message "Hello MQTT" to topic "presence"
          consoleAdd('✅ Sending message "' + message + '" to topic "' + topic + '"');
          client.publish(
            topic,
            message,
            { qos: 2 },
            function(err) {
              if (err) {
                consoleAdd('🚨 Error when publishing to topic ' + topic + ': ' + err);
              }
            }
          );
        })
      });

      // Show messages received on every topic
      client.on('message', function (topic2, message) {
      consoleAdd('✅ Message received from MQTT server on topic "' + topic2 + '": ' + message);
      });
