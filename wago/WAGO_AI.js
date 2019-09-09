module.exports = function(RED) {
    "use strict";

    function analogInput(n) {
		RED.nodes.createNode(this,n);
		//var context = this.context();
		var node = this;
		var module = n.module;
		var signal = n.signal;
		var resolution = n.resolution;
		var outputData = n.outputData;
		var outputPrecision = n.outputPrecision;
        var rawlLow = n.rawlLow;
		var rawlHigh = n.rawlHigh;
        var signalLow = n.signalLow;
		var signalHigh = n.signalHigh;
		var sensorLow = n.sensorLow;
		var sensorHigh = n.sensorHigh;
		var name = n.name;
		var topic = n.topic;
		
		
		var sensorType = n.sensorType;
		var resolution = n.resolution;
		var low = n.low;
		var high = n.high;
		var prec = n.outputPrecision;
		var selectedProcess = n.selectedProcess;

		// scales number
		function scale(x, xA, yA, xB, yB) {
			// find the slope m
			var m = (yB - yA) / (xB - xA);
			// find the intercept p
			var p = yA - (m * xA);
			// calculate the y
            var y = (m * x) + p;

            return(y);
        }
		
		// limit number
        function limit(x_lo, x, x_hi) {
            var last = 0;
            if (x < x_lo) {
                return(x_lo);
            } else {
                if (x > i_hi) {
                    return(x_hi);
                } else {
                    return(x);
                }
            }
        }
		
		function toFixed(num, precision) {
			return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
        }
		
		function toSigned(num, size, complement) {
			var mask = 0x8000;
			var sub = 0x10000;
			
			switch(size){
				case 4:
					mask = 0x8;
					sub = 0x10;
					break;
				case 8:
					mask = 0x80;
					sub = 0x100;
					break;
				case 12:
					mask = 0x800;
					sub = 0x1000;
					break;
				case 16:
					mask = 0x8000;
					sub = 0x10000;
					break;
				case 20:
					mask = 0x80000;
					sub = 0x100000;
					break;
				case 24:
					mask = 0x800000;
					sub = 0x1000000;
					break;
				case 28:
					mask = 0x8000000;
					sub = 0x10000000;
					break;
				case 32:
					mask = 0x80000000;
					sub = 0x100000000;
					break;
			}
			
			if ((num & mask) !== 0) {
				if (complement !== 0) {
					num = num - sub;
				} else {
					num = (num & ~mask) * -1;
				}
			}
			return num;
        }
		
//	750-452,			2-channel,	0 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow
//	750-453,			4-channel,	0 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) Bit 0, 1 = overflow
//	750-454,			2-channel,	4 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow, bit 1 = short circuit
//	750-455,			4-channel,	4 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0, 1 = overflow
//	750-456,			2-channel,	± 10 V DC,		13bit,	0x8000(−32768) - 0x7FF8(32760) (3first bit out) bit 0 = overflow
//	750-457,			4-channel,	± 10 V DC,		13bit,	0x8000(−32768) - 0x7FF8(32760) (3first bit out) bit 0 = overflow
//	750-459,			4-channel,	0 - 10 V DC,	12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) Bit 0, 1 = overflow

//	750-465,			2-channel,	0 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow
//	750-466,			2-channel,	4 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow, bit 1 = short circuit
//	750-467,			2-channel,	0 - 10 V DC,	12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow
//	750-468,			4-channel,	0 - 10 V DC,	12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow

//	750-470,			2-channel,	0 - 20 mA,		12bit,	0x0000(0) - 20480 (3first bit out) bit 0 = overflow, bit 2 = short circuit
//	750-471,			4-Channel,	0/4 - 20 mA ; -10/0 - 10 V DC	
//	750-472,			2-channel,	0 - 20 mA,		15bit,	0x0000(0) - 0x7FFF(32767)
//	750-473,			2-channel,	4 - 20 mA,		12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) bit 0 = overflow, bit 1 = short circuit
//	750-474,			2-channel,	4 - 20 mA,		15bit,	0x0000(0) - 0x7FFF(32767)
//	750-475,			2-channel,	0 - 1 A,		15bit,	0x0000(0) - 10000
//	750-475/020-000,	2-channel,	0 - 5 A,		15bit,	0x0000(0) - 27306
//	750-476,			2-channel,	± 10 V DC,		16bit,	0x8000(-32768) - 0x7FFF(32767)
//	750-477,			2-channel,	0 - 10 V AC/DC,	15bit,	0x0000(0) - 0x2710
//	750-478,			2-channel,	0 - 10 V DC,	15bit,	0x0000(0) - 0x7FFF(32767)
//	750-479,			2-channel,	± 10 V DC,		14bit,	0x8000(−32768) - 0x7FFC(32764) (2first bit out) bit 0 = overflow

//	750-480,			2-channel,	0 - 20 mA,		13bit,	0x0000(0) - 0x7FFC(32764) (2first bit out) Bit 0, 1 = overflow
//	750-482,			2-channel,	4 - 20 mA,		13bit,	0x0000(0) - 0x7FFC(32764) (2first bit out) Bit 0 = overflow, bit 1 = short circuit
//	750-483,			2-channel,	0 - 30 V DC,	14bit,	0x0000(0) - 0x7FFE(32766) (1first bit out)

//	750-492,			2-channel,	4 - 20 mA,		13bit,	0x0000(0) - 0x7FFC(32764) (2first bit out) Bit 0 = overflow, bit 1 = short circuit
//	750-496,			8-channel,	0/4 - 20 mA,	12bit,	0x0000(0) - 0x7FF8(32760) (3first bit out) Bit 0, 1 = overflow
//	750-497,			8-channel,	-10/0 - 10 V DC	13bit,	0xFFF8(−32760) - 0x7FF8(32760) / 0x8000(−32768) - 0x7FF8(32760)(3first bit out) bit 0 = overflow

        this.on('input', function(msg) {
            var rawInput = parseInt(msg.payload);
            var rawMinInput = 0;
            var rawMaxInput = 0;
            var outputMsg = {};
            var actualSensorValue;
	        var val_10vdc = 0;
	        var val_int16 = 0;
	        var val_scaled = 0;

			switch(module) {
				case "750-450":
					break;
			}
            // set the max value
            switch(resolution) {
                case "12_Bit":
                    rawMaxInput = 32767;
                    break;
                case "13_Bit":
                    rawMaxInput = 32767;
                    break;
                case "13_Bit_signed":
                	rawMinInput = -32767;
                    rawMaxInput = 32767;
                    break;
                case "14_Bit":
                    rawMaxInput = 32767;
                    break;
                case "15_Bit":
                    rawMaxInput = 32767;
                    break;
                case "15_Bit_signed":
                	rawMinInput = -32767;
                    rawMaxInput = 32767;
                    break;
                case "16_Bit":
                    rawMaxInput = 65535;
                    break;
				default:
                    rawMaxInput = 65535;
                    break;
            }
            switch(sensorType)  {
                case "0-20mA":
                    actualSensorValue = scale(msg.payload, rawMinInput, rawMaxInput, 0, 20);
                    break;
                case "4-20mA":
                    actualSensorValue = scale(msg.payload, rawMinInput, rawMaxInput, 4, 20);
                    break;
                case "0-10VDC":
                    actualSensorValue = scale(msg.payload, rawMinInput, rawMaxInput, 0, 10);
                    break;
                case "+/-10VDC": // needs work
                	if (msg.payload <= 32767){
                		val_10vdc = scale(msg.payload, 0, rawMaxInput, 0, 10);
                		actualSensorValue = val_10vdc;	 
                		val_int16 = msg.payload;
                	} else {
	                	val_10vdc = (msg.payload << 1); 	
	                	val_10vdc = (val_10vdc >> 1); 
	                	val_10vdc = val_10vdc * -1;	
	                    val_int16 = val_10vdc + 32767; 
	                    //val_10vdc = scale(val_10vdc, rawMinInput, rawMaxInput, -10, 0);  
	                    val_10vdc = scale(val_int16, rawMinInput, 0, -10, 0) + 10;  
                        actualSensorValue = val_10vdc;	                     
	                }
                    break;
                case "0-30VDC":
                    actualSensorValue = scale(msg.payload, rawMinInput, rawMaxInput, 0, 30);
                    break;
				default:
                    actualSensorValue = msg.payload;
                    break;
            }
            // operation based on processSelected
            switch(selectedProcess) {
                case "Raw":   
                	if (sensorType == "+/-10VDC"){
                		val_int16 = val_int16; // assigned above
                	} else {
 						val_int16 = msg.payload;
					}
					outputMsg.payload = val_int16;
                    break;
                case "SensorVal":
                    outputMsg.payload = parseFloat(toFixed(actualSensorValue, prec));
                    break;
                case "Scaled":
                	if (sensorType == "+/-10VDC"){
                    	var scaledHold = scale(val_10vdc+ 10, 0, 20, low, high);
                    } else {
                    	var scaledHold = scale(msg.payload, rawMinInput, rawMaxInput, low, high);
                    }
                    outputMsg.payload = parseFloat(toFixed(scaledHold, prec));
					break;
				default:
                    actualSensorValue = msg.payload;
                    break;
            }
            node.status({fill: "green",shape: "ring",text: sensorType + " analog input"});
            node.send(outputMsg);
        });
    }
    RED.nodes.registerType("Analog Input",analogInput);
};
