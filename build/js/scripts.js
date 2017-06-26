var status_check_timer_initial_value = 15,
		status_check_timer = status_check_timer_initial_value;
var check_status_text = 'Check status';

function checkStatus() {
	status_check_timer = status_check_timer_initial_value;

	console.log("checking status");
  	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'CheckStatus', []);
}
function updateTimer() {
	if(status_check_timer < 0) {
		checkStatus();
	}

	var text = check_status_text + ' (' + status_check_timer + ')';
	document.getElementById('checkStatus').textContent = text;

	status_check_timer--;
}

function currentSend() {
	if (document.getElementById('option-1').checked) {
   		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetChargeCurrent100', []);
	}
	if (document.getElementById('option-2').checked) {
   		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetChargeCurrent250', []);
	}
}

document.addEventListener('NexpaqAPIReady', function(event) {        
  Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
    // we don't care about data not related to our module
    if(event.module_uuid != Nexpaq.Arguments[0]) return;
	if(event.data_source == 'StateChangeResponse' || event.data_source == 'ChargeChangeResponse') {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'CheckStatus', []);
	} else if(event.data_source == 'BatteryStateResponse') {
		document.getElementById('batteryState').textContent = event.variables.status;
		document.getElementById('batteryVoltage').textContent = event.variables.voltage;
		document.getElementById('batteryPercentage').textContent = event.variables.percentage;
	}
  });

  checkStatus();  
}); 

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
	Nexpaq.Header.create('#Battery');

	document.getElementById('checkStatus').addEventListener('click', function() {
   		checkStatus();
	});
	setInterval(updateTimer, 1000);

	document.getElementById('Current').addEventListener('click', function() {
		currentSend();
	});

	document.getElementById('Standby').addEventListener('click', function() {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetStandby', []);
	});

	document.getElementById('Charge').addEventListener('click', function() {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetCharge', []);
	});

	document.getElementById('Discharge').addEventListener('click', function() {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetDischarge', []);
	});

	document.getElementById('Shutdown').addEventListener('click', function() {
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'SetShutdown', [0]);
	});
});
