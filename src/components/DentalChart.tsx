import React from 'react';
import { ToothState } from '../types/clinic';

interface DentalChartProps {
  teethState: ToothState[];
  selectedTooth: number | null;
  onSelectTooth: (toothNumber: number) => void;
}

export const DentalChart: React.FC<DentalChartProps> = ({
  teethState,
  selectedTooth,
  onSelectTooth
}) => {
  // Tooth quadrants according to ISO FDI Notation
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

  const getToothStatus = (toothNumber: number): ToothState => {
    return teethState.find(t => t.toothNumber === toothNumber) || { toothNumber, condition: 'healthy' };
  };

  const getStatusColor = (condition: ToothState['condition'], isSelected: boolean) => {
    if (isSelected) return 'bg-primary text-white border-primary ring-4 ring-primary/20';

    switch (condition) {
      case 'decay':
        return 'bg-error-container text-error border-error border-2';
      case 'missing':
        return 'bg-surface-variant text-outline border-outline border-dashed';
      case 'crown':
        return 'bg-amber-100 text-amber-800 border-amber-500 border-2';
      case 'bridge':
        return 'bg-indigo-50 text-indigo-700 border-indigo-500 border-2';
      case 'treated':
        return 'bg-primary-container text-primary border-primary border-2';
      case 'healthy':
      default:
        return 'bg-white text-on-surface border-outline-variant hover:border-primary';
    }
  };

  const getToothName = (num: number) => {
    if (num === 18 || num === 28 || num === 38 || num === 48) return 'Răng khôn';
    if (num === 11 || num === 12 || num === 21 || num === 22 || num === 31 || num === 32 || num === 41 || num === 42) return 'Răng cửa';
    if (num === 13 || num === 23 || num === 33 || num === 43) return 'Răng nanh';
    return 'Răng hàm';
  };

  const getToothIcon = (condition: ToothState['condition']) => {
    switch (condition) {
      case 'missing': return 'block';
      case 'treated': return 'healing';
      case 'decay': return 'coronavirus';
      case 'crown': return 'diamond';
      default: return 'dentistry';
    }
  };

  const renderTooth = (num: number) => {
    const tooth = getToothStatus(num);
    const isSelected = selectedTooth === num;
    const colorClass = getStatusColor(tooth.condition, isSelected);

    return (
      <button
        key={num}
        type="button"
        onClick={() => onSelectTooth(num)}
        className={`w-11 h-14 rounded-lg border flex flex-col items-center justify-between p-1.5 transition-all duration-200 cursor-pointer text-center relative ${colorClass}`}
        title={`Răng ${num}: ${getToothName(num)} - ${tooth.condition.toUpperCase()} ${tooth.treatment ? `(${tooth.treatment})` : ''}`}
      >
        <span className="text-[10px] font-bold block">{num}</span>
        {/* Simple visual tooth icon */}
        <span className="material-symbols-outlined text-[18px]">
          {getToothIcon(tooth.condition)}
        </span>
        <span className="text-[8px] font-medium leading-none truncate max-w-full">
          {tooth.condition === 'decay' && 'Sâu'}
          {tooth.condition === 'crown' && 'Sứ'}
          {tooth.condition === 'bridge' && 'Cầu'}
          {tooth.condition === 'treated' && 'Trám'}
          {tooth.condition === 'healthy' && 'Khỏe'}
          {tooth.condition === 'missing' && 'Rụng'}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-headline-sm text-headline-sm">Sơ đồ răng kỹ thuật số</h4>
          <p className="text-label-md text-on-surface-variant">Chọn răng cần chẩn đoán hoặc chỉ định dịch vụ</p>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-outline-variant"></span> Khỏe</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error-container border border-error"></span> Sâu răng</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary-container border border-primary"></span> Đã trám</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-500"></span> Bọc sứ</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-50 border border-indigo-500"></span> Cầu răng</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface-variant border border-outline border-dashed"></span> Mất răng</span>
        </div>
      </div>

      <div className="space-y-6 select-none overflow-x-auto custom-scrollbar pb-2">
        {/* Hàm trên */}
        <div className="space-y-2 min-w-[760px]">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block">Hàm Trên (Maxillary)</span>
          <div className="flex items-center justify-between gap-2 bg-surface p-3 rounded-lg border border-outline-variant/30">
            {/* Phân khu 1 - Phía bên phải của bệnh nhân */}
            <div className="flex gap-1.5 flex-1 justify-end border-r border-outline-variant/50 pr-4">
              <span className="text-[10px] uppercase font-bold text-outline-variant rotate-90 origin-center self-center mr-2">Q1</span>
              {upperRight.map(renderTooth)}
            </div>
            {/* Phân khu 2 - Phía bên trái của bệnh nhân */}
            <div className="flex gap-1.5 flex-1 justify-start pl-4">
              {upperLeft.map(renderTooth)}
              <span className="text-[10px] uppercase font-bold text-outline-variant rotate-90 origin-center self-center ml-2">Q2</span>
            </div>
          </div>
        </div>

        {/* Hàm dưới */}
        <div className="space-y-2 min-w-[760px]">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block">Hàm Dưới (Mandibular)</span>
          <div className="flex items-center justify-between gap-2 bg-surface p-3 rounded-lg border border-outline-variant/30">
            {/* Phân khu 4 - Phía bên phải của bệnh nhân */}
            <div className="flex gap-1.5 flex-1 justify-end border-r border-outline-variant/50 pr-4">
              <span className="text-[10px] uppercase font-bold text-outline-variant rotate-90 origin-center self-center mr-2">Q4</span>
              {lowerRight.map(renderTooth)}
            </div>
            {/* Phân khu 3 - Phía bên trái của bệnh nhân */}
            <div className="flex gap-1.5 flex-1 justify-start pl-4">
              {lowerLeft.map(renderTooth)}
              <span className="text-[10px] uppercase font-bold text-outline-variant rotate-90 origin-center self-center ml-2">Q3</span>
            </div>
          </div>
        </div>
      </div>

      {selectedTooth && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs font-medium text-primary flex items-center justify-between">
          <span>
            Đang chọn: <strong>Răng {selectedTooth}</strong> ({getToothName(selectedTooth)}) - Trạng thái: <strong>{getToothStatus(selectedTooth).condition.toUpperCase()}</strong>
          </span>
          <button
            type="button"
            onClick={() => onSelectTooth(0)} // clear select
            className="text-[10px] underline hover:text-primary-container"
          >
            Hủy chọn
          </button>
        </div>
      )}
    </div>
  );
};
