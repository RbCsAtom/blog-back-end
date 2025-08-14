require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes'); // 引入用户路由

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎来到个人博客后端！' });
});

// 使用用户路由，所有 /api/users 的请求都会被转发到 userRoutes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

// 连接数据库并启动服务器
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`服务器正在端口 ${PORT} 上运行。`);
      console.log('数据库连接成功。');
    });
  })
  .catch(err => {
    console.error('无法连接到数据库:', err);
  });
