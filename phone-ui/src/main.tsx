import React from 'react'
import ReactDOM from 'react-dom/client'
import Phone from './components/Phone'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <Phone />
    </div>
  </React.StrictMode>,
)
