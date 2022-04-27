function send (etag, v, who, tracer) {
    let m = new OutputMessage (etag, v, who, "?", tracer); // Send knows who the sender is, but doesn't yet know who the receiver is
    this.outputQueue.enqueue (m);
}

function inject (etag, v, tracer) {
    let m = new InputMessage (etag, v, ".", undefined);
    this.inputQueue.enqueue (m);
}

function Runnable (signature, protoImplementation, container, instancename) {
    if (instancename) {
	this.name = instancename;
    } else {
	this.name = signature.name;
    }
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
    this.activated = false;
    this.begin = function () {};
    this.finish = function () {};
    this.resetOutputQueue = function () {
        this.outputQueue = new Queue ();
    }
    this.errorUnhandledMessage = function (message) {
	console.error (`unhandled message in ${this.name} ${message.tag}`);
	process.exit (1);
    };
    if (container) {
	this.conclude = container.conclude;
    }
    this.panic = function () { throw "panic"; }
}

function Leaf (signature, protoImplementation, container, instancename) {
    let me = new Runnable (signature, protoImplementation, container, instancename);
    me.route = function () { };
    me.children = [];
    me.connections = [];
    me.step = function () {
        // Leaf has no children, so it always looks at it own input
        if (! this.inputQueue.empty ()) {
            let m = this.inputQueue.dequeue ();
            this.handler (this, m);
	    this.activated = true;
            return this.activated
        } else {
	    this.activated = false;
            return this.activated
        }
    }
    me.wasActivated = function () {
	return this.activated;
    }
    me.wakeup = function () { throw "internal error: Leaf received wakeup (this should never happen)"};
    return me;
}

function Container (signature, protoImplementation, container, instancename) {
    let me = new Runnable (signature, protoImplementation, container, instancename);
    me.route = route;
    me.step = function () {
        // Container tries to step all children,
        // if no child was busy, then Container looks at its own input
	// (logic written in step.drawio -> step.drakon -> step.js ; step returns
	//  a stepper function, which must be called with this)
        var stepperFunction = Try_component ();
        var workPerformed = stepperFunction (this);
        if (! workPerformed) {
	    return this.run_self ();
        } else {
            return false;
        }
    };
    me.run_self = function () {
        if (! this.inputQueue.empty ()) {
            let m = this.inputQueue.dequeue ();
            this.handler (this, m);
	    this.activated = true;
            return this.activated;
	} else {
	    this.activated = this.child_wasActivated (); 
	    return this.activated;
	}
    };
    me.step_each_child = function () {
        this.children.forEach (childobject => {
            childobject.runnable.step ();
        });
    };
    me.child_wasActivated = function () {
        return this.children.some (childobject => {
	    var c = childobject;
	    var cr = childobject.runnable;
            var r = cr.wasActivated (); // to appease debugger
	    return r;
        });
    };
    me.self_wasActivated = function () { return this.activated; };
    me.wasActivated = me.self_wasActivated;
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
    if (protoImplementation.begin) {
	me.begin = protoImplementation.begin;
    }
    if (protoImplementation.finish) {
        me.finish = protoImplementation.finish;
    }

    me._done = false;
    me.conclude = function () { 
        this.container._done = true; 
    };
    me.done = function () {return this._done;};
    me.resetdone = function () {this._done = false;}
    me.wakeup = function () {
	if (this.container) {
	    this.route ();
	    this.container.wakeup (); // keep punting upwards until at top
	} else {
	    this.resetdone ();
	    this.step ();
	    this.route ();
	    while (this.activated && (!this.done ())) {
		this.resetdone ();
		this.step ();
		this.route ();
	    }
	}
	console.log ('done');
    }
    return me;
}


