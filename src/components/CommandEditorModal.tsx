"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Loader2, ChevronRight, ChevronDown, Plus, Trash2, CheckSquare, Square, List, ClipboardList } from "lucide-react";
import { getPlanAction, savePlanAction } from "../actions/plan";

type ItemType = "main-task" | "sub-task" | "note";

interface EditorItem {
  id: string;
  type: ItemType;
  text: string;
  completed: boolean;
  collapsed: boolean;
  children: EditorItem[];
}

function genId() {
  return Math.random().toString(36).substr(2, 9);
}

// ── Markdown ↔ Tree helpers ───────────────────────────────────────────
function parseMarkdown(md: string): EditorItem[] {
  const lines = md.split("\n");
  const root: EditorItem[] = [];
  const stack: { item: EditorItem; indent: number }[] = [];

  for (const line of lines) {
    if (!line.trim() || line.startsWith("#")) continue;
    const indent = (line.match(/^(\s*)/)?.[1] ?? "").length;
    const taskMatch = line.trim().match(/^- \[([x ])\] (.+)/);
    const noteMatch = line.trim().match(/^- (.+)/);
    let item: EditorItem | null = null;

    if (taskMatch) {
      item = { id: genId(), type: indent === 0 ? "main-task" : "sub-task", text: taskMatch[2], completed: taskMatch[1] === "x", collapsed: false, children: [] };
    } else if (noteMatch) {
      item = { id: genId(), type: "note", text: noteMatch[1], completed: false, collapsed: false, children: [] };
    }
    if (!item) continue;

    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    if (!stack.length) root.push(item);
    else stack[stack.length - 1].item.children.push(item);
    stack.push({ item, indent });
  }
  return root;
}

function toMarkdown(items: EditorItem[], depth = 0): string {
  const pad = "  ".repeat(depth);
  return items.map(it => {
    const line = it.type === "note" ? `${pad}- ${it.text}` : `${pad}- [${it.completed ? "x" : " "}] ${it.text}`;
    const children = it.children.length ? "\n" + toMarkdown(it.children, depth + 1) : "";
    return line + children;
  }).join("\n");
}

// ── Tree mutation helpers (immutable) ────────────────────────────────
function mapTree(items: EditorItem[], fn: (item: EditorItem) => EditorItem): EditorItem[] {
  return items.map(it => fn({ ...it, children: mapTree(it.children, fn) }));
}

function updateById(items: EditorItem[], id: string, updates: Partial<EditorItem>): EditorItem[] {
  return mapTree(items, it => it.id === id ? { ...it, ...updates } : it);
}

function deleteById(items: EditorItem[], id: string): EditorItem[] {
  return items.filter(it => it.id !== id).map(it => ({ ...it, children: deleteById(it.children, id) }));
}

function addChildById(items: EditorItem[], parentId: string, child: EditorItem): EditorItem[] {
  return mapTree(items, it => it.id === parentId ? { ...it, children: [...it.children, child] } : it);
}

// ── Single item row ───────────────────────────────────────────────────
interface RowProps {
  item: EditorItem;
  depth: number;
  onUpdate: (id: string, u: Partial<EditorItem>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, type: ItemType) => void;
}

