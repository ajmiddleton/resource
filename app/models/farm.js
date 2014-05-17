'use strict';

var farms = global.nss.db.collection('farms');
var Mongo = require('mongodb');
var _ = require('lodash');

class Farm{
  constructor(userId){
    this.userId = userId;
    this.plots = [];
    this.initPlots();
  }

  initPlots(){
    for(var i=0; i<9; i++){
      var plot = {};
      plot.isUnlocked = i===0 ? true : false;
      plot.isAvailable = true;
      plot.crop = {};
      plot.cost = Math.pow(10, i);
      this.plots.push(plot);
    }
  }

  save(fn){
    farms.save(this, ()=>fn());
  }

  static findById(farmId, fn){
    farmId = Mongo.ObjectID(farmId);
    farms.findOne({_id:farmId}, (err, farm)=>{
      farm = _.create(Farm.prototype, farm);
      fn(farm);
    });
  }

}

module.exports = Farm;
