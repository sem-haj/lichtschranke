var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
       // buttonState_0: "unknown", // the state of the button on device 0
       // buttonState_1: "unknown", // the state of the button on device 1
       // buttonPressCounter: 0,    // how many times the buttons were pressed
       // buttonsSync: false,       // true if the buttons were pressed within 1 second
       // blinking_0: false,        // true if device 0 is blinking.
        //blinking_1: false,        // true if device 0 is blinking.
        // add your own variables here ...
        countPeople: 0, // counts the people in the rooms
        countPeople_0: 0,
        countPeople_1: 0,
        
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
    },
    methods: {
        // Initialise the Event Stream (Server Sent Events)
        // You don't have to change this function
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = rootUrl + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    this.updateVariables(JSON.parse(event.data));
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },
        // react on events: update the variables to be displayed
        updateVariables(ev) {
            if (ev.eventName === "buttonAddPerson") {
                this.countPeople = ev.eventData.counter;
                if (ev.eventData.message === "A Person came in") {
                    this.countPeople = countPeople++;
                }
            }
            // Event "buttonRemovePerson"
            else if (ev.eventName === "buttonRemovePerson") {
                this.countPeople = ev.eventData.counter;
                if (ev.eventData.message === "A person left") {
                    if (ev.deviceNumber === 0 &countPeople_0--) {
                        this.empty_0 = true;
                    }
                    else if (ev.deviceNumber === 1 &countPeople_1 === 0) {
                        this.empty_1 = true;
                    }
                }
                if (ev.eventData.message === "not empty") {
                    if (ev.deviceNumber === 0) {
                        this.empty_0 = false;
                    }
                    else if (ev.deviceNumber === 1) {
                        this.empty_1 = false;
                    }
                }
            }
        },
        // call the function "addPerson" in your backend
        addPerson: function (nr) {
            axios.post(rootUrl + "/api/device/" + nr + "/function/addPerson")
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    alert("Could not call the function 'addPerson' of device number " + nr + ".\n\n" + error)
                })
        },
         // call the function "removePerson" in your backend
         removePerson: function (nr) {
            axios.post(rootUrl + "/api/device/" + nr + "/function/removePerson")
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    alert("Could not call the function 'addPerson' of device number " + nr + ".\n\n" + error)
                })
        },
        // get the value of the variable "countPeople" on the device with number "nr" from your backend
        getCountPeople: function (nr) {
            axios.get(rootUrl + "/api/device/" + nr + "/variable/countPeople")
                .then(response => {
                    // Handle the response from the server
                    var countPeople = response.data.result;
                    console.log(response.data);
                    if (nr === 0) {
                        this.countPeople_0 = countPeople;
                        this.countPeople = this.countPeople_0 + this.countPeople_1;
                    }
                    else if (nr === 1) {
                        this.countPeople_1 = countPeople;
                        this.countPeople = this.countPeople_0 + this.countPeople_1;
                    }
                    else {
                        console.log("unknown device number: " + nr);
                    }
                })
                .catch(error => {
                    alert("Could not read the button state of device number " + nr + ".\n\n" + error)
                })
        }
    }

})
