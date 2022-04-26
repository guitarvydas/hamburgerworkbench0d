const runnable = require('./runnable');

function handler_phraseFaker (me, message) {
    // first-order testing - does the phraseFaker work at all?
    me.send ("short phrase", true);
}

      var phraseParser = new Leaf ();
      phraseParser.name = "Phrase Parser";
      phraseParser.inputs = ["phrase"];
      phraseParser.outputs = ["order no choices", "order with choices"];
      phraseParser.handler  = handler_phraseParser;


var signature = {
    name: "Phrase Parser",
    inputs: [{name: "phrase", structure: ["phrase"]}],
    outputs: [
	{ name: "order no choices", structure: [] },
	{ name: "order with choices", structure: ["condiments", "extras"] }
    ]
};

let protoImplementation = {
    name: "Phrase Parser",
    kind: "leaf",
    handler: handler_phraseParser,
    begin: function () {},
    finish: function () {}
};

function PhraseParser (container) {
    let me = new runnable.Leaf (signature, protoImplementation, container, signature.name);
    return me;
}

exports.PhraseFaker = PhraseFaker;
    
    
