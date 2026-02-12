import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#000d1f] border border-white/10 p-6 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              {message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-all"
              >
                No, Cancel
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;