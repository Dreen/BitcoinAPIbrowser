var
assert	= require('assert'),
mongo 	= require('mongodb');

var ref, mdb, apis, jobs_req;

before(function(done)
{
	ref = {
		"name": "TestAPI",
		"file": "testapi.js",
		"author": "greg.balaga@gmail.com",
		"cred": {
			"his identification": "you dont need to see it"
		},
		"calls": [
			{
				"sig": "TestAPI::getSimple()",
				"method": "getSimple",
				"args": [ ],
				"timer": 30
			}
		]
	};

	mongo.MongoClient.connect("mongodb://localhost:27017/bitapi_test", function(err, db)
	{
		if (err) done(err);
		else
		{
			mdb = db;
			apis = mdb.collection('apis');
			jobs_req = mdb.collection('jobs_req');
			apis.remove(function()
			{
				apis.insert(ref, done);
			});
		}
	});
});

describe('Bot Event', function()
{
	it('on loaded_apis: requestModel should contain the model of TestAPI and a null for its call in #jobs', function(done)
	{
		var Bot	= require('../bot.js')();
		var bot = new Bot(mdb);
		bot.removeAllListeners(); // dont test further
		bot.on('loaded_apis', function()
		{
			assert.deepEqual(bot._requestModel['TestAPI'], ref);
			assert.strictEqual(bot._jobs["TestAPI::getSimple()"], null);
			bot.shutdown();
			done();
		});
	});

	it('on loaded_objects: apis should contain an included API module with initialised credentials', function(done)
	{
		var Bot	= require('../bot.js')();
		var bot = new Bot(mdb);
		bot.removeAllListeners('loaded_objects'); // dont test further
		bot.on('loaded_objects', function()
		{
			assert.equal(bot._apis['TestAPI'].cred['his identification'], "you dont need to see it");
			bot.shutdown();
			done();
		});
	});

	it('on shutdown_complete: shutting down, should detect an event', function(done)
	{
		jobs_req.remove(function()
		{
			var Bot	= require('../bot.js')();
			var bot = new Bot(mdb);
			bot.on('shutdown_complete', function()
			{
				assert.ok(true);
				done();
			});
			bot.start();
			bot.shutdown();
		});
	});

	it('on called: should get a Request object with a valid call spec', function(done)
	{
		jobs_req.remove(function()
		{
			var Bot	= require('../bot.js')();
			var bot = new Bot(mdb);
			bot.on('called', function(request)
			{
				assert.deepEqual(request._spec, ref.calls[0]);
				bot.shutdown();
				done();
			});
				
			bot.start();
		});
	});

	describe('on resulted: should get a Request object with:', function()
	{
		it('valid call spec', function(done)
		{
			jobs_req.remove(function()
			{
				var Bot = require('../bot.js')();
				var bot = new Bot(mdb);
				bot.on('resulted', function(request)
				{
					assert.deepEqual(request._spec, ref.calls[0]);
					bot.shutdown();
					done();
				});
				
				bot.start();
			});
		});
			
		it('valid result', function(done)
		{
			jobs_req.remove(function()
			{
				var Bot	= require('../bot.js')();
				var bot = new Bot(mdb);
				bot.on('resulted', function(request)
				{
					assert.deepEqual(request.result, {"result": "OK"});
					bot.shutdown();
					done();
				});
				
				bot.start();
			});
		});

		it('run time greater than 0', function(done)
		{
			jobs_req.remove(function()
			{
				var Bot	= require('../bot.js')();
				var bot = new Bot(mdb);
				bot.on('resulted', function(request)
				{
					var ran = request.ran();
					assert.equal(typeof ran, "number");
					assert.ok(ran > 0);
					bot.shutdown();
					done();
				});
				
				bot.start();
			});
		});
	});
});
