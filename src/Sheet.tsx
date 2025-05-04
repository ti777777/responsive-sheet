import React, { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence } from 'framer-motion';

interface SheetProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet: React.FC<SheetProps> = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = controlledIsOpen ?? isOpenInternal;
  const setIsOpen = onOpenChange ?? setIsOpenInternal;

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  return (
    <>
      <div onClick={handleTriggerClick}>{trigger}</div>
      <AnimatePresence>
        {isOpen &&
          createPortal(
            <motion.div
              className="fixed inset-0 bg-black/50 flex z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
            >
              {isMobile ? (
                <motion.div
                  className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                >
                  <div className="p-4">{children}</div>
                </motion.div>
              ) : (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl min-w-[200px] max-w-[400px]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <div className="p-4">{children}</div>
                </motion.div>
              )}
            </motion.div>,
            document.getElementById("portal")!
          )}
      </AnimatePresence>
    </>
  );
};

export default Sheet;