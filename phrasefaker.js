const runnable = require('./runnable');

function handler_phraseFaker (me, message) {
    // first-order testing - does the phraseFaker work at all?
    me.send ("short phrase", true);
}

var signature = {
    name: "Phrase Faker",
    inputs: [{name: "go", structure: []}],
    outputs: [
	{ name: "short phrase", structure: [] },
	{ name: "long phrase", structure: ["condiments", "extras"] }
    ]
};

let protoImplementation = {
    name: "Phrase Faker",
    kind: "leaf",
    handler: handler_phraseFaker,
    begin: function () {},
    finish: function () {}
};

function PhraseFaker (container) {
    let me = new runnable.Leaf (signature, protoImplementation, container, signature.name);
    return me;
}

exports.PhraseFaker = PhraseFaker;
    
    
