$(document).ready(function () {
    $("#cart").on('click', '.remove', function () {
        var product_block = $(this).closest('tr');
        $.post(cart_url + 'delete/', {
            id: product_block.data('id'),
            html: 1
        }, function (response) {
            if (response.status == 'ok') {
                product_block.remove();
                $('#cart-total').html(response.data.total);
                if (!response.data.count) {
                    $('#cart .cart-empty').show();
                    $('#cart .cart-buttons').hide();
                    $('#cart .cart-items').hide();
                }
            }
        }, 'json');
        return false;
    });

});
