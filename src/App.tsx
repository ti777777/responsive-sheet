import { useState } from 'react'
import Sheet from './Sheet';
import "./App.css"

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sheet
        trigger={
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Open Sheet
          </button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sheet Content</h2>
          <p>This is the content of the sheet.</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Sheet>
    </div>
  );
}

export default App
