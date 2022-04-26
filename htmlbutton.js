const runnable = require('./runnable');

function handler_HTMLbutton (me, message) {
    me.send ("click", true);
    me.container.wakeup ();
}

var signature = {
    name: "HTMLbutton",
    inputs: [],
    outputs: [
	{ "name": "click", "structure": [] }
    ]
};

let protoImplementation = {
    name: "HTMLbutton",
    kind: "leaf",
    handler: handler_HTMLbutton,
    begin: function () {},
    finish: function () {}
};

function HTMLbutton (container) {
    let me = new runnable.Leaf (signature, protoImplementation, container, signature.name);
    return me;
}

exports.HTMLbutton = HTMLbutton;
    
    
