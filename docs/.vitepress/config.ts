import { defineConfig } from 'vitepress'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import { withMermaid } from 'vitepress-plugin-mermaid'

// Teek：defineTeekConfig 返回可 extends 的片段（含 Vite 插件链、Teek 的 markdown 增强等）
// 详见 https://vp.teek.top/guide/quickstart 与官方仓库 docs/.vitepress/teekConfig.ts
const teekBase = defineTeekConfig({
  // Teek 首页风格（默认即为 true；写明确保进入 themeConfig，便于对照文档调整）
  // 仅要 VitePress 原生首页时改为 false，并保留 vpHome: true（见 TeekConfig.teekHome / vpHome）
    teekHome: false,

  vitePlugins: {
    // vitePlugins.sidebarOption 属于 vitepress-plugin-sidebar-resolve（随 Teek 启用），不是 VitePress 站点级官方字段
    sidebarOption: {
      // 与 Teek 文档站示例一致：手写 themeConfig.sidebar 时用 initItems: false，避免插件再包一层 { items } 与手写结构冲突
      initItems: false,
      ignoreIndexMd: true,
      // 不参与自动生成侧栏的目录名（与插件 ignoreList 约定一致，减少非 .md 资源被扫描时的告警）
      ignoreList: ['新建文件夹'],
    },
  },
})

