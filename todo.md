	./client/lib/APIBrowser.js: 124	: if(type == 'cookiedata') // TODO get rid of this nonsense and abstract saved cm
	./client/lib/APIBrowser.js: 178	: if($(this).attr('id').split('-')[1] == 'cookiedata') // TODO get rid of this nonsense and abstract saved cm
	./client/lib/APIBrowser.js: 207	: $newDiv.children('span').addClass('badge-'+((type=='error')?'warning':type)); // TODO the colors are all wrong
	./client/lib/APIBrowser.js: 265	:	// write the representation of saved client model data // TODO more fancy
	./client/lib/wsclient.js: 127:		// TODO think about what to do with the message post-process. statistics?
	./server/RequestBot.py:  66	:		if t - self.updateInterval > self.res['request_time']: # TODO individual timers
	./server/api/httpBot.py:  55:		if h[0] == 'Set-Cookie': # TODO there seems to still be some issues with parsing cookies, ex google.com
	./server/api/mtgox.py:  64	:# TODO implement rest https://en.bitcoin.it/wiki/MtGox/API/HTTP/v1:
	./server/WebSocketServer/WSServer.py:  14:# TODO wsgi multithreaded?
	./server/WebSocketServer/WSClient.py:  44:		self.broadcastPaused = True # TODO unique


some jq expressions
----------
cat samples/mtgoxGBPticker.json | jq '[.vol, .sell, .avg, .vwap | .value | tonumber | select(. < 100)]'