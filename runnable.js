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
    this.outputs = function () { return this.outputQueue.toArray (); };
    this.send = send;
    this.inject = inject;
    this.handler = protoImplementation.handler;
    this.hasOutputs = function () {return !this.outputQueue.empty ()};
    this.hasInputs = function () {return !this.inputQueue.empty ()};
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
	console.log(`step begin ${this.name}`);
        // Leaf has no children, so it always looks at it own input
        if (! this.inputQueue.empty ()) {
            let m = this.inputQueue.dequeue ();
            this.handler (this, m);
	    this.activated = true;
	    console.log(`step ${this.name} activated ${this.activated}`);
            return this.activated
        } else {
	    this.activated = false;
	    console.log(`step ${this.name} activated ${this.activated}`);
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
	console.log(`step begin ${this.name}`);
        // Container tries to step all children,
        // if no child was busy, then Container looks at its own input
	// (logic written in step.drawio -> step.drakon -> step.js ; step returns
	//  a stepper function, which must be called with this)
        var stepperFunction = Try_component ();
        this.activated = stepperFunction (this);
	console.log(`stepped ${this.name} activated ${this.activated}`);
        if (this.activated === true) {
	    this.activated = this.run_self ();
	    return this.activated;
        } else if (this.activated === false) {
            return false;
        } else {
	    throw 'internal error Container.step is undefined';
	}
    };
    me.run_self = function () {
	console.log(`run_self begin ${this.name}`);
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
	console.log(`step_each_child begin ${this.name}`);
        this.children.forEach (childobject => {
	    console.log(`step_each_child ${this.name} tries ${childobject.runnable.name}`);
            childobject.runnable.step ();
        });
	console.log(`step_each_child finish ${this.name}`);
    };
    me.child_wasActivated = function () {
        var a = this.children.some (childobject => {
	    var c = childobject;
	    var cr = childobject.runnable;
            var r = cr.wasActivated (); // to appease debugger
	    console.log (`child ${cr.name} activated  ${r}`);
	    return r;
        });
	console.log(`child_was_activated ${this.name} ${a}`);
	return a;
    };

    me.anyChildHasInput = function () {
	var i = this.children.some (childobject => {
	    var r = childobject.runnable.hasInputs ();
	    return r;
	});
	return i;
    };
    
    me.wasActivated = function () {
	var a = this.activated  ||
	    this.anyChildHasInput () ||
	    this.child_wasActivated ();
	this.activated = a;
	return  a;
    };
    
    me.self_wasActivated = me.wasActivated;

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
	  console.log (`wake up begin ${this.name}`);
	if (this.container) {
	    this.route ();
	    this.container.wakeup (); // keep punting upwards until at top
	} else {
	  console.log (`wake up 1 ${this.name}`);
	    this.resetdone ();
	  console.log (`wake up 2 ${this.name}`);
	    // this.step ();
	  console.log (`wake up 3 ${this.name}`);
	    this.route ();
	  console.log (`wake up 4 ${this.name} wasActivated ${this.wasActivated ()}`);
	    while (this.wasActivated  () && (!this.done ())) {
	  console.log (`wake up 5 ${this.name}`);
		this.resetdone ();
	  console.log (`wake up 6 ${this.name}`);
		this.step ();
	  console.log (`wake up 7 ${this.name}`);
		this.route ();
	  console.log (`wake up 8 ${this.name}`);
	    }
	  console.log (`wake up 9 ${this.name}`);
	}
	console.log ('done');
    }
    return me;
}


