// give total price to our cart.
  $(document).ready(function() {
        $('.cart_quantity_up').click(function(){
            var quantityBox = $(this).siblings("#TextBox");
            var quantity= parseInt(quantityBox.val()) + 1;
            quantityBox.val(quantity);

            var price = parseFloat($(this).parent().siblings(".cart_price").children("#price").html());
            var totalPrice = quantity * price;
            $(this).parent().siblings(".cart_total").children("#totprice").html(totalPrice);

            updateBill();
        }); // End cart_quantity_up

        $('.cart_quantity_down').click(function() {
            var quantityBox = $(this).siblings("#TextBox");
            var quantity= parseInt(quantityBox.val()) - 1;
            quantityBox.val(quantity);

            var price = parseFloat($(this).parent().siblings(".cart_price").children("#price").html());
            var totalPrice = quantity * price;
            $(this).parent().siblings(".cart_total").children("#totprice").html(totalPrice);

            updateBill();
        }); // End cart_quantity_down
    }); // End document.ready

    function updateBill(){
         var totalBill=0.0;
         $(".cart_total_price").each(function(){ 
              totalBill+=parseFloat($(this).html()) 
         })
         $("#totalbill > span").html(totalBill);
    } // End updateBill