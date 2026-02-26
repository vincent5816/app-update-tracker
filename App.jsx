import { useState, useEffect } from "react";

const INITIAL_APPS = [
  {
    id: "character-ai",
    name: "Character.AI",
    icon: "C",
    source: "website",
    sourceLabel: "官方博客",
    sourceUrl: "https://blog.character.ai/news/product/",
    keywords: ["introducing", "launch", "new", "update", "feature", "announcing"],
    lastChecked: "2026-02-25",
    updates: [
      { id: "cai-5", date: "2026-02-04", version: null, title: "c.ai Labs 发布", summary: "推出 c.ai labs，专注于 AI 娱乐领域的快速实验平台，探索新内容格式与创作方式。", tags: ["新产品"], isNew: true },
      { id: "cai-4", date: "2025-12-18", version: null, title: "Charms 上线", summary: "推出 Charms 功能，一种解锁平台更多内容与权益的新方式。", tags: ["新功能"], isNew: false },
      { id: "cai-3", date: "2025-11-25", version: null, title: "Stories 推出", summary: "上线 Stories 格式，用户可创建并分享以角色为主角的冒险故事。", tags: ["新功能"], isNew: false },
      { id: "cai-2", date: "2025-10-16", version: null, title: "Scenes 对全用户开放", summary: "短角色扮演场景功能 Scenes 向所有用户开放创作，将聊天转化为沉浸式故事体验。", tags: ["功能开放"], isNew: false },
      { id: "cai-1", date: "2025-08-04", version: null, title: "AI 原生社交 Feed 上线", summary: "发布全球首个 AI 原生社交 Feed，可动态浏览角色、Scenes、Streams 及创作者内容。", tags: ["新功能"], isNew: false },
    ],
  },
  {
    id: "xingye",
    name: "星野 App",
    icon: "★",
    source: "xiaohongshu",
    sourceLabel: "小红书",
    sourceUrl: "https://www.xiaohongshu.com/user/profile/61d81f810000000010008a5a",
    keywords: ["版本", "上线", "功能", "更新", "公告", "升级", "修复"],
    lastChecked: "2026-02-25",
    updates: [
      { id: "xingye-5", date: "2026-02-14", version: null, title: "秘密空间上线", summary: "情人节当天正式全量上线，初期 bug 已修复，需更新至最新版本解锁。", tags: ["新功能"], isNew: true },
      { id: "xingye-4", date: "2025-12-23", version: "2.43", title: "星工坊 & 主控形象", summary: "星工坊上线：支持制作表情包、一键换装、棉花娃娃、身份卡、双人图、漫画。主控系统开启。", tags: ["版本更新", "新功能"], isNew: false },
      { id: "xingye-3", date: "2025-12-12", version: "2.42", title: "星野圈内测 & 星之印上线", summary: "星野圈社区功能内测开启；星之印上线；智能体内心戏权益（思考模型）发布。", tags: ["版本更新", "内测"], isNew: false },
      { id: "xingye-2", date: "2025-11-01", version: null, title: "打电话 / 市集回归 · 重说优化", summary: "打电话与市集功能回归；省略号重说逻辑优化，反响热烈（5000+ 点赞）。", tags: ["功能回归", "优化"], isNew: false },
      { id: "xingye-1", date: "2025-10-01", version: null, title: "星野模型升级公告", summary: "官方正式宣布模型升级，配套发放聊天权益补偿。用户反馈模型行为有明显变化。", tags: ["模型升级"], isNew: false },
    ],
  },
];

const STORAGE_KEY = "app-tracker-data";

const TAG_COLORS = {
  新功能: "bg-emerald-50 text-emerald-700 border-emerald-200",
  版本更新: "bg-sky-50 text-sky-700 border-sky-200",
  内测: "bg-amber-50 text-amber-700 border-amber-200",
  功能回归: "bg-violet-50 text-violet-700 border-violet-200",
  优化: "bg-slate-100 text-slate-600 border-slate-200",
  模型升级: "bg-rose-50 text-rose-700 border-rose-200",
  新产品: "bg-indigo-50 text-indigo-700 border-indigo-200",
  功能开放: "bg-teal-50 text-teal-700 border-teal-200",
};

const SOURCE_ICONS = {
  xiaohongshu: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
    </svg>
  ),
  appstore: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

function PulseDot({ active }) {
  return (
    <span className="relative flex h-2 w-2">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-emerald-500" : "bg-slate-300"}`} />
    </span>
  );
}

