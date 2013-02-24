var _defs	= require('underscore').defaults,
	fs		= require('fs'),
	request	= require('https').request,
	query	= require('querystring');

var misc	= require('../misc.js');

// construct a new object for requests
function API (verbose)
{
	this.verbose = misc.def(verbose, false);
	this.cred = JSON.parse(fs.readFileSync('cred/' + this.constructor.name + '.cred').toString());
	
	// default callback
	this.callback = function (data) { console.log(data); };
}

// launch an async request
API.prototype.go = function(opts, post, get) {
	// default variables
	var mirror	= this,
		data	= misc.def(data,	''),
		post	= misc.def(post,	{}),
		get		= misc.def(get,		{});
	
	// default options
	opts = _defs(opts, {
		host:		'',
		path:		'',
		port:		443,
		method:		'POST',
		headers:	{}
	});
	
	// write get variables into the query string
	if (misc.concrete(get))
	{
		opts.path += '?' + query.stringify(get);
	}
	
	// extra headers
	opts.headers['User-Agent'] = misc.def(opts.headers['User-Agent'], "Mozilla/5.0 (X11; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0");
	if (misc.concrete(post))
	{
		opts.headers['Content-type'] = "application/x-www-form-urlencoded";
	}
	
	// create request object
	var req = request(opts, function (result) {
		result.setEncoding('utf8');
		var buffer = '';
		result.on('data', function(data) {
			buffer += data;
		});
		result.on('end', function() {
			if (mirror.verbose)
			{
				console.log('<- Received ' + buffer.length + ' bytes');
			}
			var data = JSON.parse(buffer);
			mirror.callback(data);
		});
	});
	
	// error handling
	req.on('error', function(e) {
		console.log('warning: problem with request: ' + e.message);
	});
	
	// write request body
	if (misc.concrete(post))
	{
		req.write(query.stringify(post));
	}
	
	if (this.verbose)
	{
		console.log('-> ' + opts['method'] + ' ' + opts['host'] + ':' + opts['port'] + opts['path']);
	}

	// finish the request
	req.end();
};

// set custom callback
API.prototype.setCallback = function(cb) {
	if (typeof this.callback == "function")
	{
		this.callback = cb;
	}
};

exports.API = API;