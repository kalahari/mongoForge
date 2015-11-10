'use strict';
/// <reference path="typings/tsd.d.ts" />

import mongodb = require('mongodb');

class Servers {
	private _servers: Array<string>;
	
	constructor() {
		this._servers = [];
	}
}

export = Servers;