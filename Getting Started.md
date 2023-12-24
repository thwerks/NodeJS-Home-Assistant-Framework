

## Global Functions
- Logger - `log("string", moduleID, severity)` fggghh 
  - You need to add an entry in the module name list for your automation.
  - <img src= "https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/ece9e675-f46d-456a-b32c-1ad5b6871042" width="500">
- Time stamp `sys.time.sync()`
  - gets current time and returns a string `mm-dd hh:mm:ss.mil`
- Write non-volatile memory to the disk `sys.file.write.nv()`
  - If your automation function requires non-volatile memory, you must create an object in the `nv` object for your function and then call the `sys.file.write.nv()` function to initialize and save your data.
  - Do something like: `if (nv.myFunction == undefined) nv.myFunction = {}` true then call `sys.file.write.nv();`
- User Available Timer `user.timer` code block
  - execute any function at any time you specify
  - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/98dab905-7bfc-4c92-9fc0-792361a1feaa)
 ## Diag Web Interface 
- Look at all data in corrisponding memory space.
  - use firefox for pretty JSON formatting
  - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/2739f2fe-97a5-430e-adb1-d6b73954f5e3)
- Locations
  - all available HA entities              http://10.0.0.1:200/ha
  - last 500 websocket packets             http://10.0.0.1:200/ws
  - all the volatile memory                http://10.0.0.1:200/state
  - see all the non-volatile               http://10.0.0.1:200/nv
  - all the hard coded configs             http://10.0.0.1:200/cfg
  - last 500 incoming telegram messages    http://10.0.0.1:200/tg
  - last 500 log messages                  http://10.0.0.1:200/log
# Getting Started
  - Install Home Assistant Core using the instructions https://github.com/thwerks/NodeJS-Home-Assistant-Framework/blob/main/install-ha-esphome.md
  - Generate API Token inside Home Assistant
    - <img src= "https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/f0a81292-2aba-4311-a5ef-9d5b040a4d4d" width="600">
  - enter the IP address and API token into the `ha-plain.js` config
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/272da4b7-ec6d-4241-a3e0-a1f0ed7dfa76)
  - now run the script, it should spit out all the entities available in Home Assistant and the exit
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/331b8541-465c-4543-a588-28977b6ec8e5)
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/51cea2cf-9d71-4260-90e5-dfde7e8455ab)
  - take note of entities you want to use in NodeJS
# Home Assistant Input/Output Communication
- there are multiple ways to read and write data between Home Assistant and this framework.
- in some cases the features of multiple home assistant APIs (namely legacy homeassistant and websocket) are used in combination to produce a complete system.  
- they have different uses so pay close attention.
### Legacy `homeassistant` NodeJS API, `cfg.io.ha` array and intergrated functions
- Fundamentals:
  - You will need enter all of the Home Assistant entities you will read or write into the `cfg.io.ha` string array.
  - This is used by the HA/NodeJS framework to indentify relevant entities and store their state.
  - All entities not in this list are ignored by the frameworks websocket and legacy APIs.
  - The legacy homeassistant API has the advantage of querring the state of HA entities. This is useful for builing rebost automations that can recover from powerloss or network interruptions, etc. 
  - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/182aab5e-15d5-4ec5-b046-54798cd36b61)
- Usage:
  - `ha.fetch()` function:
    - This function will querry the state of every entity you have configured and save it to the `state.ha.io` array
    - the state of your entity can be read from `state.ha.io[entityID]`.
    - `ha.fetch()` is triggered on first startup, the Automated Function Array processing after first `ha.fetch()` completes.
    - `ha.fetch()` cannot be called repeately or it will create a race condition. 

