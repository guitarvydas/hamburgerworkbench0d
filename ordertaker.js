var OrderTaker_signature = {
    name: "Order Taker",
    inputs: [
        { name: "phrase", structure: ["phrase"] }
    ],
    outputs: [
        { name: "food order", structure: ["food order"] }
    ]
};

var OrderTaker_protoImplementation = {
    name: "Order Taker",
    kind: "container",
}       

    
function makeChildren (me) {
    var child1 = new PhraseParser(me);
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
    let me = new Container (signature, OrderTaker_protoImplementation, container);
    me.children = makeChildren (container);
    me.nets = makeNets (container);
    me.connections = makeConnections (container);
    me.deliver_input_from_container_input_to_child_input = deliver.deliver_input_from_container_input_to_child_input;
    me.deliver_input_from_container_input_to_me_output = deliver.deliver_input_from_container_input_to_me_output;
    return me;
}
