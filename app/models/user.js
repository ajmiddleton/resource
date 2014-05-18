'use strict';

var traceur = require('traceur');
var Farm = traceur.require(__dirname + '/farm.js');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User {
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.ore = 0;
    this.food = 10;
    this.cash = 1;
    this.consumption = 1;
    this.inventory = [];
  }

  buySeed(crop){
    if(this.cash >= crop.cost){
      this.cash -= crop.cost;
      var item = {};
      item.itemType = 'seed';
      item.seedType = crop.type;
      this.inventory.push(item);
    }
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  static login(username, fn){
    username = username.trim().toLowerCase();

    users.findOne({username:username}, (e, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        user = new User(username);
        users.save(user, ()=>{
          var farm = new Farm(user._id);
          farm.save(()=>{
            user.farm = farm._id;
            users.save(user, ()=>fn(user));
          });
        });
      }
    });
  }

  static findById(userId, fn){
    userId = Mongo.ObjectID(userId);
    users.findOne({_id:userId}, (err, user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }

}

module.exports = User;
