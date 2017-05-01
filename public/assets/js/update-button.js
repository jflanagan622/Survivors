<script type="text/javascript">
            //update button
        var answer = confirm ("Are you sure you want to update quantity of this product?");
            if (answer) {
                    $('#btn-default').on( 'click', 'button', function () {
                        $.ajax({
                                type        : 'PUT', // define the type of HTTP verb we want to use (PUT item to our cart)
                                url         : 'http://localhost:3000/api/cart', // the url where we want to PUT
                                data        : {}, // our data object
                                dataType    : 'json', // what type of data do we expect back from the server
                                encode      : true
                                success: function (result) {
                                                            // using the done promise callback
                                .done(function(data) {
                                // Success, so clear
                                $('#btn-default').remove();
                                // Show success alert
                                swal("Success, your item's quantity has been updated", "success");
                                }) // End .done
                                .fail(function(data){
                                // In a fail, we need to look inside the responseJSON object for our
                                // APIs error message
                                swal("Oops...", data.responseJSON.data.error, "error");
                                }) // End .fail

                            }; // End success
                    }); // End Ajax call
                }); // End btn-default.onclick
            } // end if (answer)
</script>
//Include <script src="assets/js/delete-button.js"></script> in your document and place this document in your assets/js directory