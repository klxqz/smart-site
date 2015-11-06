function initFormControl(selector) {
    selector.find('input[type=text],input[type=password],select,textarea').addClass('form-control');
    selector.find('input[type=submit]').addClass('btn btn-primary');
}

function initDialogHendler(d, url) {
    var c = d.find('.content');
    c.prepend('<a href="#" class="dialog-close">&times;</a>');

    c.find('form').submit(function () {
        postDialogForm(d, $(this), url);
        return false;
    });
    c.find('a').click(function () {
        if ($(this).attr('href') != '#') {
            if ($(this).closest('.wa-auth-adapters').length) {
                $(".dialog:visible").hide().find('.cart').empty();
                return false;
            }
            loadDialogContent(d, $(this).attr('href'));
            return false;
        }
    });
}


function postDialogForm(d, f, url) {
    var c = d.find('.content');
    c.html('<i class="icon32 loading"><i>');
    $.post(url, f.serializeArray(), function (response) {
        if (!$(response).find('.wa-value .wa-error-msg').length) {
            window.location.href = url;
        } else {
            c.html($(response).find('#content >'));
            initDialogHendler(d, url);
        }
    });
}

function loadDialogContent(d, url) {
    var c = d.find('.content');
    c.html('<i class="icon32 loading"><i>');
    c.load(url + ' #content >', function () {
        initDialogHendler(d, url);
        initFormControl(d);
    });
    d.show();
}
$(document).ready(function () {
    initFormControl($('#content'));

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

    $(document).on('click', '.modal-dialog-url', function () {
        var url = $(this).attr('href');
        if (url) {
            var d = $('#dialog');
            loadDialogContent(d, url);
            return false;
        }
        return false;
    });
});
