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

    
function tb_makeChildren (me) {
    var child1 = new HTMLbutton(me, "html button");
    var child2 = new PhraseFaker(me, "phrase faker");
    var child3 = new OrderTaker(me,  "order taker");
    return [
        {name: "html button", runnable: child1},
        {name: "phrase faker", runnable: child2},
        {name: "order taker", runnable: child3}
    ];
}

function tb_makeNets (me) {
    return [
        {"name":"⇒₁","locks":["phrase faker"]},
        {"name":"⇒₂","locks":["order taker"]},
        {"name":"⇒₃","locks":["order taker"]},
        {"name":"⇒₄","locks":["_me"]}
    ];
}


function tb_makeConnections (me) {
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
    tb.children = tb_makeChildren (tb);
    tb.nets = tb_makeNets (tb);
    tb.connections = tb_makeConnections (tb);
    tb.deliver_input_from_container_input_to_child_input = deliver_input_from_container_input_to_child_input;
    tb.deliver_input_from_container_input_to_me_output = deliver_input_from_container_input_to_me_output;
    return tb;
}
