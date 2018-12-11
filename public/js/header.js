$(function(){
    $(`<link rel="stylesheet" href="css/header.css">`).appendTo("head");
    $.ajax({
        url:"header.html",
        type:"get",
        success:function(res){
            $(res).replaceAll("#header");
            var vm=new Vue({
                el:"#header",
                data:{
                    islogin:false,
                    keyword:"",
                    uname:""
                },
                mounted(){
                    var self=this;
                    this.$http.get("http://localhost:3000/users/islogin").then(res=>{
                      if(res.data.ok==1){
                        self.islogin=true;
                        self.uname=res.data.uname;
                      }else
                        self.islogin=false;
                    })
                  },
                  
                methods:{
                    search_click(){
                       location.href=`http://localhost:3000/products.html?kw=${this.keyword}`
                    },
                    signout(){
                        this.$http.get("http://localhost:3000/users/signout").then(res=>{
                          //this.$router.go(0) //history.go(0)
                          location.href=`http://localhost:3000/index.html`
                        })
                      }
                }
            })
            var $search=$("#header>nav>div>div>div>img");
            var $input=$search.parent().prev();
            if(location.search.indexOf("kw=")!=-1){
                var kw=location.search.split("=")[1];
                $input.val(decodeURI(kw));
            }
        }
    })
})