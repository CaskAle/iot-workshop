# IoT Workshop

## Objectives

The Internet of Things (IoT) links physical things, such as weather sensors and smartphones, to applications. This linkage allows applications to provide functionality based on the information it can derive from the things that are connected to it. IoT has applications across many industries, including government, insurance, energy, and smart homes.  In this workshop you will work with [IBM Cloud](https://www.ibm.com/cloud) services, [Node-RED](https://nodered.org/) (a visual application development tool), a [Raspberry Pi](https://www.ibm.com/cloud), and a [Raspberry Pi Sense HAT](https://www.raspberrypi.org/products/sense-hat) device to build an application that uses sensor data, such as temperature, humidity, and barometric pressure.  You will explore ways in which you can programatically control devices based upon these sensor readings.

- First, you will create an instance of the [Internet of Things platform](https://cloud.ibm.com/catalog/services/internet-of-things-platform) in your IBM Cloud account and you will register the Raspberry Pi as a gateway device to your new IoT service.
- Following that, you will use Node-RED to create an application on the Raspberry Pi that collects sensor information (temperature, humidity, barometric pressure, and joystick movement) from the attached Sense HAT and sends it to the IoT Platform.
- Finally, you will create a second Node-RED application in your IBM Cloud account that will collect, store, and act on the sensor data it receives from the Raspberry Pi.

## Contents
- [Prerequisites](#prerequisites)
- [Hardware Setup](#hardware-setup)
- [Software Setup](#software-setup)
- [Starting Node-RED](#starting-node-red)
- [Start the Workshop](#start-the-workshop)
- [Guided Path](#guided-path)
- [Advanced Path](#advanced-path)
- [Validation and Testing](#validation-and-testing)


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
>**Note:** Be sure to answer `y` when asked about installing the Pi-specific nodes.
- Install additional Node-RED nodes for the Sense HAT and the IoT service  
`npm install --prefix ~/.node-red node-red-node-pi-sense-hat node-red-contrib-ibm-watson-iot`

## Node-RED

[Node-RED](https://nodered.org/) is a tool for developing [Node.js](https://nodejs.org/en/) JavaScript applications in a visual drag & drop fashion.  It is a web browser based editor with a rich and extensible library of visual nodes that are linked together to describe the logical flow of an application.  The basic premise of Node-RED is to pass a JSON data object (msg) from node to node.  Each node along the way will alter or act on that data before passing it on to the next node in the flow.  Check out this short [Node-RED intro video](https://youtu.be/ksGeUD26Mw0?list=PLyNBB9VCLmo1hyO-4fIZ08gqFcXBkHy-6).  Click here to [learn more about Node-RED on a Raspberry Pi](https://nodered.org/docs/getting-started/raspberrypi).

### Starting the Node-RED server

There are two methods for starting Node-RED on the Raspberry Pi. You can either start/stop it manually when needed, or you can run it as a service so that it starts automatically every time the system boots.

- Manual start/stop  
`node-red-start` and `node-red-stop`

  >**Note:** When the Node-RED app starts, using this method, the last action it performs is to start a logging function.  You can exit this logging, if needed, by pressing Ctrl-c.  This will not stop Node-RED itself.  If/When you want to stop Node-RED, you need to issue the stop command.  
- Start automatically as a service  
`sudo systemctl enable --now nodered.service`  
To stop the service temporarily  
`sudo systemctl stop nodered.service`  
To start it again:  
`sudo systemctl start nodered.service`  
To disable autostarting at boot  
`sudo systemctl disable nodered.service`.

### Working with Node-RED

Once the Node-RED server is running, you are ready to start building a Node-RED application.  Everything is done in a web browser with Node-RED.  The server runs on port 1880 on your local system or on a remote server.  All you need to do is start up a web browser and point it to the server that you wish to work with.  
`http://<server address>:1880`.  
For example, on a local system, you would use either:  
`http://localhost:1880` or  `http://127.0.0.1:1880`  
If you are connecting to Node-RED on your remote Raspberry Pi, you simply replace the ip address or hostname in the addresses above with those of your Raspberry Pi.  
>**Note:** As this workshop is structured to demonstrate an IoT and cloud environment, the instructions will assume that you are connecting to remote servers.

At this point, you should be presented with the Node-RED design tool:
![Node-RED Editor](/images/node-red.png)
On the left side of the editor, you will see the *Node Palette*.  On the right is the *Information Panel*.  the center section is your *Design Canvas*.  
To build a Node-RED application:  

- Drag nodes from the *node palette* on to the *design canvas*.  
- Customize the nodes with application logic by double clicking on them.  
- Nodes are then linked together with *wires* to create the logical flow of your application.  To create a wire between two nodes, you simply click on the anchor of one node and drag over to an anchor on another node.
- During the design, use the *information panel* to understand the specific function and requirements of each node type.
- Once you have you application ready to go, clicking the ![Deploy](/images/deploy.png) button launches it.

## Start The Workshop

Two sets of instructions are provided for this workshop.  If you have prior experience and would like to try and complete the exercise on your own, follow the [Advanced path](#advanced-path).  Otherwise, if you prefer a more guided approach, choose the [Guided path](#guided-path).

---

## Guided Path

### Register the Raspberry Pi with the IBM Cloud Internet of Things Platform

### Create a Raspberry Pi Node-RED Application

In this portion of the workshop you will create a Node-RED application on the Raspberry Pi that will collect sensor data from a device called a Sense HAT that is attached to the Raspberry Pi.  You will then forward that data to your IoT Platform service so that it can be used by a corresponding Node-RED application that you will create in IBM Cloud.  There are three different types of sensor data available from the Sense HAT (environment, motion, & joystick).  However, you will only be using the environment and joystick data for this workshop.  In addition to sending data to the IoT platform, this application will also receive commands sent from the IBM Cloud application that will control the 8x8 LED matrix that is part of the Sense HAT device.  One command (alarm) will turn the entire matrix into a solid color that is provided as a part of the command.  The other command (message) will scroll a text message across the LED matrix.  The message, the text color, and the background color will all be provided as a part of the command.

#### Flow #1 – Local testing of the Raspberry Pi and Sense-HAT

In this first flow, you will simply send data to and revieve data from the Sense HAT in order to verify it's correct operation.

1. Refer to the [Hardware Setup](#hardware-setup) and [Software Setup](#software-setup) sections and ensure that your Raspberry Pi and Sense HAT are properly installed and configured.
1. Refer to the [Node-RED](#node-red) section and ensure that the Node-RED server is started on your Raspberry Pi.
1. Start your web browser and connect to the Node-RED server on the Raspberry Pi:  
`http://<server name/address>:1880`
1. Using the node palette, locate the appropriate nodes and create a flow in your design editor that looks like this:  
![pi-flow-1](/images/pi-flow-1.png)  
>**Note:** An exact match to this image is not required.  You can place the nodes wherever you like in the editor.
1. Configure the nodes:
   - The `Sense HAT` input node is reponsible for collecting sensor data from the actual device, plasing it into a msg object and forwarding it on.  In this case it goes to a debug node.  Double clicking on any node will open the settings for that node.  In the settings for the Sense HAT node, you will see that you can set which sensor data you are interested in.  In this workshop we will not be using the motion sensor data so, **uncheck Motion Events**.
   - The `debug` node is used to allow a developer the opportunity to inspect the message data that is flowing through the application.  Debug nodes can be placed anywhere in the flow to provide the developer the opportunity to validate that the message looks the way it should.  The settings for the debug node allow you to determine just how much of the msg object you want to see.  In this case, we are interested in the entire message so set **Output** to **complete msg object**
   - The `Sense HAT` output node is used to control the LED matrix on the actual Sense HAT device and expects to receive message object in a specific format based upon the desired output on the LED.  There are no configuration settings for this node as the message object expected will be created by the inject nodes.  
   - The `inject` node is a way to create a message object and insert it into the application flow.  It is useful for testing an application flow by inserting sample messages in order to verify correct application results.  In this case, the message object that is created will go directly to the Sense HAT output node.  In this flow, your inject nodes will create two specific message objects.  

     The first sets the entire LED matrix to a specific color (eg. "red").  To do this, you set the **msg.payload** of the msg object to a **string** value of **\*,\*,color**.  Use this message format for the *Alarm* and the *Off* inject nodes.  
     >**Note:** The color specified can be any of the well-known [HTML color names](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) (eg. red or aquamarine).  In addition, *off* is a valid color.

     The second scrolls a message across the screen.  In order to do this, there are three variables in the message object that must be set to **string** values:  
     Set **msg.payload** to the message you wish to display.  
     Set **msg.color** to the desired text color.  
     Set **msg.background** to the desired background color.  
     >**Hint:**  Use the `+add` button in the inject node settings to set multiple variable values.  Use the `x` button to delete uneeded values.

1. At this point you should be able to test the flow.  Click the deploy button to execute this test flow and verify that the Sense HAT is working properly.
   - In the information panel to the right of your design palette, select the debug tab (it looks like a bug).  At this point, you should see a tremendous amount of data scrolling by.  This is coming from the debug node.  
   - Stop the debug output by clicking green button on the right side of the debug node and the data in the debug panel will stop scrolling.  
   - Take a minute to examine the debug output.  You will see that each message has a topic and a payload.  Notice that the topic will match one of the two sensors that the Sense HAT is configured to report (environment & joystick).  
   >**Note:** You will only see joystick topics when you actually use the Sense HAT joystick.
   - Test the LED by clicking the buttons on the left side of the inject nodes to actually inject the message.  If properly configured, the LED on the Sense HAT will respond by performing the requested action.

#### Flow #2 – Send Sensor Data to IBM Cloud

In this flow, the collected data will now be forwarded up to the IBM Internet of Things Platform where it will be further processed.  One thing that you may have noticed when viewing the debug output from the prior flow is sheer volume of events being generated by the environment topic.  If you were to send every one of these events to the IoT Platform service, you would quickly use up the 200MB data limit that is imposed on a free IoT Platform service.  So, before sending the environment data onward, it needs to be limited.  You will do this with a `delay` node.

1. Using the node palette, locate the appropriate nodes and add a new flow, below the first flow, that looks like this:  
![pi-flow-2](/images/pi-flow-2.png)  
   >**Note:** Again, an exact match to this image is not required.
1. Configure the nodes:
   - One of the two `Sense HAT` input nodes should output only **environment** data.  The other should output only **joystick** data.
   - The `delay` node is used to put limits on the number of messages leaving the node.  In order to limit the amount of data going up to the cloud, open the delay node settings and set the **Action** to **Rate Limit** for **All messages**.  Set the rate to **1 msg(s) per 5 seconds** and check the box to **drop intermediate messages**.  This will cause the node to discard all but one message every five seconds.
   - The `Watson IoT` output nodes...

     Each IoT node will send a separate event type to the IoT Platform service.  You will need to configure them by opening settings and configuring as follows:

     Because we defined the Raspberry Pi as a Gateway device, you need to connect as a Gateway.

     When configuring the first of these nodes, you will need to Add new wiotp-credentials.  You do this by clicking on the  in the credentials line.  Here you will specify the gateway device that you defined earlier.  Use the values that you recorded during the IoT device definition to fill in the appropriate fields.  Do not modify any other fields in this section.

     The device type and Device ID can be any value that helps to identify their purpose.  We will use the values provided in the image.

     The value entered into Event type will define the actual event that this message comprises.  Use one of the three values in each node.

1. Redeploy the application by clicking deploy and, if everything has gone well, you will see a green dot below the IoT nodes that indicates they are now connected to the IoT Platform service. You should also see a dramatic decrease in the number of messages received in the debug info panel.  If not, ensure that you have any other debug nodes toggled to the off setting.

#### Flow #3 – Recieve IoT commands from IBM Cloud

1. Using the node palette, locate the appropriate nodes and add another new flow, below the second flow, that looks like this:  
![pi-flow-3](/images/pi-flow-3.png)
1. Configure the nodes:
   - `Watson IoT` input
   - `change`
   - `template`

1. Redeploy the application by clicking deploy and, if everything has gone well, you will see a green dot below the IoT nodes that indicates they are now connected to the IoT Platform service.  Until you have completed and deployed the server side application, you will not be able to verify the correct execution of this flow.

In the end, your Raspberry Pi Node-RED application should resemble the following:  
![pi-flow-final](/images/pi-flow-final.png)

### Create IBM Cloud Db2 Service
The server side Node-RED application stores environment data in a Db2 database.  So, before creating the application itself, you will need to create an instance of the Db2 service in your IBM Cloud account.  You will also need to create a table in the Db2 database for storing the data.

### Create IBM Cloud Node-RED Application

---

## Advanced Path

In the advanced path, instruction will be minimal.  You will be given a task to perform, along with any required configuration data and will need to explore and figure out the proper steps to take.  There are often many ways to solve a given task so do not feel as though you must do something the same way it was done in the Guided Path. Remember, if you run into trouble, you can always refer to the detailed instructions of the Guided Path to get back on track.

### Create an Internet of Things Platform service and define the Raspberry Pi Gateway device

- Create an Internet of Things Platform service in your IBM Cloud space.
- In your newly created IoT Platform service, define a new **Gateway** device type called **piGateway**.
- Add a new gateway device called **myPiGateway** using the newly defined piGateway device type.
- Be sure to record the token that you use for the new gateway device.  You will need it later.

>**Note:** This workshop treats the Raspberry Pi as an edge gateway and the attached Sense HAT as a downstream sensor device.  It is not necessary to define the Sense HAT device to the IoT Platform service as the gateway device will do it automatically when the Sense HAT connects through it.

### Create a DB2 database service and a table to store sensor data

- Create a Db2 database service in your IBM Cloud space.
- Create a database table called **SENSEDATA** containing the following columns and data types:

  | **Column Name** | **Data Type** | **Length** |
  | ---             | ---           | ---        |
  | SENSORID        | VARCHAR       | 20
  | TEMPERATURE     | DOUBLE        |
  | HUMIDITY        | DOUBLE        |
  | PRESSURE        | DOUBLE        |
  | TIMESENT        | TIMESTAMP     |

  >**Note:** The name of the table and columns are an important element of later steps so be sure to double check your spelling.

### Create a Node-RED Application in your IBM Cloud space

- Create a new Node-RED application from the Node-RED template in the catalog.
- Connect your IoT Platform and Db2 services to your new application.
- Create the following Node-RED flow in your IBM Cloud Node-RED application:  
![Cloud Final Flow](/images/cloud-flow-final.png)  

  >**Note:** You will need to use the Node-RED Palette Manager to install the **node-red-contrib-scx-ibmiotapp** set of IoT input and output nodes.

- Use *ibmiot in* nodes to receive the incoming *environment* and *joystick* events.
- Format the incoming environment data into the appropriate format that the *Db2* node expects.  

  The incoming *environment* event will have the following structure:

  ``` javascript
  msg = {"deviceId": "mySenseHat",
         "deviceType": "SenseHat",
         "eventType": "environment",
         "payload": {"d": {"temperature": 35.21,
                           "humidity": 38.31,
                           "pressure": 994.84}}}
  ```

  The *Db2* node will need the following structure based upon the SENSEDATA table and the incoming event payload:

  ``` javascript
  msg = {"payload": {"SENSORID": "deviceId",
                     "TEMPERATURE": temperature,
                     "HUMIDITY": humidity,
                     "PRESSURE": pressure,
                     "TIMESENT": "TIMESTAMP"}}
  ```

- Take action on the incoming *joystick* events and send a *message* command to the Sense HAT LED.  The message should be different for each direction of the joystick.  

  The incoming *joystick* event will have the following structure:

  ``` javascript
  msg = {"deviceId": "mySenseHat",
         "deviceType": "SenseHat",
         "eventType": "joystick",
         "payload": {"d": {"key": "LEFT",
                           "state": 1}}}
  ```

  The *ibmiot out* node for *message* commands should use the following structure:

  ``` javascript
  msg = {"command": "message",
         "format": "json",
         "deviceType": "senseHat",
         "deviceId": "mySenseHat",
         "payload": {"d": {"message": "Display Text",
                           "color": "purple",
                           "background": "black"}}}
    ```

  *(use a message and colors of your choice like red, blue, green, etc)*.
- Send some test *alarm* commands to the Sense HAT LED.  The *inject* nodes should generate a payload in the format expected by the *Sense Hat* node based upon the following table:

  | Name    | Color |
  | ---     | ---   |
  | LED Off | off   |
  | Green   | green |
  | Red     | red   |

  The *ibmiot out* node for the alarms should use the *alarm* command type and the payload should use the following structure:
  
   ``` javascript
   msg = {"command": "message",
          "format": "json",
          "deviceType": "senseHat",
          "deviceId": "mySenseHat",
          "payload": {"d": {"color": "red"}}}
    ```

  *(use a color of your choice like red, blue, green, etc)*.

### Create Raspberry Pi Node-RED Flows

- Create the following Node-RED flow on the Raspberry Pi  
![Pi Final Flow](/images/pi-flow-final.png)
- Break the outbound Sense HAT sensor data into two different event types (environment & joystick).
- Limit the number of environment events that are sent to the IoT nodes to 1 every 5 seconds.  Otherwise you will quickly overwhelm the data transfer limits imposed by the free IoT Platform service.
- Send the data to the IoT Platform service as one of two event types with two *Watson IoT* output nodes.
- Receive incoming IoT commands called *alarm* and *message* using two *Watson IoT* input nodes.
- Format the incoming commands into the appropriate format that the Sense HAT node expects.
  
  - The *alarm* command should light the entire 8x8 LED matrix on the Sense HAT to a color that is provided in the incoming *alarm* command.  The incoming *alarm* command will have the following  structure:

    ``` javascript
    msg = {"command": "alarm",
           "payload": {"d": {"color": "red"}}}
    ```
  
    In order to set the entire 8x8 Sense HAT LED matrix to a specific color, you need to send the *Sense Hat* node a string in the msg.payload.  
  
    ``` javascript
    msg = {"payload": "*, *, red"}
    ```
  
    *(use a color of your choice like red, blue, green, etc)*.
  - The *message* command should scroll text across the Sense HAT LED matrix.  The text, the text color, and the background color are all provided in the incoming *message* command.  The incoming *message* command will have the following structure:

    ``` javascript
    msg = {"command": "message",
           "format": "json",
           "deviceType": "senseHat",
           "deviceId": "mySenseHat",
           "payload": {"d": {"message": "R",
                             "color": "purple",
                             "background": "black"}}}
    ```

    To have a message scroll across the Sense HAT LED matrix, the format of the msg object is a bit more detailed.

    ``` javascript
    msg = {"payload": "Display Text",
           "color": "white",
           "background": "black"}
    ```

    *(use a message and colors of your choice like red, blue, green, etc)*.

---

## Validation and Testing
