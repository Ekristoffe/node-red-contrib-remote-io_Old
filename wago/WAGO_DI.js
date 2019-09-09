module.exports = function(RED) {
	"use strict";

	function digitalInput(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		var bitSize = parseInt(n.outputs);
		var bitOffset = n.offset;
		var name = n.name;
		var topic = n.topic;

		this.on('input', function(msg) {
			var _data = msg.payload >>> bitOffset;
			var _object = [];
			var _bit = 0;
			var _mask = 0x0001 << (bitSize - 1);
			for (var i = 0; i < bitSize; i++) {
				// calculate the _bit number
				_bit = bitSize - (i + 1);
				// Test the _data & _mask and set corresponding payload
				_object[_bit] = {topic:(topic + "." + _bit),payload:((_data & _mask) ? true : false)};
				// divide by two and keep _data as an integer
				_data = _data << 1;
			}
			//o = m.reverse();
			node.send(_object);
		});
		node.status({fill: "green",shape: "ring",text: bitSize + " digital inputs"});
	}
	RED.nodes.registerType("Digital Input",digitalInput);
};
