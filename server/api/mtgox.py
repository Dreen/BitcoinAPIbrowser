from httpBot import httpBot

import json
from time import time
from hashlib import sha512
from hmac import HMAC
from base64 import b64encode, b64decode
from urllib import urlencode

class mtgox:
	# Settings
	API_KEY	= '360e28ab-b5a8-40fa-e11c-25d271947c51'
	SECRET	= b64decode('JNUmav6DNbBLgPJLfVCRmNhDGbpzIKbhIe2ZgxAt0RsJNy45wNLModKURZ3j5O9C7XlxjLbk8XkFbPrydeQnJQ==')
	LOGIN	= 'Dreen'
	PASS	= 'a&_K4+j%O-}<4BQ'
	VERSION	= '1'
	
	# Locations
	HOME	= 'https://mtgox.com/'
	API		= HOME + 'api/'
	APIAUTH	= API + VERSION + '/'
	
	def __init__(self, verbose = False, toUTF = True):
		self.verbose = verbose
		self.toUTF = toUTF
	
	
	# Data
	SYMBOLS = [
	'USD',
	'AUD',
	'CAD',
	'CHF',
	'CNY',
	'DKK',
	'EUR',
	'GBP',
	'HKD',
	'JPY',
	'NZD',
	'PLN',
	'RUB',
	'SEK',
	'SGD',
	'THB']

	def request(self, call_name, raw = True, get={}, post={}):
		r = httpBot(self.APIAUTH + call_name, self.verbose)
		post.update({'nonce': int(time()*100000)})
		r.uHead.update({'Rest-Key': self.API_KEY,
		'Rest-Sign': b64encode(str(HMAC(self.SECRET, urlencode(post), sha512).digest()))})
		r.post = post
		r.get = get
		if raw:
			r.get.update({'raw': 1})
		if self.toUTF:
			return self.convert(json.loads(r.go()))
		else:
			return json.loads(r.go())
	
	def convert(self, input):
		if isinstance(input, dict):
			return dict((self.convert(key), self.convert(value)) for key, value in input.iteritems())
		elif isinstance(input, list):
			return [self.convert(element) for element in input]
		elif isinstance(input, unicode):
			return input.encode('utf-8')
		else:
			return input
	
	def currency(self, currency, call_name, since=0):
		return self.request('BTC' + self.SYMBOLS[currency] + '/' + call_name, get={'since':str(since)})
	
	# get lowest ask price
	# currency(7,'depth')['asks'][0]['price']

# TODO implement rest https://en.bitcoin.it/wiki/MtGox/API/HTTP/v1:
# Order result, Wallet history, Submit order, Currency info, Merchant System

#import pdb
#from pprint import pprint as pp
#pdb.set_trace()
#m = mtgox(True)
#pp(m.request('generic/private/info'))	# returns information about your account, funds, fees, API privileges, withdraw limits . . .
#pp(m.request('generic/private/idkey'))	# Returns the idKey used to subscribe to a user's private updates channel in the websocket API. The key is valid for 24 hours.
#pp(m.request('generic/private/orders'))# Returns information about your current open orders. Valid order statuses are: pending, executing, post-pending, open, stop, and invalid.
#pp(m.request('generic/private/trades'))# Returns all of your trades. Does not include fees.
#pp(m.request('generic/hotp_gen'))		# used to generate a new HOTP key ( useful for developers )
#pp(m.currency(7,'ticker'))				# Ticker for GBP
#pp(m.currency(11,'ticker'))			# Ticker for PLN
#pp(m.currency(7,'depth'))				# Depth for GBP
#pp(m.currency(11,'depth'))				# Depth for PLN
#pp(m.currency(7,'fulldepth'))			# Full depth for GBP
#pp(m.currency(11,'fulldepth'))			# Full depth for PLN
#pp(m.currency(7,'trades'))				# Trades for GBP
#pp(m.currency(11,'trades'))			# Trades for PLN
#pp(m.currency(7,'cancelledtrades'))	# Cancelled trades for GBP
#pp(m.currency(11,'cancelledtrades'))	# Cancelled trades for PLN
