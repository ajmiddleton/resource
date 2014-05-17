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
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'post', {username:username}, html=>{
      $('#dashboard').empty().append(html);
    });
  }




})();