// GitHub Pages：若仓库为 user.github.io/repo，请把 base 改为 `/repo/`
export default withMermaid(
  defineConfig({
    extends: teekBase,

    title: '面经知识库',
    description:
      '数据分析 / 商业分析 / 数据科学 / AI Agent / 量化 — 技术栈知识 + 岗位面试题',
    lang: 'zh-CN',
    base: '/mianjing/',
    srcDir: '.',
    lastUpdated: true,

    markdown: {
      math: true,
      lineNumbers: true,
    },

    themeConfig: {
      search: {
        provider: 'local',
      },

      darkModeSwitchLabel: '主题',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
      outline: {
        level: [2, 4],
        label: '本页导航',
      },
      docFooter: {
        prev: '上一页',
        next: '下一页',
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
                ],
              },
              {
                text: 'Python 数据处理',
                collapsed: true,
                items: [{ text: '知识总览', link: '/knowledge/02-python-data/python-core/overview' }],
              },
              {
                text: '商业智能 (BI)',
                collapsed: true,
                items: [
                  {
                    text: 'Excel / Power BI / Tableau',
                    link: '/knowledge/04-business-product/bi-visualization/overview',
                  },
                ],
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
                  {
                    text: '指标体系与方法论',
                    link: '/knowledge/04-business-product/business-analysis/metrics-and-methods',
                  },
                  {
                    text: '增长与经营分析',
                    link: '/knowledge/04-business-product/business-analysis/growth-and-cases',
                  },
                  {
                    text: '案例与表达',
                    link: '/knowledge/04-business-product/business-analysis/communication-and-cases',
                  },
                ],
              },
              {
                text: '产品经理',
                collapsed: false,
                items: [
                  { text: '专业术语清单', link: '/knowledge/04-business-product/product-manager/terminology' },
                ],
              },
              {
                text: '数据产品',
                collapsed: true,
                items: [
                  { text: '数据仓库与数据产品', link: '/knowledge/01-data-infrastructure/data-warehouse/overview' },
                ],
              },
            ],
          },
          {
            text: '机器学习',
            collapsed: false,
            items: [
              { text: '知识总览', link: '/knowledge/05-ai-ml/machine-learning/overview' },
              { text: '01 机器学习基石', link: '/knowledge/05-ai-ml/machine-learning/01-foundations' },
              { text: '02 数据先行', link: '/knowledge/05-ai-ml/machine-learning/02-data-preparation' },
              { text: '03 回归与优化', link: '/knowledge/05-ai-ml/machine-learning/03-regression-optimization' },
              { text: '04 分类与树模型', link: '/knowledge/05-ai-ml/machine-learning/04-classification-tree-models' },
              { text: '05 集成学习', link: '/knowledge/05-ai-ml/machine-learning/05-ensemble-learning' },
              { text: '06 无监督学习', link: '/knowledge/05-ai-ml/machine-learning/06-unsupervised-learning' },
              { text: '07 AutoML 与生产', link: '/knowledge/05-ai-ml/machine-learning/07-automl-production' },
              { text: '强化学习', link: '/knowledge/05-ai-ml/reinforcement-learning/overview' },
            ],
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
                ],
              },
              {
                text: '核心技术',
                collapsed: false,
                items: [
                  { text: 'Tool Calling', link: '/knowledge/05-ai-ml/ai-agent/tool-calling' },
                  { text: 'RAG', link: '/knowledge/05-ai-ml/ai-agent/rag' },
                ],
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
                ],
              },
              {
                text: '业务应用',
                collapsed: true,
                items: [
                  { text: '产品场景', link: '/knowledge/05-ai-ml/ai-agent/product-scenarios' },
                  {
                    text: '项目复盘：多 Agent 交易决策',
                    link: '/knowledge/06-quant-finance/quant-strategy/project-multi-agent-trading-interview',
                  },
                  { text: '学习路线', link: '/knowledge/05-ai-ml/ai-agent/learning-path' },
                ],
              },
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
                ],
              },
              {
                text: '工程与策略',
                collapsed: false,
                items: [
                  { text: '编程与数据处理', link: '/knowledge/06-quant-finance/quant-strategy/programming-and-data' },
                  { text: '因子与策略评价', link: '/knowledge/06-quant-finance/quant-strategy/factors-and-strategy' },
                  { text: '回测与实盘框架', link: '/knowledge/06-quant-finance/quant-strategy/backtest-and-live' },
                  { text: '机器学习（量化）', link: '/knowledge/06-quant-finance/quant-strategy/machine-learning' },
                  {
                    text: '项目复盘：ETF 监控与面试要点',
                    link: '/knowledge/06-quant-finance/quant-strategy/project-etf-monitoring-interview',
                  },
                  {
                    text: '项目复盘：多 Agent 交易决策',
                    link: '/knowledge/06-quant-finance/quant-strategy/project-multi-agent-trading-interview',
                  },
                ],
              },
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
            text: '数据科学实习 · 岗位面经',
            collapsed: false,
            items: [
              {
                text: '数巅科技：数据科学实习生',
                link: '/interviews/01-data-analytics/business-analysis/shudian-datascience-intern',
              },
              {
                text: '卓创资讯：大宗商品数据实习',
                link: '/interviews/01-data-analytics/business-analysis/zhuochuang-commodity-data-intern',
              },
            ],
          },
          {
            text: 'AI Agent 岗面经',
            collapsed: false,
            items: [
              { text: '提示词与大模型调用题', link: '/interviews/02-ai-agent/prompt-engineering' },
              { text: '检索增强生成(RAG)真题', link: '/interviews/02-ai-agent/rag-system' },
              { text: 'Agent 架构设计题', link: '/interviews/02-ai-agent/architecture-design' },
              {
                text: 'TenXAI：AI Agent 实习生',
                link: '/interviews/02-ai-agent/tenxai-ai-agent-intern',
              },
              {
                text: '港科大×金融机构：AI系统研发实习生',
                link: '/interviews/02-ai-agent/hkust-financial-ai-intern',
              },
            ],
          },
          {
            text: '量化研究岗面经',
            collapsed: false,
            items: [
              { text: '概率与统计推导题', link: '/interviews/03-quant-finance/math-stats' },
              { text: '期权与衍生品定价题', link: '/interviews/03-quant-finance/derivatives' },
              { text: '量化代码与算法题', link: '/interviews/03-quant-finance/coding-algorithms' },
              {
                text: '策略研究员：岗位描述与问题清单',
                link: '/interviews/03-quant-finance/strategy-researcher-intern',
              },
            ],
          },
          {
            text: '产品经理岗面经',
            collapsed: false,
            items: [
              { text: 'B端电商达人产品实习', link: '/interviews/04-product-manager/b2b-ecommerce-creator-intern' },
              {
                text: '澎博财经：埋点 / 数据平台 / AI Agent',
                link: '/interviews/04-product-manager/pengbo-fintech-product-intern',
              },
              {
                text: '一手万物：AI 产品经理实习',
                link: '/interviews/04-product-manager/yishou-ai-product-manager-intern',
              },
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
  }),
)
