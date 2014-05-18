'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  // var home = traceur.require(__dirname + '/../routes/home.js');
  var game = traceur.require(__dirname + '/../routes/game.js');
  var users = traceur.require(__dirname + '/../routes/users.js');

  app.get('/', dbg, game.index);

  app.post('/login', dbg, users.login);
  app.put('/users/:userId/plant', dbg, users.plant);
  app.put('/users/:userId/updateCrop', dbg, users.updateCrop);
  app.put('/users/:userId/harvest', dbg, users.harvest);
  app.put('/users/:userId/buyPlot', dbg, users.buyPlot);
  app.put('/users/:userId/buySeed', dbg, users.buySeed);


  console.log('Routes Loaded');
  fn();
}
