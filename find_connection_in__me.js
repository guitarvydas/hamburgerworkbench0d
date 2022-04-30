function find_connection_in__me (_me, childname, etag) {
    var _ret =  null;
    
    _me.connections.forEach (connection => {
	var sender = connection.sender;
	
	if ((sender.name === childname) && (sender.etag === etag)) {
	    
	    _ret = connection;
	}
    });
    return  _ret;
}
