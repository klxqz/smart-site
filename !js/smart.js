$("[data-toggle='tooltip']").tooltip({
    container: "body"
});

$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        $(".dialog:visible").trigger('close');
    }
});

$('.dialog').on('click', 'a.dialog-close', function () {
    $(this).closest('.dialog').trigger('close');
    return false;
});
$(document).on('close', '.dialog', function () {
    $(this).closest('.dialog').hide().find('.content').empty();
    $('html').removeClass('dialog-open');
});

function initFormControl(selector) {
    selector.find('input[type=text],input[type=email],input[type=password],select,textarea').addClass('form-control');
    selector.find('input[type=submit],input[type=button]').addClass('btn btn-primary');
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
    $(document).on('click', '.toggle-menu', function () {
        $(this).parent().next().slideToggle('slow');
        return false;
    });

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
            $('html').addClass('dialog-open');
            return false;
        }
        return false;
    });
});

jQuery(function ($) {
    $(document).ready(function () {
        if (!is_autocomplete) {
            return false;
        }
        $('#filter_name').autocomplete({
            delay: 500,
            minLength: 3,
            source: function (request, response) {
                request.term = request.term.replace(/^\s+|\s+$/g, '');
                var query = request.term.replace(/\s+/g, '+');
                $.ajax({
                    url: shop_search_url + '?query=' + encodeURIComponent(query),
                    type: "GET",
                    dataType: "html",
                    success: function (data) {
                        var container = $('<div></div>').append(data);
                        var items = $.map(container.find('.products-category .product-layout:lt(' + 5 + ') .ajax_product_info'), function (item) {
                            return {
                                label: $(item).data('name'),
                                value: $(item).data('name'),
                                url: $(item).data('url'),
                                text: '<div><img src="' + $(item).data('img') + '" /><span class="item-name">' + $(item).data('name') + '</span><span class="item-price">' + $(item).data('price') + '</span></div>'
                            }
                        });

                        if (container.find('.products-category .product-layout').length > 5) {
                            items[items.length] = {
                                label: '' + query,
                                value: '' + query,
                                url: shop_search_url + '?query=' + encodeURIComponent(query),
                                text: show_all_text
                            }
                        }
                        response(items);
                    }
                });
            },
            select: function (event, ui) {
                location.href = ui.item.url;
            }
        }).data("autocomplete")._renderMenu = function (ul, items) {
            $.each(items, function (index, item) {
                $('<li></li>')
                        .data('item.autocomplete', item)
                        .append('<a href="' + item.url + '">' + item.text + '</a>')
                        .appendTo(ul);
            });
        };
    });
});