function ItemRow({ item, depth, onUpdate, onDelete, onAddChild }: RowProps) {
  const cfg = {
    "main-task": { label: "主任務", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    "sub-task":  { label: "子任務",  color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
    note:        { label: "注意事項", color: "text-amber-400",  border: "border-amber-500/30",  bg: "bg-amber-500/10" },
  }[item.type];

  const hasKids = item.children.length > 0;

  return (
    <div style={{ marginLeft: depth * 22 }}>
      <div className={`flex items-start gap-2 px-2 py-1.5 rounded-lg border ${cfg.bg} ${cfg.border} group mb-1`}>
        {/* Expand toggle */}
        <button onClick={() => onUpdate(item.id, { collapsed: !item.collapsed })}
          className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0">
          {hasKids ? (item.collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <span className="w-3" />}
        </button>

        {/* Checkbox / bullet */}
        {item.type !== "note"
          ? <button onClick={() => onUpdate(item.id, { completed: !item.completed })} className={`shrink-0 ${item.completed ? "text-primary" : "text-muted-foreground"}`}>
              {item.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>
          : <List className={`w-4 h-4 ${cfg.color} shrink-0`} />}

        {/* Type badge */}
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${cfg.color} bg-black/30 shrink-0`}>{cfg.label}</span>

        {/* Text */}
        <textarea
          value={item.text}
          onChange={e => {
            onUpdate(item.id, { text: e.target.value });
            // Auto resize
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Enter = 儲存目前輸入（不換行），Shift+Enter 才換行
            }
          }}
          onFocus={e => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          rows={1}
          placeholder={`輸入${cfg.label}內容… (Shift+Enter 換行)`}
          className={`flex-1 bg-transparent text-sm outline-none min-w-0 resize-none overflow-hidden leading-relaxed ${item.completed ? "line-through opacity-50" : ""}`}
          style={{ minHeight: "1.5rem" }}
        />

        {/* Hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {item.type === "main-task" &&
            <button title="新增子任務" onClick={() => onAddChild(item.id, "sub-task")}
              className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-white/10">
              <Plus className="w-3 h-3" />
            </button>}
          <button title="新增注意事項" onClick={() => onAddChild(item.id, "note")}
            className="text-amber-400 hover:text-amber-300 p-1 rounded hover:bg-white/10">
            <List className="w-3 h-3" />
          </button>
          <button title="刪除" onClick={() => onDelete(item.id)}
            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/10">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Children */}
      {!item.collapsed && item.children.length > 0 && (
        <div className="border-l border-white/10 ml-5 pl-1 mb-1">
          {item.children.map(c => (
            <ItemRow key={c.id} item={c} depth={0} onUpdate={onUpdate} onDelete={onDelete} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
export function CommandEditorModal({ projectName, onClose }: { projectName: string; onClose: () => void }) {
  const [items, setItems] = useState<EditorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPlanAction(projectName).then(md => {
      setItems(md ? parseMarkdown(md) : []);
    }).finally(() => setLoading(false));
  }, [projectName]);

  const update  = useCallback((id: string, u: Partial<EditorItem>) => setItems(prev => updateById(prev, id, u)), []);
  const remove  = useCallback((id: string) => setItems(prev => deleteById(prev, id)), []);
  const addTop  = useCallback((type: ItemType) => setItems(prev => [...prev, { id: genId(), type, text: "", completed: false, collapsed: false, children: [] }]), []);
  const addChild = useCallback((parentId: string, type: ItemType) =>
    setItems(prev => addChildById(prev, parentId, { id: genId(), type, text: "", completed: false, collapsed: false, children: [] })), []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const md = toMarkdown(items);
      const version = await savePlanAction(projectName, md);
      alert(`✅ 儲存成功！伺服器版本：${version}`);
    } catch (e) {
      alert("❌ 儲存失敗：" + String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/20 w-full max-w-3xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-primary/5 shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base tracking-wide">計畫編修：<span className="text-primary">{projectName}</span></h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={loading || saving}
              className="px-3 py-1.5 bg-primary/20 hover:bg-primary/40 text-primary text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "儲存中…" : "儲存"}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-white/10 bg-black/20 shrink-0">
          <span className="text-xs text-muted-foreground mr-1">新增頂層：</span>
          <button onClick={() => addTop("main-task")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg transition-colors">
            <CheckSquare className="w-3.5 h-3.5" /> 主任務
          </button>
          <button onClick={() => addTop("note")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-lg transition-colors">
            <List className="w-3.5 h-3.5" /> 注意事項
          </button>
          <span className="text-xs text-muted-foreground ml-2 italic">滑鼠移至項目可展開操作選單</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <ClipboardList className="w-12 h-12 opacity-30" />
              <p className="text-sm">尚無任何項目，請點擊上方按鈕開始新增</p>
            </div>
          )}
          {!loading && items.map(item => (
            <ItemRow key={item.id} item={item} depth={0} onUpdate={update} onDelete={remove} onAddChild={addChild} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-white/10 bg-primary/5 text-xs text-muted-foreground shrink-0">
          共 {items.length} 個頂層項目 ｜ 儲存後可透過 <code className="bg-black/30 px-1.5 rounded text-primary">npm run pull-plan</code> 同步至本機
        </div>
      </div>
    </div>
  );
}
