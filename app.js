require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // 引入 path 模块
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const fileRoutes = require('./routes/fileRoutes'); // 1. 引入文件路由

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 新增代码 ---
// 将 'uploads' 目录设置为静态资源目录
// 这样前端就可以通过 http://your-server.com/uploads/filename.jpg 访问文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: '欢迎来到个人博客后端！' });
});

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/files', fileRoutes); // 2. 注册文件路由

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
