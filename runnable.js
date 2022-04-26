function send (etag, v, who, tracer) {
    let m = new OutputMessage (etag, v, who, "?", tracer); // Send knows who the sender is, but doesn't yet know who the receiver is
    this.outputQueue.enqueue (m);
}

function inject (etag, v, tracer) {
    let m = new InputMessageNoTrace (etag, v, ".", undefined);
    this.inputQueue.enqueue (m);
}

function Runnable (signature, protoImplementation, container, name) {
    this.name = name;
    this.signature = signature;
    this.protoImplementation = protoImplementation;
    this.container = container;
    this.inputQueue = new Queue ();
    this.outputQueue = new Queue ();
    this.send = send;
    this.inject = inject;
    this.handler = protoImplementation.handler;
    this.hasOutputs = function () {return !this.outputQueue.empty ()};
    this.has_children = function () {return (0 < this.children.length); };
    this.dequeueOutput = function () {return this.outputQueue.dequeue ();};
    this.enqueueInput = function (m) { m.target = this.name; this.inputQueue.enqueue (m); };
    this.enqueueOutput = function (m) { m.target = this.name; this.outputQueue.enqueue (m); };
    this.resetOutputQueue = function () {
        this.outputQueue = new Queue ();
    }
    this.errorUnhandledMessage = function (message) {
	console.error (`unhandled message in ${this.name} ${message.tag}`);
	process.exit (1);
    };
    this.panic = function () { throw "panic"; }
}

function Leaf (signature, protoImplementation, container, name) {
    let me = new Runnable (signature, protoImplementation, container, name);
    me.conclude = container.conclude;
    me.route = function () { };
    me.children = [];
    me.connections = [];
    me.step = function () {
        // Leaf has no children, so it always looks at it own input
        if (! this.inputQueue.empty ()) {
            let m = this.inputQueue.dequeue ();
            this.handler (this, m);
            return this.hasOutputs ();
        } else {
            return false;
        }
    }
    return me;
}

function Container (signature, protoImplementation, container, name) {
    let me = new Runnable (signature, protoImplementation, container, name);
    if (container) {
	me.conclude = container.conclude;
    } else {
	me._done = false;
	me.conclude = function () { 
            me.container._done = true; 
	};
	me.done = function () {return me._done;};
    }
    me.route = route;
    me.step = function () {
        // Container tries to step all children,
        // if no child was busy, then Container looks at its own input
        var workFunction = steprecursively.Try_component ();
        var workPerformed = workFunction (this);
        if (! workPerformed) {
	    return this.run_self ();
        } else {
            return false;
        }
    },
    me.run_self = function () {
        if (! this.inputQueue.empty ()) {
            let m = this.inputQueue.dequeue ();
            this.handler (this, m);
            return this.hasOutputs ();
	} else {
	    return false;
	}
    },
    me.step_each_child = function () {
        this.children.forEach (childobject => {
            childobject.runnable.step ();
        });
    };
    me.child_produced_output = function () {
        return this.children.some (childobject => {
            return childobject.runnable.hasOutputs ();
        });
    };
    me.self_produced_output = function () { return (me.hasOutputs ()); };
    me.find_connection = find_connection;
    me.find_connection_in__me = function (_me, child, etag) {
	return find_connection_in__me (this, child.name, etag);
    };
    me.lookupChild = function (name) {
	var _ret = null;
	this.children.forEach (childobj => {
	    if (childobj.name === name) {
		_ret = childobj.runnable;
	    }
	});
	if (_ret === null) {
	    console.error (`child ${name} not found in ${this.name}`);
	    process.exit (1);
	};
	return _ret;
    }
    handler = deliverInputMessageToAllChildrenOfSelf,
    route = route,
    begin = function () {};
    finish = function () {};
    return me;
}




