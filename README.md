#### If you have a question, please just open a dialog in the “issue” section so others can benefit from the discussion. 

#### need some small help with the twocolors/esphome-native-api. Cannot get outgoing push messages to work, confusion about setState usage, can contribute here https://github.com/twocolors/esphome-native-api/issues/19 


# What is this framework for:

This framework is built to give you a head start on using NodeJS for making reliable and complex automations while only leveraging Home Assistant for it's nice and robust web and smartphone GUI. 

To put it bluntly, Home Assistant isn't suitable for industrial applications or where malfunctions can lead to costly equipment damage. Furthermore, data manipulation and management is very cumbersome and difficult if even possible given a particular situation. The state management for certain conditions like startup, power loss, errors and other likely conditions is difficult to understand and control in HA. 

Though Home Assistant may be reliable for some situations, using it for complex environments with multiple flow meters, pressure sensors, large motors and a multitude of inputs and outputs of that sort; it’s simply is not up to that task.  

The HA GUI being only one of many options for monitoring and control makes it acceptable for use in an industrial setting. 

I’d also mention that this solution is very compact and resource efficient especially when running Home Assistant Core. 500Mb of ram is enough for stable operation and that didn’t seem to be the case with Supervised installs while it was performing all the automation; @1GB of ram it crashed regularly. ESP Home web interface easily installs alongside HA Core. This is a very tiny and efficient platform that works very well on mediocre IoT devices with only 1GB of RAM.

The Key takeaway here is that the HA Core API responds on average in about 2-5ms and never times out whereas Supervised can have latency exceeding 100ms and can become completely unreachable for seconds or even minutes or completely crash and not come back without a reboot. Probably due to costly background updates of plugins etc and memory overflows. Do not use Supervised if you need reliable time-critical operation. 


# What does this framework do:

* It completely removes all need for automation logic and control in Home Assistant
* Power loss state recovery is reliable and predictable
* This framework is immune to network interruptions with HA
* This framework is very simple and easy to use
* Rebooting of ether NodeJS or of HA has no detrimental effect for the most part. System recovery is controlled and predictable. 
* At present, Home Assistant is still the gateway for ESPHome devices; meaning that HA is the subscriber and forwards incoming data to NodeJS via websocket. This will become optional when the NodeJS ESPHome API is fully incorporated, then NodeJS will be the sole subscriber and HA will only be used as a GUI
* It has a nice and simple to use logging function
* Telegram API is leveraged here and can be used for both event notification as well as remote control. Useful because oyu can remotely control your system without VPN. 
* There is a complete diagnostic web engine to aid in the setup and debugging of your code
* Has systemD service creator.  run   node ha.ja -i   to create your service when you got everything working 

# About the included Demand/Delivery pump automation function:

This is a fully automated industrial multi-system multi-pump control platform and the main purpose of this creation. It is currently in service and works reliably in large industrial applications delivering 100,000+ liters per day. Soon to be deployed to a huge solar pump facility with 160hp pumps. Ok, so this is a working industrial system and has proven itself. 

If you're not interested in the Demand Delivery system, it should be very easy to remove it and the configuration. Try it, if you can do it ill have a look, maybe fork a version without that. 

* Its primarily designed to work with flow meters (of any size) for monitoring and safe operation. Though the flow meter is options, the pressure transducer for tank level detection or for pressure tank level is required at the moment, Other configurations may be included later or if there was the need.
* Tank levels are sent back to HA in percentage readout as dependent upon user configurations
* Start and stop levels, flow rate and meter lambda, and all pertinent settings are user configurable.
* Flow meters are sent back to HA for last hour and 24 hours average


# How to use this framework:

* Getting stated NPM install necessary packages: node-telegram-bot-api (this actually installs all other necessary packages)
* next, set your token, ip and things for HA, then run the script and have a look at  http:/127.0.0.1/ha  and get the names of all the discovered HA inputs you want to add, then put the into  cfg.input.ha  object
* Please consult the ha.js file for instruction and submit an Issue if you have a question so others can benefit from the discussion
* For creating your own automation function, see the example function in the "auto" function array code block
* For using the Demand Delivery module, see the example configurations description
* Suggestions and ideas are welcome but please refrain from semantical or techno-philosophic preferential ranting or otherwise self-perfectionist jabbing. Don't clutter my github with that nonsense. App programmers and machine  programmers have very different approaches to programming for very different reasons and will never agree with one another. If your an application programmer just keep your comments to yourself.
* Install as a service using PM2 or the included SystemD installer, run   node ha.ja -i

# Diagnostic/debugging web access: (use Firefox for pretty JSON formatting)

* http:/127.0.0.1/logs         ----last 500 log messages
* http:/127.0.0.1/ha           ------show all entities available from Home Assistant
* http:/127.0.0.1/ws           ------last 500 websocket updates (raw)
* http:/127.0.0.1/tg           ------last 100 received Telegram messages 
* http:/127.0.0.1/esp          -----show all discovered ESP Home modules
* http:/127.0.0.1/nv           -----show all non-volatile memory
* http:/127.0.0.1/state        --show all volatile memory
* http:/127.0.0.1/cfg          ----show all hard coded configuration
