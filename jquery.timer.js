function Timer(delay,repeat){
  var self = this,
      _stale = true, 
      _repeat = repeat || -1, 
      _current_count = 0;
  var $self = $(self);
  
  self.timer = null;
  self.delay = delay || 1000;
  
  var timer_handler = function(){
    if(_repeat != -1){
      _current_count = _current_count + 1;
      var next = _current_count < _repeat;
      $self.trigger(Timer.TICK,{current_count:_current_count, last:!next});
      if(_stale){ return; }
      if(next){ start_timer(); }
      else{ stop_running(); }
    }else{
      _current_count = _current_count + 1;
      $self.trigger(Timer.TICK,{current_count:_current_count});
      if(_stale){ return; }
      start_timer();
    }
  }
  
  var start_timer = function(){ self.timer = setTimeout(timer_handler,self.delay); };
  var start_running = function(){ _current_count = 0; _stale = false; };
  var stop_running = function(){ _stale = true; };
  
  self.start = function(){
    if(!self.is_running()){
      start_timer();
      start_running();
    }
  }
  
  self.stop = function(abort){
    if(!!abort){
      if(self.timer){
        clearTimeout(self.timer);
      }
    }
    stop_running();
  }
  
  self.is_running = function(){ return !_stale; }
  self.bind = function(event,callback){ $self.bind(event,callback); }
  self.current_count = function(){ return _current_count; }
  self.unbind = function(event,callback){ $self.unbind(event,callback) }
  self.tick = function(callback){ $self.bind(Timer.TICK,callback)}
}
Timer.TICK = "tick"