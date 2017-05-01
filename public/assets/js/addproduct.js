// Inside the ready function, lets call to fill the product types select menu
        $.ajax({
            url: "http://localhost:3000/api/product_types",
            dataType: "json",
            type: "GET",
            data: {},
            success: function (result) {
                // We iterate through the array of records we get back from the database API call
                // If you drill down in the console, you will find the array at result.data.product_types
                $.each(result.data.product_types, function (index, product_type) {
                    $('#productTypes').append('<option value=' + product_type.id + '>' + product_type.label + '</option>');
                })
            }
        });
        $.ajax({
            url: "http://localhost:3000/api/scent_types",
            dataType: "json",
            type: "GET",
            data: {},
            success: function (result) {
                // We iterate through the array of records we get back from the database API call
                // If you drill down in the console, you will find the array at result.data.scent_types
                $.each(result.data.scent_types, function (index, scent_type) {
                    $('#scentTypes').append('<option value=' + scent_type.id + '>' + scent_type.label + '</option>');
                })
            }
        });

        // Process the form
        $('form').submit(function(event) {

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();

            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'product_name'  : $('input[name=product_name]').val(),
                'size'          : $('input[name=size]').val(),
                'id_type'       : $("#productTypes").val(),
                'id_scent_type' : $("#scentTypes").val(),
                'unit_price'    : $('input[name=unit_price]').val(),
                'cost'          : $('input[name=cost]').val(),
                'qty_on_hand'   : $('input[name=qty_on_hand]').val(),
                'in_store'      : $('input[name=in_store]').is(':checked')
            };

            // process the form
            $.ajax({
                type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url         : 'http://localhost:3000/api/product', // the url where we want to POST
                data        : formData, // our data object
                dataType    : 'json', // what type of data do we expect back from the server
                encode      : true
            })
                // using the done promise callback
                .done(function(data) {
                    // Success, so clear
                    $('#form').trigger("reset");
                    // Show success alert
                    swal("Success!", data.data.product_name + " was added.", "success");
                })
                .fail(function(data){
                    // In a fail, we need to look inside the responseJSON object for our
                    // APIs error message
                    swal("Oops...", data.responseJSON.data.error, "error");
                });
                
        });

    });

    // Function to examine any URL Query String parameters 
    $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results==null){
        return null;
      }
      else{
        return results[1] || 0;
      }
    }