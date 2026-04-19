'use client'
import dynamic from 'next/dynamic'

// dynamic + ssr:false 必須放在 Client Component（'use client'）裡
// page.tsx 是 Server Component，所以需要這個中間層
const App = dynamic(() => import('../App'), { ssr: false })

export default function ClientOnly() {
  return <App />
}
