### This project has been superseded by the ThinkWerks IoT Framework
https://github.com/thwerks/ThingWerks-IoT-Frmework

## Preamble 

I'll be blunt, Home Assistant isn't suitable for industrial applications or where malfunctions can lead to costly equipment damage. Furthermore, data manipulation and management is very cumbersome and difficult if its even possible at all. The state management for certain conditions like startup, power loss, errors and other likely conditions is difficult to understand and control in HA, its also very slow to react to inputs and has huge lag. Withstanding, HA has a very nice GUI and it works very well as a monitoring and control mechanism in the scheme of this framework. 

Though Home Assistant may be reliable for some situations, using it for complex environments with multiple flow meters, pressure sensors, large motors and a multitude of inputs and outputs of that sort; it is simply not up to the task. It's not intended for that but NodeJS can do this effortlessly. 

# What is this framework for:

This framework is built to leverage HA's powerful GUI, Smartphone apps and monitoring capabilities for you own NodeJS automations. To use NodeJS for the heavy lifting, data manipulation and communication. This is a lot more reliable, flexable and responsive than using Home Assistant for such complex tasks. Id also argue that its a lot simpler to code a basic logic in JS than it is using the GUI or YAML provided foundation is there.  

I’d also mention that this solution is very compact and resource efficient especially when running Home Assistant Core. 500Mb of ram is enough for stable operation and that didn’t seem to be the case with Home Assistant Supervised. While testing it performing all the automation, with @1GB of ram it crashed regularly. ESP Home web interface easily installs alongside HA Core. This is a very tiny and efficient platform that works very well on mediocre IoT devices with only 1GB of RAM.

The Key takeaway here is that the HA Core API responds on average in about 2-5ms and never times out whereas Supervised can have latency exceeding 100ms and can become completely unreachable for seconds or even minutes or completely crash and not come back without a reboot. Probably due to costly background updates of plugins etc and memory overflows. Do not use Supervised if you need reliable time-critical operation. 


# What does this framework do:

* It completely removes all need for automation logic and control in Home Assistant.
* Power loss state recovery is reliable and predictable.
* This framework is immune to network interruptions with HA.
* This framework is very simple and easy to use.
* Rebooting of ether NodeJS or of HA has no detrimental effect for the most part. System recovery is controlled and predictable. 
* At present, Home Assistant is still the gateway for ESPHome devices; meaning that HA is the subscriber and forwards incoming data to NodeJS via websocket. This will become optional when the NodeJS ESPHome API is fully incorporated, then NodeJS will be the sole subscriber and HA will only be used as a GUI.
* It has a nice and easy to use logging function.
* Telegram API is leveraged here and can be used for both event notification as well as remote control. Useful because you can remotely control your system without VPN. You can easily create your own monitoring and control scheme.
* There is a complete diagnostic web engine to aid in the setup and debugging of your code.
* Has systemD service creator.  run   node ha.ja -i   to create your service when you got everything working.

# About the included Demand/Delivery pump automation function:

This is a fully automated industrial multi-system multi-pump control platform and the main purpose of this creation. It is currently in service and works reliably in large industrial applications delivering 100,000+ liters per day. Soon to be deployed to a huge solar pump facility with 160hp pumps. This is a working industrial system and has proven itself. 

If you're not interested in the Demand Delivery system, it should be very easy to remove it and the configuration. Try it, if you can do it ill have a look, maybe fork a version without that. 


## Demand/Delivery Operation
* Its primarily designed to work with flow meters (of any size) for monitoring and safe operation. Though the flow meter is optional, the pressure transducer for tank level detection or for pressure tank level is required at the moment, Other configurations may be included later or if there was the need.
* Start and stop levels, flow rate and meter lambda, and all pertinent settings are user configurable.
* Flow meters are use for pump dry run prevention.
* Pumps can auto retry after a low flow fault.
* Multiple independent pump systems can be configured.
* System seeks for abnormal operating conditions and warns or faults.


## Home Assistant Integration
* Tank levels are sent back to HA in percentage readout as dependent upon user configurations.
* Flow meter data is sent back to HA for last hour and 24 hours average.
* Input booleans in HA are used to toggle the pump automation system(s).
* System looks for inconsistencies between HA and the NodeJS system. It will bring the system back to consistency as based on specified parameters and live sensor data.
* System keeps track of HA latency and availability and notifies you if something is wrong.
* ESP Home modules are also monitored.

# How to use this framework:
* Please refer to the Getting Started Guide https://github.com/thwerks/NodeJS-Home-Assistant-Framework/blob/main/Getting%20Started.md
  
### * For creating your own automation function, see the example function in the "auto" function array code block.
* For using the Demand Delivery module, see the example configurations description.
* Suggestions and ideas are welcome, this is a place for sharing of ideas a learning to be a better and more effective engineer.
* Install as a service using PM2 or the included SystemD installer, run   node ha.ja -i

# Diagnostic/debugging web access: (use Firefox for pretty JSON formatting)

* http:/127.0.0.1:200/logs         ----last 500 log messages
* http:/127.0.0.1:200/ha           ------show all entities available from Home Assistant
* http:/127.0.0.1:200/ws           ------last 500 websocket updates (raw)
* http:/127.0.0.1:200/tg           ------last 100 received Telegram messages 
* http:/127.0.0.1:200/esp          -----show all discovered ESP Home modules
* http:/127.0.0.1:200/nv           -----show all non-volatile memory
* http:/127.0.0.1:200/state        --show all volatile memory
* http:/127.0.0.1:200/cfg          ----show all hard coded configuration
