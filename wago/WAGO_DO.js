module.exports = function(RED) {
	"use strict";

	function digitalOutput(n) {
		RED.nodes.createNode(this,n);
		var context = this.context();
		var node = this;
		var bitOffset = n.offset;
		var name = n.name;
		var topic = n.topic;

		this.on('input', function(msg) {
			if (/^([0-9]|1[0-5])$/.test(msg.topic)) {
				var _bitPosition = parseInt(msg.topic, 10);
				var _bitValue = msg.payload ? 1 : 0;
				var _object = [];
				// get the context value
				var _payload = context.get('data') || 0;
				// clear the right bit in the output payload
				_payload = _payload & ~(1 << _bitPosition);
				// copy the receive bit in the output payload
				_payload = _payload | (_bitValue << _bitPosition);
				// store the context value back
				context.set('data', _payload);
				// shit the payload to match the bif offset
				_payload = _payload << bitOffset;
				_object = {topic:topic,payload:_payload};
				node.send(_object);
			} else {
				node.error("invalid msg topic (must be number between 0 and 15): " + msg.topic);
			}
		});
		node.status({fill: "green",shape: "ring", text: "16 digital outputs"});
	}
	RED.nodes.registerType("Digital Output",digitalOutput);
};
