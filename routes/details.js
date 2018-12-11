const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get("/",(req,res)=>{
    var lid=req.query.lid;
    var obj={
        product:{},
        specs:[],
        pics:[]
    };
    (async function (){
    var sql="select * from xz_laptop where lid=?"
  await new Promise(function(open){
    pool.query(sql,[lid],(err,result)=>{
        if(err)
        console.log(err);
        obj.product=result[0];
        open();
    });
  }) 
    var sql='select lid,spec from xz_laptop where family_id=(SELECT family_id from xz_laptop where lid=?)';
    await new Promise(function(open){
        pool.query(sql,[lid],(err,result)=>{
        if(err)
        console.log(err);
        obj.specs=result;
        open();
    }) 
    })
    var sql='select * from xz_laptop_pic where laptop_id=?';
    await new Promise(function(open){
        pool.query(sql,[lid],(err,result)=>{
        if(err)
        console.log(err);
        obj.pics=result;
        open();
    }) 
    })
    res.writeHead(200,{"Access-Control-Allow-Origin":"*"});
    res.write(JSON.stringify(obj));
    res.end();
    //res.send(obj);
    })();
})
router.post("/add",(req,res)=>{
    if(req.session.uid!==undefined){
      var uid=req.session.uid;
      var lid=req.body.lid;
      var buyCount=req.body.buyCount;
      var sql="select * from xz_shoppingcart_item where user_id=? and product_id=?";
      pool.query(sql,[uid,lid],(err,result)=>{
            if(err)console.log(err);
            if(result.length>0){
            var sql="UPDATE xz_shoppingcart_item SET count=count+?;"
            pool.query(sql,[buyCount],(err,result)=>{
              if(err)console.log(err);
              res.send("200")
            })
          }else{
            var sql="INSERT INTO xz_shoppingcart_item VALUES(NULL,?,?,?,1)";
            pool.query(sql,[uid,lid,buyCount],(err,result)=>{
              if(err) console.log(err);
              res.send("200")
            })
          }
      }) 
    }else{
      res.send("300");
    }
  })
module.exports=router;