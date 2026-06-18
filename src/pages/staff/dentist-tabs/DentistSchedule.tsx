import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';
import { DoctorShift } from '../../../types/clinic';

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
  const { doctorShifts, dentists, swapShifts, transferShift, changeShiftRoom } = useClinic();

  // Filter and Calendar State
  const [selectedDentists, setSelectedDentists] = useState<string[]>(dentists.map(d => d.id));
  const [selectedRooms, setSelectedRooms] = useState<string[]>(ALL_ROOMS);
  const [viewMode, setViewMode] = useState<'room-matrix' | 'dentist-matrix' | 'calendar'>('room-matrix');
  const [selectedWeekId, setSelectedWeekId] = useState<string>('w2'); // default to Week 2

  // Swap / Transfer Modal State
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [actionType, setActionType] = useState<'swap' | 'transfer' | 'change_room'>('swap');
  const [originShiftId, setOriginShiftId] = useState('');
  const [targetShiftId, setTargetShiftId] = useState('');
  const [targetDentistId, setTargetDentistId] = useState('');
  const [targetRoom, setTargetRoom] = useState('');

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

  const handleCheckboxChange = (dentistId: string) => {
    setSelectedDentists(prev =>
      prev.includes(dentistId) ? prev.filter(id => id !== dentistId) : [...prev, dentistId]
    );
  };

  const selectAllDentists = () => {
    setSelectedDentists(dentists.map(d => d.id));
  };

  const clearAllDentists = () => {
    setSelectedDentists([]);
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

  // Filtered shifts in the main calendar
  const filteredShifts = doctorShifts.filter(
    s => selectedDentists.includes(s.dentistId) && selectedRooms.includes(s.room)
  );

  // Shifts for today
  const todayShifts = doctorShifts.filter(s => s.date === todayDateStr);

  const handleConfirmAction = () => {
    if (!originShiftId) {
      alert('Vui lòng chọn ca làm việc gốc!');
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
      const originShift = doctorShifts.find(s => s.id === originShiftId);
      if (originShift && originShift.dentistId === targetDentistId) {
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
      const originShift = doctorShifts.find(s => s.id === originShiftId);
      if (originShift && originShift.room === targetRoom) {
        alert('Phòng khám mới phải khác phòng khám hiện tại của ca trực!');
        return;
      }
      changeShiftRoom(originShiftId, targetRoom);
      alert('Thay đổi phòng trực thành công! Lịch làm việc đã được cập nhật.');
    }

    // Reset and close
    setShowSwapModal(false);
    setOriginShiftId('');
    setTargetShiftId('');
    setTargetDentistId('');
    setTargetRoom('');
  };

  // List of possible targets to swap with (all shifts except origin)
  const swapTargets = doctorShifts.filter(s => s.id !== originShiftId);

  return (
    <div className="p-container-padding-desktop grid grid-cols-12 gap-6 animate-in fade-in duration-200">
      
      {/* CỘT TRÁI (Sidebar) */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        
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

        {/* Doctor Filters (Lọc theo Bác sĩ) */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Lọc theo Bác sĩ</h4>
            <div className="flex gap-2 text-[10px] font-bold">
              <button onClick={selectAllDentists} className="text-primary hover:underline cursor-pointer">Tất cả</button>
              <span className="text-slate-300">|</span>
              <button onClick={clearAllDentists} className="text-slate-500 hover:underline cursor-pointer">Xóa</button>
            </div>
          </div>

          <div className="space-y-2.5">
            {dentists.map(dentist => {
              const checked = selectedDentists.includes(dentist.id);
              const borderAccent = DENTIST_COLORS[dentist.id] || '';
              return (
                <label 
                  key={dentist.id} 
                  className={`flex items-center gap-3 p-2 border border-outline-variant/60 rounded-xl hover:bg-slate-50 cursor-pointer transition-all ${borderAccent} ${checked ? 'bg-slate-50/50' : 'opacity-70'}`}
                >
                  <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={() => handleCheckboxChange(dentist.id)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer border-outline-variant"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">{dentist.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{dentist.role.split('&')[0]}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Room Filters (Lọc theo Phòng khám) */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Lọc theo Phòng khám</h4>
            <div className="flex gap-2 text-[10px] font-bold">
              <button onClick={() => setSelectedRooms(ALL_ROOMS)} className="text-primary hover:underline cursor-pointer">Tất cả</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => setSelectedRooms([])} className="text-slate-500 hover:underline cursor-pointer">Xóa</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ALL_ROOMS.map(room => {
              const checked = selectedRooms.includes(room);
              return (
                <label 
                  key={room} 
                  className={`flex items-center gap-2 p-1.5 border border-outline-variant/60 rounded-xl hover:bg-slate-50 cursor-pointer transition-all ${checked ? 'bg-slate-50/50' : 'opacity-70'}`}
                >
                  <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={() => {
                      setSelectedRooms(prev =>
                        prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
                      );
                    }}
                    className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 cursor-pointer border-outline-variant"
                  />
                  <span className="font-bold text-[10px] text-on-surface truncate" title={room}>
                    {room.replace('Phòng ', 'P. ')}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Upcoming Shifts (Sắp tới hôm nay) */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Lịch làm việc hôm nay</h4>
          
          <div className="space-y-2">
            {todayShifts.map(shift => {
              const conf = SHIFT_TYPES[shift.shiftType];
              return (
                <div key={shift.id} className="p-3 border border-outline-variant rounded-xl space-y-1.5 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-on-surface">{shift.dentistName}</span>
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
              <p className="text-xs text-on-surface-variant italic text-center py-4">Không có bác sĩ trực hôm nay</p>
            )}
          </div>
        </div>

      </div>

      {/* KHU VỰC CHÍNH (Calendar Grid View) */}
      <div className="col-span-12 lg:col-span-9 space-y-4">
        
        {/* Calendar Toolbar header */}
        {/* Calendar Toolbar header */}
        <div className="bg-white rounded-2xl border border-outline-variant p-4 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold select-none">Tháng 6, 2026</h3>
            
            {/* View Mode Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('room-matrix')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'room-matrix' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Lịch theo Phòng
              </button>
              <button
                onClick={() => setViewMode('dentist-matrix')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewMode === 'dentist-matrix' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Lịch theo Bác sĩ
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
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (doctorShifts.length > 0) {
                  setOriginShiftId(doctorShifts[0].id);
                }
                setActionType('swap');
                setShowSwapModal(true);
              }}
              className="px-5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 cursor-pointer transition-all"
            >
              <Icon name="swap_horiz" className="text-[16px]" />
              Đăng ký đổi ca / phòng
            </button>
          </div>
        </div>

        {/* VIEW MODE RENDERER */}
        {viewMode === 'room-matrix' && (
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-extrabold text-slate-500 text-center uppercase tracking-wider select-none">
                  <th className="py-3 px-4 text-left font-black text-slate-600 w-40">Phòng Khám</th>
                  {weekDays.map(day => {
                    const isToday = day.dateStr === todayDateStr;
                    return (
                      <th key={day.dayNum} className={`py-3 px-2 w-28 text-center border-l border-outline-variant/30 ${isToday ? 'bg-blue-50/40 text-primary font-black' : ''}`}>
                        <div>{day.dayOfWeek}</div>
                        <div className="text-[10px] opacity-75 font-bold mt-0.5">{day.dayNum.toString().padStart(2, '0')}/06</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {ALL_ROOMS.map(room => {
                  return (
                    <tr key={room} className="hover:bg-slate-50/30 transition-all">
                      {/* Room Details Column */}
                      <td className="py-3 px-4 font-bold text-xs text-on-surface bg-slate-50/30 border-r border-outline-variant/60">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Icon name="meeting_room" className="text-[18px] text-primary" />
                          <span className="font-extrabold">{room}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Khu chuyên khoa</p>
                      </td>

                      {/* Week Days Columns */}
                      {weekDays.map(day => {
                        const cellShifts = filteredShifts.filter(s => s.room === room && s.date === day.dateStr);
                        const morningShift = cellShifts.find(s => s.shiftType === 'Morning' || s.shiftType === 'Full');
                        const afternoonShift = cellShifts.find(s => s.shiftType === 'Afternoon' || s.shiftType === 'Full');
                        const isToday = day.dateStr === todayDateStr;

                        return (
                          <td key={day.dayNum} className={`p-2 border-l border-outline-variant/30 align-top min-w-[120px] ${isToday ? 'bg-blue-50/10' : ''}`}>
                            <div className="space-y-2">
                              {/* Ca Sáng */}
                              <div className="space-y-1">
                                <div className="text-[8px] font-bold text-slate-400 flex justify-between items-center select-none">
                                  <span>CA SÁNG</span>
                                  <span className="font-medium">08:00 - 12:00</span>
                                </div>
                                {morningShift ? (
                                  <div
                                    onClick={() => openSwapForShift(morningShift.id)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${SHIFT_TYPES[morningShift.shiftType].color} ${DENTIST_COLORS[morningShift.dentistId] || ''} shadow-sm hover:shadow active:scale-95`}
                                    title={`Bấm để đổi ca/phòng cho ${morningShift.dentistName}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="truncate">{morningShift.dentistName.replace('Bác sĩ ', 'BS. ')}</span>
                                    </div>
                                    {morningShift.shiftType === 'Full' && (
                                      <span className="inline-block text-[7px] font-black uppercase text-amber-800 bg-amber-200/50 px-1 rounded mt-0.5">Cả ngày</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="py-2.5 border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-xl text-center text-[9px] text-slate-400 cursor-pointer font-bold select-none transition-all"
                                       onClick={() => {
                                         setActionType('change_room');
                                         setTargetRoom(room);
                                         setShowSwapModal(true);
                                       }}>
                                    Trống
                                  </div>
                                )}
                              </div>

                              {/* Ca Chiều */}
                              <div className="space-y-1">
                                <div className="text-[8px] font-bold text-slate-400 flex justify-between items-center select-none">
                                  <span>CA CHIỀU</span>
                                  <span className="font-medium">14:00 - 17:00</span>
                                </div>
                                {afternoonShift ? (
                                  <div
                                    onClick={() => openSwapForShift(afternoonShift.id)}
                                    className={`p-2 border rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${SHIFT_TYPES[afternoonShift.shiftType].color} ${DENTIST_COLORS[afternoonShift.dentistId] || ''} shadow-sm hover:shadow active:scale-95`}
                                    title={`Bấm để đổi ca/phòng cho ${afternoonShift.dentistName}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="truncate">{afternoonShift.dentistName.replace('Bác sĩ ', 'BS. ')}</span>
                                    </div>
                                    {afternoonShift.shiftType === 'Full' && (
                                      <span className="inline-block text-[7px] font-black uppercase text-amber-800 bg-amber-200/50 px-1 rounded mt-0.5">Cả ngày</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="py-2.5 border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-xl text-center text-[9px] text-slate-400 cursor-pointer font-bold select-none transition-all"
                                       onClick={() => {
                                         setActionType('change_room');
                                         setTargetRoom(room);
                                         setShowSwapModal(true);
                                       }}>
                                    Trống
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'dentist-matrix' && (
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant text-[11px] font-extrabold text-slate-500 text-center uppercase tracking-wider select-none">
                  <th className="py-3 px-4 text-left font-black text-slate-600 w-40">Bác Sĩ</th>
                  {weekDays.map(day => {
                    const isToday = day.dateStr === todayDateStr;
                    return (
                      <th key={day.dayNum} className={`py-3 px-2 w-28 text-center border-l border-outline-variant/30 ${isToday ? 'bg-blue-50/40 text-primary font-black' : ''}`}>
                        <div>{day.dayOfWeek}</div>
                        <div className="text-[10px] opacity-75 font-bold mt-0.5">{day.dayNum.toString().padStart(2, '0')}/06</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {dentists
                  .filter(d => selectedDentists.includes(d.id))
                  .map(dentist => {
                    return (
                      <tr key={dentist.id} className="hover:bg-slate-50/30 transition-all">
                        {/* Dentist Profile Column */}
                        <td className="py-3 px-4 font-bold text-xs text-on-surface bg-slate-50/30 border-r border-outline-variant/60">
                          <div className="flex items-center gap-2.5">
                            <img src={dentist.avatar} alt={dentist.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm select-none" />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800">{dentist.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{dentist.role.split('&')[0]}</span>
                            </div>
                          </div>
                        </td>

                        {/* Week Days Columns */}
                        {weekDays.map(day => {
                          const cellShifts = doctorShifts.filter(s => s.dentistId === dentist.id && s.date === day.dateStr);
                          const morningShift = cellShifts.find(s => s.shiftType === 'Morning' || s.shiftType === 'Full');
                          const afternoonShift = cellShifts.find(s => s.shiftType === 'Afternoon' || s.shiftType === 'Full');
                          const isToday = day.dateStr === todayDateStr;

                          return (
                            <td key={day.dayNum} className={`p-2 border-l border-outline-variant/30 align-top min-w-[120px] ${isToday ? 'bg-blue-50/10' : ''}`}>
                              <div className="space-y-2">
                                {/* Ca Sáng */}
                                <div className="space-y-1">
                                  <div className="text-[8px] font-bold text-slate-400 flex justify-between items-center select-none">
                                    <span>CA SÁNG</span>
                                    <span className="font-medium">08:00 - 12:00</span>
                                  </div>
                                  {morningShift ? (
                                    <div
                                      onClick={() => openSwapForShift(morningShift.id)}
                                      className="p-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-primary shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-1"
                                      title={`Bấm để đổi ca/phòng trực`}
                                    >
                                      <Icon name="meeting_room" className="text-[14px]" />
                                      <span className="truncate">{morningShift.room}</span>
                                    </div>
                                  ) : (
                                    <div className="py-2 text-center text-[9px] text-slate-300 select-none italic bg-slate-50/10 rounded-xl">
                                      Nghỉ
                                    </div>
                                  )}
                                </div>

                                {/* Ca Chiều */}
                                <div className="space-y-1">
                                  <div className="text-[8px] font-bold text-slate-400 flex justify-between items-center select-none">
                                    <span>CA CHIỀU</span>
                                    <span className="font-medium">14:00 - 17:00</span>
                                  </div>
                                  {afternoonShift ? (
                                    <div
                                      onClick={() => openSwapForShift(afternoonShift.id)}
                                      className="p-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-primary shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-1"
                                      title={`Bấm để đổi ca/phòng trực`}
                                    >
                                      <Icon name="meeting_room" className="text-[14px]" />
                                      <span className="truncate">{afternoonShift.room}</span>
                                    </div>
                                  ) : (
                                    <div className="py-2 text-center text-[9px] text-slate-300 select-none italic bg-slate-50/10 rounded-xl">
                                      Nghỉ
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

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
                  className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'swap' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Hoán đổi ca trực
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('transfer')}
                  className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'transfer' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Nhờ trực thay
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('change_room')}
                  className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${actionType === 'change_room' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Thay đổi phòng trực
                </button>
              </div>

              {/* Step 1: Select origin shift */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Bước 1: Chọn ca trực muốn thay đổi *</label>
                <select
                  value={originShiftId}
                  onChange={e => setOriginShiftId(e.target.value)}
                  className="w-full bg-slate-50 border border-outline-variant rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Chọn ca trực gốc --</option>
                  {doctorShifts.map(s => {
                    const typeLabel = SHIFT_TYPES[s.shiftType]?.label;
                    return (
                      <option key={s.id} value={s.id}>
                        {s.dentistName} ({s.room}) - Ngày {s.date} ({typeLabel})
                      </option>
                    );
                  })}
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
                    {dentists.map(d => (
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
                Xác nhận đổi ca
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
