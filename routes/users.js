const express = require("express");
const router = express.Router();
const pool = require("../pool");

router.post("/check", (req, res) => {
  var uname = req.body.uname;
  var upwd = req.body.upwd;
  var sql = 'SELECT uname FROM xz_user where uname=?';
  pool.query(sql, [uname], (err, result) => {
    if (result.length > 0) {
      res.send("-1");
    } else if (!uname) {
      res.send("-2");
    } else if (!upwd) {
      res.send("-3")
    } else if (result.length == 0) {
      res.send("1");
    }

  });
})
router.post("/go", (req, res) => {
  var obj = req.body;
  var uname = obj.uname;
  var upwd = obj.upwd;
  var email = obj.email;
  var phone = obj.phone;
  var user_name = obj.user_name;
  console.log(uname);
  var sql = 'INSERT INTO xz_user VALUES(NULL,?,?,?,?,NULL,?,NULL)';
  pool.query(sql, [uname, upwd, email, phone, user_name], (err, result) => {
    if (err) throw err;
    res.send(`<script>alert('注册成功');location.href='http://localhost:3000/login.html'</script>`);
  });
})
router.post("/signin",(req,res)=>{
  var {uname,upwd}=req.body;
  console.log(uname);
  console.log(upwd);
  var sql="select * from xz_user where uname=? and upwd=?";
  pool.query(sql,[uname,upwd],(err,result)=>{
    if(err) console.log(err);
    res.writeHead(200,{
      "Content-Type":"application/json;charset=utf-8"
    });
    if(result.length>0){
      req.session.uid=result[0].uid;
      res.write(JSON.stringify({ok:1}))
    }else
      res.write(JSON.stringify({
        ok:0, msg:"用户名或密码错误"
      }))
    res.end();
    //http://localhost:3000/users/signin/?uname=dingding&upwd=123456
  })
})
router.get("/islogin",(req,res)=>{
  if(req.session.uid!==undefined){
    var uid=req.session.uid;
    var sql="select * from xz_user where uid=?";
    pool.query(sql,[uid],(err,result)=>{
      if(err) console.log(err);
      res.send({ok:1,uname:result[0].uname})
    })
  }else{
    res.send({ok:0})
  }
})
router.get("/signout",(req,res)=>{
 req.session.uid=undefined;
 res.send();
})


module.exports = router;