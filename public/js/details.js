(async function () {
  if (location.search.indexOf("lid=") != -1) {
    var lid = location.search.split("=")[1];
 
    var res = await ajax({
      url: "http://localhost:3000/details",
      type: "get",
      data: `lid=${lid}`,
      dataType: "json"
    });
    var { product, specs, pics } = res;
    var { title, subtitle, price, promise } = product;
   
    var html = `<h6 class="font-weight-bold">${title}</h6>
      <h6><a class="small text-dark font-weight-bold" href="javascript:;">${subtitle}</a></h6>
      <div class="alert alert-secondary small" role="alert">
        <div>
          <span>售价：</span>
          <h2 class="d-inline text-danger font-weight-bold">¥${price.toFixed(2)}</h2>
        </div>
        <div>
          <span>服务承诺：</span>
          <span>${promise}</span>
        </div>
      </div>`
    var div = document.getElementById("details");
    div.innerHTML = html + div.innerHTML;

    var html = "";

    for (var s of specs) {
      html += `<a class="btn btn-sm btn-outline-info ${s.lid == lid ? 'active' : ''}" href="product_details.html?lid=${s.lid}">${s.spec}</a>`;
    }
    div.children[4].children[1].innerHTML = html;

    var html = "";
    for (var p of pics) {
      var { sm, md, lg } = p
      html += `<li class="float-left p-1">
          <img src="${sm}" data-md="${md}" data-lg="${lg}">
        </li>`;
    }
    var ul = document.querySelector(
      "#div-lg+div>div>ul"
    );
    ul.innerHTML = html;
    ul.style.width = `${62 * pics.length}px`;
    var mImg = document.querySelector(
      "#preview>div>img"
    );
    mImg.src = pics[0].md;
    var lgDiv = document.getElementById("div-lg");
    lgDiv.style.backgroundImage = `url(${pics[0].lg})`;
  }
 

  var $prev = $("#preview>div>div:last-child>img:first-child");
  var $next = $prev.nextAll("img");
  var $ul = $prev.next().children();
  var moved = 0, LIWIDTH = 62;
  $next.click(function () {
    var $next = $(this);
    if (!$next.is(".disabled")) {
      moved++;
      $ul.css("marginLeft", -LIWIDTH * moved);
      $prev.removeClass("disabled");
      if ($ul.children().length - 4 == moved) {
        $next.addClass("disabled");
      }
    }
  })
  $prev.click(function () {
    var $prev = $(this);
    if (!$prev.is(".disabled")) {
      moved--;
      $next.removeClass("disabled");
      $ul.css("marginLeft", -LIWIDTH * moved);
      if ($ul.children().length - 7 >= moved) {
        $prev.addClass("disabled");
      }
    }
  })

  var $mImg = $("#preview>div>img")
  var $lgDiv = $("#div-lg");
  $ul.on("mouseover", "img", function () {
    var $img = $(this);
    var md = $img.attr("data-md");
    $mImg.attr("src", md);
    $lgDiv.css("backgroundImage", `url(${$img.attr("data-lg")})`)
  })
  var $mask = $("#mask"), $smask = $("#super-mask");
  var MSIZE = 176, SMSIZE = 354, MAX = SMSIZE - MSIZE;;
  $smask.hover(function () {
    $mask.toggleClass("d-none");
    $lgDiv.toggleClass("d-none");
  }).mousemove(function (e) {
    var top = e.offsetY - MSIZE / 2;
    var left = e.offsetX - MSIZE / 2;
    if (top < 0)
      top = 0;
    else if (top > MAX)
      top = MAX;
    if (left < 0)
      left = 0;
    else if (left > MAX)
      left = MAX;
    $mask.css({ top, left });
    $lgDiv.css("backgroundPosition", `${-16 / 7 * left}px ${-16 / 7 * top}px`)
  })

  $(".numberMinus").click(function () {
    var n=$("#buy-num").val();
    if(n>1){
      n--;
      $("#buy-num").val(n);
    }
    
    })
    $(".numberAdd").click(function () {
      var n=$("#buy-num").val();
      n++;
        $("#buy-num").val(n);
    })

    $("body").on('click', "#add_cart, #buy_now", function (e) {
      e.preventDefault();
      //获取购买数量
      var buyCount = $("#buy-num").val();
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/details/add',
        data: {lid:location.search.split('=')[1], buyCount: buyCount},
        success: function(result){
          if(result==300){
            alert('您尚未登录！');         
              location.href = 'login.html';        
          }else if(result==200){
            alert('添加成功！');         
              location.href = 'cart.html';
          }else {
            alert('<b添加失败！</b><p>错误原因为：'+result.msg+'</p>');
          }
        }
      })
    
    })
})()



