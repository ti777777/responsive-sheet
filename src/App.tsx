import { useState } from 'react'
import ResponsiveSheet from './ResponsiveSheet'
import './App.css'

function App() {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        onClick={() => setIsSheetOpen(true)}
        className="m-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        開啟 Sheet
      </button>

      <ResponsiveSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="我的響應式 Sheet"
      >
        <div className="py-4">
          <p>這是一個響應式的 Sheet 組件</p>
          <p>在小螢幕可以拖拉關閉</p>
          <p>在大螢幕顯示為 Modal</p>
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>內容行 {i + 1}</p>
          ))}
        </div>
      </ResponsiveSheet>
    </div>
  );
}

export default App
