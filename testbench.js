const handling = require('./handling');
const deliver = require('./containerDeliver');
const routing = require('./routing');
const runnable = require('./runnable');


const htmlbutton = require ('./htmlbutton');
const phrasefaker = require ('./phrasefaker');
const ordertaker = require ('./ordertaker');

var signature = {
    name: "Test Bench",
    inputs: [],
    outputs: [
        { name: "food order", structure: ["food order"] }
    ]
};

function begin (me) {
}

function finish (me) {
}

var protoImplementation = {
    name: "Test Bench",
    kind: "container",
    handler: handling.deliverInputMessageToAllChildrenOfSelf,
    route: routing.route,
    begin: begin,
    finish: finish
}       

    
function makeChildren (me) {
    var child1 = new htmlbutton.HTMLbutton(me);
    var child2 = new phrasefaker.PhraseFaker(me);
    var child3 = new ordertaker.OrderTaker(me);
    return [
        {name: "html button", runnable: child1},
        {name: "phrase faker", runnable: child2},
        {name: "phrase parser", runnable: child3}
    ];
}

function makeNets (me) {
    return [
        {"name":"⇒₁","locks":["phrase faker"]},
        {"name":"⇒₂","locks":["order taker"]},
        {"name":"⇒₃","locks":["order taker"]},
        {"name":"⇒₄","locks":["_me"]}
    ];
}


function makeConnections (me) {
    return [
        {"sender":{"name":"html button","etag":"click"},
         "net":"⇒₁",
         "receivers": [{"name":"phrase faker","etag":"phrase"}]
        },                 
        {"sender":{"name":"phrase faker","etag":"short phrase"},
         "net":"⇒₂",
         "receivers": [{"name":"order taker","etag":"phrase"}]
        }
        {"sender":{"name":"phrase faker","etag":"long phrase"},
         "net":"⇒₃",
         "receivers": [{"name":"order taker","etag":"phrase"}]
        }
        {"sender":{"name":"order taker","etag":"food order"},
         "net":"⇒₄",
         "receivers": [{"name":"_me","etag":"food order"}]
        }
    ];
}

function TestBench (container) {
    let me = new runnable.Container (signature, protoImplementation, container);
    me.children = makeChildren (container);
    me.nets = makeNets (container);
    me.connections = makeConnections (container);
    me.deliver_input_from_container_input_to_child_input = deliver.deliver_input_from_container_input_to_child_input;
    me.deliver_input_from_container_input_to_me_output = deliver.deliver_input_from_container_input_to_me_output;
    return me;
}

exports.TestBench = TestBench;


