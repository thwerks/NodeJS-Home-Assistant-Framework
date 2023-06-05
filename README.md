#### If you have a question, please just open a dialog in the “issue” section so others can banefit ftom the discussion. 


# What is this framework for:

This framework is built to give you a head start on using NodeJS for making reliable and complex automations while only leveraging Home Assistant for it's nice and robust web and smartphone GUI. 

To put it bluntly, Home Assistant isn't suitable for industrial applications or where malfunctions can lead to costly equipment damage. Furthermore, data manipulation and management is very cumbersome and difficult if even possible given a particular situation. The state management for certain conditions like startup, power loss, errors and other likely conditions is difficult to understand and control in HA. 

Though Home Assistant may be reliable for some situations, using it for complex environments with multiple flow meters, pressure sensors, large motors and a multitude of inputs and outputs of that sort and it’s simply is not up to that task. 

The HA GUI being only one of many options for monitoring and control makes it acceptable for use in an industrial setting. 

I’d also mention that this solution is very compact and resource efficient especially when running Home Assistant Core. 500Mb of ram is enough for stable operation and that didn’t seem to be the case with Supervised installs performing all the automation; @1GB of ram it crashed regularly. ESP Home web interface easily installs alongside HA Core. This is a very tiny and efficient platform that works very well on mediocre IOT devices with only 1GB of RAM.

The Key takeaway here is that the HA Core API responds on average in about 2-5ms and never times out whereas Supervised can have latency exceeding 100ms and can become completely unreachable for seconds or even minutes or completely crash and not come back without a reboot. Probably due to costly background updates of plugins etc and memory overflows. Do not use Supervised if you need reliable time-critical operation. 


# What does this framework do:

* It completely removes all need for automation logic and control in Home Assistant
* Power loss state recovery is reliable and predictable
* This framework is immune to network interruptions
* This framework is very simple and easy to use
* Rebooting of ether NodeJS or of HA has no detrimental effect for the most part. System recovery is controlled and predictable. 
* At present, Home Assistant is still the gateway for ESPHome devices; meaning that HA is the subscriber and forwards incoming data to NodeJS via websocket. This will become optional when the NodeJS ESPHome API is fully incorporated, then NodeJS with be the sole subscriber and HA will only be used as a GUI
* It has a nice and simple to use logging function
* Telegram API is leveraged here and can be used for both event notification as well as remote control
* There is a complete diagnostic web engine to aid in the setup and debugging of your code

# About the included Demand/Delivery pump automation function:

This is a fully automated multi system pump management system and the main purpose of this creation. It is currently in service and works reliably. 

* Its primarily designed to work with flow meters (of any size) for monitoring and safe operation. Though the flow meter is options, the pressure transducer for tank level detection or for pressure tank level is required at the moment, Other configurations may be included later or if there was the need.
* Tank levels are sent back to HA in percentage readout as dependent upon user configurations
* Start and stop levels, flow rate and meter lamda, and all pertinent settings are user configurable.
* Flow meters are sent back to HA for last hour and 24 hours average



# How to use this framework:

* Please consult the ha.js file for instruction and submit an Issue if you have a question so others can benefit from the discussion
* for creating your own automation function, see the example function in the "auto" function array code block
* for using the Demand Delivery module, see the example configurations description
