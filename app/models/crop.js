/* jshint unused:false */
'use strict';
class Crop{
  constructor(type){
    switch(type){
    case 'corn':
      this.type = type;
      this.cashValue = 1;
      this.foodValue = 5;
      this.growthRate = 1;
      this.maturityHeight = 10;
      this.cost = 1;
      break;
    case 'cotton':
      this.type = type;
      this.cashValue = 10;
      this.foodValue = 0;
      this.growthRate = 1;
      this.maturityHeight = 10;
      this.cost = 1;
      break;
    }
    this.height = 0;
  }

  get isMature(){
    return this.height >= this.maturityHeight;
  }

  get cropClass(){
    return this.isMature ? this.type : 'sprout';
  }

  harvest(user){
    user.cash += this.cashValue*1;
    user.food += this.foodValue*1;
  }
}

module.exports = Crop;
