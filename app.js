require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const fileRoutes = require('./routes/fileRoutes');
const tagRoutes = require('./routes/tagRoutes'); // 1. 引入标签路由

const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("uploads 文件夹已自动创建。");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.json({ message: '欢迎来到个人博客后端！' });
});

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/tags', tagRoutes); // 2. 注册标签路由

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