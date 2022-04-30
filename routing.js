function route () {
    var _me = this;
    var _ret = null;

    _me.children.forEach (child => {
        child.runnable.outputQueue.forEach (output_message => {
            var message = output_message;
            var connection = this.find_connection_in__me (this, child, message.etag);
	    console.log (`routing '${this.name}' for child '${child.runnable.name}' on connection '${connection.net}'`);
            if (connection) {
                connection.receivers.forEach (dest => {
                    var params = [_me, dest, message];
                    if ((dest.name !== "_me")) {
                        deliver_to_child_input (params);
                    } else if ((dest.name === "_me")) {
                        deliver_to_me_output (params);
                    }
                });
            } else {
            };
        });
        child.runnable.resetOutputQueue ();
    });
    return _ret;
}

deliver_to_child_input = function ([_me, dest, message]) {
    var receiver = _me.lookupChild (dest.name);
    var input_message = new InputMessage (dest.etag, message.data,message.comefrom,receiver.name,message);
    receiver.enqueueInput (input_message);
}

deliver_to_me_output = function ([_me, dest, message]) {
    var output_message = new OutputMessage (dest.etag, message.data,message.comefrom,_me.name,message);
    _me.enqueueOutput (output_message);
}
