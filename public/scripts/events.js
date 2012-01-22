var room = {};
		
function room_init(){
    battle_start();	
}

function song_start(){
    var data = {"id": 3, "file": ""};
    room.song = data;
    room.song.manager = soundManager.createSound({ id: data.id, url: data.file});
    room.song.manager.play()
}

function song_sync(){
    var data = {"position": 15000};
    var diff = abs(room.song.manager.position-data.position);
    if (diff > 250){
        room.song.manager.stop();
        room.song.manager.setPosition(data.position+25);
        room.song.manager.play();
    }
}

function song_end(){
    room.song.manager.stop();
    room.song = null;
}

function queue_list(){
    var data = {"list": [{"id": 4, "name": "Bob"}, {"id": 6, "name": "Stephen"}, {"id": 9, "name": "Freddie"}]};
    
    // Get the queue and clean it out
    var ele = $('.queue ul');
    ele.html('');
    
    // Fill the queue
    for (x in data.list){
        ele.append("<li>"+data.list[x].name+"</li>");
    }
}

function queue_add(){
    
}

function battle_start(){
    // Todo: Cleanup previous battle if needed
    var data = {"id": "300", "players": [ {"id": 3, "name": "Adam Bratt", "img": "https://twimg0-a.akamaihd.net/profile_images/1708962739/K4OCl_normal.png"}, {"id": 4, "name": "Bill Nye", "img": "https://twimg0-a.akamaihd.net/profile_images/1708962739/K4OCl_normal.png"}]};
    for( x in data.players ){
        // Get player element and update ID
        p_ele = $('#player'+x);
        p_ele.attr('rel',data.players[x].id);
        // Update player name
        p_ele.find('.player-name').text(data.players[x].name);
        // Update player image
        p_ele.find('.player-img').attr('src',data.players[x].img);
    }
    room.battle = data;
    round_start();
}

function battle_end(){
    var data = {"winner": 3}
    room.battle = {};
    
    // Winner/Loser display logic
    winner_ele = $('.player[rel='+data.winner+']');
    winner_ele.find('.player-win').show();
    loser_ele = $('.player[rel!='+data.winner+']');
    loser_ele.find('.player-lose').show();
    
    // Cleanup the battle after 9 seconds
    setTimeout(function(){ battle_cleanup(data.winner); data = null; }, 9000);
}

function round_start(){
    var data = {"count": 2};
    $(".round-count").text(data.count);
    room.battle.current_round = data;
    player_start();
}

function round_end(){
    var data = {};
    room.battle.current_round = null;
}

function player_start(){
    var data = {"id": 3, "warmup_time": 5, "perform_time": 30};
    room.battle.current_round.current_player = data;
    var ele = $('.player[rel='+data.id+']');
    ele.find('.timer').addClass('warmup');
    setTimeout(function(){ player_timer(data.id, data.warmup_time, true); data=null; });
}

function player_timer(id, time_left, warmup){
    // Base state
    warmup = warmup || false;
    
    // Render timer
    var timer_ele = $('.player[rel='+id+']').find('.timer');
    timer_ele.text(time_left);
    
    // If not in a round set timer to wait
    if (!room.battle.current_round || room.battle.current_round == undefined){
        timer_ele.text('WAIT');
        return;
    }
    
    if (time_left > 0){
        // Call timer again
        setTimeout(function(){ player_timer(id, time_left-1, warmup)}, 1000);
    } else if(warmup) {
        // Switch from warmup timer to normal timer
        if (room.battle.current_round.current_player.perform_time){
            timer_ele.removeClass('warmup');
            setTimeout(function(){ player_timer(id, room.battle.current_round.current_player.perform_time)}, 1000);
        }
    } else {
        // remove this later
        player_end();
    }
}

function player_end(){
    var data = {"id": 3};
    var ele = $('.player[rel='+data.id+']');
    // Change timer text to WAIT
    ele.find('.timer').text('WAIT');
}