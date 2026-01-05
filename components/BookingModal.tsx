
import React, { useState } from 'react';
import { RecommendedSlot } from '../types';
import { Button } from './Button';

interface BookingModalProps {
  slot: RecommendedSlot;
  onClose: () => void;
  onConfirm: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ slot, onClose, onConfirm }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsSuccess(true);
    }, 1200);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity"
        onClick={!isConfirming ? onClose : undefined}
      />
      
      <div className="relative bg-white border-2 border-[#e5e4e0] w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {!isSuccess ? (
          <>
            <div className="p-8 pb-0 flex justify-between items-start">
              <div className="bg-[#fbeee0] p-3 rounded-2xl text-[#c0563b]">
                <span className="iconify text-3xl" data-icon="solar:star-bold-duotone"></span>
              </div>
              <button 
                onClick={onClose}
                disabled={isConfirming}
                className="text-slate-400 hover:text-[#161616] transition-colors"
              >
                <span className="iconify text-2xl" data-icon="solar:close-circle-bold-duotone"></span>
              </button>
            </div>

            <div className="p-8 pt-4 space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-[#161616] mb-2 tracking-tight">Confirm Strategy</h2>
                <p className="text-[#555] font-medium leading-relaxed">
                  Locking in this appointment ensures your appearance matches your peak performance goals.
                </p>
              </div>

              <div className="bg-[#f3f2ee] rounded-2xl p-6 border-2 border-[#e5e4e0] space-y-6">
                <div className="flex items-center gap-4">
                  <span className="iconify text-[#c0563b] text-2xl" data-icon="solar:calendar-bold-duotone"></span>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Target Date</div>
                    <div className="text-[#161616] font-extrabold">{formatDate(slot.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-t border-[#e5e4e0] pt-6">
                  <span className="iconify text-[#c0563b] text-2xl" data-icon="solar:verified-check-bold-duotone"></span>
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400">Analysis</div>
                    <div className="text-[#161616] font-bold text-sm">{slot.reason}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleConfirm} 
                  isLoading={isConfirming}
                  className="w-full py-5 text-lg"
                >
                  Synchronize Schedule
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  disabled={isConfirming}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-16 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[#c0563b] text-white rounded-[28px] flex items-center justify-center shadow-lg shadow-[#c0563b]/20">
              <span className="iconify text-5xl" data-icon="solar:check-circle-bold-duotone"></span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-[#161616] mb-2 tracking-tight">Strategy Active</h2>
              <p className="text-[#555] font-medium max-w-xs">
                Your appointment for {formatDate(slot.date)} is locked. Your personal style strategist has updated your profile.
              </p>
            </div>
            <Button variant="outline" onClick={onClose} className="mt-4 px-12">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
