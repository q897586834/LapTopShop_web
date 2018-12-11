const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get("/",(req,res)=>{
var data={
    pageCount:0,
    pno:0,
    products:[]
}
var kw=req.query.kw;
var kws=kw.split(" ");
kws.forEach((elem,i,kws)=>{
    kws[i]=` title like '%${elem}%' `
})
var where=` where ${kws.join(" and ")} `;
var sql=`select *,(select md from xz_laptop_pic where laptop_id=lid LIMIT 1) as md from xz_laptop`;
sql+=where;
pool.query(sql,[],(err,result)=>{
    if(err) console.log(err);
   data={};
   data.pno=req.query.pno;
   data.pageCount=Math.ceil(result.length/9);
   data.products=result.slice(data.pno*9,data.pno*9+9);
   res.send(data);
})
})
module.exports=router;