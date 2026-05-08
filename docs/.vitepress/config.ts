import { defineConfig } from 'vitepress'

// GitHub Pages：若仓库为 user.github.io/repo，请把 base 改为 `/repo/`
export default defineConfig({
  title: '面经知识库',
  description: '数据分析 / 商业分析 / 数据科学 / AI Agent / 量化 — 技术栈知识 + 岗位面试题',
  lang: 'zh-CN',
  base: '/mianjing/',
  srcDir: '.',
  lastUpdated: true,

  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '使用说明', link: '/guide/how-to-use' },
      { text: '知识库', link: '/knowledge/' },
      { text: '面试题库', link: '/interviews/' },
      { text: '冲刺路线', link: '/guide/exam-cram' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '如何使用本站', link: '/guide/how-to-use' },
            { text: '学习路线总览', link: '/guide/roadmap' },
            { text: '考前冲刺', link: '/guide/exam-cram' },
          ],
        },
      ],

      '/knowledge/': [
        {
          text: '总览',
          items: [{ text: '知识库首页', link: '/knowledge/' }],
        },
        {
          text: '数据与工程基础',
          collapsed: false,
          items: [
            {
              text: 'SQL 与数据库',
              collapsed: false,
              items: [
                { text: '知识总览', link: '/knowledge/01-data-infrastructure/sql/overview' },
                { text: '00 练习环境', link: '/knowledge/01-data-infrastructure/sql/00-environment' },
                { text: '01 单表查询', link: '/knowledge/01-data-infrastructure/sql/01-basic-query' },
                { text: '02 聚合与分组', link: '/knowledge/01-data-infrastructure/sql/02-aggregation' },
                { text: '03 多表连接', link: '/knowledge/01-data-infrastructure/sql/03-joins' },
                { text: '04 条件统计', link: '/knowledge/01-data-infrastructure/sql/04-case-when' },
                { text: '05 窗口函数', link: '/knowledge/01-data-infrastructure/sql/05-window-functions' },
                { text: '06 业务指标与场景', link: '/knowledge/01-data-infrastructure/sql/06-business-scenarios' },
                { text: '07 综合与面试题', link: '/knowledge/01-data-infrastructure/sql/07-comprehensive-interview' },
              ]
            },
            {
              text: 'Python 数据处理',
              collapsed: true,
              items: [
                { text: '知识总览', link: '/knowledge/02-python-data/python-core/overview' },
              ]
            },
            {
              text: '商业智能 (BI)',
              collapsed: true,
              items: [
                { text: 'Excel / Power BI / Tableau', link: '/knowledge/04-business-product/bi-visualization/overview' },
              ]
            },
          ],
        },
        {
          text: '统计与实验',
          collapsed: false,
          items: [
            { text: '统计学与概率', link: '/knowledge/03-statistics-experiment/statistics/probability-basics' },
            { text: 'A/B 测试与实验设计', link: '/knowledge/03-statistics-experiment/ab-testing/ab-testing' },
          ],
        },
        {
          text: '业务与数据产品',
          collapsed: false,
          items: [
            {
              text: '商业分析',
              collapsed: false,
              items: [
                { text: '指标体系与方法论', link: '/knowledge/04-business-product/business-analysis/metrics-and-methods' },
                { text: '增长与经营分析', link: '/knowledge/04-business-product/business-analysis/growth-and-cases' },
                { text: '案例与表达', link: '/knowledge/04-business-product/business-analysis/communication-and-cases' },
              ]
            },
            {
              text: '产品经理',
              collapsed: false,
              items: [
                { text: '专业术语清单', link: '/knowledge/04-business-product/product-manager/terminology' },
                { text: 'B端电商达人产品实习', link: '/knowledge/04-business-product/product-manager/b2b-ecommerce-creator-intern' },
                { text: '澎博财经：埋点/数据平台/AI Agent', link: '/knowledge/04-business-product/product-manager/pengbo-fintech-product-intern' },
                { text: '卓创资讯：大宗商品数据实习', link: '/knowledge/04-business-product/product-manager/zhuochuang-commodity-data-intern' },
              ]
            },
            {
              text: '数据产品',
              collapsed: true,
              items: [
                { text: '数据仓库与数据产品', link: '/knowledge/01-data-infrastructure/data-warehouse/overview' },
              ]
            }
          ],
        },
        {
          text: '机器学习',
          collapsed: true,
          items: [{ text: '机器学习基础（通用）', link: '/knowledge/05-ai-ml/machine-learning/overview' }],
        },
        {
          text: 'AI Agent',
          collapsed: true,
          items: [
            {
              text: '基础与架构',
              collapsed: false,
              items: [
                { text: '大模型与 API', link: '/knowledge/05-ai-ml/ai-agent/llm-basics' },
                { text: 'Prompt 与上下文', link: '/knowledge/05-ai-ml/ai-agent/prompt-engineering' },
                { text: 'Agent 架构', link: '/knowledge/05-ai-ml/ai-agent/agent-architecture' },
              ]
            },
            {
              text: '核心技术',
              collapsed: false,
              items: [
                { text: 'Tool Calling', link: '/knowledge/05-ai-ml/ai-agent/tool-calling' },
                { text: 'RAG', link: '/knowledge/05-ai-ml/ai-agent/rag' },
              ]
            },
            {
              text: '工程与部署',
              collapsed: true,
              items: [
                { text: '工程基础', link: '/knowledge/05-ai-ml/ai-agent/engineering-basics' },
                { text: '框架生态', link: '/knowledge/05-ai-ml/ai-agent/frameworks' },
                { text: '数据与系统集成', link: '/knowledge/05-ai-ml/ai-agent/data-integration' },
                { text: '评测与可观测', link: '/knowledge/05-ai-ml/ai-agent/evaluation-observability' },
                { text: '安全与合规', link: '/knowledge/05-ai-ml/ai-agent/security' },
                { text: '部署与成本', link: '/knowledge/05-ai-ml/ai-agent/deployment-cost' },
              ]
            },
            {
              text: '业务应用',
              collapsed: true,
              items: [
                { text: '产品场景', link: '/knowledge/05-ai-ml/ai-agent/product-scenarios' },
                { text: '项目复盘：多 Agent 交易决策', link: '/knowledge/06-quant-finance/quant-strategy/project-multi-agent-trading-interview' },
                { text: '学习路线', link: '/knowledge/05-ai-ml/ai-agent/learning-path' },
              ]
            }
          ],
        },
        {
          text: '量化研究',
          collapsed: true,
          items: [
            {
              text: '量化基础',
              collapsed: false,
              items: [
                { text: '岗位与工具速览', link: '/knowledge/06-quant-finance/quant-basics/internship-context' },
                { text: '金融与衍生品', link: '/knowledge/06-quant-finance/quant-basics/finance-and-derivatives' },
                { text: '数学与统计', link: '/knowledge/06-quant-finance/quant-basics/math-and-statistics' },
              ]
            },
            {
              text: '工程与策略',
              collapsed: false,
              items: [
                { text: '编程与数据处理', link: '/knowledge/06-quant-finance/quant-strategy/programming-and-data' },
                { text: '因子与策略评价', link: '/knowledge/06-quant-finance/quant-strategy/factors-and-strategy' },
                { text: '回测与实盘框架', link: '/knowledge/06-quant-finance/quant-strategy/backtest-and-live' },
                { text: '机器学习（量化）', link: '/knowledge/06-quant-finance/quant-strategy/machine-learning' },
                { text: '项目复盘：ETF 监控与面试要点', link: '/knowledge/06-quant-finance/quant-strategy/project-etf-monitoring-interview' },
                { text: '项目复盘：多 Agent 交易决策', link: '/knowledge/06-quant-finance/quant-strategy/project-multi-agent-trading-interview' },
              ]
            }
          ],
        },
      ],

      '/interviews/': [
        {
          text: '总览',
          items: [{ text: '面试题库首页', link: '/interviews/' }],
        },
        {
          text: '数据与分析岗面经',
          collapsed: false,
          items: [
            { text: '高频速览', link: '/interviews/01-data-analytics/highlights' },
            { text: 'SQL 习题', link: '/interviews/01-data-analytics/sql/sql-exercises' },
            { text: 'Python 习题', link: '/interviews/01-data-analytics/python-statistics/python-exercises' },
            { text: '统计学习题', link: '/interviews/01-data-analytics/python-statistics/statistics-exercises' },
            { text: 'BI 与可视化题', link: '/interviews/01-data-analytics/business-warehouse/bi-exercises' },
            { text: '业务与指标题', link: '/interviews/01-data-analytics/business-warehouse/business-exercises' },
            { text: 'A/B 测试题', link: '/interviews/01-data-analytics/business-warehouse/ab-exercises' },
            { text: '产品与增长题', link: '/interviews/01-data-analytics/business-warehouse/growth-exercises' },
            { text: '数仓与数据产品题', link: '/interviews/01-data-analytics/business-warehouse/warehouse-exercises' },
            { text: '机器学习题', link: '/interviews/01-data-analytics/machine-learning/ml-exercises' },
            { text: '综合案例题', link: '/interviews/01-data-analytics/machine-learning/case-exercises' },
          ],
        },
        {
          text: 'AI Agent 岗面经',
          collapsed: false,
          items: [
            { text: '提示词与大模型调用题', link: '/interviews/02-ai-agent/prompt-engineering' },
            { text: '检索增强生成(RAG)真题', link: '/interviews/02-ai-agent/rag-system' },
            { text: 'Agent 架构设计题', link: '/interviews/02-ai-agent/architecture-design' },
          ],
        },
        {
          text: '量化研究岗面经',
          collapsed: false,
          items: [
            { text: '概率与统计推导题', link: '/interviews/03-quant-finance/math-stats' },
            { text: '期权与衍生品定价题', link: '/interviews/03-quant-finance/derivatives' },
            { text: '量化代码与算法题', link: '/interviews/03-quant-finance/coding-algorithms' },
          ],
        },
        {
          text: '产品经理岗面经',
          collapsed: true,
          items: [
            { text: '产品经理面试速记', link: '/interviews/04-product-manager/interview-transcript' },
            { text: '产品嗅觉与需求拆解', link: '/interviews/04-product-manager/product-sense' },
            { text: '策略与交互设计', link: '/interviews/04-product-manager/strategy-design' },
          ],
        },
      ],
    },

    socialLinks: [],
    footer: {
      message: '内容来自本地面经整理，请直接在 docs 目录维护与更新',
    },
  },
})
