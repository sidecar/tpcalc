(function($, window, document, undefined) {
  $(document).ready(function() {

    function validateFields () {

      function displaySuccess($elem) {
        $elem.parent()
        .parent('div')
        .addClass('has-success')
        .removeClass('has-error');
      };

      function displayError($elem) {
        $elem.parent()
        .parent('div')
        .addClass('has-error')
        .removeClass('has-success');
      };
      
      function isString($elem) {
        var val = $elem.val();
        if(typeof val === 'string' && val.length) return true;
        return false;
      }

      function isEmail($elem) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test($elem.val());
      }

      var $name = $('[name="name"]')
      , $title = $('[name="title"]')
      , $company = $('[name="company"]')
      , $email = $('[name="email"]')
      , $employees = $('[name="employees"]');

      if (isString($name)) {
        displaySuccess($name)
      } else {
        displayError($name)
          return false;
      }

      if (isString($title)) {
        displaySuccess($title)
      } else {
        displayError($title);
        return false;
      }

      if (isString($company)) {
        displaySuccess($company)
      } else {
        displayError($company);
        return false;
      }

      if (isEmail($email)) {
        displaySuccess($email)
      } else {
        displayError($email);
        return false;
      }

      if (isString($employees)) {
        displaySuccess($employees)
      } else {
        displayError($employees);
        return false;
      }

      return true;
    };

    $('.btn-next').click(function() {
      if(validateFields()) {

        var data = {};
        data.name = $('[name="name"]').val ;
        data.title = $('[name="title"]').val ;
        data.company = $('[name="company"]').val ;
        data.email = $('[name="email"]').val ;
        data.employees = $('[name="employees"]').val;

        $.ajax({
          url: '/gate/business/'+data.name+'/'+data.title+'/'+data.company+'/'+encodeURIComponent(data.email)+'/'+data.employees,
          success: function() { 
            console.log('success');
            window.location = "/#/business";
          }
        });

      }
    });

  });
})(window.jQuery, window, document);