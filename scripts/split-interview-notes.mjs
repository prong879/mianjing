/**
 * 从 归档/ 下的三份主 Markdown 拆出 docs/knowledge 与 docs/interviews 内容。
 * 运行: npm run docs:split
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

function write(rel, body) {
  const abs = path.join(root, rel)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, body, 'utf8')
}

function between(content, startNeedle, endNeedle) {
  const i = content.indexOf(startNeedle)
  if (i < 0) throw new Error(`Missing start: ${startNeedle}`)
  const rest = content.slice(i)
  if (!endNeedle) return rest.trim()
  const j = rest.indexOf(endNeedle, startNeedle.length)
  if (j < 0) return rest.trim()
  return rest.slice(0, j).trim()
}

/** 按「### 一、」类一级小节拆分（顿号后为标题） */
function splitTopLevelH3Blocks(body) {
  const lines = body.split('\n')
  const blocks = []
  let buf = []
  const isTop = (line) => /^### [一二三四五六七八九十百千]+、/.test(line)

  for (const line of lines) {
    if (isTop(line) && buf.length) {
      blocks.push(buf.join('\n').trim())
      buf = [line]
    } else {
      buf.push(line)
    }
  }
  if (buf.length) blocks.push(buf.join('\n').trim())
  return blocks.filter(Boolean)
}

function withMeta(title, content, extra = '') {
  const fm = `---\ntitle: ${JSON.stringify(title)}\noutline: deep\n---\n\n`
  return fm + (extra ? extra + '\n\n' : '') + content.trim() + '\n'
}

function sourceNoteFixed(relFromDocs) {
  return `> 原文备份路径：\`${relFromDocs}\`（与站点并列，编辑时请直接改归档目录下源文件后重新运行 \`npm run docs:split\`）\n`
}

/* ---------- 数据分析：知识 ---------- */
const DATA_KNOWLEDGE_MAP = [
  { match: 'SQL 与数据库', file: 'knowledge/data-sql/overview.md', title: 'SQL 与数据库基础' },
  { match: '统计学与概率论', file: 'knowledge/statistics-experiment/probability-basics.md', title: '统计学与概率论基础' },
  { match: 'Python 与数据处理', file: 'knowledge/python-data/overview.md', title: 'Python 与数据处理' },
  { match: 'Excel 与 BI', file: 'knowledge/bi-visualization/overview.md', title: 'Excel 与 BI 工具' },
  { match: '业务分析方法论与指标体系', file: 'knowledge/business-analysis/metrics-and-methods.md', title: '业务分析方法论与指标体系' },
  { match: 'A/B 测试与实验设计', file: 'knowledge/statistics-experiment/ab-testing.md', title: 'A/B 测试与实验设计' },
  { match: '用户增长、产品分析与经营分析', file: 'knowledge/business-analysis/growth-and-cases.md', title: '用户增长、产品分析与经营分析' },
  { match: '机器学习与数据挖掘', file: 'knowledge/machine-learning/overview.md', title: '机器学习与数据挖掘基础' },
  { match: '数据仓库与数据产品', file: 'knowledge/data-warehouse-product/overview.md', title: '数据仓库与数据产品基础' },
  { match: '综合题、案例题与面试表达', file: 'knowledge/business-analysis/communication-and-cases.md', title: '综合题、案例题与面试表达' },
]

/* ---------- 数据分析：习题 ---------- */
const DATA_INTERVIEW_MAP = [
  { match: 'SQL 与数据库习题', file: 'interviews/data-analytics/sql-exercises.md', title: 'SQL 与数据库习题' },
  { match: '统计学与概率论习题', file: 'interviews/data-analytics/statistics-exercises.md', title: '统计学与概率论习题' },
  { match: 'Python 与数据处理习题', file: 'interviews/data-analytics/python-exercises.md', title: 'Python 与数据处理习题' },
  { match: 'Excel 与 BI 工具习题', file: 'interviews/data-analytics/bi-exercises.md', title: 'Excel 与 BI 工具习题' },
  { match: '业务分析方法论与指标体系习题', file: 'interviews/data-analytics/business-exercises.md', title: '业务分析方法论与指标体系习题' },
  { match: 'A/B 测试与实验设计习题', file: 'interviews/data-analytics/ab-exercises.md', title: 'A/B 测试与实验设计习题' },
  { match: '用户增长、产品分析与经营分析习题', file: 'interviews/data-analytics/growth-exercises.md', title: '用户增长、产品分析与经营分析习题' },
  { match: '机器学习与数据挖掘习题', file: 'interviews/data-analytics/ml-exercises.md', title: '机器学习与数据挖掘习题' },
  { match: '数据仓库与数据产品习题', file: 'interviews/data-analytics/warehouse-exercises.md', title: '数据仓库与数据产品习题' },
  { match: '综合题与案例题', file: 'interviews/data-analytics/case-exercises.md', title: '综合题与案例题' },
]

