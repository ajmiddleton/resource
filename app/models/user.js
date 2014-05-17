'use strict';

var users = global.nss.db.collection('users');
// var Mongo = require('mongodb');
var _ = require('lodash');

class User {
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.ore = 0;
    this.food = 10;
    this.cash = 0;
    this.seeds = [];
    this.workers = [];
    this.consumption = 1;
  }

  // get isAutoGrowAvailable(){
  //   var autogrow = _(this.items).any(i=>i.type === 'autogrow');
  //
  //   return this.cash >= 50000 && (!autogrow);
  // }
  //
  // purchase(item){
  //   if(item.cost <= this.cash){
  //     this.cash -= item.cost;
  //     this.items.push(item);
  //   }
  // }

  save(fn){
    users.save(this, ()=>fn());
  }

  static login(username, fn){
    username = username.trim().toLowerCase();
    users.findOne({username:username}, (err, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      } else {
        user = new User(username);
        fn(user);
      }
    });
  }

  // static findByUserId(userId, fn){
  //   userId = Mongo.ObjectID(userId);
  //   users.findOne({_id:userId}, (err, user)=>{
  //     user = _.create(User.prototype, user);
  //     fn(user);
  //   });
  // }

}

module.exports = User;
