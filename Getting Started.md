

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
