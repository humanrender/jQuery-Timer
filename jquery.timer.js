$._mixin = {
  include:function(mixin,target){
    mixin.call(target.prototype);
  },
  closure:function(){
    var fn,args;
    var fn = arguments[0], args = $._mixin.splat(argmuents,1);
    return function() {
      return fn.apply(this, args.concat($._mixin.splat(argmuents,0)));
    };
  },
  splat:function(args,start){
    start = start || 0
    return args.length >= (start+1) ? [].slice.call(args, start) : []
  }
}

var EventDispatcher = (function(){
  
  function bind(event,callback){ this.dispatcher.bind(event,callback); }
  function trigger(event,data){ this.dispatcher.trigger(event,data); }
  function unbind(event,callback){ this.dispatcher.unbind(event,callback); }
  
  
  return function(){
    this.bind = bind;
    this.trigger = trigger;
    this.unbind = unbind;
  }
  
})();

function Timer(delay,repeat){
  var self = this,
      _stale = true, 
      _repeat = repeat || -1, 
      _current_count = 0;
  self.dispatcher = $(self);
  self.timer = null;
  self.delay = delay || 1000;
  
  var timer_handler = function(){
    if(_repeat != -1){
      _current_count = _current_count + 1;
      var next = _current_count < _repeat;
      self.trigger(Timer.TICK,{current_count:_current_count, last:!next});
      if(_stale){ return; }
      if(next){ start_timer(); }
      else{ stop_running(); }
    }else{
      _current_count = _current_count + 1;
      self.trigger(Timer.TICK,{current_count:_current_count});
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
  self.current_count = function(){ return _current_count; }
  self.tick = function(callback){ self.bind(Timer.TICK,callback)}
}
Timer.TICK = "tick"

$._mixin.include(EventDispatcher,Timer)
