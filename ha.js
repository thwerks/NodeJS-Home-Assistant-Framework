#!/usr/bin/node
let config = {
    espEnabled: false,                  // enable Node ESP Home API
    webDiag: true,                      // enable debug web server
    webDiagPort: 200,                    // debug web server port number
    workingDir: "/apps/ha",             // specify the working director for non-volatile data storage
    homeAssistant: {
        address: "10.20.2.136",         // pretty straight forward 
        port: 8123,                     // HA port
        token: "myToken",               // HA long lived Token - generate this in your HA user profile settings
        log: {
            espDisconnect: false        // log ESP disconnect warning notifications
        }
    },
    telegram: {
        enable: true,                   // enable telegram notification
        remote: true,                   // enable telegram remote control
        password: "test",               // password to register user ID with telegram bot
        logLevel: 2,                    // 0: debug, 1: event, 2: warning, 3: error
        logDebug: true,                 // logging debug override 
        token: "myToken"                // Telegram Bot token
    },
};
lib();  // load package dependencies 
let
    cfg = {         // add a config object here for you custom automation function
        /*
        myAutomation: {


        };


        */

        dd: [       // config for the Demand/Delivery automation function, 1 object for each pump system
            {   // DD system 1 example
                name: "Tazok",          // Demand Delivery system name
                haAuto: 0,              // home assistant auto toggle ID number (specified below in cfg.input.ha config)
                haPump: 1,              // home assistant pump switch ID Number (specified below in cfg.input.ha config)
                cfgFlow: 0,             // flow meter config ID number
                cfgTankOutput: 1,       // destination tank config ID number  (specified below in cfg.input.ha config)
                flowStartMin: 60,       // minimum flow rate pump must reach at start in LPM
                flowStartWarn: 70,      // min start flow before triggering notification (useful for filters) (LPM)
                flowCheckWait: 6,       // seconds to wait before checking flow after pump starts
                faultFlowRetry: 10,     // time in seconds to wait for retry
                faultFlowFinal: 1,      // time in minutes to wait for final retry
            },
            {   // DD system 2 example
                name: "Compressor",     // Demand Delivery system name
                haAuto: 8,              // home assistant auto toggle ID number (specified below in cfg.input.ha config)
                haPump: 3,              // home assistant pump switch ID Number (specified below in cfg.input.ha config)
                cfgTankOutput: 0,       // destination tank config ID number  (specified below in cfg.input.ha config)
            },
        ],
        tank: [     // config for tanks used with Home Assistant -- these tanks get sent back to HA as sensors
            {   // Tank 1 example
                name: "tank_tazok",     // tank name (do not use spaces or dash, underscore only)
                unit: "m",              // measurement unit (i.e. PSI or meters)
                full: 2.08,             // Demand Delivery system stop level in (meters) or PSI
                low: 1.95,              // Demand Delivery system start level (meters) or PSI
                warn: 1.75,             // threshold to send warning notification
                haPress: 5              // home assistant pressure sensor ID Number (specified below in cfg.input.ha config)
            },
            {   // Tank 2 example
                name: "tank_mountain",  // tank name (do not use spaces or dash, underscore only)
                unit: "m",              // measurement unit (i.e. PSI or meters)
                full: 1.8,              // Demand Delivery system stop level
                low: 1.7,               // Demand Delivery system start level
                warn: 1.6,              // threshold to send warning notification
                haPress: 6              // home assistant pressure sensor ID Number (specified below in cfg.input.ha config)
            },
        ],
        flow: [      // config for flow meters used with Home Assistant -- these flowmeters get sent back to HA as sensors
            {   // flow meter 1 example
                name: "flow",           // flow meter name that will appear in HA as a sensor (do not use spaces or dash, underscore only)
                pulse: 0.2,             // pulse calculation factor for your specific flow meter
                unit: "m3",             // unit of measurement (cubic meters)
                haFlow: 4               // home assistant flow meter ID Number (specified below in cfg.input.ha config)
            }
        ],
        input: {    // home assistant inputs you want to utilize here
            ha: [  // exact name of HA switch, sensor or input
                "input_boolean.auto_pump",                // 0    <-------- ID number, zero indexed, this number is needed elsewhere for cfg objects
                "switch.esp_tazok_relay_luckypro",        // 1
                "switch.esp_filter_relay_Submersible",    // 2
                "switch.esp_tazok_relay_compressor",      // 3    
                "sensor.esp_filter_flow_filter",          // 4    
                "sensor.esp_tazok_psi_tank_tazok",        // 5    
                "sensor.esp_filter_psi_tank_mountain",    // 6    
                "sensor.esp_filter_psi_filter",           // 7   
                "input_boolean.auto_compressor",          // 8
            ],
            esp: [  // testing - ESP Home modules that will be subscribed to
                { ip: "10.21.4.30", key: "myKey" },
                { ip: "10.21.4.31", key: "myKey" },
            ]
        }
    },
    auto = [ // automation function array . add your custom automation here, the whole array is enumerated every time an incoming state change comes from Home Assistant
        function () {   // example automation function 

            /*
                some general information:



                Functions:
                log("my string", numberOfYourModule, severity)      // 0 debug, 1 event, 2 warning, 3 error
                                                                    // create an entry for your module name in the log() function at the end of this script
                                                                    // logs to console and telegram at the level you specified if enabled 
                time.stamp()        // returns a string  month-day-hour-min-sec-ms
                sys.file.write.nv() // write non-volatile memory to the disk if you need store data there in   nv.MyFunctionData
                                    // file is saved to the WorkingDir you specified ./nv.json

                incoming entity state change websocket data from home assistant:
                    see below how to initialize your event listener. 
                    every input/output from HA gets an emitter with the exact name in HA and its state.
                    You can see all the available entities in the diag webpage using your IP and the port you specified

                    http://10.0.0.1:200/ha      // all available HA entities <-----------------

                                    // other debugging/diag locations 
                    http://10.0.0.1:200/ws      // history of that last 500 websocket updates
                    http://10.0.0.1:200/state   // see all the volatile memory of your functions
                    http://10.0.0.1:200/nv      // see all the non-volatile memory of your functions
                    http://10.0.0.1:200/cfg     // see all the hard coded configs of your functions
                    http://10.0.0.1:200/tg      // see last 500 incoming telegram messages
                    http://10.0.0.1:200/log     // see last 500 log messages
                    
            */

            //              non-volatile memory
            // if your automation function requires non-volatile memory, you must delete the nv.json file if it already exists and initialize the NV mem on first run using the sys.file.write.nv() function
            // or, do something like  if(nv.myFunction.myVar == undefined) nv.myFunction.myVar = true   then call  sys.file.write.nv();

            //              time related functions
            // if you need to trigger something at a specific time, use the  user.timer member functions 




            //              initialize the volatile memory for your automation function
            // for multi object system use like this, user DD system for example
            /*
            if (!state.myAutomation) {     
                state.myAutomation = [];
                cfg.myAutomation.forEach(element => {
                    state.myAutomation.push({
                        listeners:false, myVariable: false,
                    })
                });
            }
            */

            // for single object system use like this
            /*
                  if (!state.myAutomation) {     
                      state.myAutomation = {listeners:false, myVariable: false,};
                  }
            */



            //              initialize the HA input event listener for your automation function, receive the input data and or parse

            /* 
            also noteworthy that the method for triggering this automation on/off outside the block of this function, like for example
            in the telegram block; you can do an  hass.services.call  from anywhere and then this event listener will be called here in 
            this function. Therefore you can call nested function inside this function from anywhere via this event listener. Refer to 
            the existing telegram.callback() function and the demand/delivery event listener for examples on how to implement this.    
            */

            /*              
                        if (state.myAutomation.listener == false) {  
                            em.on(cfg.input.ha["my home assistant number here"], function (data) {
                                switch (data) {
                                    case true:
                                        log(" - log something... Turn ON");
                                        performFunctionTrue();
                                        return;
                                    case false:
                                        log(" - log something... OFFLINE");
                                        performFunctionFalse();
                                        return;
                                }
                                return;
                            });
                            state.myAutomation.listener = true;
                            return;
                        }
            */

            //                  example to send data to home assistant within your function

            /*  
                //  example for switch
                hass.services.call('turn_off', 'switch', { entity_id: cfg.input.ha[number of your input] })
                .then(data => {   })                    // optional  -  do something after completion if you want
                .catch(err => log(err)0,3)              // optional  -  catch and log error if you want

                //  example for boolean
                hass.services.call('turn_on', 'input_boolean', { entity_id: cfg.input.ha[number of your input] })
    
                // example for sensor
                hass.states.update('sensor', "any name of sensor you want to appear in ha", { state: myValue, attributes: { state_class: 'measurement', unit_of_measurement: "any unit you like" } })
                
                //  you can push a sensor here in your function or on an interval using the user.time.sec function or min if you want 
        
                */


        },
        function () {   // Demand Delivery System
            if (!state.dd) {    // initialize function volatile memory
                state.dd = [];
                cfg.dd.forEach(element => {
                    state.dd.push({
                        pump: false, pumpFlowCheck: false, pumpFlowCheckPassed: false, pumpOffTimeout: true,
                        sendRetries: 0, listener: false,
                        faultFlow: false, faultFlowCancel: false, faultFlowRestarts: 0, faultOverflow: false,

                        warnFlow: false, warnFlowDaily: false, warnFlowFlush: false, warnHAlag: false, warnSensorFlush: false,
                        warnTankLow: false,
                    })
                });
            }
            for (let x = 0; x < cfg.dd.length; x++) {   // enumerate every demand delivery instance
                let flow = undefined;      // flatten objet names (for easier readability)
                if (cfg.dd[x].cfgFlow != undefined) flow = state.flow[cfg.dd[x].cfgFlow];
                let pumpHA = state.ha.input[cfg.dd[x].haPump];
                let dd = { state: state.dd[x], cfg: cfg.dd[x] };
                let tankOut = cfg.tank[dd.cfg.cfgTankOutput];
                switch (state.ha.input[dd.cfg.haAuto]) {
                    case true:                  // when auto is ONLINE
                        switch (dd.state.pump) {
                            case false:         // when pump is STOPPED
                                switch (dd.state.faultFlow) {
                                    case false: // when pump is not flow faulted
                                        if (state.ha.input[tankOut.haPress] <= tankOut.low) {
                                            log(dd.cfg.name + " - " + tankOut.name + " is low - pump is starting", 2);
                                            pumpStart(true);
                                            return;
                                        }
                                        if (dd.state.pumpOffTimeout == true) {  // after pump has been off for a while
                                            if (pumpHA === true) {
                                                log(dd.cfg.name + " - pump running in HA but not here - switching pump ON", 2);
                                                pumpStart(true);
                                                return;
                                            } else {
                                                if (flow != undefined && flow.lm > dd.cfg.flowStartMin && dd.state.warnSensorFlush == false) {
                                                    log(dd.cfg.name + " - flow is detected (" + flow.lm.toFixed(0) + "lpm) possible sensor damage or flush operation", 2, 2);
                                                    dd.state.warnSensorFlush = true;
                                                    return;
                                                }
                                            }
                                        }
                                        break;
                                    case true:  // when pump is flow faulted
                                        if (dd.state.pumpOffTimeout == true) {
                                            if (pumpHA === true || flow != undefined && flow.lm > dd.cfg.flowStartMin) {
                                                log(dd.cfg.name + " - pump is flow faulted but HA pump status is still ON, trying to stop again", 2, 3);
                                                sendData(cfg.input.ha[dd.cfg.haAuto], 'input_boolean', 'turn_off');
                                                state.ha.input[dd.cfg.haAuto] = false;
                                                pumpStop();
                                                return;
                                            }
                                        }
                                        break;
                                }
                                break;
                            case true:      // when pump is RUNNING
                                if (state.ha.input[tankOut.haPress] >= tankOut.full) {
                                    if (flow != undefined) {
                                        let tFlow = flow.temp - flow.batch;
                                        log(dd.cfg.name + " - " + tankOut.name
                                            + " is full - pump is stopping - pumped " + tFlow.toFixed(1) + " m3", 2);
                                    } else { log(dd.cfg.name + " - " + tankOut.name + " is full - pump is stopping", 2); }
                                    pumpStop();
                                    return;
                                }
                                if (dd.state.pumpFlowCheck == true && flow != undefined) {
                                    if (flow.lm < dd.cfg.flowStartMin) {
                                        pumpStop();
                                        dd.state.faultFlow = true;
                                        if (dd.state.faultFlowRestarts < 3) {
                                            log(dd.cfg.name + " - flow check FAILED!! (" + flow.lm.toFixed(1) + "lm) HA Pump State: "
                                                + pumpHA + " - waiting for retry " + (dd.state.faultFlowRestarts + 1), 2, 2);
                                            dd.state.faultFlowRestarts++;
                                            setTimeout(() => {
                                                if (dd.state.faultFlowCancel == false) dd.state.faultFlow = false; log(dd.cfg.name + " - pump restating", 2);
                                            }, dd.cfg.faultFlowRetry * 1000);
                                        } else if (dd.state.faultFlowRestarts == 3) {
                                            log(dd.cfg.name + " - low flow (" + flow.lm.toFixed(1) + "lm) HA State: "
                                                + pumpHA + " - retries exceeded - going offline for " + dd.cfg.faultFlowFinal + "m", 2, 3);
                                            dd.state.faultFlowRestarts++;
                                            setTimeout(() => {
                                                if (dd.state.faultFlowCancel == false) dd.state.faultFlow = false; log(dd.cfg.name + " - pump restating", 2);
                                            }, dd.cfg.faultFlowFinal * 60 * 1000);
                                        }
                                        else {
                                            dd.state.faultFlowRestarts++;
                                            log(dd.cfg.name + " - low flow (" + flow.lm.toFixed(1) + "lm) HA State: "
                                                + pumpHA + " - all retries failed - going OFFLINE permanently", 2, 3);
                                            sendData(cfg.input.ha[dd.cfg.haAuto], 'input_boolean', 'turn_off');
                                            state.ha.input[dd.cfg.haAuto] = false;
                                        }
                                    } else {
                                        if (dd.state.pumpFlowCheckPassed == false) {
                                            log(dd.cfg.name + " - pump flow check PASSED (" + flow.lm.toFixed(1) + "lm)", 2);
                                            dd.state.pumpFlowCheckPassed = true;
                                            dd.state.faultFlowRestarts = 0;
                                            if (flow.lm < dd.cfg.flowStartWarn && dd.state.warnFlowDaily == false) {
                                                dd.state.warnFlowDaily = true;
                                                log(dd.cfg.name + " - pump flow is lower than optimal (" + flow.lm.toFixed(1) + "lm) - clean filter", 2, 2);
                                            }
                                        }
                                    }
                                }
                                break;
                        }
                        if (dd.state.warnTankLow != undefined && state.ha.input[tankOut.haPress] <= (tankOut.warn) && dd.state.warnTankLow == false) {
                            log(dd.cfg.name + " - " + tankOut.name + " is lower than expected (" + state.ha.input[tankOut.haPress]
                                + tankOut.unit + ") - possible hardware failure or low performance", 2, 2);
                            dd.state.warnTankLow = true;
                        }
                        break;
                    case false:  // when auto is OFFLINE
                        if (dd.state.pumpOffTimeout == true) {
                            if (pumpHA == true) {
                                log(dd.cfg.name + " - is out of sync - auto is off but pump is on - switching auto ON", 2, 2);
                                sendData(cfg.input.ha[dd.cfg.haAuto], 'input_boolean', 'turn_on');
                                state.ha.input[dd.cfg.haAuto] = true;
                                pumpStart();
                                return;
                            }
                            if (flow != undefined && flow.lm > dd.cfg.flowStartMin && dd.state.warnFlowFlush == false) {
                                dd.state.warnFlowFlush = true;
                                log(dd.cfg.name + " - flow is detected (" + flow.lm.toFixed(1) + " possible sensor damage or flush operation", 2, 3);
                                return;
                            }
                        }
                        break;
                }
                if (state.ha.input[tankOut.haPress] >= (tankOut.full + .12) && dd.state.faultOverflow == false) {
                    log(dd.cfg.name + " - " + tankOut.name + " is overflowing (" + state.ha.input[tankOut.haPress]
                        + tankOut.unit + ") - possible SSR or hardware failure", 2, 3);
                    dd.state.faultOverflow = true;
                }
                if (dd.state.listener == false) {
                    //     log("setting listener: " + x)
                    em.on(cfg.input.ha[dd.cfg.haAuto], function (data) {
                        switch (data) {
                            case true:
                                log(dd.cfg.name + " - is going ONLINE", 2);
                                state.ha.input[dd.cfg.haAuto] = true;
                                dd.state.faultFlow = false;
                                dd.state.faultFlowRestarts = 0;
                                return;
                            case false:
                                log(dd.cfg.name + " - is going OFFLINE - pump is stopping", 2);
                                state.ha.input[dd.cfg.haAuto] = false;
                                dd.state.faultFlowCancel = true;
                                pumpStop();
                                return;
                        }
                        return;
                    });
                    dd.state.listener = true;
                    return;
                }
                function pumpStart(send) {
                    if (flow != undefined) { flow.batch = flow.temp; }
                    dd.state.faultFlowCancel = false;
                    dd.state.faultFlow = false;
                    dd.state.pump = true;
                    dd.state.pumpFlowCheck = false;
                    dd.state.pumpFlowCheckPassed = false;
                    setTimeout(() => {
                        //    log(dd.cfg.name + " - checking pump flow", 2);
                        dd.state.pumpFlowCheck = true;
                        auto[0]();
                    }, dd.cfg.flowCheckWait * 1000);
                    dd.state.sendRetries = 0;
                    if (send) sendData(cfg.input.ha[dd.cfg.haPump], 'switch', 'turn_on');
                }
                function pumpStop() {
                    dd.state.pumpOffTimeout = false;
                    dd.state.pump = false;
                    pumpHA = false;
                    sendData(cfg.input.ha[dd.cfg.haPump], 'switch', 'turn_off');
                    setTimeout(() => { dd.state.pumpOffTimeout = true }, 10e3);
                }
                function sendData(name, type, toggle) {
                    let timeSend = new Date().getMilliseconds();
                    let timeFinish = undefined;
                    hass.services.call(toggle, type, { entity_id: name })
                        .then(data => {
                            timeFinish = new Date().getMilliseconds();
                            if (dd.state.warnHAlag == true)
                                log(dd.cfg.name + " - HA Lagging, reply time: " + (timeFinish - timeSend), 2, 2);
                            dd.state.warnHAlag = false;
                        })
                    setTimeout(() => {
                        if (timeFinish == undefined) {
                            if (dd.state.sendRetries == 0)
                                log(dd.cfg.name + " - HA is taking a long time to respond to command", 2, 2);
                            dd.state.warnHAlag = true;
                            setTimeout(() => {
                                if (timeFinish == undefined) {
                                    if (dd.state.sendRetries < 5) {
                                        dd.state.sendRetries++;
                                        log(dd.cfg.name + " - HA never responded, retrying - attempt " + dd.state.sendRetries, 2, 2);
                                        sendData(name, type, toggle);
                                    } else {
                                        log(dd.cfg.name + " - HA never responded, all attempts failed, giving up", 2, 3);
                                    }
                                }
                            }, 400);
                        }
                    }, 100);
                }
            }
        },
    ],
    user = {        // user configurable block - Telegram and timer function.  
        timer: {    // these functions are called once every min,hour,day. Use time.min time.hour and time.day for comparison 
            everyMin: function () {
                //  if (time.hour == 10 && time.min == 30)  // will execute every 10:30am
            },
            everyHour: function () {

            },
            everyDay: function () {

            },
        },
        telegram: { // enter a case matching your desireable input
            msg: function (msg) {
                if (sys.telegram.auth(msg)) {
                    switch (msg.text) {
                        case "?": console.log("test help menu"); break;
                        case "/start": bot.sendMessage(msg.chat.id, "welcome back po"); break;
                        case "R":   // to include uppercase letter in case match
                        case "r":
                            bot.sendMessage(msg.from.id, "Remote Control Menu:")
                            setTimeout(() => {      // delay to ensure menu Title gets presented first in Bot channel
                                for (let x = 0; x < cfg.dd.length; x++)  sys.telegram.button(msg, "dd", cfg.dd[x].name);    // iterate each DD system and create button
                            }, 2);
                            break;
                        case "1": em.emit(test[1][4], true); log("true", 0, 0); break;      // for testing of ESPhome API
                        case "2": em.emit(test[1][4], false); log("false", 0, 0); break;    // for testing of ESPhome API
                    }
                }
                else if (msg.text == config.telegram.password) sys.telegram.sub(msg);
                else if (msg.text == "/start") bot.sendMessage(msg.chat.id, "give me passcode");
                else bot.sendMessage(msg.chat.id, "i dont know you, go away");
            },
            callback: function (msg) {  // enter a two character code to identify your callback "case" 
                let code = msg.data.slice(0, 2);
                let data = msg.data.slice(2);
                switch (code) {
                    case "dd":
                        for (let x = 0; x < cfg.dd.length; x++) {   // read button input and toggle corisponding DD system
                            if (data == (cfg.dd[x].name + " on")) { toggleDD("on", x); break; }
                            if (data == (cfg.dd[x].name + " off")) { toggleDD("off", x); break; }
                        }
                        break;
                }       // create a function for use with your callback
                function toggleDD(newState, x) {    // function that reads the callback input and toggles corisponding boolean in Home Assistant
                    bot.sendMessage(msg.from.id, "pump " + cfg.dd[x].name + " " + newState);
                    hass.services.call("turn_" + newState, 'input_boolean', { entity_id: cfg.input.ha[cfg.dd[x].haAuto] })
                }
            },
        },
    },
    ha = {  // shouldn't need to touch anything below this line except for log() function (to add your automation name)
        fetch: function () {
            fetch = state.ha.fetch;
            let sendDelay = 0;
            let completed = 0;
            for (let x = 0; x < cfg.input.ha.length; x++) {
                let sensor = state.ha.input;
                let name = cfg.input.ha[x];
                if (name.includes("input_boolean")) {
                    setTimeout(() => {
                        hass.states.get('input_boolean', name)
                            .then(data => { data.state == "on" ? sensor[x] = true : sensor[x] = false; finished(); })
                            .catch(err => console.error(err))
                    }, sendDelay);
                    sendDelay += 20;
                } else if (name.includes("switch")) {
                    setTimeout(() => {
                        hass.states.get('switch', name)
                            .then(data => { data.state == "on" ? sensor[x] = true : sensor[x] = false; finished(); })
                            .catch(err => console.error(err))
                    }, sendDelay);
                    sendDelay += 20;
                } else if (name.includes("flow")) {
                    setTimeout(() => {
                        hass.states.get('sensor', name)
                            .then(data => {
                                if (isNaN(Number(data.state)) != true && Number(data.state) != null)
                                    sensor[x] = Number(data.state);
                                finished();
                            })
                            .catch(err => console.error(err))
                    }, sendDelay);
                    sendDelay += 20;
                } else {
                    setTimeout(() => {
                        hass.states.get('sensor', name)
                            .then(data => { sensor[x] = Number(data.state); finished(); })
                            .catch(err => console.error(err))
                    }, sendDelay);
                    sendDelay += 20;
                }
            }
            function finished() {
                completed++;
                if (cfg.input.ha.length == completed) {
                    if (state.ha.fetchBoot == false) {
                        log("initial fetch complete", 1)
                        sys.boot(1);
                        state.ha.fetchBoot = true;
                    }
                }
            }
        },
        push: function () {
            let list = ["_total", "_hour", "_day", "_lm"];
            let pos = 0;
            let sendDelay = 0;
            if (state.ha.ws.reply) {
                for (let x = 0; x < cfg.flow.length; x++) {
                    let unit = [cfg.flow[x].unit, cfg.flow[x].unit, cfg.flow[x].unit, "L/m"]
                    let value = [nv.flow[x].total, state.flow[x].hour, state.flow[x].day, state.flow[x].lm];
                    for (let y = 0; y < 4; y++) {
                        if (!state.ha.pushLast[pos]) {
                            state.ha.pushLast.push(Number(value[y]).toFixed(2));
                            send(cfg.flow[x].name + list[y], Number(value[y]).toFixed(2), unit[y])
                        } else if (state.ha.pushLast[pos] != Number(value[y]).toFixed(2)) {
                            state.ha.pushLast[pos] = (Number(value[y]).toFixed(2));
                            send(cfg.flow[x].name + list[y], Number(value[y]).toFixed(2), unit[y])
                        }
                        pos++;
                    }
                }
                for (let x = 0; x < cfg.tank.length; x++) {
                    let calc = cfg.tank[x].full - state.ha.input[cfg.tank[x].haPress];
                    let calc2 = calc / cfg.tank[x].full;
                    state.tank[x] = Math.round(100 - (calc2 * 100));
                    if (!state.ha.pushLast[pos]) {
                        state.ha.pushLast.push(state.tank[x]);
                        send(cfg.tank[x].name, state.tank[x], '%')
                    } else if (state.ha.pushLast[pos] != state.tank[x]) {
                        state.ha.pushLast[pos] = state.tank[x];
                        send(cfg.tank[x].name, state.tank[x], '%')
                    }
                    pos++;
                }
            }
            function send(name, value, unit) {
                setTimeout(() => {
                    hass.states.update('sensor', name,
                        { state: value, attributes: { state_class: 'measurement', unit_of_measurement: unit } })
                        .catch(err => console.error(err))
                }, sendDelay);
                sendDelay += 25;
            }
        },
        calcFlow: function () {
            for (let x = 0; x < cfg.flow.length; x++) {
                state.flow[x].lm = state.ha.input[cfg.flow[x].haFlow] / cfg.flow[x].pulse / 60;
                nv.flow[x].total += state.flow[x].lm / 60 / 1000;
            }
        },
        calcFlowMeter: function () {
            sys.time.sync();
            let calcFlow = 0, hour = 0, day = 0, hourNV = 0;
            for (let x = 0; x < cfg.flow.length; x++) {
                if (state.flow[x].temp == undefined) state.flow[x].temp = nv.flow[x].total
                if (state.flow[x].temp != nv.flow[x].total) {
                    calcFlow = nv.flow[x].total - state.flow[x].temp;
                    state.flow[x].temp = nv.flow[x].total;
                }
                nv.flow[x].min[time.min] = calcFlow;

                nv.flow[x].min.forEach((y) => hour += y);
                state.flow[x].hour = hour;

                for (let y = 0; y <= time.min; y++) day += nv.flow[x].min[y];
                nv.flow[x].hour.forEach((y) => day += y);
                day = day - nv.flow[x].hour[time.hour];
                state.flow[x].day = day;

                for (let y = 0; y < 60; y++) hourNV += nv.flow[x].min[y];
                nv.flow[x].hour[time.hour] = hourNV;
            }
        },
        ws: function () {
            let ws = state.ha.ws;
            client.connect("ws://" + config.homeAssistant.address + ":" + config.homeAssistant.port + "/api/websocket");
            client.on('connectFailed', function (error) { if (!ws.error) { log(error.toString(), 1, 3); ws.error = true; } });
            client.on('connect', function (socket) {
                if (ws.reply == false) { log("fetching sensor states", 1); ha.fetch(); ws.id = 0; }
                ws.reply = true;
                ws.error = false;
                socket.on('error', function (error) {
                    if (!ws.error) { log('socket Error: ' + error.toString(), 1, 3); ws.error = true; }
                });
                socket.on('close', function () { log('Connection closed!', 1, 3); });
                socket.on('message', function (message) {
                    let buf = JSON.parse(message.utf8Data);
                    switch (buf.type) {
                        case "pong":
                            //    log("pong: " + JSON.stringify(buf))
                            ws.reply = true;
                            ws.pingsLost = 0;
                            let timeFinish = new Date().getMilliseconds();
                            let timeResult = timeFinish - ws.timeStart;
                            if (timeResult > 500) log("websocket ping is lagging - delay is: " + timeResult + "ms", 1, 2);
                            break;
                        case "auth_required":
                            log("Websocket authenticating", 1);
                            send({ type: "auth", access_token: config.homeAssistant.token, });
                            break;
                        case "auth_ok":
                            log("Websocket authentication accepted", 1);
                            log("Websocket subscribing to event listener", 1);
                            send({ id: 1, type: "subscribe_events", event_type: "state_changed" });
                            log("starting auto daemons");
                            if (state.sys.boot == false) { state.sys.boot = true; log("system booted"); }
                            for (let x = 0; x < auto.length; x++) auto[x]();
                            ws.timeStart = new Date().getMilliseconds();
                            send({ id: ws.id++, type: "ping" });
                            setTimeout(() => { ws.pingsLost = 0; send({ id: ws.id++, type: "ping" }); ws.reply = true; ping(); }, 10e3);
                            break;
                        case "event":
                            switch (buf.event.event_type) {
                                case "state_changed":
                                    let ibuf = undefined;
                                    if (buf.event.data.new_state != undefined
                                        && buf.event.data.new_state != null) ibuf = buf.event.data.new_state.state;
                                    let obuf = undefined;
                                    if (logs.ws[ws.logStep] == undefined) logs.ws.push(buf.event);
                                    else logs.ws[ws.logStep] = buf.event
                                    if (ws.logStep < 200) ws.logStep++; else ws.logStep = 0;
                                    //    log("WS received data" + JSON.stringify(buf.event))
                                    for (let x = 0; x < cfg.input.ha.length; x++) {
                                        if (cfg.input.ha[x] == buf.event.data.entity_id) {
                                            //  log("WS received data for sensor: " + x + JSON.stringify(buf.event.data.new_state))
                                            if (ibuf === "on") obuf = true;
                                            else if (ibuf === "off") obuf = false;
                                            else if (ibuf === null || ibuf == undefined) log("HA is sending bogus (null/undefined) data: " + ibuf, 1, 2);
                                            else if (ibuf === "unavailable") {
                                                if (config.homeAssistant.log.espDisconnect == true)
                                                    log("ESP Module " + buf.event.data.new_state.entity_id + " has gone offline - " + ibuf, 1, 2);
                                            }
                                            else if (!isNaN(parseFloat(Number(ibuf))) == true
                                                && isFinite(Number(ibuf)) == true && Number(ibuf) != null) obuf = ibuf;
                                            else log("HA is sending bogus (no match) Entity: " + buf.event.data.new_state.entity_id + " data: " + ibuf, 1, 2);
                                            //   log("ws sensor: " + x + " data: " + buf.event.data.new_state.state + " result: " + ibuf);
                                            if (obuf != undefined) { state.ha.input[x] = obuf; em.emit(cfg.input.ha[x], obuf); }
                                        }
                                    }
                                    for (let x = 0; x < auto.length; x++) auto[x]();
                                    break;
                            }
                            break;
                    }
                });
                function send(data) { socket.sendUTF(JSON.stringify(data)); }
                function ping() {
                    if (ws.reply == false) {
                        if (ws.pingsLost < 2) {
                            log("websocket ping never got replied in 10 sec", 1, 3);
                            ws.pingsLost++;
                        }
                        else { socket.close(); haReconnect("ping timeout"); return; }
                    }
                    ws.reply = false;
                    ws.timeStart = new Date().getMilliseconds();
                    send({ id: ws.id++, type: "ping" });
                    setTimeout(() => { ping(); }, 2e3);
                }
                function haReconnect(error) {
                    log("socket " + error.toString(), 1, 3);
                    client.connect("ws://" + address + ":" + port + "/api/websocket");
                    setTimeout(() => { if (ws.reply == false) { haReconnect("retrying..."); } }, 10e3);
                }
            });
            em.on('send', function (data) { socket.sendUTF(JSON.stringify(data)); });
        }
    },
    sys = {
        boot: function (step) {
            switch (step) {
                case 0:
                    sys.checkArgs();
                    console.log("Working Directory: " + config.workingDir);
                    log("initializing system states");
                    sys.init.state();
                    fs.exists(config.workingDir + "nv.json", (exists) => {
                        if (exists) {
                            log("loading NV data...");
                            nv = JSON.parse(fs.readFileSync(config.workingDir + "nv.json"));
                        }
                        else {
                            log("initializing NV mem...");
                            sys.init.nv();
                            log("creating new NV file...");
                            fs.writeFileSync(config.workingDir + "nv.json", JSON.stringify(nv));
                        }
                        if (config.webDiag) {
                            express.get("/esp", function (request, response) { response.send(logs.esp); });
                            express.get("/ha", function (request, response) { response.send(logs.haInputs); });
                            express.get("/log", function (request, response) { response.send(logs.sys); });
                            express.get("/tg", function (request, response) { response.send(logs.tg); });
                            express.get("/ws", function (request, response) { response.send(logs.ws); });
                            express.get("/nv", function (request, response) { response.send(nv); });
                            express.get("/state", function (request, response) { response.send(state); });
                            express.get("/cfg", function (request, response) { response.send(cfg); })
                            var serverWeb = express.listen(config.webDiagPort, function () { log("diag web server starting on port " + config.webDiagPort, 0); });
                        }
                        if (config.telegram.token != undefined && config.telegram.token != "") {
                            log("starting Telegram service...");
                            bot.on('message', (msg) => {
                                if (logs.tg[state.sys.logStepTG] == undefined) logs.tg.push(msg);
                                else logs.tg[state.sys.logStepTG] = msg;
                                if (state.sys.logStepTG < 100) state.sys.logStepTG++; else state.sys.logStepTG = 0;
                                user.telegram.msg(msg);
                            });
                            bot.on('callback_query', (msg) => user.telegram.callback(msg));
                        }
                        log("ESP Discovery initiated...");
                        Discovery().then(results => { state.esp.discover = results });
                        if (config.espEnabled) {
                            log("ESP connections initiating...");
                            sys.esp();
                        }
                        haconnect();
                        function haconnect() {
                            hass.status()
                                .then(data => {
                                    log("HA push " + data.message, 1);
                                    log("fetching configured inputs", 1);
                                    ha.fetch();
                                    log("fetching available inputs", 1);
                                    hass.states.list()
                                        .then(data => logs.haInputs = data)
                                        .catch(err => { log(err, 1, 2); });
                                })
                                .catch(err => {
                                    setTimeout(() => {
                                        log("retrying to connect to HA", 0, 2)
                                        haconnect();
                                    }, 10e3);
                                    log(err, 1, 2);
                                });
                        }
                    });
                    break;
                case 1:
                    time.minLast = time.min;
                    time.hourLast = time.hour;
                    time.dayLast = time.day;
                    sys.time.interval(true);
                    ha.ws();
                    setInterval(() => sys.time.timer(), 1000);
                    break;
            }
        },
        esp: function () {  // currently testing for outgoing signaling 
            let entityNum = 0;
            for (let x = 0; x < cfg.input.esp.length; x++) {
                espClient.push(new Client({
                    host: cfg.input.esp[x].ip,
                    port: 6053,
                    encryptionKey: cfg.input.esp[x].key,
                }));
                state.esp.entities.push([]);
                espClient[x].connect();
                espClient[x].on('newEntity', entity => {
                    state.esp.entities[x].push({ name: entity.config.objectId, type: entity.type, id: entity.id, state: null });


                    //   if (entity.type === "Switch") {
                    //        log("setting board: " + x + " entity: " + (state.esp.entities[x].length - 1) + " to " + entity.config.objectId, 0, 0)
                    //       em.on(test[x][state.esp.entities[x].length - 1], function (data) { entity.setState(data); });
                    //    }


                    entity.on('state', (value) => {
                        for (let y = 0; y < state.esp.entities[x].length; y++) {
                            if (state.esp.entities[x][y].id == value.key) {
                                state.esp.entities[x][y].state = value.state;

                            }
                        }
                    });
                });
                espClient[x].on('error', (error) => console.log(error));
                entityNum = 0;
            }
        },
        telegram: {
            sub: function (msg) {
                let buf = { user: msg.from.first_name + " " + msg.from.last_name, id: msg.from.id }
                if (!sys.telegram.auth(msg)) {
                    log("telegram - user just joined the group - " + msg.from.first_name + " " + msg.from.last_name + " ID: " + msg.from.id, 0, 2);
                    nv.telegram.push(buf);
                    bot.sendMessage(msg.chat.id, 'registered');
                    sys.file.write.nv();
                } else bot.sendMessage(msg.chat.id, 'already registered');
            },
            auth: function (msg) {
                let exist = null;
                for (let x = 0; x < nv.telegram.length; x++)
                    if (nv.telegram[x].id == msg.from.id) { exist = true; break; }
                if (exist) return true; else return false;
            },
            button: function (msg, auto, name) {
                bot.sendMessage(msg.from.id, name, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "on", callback_data: (auto + name + " on") },
                                { text: "off", callback_data: (auto + name + " off") }
                            ]
                        ]
                    }
                })
            },
        },
        time: {
            sync: function () {
                time.date = new Date();
                time.ms = time.date.getMilliseconds();
                time.sec = time.date.getSeconds();
                time.min = time.date.getMinutes();
                time.hour = time.date.getHours();
                time.day = time.date.getDate();
                time.month = time.date.getMonth();
                time.stamp = ("0" + time.month).slice(-2) + "-" + ("0" + time.day).slice(-2) + " "
                    + ("0" + time.hour).slice(-2) + ":" + ("0" + time.min).slice(-2) + ":"
                    + ("0" + time.sec).slice(-2) + "." + ("00" + time.ms).slice(-3);
                return time.stamp;
            },
            timer: function () {    // called every second
                if (time.minLast != time.min) { time.minLast = time.min; everyMin(); }
                sys.time.interval();
                function everyMin() {
                    if (time.hourLast != time.hour) { time.hourLast = time.hour; everyHour(); }
                    sys.time.interval(true);
                    for (let x = 0; x < cfg.dd.length; x++) {
                        state.dd[x].warnSensorFlush = false;
                    }
                    user.timer.everyMin();
                }
                function everyHour() {
                    if (time.dayLast != time.day) { time.dayLast = time.day; everyDay(); }
                    for (let x = 0; x < cfg.dd.length; x++) {
                        state.dd[x].faultOverflow = false;
                        state.dd[x].warnTankLow = false;
                        state.dd[x].warnFlowFlush = false;
                    }
                    user.timer.everyHour();
                }
                function everyDay() {
                    if (time.hour == 6) {
                        for (let x = 0; x < cfg.dd.length; x++) { state.dd[x].warnFlowDaily = false; }
                    }
                    user.timer.everyDay();
                }
            },
            interval: function (flowMeter) {
                time.up++;
                sys.time.sync();
                ha.calcFlow();
                if (flowMeter) {
                    ha.calcFlowMeter();
                    sys.file.write.nv();
                }
                ha.push();
            },
        },
        init: {
            nv: function () {
                for (let x = 0; x < cfg.flow.length; x++) {
                    nv.flow.push({ total: 0, min: [], hour: [], day: [] })
                    for (let y = 0; y < 60; y++) nv.flow[x].min.push(0);
                    for (let y = 0; y < 24; y++) nv.flow[x].hour.push(0);
                    for (let y = 0; y < 30; y++) nv.flow[x].day.push(0);
                }
            },
            state: function () {  // initialize system volatile memory
                for (let x = 0; x < cfg.flow.length; x++) {
                    state.flow.push({
                        lm: 0,
                        temp: undefined,
                        hour: 0,
                        day: 0,
                        batch: 0
                    })
                }
                for (let x = 0; x < cfg.tank.length; x++) { state.tank.push(0) }
                state.ha = {
                    input: [],
                    fetchBoot: false,
                    pushLast: [],
                    ws: {
                        logStep: 0,
                        error: false,
                        id: 1,
                        reply: true,
                        pingsLost: 0,
                        timeStart: 0,
                    },
                }
                for (let x = 0; x < cfg.input.ha.length; x++) { state.ha.input.push(0) }
                state.esp = { discover: [], entities: [], connection: [] }
                state.sys = { boot: false, logStepTG: 0, }
            },

        },
        checkArgs: function () {
            if (process.argv[2] == "-i") {
                log("installing HA Auto service...");
                let service = [
                    "[Unit]",
                    "Description=\n",
                    "[Install]",
                    "WantedBy=multi-user.target\n",
                    "[Service]",
                    "ExecStart=/bin/node " + config.workingDir + "ha.js",
                    "Type=simple",
                    "User=root",
                    "Group=root",
                    "WorkingDirectory=" + config.workingDir,
                    "Restart=on-failure\n",
                ];
                fs.writeFileSync("/etc/systemd/system/ha.service", service.join("\n"));
                execSync("mkdir /apps/ha -p");
                execSync("cp " + process.argv[1] + " /apps/ha/");
                execSync("systemctl daemon-reload");
                execSync("sudo systemctl enable ha.service");
                exec("sudo systemctl start ha ; xterm -geometry 120x50+100+20 -fa 'ubuntu mono' -fs 10 -e 'journalctl -f -u ha'");
                process.exit();
            }
        },
        file: {
            write: {
                nv: function () {  // write non-volatile memory to the disk
                    fs.writeFile(config.workingDir + "nv-bak.json", JSON.stringify(nv), function () {
                        fs.copyFile(config.workingDir + "nv-bak.json", config.workingDir + "nv.json", (err) => {
                            if (err) throw err;
                        });
                    });
                }
            },
        },
    },
    time = { date: undefined, month: 0, day: 0, dayLast: undefined, hour: 0, hourLast: undefined, min: 0, minLast: undefined, sec: 0, up: 0, ms: 0, millis: 0, stamp: "" },
    state = { ha: [], flow: [], tank: [] },
    nv = { flow: [], telegram: [] },
    logs = { step: 0, sys: [], ws: [], tg: [], haInputs: [], esp: [] },
    espClient = [];
