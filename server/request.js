var
util	= require('util'),
EE	= require('events').EventEmitter;

function Request(CallClass, callSpec)
{
	EE.call(this);
	this.CallClass = CallClass;
	this.callSpec = callSpec;
}

util.inherits(Request, EE);

Request.prototype.toString = function()
{
	return this.callSpec['sig'];
};

Request.prototype.run = function()
{
	var mirror = this;
	this.tStart = new Date().getTime();

	var callObj = new this.CallClass(function(result)
	{
		mirror.tFinish = new Date().getTime();
		mirror.emit('finished', result);
	});

	callObj[this.callSpec['method']].apply(callObj, this.callSpec['args']);
};

Request.prototype.ran = function()
{
	return this.tFinish - this.tStart;
}

module.exports = Request;
