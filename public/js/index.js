new Vue({
  el:"#main",
  data:{
    res:[
      {title:"",details:"",price:0},
    {title:"",details:"",price:0},
    {title:"",details:"",price:0},]
  },
  created() {
    (async function(self){
      var res=await axios.get(
        "http://localhost:3000/index/"
      );
      self.res=res.data;
      var cloaks=document.querySelectorAll("[cloak]");
      for(var c of cloaks)
      c.removeAttribute("cloak");
    })(this)
  },
})

