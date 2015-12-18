function replaceHtml(e) {
    return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function getUrlVar(e, a) {
    var t = String(e).split("?"),
        i = "";
    if (t[1])
        for (var l = t[1].split("&"), r = 0; r <= l.length; r++)
            if (l[r]) {
                var n = l[r].split("=");
                n[0] && n[0] == a && (i = n[1])
            }
    return i
}

function syncImgCbs() {
    $('#adv_ajaxfilter input.filtered[type="checkbox"]').each(function() {
        var e = $(this).next("img");
        e.length && ($(this).is(":checked") ? e.addClass("selected") : e.removeClass("selected"))
    })
}

function filter(e) {
    var a = $("#adv_ajaxfilter").serialize().replace(/[^&]+=\.?(?:&|$)/g, "").replace(/&+$/, ""),
        t = getContainer();
    e || (window.location.hash = a);
    var i = a.hashCode(),
        l = $("#adv_ajaxfilter_route").val(),
        r = $("#adv_ajaxfilter_url").val(),
        n = $(t);
    "product/adv_ajaxfilter" != l && n.length < 1 && (window.location = r + "#" + a), cache[i] ? adv_result(cache[i]) : ($(t).advOverlay(), $("#adv_ajaxfilter").advOverlay(), $.ajax({
        url: "index.php?route=module/adv_ajaxfilter/getproducts",
        type: "POST",
        data: a + (e ? "&getPriceLimits=true" : ""),
        dataType: "json",
        success: function(a) {
            adv_result(a, e), cache[i] = a;
            var t = getContainer();
            $(t).advUnoverlay(), $("#adv_ajaxfilter").advUnoverlay()
        }
    }))
}

function adv_result(e, a) {
    {
        var t = getContainer();
        window.location.hash.substr(1)
    }
    "undefined" != typeof e.result_html && ($(t).parent().html(e.result_html), "list" == localStorage.getItem("display") ? $("#list-view").trigger("click") : $("#grid-view").trigger("click"), afterload(), "" == e.pagination && (e.pagination = '<ul class="pagination"></ul>'), $(".pagination").parent().parent().children().last().html(e.pagination_result), $(".pagination").parent().html(e.pagination), a && e.min_price == e.max_price && $(".price_slider").hide());
    var i = parseInt(e.min_price),
        l = Math.ceil(parseFloat(e.max_price));
    if (a && ($("#slider-range").slider("option", {
            min: i,
            max: l
        }), $("#max_price").val() >= 1 && (i = parseInt($("#min_price").val()), l = parseInt($("#max_price").val())), $("#slider-range").slider("option", {
            values: [i, l]
        }), $("#min_price").val(i), $("#max_price").val(l)), e.totals_data) {
        $("#filter_categories").html(""), e.totals_data.categories.length ? ($.tmpl(cat_tmpl, e.totals_data.categories).appendTo("#filter_categories"), $("#filter_categories").parents(".option_box").show()) : $("#filter_categories").parents(".option_box").hide();
        var r = {};
        $.each(e.totals_data.attributes, function(e, a) {
            r[(a.id + "_" + a.text).replace(/\s/g, "_")] = a.t
        }), $(".a_name").each(function(e, a) {
            var t = $(a).attr("at_v_i").replace(/\s/g, "_"),
                i = replaceHtml(t);
            r[t] ? ($('[at_v_t="' + i + '"]').text($('[at_v_t="' + i + '"]').attr("data-value") + " (" + r[t] + ")"), $(a).removeAttr("disabled")) : ($('[at_v_t="' + i + '"]').text($('[at_v_t="' + i + '"]').attr("data-value")), $(a).attr("disabled", "disabled"), $(a).removeAttr("checked"), $(a).removeAttr(":selected"))
        });
        var n = [];
        $.each(e.totals_data.manufacturers, function(e, a) {
            if (a.id) {
                n[n.length] = a.id;
                var t = $("#manufacturer_" + a.id);
                if (0 == t.length) return;
                t.removeAttr("disabled"), "OPTION" == t.get(0).tagName ? t.text($("#m_" + a.id).val() + " (" + a.t + ")") : $('label[for="manufacturer_' + a.id + '"]').text($("#m_" + a.id).val() + " (" + a.t + ")")
            }
        }), $(".manufacturer_value").each(function() {
            var e = $(this),
                a = e.attr("id").match(/manufacturer_(\d+)/);
            $.inArray(a[1], n) < 0 && (e.attr("disabled", "disabled"), "OPTION" == this.tagName ? (e.text($("#m_" + a[1]).val()), e.prop("selected", !1)) : ($('label[for="manufacturer_' + a[1] + '"]').text($("#m_" + a[1]).val()), e.prop("checked", !1)))
        });
        var o = [];
        $.each(e.totals_data.options, function(e, a) {
            if (a.id) {
                o[o.length] = a.id;
                var t = $("#option_value_" + a.id);
                t.length && (t.removeAttr("disabled"), "OPTION" == t.get(0).tagName ? t.text($("#o_" + a.id).val() + " (" + a.t + ")") : $('label[for="option_value_' + a.id + '"]').text($("#o_" + a.id).val() + " (" + a.t + ")"))
            }
        }), $(".option_value").each(function() {
            var e = $(this),
                a = e.attr("id").match(/option_value_(\d+)/);
            $.inArray(a[1], o) < 0 && (e.attr("disabled", "disabled"), "OPTION" == this.tagName ? (e.text($("#o_" + a[1]).val()), e.attr("selected", !1)) : ($('label[for="option_value_' + a[1] + '"]').text($("#o_" + a[1]).val()), e.attr("checked", !1)))
        })
    }
}

function getContainer() {
    return ".product-layout"
}

function delayedFilter() {
    clearTimeout(timeoutID), $("#adv_ajaxfilter_page").val(0), timeoutID = setTimeout("filter(false, false)", delay)
}
var timeoutID = 0,
    cache = [],
    delay = 1,
    container = "",
    tag_tmpl = $.template(null, '<li><label><input id="tag_${tag}" class="filtered" type="checkbox" name="tags[]" value="${tag}" {{if checked}} checked="checked" {{/if}}><span for="tag_${tag}">${name}</span></label></li>'),
    cat_tmpl = $.template(null, '<li><label><input id="cat_${category_id}" class="filtered" type="checkbox" name="categories[]" value="${category_id}" {{if checked}} checked="checked" {{/if}}><span for="cat_${category_id}">${name}</span></label></li>');
Array.prototype.indexOf || (Array.prototype.indexOf = function(e, a) {
    for (var t = a || 0, i = this.length; i > t; t++)
        if (this[t] === e) return t;
    return -1
}), String.prototype.hashCode = function() {
    var e, a, t = 0;
    if (0 == this.length) return t;
    for (e = 0; e < this.length; e++) a = this.charCodeAt(e), t = (t << 5) - t + a, t &= t;
    return t
}, $(document).on("change", ".price_limit", function() {
    var e = parseInt($("#min_price").val()),
        a = parseInt($("#max_price").val());
    $("#slider-range").slider("values", [e, a]), delayedFilter()
}), $(document).on("change", "#adv_ajaxfilter .filtered", function() {
    delayedFilter()
}), $(function() {
    $("#slider-range").slider({
        range: !0,
        min: 0,
        max: 0,
        values: [0, 0],
        stop: function() {
            delayedFilter()
        },
        slide: function(e, a) {
            $("#min_price").val(a.values[0]), $("#max_price").val(a.values[1])
        }
    }), $("#min_price").val($("#slider-range").slider("values", 0)), $("#max_price").val($("#slider-range").slider("values", 1))
}), 
        $(document).ready(function() {
    container = getContainer(), $(".option_box .option_name").click(function() {
        $(this).siblings(".collapsible").toggle(), $(this).toggleClass("hided")
    }), $(".option_box .attribute_group_name").click(function() {
        $(this).siblings(".attribute_box").toggle(), $(this).toggleClass("hided")
    }), $(".clear_filter").click(function() {
        $("#adv_ajaxfilter img").removeClass("selected"), $("#adv_ajaxfilter select").val(""), $("#adv_ajaxfilter :input").each(function() {
            $(this).is(":checked") && $(this).attr("checked", !1)
        });
        var e = $("#slider-range").slider("option", "min"),
            a = $("#slider-range").slider("option", "max");
        $("#slider-range").slider("option", {
            values: [e, a]
        }), $("#min_price").val(e), $("#max_price").val(a), $("div[id^=slider-range-]").each(function(e, a) {
            var t = this.id.replace(/[^\d]/g, ""),
                i = $(a).slider("option", "min"),
                l = $(a).slider("option", "max");
            hs = $(a).slider(), hs.slider("option", {
                values: [i, l]
            }), hs.slider("option", "slide").call(hs, null, {
                handle: $(".ui-slider-handle", hs),
                values: [i, l]
            }), $("#attribute_value_" + t + "_min").val(""), $("#attribute_value_" + t + "_max").val("")
        }), delayedFilter()
    }), $(document).on("click", ".pagination a", function() {
        var e = $(this).attr("href"),
            a = e.match(/page=(\d+)/);
        $("#adv_ajaxfilter_page").val(a[1]), filter(!1);
        var t = getContainer();
        return $("html, body").animate({
            scrollTop: $(t).offset().top
        }, "slow"), !1
    }), $(".sort select").length && ($(".sort select").get(0).onchange = null, $(".sort select").change(function() {
        var e = $(this).val(),
            a = getUrlVar(e, "sort"),
            t = getUrlVar(e, "order");
        $("#adv_ajaxfilter_sort").val(a), $("#adv_ajaxfilter_order").val(t), delayedFilter()
    })), $(".limit select").length && ($(".limit select").get(0).onchange = null, $(".limit select").change(function() {
        $("#adv_ajaxfilter_limit").val(getUrlVar($(this).val(), "limit")), delayedFilter()
    }));
    var e = window.location.hash.substr(1);
    e && $("instock").is(":visible") && $("instock").is(":checked") && $("instock").attr("checked", !1), $("#adv_ajaxfilter").deserialize(e), syncImgCbs(), $("#adv_ajaxfilter img").bind("click", function() {
        var e = $(this).prev("input");
        e.attr("disabled") || ($(this).toggleClass("selected"), e.prop("checked", !e.prop("checked")), delayedFilter())
    }), $("div[id^=slider-range-]").each(function(e, a) {
        var t = this.id.replace(/[^\d]/g, ""),
            i = window["attr_arr_" + t],
            l = parseInt($("#attribute_value_" + t + "_min").val()),
            r = parseInt($("#attribute_value_" + t + "_max").val());
        l = i.indexOf(l), r = i.indexOf(r), r >= 0 && l >= 0 && (hs = $(a).slider(), hs.slider("option", {
            values: [l, r]
        }), hs.slider("option", "slide").call(hs, null, {
            handle: $(".ui-slider-handle", hs),
            values: [l, r]
        }))
    }), $(".sort select").length && ($("#adv_ajaxfilter_sort").val() ? $(".sort select").each(function() {
        return getUrlVar($(this).val(), "sort") == $("#adv_ajaxfilter_sort").val() && getUrlVar($(this).val(), "order") == $("#adv_ajaxfilter_order").val() ? void $(".sort select").val($(this).val()) : void 0
    }) : ($val = $(".sort select").val(), $("#adv_ajaxfilter_sort").val(getUrlVar($val, "sort")), $("#adv_ajaxfilter_order").val(getUrlVar($val, "order")))), $("#adv_ajaxfilter_limit").length && ($("#adv_ajaxfilter_limit").val() ? $(".limit select").val($("#adv_ajaxfilter_limit").val()) : $("#adv_ajaxfilter_limit").val(getUrlVar($(".limit select").val(), "limit"))), filter(!0, !0)
});