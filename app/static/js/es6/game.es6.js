/* jshint unused:false */
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
var consumptionRate = 0;
var foodSupply = 0;
initConsume();

function initConsume(){
  'use strict';
  var consumeFn = {};
  consumeFn.data = {};
  consumeFn.data.functionIndex = gameFunctions.length;
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
    gameFunctions.splice(data.functionIndex, 1);
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
      fnObj.data.functionIndex = gameFunctions.length;
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
      gameFunctions.splice(crop.functionIndex, 1);
      ajax(`/users/${crop.userId}/updateCrop`, 'put', {crop:crop}, res=>{
        $('#economy-container').empty().append(res);
      });
    }
  }
})();
