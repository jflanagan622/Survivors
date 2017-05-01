// Inside the ready function, lets call to fill the product select menu
        $.ajax({
            url: "http://localhost:3000/api/products",
            dataType: "json",
            type: "GET",
            data: {},
            success: function (result) {

                // vars for DataTable
                var columns = [];

                // We iterate through the array of records we get back from the database API call
                // If you drill down in the console, you will find the array at result.data.products

                // First, we build the columns array dynamically by examining the first record in the returned set.
                if(result.data.products.length > 0) {

                    var firstRecord = result.data.products[0];
                  
                    for(var key in firstRecord) {
                      // We don't want id visible
                      if(key == 'id' || key == 'id_type' || key == 'cost' || key == 'product_pic' || key == 'date_created' || key == 'qty_on_hand' || key == 'date_updated' || key == 'id_scent_type') {
                        columns.push( { "title" : key, "data" : key, "visible": false } );
                      } /* End if*/ else { 
                        // Push in the data
                        columns.push( { "title" : key, "data" : key } );
                      } // End else
                    } // End for loop
                } // End if result.data.products.length > 0
                // Push in our buttons as a final column
               columns.push( {"defaultContent": "<button class=\"btn btn-default\"><i class=\"fa fa-arrow-up\"></i></button><button class=\"btn btn-delete\"><i class=\"fa fa-arrow-down\"></i></button>"} )

                // Draw the table
                var table = $('#data_table').DataTable( {
                    "data" : result.data.products,
                    "columns" : columns,
                    columnDefs: [
                      { width: '500px', targets: 0 }
                    ], // End columnDefs
                    fixedColumns: true
                });  // End var table
 
                $('#data_table tbody').on( 'click', 'button', function () {
                    var data = table.row( $(this).parents('tr') ).data();
                    var buttonClass = $(this).attr("class");
                    if(buttonClass == "btn btn-default") {
                      // How would you hook this up?
                      alert( "Update " + data.id );
                    }/* End if*/ else {
                      // And this? What about the "are you sure?"
                      alert( "Delete " + data.id );
                    } // End Else
                    
                }); // End data_table tbody.on('click')

            } // End success
        }); // End ajax

    }); // End document.ready