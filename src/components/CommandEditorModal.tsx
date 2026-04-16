"use client";

import { useState, useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { X, Save, Loader2 } from "lucide-react";
import { getPlanAction, savePlanAction } from "../../actions/plan";

interface CommandEditorModalProps {
  projectName: string;
  onClose: () => void;
}

export function CommandEditorModal({ projectName, onClose }: CommandEditorModalProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      try {
        const text = await getPlanAction(projectName);
        if (text) setContent(text);
        else setContent("# " + projectName + " 計畫\n\n- [ ] 目前無計畫內容，請開始編修...");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [projectName]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const version = await savePlanAction(projectName, content || "");
      alert(`✅ 儲存成功！伺服器已記錄為 ${version}`);
    } catch (err) {
      alert("❌ 儲存失敗: " + String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/20 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-primary/5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono tracking-wider text-primary">📝 計畫編修模式: {projectName}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "儲存中..." : "儲存計畫 (覆蓋雲端)"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 text-muted-foreground rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 bg-black p-4" data-color-mode="dark">
          {loading ? (
             <div className="h-full flex items-center justify-center">
               <Loader2 className="w-10 h-10 animate-spin text-primary" />
             </div>
          ) : (
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || "")}
              height="100%"
              className="h-full"
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-primary/5 border-t border-white/10 text-sm text-muted-foreground flex justify-between">
          <p>請使用 Markdown 語法編輯。如需於終端機同步，請隨時使用 <code className="bg-black/30 px-2 py-0.5 rounded text-primary">npm run pull-plan</code> 拉回更新。</p>
        </div>
      </div>
    </div>
  );
}
