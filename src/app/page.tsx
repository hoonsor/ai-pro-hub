import dynamic from 'next/dynamic'

// 禁止 SSR：整個 App 使用 localStorage / window 等瀏覽器 API
// 這是個純客戶端儀表板，不需要 SEO 或 SSR
const App = dynamic(() => import('../App'), { ssr: false })

export default function Page() {
  return <App />
}
