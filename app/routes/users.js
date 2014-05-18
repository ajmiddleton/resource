/* jshint unused:false */
'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Farm = traceur.require(__dirname + '/../models/farm.js');
var Crop = traceur.require(__dirname + '/../models/crop.js');
var _ = require('lodash');

exports.login = (req, res)=>{
  User.login(req.body.username, user => {
    Farm.findById(user.farm, farm=>{
      res.render('users/dashboard', {user:user}, (e, dashboardHTML)=>{
        res.render('farm/index', {farm:farm}, (e, farmHTML)=>{
          res.render('users/inventory', {}, (e, inventoryHTML)=>{
            res.render('users/store', {}, (e, storeHTML)=>{
              res.send({user:user, dashboardHTML:dashboardHTML, farmHTML:farmHTML, inventoryHTML:inventoryHTML, storeHTML:storeHTML});
            });
          });
        });
      });
    });
  });
};

exports.plant = (req, res)=>{
  User.findById(req.params.userId, user=>{
    Farm.findById(user.farm, farm=>{
      var crop = new Crop('corn');
      farm.plots[req.body.plotNum].crop = crop;
      farm.plots[req.body.plotNum].isAvailable = false;
      farm.save(()=>res.render('farm/index', {farm:farm}, (e, farmHTML)=>res.send({user:user, crop:crop, farmHTML:farmHTML})));
    });
  });
};

exports.updateCrop = (req, res)=>{
  console.log('--------UPDATE CROP---------');
  User.findById(req.params.userId, user=>{
    Farm.findById(user.farm, farm=>{
      farm.plots[req.body.crop.plotNum].crop = _.create(Crop.prototype, req.body.crop);
      farm.save(()=>res.render('farm/index', {farm:farm}));
    });
  });
};

exports.harvest = (req, res)=>{
  console.log('-----HARVEST------');
  User.findById(req.params.userId, user=>{
    Farm.findById(user.farm, farm=>{
      var crop = _.create(Crop.prototype, farm.plots[req.body.plotNum].crop);
      crop.harvest(user);
      farm.plots[req.body.plotNum].crop = {};
      farm.plots[req.body.plotNum].isAvailable = true;
      farm.save(()=>user.save(()=>{
        res.render('farm/index', {farm:farm}, (e, farmHTML)=>{
          res.render('users/dashboard', {user:user}, (e, dashboardHTML)=>res.send({dashboardHTML:dashboardHTML, farmHTML:farmHTML}));
        });
      }));
    });
  });
};

exports.buyPlot = (req, res)=>{
  console.log('---------BUYPLOT---------');
  User.findById(req.params.userId, user=>{
    Farm.findById(user.farm, farm=>{
      if(user.cash >= farm.plots[req.body.plotNum].cost){
        farm.plots[req.body.plotNum].isUnlocked = true;
        user.cash -= farm.plots[req.body.plotNum].cost;
      }
      farm.save(()=>user.save(()=>{
        res.render('farm/index', {farm:farm}, (e, farmHTML)=>{
          res.render('users/dashboard', {user:user}, (e, dashboardHTML)=>res.send({dashboardHTML:dashboardHTML, farmHTML:farmHTML}));
        });
      }));
    });
  });
};

exports.buySeed = (req, res)=>{
  console.log('------BUYSEED-------');
  User.findById(req.params.userId, user=>{
    var crop = _.create(Crop.prototype, req.body.seed);
    user.buySeed(crop);
    user.save(()=>{
      res.render('users/dashboard', {user:user}, (e, dashboardHTML)=>{
        res.render('users/inventory', {user:user}, (e, inventoryHTML)=>res.send({dashboardHTML:dashboardHTML, inventoryHTML:inventoryHTML}));
      });
    });
  });
};
