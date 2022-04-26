const handling = require('./handling');
const deliver = require('./containerDeliver');
const routing = require('./routing');
const runnable = require('./runnable');


const phraseparser = require ('./phraseparser');

var signature = {
    name: "Order Taker",
    inputs: [
        { name: "phrase", structure: ["phrase"] }
    ],
    outputs: [
        { name: "food order", structure: ["food order"] }
    ]
};

function begin (me) {
}

function finish (me) {
}

var protoImplementation = {
    name: "Order Taker",
    kind: "container",
    handler: handling.deliverInputMessageToAllChildrenOfSelf,
    route: routing.route,
    begin: begin,
    finish: finish
}       

    
function makeChildren (me) {
    var child1 = new phraseparser.PhraseParser(me);
    return [
        {"name": "phrase parser", "runnable": child1}
    ];
}

function makeNets (me) {
    return [
        {"name":"⇒₁","locks":["phrase parser"]},
        {"name":"⇒₂","locks":["_me"]}, // subject to change: this only locks the ouput queue of the container
        {"name":"⇒₃","locks":["_me"]}, // subject to change (as above)
    ];
}


function makeConnections (me) {
    return [
        {"sender":{"name":"_me","etag":"phrase"},
         "net":"⇒₁",
         "receivers": [{"name":"phrase parser","etag":"phrase"}]
        },                 
        {"sender":{"name":"phrase parser","etag":"order no choices"},
         "net":"⇒₂",
         "receivers": [{"name":"_me","etag":"food order"}]
        },
        {"sender":{"name":"phrase parser","etag":"order with choices"},
         "net":"⇒₃",
         "receivers": [{"name":"_me","etag":"food order"}]
        }
    ];
}

function OrderTaker (container) {
    let me = new runnable.Container (signature, protoImplementation, container);
    me.children = makeChildren (container);
    me.nets = makeNets (container);
    me.connections = makeConnections (container);
    me.deliver_input_from_container_input_to_child_input = deliver.deliver_input_from_container_input_to_child_input;
    me.deliver_input_from_container_input_to_me_output = deliver.deliver_input_from_container_input_to_me_output;
    return me;
}

exports.OrderTaker = OrderTaker;
