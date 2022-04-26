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
    handler: deliverInputMessageToAllChildrenOfSelf,
    route: route,
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
        },
        {"sender":{"name":"phrase faker","etag":"long phrase"},
         "net":"⇒₃",
         "receivers": [{"name":"order taker","etag":"phrase"}]
        },
        {"sender":{"name":"order taker","etag":"food order"},
         "net":"⇒₄",
         "receivers": [{"name":"_me","etag":"food order"}]
        }
    ];
}

function TestBench () {
    let tb = new Container (signature, protoImplementation, null);
    tb.children = makeChildren (tb);
    tb.nets = makeNets (tb);
    tb.connections = makeConnections (tb);
    tb.deliver_input_from_container_input_to_child_input = deliver.deliver_input_from_container_input_to_child_input;
    tb.deliver_input_from_container_input_to_me_output = deliver.deliver_input_from_container_input_to_me_output;
    return tb;
}
