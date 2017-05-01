// Function to examine any URL Query String parameters 
    $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results==null){
        return null;
      } // End if
      else{
        return results[1] || 0;
      } // End else
    } // End urlParam