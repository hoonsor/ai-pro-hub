import fs from 'fs';
import path from 'path';

// For simplicity, we assume this script runs at the project root
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SYNC_API_KEY = process.env.SYNC_API_KEY;

async function syncPlan() {
  if (!SYNC_API_KEY) {
    console.error("❌ 錯誤: 缺少 SYNC_API_KEY 環境變數。請在執行前設定，例如：SYNC_API_KEY=your_key npm run sync-plan");
    process.exit(1);
  }

  // Look for project_status or implementation_plan
  const planPath = path.join(process.cwd(), 'brain', 'e2b246f1-f12b-48f3-9020-7fe593649819', 'implementation_plan.md');
  const fallbackPath = path.join(process.cwd(), 'PROJECT_STATUS.md');
  
  const targetPath = fs.existsSync(planPath) ? planPath : fallbackPath;

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ 錯誤: 找不到需同步的 Markdown 檔案 (${targetPath})`);
    process.exit(1);
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  console.log(`正在同步計畫至遠端 (${targetPath})...`);

  try {
    const res = await fetch(`${API_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SYNC_API_KEY}`
      },
      body: JSON.stringify({
        project: process.env.SYNC_PROJECT_NAME || '08-監控AI各專案進度之網站',
        content,
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ 計畫同步成功！目前版本: ${data.version}`);
    } else {
      const errorText = await res.text();
      console.error("❌ 同步失敗:", res.status, errorText);
    }
  } catch (error) {
    console.error("❌ 網路請求失敗:", error);
  }
}

syncPlan();
