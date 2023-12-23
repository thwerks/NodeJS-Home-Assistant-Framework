#!/usr/bin/node
let config = {
    espEnabled: false,                  // enable Node ESP Home API
    webDiag: true,                      // enable debug web server
    webDiagPort: 200,                   // debug web server port number
    workingDir: "/apps/ha/",            // specify the working director for non-volatile data storage (must add the trailing / )
    homeAssistant: {
        address: "10.10.1.249",         // IP address of Home Assistant Server
        port: 8123,                     // HA port
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4NWY4NDI3M2IzMjA0MTkxYjQ4YTBkNTZiMWJhYzFkMSIsImlhdCI6MTcwMzM3NzQyMiwiZXhwIjoyMDE4NzM3NDIyfQ.rP9t7qWTo3wKeAWBryklfyTtI4Rj4KTJdlSalWbkQr4",               // HA long lived Token - generate this in your HA user profile settings
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
        token: "6001129337:AAFtm-xj1seANYdfbneJEktju1X0x2tqGmU"                // Telegram Bot token
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

        ],
        tank: [     // config for tanks used with Home Assistant -- these tanks get sent back to HA as sensors

        ],
        flow: [      // config for flow meters used with Home Assistant -- these flow meters get sent back to HA as sensors

        ],
        io: {    // home assistant inputs you want to utilize here
            ha: [  // exact name of HA switch, sensor or input - check http://10.0.0.1:200/ha to see what's available in HA

            ],
            esp: [  // testing - ESP Home modules that will be subscribed to
                /*
                    { ip: "10.21.4.30", key: "myKey" },
                    { ip: "10.21.4.31", key: "myKey" },
                    */
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
            // for multi object system use like this, see the DD system for example
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
                            em.on(cfg.io.ha["my home assistant number here"], function (data) {
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
                hass.services.call('turn_off', 'switch', { entity_id: cfg.io.ha[number of your input] })
                .then(data => {   })                    // optional  -  do something after completion if you want
                .catch(err => log(err)0,3)              // optional  -  catch and log error if you want

                //  example for boolean
                hass.services.call('turn_on', 'input_boolean', { entity_id: cfg.io.ha[number of your input] })
    
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
                        sendRetries: 0, listener: false,
                        pump: { run: false, flowCheck: false, flowCheckPassed: false, timeoutOff: false, },
                        fault: { flow: false, flowCancel: false, flowRestarts: 0, flowOver: false, },
                        warn: {
                            flow: false,
                            flowDaily: false,
                            flowFlush: false,
                            haLag: false,
                            sensorFlush: false,
                            tankLow: false,
                        },
                    })
                });
            }
            for (let x = 0; x < cfg.dd.length; x++) {   // enumerate every demand delivery instance
                let // flatten objet names (for easier readability)
                    dd = { state: state.dd[x], cfg: cfg.dd[x] },
                    system = { state: state.ha.io[dd.cfg.haAuto], cfg: cfg.io.ha[dd.cfg.haAuto] },
                    pump1 = { state: state.ha.io[dd.cfg.haPump], cfg: cfg.io.ha[dd.cfg.haPump] },
                    tankOut = cfg.tank[dd.cfg.cfgTankOutput];
                sensor = {
                    press: state.ha.io[tankOut.haPress],
                    flow: undefined,
                };
                if (dd.cfg.cfgFlow != undefined) sensor.flow = state.flow[dd.cfg.cfgFlow];
                if (dd.state.listener == false) listener(); // setup the HA Input event listener  
                switch (system.state) {
                    case true:                  // when Auto System is ONLINE
                        switch (dd.state.pump.run) {
                            case false:         // when pump is STOPPED
                                switch (dd.state.fault.flow) {
                                    case false: // when pump is not flow faulted
                                        if (sensor.press <= tankOut.low) {
                                            log(dd.cfg.name + " - " + tankOut.name + " is low - pump is starting", 2);
                                            pumpStart(true);
                                            return;
                                        }
                                        if (dd.state.pump.timeoutOff == true) {  // after pump has been off for a while
                                            if (pump1.state === true) {
                                                log(dd.cfg.name + " - pump running in HA but not here - switching pump ON", 2);
                                                pumpStart(true);
                                                return;
                                            } else {
                                                if (sensor.flow != undefined && sensor.flow.lm > dd.cfg.flowStartMin && dd.state.warn.sensorFlush == false) {
                                                    log(dd.cfg.name + " - flow is detected (" + sensor.flow.lm.toFixed(0) + "lpm) possible sensor damage or flush operation", 2, 2);
                                                    dd.state.warn.sensorFlush = true;
                                                    return;
                                                }
                                            }
                                        }
                                        break;
                                    case true:  // when pump is flow faulted
                                        if (dd.state.pump.timeoutOff == true) {
                                            if (pump1.state === true || sensor.flow != undefined && sensor.flow.lm > dd.cfg.flowStartMin) {
                                                log(dd.cfg.name + " - pump is flow faulted but HA pump status is still ON, trying to stop again", 2, 3);
                                                sendData(system.cfg, 'input_boolean', 'turn_off');
                                                system.state = false;
                                                pumpStop();
                                                return;
                                            }
                                        }
                                        break;
                                }
                                break;
                            case true:      // when pump is RUNNING
                                if (sensor.press >= tankOut.full) {
                                    if (sensor.flow != undefined) {
                                        let tFlow = sensor.flow.temp - sensor.flow.batch;
                                        log(dd.cfg.name + " - " + tankOut.name
                                            + " is full - pump is stopping - pumped " + tsensor.flow.toFixed(1) + " m3", 2);
                                    } else { log(dd.cfg.name + " - " + tankOut.name + " is full - pump is stopping", 2); }
                                    pumpStop();
                                    return;
                                }
                                if (dd.state.pump.flowCheck == true && sensor.flow != undefined) {
                                    if (sensor.flow.lm < dd.cfg.flowStartMin) {
                                        pumpStop();
                                        dd.state.fault.flow = true;
                                        if (dd.state.fault.flowRestarts < 3) {
                                            log(dd.cfg.name + " - flow check FAILED!! (" + sensor.flow.lm.toFixed(1) + "lm) HA Pump State: "
                                                + pump1.state + " - waiting for retry " + (dd.state.fault.flowRestarts + 1), 2, 2);
                                            dd.state.fault.flowRestarts++;
                                            setTimeout(() => {
                                                if (dd.state.fault.flowCancel == false) dd.state.fault.flow = false; log(dd.cfg.name + " - pump restating", 2);
                                            }, dd.cfg.fault.flowRetry * 1000);
                                        } else if (dd.state.fault.flowRestarts == 3) {
                                            log(dd.cfg.name + " - low flow (" + sensor.flow.lm.toFixed(1) + "lm) HA State: "
                                                + pump1.state + " - retries exceeded - going offline for " + dd.cfg.fault.flowFinal + "m", 2, 3);
                                            dd.state.fault.flowRestarts++;
                                            setTimeout(() => {
                                                if (dd.state.fault.flowCancel == false) dd.state.fault.flow = false; log(dd.cfg.name + " - pump restating", 2);
                                            }, dd.cfg.fault.flowFinal * 60 * 1000);
                                        }
                                        else {
                                            dd.state.fault.flowRestarts++;
                                            log(dd.cfg.name + " - low flow (" + sensor.flow.lm.toFixed(1) + "lm) HA State: "
                                                + pump1.state + " - all retries failed - going OFFLINE permanently", 2, 3);
                                            sendData(system.cfg, 'input_boolean', 'turn_off');
                                            system.state = false;
                                        }
                                    } else {
                                        if (dd.state.pump.flowCheckPassed == false) {
                                            log(dd.cfg.name + " - pump flow check PASSED (" + sensor.flow.lm.toFixed(1) + "lm)", 2);
                                            dd.state.pump.flowCheckPassed = true;
                                            dd.state.fault.flowRestarts = 0;
                                            if (sensor.flow.lm < dd.cfg.flowStartWarn && dd.state.warn.flowDaily == false) {
                                                dd.state.warn.flowDaily = true;
                                                log(dd.cfg.name + " - pump flow is lower than optimal (" + sensor.flow.lm.toFixed(1) + "lm) - clean filter", 2, 2);
                                            }
                                        }
                                    }
                                }
                                break;
                        }
                        if (dd.state.warn.tankLow != undefined && sensor.press <= (tankOut.warn) && dd.state.warn.tankLow == false) {
                            log(dd.cfg.name + " - " + tankOut.name + " is lower than expected (" + sensor.press
                                + tankOut.unit + ") - possible hardware failure or low performance", 2, 2);
                            dd.state.warn.tankLow = true;
                        }
                        break;
                    case false:  // when auto is OFFLINE
                        if (dd.state.pump.timeoutOff == true) {
                            if (pump1.state == true) {
                                log(dd.cfg.name + " - is out of sync - auto is off but pump is on - switching auto ON", 2, 2);
                                sendData(system.cfg, 'input_boolean', 'turn_on');
                                system.state = true;
                                pumpStart();
                                return;
                            }
                            if (sensor.flow != undefined && sensor.flow.lm > dd.cfg.flowStartMin && dd.state.warn.flowFlush == false) {
                                dd.state.warn.flowFlush = true;
                                log(dd.cfg.name + " - flow is detected (" + sensor.flow.lm.toFixed(1) + " possible sensor damage or flush operation", 2, 3);
                                return;
                            }
                        }
                        break;
                }
                if (sensor.press >= (tankOut.full + .12) && dd.state.fault.flowOver == false) {
                    log(dd.cfg.name + " - " + tankOut.name + " is overflowing (" + sensor.press
                        + tankOut.unit + ") - possible SSR or hardware failure", 2, 3);
                    dd.state.fault.flowOver = true;
                }
                function pumpStart(send) {
                    if (sensor.flow != undefined) { sensor.flow.batch = sensor.flow.temp; }
                    dd.state.fault.flowCancel = false;
                    dd.state.fault.flow = false;
                    dd.state.pump.run = true;
                    dd.state.pump.flowCheck = false;
                    dd.state.pump.flowCheckPassed = false;
                    setTimeout(() => {
                        //    log(dd.cfg.name + " - checking pump flow", 2);
                        dd.state.pump.flowCheck = true;
                        auto[0]();
                    }, dd.cfg.flowCheckWait * 1000);
                    dd.state.sendRetries = 0;
                    if (send) sendData(pump1.cfg, 'switch', 'turn_on');
                }
                function pumpStop() {
                    dd.state.pump.timeoutOff = false;
                    dd.state.pump.run = false;
                    pump1.state = false;
                    sendData(pump1.cfg, 'switch', 'turn_off');
                    setTimeout(() => { dd.state.pump.timeoutOff = true }, 10e3);
                }
                function listener() {
                    //     log("setting listener: " + x)
                    em.on(system.cfg, function (data) {
                        switch (data) {
                            case true:
                                log(dd.cfg.name + " - is going ONLINE", 2);
                                system.state = true;
                                dd.state.fault.flow = false;
                                dd.state.fault.flowRestarts = 0;
                                dd.state.warn.tankLow = false;
                                return;
                            case false:
                                log(dd.cfg.name + " - is going OFFLINE - pump is stopping", 2);
                                system.state = false;
                                dd.state.fault.flowCancel = true;
                                pumpStop();
                                return;
                        }
                        return;
                    });
                    dd.state.listener = true;
                    return;
                }
                function sendData(name, type, toggle) {
                    let timeSend = new Date().getMilliseconds();
                    let timeFinish = undefined;
                    hass.services.call(toggle, type, { entity_id: name })
                        .then(data => {
                            timeFinish = new Date().getMilliseconds();
                            if (dd.state.warn.haLag == true)
                                log(dd.cfg.name + " - HA Lagging, reply time: " + (timeFinish - timeSend) + "ms", 2, 2);
                            dd.state.warn.haLag = false;
                        });
                    setTimeout(() => {
                        if (timeFinish == undefined) dd.state.warn.haLag = true;
                        setTimeout(() => {
                            if (timeFinish == undefined && dd.state.sendRetries == 0)
                                log(dd.cfg.name + " - HA is taking a long time to respond to command (>200ms)", 2, 2);
                            setTimeout(() => {
                                if (timeFinish == undefined) {
                                    if (dd.state.sendRetries < 5) {
                                        dd.state.sendRetries++;
                                        log(dd.cfg.name + " - HA never responded in 500ms, retrying - attempt " + dd.state.sendRetries, 2, 2);
                                        sendData(name, type, toggle);
                                    } else {
                                        log(dd.cfg.name + " - HA never responded, all attempts failed, giving up", 2, 3);
                                    }
                                }
                            }, 300);
                        }, 100);
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
                        case "/start": bot.sendMessage(msg.chat.id, "you are already registered"); break;
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
                else bot.sendMessage(msg.chat.id, "i don't know you, go away");
            },
            callback: function (msg) {  // enter a two character code to identify your callback "case" 
                let code = msg.data.slice(0, 2);
                let data = msg.data.slice(2);
                switch (code) {
                    case "dd":
                        for (let x = 0; x < cfg.dd.length; x++) {   // read button input and toggle corresponding DD system
                            if (data == (cfg.dd[x].name + " on")) { toggleDD("on", x); break; }
                            if (data == (cfg.dd[x].name + " off")) { toggleDD("off", x); break; }
                        }
                        break;
                }       // create a function for use with your callback
                function toggleDD(newState, x) {    // function that reads the callback input and toggles corresponding boolean in Home Assistant
                    bot.sendMessage(msg.from.id, "pump " + cfg.dd[x].name + " " + newState);
                    hass.services.call("turn_" + newState, 'input_boolean', { entity_id: cfg.io.ha[cfg.dd[x].haAuto] })
                }
            },
        },
    },
    ha = {  // shouldn't need to touch anything below this line except for log() function (to add your automation name)
        fetch: function () {
            fetch = state.ha.fetch;
            let sendDelay = 0;
            let completed = 0;
            for (let x = 0; x < cfg.io.ha.length; x++) {
                let sensor = state.ha.io;
                let name = cfg.io.ha[x];
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
                if (cfg.io.ha.length == completed) {
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
                    let calc = cfg.tank[x].full - state.ha.io[cfg.tank[x].haPress];
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
                state.flow[x].lm = state.ha.io[cfg.flow[x].haFlow] / cfg.flow[x].pulse / 60;
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
                                    for (let x = 0; x < cfg.io.ha.length; x++) {
                                        if (cfg.io.ha[x] == buf.event.data.entity_id) {
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
                                            if (obuf != undefined) { state.ha.io[x] = obuf; em.emit(cfg.io.ha[x], obuf); }
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
                            if (cfg.io.ha.length < 1) {
                                hass.status()
                                    .then(data => {
                                        console.log(a.color("blue", "HA Status: " + data.message));
                                        hass.states.list()
                                            .then(data => {
                                                console.log("listing entities:\n");
                                                data.forEach(element => {
                                                    console.log(element.entity_id);
                                                });
                                                console.log("\nNo HA entities configured...exiting");
                                                process.exit();
                                            });
                                    });
                            } else {
                                hass.status()
                                    .then(data => {
                                        log("HA push service " + data.message, 1);
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
            for (let x = 0; x < cfg.io.esp.length; x++) {
                espClient.push(new Client({
                    host: cfg.io.esp[x].ip,
                    port: 6053,
                    encryptionKey: cfg.io.esp[x].key,
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
                        state.dd[x].warn.sensorFlush = false;
                    }
                    user.timer.everyMin();
                }
                function everyHour() {
                    if (time.dayLast != time.day) { time.dayLast = time.day; everyDay(); }
                    for (let x = 0; x < cfg.dd.length; x++) {
                        state.dd[x].fault.flowOver = false;
                        state.dd[x].warn.tankLow = false;
                        state.dd[x].warn.flowFlush = false;
                    }
                    user.timer.everyHour();
                }
                function everyDay() {
                    if (time.hour == 6) {
                        for (let x = 0; x < cfg.dd.length; x++) { state.dd[x].warn.flowDaily = false; }
                    }
                    user.timer.everyDay();
                }
            },
            interval: function (flowMeter) {
                time.up++;
                sys.time.sync();
                ha.calcFlow();
                if (flowMeter) { ha.calcFlowMeter(); sys.file.write.nv(); }
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
                state.ha = {
                    io: [],
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
                for (let x = 0; x < cfg.io.ha.length; x++) { state.ha.io.push(0) }
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
                    "ExecStart=/bin/nodemon " + config.workingDir + "/ha.js",
                    "Type=simple",
                    "User=root",
                    "Group=root",
                    "WorkingDirectory=" + config.workingDir,
                    "Restart=on-failure\n",
                ];
                fs.writeFileSync("/etc/systemd/system/ha.service", service.join("\n"));
                // execSync("mkdir /apps/ha -p");
                // execSync("cp " + process.argv[1] + " /apps/ha/");
                execSync("systemctl daemon-reload");
                execSync("systemctl enable ha.service");
                execSync("systemctl start ha");
                log("service installed and started");
                console.log("type: journalctl -f -u ha");
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
    a = {
        color: function (color, input, ...option) {   //  ascii color function for terminal colors
            if (input == undefined) input = '';
            let c, op = "", bold = ';1m', vbuf = "";
            for (let x = 0; x < option.length; x++) {
                if (option[x] == 0) bold = 'm';         // bold
                if (option[x] == 1) op = '\x1b[5m';     // blink
                if (option[x] == 2) op = '\u001b[4m';   // underline
            }
            switch (color) {
                case 'black': c = 0; break;
                case 'red': c = 1; break;
                case 'green': c = 2; break;
                case 'yellow': c = 3; break;
                case 'blue': c = 4; break;
                case 'purple': c = 5; break;
                case 'cyan': c = 6; break;
                case 'white': c = 7; break;
            }
            if (input === true) return '\x1b[3' + c + bold;     // begin color without end
            if (input === false) return '\x1b[37;m';            // end color
            vbuf = op + '\x1b[3' + c + bold + input + '\x1b[37;m';
            return vbuf;
        }
    },
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