function UpdateCard({ update }) {
  return (
    <div className="relative pl-6 pb-6">
      <div className="absolute left-0 top-1.5 bottom-0 w-px bg-slate-100" />
      <div className="absolute left-[-4px] top-1.5"><PulseDot active={update.isNew} /></div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {update.version && (
              <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">v{update.version}</span>
            )}
            <span className="text-sm font-semibold text-slate-800 tracking-tight">{update.title}</span>
            {update.isNew && (
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full uppercase">New</span>
            )}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-2">{update.summary}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {update.tags.map(tag => (
              <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${TAG_COLORS[tag] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{tag}</span>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap pt-0.5 font-mono shrink-0">{update.date}</span>
      </div>
    </div>
  );
}

function AppCard({ app, isSelected, onClick }) {
  const newCount = app.updates.filter(u => u.isNew).length;
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border group ${isSelected ? "bg-white border-slate-200 shadow-sm" : "bg-transparent border-transparent hover:bg-white/60 hover:border-slate-100"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold transition-colors ${isSelected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"}`}>{app.icon}</div>
          <div>
            <div className="text-sm font-semibold text-slate-800 tracking-tight">{app.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-400">{SOURCE_ICONS[app.source] || SOURCE_ICONS.website}</span>
              <span className="text-xs text-slate-400">{app.sourceLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {newCount > 0 && <span className="text-xs font-bold text-white bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center">{newCount}</span>}
          <span className="text-xs text-slate-300 font-mono">{app.updates.length}</span>
        </div>
      </div>
    </button>
  );
}

function AddAppModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", icon: "", source: "xiaohongshu", sourceLabel: "", sourceUrl: "", keywords: "" });
  const sourceOptions = [
    { value: "xiaohongshu", label: "小红书" },
    { value: "appstore", label: "App Store" },
    { value: "website", label: "官网 / 其他" },
  ];
  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: form.name,
      icon: form.icon || form.name[0],
      source: form.source,
      sourceLabel: form.sourceLabel || sourceOptions.find(s => s.value === form.source)?.label,
      sourceUrl: form.sourceUrl,
      keywords: form.keywords.split(/[,，]/).map(k => k.trim()).filter(Boolean),
      lastChecked: null,
      updates: [],
    });
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">添加新追踪项目</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">图标</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="★" maxLength={2} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            </div>
            <div className="col-span-3">
              <label className="text-xs font-medium text-slate-500 block mb-1.5">App 名称 <span className="text-rose-400">*</span></label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10" placeholder="例：抖音" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">信息来源</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">来源链接</label>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono text-xs" placeholder="https://..." value={form.sourceUrl} onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">筛选关键词 <span className="text-slate-300">（逗号分隔）</span></label>
            <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="版本, 上线, 更新, 功能" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-500 border border-slate-200 hover:bg-slate-50">取消</button>
          <button onClick={handleSubmit} disabled={!form.name.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">添加</button>
        </div>
      </div>
    </div>
  );
}

export default function AppTracker() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [selectedId, setSelectedId] = useState("xingye");
  const [showModal, setShowModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 从 localStorage 读取用户自己添加的 App
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const initialIds = new Set(INITIAL_APPS.map(a => a.id));
        const userAdded = parsed.filter(a => !initialIds.has(a.id));
        if (userAdded.length > 0) setApps([...INITIAL_APPS, ...userAdded]);
      }
    } catch (_) {}
    setLoaded(true);
  }, []);

  // 保存用户自己添加的 App 到 localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      const initialIds = new Set(INITIAL_APPS.map(a => a.id));
      const userAdded = apps.filter(a => !initialIds.has(a.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAdded));
    } catch (_) {}
  }, [apps, loaded]);

  const selectedApp = apps.find(a => a.id === selectedId) || apps[0];
  const initialIds = new Set(INITIAL_APPS.map(a => a.id));

  const handleAddApp = (newApp) => {
    setApps(prev => [...prev, newApp]);
    setSelectedId(newApp.id);
    setShowModal(false);
  };

  const handleDeleteApp = (id) => {
    if (initialIds.has(id)) return;
    setApps(prev => prev.filter(a => a.id !== id));
    setSelectedId(INITIAL_APPS[0].id);
  };

  const totalNew = apps.reduce((acc, a) => acc + a.updates.filter(u => u.isNew).length, 0);

  return (
    <div className="min-h-screen bg-[#f7f7f6]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase mb-1">Update Radar</p>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">App 更新追踪</h1>
          </div>
          <div className="flex items-center gap-3">
            {totalNew > 0 && (
              <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">{totalNew} 条新动态</span>
            )}
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              添加 App
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Sidebar */}
          <div className="col-span-4">
            <div className="bg-[#f0f0ee] rounded-2xl p-2 space-y-0.5">
              {apps.map(app => (
                <AppCard key={app.id} app={app} isSelected={selectedId === app.id} onClick={() => setSelectedId(app.id)} />
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="col-span-8">
            {selectedApp && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 pt-6 pb-5 border-b border-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-bold">{selectedApp.icon}</div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">{selectedApp.name}</h2>
                        <a href={selectedApp.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                          <span>{SOURCE_ICONS[selectedApp.source]}</span>
                          <span>{selectedApp.sourceLabel}</span>
                          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedApp.lastChecked && <span className="text-xs text-slate-300 font-mono">更新于 {selectedApp.lastChecked}</span>}
                      {!initialIds.has(selectedApp.id) && (
                        <button onClick={() => handleDeleteApp(selectedApp.id)} className="text-slate-300 hover:text-rose-400 transition-colors p-1">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedApp.keywords?.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-medium">关键词：</span>
                      {selectedApp.keywords.map(k => (
                        <span key={k} className="text-[11px] bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-6 py-5">
                  {selectedApp.updates.length > 0 ? (
                    <div>
                      <h3 className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase mb-5">更新记录 · {selectedApp.updates.length} 条</h3>
                      {selectedApp.updates.map(update => <UpdateCard key={update.id} update={update} />)}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </div>
                      <p className="text-sm font-medium text-slate-400">暂无更新记录</p>
                      <p className="text-xs text-slate-300 mt-1">让我帮你抓取这个 App 的最新动态</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-300 mt-6 font-mono">
          Update Radar · vincent5816
        </p>
      </div>
      {showModal && <AddAppModal onClose={() => setShowModal(false)} onAdd={handleAddApp} />}
    </div>
  );
}
