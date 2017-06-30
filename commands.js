var fs = require('fs');
var request = require('request');

var Client = require("node-rest-client").Client;

var client = new Client();

var cameraSynth = 5000; 
var delay = 9000; 

function getInfo() {
	client.get("http://192.168.1.1:80/osc/info", function (data, response) {
		console.log(data);
		var output = document.getElementById("output");
		output.style.display = "block";
		output.innerHTML = JSON.stringify(data);
	})
};

function startSession() {
	// console.log("hello world");
	var args = {
		data: { "name": "camera.startSession" },
		headers: { "Content-Type": "application/json" }
	};
	client.post("http://192.168.1.1:80/osc/commands/execute", args, function (data, response) {
		console.log(data);
	});

};

function setVersion() {
	var args = {
		data: {     
			"name": "camera.setOptions",
		    "parameters": {
		        "sessionId": "SID_0001",
		        "options": {
		            "clientVersion": 2 
			        }
			    }
	        }, 
		headers: { "Content-Type": "application/json" }
	};
	client.post("http://192.168.1.1:80/osc/commands/execute", args, function (data, response) {
		console.log(data);
	})
}

function getState() {
	var args = {
		data: { }, 
		headers: { }
	};
	client.post("http://192.168.1.1:80/osc/state", args, function (data, response) {
		console.log(data);
	});
};

function takePicture() {
	var args = {
		data: { "name": "camera.takePicture" }, 
		headers: { "Content-Type": "application/json" }
	};
	client.post("http://192.168.1.1:80/osc/commands/execute", args, function (data, response) {
		console.log(data);
	})
	var warning = document.getElementById("output");
	warning.innerHTML = ("Camera is synthesizing image...");
	setTimeout(
		function() {
			var output = document.getElementById("output");
			output.style.display = "none";

			var view = document.getElementById("downloadButton");
			if (view.style.display==="none") {
				view.style.display = "block";
			}
			else {
				view.style.display = "none";
			}

		}, cameraSynth);
}

function checkStatus() {
	var args = {
		data: { "stateFingerprint": "FIG_0003" },
		headers: { "Content-Type": "application/json" }
	};
	client.post("http://192.168.1.1:80/osc/checkForUpdates", args, function (data, response) {
		console.log(data);
	})
};

function getPicture() {
var lastImageUrl;
var args = {
  data: {
    "name": "camera.listFiles",
    "parameters": {
      "fileType": "image",
      "entryCount": 1,
      "maxThumbSize": 0
    }
  },
  headers: {"Content-Type": "application/json"}
}
client.post("http://192.168.1.1/osc/commands/execute", args, function (data, response) {
 lastImageUrl = data.results.entries[0].fileUrl;
   var download = function(uri, filename, callback){
request.head(uri, function(err, res, body){
console.log(data);
 // console.log('content-type:', res.headers['content-type']);
 // console.log('content-length:', res.headers['content-length']);

request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
});
};
console.log(lastImageUrl);
// download('http://192.168.1.1/files/744a605553442020024b0202cb00f201/100RICOH/R0012006.JPG', '360_images/lastFile.jpg', function(){
download(lastImageUrl, '360_images/lastFile.jpg', function(){

});
});
var warning = document.getElementById("output");
warning.style.display = "block";
warning.innerHTML = ("WAIT! Computer is downloading picture from camera.");
setTimeout(
	function() {
		var output = document.getElementById("output");
		output.style.display = "none";
	}, delay);
}

function reloadPage() { 
	setTimeout(
		function hideButton() {
			var view = document.getElementById("reloadButton");
			if (view.style.display==="none") {
				view.style.display = "block";
			}
			else {
				view.style.display = "none";
			}

		//	history.go(0)
		}, delay);
};


