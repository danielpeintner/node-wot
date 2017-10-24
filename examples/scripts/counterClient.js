var targetUri = "http://localhost:8080/counter";
var targetUriProperties = "http://localhost:8080/counter/properties";
var counterUri = "http://localhost:8080/counter/properties/count";
WoT.consume(targetUri).then(function(thing) {
	thing.getProperty("count").then(function(count){
		console.log("count value is ", count);
		/*
		count++;
		console.log("set value to " + count);
		thing.setProperty("count", count).then(function(count){
			console.log("count value set to ", count);
		});
		*/
    });
	
	thing.invokeAction("increment");
});