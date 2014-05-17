'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Farm = traceur.require(__dirname + '/../models/farm.js');

exports.login = (req, res)=>{
  User.login(req.body.username, user => {
    Farm.findById(user.farm, farm=>{
      res.render('users/dashboard', {user:user}, (e, dashboardHTML)=>{
        res.render('farm/index', {farm:farm}, (e, farmHTML)=>res.send({user:user, dashboardHTML:dashboardHTML, farmHTML:farmHTML}));
      });
    });
  });
};

exports.plant = (req, res)=>{
  User.findById(req.params.userId, user=>{
    Farm.findById(user.farm, farm=>{
      var crop = {};
      crop.type = 'corn';
      crop.cashValue = 1;
      crop.foodValue = 5;
      crop.growthRate = 1;
      crop.maturityHeight = 10;
      crop.height = 0;
      farm.plots[req.body.plotNum].crop = crop;
      farm.plots[req.body.plotNum].isAvailable = false;
      farm.save(()=>res.render('farm/index', {farm:farm}, (e, farmHTML)=>res.send({user:user, farmHTML:farmHTML})));
    });
  });
};
