
var mysql = require('mysql')
	, client = mysql.createClient({
        database: 'rap',
        user: 'rapuser',
        password: 'rappass',
        port: 8889
		})
	, util = require('util')
	, Cookies = require('Cookies');


// Users
// ============================================================================


// persistent users
var Users = {};

var User = exports.User = function () {

}

// create
// creates a user in the db and in the app
// callsback with the created user from the app

exports.User.create = create = function (err, obj, cb) {
	
	if (!user_get_from_app(obj.service, obj.screen_id)) {
	    
		client.query("INSERT INTO users (service, screen_name, screen_id) VALUES (?, ?, ?)",  
			[obj.service, obj.screen_name, obj.screen_id],
        	function (err, results, fields) { 
            	if (err) { 
                	throw err; 
            	} 

			user_get_from_db({ service: obj.service, screen_id: obj.screen_id }, function (err, user) {
			
				//console.log(util.inspect(results[0]));
				console.log('created user in the database and in the app');
				
				// service name and unique id from the external service identifies the user
				appUser = user_create_in_app(user);
						
				// callback
				cb(err, appUser);
			});

		
        });

	} else {
		
		console.log('user already exists: just return user from the app');
		cb(err, user_get_from_app(obj.service, obj.screen_id)); 

	}
	
}



// create in app

exports.User.create_in_app = user_create_in_app = function (user) {
	Users[user.service + '-' + user.screen_id] = user;
	return user_get_from_app(user.service, user.screen_id);
}



// delete from app

exports.User.delete_from_app = user_get_from_app = function (service, screen_id) {
	delete Users[service + '-' + screen_id];
}


// get
// returns the app user given the service and screen_id in the cookie

exports.User.get = user_get = function(req, res) {
	service = req.session.service;
	screen_id = req.session.screen_id;
	return users_get_from_app(service, screen_id);	
}


// get from app

exports.User.get_from_app = user_get_from_app = function (service, screen_id) {
	return Users[service + '-' + screen_id];
}


// get from datastore

exports.User.get_from_db = user_get_from_db = function (obj, cb)  {
	
	client.query(
  		'SELECT * FROM users WHERE service = ? AND screen_id = ? LIMIT 1',
		[obj.service, obj.screen_id],
  		function selectCb(err, results, fields) {
			if (err) {
				throw err;
			}
			
			console.log(util.inspect(results[0]));
			
			// callback
			cb(err, results[0]);
				
			//console.log(fields);
			//client.end();
		}
	);

}



