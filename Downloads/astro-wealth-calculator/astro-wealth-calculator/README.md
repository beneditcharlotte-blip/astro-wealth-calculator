# 星盘财富等级预测网站

基于西方占星学的财富等级预测工具。

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 本地开发
```bash
pnpm run dev
```

### 构建生产版本
```bash
pnpm run build
```

### 部署到Vercel
```bash
vercel --prod
```

## 📋 功能

- ✅ 星盘财富等级预测（A6-A9）
- ✅ 详细的占星学分析
- ✅ 财富获取模式识别
- ✅ 个性化财务建议
- ✅ 关键财富周期提示

## 🔮 分析内容

### 第一步：财富核心宫位与征象星
- 第二宫（正财宫）分析
- 第八宫（偏财宫）分析
- 金星力量评估
- 木星力量评估

### 第二步：财富格局与模式
- 行星状态评估（庙旺落陷）
- 相位联动分析（吉凶相位）
- 星群能量聚焦
- 财富获取模式识别

### 第三步：综合评估
- 财富等级评定（A6-A9）
- 详细的格局描述
- 个性化的财务建议
- 关键财富周期提示

## 💻 技术栈

- React 18 + TypeScript
- Vite 6
- TailwindCSS 4
- Motion (Framer Motion)
- Radix UI

## 📁 项目结构

```
src/
├── app/
│   ├── components/
│   │   ├── Landing.tsx      # 首页
│   │   ├── Home.tsx         # 表单页面
│   │   ├── Analyzing.tsx    # 分析页面
│   │   ├── Result.tsx       # 结果页面
│   │   └── Layout.tsx       # 布局组件
│   ├── routes.ts            # 路由配置
│   └── App.tsx              # 主应用
└── utils/
    └── localAstrology.ts    # 占星学计算引擎
```

## 🔐 环保变量

如果需要使用真实的Astrology API，在`.env.local`中添加：

```
VITE_ASTROLOGY_API_USER_ID=your_user_id
VITE_ASTROLOGY_API_KEY=your_api_key
```

## 📝 许可证

MIT
