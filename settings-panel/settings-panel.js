$(function () {
    function initSettingsPanel(container) {
        $(container).find('.color-settings').each(function () {
            var input = $(this);
            var replacer = $('<span class="color-replacer">' +
                    '<i class="icon16 color" style="background: #' + input.val().substr(1) + '"></i>' +
                    '</span>').insertAfter(input);
            var picker = $('<div style="display:none;" class="color-picker"></div>').
                    insertAfter(replacer);
            var farbtastic = $.farbtastic(picker, function (color) {
                replacer.find('i').css('background', color);
                input.val(color);
            });
            farbtastic.setColor(input.val());
            replacer.click(function () {
                picker.slideToggle(200);
                return false;
            });
            var timer_id;
            input.unbind('keydown').bind('keydown', function () {
                if (timer_id) {
                    clearTimeout(timer_id);
                }
                timer_id = setTimeout(function () {
                    farbtastic.setColor(input.val());
                }, 250);
            });

        });

        $(container).find('input[name="theme_settings[color_scheme]"]').change(function () {
            if ($(this).val() == '!css/skins/skin_custom_color_scheme.png') {
                $(container).find('.custom-color-scheme').show();
            } else {
                $(container).find('.custom-color-scheme').hide();
            }
        });
        $(container).find('input[name="theme_settings[color_scheme]"]').change();

        $(container).find('.select-img').click(function () {
            var name = $(this).data('name');
            var value = $(this).data('value');
            $(container).find('input[name="' + name + '"]').val(value).change();
            $(this).closest('.theme-setting-value').find('.select-img').removeClass('selected');
            $(this).addClass('selected');
            return false;
        });

        $(container).find('.accordion-toggle').click(function () {
            if ($(this).hasClass('collapsed')) {
                $.cookie('settings_panel_collapsible', $(this).attr('href').replace('#', ''), {expires: 30, path: '/'});
            } else {
                $.cookie('settings_panel_collapsible', null, {expires: 30, path: '/'});
            }
        });
        var settings_panel_collapsible = $.cookie('settings_panel_collapsible');
        $(container).find('.accordion-toggle[href="#' + settings_panel_collapsible + '"]').click();

        $(container).find('input[name="theme_settings[homepage_slider_type]"]').change(function () {
            var slider_type = $(this).val();
            $(container).find('.home-slider-setting').hide();
            if (slider_type == 'images') {
                $(container).find('.slider-images').closest('.field').show();
            } else if (slider_type == 'product') {
                $(container).find('.slider-product').show();
            } else if (slider_type == 'products') {
                $(container).find('.slider-products').show();
            }
        });
        $('input[name="theme_settings[homepage_slider_type]"]:checked').change();
    }


    $('.settings-button').click(function () {
        var d = $('#dialog');
        var c = d.find('.content');
        c.html($('#settings-theme-form').clone());
        c.prepend('<a href="#" class="dialog-close"><i class="fa fa-times" aria-hidden="true"></i></a>');
        d.show();
        $('html').addClass('dialog-open');
        initSettingsPanel(d);
        $.cookie('settings_panel_opened', '1', {expires: 1, path: '/'});
        $('.settings-panel .settings-button span').hide();
        return false;
    });

    if (!$.cookie('settings_panel_opened')) {
        $('.settings-panel .settings-button span').hide();
        setTimeout(function () {
            $('.settings-panel .settings-button span').show();
            setTimeout(function () {
                $('.settings-panel .settings-button span').addClass('active');
            }, 1000);
        }, 5000);
    }
});