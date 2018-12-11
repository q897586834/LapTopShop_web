const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get("/list",(req,res)=>{
    if(req.session.uid!==undefined){
        var uid=req.session.uid;
    var obj={
        product:[],
        details:[],
        iid:[],
        lid:[],
        pic:[]
    };
    (async function (){
    var sql="select iid,product_id,count from xz_shoppingcart_item where user_id=?"
  await new Promise(function(open){
    pool.query(sql,[uid],(err,result)=>{
        if(err)
        console.log(err);
       // console.log(result);
        obj.product=result;
        for(var i=0;i<result.length;i++){
            obj.lid[i]=result[i].product_id;
        }  
        open();
    });
  }) 
  c=obj.lid;
  console.log(c);
  for (var i = 0; i < c.length; i++){
    var sql='select title,spec,price from xz_laptop where lid=?';
    await new Promise(function(open){
        pool.query(sql,[c[i]],(err,result)=>{
        if(err)
        console.log(err);
        console.log(result);
       // console.log(result[i]);
        obj.details[i]=result[0];
        open();
    })   
    })
}
for (var i = 0; i < c.length; i++){
    var sql='select sm from xz_laptop_pic where laptop_id=?';
    await new Promise(function(open){
        pool.query(sql,[c[i]],(err,result)=>{
        if(err)
        console.log(err);
        obj.pic[i]=result[0];      
        open(); 
    }) 
    })
}
console.log(obj);
    res.send(obj);
    })();
}else{
    res.send({code:"300"});
  }
})

router.get("/del", (req, res) => {
    var id = req.query.id;
        var sql = "DELETE FROM xz_shoppingcart_item WHERE product_id=?;";
        pool.query(sql, [id], (err, result) => {
            if (err) console.log(err);
            res.send({
                ok: 1
            })
        })
    

})
module.exports=router;