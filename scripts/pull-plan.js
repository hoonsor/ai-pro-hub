import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function pullPlan() {
  const SERVER_URL = process.env.SYNC_SERVER_URL || 'http://localhost:3000';
  const API_KEY = process.env.SYNC_API_KEY;

  if (!API_KEY) {
    console.error('❌ 錯誤: 找不到 SYNC_API_KEY 環境變數 (請確認 .env.local 或環境設定。)');
    process.exit(1);
  }

  // Use the exact same project name as the web dashboard (projects.json → proj.name)
  const projectDir = process.cwd();
  const defaultProjectName = process.env.SYNC_PROJECT_NAME || '08-監控AI各專案進度之網站';
  
  // 寫入 ACTIVE_TASKS.md，保護 project-monitor 管理的 PROJECT_STATUS.md 不被覆蓋
  const filePath = path.join(projectDir, 'ACTIVE_TASKS.md');

  console.log(`正在從遠端拉取互動式任務計畫 (${defaultProjectName})...`);

  try {
    const res = await fetch(`${SERVER_URL}/api/sync?project=${encodeURIComponent(defaultProjectName)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ 拉取失敗: ${res.status} ${errorText}`);
      process.exit(1);
    }

    const data = await res.json();

    if (data.success) {
      fs.writeFileSync(filePath, data.content, 'utf8');
      console.log(`✅ 任務計畫拉取成功並寫入 ACTIVE_TASKS.md！目前版本: ${data.version}`);
    } else {
      console.error('❌ 拉取失敗: 返回結果不正確', data);
    }
  } catch (err) {
    console.error('❌ 網路請求失敗，請確認伺服器是否正常啟動:', err.message);
  }
}

pullPlan();