/* ---------- AI Agent：知识 ---------- */
const AGENT_KNOWLEDGE_FILES = [
  { match: '编程基础与工程能力', file: 'knowledge/ai-agent/engineering-basics.md', title: '编程基础与工程能力' },
  { match: '大模型基础与 LLM 调用', file: 'knowledge/ai-agent/llm-basics.md', title: '大模型基础与 LLM 调用' },
  { match: 'Prompt Engineering 与上下文设计', file: 'knowledge/ai-agent/prompt-engineering.md', title: 'Prompt Engineering 与上下文设计' },
  { match: 'Tool Calling 与函数调用', file: 'knowledge/ai-agent/tool-calling.md', title: 'Tool Calling 与函数调用' },
  { match: 'RAG 与知识库系统', file: 'knowledge/ai-agent/rag.md', title: 'RAG 与知识库系统' },
  { match: 'Agent 架构与核心机制', file: 'knowledge/ai-agent/agent-architecture.md', title: 'Agent 架构与核心机制' },
  { match: 'Agent 框架与开发生态', file: 'knowledge/ai-agent/frameworks.md', title: 'Agent 框架与开发生态' },
  { match: '数据、数据库与业务系统集成', file: 'knowledge/ai-agent/data-integration.md', title: '数据、数据库与业务系统集成' },
  { match: '评估、测试与可观测性', file: 'knowledge/ai-agent/evaluation-observability.md', title: '评估、测试与可观测性' },
  { match: '安全、合规与可靠性', file: 'knowledge/ai-agent/security.md', title: '安全、合规与可靠性' },
  { match: '部署、性能与成本优化', file: 'knowledge/ai-agent/deployment-cost.md', title: '部署、性能与成本优化' },
  { match: '产品思维与场景落地', file: 'knowledge/ai-agent/product-scenarios.md', title: '产品思维与场景落地' },
  { match: '推荐学习路线', file: 'knowledge/ai-agent/learning-path.md', title: '推荐学习路线' },
]

function pickBlock(blocks, substr) {
  const b = blocks.find((x) => x.includes(substr))
  if (!b) throw new Error(`Block not found: ${substr}`)
  return b
}

