/* jshint unused:false */
/* global _ */
function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}

var gameTimer = setInterval(game, 1000);
var gameFunctions = [];
var fnNumber = 0;
var consumptionRate = 0;
var foodSupply = 0;
initConsume();

function initConsume(){
  'use strict';
  var consumeFn = {};
  consumeFn.data = {};
  consumeFn.data.functionIndex = gameFunctions.length;
  consumeFn.data.fNumber = fnNumber;
  fnNumber++;
  consumeFn.run = consume;
  gameFunctions.push(consumeFn);
}

function game(){
  'use strict';
  gameFunctions.forEach(fnObj=>{ fnObj.run(fnObj.data); });
}

function consume(data){
  'use strict';
  foodSupply -= consumptionRate;
  if(foodSupply < 0){
    gameFunctions = _.reject(gameFunctions, fnObj=>fnObj.data.fNumber === data.fNumber);
    alert('You Have Died of Starvation!');
  }else if($('#user').length > 0){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}/updateFood`, 'put', {food:foodSupply}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
    }, 'json');
  }
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#economy-container').on('click', '.plant', plantCrop);
    $('#economy-container').on('click', '.harvest', harvestCrop);
    $('#economy-container').on('click', '.buyPlot', buyPlot);
    $('#store-container').on('click', '.buySeed', buySeed);
    $('#store-container').on('click', '.buyUpgrade', buyUpgrade);
  }

  function buyUpgrade(){
    var userId = $('#user').attr('data-id');
    var upgrade = $(this).prev().attr('data-upgrade');
    ajax(`users/${userId}/buyUpgrade`, 'put', {upgrade:upgrade}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#store-container').empty().append(res.storeHTML);
      consumptionRate = res.user.consumption;
    }, 'json');
  }

  function buySeed(){
    var userId = $('#user').attr('data-id');
    var seed = $(this).prev().attr('data-seed');
    ajax(`users/${userId}/buySeed`, 'put', {seed:seed}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#inventory-container').empty().append(res.inventoryHTML);
    }, 'json');
  }

  function buyPlot(){
    var userId = $('#user').attr('data-id');
    var plotNum = $(this).closest('td').attr('data-plot');
    ajax(`users/${userId}/buyPlot`, 'put', {plotNum:plotNum}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#economy-container').empty().append(res.farmHTML);
    }, 'json');
  }

  function harvestCrop(){
    var userId = $('#user').attr('data-id');
    var plotNum = $(this).closest('td').attr('data-plot');
    ajax(`users/${userId}/harvest`, 'put', {plotNum:plotNum}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#economy-container').empty().append(res.farmHTML);
      $('#store-container').empty().append(res.storeHTML);
      foodSupply = res.user.food;
    }, 'json');
  }

  function plantCrop(){
    var userId = $('#user').attr('data-id');
    var plotNum = $(this).closest('td').attr('data-plot');
    var seedType = $(this).next().val();
    ajax(`/users/${userId}/plant`, 'put', {plotNum:plotNum, seedType:seedType}, res=>{
      console.log(res.crop);
      var fnObj = {};
      fnObj.data = {};
      fnObj.data = res.crop;
      fnObj.data.fNumber = fnNumber;
      fnNumber++;
      fnObj.data.plotNum = plotNum;
      fnObj.data.userId = userId;
      fnObj.run = autogrow;
      gameFunctions.push(fnObj);
      $('#economy-container').empty().append(res.farmHTML);
      $('#inventory-container').empty().append(res.inventoryHTML);
    }, 'json');
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'post', {username:username}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#economy-container').empty().append(res.farmHTML);
      $('#inventory-container').empty().append(res.inventoryHTML);
      $('#store-container').empty().append(res.storeHTML);
      foodSupply = res.user.food;
      consumptionRate = res.user.consumption;
    }, 'json');
  }

  function autogrow(crop){
    if(crop.height < crop.maturityHeight){
      crop.height += crop.growthRate;
    }else{
      gameFunctions = _.reject(gameFunctions, fnObj=>fnObj.data.fNumber === crop.fNumber);
      ajax(`/users/${crop.userId}/updateCrop`, 'put', {crop:crop}, res=>{
        $('#economy-container').empty().append(res.farmHTML);
        $('#dashboard-container').empty().append(res.dashboardHTML);
      }, 'json');
    }
  }
})();
