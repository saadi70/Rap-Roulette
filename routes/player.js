var model = require('../lib/model')
  , Player = model.Player
  , util = require('util')
;


// index

exports.index = function(req, res){
  //res.render('index')
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Players");
  res.end();
};


// myself

exports.myself = function(req, res){
    
  player = Player.get_myself(null, req, function (err, dbUser) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(util.inspect(dbUser));
    res.end();
  });
  

};

// view

exports.view = function(req, res){
    
  id = req.params.id;
  
  Player.get(null, id, function (err, player) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(util.inspect(player));
    res.end();
  });

};


// list

exports.list = function(req, res){
  
  Player.list(null, {}, function (err, players) {
   
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(util.inspect(players));
    res.end();
  });

};


// logout

exports.logout = function (req, res) {
  
  //if (typeof req.session !== 'undefined') {
  if (typeof req.session !== 'undefined' && typeof req.session.player_id !== 'undefined') { 
    

    // store that the player is logged out
    Player.collection.findAndModify( {
        query: {id: req.session.player_id}, 
        update : { "$set": { is_logged_in: 0} }, 
        'new': false
      },
      function (err) {
        
        // clear the session
        req.session.auth = null;
        res.clearCookie('auth');  
        req.session.destroy(function() {});
    
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(util.inspect({ success: { nessage: 'Player was logged out' } }));
        res.end();            

        }
      )

    /*
    Player.collection.(null, req.session.user_id, function (err) {
     
      // clear the session
      req.session.auth = null;
      res.clearCookie('auth');  
      req.session.destroy(function() {});
    
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write(util.inspect({ success: { nessage: 'Player was logged out' } }));
      res.end();    
  
    });
    */

  } else {
    
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(util.inspect({ success: { message: 'Player was not logged in.'} }));
    res.end();    
 
  }

  //res.partial('user/logout', {});
};


