new Vue ({
    el:"#main",
    data() {
      return {
          list:[],
          pic:[],
          product:[],
          cheAll:"img/cart/product_true.png",
          che:"img/cart/product_true.png",
          check:{
            true:"img/cart/product_true.png",
            false:"img/cart/product_normal.png",
      },
          img:[],
          sum:[],
          count:[],
          lid:[]
      };
    },
    methods: {
         goSub(i) {
                if(this.product[i].count>0)
                this.product[i].count--;
                if(this.product[i].count==0)
                this.list.splice(i-1,1);
                this.getImg();
                this.getCount();   
      },
      goAdd(i) {
                if(this.product[i].count<99)
                this.product[i].count++;  
                this.getImg();
                this.getCount(); 
      },
      goDel(i){
        var id=this.lid[i];
        var url = "http://localhost:3000/cart/del?id="+id;
        this.$http.get(url).then(result => {
          alert("删除成功!")
          window.history.go(0);
        });
      },
       getCartList() {
        this.$http.get("http://localhost:3000/cart/list").then(result => {
         console.log(result)    
          this.list = result.body.details;
          this.pic = result.body.pic;
          this.product = result.body.product; 
          this.lid = result.body.lid; 
          //console.log(this.list)
        });
      },
      changeAll(){
          if(this.cheAll==this.check.false){
            this.cheAll=this.check.true;
            this.che=this.check.true;
          }else{
            this.cheAll=this.check.false;
            this.che=this.check.false;
          }
          this.getImg();
          this.getCount();
      },
      change(e){
        var el=e.target;
        if(el.src=="http://localhost:3000/img/cart/product_true.png"){
          el.src=this.check.false;
          this.cheAll=this.check.false;
        }else{
          el.src=this.check.true;
        }
        this.getImg();
        this.getCount();
      },
      getImg(){
          var count=0; 
          setTimeout(() => {
            this.img = document.querySelectorAll(".my_check");  
            for(var i in this.list){
               if(this.img[i].currentSrc=="http://localhost:3000/img/cart/product_true.png")
               count+=this.list[i].price*this.product[i].count;
              }
               this.sum=count;
              
          }, 100);
      },
      getCount(){
        var sum=0; 
        setTimeout(() => {
          this.img = document.querySelectorAll(".my_check");  
          for(var i in this.list){
             if(this.img[i].currentSrc=="http://localhost:3000/img/cart/product_true.png")
             sum=sum+1;
             if(sum==this.list.length)
             this.cheAll=this.check.true;
            }
             this.count=sum;   
        }, 100);
    },
    goBuy(){
      var url="http://localhost:3000/buy.html?count="+ this.sum;
      location.href = url;
    }
    },
    created() {
       this.getCartList();
    },
    mounted() {
      this.getImg();
      this.getCount();
    },
    computed:{
  }
  });