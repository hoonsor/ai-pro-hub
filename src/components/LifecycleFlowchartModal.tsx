import React, { useState, useRef } from "react"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Move,
  Layers,
  Sparkles,
  HelpCircle
} from "lucide-react"

interface LifecycleFlowchartModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LifecycleFlowchartModal: React.FC<LifecycleFlowchartModalProps> = ({
  isOpen,
  onClose
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  if (!isOpen) return null

  // 參考 obsidian-md-notes-viewer 的滾輪縮放邏輯
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const scaleFactor = 0.08
    const direction = e.deltaY < 0 ? 1 : -1
    setZoomScale((prev) =>
      Math.min(Math.max(prev + direction * scaleFactor, 0.3), 4.0)
    )
  }

  // 參考 obsidian-md-notes-viewer 的滑鼠拖曳畫布平移邏輯
  const handleMouseDown = (e: React.MouseEvent) => {
    // 只有按住左鍵時拖曳
    if (e.button !== 0) return
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - dragPos.x,
      y: e.clientY - dragPos.y
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setDragPos({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleReset = () => {
    setZoomScale(1)
    setDragPos({ x: 0, y: 0 })
  }

  const handleFitView = () => {
    setZoomScale(0.85)
    setDragPos({ x: 0, y: 0 })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* 頂部控制與標題列 */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between bg-card/90 border border-border/80 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/15 text-primary">
            <Layers className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                ANTIGRAVITY 2.0 專案開發全生命週期流程圖
              </h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/30">
                Interactive Viewer
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              支援滾輪縮放與按住左鍵拖曳，全景掌握各階段關鍵字與自動化管線
            </p>
          </div>
        </div>

        {/* 縮放與控制工具列 (參考 obsidian-md-notes-viewer) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center bg-secondary/80 border border-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setZoomScale((prev) => Math.min(prev + 0.2, 4.0))}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              title="放大 (Zoom In)"
            >
              <ZoomIn className="size-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-foreground min-w-[3.5rem] text-center select-none">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.max(prev - 0.2, 0.3))}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              title="縮小 (Zoom Out)"
            >
              <ZoomOut className="size-4" />
            </button>
            <div className="w-[1px] h-4 bg-border/60 mx-0.5" />
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
              title="100% 原始大小與置中 (Reset)"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              onClick={handleFitView}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
              title="適應視窗 (Fit View)"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors"
            title="關閉視窗 (ESC)"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* 底部操作提示條 */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-border/80 shadow-lg backdrop-blur-md text-xs text-muted-foreground">
          <Move className="size-3.5 text-primary" />
          <span>按住滑鼠左鍵可任意拖曳移動畫布</span>
          <span className="text-border">|</span>
          <span>滑鼠滾輪上下縮放</span>
        </div>
      </div>

      {/* 互動檢視畫布 Viewport */}
      <div
        className={`w-full h-full overflow-hidden select-none flex items-center justify-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${dragPos.x}px, ${dragPos.y}px) scale(${zoomScale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out"
          }}
          className="p-10"
        >
          {/* 精緻 SVG 向量流程圖 */}
          <svg
            viewBox="0 0 1400 920"
            width="1400"
            height="920"
            className="rounded-3xl shadow-2xl border border-primary/20 bg-[#0a0f1d] overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 背景網格紋理 */}
              <pattern
                id="flowGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.08)"
                  strokeWidth="1"
                />
              </pattern>

              {/* 箭頭標記 markers */}
              <marker
                id="arrowPrimary"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
              </marker>
              <marker
                id="arrowEmerald"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
              <marker
                id="arrowPurple"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
              </marker>
              <marker
                id="arrowRose"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
              </marker>

              {/* 發光濾鏡 */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 畫布底圖與網格 */}
            <rect width="1400" height="920" rx="24" fill="#0b1120" />
            <rect width="1400" height="920" rx="24" fill="url(#flowGrid)" />

            {/* 標題區塊 */}
            <rect
              x="60"
              y="40"
              width="1280"
              height="80"
              rx="16"
              fill="rgba(30, 41, 59, 0.6)"
              stroke="rgba(56, 189, 248, 0.3)"
            />
            <text
              x="100"
              y="88"
              fill="#f8fafc"
              fontSize="24"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ANTIGRAVITY 2.0 專案開發全生命週期流程圖 (Lifecycle Roadmap)
            </text>
            <text
              x="960"
              y="88"
              fill="#38bdf8"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ● 5-STAGES AUTOMATION PIPELINE
            </text>

            {/* 連接線路與箭頭 (Paths) */}
            {/* Stage 1 -> Stage 2 */}
            <path
              d="M 440 250 L 530 250"
              stroke="#38bdf8"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowPrimary)"
            />

            {/* Stage 2 -> Stage 3 */}
            <path
              d="M 725 330 L 725 410"
              stroke="#38bdf8"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowPrimary)"
            />

            {/* Stage 3 -> Loop Back (日常開發循環 #更新) */}
            <path
              d="M 940 480 C 1040 480, 1040 540, 940 540"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="6 4"
              markerEnd="url(#arrowEmerald)"
            />
            <text
              x="985"
              y="515"
              fill="#10b981"
              fontSize="13"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              持續開發存檔循環
            </text>

            {/* Stage 3 -> Stage 4 left (#分支) */}
            <path
              d="M 510 510 L 390 510"
              stroke="#a855f7"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowPurple)"
            />

            {/* Stage 4 left (#分支) -> Stage 4 right (#合併) */}
            <path
              d="M 230 580 L 230 630 L 510 630"
              stroke="#a855f7"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowPurple)"
            />

            {/* Stage 3 -> Stage 5 (#收工/#狀態) */}
            <path
              d="M 725 580 L 725 690"
              stroke="#f43f5e"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowRose)"
            />

            {/* Stage 4 right (#合併) -> Stage 5 */}
            <path
              d="M 725 670 L 725 690"
              stroke="#f43f5e"
              strokeWidth="3"
              fill="none"
            />

            {/* ======================================================== */}
            {/* STAGE 01: 起步與規範建立 */}
            {/* ======================================================== */}
            <g transform="translate(60, 160)">
              <rect
                width="380"
                height="170"
                rx="16"
                fill="rgba(30, 41, 59, 0.85)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="18"
                width="84"
                height="24"
                rx="6"
                fill="rgba(245, 158, 11, 0.2)"
              />
              <text
                x="32"
                y="35"
                fill="#f59e0b"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 01
              </text>
              <text
                x="120"
                y="35"
                fill="#f8fafc"
                fontSize="17"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                專案建置與規範初始化
              </text>

              <rect
                x="20"
                y="55"
                width="88"
                height="32"
                rx="8"
                fill="#f59e0b"
              />
              <text
                x="35"
                y="76"
                fill="#000"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #初始化
              </text>

              <rect
                x="118"
                y="55"
                width="74"
                height="32"
                rx="8"
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#f59e0b"
              />
              <text
                x="133"
                y="76"
                fill="#f59e0b"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #架構
              </text>

              <text
                x="20"
                y="112"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 掃描目錄與技術棧，產生 ANTIGRAVITY.md
              </text>
              <text
                x="20"
                y="136"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 建立標準 PROJECT_STATUS.md 進度追蹤檔
              </text>
            </g>

            {/* ======================================================== */}
            {/* STAGE 02: 每日開工與準備 */}
            {/* ======================================================== */}
            <g transform="translate(530, 160)">
              <rect
                width="390"
                height="170"
                rx="16"
                fill="rgba(30, 41, 59, 0.85)"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="18"
                width="84"
                height="24"
                rx="6"
                fill="rgba(59, 130, 246, 0.2)"
              />
              <text
                x="32"
                y="35"
                fill="#60a5fa"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 02
              </text>
              <text
                x="120"
                y="35"
                fill="#f8fafc"
                fontSize="17"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                每日開工與任務計畫拉取
              </text>

              <rect
                x="20"
                y="55"
                width="76"
                height="32"
                rx="8"
                fill="#3b82f6"
              />
              <text
                x="34"
                y="76"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #開工
              </text>

              <rect
                x="106"
                y="55"
                width="100"
                height="32"
                rx="8"
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#3b82f6"
              />
              <text
                x="121"
                y="76"
                fill="#60a5fa"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                pull plan
              </text>

              <text
                x="20"
                y="112"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 執行 git pull --rebase 同步遠端最新提交
              </text>
              <text
                x="20"
                y="136"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 支援自 Vercel 雲端下載 ACTIVE_TASKS.md
              </text>
            </g>

            {/* ======================================================== */}
            {/* STAGE 03: 日常開發與階段更新 */}
            {/* ======================================================== */}
            <g transform="translate(510, 410)">
              <rect
                width="430"
                height="170"
                rx="16"
                fill="rgba(16, 185, 129, 0.08)"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <rect
                x="20"
                y="18"
                width="84"
                height="24"
                rx="6"
                fill="rgba(16, 185, 129, 0.25)"
              />
              <text
                x="32"
                y="35"
                fill="#34d399"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 03
              </text>
              <text
                x="120"
                y="35"
                fill="#f8fafc"
                fontSize="17"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                日常功能實作與階段存檔循環
              </text>

              <rect
                x="20"
                y="55"
                width="76"
                height="32"
                rx="8"
                fill="#10b981"
              />
              <text
                x="34"
                y="76"
                fill="#000"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #更新
              </text>

              <rect
                x="106"
                y="55"
                width="76"
                height="32"
                rx="8"
                fill="rgba(16, 185, 129, 0.2)"
                stroke="#10b981"
              />
              <text
                x="120"
                y="76"
                fill="#34d399"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #收工
              </text>

              <text
                x="20"
                y="112"
                fill="#e2e8f0"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 開發小段落輸入 #更新，自動檢查資安與 Git 推送
              </text>
              <text
                x="20"
                y="136"
                fill="#e2e8f0"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 推進 Git Commit & Push，自動觸發 Vercel 生產部署
              </text>
            </g>

            {/* ======================================================== */}
            {/* STAGE 04 LEFT: 獨立分支與 Worktree */}
            {/* ======================================================== */}
            <g transform="translate(60, 430)">
              <rect
                width="330"
                height="150"
                rx="16"
                fill="rgba(30, 41, 59, 0.85)"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <rect
                x="20"
                y="18"
                width="84"
                height="24"
                rx="6"
                fill="rgba(168, 85, 247, 0.2)"
              />
              <text
                x="32"
                y="35"
                fill="#c084fc"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 04a
              </text>
              <text
                x="115"
                y="35"
                fill="#f8fafc"
                fontSize="16"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                進階分支隔離與開發
              </text>

              <rect
                x="20"
                y="55"
                width="140"
                height="32"
                rx="8"
                fill="rgba(168, 85, 247, 0.25)"
                stroke="#a855f7"
              />
              <text
                x="32"
                y="76"
                fill="#c084fc"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #分支 [名稱]
              </text>

              <text
                x="20"
                y="110"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 遇到複雜需求時開立獨立分支
              </text>
              <text
                x="20"
                y="132"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 支援 git worktree 避免污染主線
              </text>
            </g>

            {/* ======================================================== */}
            {/* STAGE 04 RIGHT: 分支整併與完結 */}
            {/* ======================================================== */}
            <g transform="translate(510, 600)">
              <rect
                x="0"
                y="-10"
                width="430"
                height="65"
                rx="12"
                fill="rgba(168, 85, 247, 0.15)"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
              <text
                x="20"
                y="18"
                fill="#c084fc"
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 04b 整併完工：
              </text>
              <rect
                x="170"
                y="0"
                width="76"
                height="28"
                rx="6"
                fill="#a855f7"
              />
              <text
                x="185"
                y="19"
                fill="#fff"
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #合併
              </text>
              <text
                x="260"
                y="19"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                分支實作完成後，安全併回 main
              </text>
            </g>

            {/* ======================================================== */}
            {/* STAGE 05: 儀表板資料庫同步 */}
            {/* ======================================================== */}
            <g transform="translate(510, 690)">
              <rect
                width="430"
                height="160"
                rx="16"
                fill="rgba(244, 63, 94, 0.1)"
                stroke="#f43f5e"
                strokeWidth="2.5"
              />
              <rect
                x="20"
                y="18"
                width="84"
                height="24"
                rx="6"
                fill="rgba(244, 63, 94, 0.25)"
              />
              <text
                x="32"
                y="35"
                fill="#fb7185"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                STAGE 05
              </text>
              <text
                x="120"
                y="35"
                fill="#f8fafc"
                fontSize="17"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                全域儀表板監控資料庫同步
              </text>

              <rect
                x="20"
                y="55"
                width="76"
                height="32"
                rx="8"
                fill="#f43f5e"
              />
              <text
                x="34"
                y="76"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #狀態
              </text>

              <rect
                x="106"
                y="55"
                width="90"
                height="32"
                rx="8"
                fill="rgba(244, 63, 94, 0.2)"
                stroke="#f43f5e"
              />
              <text
                x="118"
                y="76"
                fill="#fb7185"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #全更新
              </text>

              <text
                x="20"
                y="110"
                fill="#e2e8f0"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 掃描全電腦 AI 專案與全域技能，產製 JSON 進度報告
              </text>
              <text
                x="20"
                y="134"
                fill="#e2e8f0"
                fontSize="13"
                fontFamily="sans-serif"
              >
                ● 自動將更新同步至 ai-pro-hub 網站發佈上線
              </text>
            </g>

            {/* 底部職責區分說明條 (Legend Bar) */}
            <g transform="translate(60, 860)">
              <rect
                width="1280"
                height="40"
                rx="10"
                fill="rgba(15, 23, 42, 0.9)"
                stroke="rgba(148, 163, 184, 0.25)"
              />
              <text
                x="24"
                y="25"
                fill="#38bdf8"
                fontSize="13"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                ⚡ 執行職責區隔說明：
              </text>
              <text
                x="185"
                y="25"
                fill="#10b981"
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #更新 / #收工
              </text>
              <text
                x="290"
                y="25"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                = 負責「當前專案」程式碼的 Git Commit & Push 雲端自動發佈；
              </text>
              <text
                x="715"
                y="25"
                fill="#fb7185"
                fontSize="13"
                fontWeight="bold"
                fontFamily="monospace"
              >
                #狀態
              </text>
              <text
                x="770"
                y="25"
                fill="#cbd5e1"
                fontSize="13"
                fontFamily="sans-serif"
              >
                = 負責「監控網站資料庫」的全專案掃描進度與技能狀態同步上傳。
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
