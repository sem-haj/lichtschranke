// remember the last event so that we can check if two buttons were pressed within 1 second
var lastCountPeople = {
    deviceId: "",
    timestamp: 0
}

// remember how many times the buttons were pressed
var buttonAddPerson = 0;
var buttonRemovePerson = 0;
var buttonGetCountPeople = 0;

var peopleCount = 0;

function handleCountPeople(event) {
        // read variables from the event
        let ev = JSON.parse(event.data);
        let evData = ev.data; // the data from the argon event: "addPerson"
        let evDeviceId = ev.coreid; // the device id
        let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event


        peopleCount++;

        let data = {
            message: peopleCount
        }

        sendData("peopleCount", data, evDeviceId, evTimestamp );
}


// react on the "addPerson" Event
function buttonAddPerson(event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "addPerson"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // the data we want to send to the clients
    let data = {
        message: evData, // just forward "addPerson"
    }
        // send data to all connected clients
        sendData("addPerson", data, evDeviceId, evTimestamp );

        // helper variables that we need to build the message to be sent to the clients
        let sync = false;
        let msg = "";
    
            buttonAddPerson.timestamp = evTimestamp;
            buttonAddPerson.deviceId = evDeviceId;
        } 


// react on the "buttonRemovePerson" Event
function buttonRemovePerson(event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "removePerson"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    let data = {
        message: evData, // just forward "person removed"
    }

    // send data to all connected clients
    sendData("removePerson", data, evDeviceId, evTimestamp );

    // helper variables that we need to build the message to be sent to the clients
    let sync = false;
        let msg = "";

    buttonRemovePerson.timestamp = evTimestamp;
    buttonRemovePerson.deviceId = evDeviceId;

}
// react on the "buttonGetCountPeople"
function buttonGetCountPeople(event){
    //read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "removePerson"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    let data = {
        message: evData, 
    }
    // send data to all connected clients
    sendData("getCountPeople", data, evDeviced, evTimestamp);

    // helper variables that we need to buled the message to be sent to the clients
    let sync = false;
    let msg = "";
    buttonGetCountPeople.timestamp = evTimestamp;
    buttonGetCountPeople.deviceId = evDeviceId;

}


// send data to the clients.
// You don't have to change this function
function sendData(evName, evData, evDeviceId, evTimestamp ) {
    
    // map device id to device nr
    let nr = exports.deviceIds.indexOf(evDeviceId)

    // the message that we send to the client
    let data = {
        eventName: evName,
        eventData: evData,
        deviceNumber: nr,
        timestamp: evTimestamp,
    };

    // send the data to all connected clients
    exports.sse.send(data)
}

exports.deviceIds = [];
exports.sse = null;

// export your own functions here as well
exports.handleButtonAddPerson = buttonAddPerson;
exports.handleButtonRemovePerson = buttonRemovePerson;
exports.handleButtonGetCountPeople = buttonGetCountPeople;
