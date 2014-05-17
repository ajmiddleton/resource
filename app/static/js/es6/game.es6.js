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

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#economy-container').on('click', '.plant', plantCrop);
  }

  function plantCrop(){
    var userId = $('#user').attr('data-id');
    var plotNum = $(this).closest('td').attr('data-plot');
    ajax(`/users/${userId}/plant`, 'put', {plotNum:plotNum}, res=>{
      console.log(res.user);
      $('#economy-container').empty().append(res.farmHTML);
    }, 'json');
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'post', {username:username}, res=>{
      $('#dashboard-container').empty().append(res.dashboardHTML);
      $('#economy-container').empty().append(res.farmHTML);
    }, 'json');
  }




})();
