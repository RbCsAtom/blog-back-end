require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes'); // 1. 引入文章路由

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: '欢迎来到个人博客后端！' });
});

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes); // 2. 注册文章路由

const PORT = process.env.PORT || 3000;

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
