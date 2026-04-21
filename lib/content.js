export const siteMeta = {
  name: '易伴·心迹',
  shortName: '心迹'
};

export const homeContent = {
  badge: 'CAMPUS EMOTIONAL SUPPORT · PILOT VERSION',
  title: '把情绪倾诉变成可留存、可回看、可预警的校园支持体验',
  subtitle:
    '在测试版中，用户可以完成注册登录、开展对话、查看自己的历史记录；当系统识别到持续高压或明显风险信号时，会生成结构化记录，帮助后续支持更及时、更有依据。',
  primaryButton: '开始一次对话',
  secondaryButton: '进入教师导出端',
  featureCards: [
    { no: '01', title: '更稳定的登录体验', desc: '测试阶段采用国内可达的后端托管方案，减少注册与会话掉线问题。' },
    { no: '02', title: '完整记录每次对话', desc: '保留用户输入、系统洞察、风险等级与时间轴，方便回看与复盘。' },
    { no: '03', title: '只导出必要预警信息', desc: '导出端以风险线索为核心，避免无关内容外泄。' }
  ],
  flowTitle: '使用流程',
  flowItems: [
    '注册账号并进入个人工作台',
    '完成一次情绪表达与结构化分析',
    '在历史页回看自己的记录与变化',
    '风险事件在授权前提下纳入教师端周报'
  ],
  noticeTitle: '使用说明',
  zhCardTitle: '请先了解',
  zhNotes: [
    '本产品目前仅用于校内测试与产品验证',
    '它提供陪伴、整理与提醒，不替代正式诊疗',
    '遇到紧急危险情形，请立即联系现实中的老师、家人、医生或急救资源',
    '只有在用户授权的情况下，风险摘要才会进入教师导出端'
  ],
  enCardTitle: 'BEFORE YOU START',
  enNotes: [
    'This product is currently for pilot testing only.',
    'It offers support, reflection, and reminders, but does not replace formal diagnosis or therapy.',
    'In an urgent crisis, seek real-world help immediately.',
    'Risk summaries are exported only when the user has granted consent.'
  ]
};

export const authContent = {
  title: '欢迎回来',
  subtitle: '创建测试账号后即可进入个人工作台，开始记录每天的情绪与想法。',
  signUpTitle: '创建账号',
  signInTitle: '账号登录',
  emailLabel: '邮箱',
  passwordLabel: '密码',
  signUpButton: '创建并进入',
  signInButton: '登录',
  helper: '测试阶段建议使用常用邮箱，便于后续识别账号与导出记录。'
};

export const chatContent = {
  title: '今天，想先从哪一句话开始？',
  subtitle: '把模糊的情绪说出来，系统会帮你整理成更清晰的记录。',
  textareaLabel: '输入今天最想说的一段话',
  textareaPlaceholder:
    '例如：这段时间一直很紧绷，白天还能撑住，晚上一个人时就会反复怀疑自己。',
  sendButton: '生成本次记录',
  working: '正在整理中...',
  cards: {
    reply: '陪伴回应',
    insight: '状态洞察',
    journal: '记录草稿',
    abc: 'ABC 线索整理',
    followup: '下一步建议',
    risk: '风险提醒'
  },
  consentLabel: '如识别到明显风险，我同意将必要的风险摘要纳入教师端导出，用于后续支持。',
  appointmentButton: '前往预约心理支持',
  appointmentHint: '点击后将跳转到学校提供的预约入口。'
};

export const historyContent = {
  title: '我的记录',
  subtitle: '按时间查看过往输入、系统洞察与风险提醒。',
  empty: '你还没有生成任何记录，先去完成第一次对话。'
};

export const adminContent = {
  title: '教师导出端',
  subtitle: '仅汇总必要风险线索，帮助老师把注意力放在真正需要及时支持的学生身上。',
  accessKeyLabel: '导出访问码',
  daysLabel: '统计最近天数',
  exportButton: '导出 Excel 周报',
  helper:
    '导出结果会记录操作时间、操作者与筛选范围，便于审计追踪。'
};
