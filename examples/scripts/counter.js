//just an example script - to be moved into other repo
const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";

WoT.expose({name: "counter", url: "", description : {}})
    .then(function(thing) {
        console.log("created " + thing.name);

        thing
        .addProperty( {name : NAME_PROPERTY_COUNT, value : 5})
		/*
        .onUpdateProperty(function(request) {
			console.log("request = " + request);
			// console.log(NAME_PROPERTY_COUNT + ": " + oldValue + " -> " + newValue);
			// var message = (oldValue < newValue)? "increased" : "decreased";
			console.log("Update " + request.name + " to " + request.data);
        })
		*/
		;

		
		
        thing
        .addAction({name : NAME_ACTION_INCREMENT})
		.addAction({name : NAME_ACTION_DECREMENT})
        .onInvokeAction((request) => {
			if(request.name == NAME_ACTION_INCREMENT) {
				console.log("InvokeAction Handler for " + request.name);
				// let value = request.data + 1;
				thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
					let newCount = count+1;
					console.log("incrementing counter to " + newCount);
					thing.setProperty(NAME_PROPERTY_COUNT, newCount);
					return newCount;
				});
			} else if(request.name == NAME_ACTION_DECREMENT) {
				console.log("InvokeAction Handler for " + request.name);
				let value = request.data - 1;
				console.log("decrementing counter to " + value);
				thing.setProperty(NAME_PROPERTY_COUNT, value);
				return value;
			} else {
				console.error("No invokeAction Handler found for " + request.name);
				return null;
			}
        });

		/*
        thing
        .addAction({name : NAME_ACTION_DECREMENT})
        .onInvokeAction({"request" : {name : NAME_ACTION_DECREMENT},
            "callback" : () => {
                console.log("decrementing counter");
                return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
                    let value = count - 1;
                    thing.setProperty(NAME_PROPERTY_COUNT, value);
                    return value;
                })
        }});
		*/
		
		thing.start();
    });
