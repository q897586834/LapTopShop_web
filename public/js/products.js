$(function () {
  var pno = 0;
  function loadPage(pno = 0) {
    if (location.search.indexOf("kw=") != -1) {
      var kw = decodeURI(location.search.split("=")[1]);

      $.ajax({
        url: "http://localhost:3000/products/",
        type: "get",
        data: { kw, pno },
        dataType: "json",
        success: function (data) {
          var { pno, pageCount, products } = data;
          var html = "";
          for (var { lid, md, price, title } of products) {
            html += `<div class="col-md-4 p-1">
<div class="card mb-4 box-shadow pr-2 pl-2">
<a href="product_details.html?lid=${lid}" class="p_id">
<img class="card-img-top" src="${md}">
</a>
<div class="card-body p-0">
<h5 class="text-primary p_price" id="${lid}">￥${price.toFixed(2)}</h5>
<p class="card-text">
<a href="product_details.html?lid=${lid}" class="text-muted small p_title"  title="￥${title}">${title}</a>
</p>
<div class="d-flex justify-content-between align-items-center p-2 pt-0">
<button class="btn btn-outline-secondary p-0 border-0 " type="button">-</button>
<input type="text" class="form-control p-1 p_num" value="1" >
<button class="btn btn-outline-secondary p-0 border-0" type="button">+</button>
<div class="btn btn-primary float-right ml-1 pl-1 pr-1 addcart"  data-lid="${lid}">加入购物车</div>
</div>
</div>
</div>
</div> `


          }
          $("#plist").html(html);

          var html = `<li class="page-item"><a class="page-link bg-transparent" href="#">上一页</a></li>`;
          for (var i = 1; i <= pageCount; i++) {
            html += ` <li class="page-item ${pno == i - 1 ? 'active' : ''}"><a class="page-link ${pno != i - 1 ? 'bg-transparent' : 'border'}" href="#">${i}</a></li>`
          }
          html += `<li class="page-item"><a class="page-link bg-transparent" href="#">下一页</a></li>`;
          var $page = $(".pagination");
          $page.html(html);
          if (pno == 0)
            $page.children(":first").addClass("disabled");
          if (pno == pageCount - 1)
            $page.children(":last").addClass("disabled");

          // 购物车加减

          $(".card-body>div").on("click", "button", function () {
            var $button = $(this);
            if ($button.html() == "-") {
              var a = $button.next().val();
              if (a > 1) {
                a--;
              }
              $button.next().val(a);
            }
            if ($button.html() == "+") {
              var a = $button.prev().val();
              a++;
              $button.prev().val(a);
            }
          })
          ////////////////////////////////////////////////////////////
        }
      })
    }

  }
  loadPage();

  $(".pagination").on("click", "a", function (e) {
    e.preventDefault();
    var $a = $(this)
    if (!$a.parent().is(".disabled,.active")) {

      if ($a.html() == "上一页") {
        var i = 0;
        while (!$(`.pagination>li:eq(${i})`).is(".active")) {
          i++;
        }
        var pno = i - 2;

      } else if ($a.html() == "下一页") {
        var i = 0;
        while (!$(`.pagination>li:eq(${i})`).is(".active")) {
          i++;
        }
        var pno = i;

      } else {
        var pno = $a.html() - 1;
      }
      loadPage(pno);
    }
  })
  $('#plist').on('click', '.addcart', function () {
    var title = $(this).parent().parent().find('.p_title').html();
    var id = $(this).parent().parent().parent().find('.p_title').attr('href').split("=")[1];
    var price = $(this).parent().parent().find('.p_price').html().substring(1);
    var num = $(this).parent().find('.p_num').val();
    var length = $('.store_action_right_cart_content>div').length;
    var one_total_price = (price * num).toFixed(2);
    $('.store_action_right_cart_content>div').each(function () {
      if ($(this).attr('id') === id) {
        var one_cartnum = parseFloat($(this).find('input').val());
        var one_cartprice = parseFloat($(this).find('.cart_unit_price').html());
        var newnum = one_cartnum + parseFloat(num);
        $(this).find('input').val(newnum);
        $(this).find('.cart_unit_price').html((one_cartprice + parseFloat(one_total_price)).toFixed(2));
      }
      else {
        length--;
        if (length === 0) {
          var html = `<div id=${id} class='addtion'><span style='display: inline-block;
        width:75px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'
         title=${title}>${title}</span><div><span class='cart_reduc lf'>-</span><input type='text' value=${num}
         class='lf'/><span class='cart_add lf'>+</span></div><span class='rt pc'>
         ￥:<span class='cart_unit_price'>${one_total_price}</span></span></div>`;
          $('.store_action_right_cart_content').append(html);
        }
      }
    })
    total();
  })
  function total() {
    var total = parseFloat(0.00);
    $('.store_action_right_cart_content>div.addtion').each(function () {
      var op = parseFloat($(this).find('.cart_unit_price').text());
      total += op;
    })
    $('.total_price span').html(total.toFixed(2));
  }

  $('.store_action_right_cart_content').on('click', '.cart_reduc', function () {
    var numone = parseFloat($(this).next('input').val());
    numone -= 1;
    if (numone == 0) {
      $(this).parent().parent().remove();
    }
    if (numone >= 1) {
      $(this).next('input').val(numone);
      var id = $(this).parent().parent().attr('id');
      var this_price = $('#plist').find("#" + id).html().substring(1);
      var new_this_price = numone * this_price;
      $(this).parent().next('span').find('.cart_unit_price').html(new_this_price.toFixed(2));
    }
    update();
  });
  $('.store_action_right_cart_content').on('click', '.cart_add', function () {
    var numtwo = parseFloat($(this).prev('input').val());
    numtwo += 1;
    $(this).prev('input').val(numtwo);
    var id = $(this).parent().parent().attr('id');
    var this_price = $('#plist').find("#" + id).html().substring(1);
    var new_this_price = numtwo * this_price;
    $(this).parent().next('span').find('.cart_unit_price').html(new_this_price.toFixed(2));
    update();
  })

  function update() {
    var update_total = parseFloat(0.00);
    $('.store_action_right_cart_content>div.addtion').each(function () {
      var tp = parseFloat($(this).find('.cart_unit_price').html());
      update_total += tp;
    })
    $('.total_price>span').html(update_total.toFixed(2));
  }

  $('.clear').click(function () {
    $('.addtion').remove();
    var clear_total = 0;
    $('.total_price>span').text(clear_total.toFixed(2));
  })

})