sys.boot(0);
function lib() {
    TelegramBot = require('node-telegram-bot-api'),
        bot = new TelegramBot(config.telegram.token, { polling: true }),
        fs = require('fs'),
        exec = require('child_process').exec,
        execSync = require('child_process').execSync,
        HomeAssistant = require('homeassistant'),
        expressLib = require("express"),
        express = expressLib(),
        WebSocketClient = require('websocket').client,
        client = new WebSocketClient(),
        { Client } = require('@2colors/esphome-native-api'),
        { Discovery } = require('@2colors/esphome-native-api'),
        events = require('events'),
        em = new events.EventEmitter(),
        hass = new HomeAssistant({
            host: "http://" + config.homeAssistant.address,
            port: config.homeAssistant.port,
            token: config.homeAssistant.token,
            ignoreCert: true
        });
}
function log(message, mod, level) {      // add a new case with the name of your automation function
    let buf = sys.time.sync();
    if (level == undefined) level = 1;
    switch (level) {
        case 0: buf += "|--debug--|"; break;
        case 1: buf += "|  Event  |"; break;
        case 2: buf += "|*Warning*|"; break;
        case 3: buf += "|!!ERROR!!|"; break;
        default: buf += "|  Event  |"; break;
    }
    switch (mod) {      // add a new case with the name of your automation function, starting at case 3
        case 0: buf += " system | "; break;
        case 1: buf += "     HA | "; break;
        case 2: buf += "Delivery| "; break;
        default: buf += " system | "; break;
    }
    buf += message;
    if (logs.sys[logs.step] == undefined) logs.sys.push(buf);
    else logs.sys[logs.step] = buf;
    if (logs.step < 500) logs.step++; else logs.step = 0;
    if (config.telegram.enable == true) {
        if (level >= config.telegram.logLevel
            || config.telegram.logLevel == 0 && config.telegram.logDebug == true) {
            for (let x = 0; x < nv.telegram.length; x++) {
                bot.sendMessage(nv.telegram[x].id, buf);
            }

        }
    }
    console.log(buf);
}
let test = [    // for ESP Home testing
    [null, null, null, null, null, null, null, null,],
    [null, null, null, null, null, null, null, null,]
]
