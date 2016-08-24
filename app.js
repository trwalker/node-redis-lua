'use strict'

const records = 100;

var redis = require('redis');

var redisClient = redis.createClient({
	host: '192.168.99.100',
	port: '6379'
});

processSetCommands(() => { 
	processGetCommands(); 
});

function processSetCommands(callback) {
	var setCount = 0;


	let luaSet = `for i = 0, ${records} do
		redis.call("SET", string.format("namespace.key.%d", i), string.format("value.%d", i))
	end`;

	redisClient.eval(luaSet, 0, function(err, res) {
		if (err) {
			console.log(`LUA SET Error: ${err}`);	
		}
		
		callback();
	});
}

function processGetCommands() {
	
	let luaGet = `local keys = {}
		for i = 0, ${records} do
			keys[i+1] = redis.call("GET", string.format("namespace.key.%d", i)); 
		end

		return keys`;

	redisClient.eval(luaGet, 0, function(err, res) {
		if (err) {
			console.log(`LUA GET Error: ${err}`);	
		}

		console.log(res);
	});
}
