# IoT Workshop

## Objectives

The Internet of Things (IoT) links physical things, such as weather sensors and smartphones, to applications. This linkage allows applications to provide functionality based on the information it can derive from the things that are connected to it. IoT has applications across many industries, including government, insurance, energy, and smart homes.  In this workshop you will work with [IBM Cloud](https://www.ibm.com/cloud) services, [Node-RED](https://nodered.org/) (a visual application development tool), a [Raspberry Pi](https://www.ibm.com/cloud), and a [Raspberry Pi Sense HAT](https://www.raspberrypi.org/products/sense-hat) device to build an application that uses sensor data, such as temperature, humidity, and barometric pressure.  You will explore ways in which you can programatically control devices based upon these sensor readings.

- First, you will create an instance of the [Internet of Things platform](https://cloud.ibm.com/catalog/services/internet-of-things-platform) in your IBM Cloud account and you will register the Raspberry Pi as a gateway device to your new IoT service.
- Following that, you will use Node-RED to create an application on the Raspberry Pi that collects sensor information (temperature, humidity, barometric pressure, and joystick movement) from the attached Sense HAT and sends it to the IoT Platform.
- Finally, you will create a second Node-RED application in your IBM Cloud account that will collect, store, and act on the sensor data it receives from the Raspberry Pi.  

## Prerequisites

In order to complete this workshop, you will need:

- An [IBM Cloud](https://www.ibm.com/cloud) account
- A [Raspberry Pi](https://www.ibm.com/cloud)
- A [Raspberry Pi Sense HAT](https://www.raspberrypi.org/products/sense-hat)
- Access to the Internet.  THe primary objective of this workshop is to use the Raspberry Pi as an IoT edge device.  As such, these instructions treat the Raspberry Pi as a remote ***headless*** device.  As a result, it is assumed that your Raspberry Pi is connected to a network that provides internet access as well as the ability to access it remotely via ssh and http.

## Hardware Setup
### Before attaching your Sense HAT to your Raspberry Pi
There is an issue when using the Sense HAT on a Raspberry Pi 4 when running headless.  In order to for the Raspberry Pi 4 to boot properly you should do one of the following prior to attaching your Sense HAT:  

- With root (sudo) priveledge, edit the file `/boot/config.txt` and uncomment the line `hdmi_force_hotplug=1`
- Use the raspi-config tool to *set a specific screen resolution*.  You will find this option under *Display Options*.  Any resultion can be chosen.

Once you have completed one of the above methods, you can then remove power from the Raspberry Pi and attach the Sense HAT.  Be sure to shutdown the Raspberry Pi first with:  
`sudo shutdown now`  
A great introduction to the Sense HAT, including attachment instructions, can be found at [Getting started with the Sense HAT](https://projects.raspberrypi.org/en/projects/getting-started-with-the-sense-hat).

## Software Setup

- Update the Raspberry Pi OS  
`sudo apt update`  
`sudo apt upgrade`
- Install additional software for the Sense HAT  
`sudo apt install -y sense-hat build-essential git`
- Install/Update NodeJS & Node-RED  
`bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)`  
Note: be sure to answer `y` when asked about installing the Pi-specific nodes.
- Install additional Node-RED nodes for the Sense HAT and the IoT service  
`npm install --prefix ~/.node-red node-red-node-pi-sense-hat node-red-contrib-ibm-watson-iot`

## Starting Node-RED

There are two methods for starting Node-RED on the Raspberry Pi. You can either start/stop it manually when needed, or you can run it as a service so that it starts automatically every time the system boots.

- Manual start/stop  
`node-red-start` and  
`node-red-stop`  
**Note:** When the Node-RED app starts, using this method, the last action it performs is to start a logging function.  You can exit this logging, if needed, by pressing Ctrl-c.  This will not stop Node-RED itself.  If/When you want to stop Node-RED, you need to issue the stop command.
- Start automatically as a service  
`sudo systemctl enable --now nodered.service`  
To stop the service temporarily  
`sudo systemctl stop nodered.service`  
To start it again:  
`sudo systemctl start nodered.service`  
To disable autostarting at boot  
`sudo systemctl disable nodered.service`

[Learn more about Node-RED on a Raspberry Pi here](https://nodered.org/docs/getting-started/raspberrypi).

## Start The Workshop

Two sets of instructions are provided for this workshop.  If you have prior experience and would like to try and complete the exercise on your own, follow the [Advanced path](#advanced-path).  Otherwise, if you prefer a more guided approach, choose the [Guided path](#guided-path).

---

## Guided Path

In this portion of the workshop you will create a Node-RED application on the Raspberry Pi that will collect sensor data from a device called a Sense HAT that is attached to the Pi.  You will then forward that data to your IoT Platform service so that it can be used by a corresponding Node-RED application you will create in IBM Cloud.  There are three different types (environment, motion, & joystick) of sensor data and each type will be sent to the IoT Platform service with a specific event type so that different actions might be taken depending on the event type.  Additionally, this application will be able to receive commands sent from the IBM Cloud application that will control the 8x8 LED matrix that is part of the Sense HAT device.  One command (alarm) will turn the entire matrix into a solid color that is provided as a part of the message payload.  The other command (message) will scroll a text message across the matrix.  The message, the text color, and the background color will all be provided as a part of the message payload.

Before you can create the Node-RED application on the Raspberry Pi, it must be powered on and the Node-RED service must be started.
- Apply power to your Raspberry Pi by attaching a standard microUSB cable between the microUSB connector on the Raspberry Pi and a power source such as a laptop or USB power block. (booting takes less than a minute).
- Connect to your Raspberry Pi using ssh.  Your Pi can be reached at via it’s IP address by using the following format: ssh pi@<ip address>. 
Note: Depending on your system configuration, you may be able to connect to your laptop by name rather than by ip address.  To do this, you append “.local” to your Raspberry Pi hostname.  For example: ssh pi@raspberrypi.local (pi is the default username on the Raspberry Pi).
    • If you are using MacOS or Linux, open a terminal window to execute the ssh command.
    • If you are using windows, start the PuTTY application from the Windows start menu and provide the connection information there.
    3. At this point, you will be prompted for the user password.  The Raspberry Pi credentials are:
User ID: pi
Password: raspberry
Note: When you connect to the Raspberry Pi for the first time, you may see a message indicating that the authenticity of the host could not be established.  Simply answer with “yes”.
    4. Once logged in, you will see a message reminding you to change the password of your Pi.  Use the passwd command to change it in order to ensure the security of your work.  Be sure to make a note of your new password.
    5. In order to ensure that Node-RED will restart automatically in the event of reboots and crashes, you should enable the Node-RED service with the command: 
sudo systemctl enable nodered.service
    6. Finally, start Node-RED on the Pi with the command:
node-red-start
Note: When the Node-RED app starts, the last action it performs is to start a logging function.  You can exit this logging, if needed, by pressing Ctrl-c.  This will not stop Node-RED itself.  If/When you want to stop Node-RED, you need to issue the command: node-red-stop.
Flow 1 – Sending Sensor Data
    1. Node-RED programming is done via web browser.  In order to get started, fire up another of your team’s laptop browsers and in the address bar enter: <ip address>:1880.  Here you replace
<ip address> with the ip address of your Raspberry Pi.
Note: Depending on your system configuration, you may be able to connect to your laptop by name rather than by ip address.  To do this, you append “.local” to your Raspberry Pi hostname.  For example: ssh pi@raspberrypi.local (pi is the default username on the Raspberry Pi).
Also Note:  When you started Node-RED on the Pi, you may have noticed that is said to go to 127.0.0.1:1880.  This would work if you were running the browser on the Pi itself (There is actually a full GUI environment available on the Pi and you can run a browser locally).  However, because you are connecting to the Pi remotely, you need to use the network address of your Raspberry Pi.
    2. From the node palette on the left, find the input node (it should be located in the Raspberry_Pi section of the palette) and drag it out into your Node-RED workspace.
    3. Double click on the new Sense HAT node to open its settings and ensure that all three event types are being reported by checking each box.
    4. Next, find and add a  node (In the output section) to the right of the Sense HAT node.
    5. Open the debug node and change the output to complete msg object.  This will allow you to view the entire msg being received by the prior node.  It can be very useful in helping to format the msg that needs to be sent to the next node.
    6. Connect your Sense HAT node to your debug node by clicking and dragging from one connection point to the other .
    7. At this point, verify that your Sense HAT is producing output by clicking . 
    8. On the right side of the page you should see a tab labeled “debug”.  Click on that tab and you should see a tremendous amount of data flowing into your debug node from the Sense HAT.
    9. On the right side of the debug node you will see a green toggle button .  This allows you to stop/start the output to that particular debug node.  Turn off the output by clicking the toggle and the data will stop scrolling by in the debug panel.  Now you can get a closer look at the actual messages that the Sense HAT is sending.  Take a minute to examine the debug output.  You will see that each Sense HAT message has a topic and a payload.  Notice that the topic will match one of the three data types that the Sense HAT reports (environment, motion, & joystick).  In order to perform different actions on the different sensor topics, we will separate them into unique events.  
    10. Find the switch node (function section) and add it to your workspace to the right of your Sense HAT node.  
    11. Connect the switch node to the Sense HAT node.  The switch node has connectors on both the left and right side.  The switch node is designed to take an incoming message from left side and route the application flow to different paths based upon the value of some element of the incoming message.  It will then send the message along its way using the output connectors on the right.
    12. Open the settings for the switch node and set the property value to msg.topic. The contents of msg.topic is what will be used to branch application flow.  Below the Property value is an area in which you can specify what you want to compare the msg.topic to.  This application will need to route its flow based upon whether the msg.topic is equal (==) to “environment”, “motion”, or “joystick”.  
    13. Click the drop-down menu beside the == in order to get an idea of the possible comparison operations that can be performed.  Leave the value set to ==.
    14. To the right of that is a field where you specify the actual value you will compare to.  There is also a drop-down here that allows you to specify what type of data is being compared.  Ensure that String is selected and then enter the string environment into the field.
    15. Use the  button near the bottom to add the additional comparison fields for motion and joystick.
Note: When you close the switch node settings, you will now see three separate connection points on the output side of the switch node.  This is what allows you to route the flow based on the results of the comparison.  The connection points are in the same order as they appear in the switch node settings.
    16. One thing that you may have noticed when viewing the debug output is sheer volume of events being generated by both the environment and the motion topics.  If you were to send every one of these events to the IoT Platform service, you would quickly use up the 200MB data limit that is imposed on a free IoT Platform service.  This is also a consideration for your clients as the IoT Platform service does have data transmission charge.  To deal with this, add two delay nodes.  Connect one to the environment output and one to the motion output of the switch node.
    17. For each delay node, open the settings and set the action to Limit rate to.
    18. Limit the rate to 1 message every 5 seconds and check the box to drop intermediate messages.  This will cause the application to discard all messages except for one every 5 seconds.
    19. Now, let’s move the debug node from the Sense HAT over to the output of the switch/delay nodes.  First, delete the connection between the Sense HAT node and the debug node by clicking on the line connecting them and then hitting the delete key.
    20. Now, connect the output of the two delay nodes and the final switch connection (joystick topic) to the debug node.  
Note: You can have several nodes connecting to a single connection point on another node.
    21. Redeploy the application by once again clicking deploy and you should see a dramatic decrease in the number of messages received.  Note: You will only see joystick topics when you actually use the Sense HAT joystick.  For that reason, there is no need to delay them like the other topics.
    22. Finally, it is time to send these messages to your IoT Platform service so that they can be accessed from your IBM Cloud application.  For this, you will need to pull three Internet of Things output nodes into your workspace and position them to the right of your delay nodes.
    23. Each IoT node will send a separate event type to the IoT Platform service.  You will need to configure them by opening settings and configuring as follows:

• Because we defined the Raspberry Pi as a Gateway device, you need to connect as a Gateway.
    • When configuring the first of these nodes, you will need to Add new wiotp-credentials.  You do this by clicking on the  in the credentials line.  Here you will specify the gateway device that you defined earlier.  Use the values that you recorded during the IoT device definition to fill in the appropriate fields.  Do not modify any other fields in this section.
    • The device type and Device ID can be any value that helps to identify their purpose.  We will use the values provided in the image.
    • The value entered into Event type will define the actual event that this message comprises.  Use one of the three values in each node.

   24. Connect the three IoT nodes to their respective delay or switch nodes.
    25. Once again, deploy the application.  If everything has gone well, you will see a green dot below the IoT nodes that indicates they are now connected to the IoT Platform service.
    26. This concludes flow 1.

### Register the Raspberry Pi with the Internet of Things service

### Create IBM Cloud Node-RED Application

---

## Advanced Path

### Create an Internet of Things Platform service and define the Raspberry Pi Gateway device

- Create an Internet of Things Platform service in your IBM Cloud space
- In your newly created IoT Platform service, define a new **Gateway** device type called **piGateway**
- Add a new gateway device called **myPiGateway** using the newly defined piGateway device type

**Note:** This workshop treats the Raspberry Pi as an edge gateway and the attached Sense HAT as a downstream sensor device.  It is not necessary to define the Sense HAT device to the IoT Platform service as the gateway device will do it automatically when the Sense HAT connects through it.

### Create a DB2 database service and a table to store sensor data

- Create a Db2 database service in your IBM Cloud space
- Create a database table called **SENSEDATA** containing the following columns and data types

  | **Column Name** | **Data Type** | **Length** |
  | ---             | ---           | ---        |
  | SENSORID        | VARCHAR       | 20
  | TEMPERATURE     | DOUBLE        |
  | HUMIDITY        | DOUBLE        |
  | PRESSURE        | DOUBLE        |
  | TIMESENT        | TIMESTAMP     |

  **Note:** The name of the table and columns are an important element of later steps so be sure to double check your spelling.

### Create a Node-RED Application in your IBM Cloud space

- Create a new Node-RED application from the Node-RED template in the catalog
- Connect your IoT Platform and Db2 services to your new application
- Create the following Node-RED flow in your IBM Cloud Node-RED application  
![Cloud Final Flow](/images/cloud-final-flow.png)  

  **Note:** You will need to use the Node-RED Palette Manager to install the **node-red-contrib-scx-ibmiotapp** set of IoT input and output nodes.

- Use *ibmiot in* nodes to receive the incoming *environment* and *joystick* events
- Format the incoming environment data into the appropriate format that the Db2 node expects  

  The incoming *environment* event will have the following payload structure:

  ``` javascript
  msg.payload = {"d":{"temperature": "35.21",
                     "humidity": "38.31",
                     "pressure": "994.84"}}
  ```

  The Db2 node will need the following payload structure based upon the table created earlier

  ``` javascript
  msg.payload = {SENSORID : deviceId,
                 TEMPERATURE : temperature,
                 HUMIDITY : humidity,
                 PRESSURE : pressure,
                 TIMESENT : 'TIMESTAMP'}
  ```

- Take action on the incoming *joystick* events and send a *message* command to the Sense HAT LED.  The message should be different for each direction of the joystick.  

  The *ibmiot out* node for joystick events should use the *message* command type and the payload will need to have the following structure:

  ``` javascript
  command:    "message"
  format:     "json"
  deviceType: "SenseHat"
  deviceId:   "mySenseHat"
  payload:    {"d":{"color":"color",
                    "background":"color",
                    "message":"some text"}}
  ```

- Send some test *alarm* commands to the Sense HAT LED.  The *inject* nodes should generate a payload in the format expected by the Raspberry Pi based upon the following table:

  | Name    | Color |
  | ---     | ---   |
  | LED Off | off   |
  | Green   | green |
  | Red     | red   |

  The *ibmiot out* node for alarms should use the *alarm* command type and the payload will need to have the following structure:
  
  ``` javascript
  command:    "alarm"
  format:     "json"
  deviceType: "SenseHat"
  deviceId:   "mySenseHat"
  payload:    {"d":{"color":"color"}}

### Create Raspberry Pi Node-RED Flows

- Create the following Node-RED flow on the Raspberry Pi  
![Pi Final Flow](/images/pi-final-flow.png)
- Break the Sense HAT sensor data into two different event types (environment & joystick).
- Limit the number of environment events that are sent to the IoT nodes to 1 every 5 seconds.  Otherwise you will quickly overwhelm the data transfer limits imposed by the free IoT Platform service
- Send the data to the IoT Platform service as one of two event types.
- Receive incoming IoT commands called *alarm* and *message*  
The *alarm* command should light the entire 8x8 LED matrix on the Sense HAT to a solid color provided in the incoming IoT command.  The incoming alarm command will have the following payload structure:

  ``` javascript
  msg.command:    "alarm"
  msg.format:     "json"
  msg.deviceType: "SenseHat"
  msg.deviceId:   "mySenseHat"
  msg.payload:    {"d":{"color":"color"}}
  ```

  The *message* command should scroll a message across the LED matrix.  The message, the text color, and the background color are all provided in the incoming IoT command.  The incoming message command will have the following payload structure:

  ``` javascript
  msg.command:    "message"
  msg.format:     "json"
  msg.deviceType: "SenseHat"
  msg.deviceId:   "mySenseHat"
  msg.payload:    {"d":{"color":"color",
                        "background":"color",
                        "message":"message text"}}
  ```

- In order to set the entire 8x8 Sense HAT LED matrix to a specific color, you need to have the following string in the msg.payload *(replace color with a color choice like red, blue, green, etc)*

  ``` javascript
    msg.payload = "*, *, color"
  ```

- To have a message scroll across the LED matrix, the msg format is a bit more detailed *(again, replace color with a color choice like red, blue, green, etc)*

  ``` javascript
  msg.color = "color"
  msg.background = "color"
  msg.payload = "message to display"
  ```

---

## Validation and Testing
