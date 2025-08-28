1. 使用shadcn作为ui库，你需要根据需要来添加shadcn/ui的组件
2. 使用`doc/浦东公租房.openapi.yaml`接口文档作为后端数据来源
3. 使用tanstack query管理网络请求
4. 使用tanstack table管理表格数据
5. 所有api添加统一前缀：https://select.pdgzf.com，完整的url应该是例如：https://select.pdgzf.com/api/v1.0/app/gzf/house/list
6. 为了避免跨域问题，需要使用cloudflare worker来代理请求，worker代码在`src/worker/index.ts`中编辑

# 一个租房网页，具有如下功能：
1. 展示可租房源列表
2. 用户可以通过选择户型筛选房源
3. 用户可以通过选择租金范围筛选房源

# 排队功能
用户可以输入自己的许可证有效时间
租房需要排队，网页的房源信息中需要展示目前排队人数和用户的预估排名
排名通过许可证有效时间来算，有效时间越靠前的排名越靠前

# 租房可选户型和typeName的映射关系（typeName为null则不限户型）：
不限 null
一室 1
一室一厅 2
二室 3
二室一厅 4
二室二厅 5
三室 6
三室一厅 7
三室二厅 8
四室 9
五室 10

# 租房可选租金范围（rent）的映射关系
不限 null
1000以下 Below1000
1000-1999 Between1000And1999
2000-2999 Between2000And2999
3000-3999 Between3000And3999
4000-4999 Between4000And4999
5000-5999 Between5000And5999
6000-6999 Between6000And6999
7000-8000 Between7000And8000