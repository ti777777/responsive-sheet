import React, { useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ResponsiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}

const ResponsiveSheet: React.FC<ResponsiveSheetProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title = "標題",
  maxWidth = "max-w-lg"
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (!isOpen && sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  }, [isOpen]);

  const preventPullToRefresh = (e: TouchEvent) => {
    const touch = e.touches[0];
    const diff = touch.clientY - touchStartY.current;

    // 如果是向下拖動 Bottom Sheet，阻止默認行為
    if (isDragging.current && diff > 0) {
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;

    // 添加全局 touchmove 監聽器來阻止下拉刷新
    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchCurrentY.current - touchStartY.current;

    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // 移除全局 touchmove 監聽器
    document.removeEventListener('touchmove', preventPullToRefresh);

    const diff = touchCurrentY.current - touchStartY.current;
    const threshold = 100;

    if (diff > threshold && sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(onClose, 300);
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      <div 
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg
          
          sm:hidden
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-4 touch-none"> {/* 添加 touch-none 防止內容觸發刷新 */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 cursor-grab" />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <div 
        className={`hidden sm:flex fixed inset-0 z-50 items-center justify-center
          pointer-events-none`}
      >
        <div 
          className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full mx-4
            transform transition-all duration-300 ease-in-out
            pointer-events-auto
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ResponsiveSheet;