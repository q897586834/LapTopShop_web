//创建mysql连接池
const mysql = require('mysql');
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'xz',
  connectionLimit: 10 
});
//把创建好的连接池导出
module.exports = pool;




