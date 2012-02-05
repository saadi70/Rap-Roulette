// client model (interacts with the server-side model using XHR)

var model;

// initialize model

function initModel (callback) {
  model = new Model();
  callback(model);
}

function Model () {
  

  // Player
  // ==========================================================================

  this.Player = function (obj, callback) {
    
    // construction
    this.sid = obj.sid;
    callback(this);
  
    // get myself
    this.get_myself = function (err, cb) {
    
      $.ajax({
        url: "/player/myself",
        context: document.body,
        success: function(player){
          cb(err, player);     
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
          //alert(thrownError);
        }
      });

    }

    // get mysid
    this.get_mysid = function (err, cb) {
    
      // http://api.jquery.com/jQuery.ajax/
      $.ajax({
        url: "/player/mysid",
        context: document.body,
        dataType: 'json',
        success: function(sid){
          cb(err, sid);     
        }
      });

    }

    // loggedin
    this.loggedin = function (err, cb) {
    
      $.ajax({
        url: "/player/loggedin",
        context: document.body,
        success: function(player_loggedin){
          cb(err, player_loggedin);     
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
          //alert(thrownError);
          cb(err, false);
        }
      });

    }


  }


  // Room
  // ==========================================================================

  this.Room = function (obj, callback) {
    
    // construction
    this.id = obj.id;
    this.battle_id = obj.battle_id;
    this.name = obj.name;
    this.player_queue = obj.player_queue;
    
    // full player information may be added or deleted later
    this.players = {};
     
    callback(this);
        

    // get
    this.get = function (err, id, cb) {
    
      $.ajax({
        url: "/rooms/" + id + "/get",
        context: document.body,
        success: function(room){
          cb(err, room);     
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
          //alert(thrownError);
        }
      });

    }

    // get queue
    this.get_queue = function (err, id, cb) {
    
      $.ajax({
        url: "/rooms/" + id + "/get_queue",
        context: document.body,
        success: function(player_queue){
          cb(err, player_queue);     
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
          //alert(thrownError);
        }
      });

    }

  }

  // Battle
  // ==========================================================================

  this.Battle = function (obj, callback) {

    // construction
    this.id = obj.id;
    this.name = obj.name;
    this.players = obj.players;
    this.current_player_id = obj.current_player_id;
    this.current_state_id = obj.current_state_id;
    this.song_id = obj.song_id;
     
    callback(this);
    
  }

  // Song
  // ==========================================================================
  
  this.Song = function (obj, callback) {
   
    callback(song);
    
  }

}