function run() {
  const dataPath = '归档/数据分析、商业分析、数据科学面经/数据分析、商业分析、数据科学面经.md'
  const agentPath = '归档/AI Agent面经/AI Agent面经.md'
  const quantPath = '归档/量化面经/量化资料.md'

  const dataFull = read(dataPath)
  const agentFull = read(agentPath)
  const quantFull = read(quantPath)

  const dataPart1 = between(dataFull, '## 第一部分：知识', '## 第二部分：习题')
  const dataPart2 = between(dataFull, '## 第二部分：习题', null)

  const dataBlocks = splitTopLevelH3Blocks(dataPart1.replace(/^## 第一部分：知识\s*/m, ''))
  const dataExerciseBlocks = splitTopLevelH3Blocks(dataPart2.replace(/^## 第二部分：习题\s*/m, ''))

  for (const { match, file, title } of DATA_KNOWLEDGE_MAP) {
    const raw = pickBlock(dataBlocks, match)
    write(`docs/${file}`, withMeta(title, raw, sourceNoteFixed(dataPath)))
  }

  for (const { match, file, title } of DATA_INTERVIEW_MAP) {
    const raw = pickBlock(dataExerciseBlocks, match)
    write(`docs/${file}`, withMeta(title, raw, sourceNoteFixed(dataPath)))
  }

  const agentPart1 = between(agentFull, '## 第一部分：知识', '## 第二部分：问题')
  const agentPart2 = between(agentFull, '## 第二部分：问题', null)

  const agentBlocks = splitTopLevelH3Blocks(agentPart1.replace(/^## 第一部分：知识\s*/m, ''))

  for (const { match, file, title } of AGENT_KNOWLEDGE_FILES) {
    const raw = pickBlock(agentBlocks, match)
    write(`docs/${file}`, withMeta(title, raw, sourceNoteFixed(agentPath)))
  }

  write(
    'docs/interviews/ai-agent/questions.md',
    withMeta('AI Agent 面试题与面经合集', agentPart2, sourceNoteFixed(agentPath)),
  )

  /* 量化：前言 + 第一部分 + 第二部分 */
  const quantHead = between(quantFull, '# 量化面试资料', '## 第一部分：知识')
  const quantPart1 = between(quantFull, '## 第一部分：知识', '## 第二部分：问题')
  const quantPart2 = between(quantFull, '## 第二部分：问题', null)

  write(
    'docs/knowledge/quant-research/internship-context.md',
    withMeta('量化实习岗位说明与工具速览', quantHead, sourceNoteFixed(quantPath)),
  )

  const quantBlocks = splitTopLevelH3Blocks(quantPart1.replace(/^## 第一部分：知识\s*/m, ''))
  const QUANT_MAP = [
    { match: '金融与衍生品基础', file: 'knowledge/quant-research/finance-and-derivatives.md', title: '金融与衍生品基础' },
    { match: '编程与数据处理', file: 'knowledge/quant-research/programming-and-data.md', title: '编程与数据处理' },
    { match: '因子研究与策略评价', file: 'knowledge/quant-research/factors-and-strategy.md', title: '因子研究与策略评价' },
    { match: '回测与实盘框架', file: 'knowledge/quant-research/backtest-and-live.md', title: '回测与实盘框架' },
    { match: '数学与统计学', file: 'knowledge/quant-research/math-and-statistics.md', title: '数学与统计学（量化）' },
    { match: '机器学习与算法及其他', file: 'knowledge/quant-research/machine-learning.md', title: '机器学习与算法及其他' },
  ]

  for (const { match, file, title } of QUANT_MAP) {
    const raw = pickBlock(quantBlocks, match)
    write(`docs/${file}`, withMeta(title, raw, sourceNoteFixed(quantPath)))
  }

  const quantQBlocks = splitTopLevelH3Blocks(quantPart2.replace(/^## 第二部分：问题\s*/m, ''))
  write(
    'docs/interviews/quant/resume-and-hr.md',
    withMeta('量化面试：简历面', pickBlock(quantQBlocks, '简历面'), sourceNoteFixed(quantPath)),
  )
  write(
    'docs/interviews/quant/knowledge-questions.md',
    withMeta('量化面试：知识面', pickBlock(quantQBlocks, '知识面'), sourceNoteFixed(quantPath)),
  )

  injectCrossLinks()

  console.log('docs:split 完成：已写入 knowledge/ 与 interviews/ 下 Markdown。')
}

/** 在生成页中注入稳定导航块（重复运行幂等） */
function injectCrossLinks() {
  const MARKER = '<!-- cross-links -->\n\n'

  const patches = [
    {
      file: 'docs/knowledge/quant-research/programming-and-data.md',
      block: `${MARKER}## 与通用数据向知识的衔接\n\n- 系统 **SQL 考点**：[SQL 与数据库](/knowledge/data-sql/overview)\n- 系统 **pandas 考点**：[Python 数据处理](/knowledge/python-data/overview)\n`,
    },
    {
      file: 'docs/knowledge/quant-research/machine-learning.md',
      block: `${MARKER}## 与通用数据向知识的衔接\n\n- 数据分析岗角度的 ML 基础：[机器学习基础](/knowledge/machine-learning/overview)\n`,
    },
    {
      file: 'docs/knowledge/machine-learning/overview.md',
      block: `${MARKER}## 与量化笔记的衔接\n\n- 因子 / 表格数据语境下的树模型与时序：[机器学习（量化）](/knowledge/quant-research/machine-learning)\n`,
    },
    {
      file: 'docs/knowledge/python-data/overview.md',
      block: `${MARKER}## 与量化笔记的衔接\n\n- **防未来函数**、截面处理与回测清洗：[量化 · 编程与数据处理](/knowledge/quant-research/programming-and-data)\n`,
    },
    {
      file: 'docs/knowledge/data-sql/overview.md',
      block: `${MARKER}## 与量化笔记的衔接\n\n- 截面与窗口函数在量化数据中的用法：[量化 · 编程与数据处理](/knowledge/quant-research/programming-and-data)\n`,
    },
    {
      file: 'docs/knowledge/ai-agent/data-integration.md',
      block: `${MARKER}## 与数据向知识的衔接\n\n- SQL 与数据库基础：[SQL 与数据库](/knowledge/data-sql/overview)\n- 数仓与指标口径：[数据仓库与数据产品](/knowledge/data-warehouse-product/overview)\n`,
    },
  ]

  for (const { file, block } of patches) {
    const abs = path.join(root, file)
    let t = fs.readFileSync(abs, 'utf8')
    if (t.includes('<!-- cross-links -->')) continue
    const m = /(>[^\n]+\n\n)/.exec(t)
    if (!m) continue
    t = t.replace(m[0], m[0] + block)
    fs.writeFileSync(abs, t, 'utf8')
  }
}

run()
