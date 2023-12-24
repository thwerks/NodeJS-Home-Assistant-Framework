# Getting Started
  - Install Home Assistant Core using the instructions https://github.com/thwerks/NodeJS-Home-Assistant-Framework/blob/main/install-ha-esphome.md
  - Generate API Token inside Home Assistant
    - <img src= "https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/f0a81292-2aba-4311-a5ef-9d5b040a4d4d" width="600">
  - enter the IP address and API token into the `ha-plain.js` config
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/272da4b7-ec6d-4241-a3e0-a1f0ed7dfa76)
  - Install necessary NPM packages
    - npm install homeassistant
    - npm install express
    - npm install websocket
    - If ESP or Telegram are Enabled:
      - npm install @2colors/esphome-native-api
      - npm install node-telegram-bot-api
  - now run the script, it should spit out all the entities available in Home Assistant and the exit
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/331b8541-465c-4543-a588-28977b6ec8e5)
    - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/51cea2cf-9d71-4260-90e5-dfde7e8455ab)
  - take note of entities you want to use in NodeJS

    
# Home Assistant Input/Output Communication
- there are multiple ways to read and write data between Home Assistant and this framework.
- in some cases the features of multiple home assistant APIs (namely legacy homeassistant and websocket) are used in combination to produce a complete system.  
- they have different uses so pay close attention.
  
### Legacy `homeassistant` API, `cfg.io.ha` array and `ha.fetch()` function
- Fundamentals:
  - You will need enter all of the Home Assistant entities you will read or write into the `cfg.io.ha` string array.
  - This is used by the HA/NodeJS framework to identify relevant entities and store their state.
  - All entities not in this list are ignored by the frameworks websocket and legacy APIs.
  - The legacy homeassistant API has the advantage of querying the state of HA entities. This is useful for building robust automatons that can recover from power loss or network interruptions, etc.
  - the legacy API also has a callback which is useful for error handling and keeping track of HA response delays.
  - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/182aab5e-15d5-4ec5-b046-54798cd36b61)
- Legacy API Usage:
  - `ha.fetch()` function: (uses lagacy homeassistant API)
    - This function will query the state of every entity you have configured and save it to the `state.ha.io` array
    - the state of your entity can be read from `state.ha.io[entityID]`.
    - `ha.fetch()` is triggered on first startup, the Automated Function Array begins processing after first `ha.fetch()` completes.
    - `ha.fetch()` cannot be called repeatedly or it will create a race condition. 
  - Legacy API Service Call
    - `hass.services.call('turn_off', 'switch', { entity_id: "switch.testing_switch" });`
    - or with callback
    - ```
       hass.services.call('turn_off', 'switch', { entity_id: "switch.testing_switch" })
        .then(data => { myFunction(); })
        .catch(err => console.error(err))
      ```
  - Legacy API State Query with Callback
    - ```
      hass.states.get('switch', nameOfEntity)
        .then(data => { myFunction(); })
        .catch(err => console.error(err))
      ```
  - Legacy API Home Assistant Measurement/Sensor Entity
    - The first time this service is called a sensor is automatically created in Home Assistant.
    - `nameOfEntityYouWant` The name of the entity is of anything you want, helpful to add prefix like flow- or pressure-
    - `unit` is anything you want like % or volts, psi, m3/hr, etc.
    - `value` must be a float/number.
    - can use a `.then` callback if you want.
    - ```
      hass.states.update('sensor', nameOfEntityYouWant,
        { state: value, attributes: { state_class: 'measurement', unit_of_measurement: unit } })
          .catch(err => console.error(err))
      ```
      
  ### Websocket API
 - Fundamentals:
    - The websocket api implementation does not support querying entity states, use the legacy API calls for that.
    - Entities must be listed in the `cfg.io.ha` string array with correct name in home assistant or they will be ignored by websocket.
    - Incoming Websocket `state_changed` events are written to the `state.ha.io` array immediately. The position each entity written in the array matches the position of the name in `cfg.io.ha`. So first entity will be written to `state.ha.io[0]`
    - your automation function can periodically check the states of entities using the `state.ha.io` array or functions ca be trigger inside your automation function when state change events arrive by using emitters. 
 - Websocket API Usage:
    - Sending a `call_service` command to Home Assistant via websocket:
      -  It preferable to use the legacy API to make service calls because it has a callback, is more compact and can support an error handling scheme.
      -    ```
           em.emit('send', {
              "id": state.ha.ws.id++,
              "type": "call_service",
              "domain": "switch",
              "service": "turn_on",
              "target": {
              "entity_id": "switch.testing_switch"
              }
            })
           ```
   - Registering an Emitter to trigger functions inside your Automation Function
     - ```
       em.on(cfg.io.ha[0], function (data) {
          switch (data) {
                        case true:
                            log(" - log something... Turn ON");
                            return;
                        case false:
                            log(" - log something... OFFLINE");
                            return;
                    }
                    return;
                });
       ```
     - the `cfg.io.ha[0]` refers to whichever HA entity you want to subscribe to. Alternatively you could just put the entities name. 
     - This emitter subscription should only be ran once the first time your Automation Function Runs
     - The return statements are necessary to prevent further processing of you automation function until data is receive and precessed.  



  
## Global Functions
- Logger - `log("string", moduleID, severity)`  
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
- Look at all data in corresponding memory space.
  - use firefox for pretty JSON formatting
  - ![image](https://github.com/thwerks/NodeJS-Home-Assistant-Framework/assets/90361336/2739f2fe-97a5-430e-adb1-d6b73954f5e3)
- Locations
  - all available HA entities              http://10.0.0.1:200/ha
  - last 500 websocket packets             http://10.0.0.1:200/ws
  - all state/volatile memory              http://10.0.0.1:200/state
  - see all the non-volatile               http://10.0.0.1:200/nv
  - all the hard coded configs             http://10.0.0.1:200/cfg
  - last 500 incoming telegram messages    http://10.0.0.1:200/tg
  - last 500 log messages                  http://10.0.0.1:200/log


Notes:
talk about automation function processing as based on ws events
