
// function destructivelyPeekAllOutputs (me) {
//     me.children.forEach (child => {
//         var r = child.runnable;
//         var outs = peekOutputs (r);
//         r.resetOutputQueue ();
// 	return outs;
//     });
// }

function peekOutputsAndReset (component) {
    var outs = component.outputQueue.toArray ();
    component.resetOutputQueue ();
    return outs;
}

// function peekAllOutputsForAllChildren (me) {
//     me.children.forEach (child => {
//         peekAllOutputs (child.runnable);
//     });
// }

// function recursivePeek (m) {
//     if (m) {
//         return `(${m.comefrom}::[${m.kind}]${m.etag}:${m.data}:${recursivePeek (m.tracer)})`;
//     } else {
//         return '.';
//     }
// }

// function recursivelyPeekAllOutputsForAllChildren (me) {
//     recursiveTraceOutput (me.uut);
// }

// function recursiveTraceOutput (me) {
//     displayAllOutputsForAllChildren (me);
//     me.children.forEach (childobject => {
//         recursiveTraceOutput (childobject.runnable);
//     });
// }
