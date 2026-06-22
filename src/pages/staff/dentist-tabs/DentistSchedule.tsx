import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';
import { DoctorShift } from '../../../types/clinic';
import { useAuth } from '../../../context/AuthContext';

const SHIFT_TYPES = {
  Morning: { label: 'Ca sáng', color: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100/70', time: '08:00 - 12:00' },
  Afternoon: { label: 'Ca chiều', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/70', time: '14:00 - 17:00' },
  Full: { label: 'Cả ngày', color: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/70', time: '08:00 - 17:00' }
};

const DENTIST_COLORS: Record<string, string> = {
  'D-01': 'border-l-4 border-l-blue-500',
  'D-02': 'border-l-4 border-l-emerald-500',
  'D-03': 'border-l-4 border-l-purple-500',
  'D-04': 'border-l-4 border-l-pink-500'
};

const ALL_ROOMS = ['Phòng 102', 'Phòng 105', 'Phòng 108', 'Phòng 110', 'Phòng Phẫu Thuật', 'X-Quang'];

const WEEKS = [
  { id: 'w1', label: 'Tuần 1 (01/06 - 07/06)', startDay: 1, endDay: 7 },
  { id: 'w2', label: 'Tuần 2 (08/06 - 14/06)', startDay: 8, endDay: 14 },
  { id: 'w3', label: 'Tuần 3 (15/06 - 21/06)', startDay: 15, endDay: 21 },
  { id: 'w4', label: 'Tuần 4 (22/06 - 28/06)', startDay: 22, endDay: 28 },
  { id: 'w5', label: 'Tuần 5 (29/06 - 30/06)', startDay: 29, endDay: 30 }
];

export const DentistSchedule: React.FC = () => {
  const { doctorShifts, dentists, swapShifts, transferShift, changeShiftRoom, addDoctorShift } = useClinic();
  const { user } = useAuth();

  const currentDentistId = user?.id || 'D-04';
  const currentDentistName = user?.name || 'Bác sĩ Nguyễn Hương';

  // Chỉ lấy ca trực của bác sĩ đang đăng nhập
  const myShifts = doctorShifts.filter(s => s.dentistId === currentDentistId);

  // Filter and Calendar State
  const [selectedRooms] = useState<string[]>(ALL_ROOMS);
  const [viewMode, setViewMode] = useState<'dentist-matrix' | 'calendar'>('dentist-matrix');
  const [selectedWeekId, setSelectedWeekId] = useState<string>('w2'); // default to Week 2

  // Swap / Transfer Modal State
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [actionType, setActionType] = useState<'swap' | 'transfer' | 'change_room' | 'add_shift'>('swap');
  const [originShiftId, setOriginShiftId] = useState('');
  const [targetShiftId, setTargetShiftId] = useState('');
  const [targetDentistId, setTargetDentistId] = useState('');
  const [targetRoom, setTargetRoom] = useState('');

  // Add Shift State
  const [newDate, setNewDate] = useState('2026-06-12');
  const [newShiftType, setNewShiftType] = useState<'Morning' | 'Afternoon' | 'Full'>('Morning');
  const [newRoom, setNewRoom] = useState(ALL_ROOMS[0] || '');

  const currentWeek = WEEKS.find(w => w.id === selectedWeekId) || WEEKS[1];
  const weekDays = Array.from({ length: currentWeek.endDay - currentWeek.startDay + 1 }, (_, i) => {
    const dayNum = currentWeek.startDay + i;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    const dayOfWeek = (dayNum % 7 === 0) ? 'Chủ Nhật' : `Thứ ${(dayNum % 7) + 1}`;
    return { dayNum, dateStr, dayOfWeek };
  });

  // Handle shift selection to swap/transfer
  const openSwapForShift = (shiftId: string) => {
    setOriginShiftId(shiftId);
    setActionType('swap');
    setShowSwapModal(true);
  };

  // Generate June 2026 calendar days
  // June 2026 starts on Monday (1st) and has 30 days.
  const daysInJune = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    const dayOfWeek = (dayNum % 7 === 0) ? 'Chủ Nhật' : `Thứ ${(dayNum % 7) + 1}`;
    return { dayNum, dateStr, dayOfWeek };
  });

  // Today is June 12, 2026
  const todayDateStr = '2026-06-12';

  const filteredShifts = myShifts.filter(s => selectedRooms.includes(s.room));
  const todayShifts = myShifts.filter(s => s.date === todayDateStr);

  const handleConfirmAction = () => {
    if (actionType === 'add_shift') {
      if (!newDate) {
        alert('Vui lòng chọn ngày trực!');
        return;
      }
      if (!newRoom) {
        alert('Vui lòng chọn phòng khám!');
        return;
      }

      // Check if dentist already has a shift of this type on this date
      const duplicate = myShifts.find(s => s.date === newDate && (s.shiftType === newShiftType || s.shiftType === 'Full' || newShiftType === 'Full'));
      if (duplicate) {
        alert(`Bác sĩ ${currentDentistName} đã có ca trực trùng lặp vào ngày ${newDate}!`);
        return;
      }

      addDoctorShift({
        dentistId: currentDentistId,
        dentistName: currentDentistName,
        date: newDate,
        shiftType: newShiftType,
        room: newRoom
      });
      alert('Đăng ký ca trực mới thành công!');
    } else {
      if (!originShiftId) {
        alert('Vui lòng chọn ca làm việc gốc!');
        return;
      }

      const originShift = myShifts.find(s => s.id === originShiftId);
      if (!originShift) {
        alert('Ca trực đã chọn không thuộc tài khoản bác sĩ của bạn!');
        return;
      }

      if (actionType === 'swap') {
        if (!targetShiftId) {
          alert('Vui lòng chọn ca làm việc muốn đổi!');
          return;
        }
        if (originShiftId === targetShiftId) {
          alert('Không thể đổi ca làm việc với chính nó!');
          return;
        }
        swapShifts(originShiftId, targetShiftId);
        alert('Gửi yêu cầu hoán đổi ca trực thành công! Ca trực đã được cập nhật.');
      } else if (actionType === 'transfer') {
        if (!targetDentistId) {
          alert('Vui lòng chọn bác sĩ nhận ca trực!');
          return;
        }
        if (targetDentistId === currentDentistId) {
          alert('Bác sĩ nhận ca phải khác bác sĩ hiện tại của ca trực!');
          return;
        }
        transferShift(originShiftId, targetDentistId);
        alert('Chuyển giao ca trực thành công! Lịch làm việc đã được cập nhật.');
      } else {
        // actionType === 'change_room'
        if (!targetRoom) {
          alert('Vui lòng chọn phòng khám mới!');
          return;
        }
        if (originShift.room === targetRoom) {
          alert('Phòng khám mới phải khác phòng khám hiện tại của ca trực!');
          return;
        }
        changeShiftRoom(originShiftId, targetRoom);
        alert('Thay đổi phòng trực thành công! Lịch làm việc đã được cập nhật.');
      }
    }

    // Reset and close
    setShowSwapModal(false);
    setOriginShiftId('');
    setTargetShiftId('');
    setTargetDentistId('');
    setTargetRoom('');
  };

  // Bước 2 đổi ca: chỉ hiển thị ca của bác sĩ khác
  const swapTargets = doctorShifts.filter(
    s => s.id !== originShiftId && s.dentistId !== currentDentistId
  );

  return (
    <div className="p-container-padding-desktop grid grid-cols-12 gap-6 animate-in fade-in duration-200">
      
      {/* CỘT TRÁI (Sidebar) */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        
        {/* Doctor Profile Card (Thông tin bác sĩ đăng nhập) */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm space-y-4 bg-gradient-to-r from-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
          <div className="flex items-center gap-3">
            <img src={user?.avatar || dentists.find(d => d.id === currentDentistId)?.avatar} alt={currentDentistName} className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-sm" />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-on-surface leading-tight truncate mb-0.5" title={currentDentistName}>{currentDentistName}</h4>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{user?.roleName || 'Bác sĩ Nha khoa'}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">{user?.details || 'Nha khoa GoodSmile'}</p>
            </div>
          </div>
        </div>

        {/* Mini Calendar View */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tháng 6, 2026</h4>
            <div className="flex gap-1.5">
              <Icon name="chevron_left" className="text-sm text-slate-500 cursor-pointer" />
              <Icon name="chevron_right" className="text-sm text-slate-500 cursor-pointer" />
            </div>
          </div>
          
          {/* Mini Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
              <span key={day} className="text-slate-400 font-extrabold">{day}</span>
            ))}
            {/* Blank cells for offset if needed. June 1 2026 is Monday, so 1 blank cell for Sunday offset */}
            <span className="py-1"></span>
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
              const isToday = dateStr === todayDateStr;
              return (
                <span 
                  key={day} 
                  className={`py-1 rounded-full flex items-center justify-center mx-auto w-6 h-6 ${isToday ? 'bg-primary text-white font-black' : 'text-slate-800 hover:bg-slate-100 cursor-pointer'}`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        {/* Upcoming Shifts (Lịch trực cá nhân hôm nay) */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Ca trực cá nhân hôm nay</h4>
          
          <div className="space-y-2">
            {todayShifts.map(shift => {
              const conf = SHIFT_TYPES[shift.shiftType];
              return (
                <div key={shift.id} className="p-3 border border-outline-variant rounded-xl space-y-1.5 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-on-surface">{shift.room}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${conf.color}`}>{conf.label}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                    <Icon name="schedule" className="text-sm text-slate-400" />
                    {conf.time}
                  </p>
                </div>
              );
            })}
            {todayShifts.length === 0 && (
              <p className="text-xs text-on-surface-variant italic text-center py-4">Không có ca trực hôm nay</p>
            )}
          </div>
        </div>

      </div>

      {/* KHU VỰC CHÍNH (Calendar Grid View) */}
      <div className="col-span-12 lg:col-span-9 space-y-4">
        
        {/* Calendar Toolbar header */}
        <div className="bg-white rounded-2xl border border-outline-variant px-4 py-3 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold select-none">Tháng 6, 2026</h3>
            
            {/* View Mode Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('dentist-matrix')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'dentist-matrix' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Lịch Tuần
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Lịch Tháng
              </button>
            </div>

            {/* Week Selector (Only visible for matrix views) */}
            {viewMode !== 'calendar' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 select-none">Tuần trực:</span>
                <select
                  value={selectedWeekId}
                  onChange={e => setSelectedWeekId(e.target.value)}
                  className="bg-slate-100 hover:bg-slate-200 border border-outline-variant/60 rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface outline-none cursor-pointer transition-all"
                >
                  {WEEKS.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setActionType('add_shift');
                setShowSwapModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 cursor-pointer transition-all"
            >
              <Icon name="add" className="text-[16px]" />
              Đăng ký ca trực
            </button>
            <button 
              onClick={() => {
                setOriginShiftId(myShifts[0]?.id || '');
                setActionType('swap');
                setShowSwapModal(true);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 cursor-pointer transition-all"
            >
              <Icon name="swap_horiz" className="text-[16px]" />
              Đổi ca / phòng
            </button>
          </div>
        </div>

        {/* VIEW MODE RENDERER */}

        {viewMode === 'dentist-matrix' && (() => {
          const gridStyle: React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `180px repeat(${weekDays.length}, 1fr)`,
          };
          return (
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            {/* Header row */}
            <div style={gridStyle} className="bg-slate-50/80 border-b border-outline-variant select-none">
              <div className="py-3 px-4 flex items-end border-r border-outline-variant/40">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Bác Sĩ</span>
              </div>
              {weekDays.map(day => {
                const isToday = day.dateStr === todayDateStr;
                return (
                  <div key={day.dayNum} className={`py-3 px-2 text-center border-l border-outline-variant/30 ${isToday ? 'bg-primary/5' : ''}`}>
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-slate-500'}`}>{day.dayOfWeek}</div>
                    <div className={`mt-1 w-6 h-6 flex items-center justify-center rounded-full mx-auto text-xs font-black ${isToday ? 'bg-primary text-white shadow-sm' : 'text-slate-600'}`}>{day.dayNum}</div>
                  </div>
                );
              })}
            </div>
            {/* Data row */}
            {dentists.filter(d => d.id === currentDentistId).map(dentist => (
              <div key={dentist.id} style={gridStyle} className="border-t border-outline-variant/50">
                <div className="py-6 px-4 bg-slate-50/40 border-r border-outline-variant/40 flex items-start gap-2.5 pt-5">
                  <img src={dentist.avatar} alt={dentist.name} className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-md select-none flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-[11px] text-slate-800 leading-snug">{dentist.name}</span>
                    <span className="text-[9px] text-primary font-bold mt-1 uppercase tracking-wider leading-snug">{dentist.role.split('&')[0].trim()}</span>
                  </div>
                </div>
                {weekDays.map(day => {
                  const cellShifts = doctorShifts.filter(s => s.dentistId === dentist.id && s.date === day.dateStr);
                  const morningShift = cellShifts.find(s => s.shiftType === 'Morning' || s.shiftType === 'Full');
                  const afternoonShift = cellShifts.find(s => s.shiftType === 'Afternoon' || s.shiftType === 'Full');
                  const isToday = day.dateStr === todayDateStr;
                  return (
                    <div key={day.dayNum} className={`p-2.5 border-l border-outline-variant/30 flex flex-col gap-2 ${isToday ? 'bg-primary/[0.03]' : ''}`}>
                      {/* Ca Sang */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-sky-500 uppercase tracking-widest select-none">▲ Sáng</span>
                        {morningShift ? (
                          <button onClick={() => openSwapForShift(morningShift.id)} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.97]" title="08:00 – 12:00 | Bấm để đổi ca">
                            <Icon name="meeting_room" className="text-[12px] flex-shrink-0 text-sky-500" />
                            <span className="text-[10px] font-extrabold truncate">{morningShift.room}</span>
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-center py-1.5 rounded-lg border border-dashed border-slate-100 select-none">
                            <span className="text-[9px] text-slate-300 italic">Nghỉ</span>
                          </div>
                        )}
                      </div>
                      {/* Ca Chieu */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest select-none">▼ Chiều</span>
                        {afternoonShift ? (
                          <button onClick={() => openSwapForShift(afternoonShift.id)} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer shadow-sm hover:shadow active:scale-[0.97]" title="14:00 – 17:00 | Bấm để đổi ca">
                            <Icon name="meeting_room" className="text-[12px] flex-shrink-0 text-emerald-500" />
                            <span className="text-[10px] font-extrabold truncate">{afternoonShift.room}</span>
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-center py-1.5 rounded-lg border border-dashed border-slate-100 select-none">
                            <span className="text-[9px] text-slate-300 italic">Nghỉ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          );
        })()}

        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            {/* Weekday Titles */}
            <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container/50 text-center font-bold text-xs uppercase text-slate-500 py-3">
              <span>Thứ Hai</span>
              <span>Thứ Ba</span>
              <span>Thứ Tư</span>
              <span>Thứ Năm</span>
              <span>Thứ Sáu</span>
              <span>Thứ Bảy</span>
              <span className="text-red-500">Chủ Nhật</span>
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-outline-variant bg-slate-100 min-h-[500px]">
              {/* June 1 2026 is Monday. Monday is the first column, so zero padding cells needed! */}
              {daysInJune.map(({ dayNum, dateStr, dayOfWeek }) => {
                const dayShifts = filteredShifts.filter(s => s.date === dateStr);
                const isToday = dateStr === todayDateStr;
                const isWeekend = dayOfWeek === 'Chủ Nhật';

                return (
                  <div 
                    key={dayNum} 
                    className={`bg-white p-2 flex flex-col justify-start gap-1.5 transition-all min-h-[100px] group border-b border-r border-outline-variant/50 ${isToday ? 'bg-blue-50/20 font-bold' : ''}`}
                  >
                    {/* Day number */}
                    <div className="flex justify-between items-center">
                      <span 
                        className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-primary text-white font-black' : isWeekend ? 'text-red-500 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Hôm nay</span>}
                    </div>

                    {/* Shifts scheduled on this day */}
                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[110px] custom-scrollbar pr-0.5">
                      {dayShifts.map(shift => {
                        const conf = SHIFT_TYPES[shift.shiftType];
                        const borderAccent = DENTIST_COLORS[shift.dentistId] || '';
                        return (
                          <div 
                            key={shift.id} 
                            onClick={() => openSwapForShift(shift.id)}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all flex flex-col cursor-pointer ${conf.color} ${borderAccent} shadow-sm hover:shadow-md active:scale-95`}
                            title={`Click để chỉnh sửa/đổi ca trực/đổi phòng cho ${shift.dentistName}`}
                          >
                            <div className="flex justify-between items-center gap-1">
                              <span className="truncate flex-1 text-slate-800">{shift.dentistName.replace('Bác sĩ ', 'BS. ')}</span>
                              <span className="text-[8px] bg-slate-900/10 px-1.5 py-0.5 rounded font-extrabold text-slate-700 select-none">
                                {shift.room.replace('Phòng ', 'P. ')}
                              </span>
                            </div>
                            <span className="opacity-80 text-[8px] mt-0.5 font-medium">{conf.label} • {conf.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* SWAP / TRANSFER WORK SHIFTS MODAL */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-800 animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Icon name="swap_horiz" />
                Đăng Ký Đổi Ca Làm Việc Bác Sĩ
              </h3>
              <button 
                onClick={() => setShowSwapModal(false)} 
                className="p-1.5 hover:bg-white/20 rounded-full cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Swap, Transfer or Change Room Selector Tab */}
              <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-outline-variant/40 gap-1 select-none">
                <button
                  type="button"
                  onClick={() => setActionType('swap')}
                  className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'swap' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Đổi ca trực
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('transfer')}
                  className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'transfer' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Nhờ trực thay
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('change_room')}
                  className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'change_room' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Đổi phòng trực
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('add_shift')}
                  className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'add_shift' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Đăng ký ca trực
                </button>
              </div>

              {actionType === 'add_shift' ? (
                <div className="space-y-4">
                  {/* Bác sĩ */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bác sĩ trực *</label>
                    <input
                      type="text"
                      value={currentDentistName}
                      disabled
                      className="w-full bg-slate-100 border border-outline-variant rounded-xl p-3 text-xs outline-none cursor-not-allowed font-bold text-slate-600"
                    />
                  </div>

                  {/* Ngày trực */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày trực *</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                    />
                  </div>

                  {/* Ca trực */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ca trực *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'Morning' as const, label: 'Ca sáng', time: '08:00 - 12:00' },
                        { type: 'Afternoon' as const, label: 'Ca chiều', time: '14:00 - 17:00' },
                        { type: 'Full' as const, label: 'Cả ngày', time: '08:00 - 17:00' }
                      ].map(item => (
                        <div
                          key={item.type}
                          onClick={() => setNewShiftType(item.type)}
                          className={`p-2 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center select-none ${newShiftType === item.type ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:border-slate-350 bg-white'}`}
                        >
                          <span className="text-xs font-bold">{item.label}</span>
                          <span className="text-[9px] opacity-75 font-medium mt-0.5">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phòng khám */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng khám *</label>
                    <select
                      value={newRoom}
                      onChange={e => setNewRoom(e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                    >
                      {ALL_ROOMS.map(r => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Select origin shift */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bước 1: Chọn ca trực muốn thay đổi *</label>
                    <select
                      value={originShiftId}
                      onChange={e => setOriginShiftId(e.target.value)}
                      className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                    >
                      <option value="">-- Chọn ca trực của bạn --</option>
                      {myShifts.map(s => {
                          const typeLabel = SHIFT_TYPES[s.shiftType]?.label;
                          return (
                            <option key={s.id} value={s.id}>
                              {s.room} — {s.date} ({typeLabel})
                            </option>
                          );
                        })}
                      {myShifts.length === 0 && (
                        <option value="" disabled>Bạn chưa có ca trực nào</option>
                      )}
                    </select>
                  </div>

                  {/* Step 2: Swap / Transfer / Room Change details */}
                  {actionType === 'swap' ? (
                    /* Mode A: Swap with target shift */
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bước 2: Chọn ca trực muốn hoán đổi (Đổi chéo) *</label>
                      <select
                        value={targetShiftId}
                        onChange={e => setTargetShiftId(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                      >
                        <option value="">-- Chọn ca trực của bác sĩ khác để hoán đổi --</option>
                        {swapTargets.map(s => {
                          const typeLabel = SHIFT_TYPES[s.shiftType]?.label;
                          return (
                            <option key={s.id} value={s.id}>
                              {s.dentistName} ({s.room}) - Ngày {s.date} ({typeLabel})
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-[10px] text-slate-400 italic">Lưu ý: Hai ca trực sẽ được hoán đổi bác sĩ phụ trách cho nhau. Lịch hẹn bệnh nhân tương ứng sẽ tự động điều phối.</p>
                    </div>
                  ) : actionType === 'transfer' ? (
                    /* Mode B: Transfer to another doctor */
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bước 2: Chọn bác sĩ nhận chuyển ca (Trực thay) *</label>
                      <select
                        value={targetDentistId}
                        onChange={e => setTargetDentistId(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                      >
                        <option value="">-- Chọn bác sĩ nhận trực thay --</option>
                        {dentists
                          .filter(d => d.id !== currentDentistId)
                          .map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.role.split('&')[0]})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 italic">Lưu ý: Ca trực này sẽ được chuyển giao toàn bộ trách nhiệm trực cho bác sĩ được chọn.</p>
                    </div>
                  ) : (
                    /* Mode C: Change Shift Room */
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bước 2: Chọn phòng khám mới *</label>
                      <select
                        value={targetRoom}
                        onChange={e => setTargetRoom(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                      >
                        <option value="">-- Chọn phòng khám mới --</option>
                        {ALL_ROOMS.map(r => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-400 italic">Lưu ý: Ca trực này của bác sĩ sẽ được chỉ định sang phòng khám được chọn.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-outline-variant flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowSwapModal(false)}
                className="px-5 py-2.5 border border-outline-variant text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shadow active:scale-95 transition-all"
              >
                <Icon name="check_circle" className="text-[16px]" />
                {actionType === 'add_shift' ? 'Xác nhận đăng ký' : 'Xác nhận đổi ca'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};