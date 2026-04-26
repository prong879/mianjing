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
                { text: '知识总览', link: '/knowledge/data-sql/overview' },
                { text: '00 练习环境', link: '/knowledge/data-sql/00-environment' },
                { text: '01 单表查询', link: '/knowledge/data-sql/01-basic-query' },
                { text: '02 聚合与分组', link: '/knowledge/data-sql/02-aggregation' },
                { text: '03 多表连接', link: '/knowledge/data-sql/03-joins' },
                { text: '04 条件统计', link: '/knowledge/data-sql/04-case-when' },
                { text: '05 窗口函数', link: '/knowledge/data-sql/05-window-functions' },
                { text: '06 业务指标与场景', link: '/knowledge/data-sql/06-business-scenarios' },
                { text: '07 综合与面试题', link: '/knowledge/data-sql/07-comprehensive-interview' },
              ]
            },
            {
              text: 'Python 数据处理',
              collapsed: true,
              items: [
                { text: '知识总览', link: '/knowledge/python-data/overview' },
              ]
            },
            {
              text: '商业智能 (BI)',
              collapsed: true,
              items: [
                { text: 'Excel / Power BI / Tableau', link: '/knowledge/bi-visualization/overview' },
              ]
            },
          ],
        },
        {
          text: '统计与实验',
          collapsed: false,
          items: [
            { text: '统计学与概率', link: '/knowledge/statistics-experiment/probability-basics' },
            { text: 'A/B 测试与实验设计', link: '/knowledge/statistics-experiment/ab-testing' },
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
                { text: '指标体系与方法论', link: '/knowledge/business-analysis/metrics-and-methods' },
                { text: '增长与经营分析', link: '/knowledge/business-analysis/growth-and-cases' },
                { text: '案例与表达', link: '/knowledge/business-analysis/communication-and-cases' },
              ]
            },
            {
              text: '数据产品',
              collapsed: true,
              items: [
                { text: '数据仓库与数据产品', link: '/knowledge/data-warehouse-product/overview' },
              ]
            }
          ],
        },
        {
          text: '机器学习',
          collapsed: true,
          items: [{ text: '机器学习基础（通用）', link: '/knowledge/machine-learning/overview' }],
        },
        {
          text: 'AI Agent',
          collapsed: true,
          items: [
            {
              text: '基础与架构',
              collapsed: false,
              items: [
                { text: '大模型与 API', link: '/knowledge/ai-agent/llm-basics' },
                { text: 'Prompt 与上下文', link: '/knowledge/ai-agent/prompt-engineering' },
                { text: 'Agent 架构', link: '/knowledge/ai-agent/agent-architecture' },
              ]
            },
            {
              text: '核心技术',
              collapsed: false,
              items: [
                { text: 'Tool Calling', link: '/knowledge/ai-agent/tool-calling' },
                { text: 'RAG', link: '/knowledge/ai-agent/rag' },
              ]
            },
            {
              text: '工程与部署',
              collapsed: true,
              items: [
                { text: '工程基础', link: '/knowledge/ai-agent/engineering-basics' },
                { text: '框架生态', link: '/knowledge/ai-agent/frameworks' },
                { text: '数据与系统集成', link: '/knowledge/ai-agent/data-integration' },
                { text: '评测与可观测', link: '/knowledge/ai-agent/evaluation-observability' },
                { text: '安全与合规', link: '/knowledge/ai-agent/security' },
                { text: '部署与成本', link: '/knowledge/ai-agent/deployment-cost' },
              ]
            },
            {
              text: '业务应用',
              collapsed: true,
              items: [
                { text: '产品场景', link: '/knowledge/ai-agent/product-scenarios' },
                { text: '学习路线', link: '/knowledge/ai-agent/learning-path' },
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
                { text: '岗位与工具速览', link: '/knowledge/quant-research/internship-context' },
                { text: '金融与衍生品', link: '/knowledge/quant-research/finance-and-derivatives' },
                { text: '数学与统计', link: '/knowledge/quant-research/math-and-statistics' },
              ]
            },
            {
              text: '工程与策略',
              collapsed: false,
              items: [
                { text: '编程与数据处理', link: '/knowledge/quant-research/programming-and-data' },
                { text: '因子与策略评价', link: '/knowledge/quant-research/factors-and-strategy' },
                { text: '回测与实盘框架', link: '/knowledge/quant-research/backtest-and-live' },
                { text: '机器学习（量化）', link: '/knowledge/quant-research/machine-learning' },
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
            {
              text: '高频速览',
              collapsed: false,
              items: [
                { text: '高频速览', link: '/interviews/data-analytics/highlights' },
              ]
            },
            {
              text: 'SQL 实战题',
              collapsed: false,
              items: [
                { text: 'SQL 习题', link: '/interviews/data-analytics/sql-exercises' },
                { text: 'SQL 7 天专项训练', link: '/interviews/data-analytics/sql-7day-camp' },
              ]
            },
            {
              text: 'Python 与统计题',
              collapsed: false,
              items: [
                { text: '统计学习题', link: '/interviews/data-analytics/statistics-exercises' },
                { text: 'Python 习题', link: '/interviews/data-analytics/python-exercises' },
              ]
            },
            {
              text: '业务与数仓题',
              collapsed: false,
              items: [
                { text: 'BI 习题', link: '/interviews/data-analytics/bi-exercises' },
                { text: '业务与指标习题', link: '/interviews/data-analytics/business-exercises' },
                { text: 'A/B 与因果习题', link: '/interviews/data-analytics/ab-exercises' },
                { text: '增长与产品习题', link: '/interviews/data-analytics/growth-exercises' },
                { text: '数仓与数据产品习题', link: '/interviews/data-analytics/warehouse-exercises' },
              ]
            },
            {
              text: '机器学习与综合',
              collapsed: true,
              items: [
                { text: '机器学习习题', link: '/interviews/data-analytics/ml-exercises' },
                { text: '综合案例题', link: '/interviews/data-analytics/case-exercises' },
              ]
            }
          ],
        },
        {
          text: 'AI Agent 岗面经',
          collapsed: false,
          items: [
            {
              text: '高频面经与设计题',
              collapsed: false,
              items: [
                { text: '高频速览', link: '/interviews/ai-agent/highlights' },
                { text: '面试题与面经合集', link: '/interviews/ai-agent/questions' },
              ]
            }
          ],
        },
        {
          text: '量化研究岗面经',
          collapsed: false,
          items: [
            {
              text: '量化实战与推导',
              collapsed: false,
              items: [
                { text: '高频速览', link: '/interviews/quant/highlights' },
                { text: '简历面', link: '/interviews/quant/resume-and-hr' },
                { text: '知识面', link: '/interviews/quant/knowledge-questions' },
              ]
            }
          ],
        },
        {
          text: '产品经理岗面经',
          collapsed: true,
          items: [
            {
              text: '产品基础与业务',
              collapsed: false,
              items: [
                { text: '问题清单', link: '/interviews/product-manager/jd-and-qa' },
                { text: '术语清单', link: '/interviews/product-manager/glossary' },
              ]
            }
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
