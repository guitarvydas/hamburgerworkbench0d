function InputMessage (etag, v, who, target, tracer) {
    this.etag = etag;
    this.data = v;
    this.tracer = tracer;
    this.comefrom = who;
    this.target = target;
    this.kind = "i";
}

function OutputMessage (etag, v, who, target, tracer) {
    this.etag = etag;
    this.data = v;
    this.tracer = tracer;
    this.comefrom = who;
    this.target = target;
    this.kind = "o";
}
