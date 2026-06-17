import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';
import { QueueItem } from '../../../types/clinic';

interface RoomDetail {
  dentistId: string;
  dentistName: string;
  room: string;
  specialty: string;
  avatar: string;
  inChairItem: QueueItem | null;
  waitingPatients: QueueItem[];
  completedInRoom: QueueItem[];
  waitingCount: number;
  avgWait: number;
  loadLevel: 'critical' | 'busy' | 'active' | 'free';
}

export const ManagerQueue: React.FC = () => {
  const { queue, dentists } = useClinic();
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  const activeQueue = queue.filter((q) => q.status !== 'Completed');
  const completedToday = queue.filter((q) => q.status === 'Completed');
  const waitingPatients = activeQueue.filter((q) => q.status === 'Waiting');
  const inChairPatients = activeQueue.filter((q) => q.status === 'In Chair');

  const avgQueueWait = waitingPatients.length > 0
    ? Math.round(waitingPatients.reduce((sum, q) => sum + q.waitTimeMin, 0) / waitingPatients.length)
    : 0;
  const chairOccupancy = dentists.length > 0
    ? Math.round((inChairPatients.length / dentists.length) * 100)
    : 0;

  // Compute per-room stats
  const dentistRooms: RoomDetail[] = dentists.map((dentist) => {
    const allInRoom = queue.filter((q) => q.dentistId === dentist.id);
    const dentistActive = allInRoom.filter((q) => q.status !== 'Completed');
    const dentistWaiting = dentistActive.filter((q) => q.status === 'Waiting');
    const inChairItem = dentistActive.find((q) => q.status === 'In Chair') ?? null;
    const completedInRoom = allInRoom.filter((q) => q.status === 'Completed');
    const waitingCount = dentistWaiting.length;
    const avgWait = waitingCount * 15;

    const loadLevel: RoomDetail['loadLevel'] =
      inChairItem && waitingCount >= 3 ? 'critical' :
      inChairItem && waitingCount >= 1 ? 'busy' :
      inChairItem ? 'active' : 'free';

    return {
      dentistId: dentist.id,
      dentistName: dentist.name,
      room: dentist.room,
      specialty: dentist.role,
      avatar: dentist.avatar,
      inChairItem,
      waitingPatients: dentistWaiting,
      completedInRoom,
      waitingCount,
      avgWait,
      loadLevel,
    };
  });

  const loadColors = {
    critical: { border: 'border-red-400', badge: 'bg-red-100 text-red-800 border-red-300', dot: 'bg-red-500 animate-pulse', label: 'Tải cao', headerGrad: 'from-red-600 to-red-800' },
    busy:     { border: 'border-amber-400', badge: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-400 animate-pulse', label: 'Bận', headerGrad: 'from-amber-600 to-amber-700' },
    active:   { border: 'border-blue-400', badge: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-500 animate-pulse', label: 'Đang khám', headerGrad: 'from-blue-600 to-blue-800' },
    free:     { border: 'border-emerald-300', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-400', label: 'Sẵn sàng', headerGrad: 'from-emerald-600 to-emerald-700' },
  };

  // Tổng thời gian chờ trung bình của phòng được chọn
  const roomAvgWaitReal = (room: RoomDetail) => {
    if (room.waitingPatients.length === 0) return 0;
    return Math.round(room.waitingPatients.reduce((s, q) => s + q.waitTimeMin, 0) / room.waitingPatients.length);
  };

  // Timeline dự kiến: BN thứ n chờ bao lâu nữa (dựa trên elapsed của in-chair + 15p/người)
  const estimateStartTime = (room: RoomDetail, idx: number) => {
    const elapsed = room.inChairItem?.elapsedTimeMin ?? 0;
    const remainingCurrent = Math.max(0, 30 - elapsed); // giả sử ca khám TB 30p
    return remainingCurrent + idx * 15;
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">

      {/* ── Header + KPI ── */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="bg-white px-5 py-3 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-purple-600">pending_actions</span>
            <div>
              <h3 className="font-bold text-sm text-on-surface">Bảng Giám Sát Hàng Chờ & Ghế Khám</h3>
              <p className="text-[11px] text-on-surface-variant">Thời gian thực — cuộn ngang để xem tất cả phòng — click card để xem chi tiết</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live</span>
            <div className="ml-2 px-3 py-1 bg-purple-50 text-purple-800 text-[10px] rounded-lg font-bold border border-purple-200 uppercase">
              Hiệu suất: {chairOccupancy}%
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: 'person_search', bg: 'bg-amber-50 text-amber-700', label: 'Chờ khám', val: waitingPatients.length, unit: 'BN' },
            { icon: 'dentistry', bg: 'bg-blue-50 text-blue-700', label: 'Trên ghế', val: inChairPatients.length, unit: 'Ghế' },
            { icon: 'hourglass_empty', bg: 'bg-green-50 text-green-700', label: 'Chờ TB', val: avgQueueWait > 0 ? `${avgQueueWait}p` : '—', unit: '' },
            { icon: 'check_circle', bg: 'bg-purple-50 text-purple-700', label: 'Xong hôm nay', val: completedToday.length, unit: 'Ca' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-outline-variant shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kpi.bg}`}>
                <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
              </div>
              <div>
                <p className="text-[9px] text-outline font-bold uppercase tracking-wide">{kpi.label}</p>
                <p className="text-lg font-extrabold text-on-surface leading-tight">
                  {kpi.val} <span className="text-xs font-semibold text-outline">{kpi.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-start">
        {dentistRooms.map((room) => {
          const colors = loadColors[room.loadLevel];
          return (
            <div
              key={room.dentistId}
              onClick={() => setSelectedRoom(room)}
              className={`shrink-0 w-60 bg-white rounded-xl border-2 shadow-sm flex flex-col cursor-pointer transition-all duration-200 select-none overflow-hidden ${colors.border} hover:shadow-lg hover:scale-[1.015]`}
            >
              {/* Card Header */}
              <div className="px-4 pt-4 pb-3 border-b border-outline-variant/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-outline bg-slate-100 px-2 py-0.5 rounded">{room.room}</span>
                  <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                    {colors.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={room.avatar} alt={room.dentistName} className="w-8 h-8 rounded-full object-cover border border-outline-variant shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">{room.dentistName}</p>
                    <p className="text-[9px] text-on-surface-variant truncate">{room.specialty}</p>
                  </div>
                </div>
              </div>

              {/* In Chair */}
              <div className="px-4 py-3 border-b border-outline-variant/30">
                {room.inChairItem ? (
                  <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                    <p className="text-[8px] text-blue-600 font-bold uppercase mb-0.5">Đang điều trị</p>
                    <p className="font-bold text-xs text-on-surface truncate">{room.inChairItem.patientName}</p>
                    <div className="flex items-center gap-1 mt-1 text-blue-600">
                      <span className="material-symbols-outlined text-[11px] animate-spin">progress_activity</span>
                      <span className="text-[9px] font-bold font-data-mono">{room.inChairItem.elapsedTimeMin ?? 2} phút</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-200 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                    <p className="text-[10px] text-emerald-700 font-semibold">Ghế trống — sẵn sàng</p>
                  </div>
                )}
              </div>

              {/* Waiting minilist */}
              <div className="px-4 py-3 flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] text-outline font-bold uppercase">Hàng chờ</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${room.waitingCount === 0 ? 'bg-slate-100 text-outline' : room.waitingCount >= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                    {room.waitingCount} người
                  </span>
                </div>
                {room.waitingPatients.slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-1.5 text-[10px] mb-1">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[8px] font-extrabold shrink-0">{idx + 1}</span>
                    <span className="font-semibold text-on-surface truncate flex-1">{p.patientName}</span>
                    <span className="text-outline font-data-mono shrink-0">{p.waitTimeMin}p</span>
                  </div>
                ))}
                {room.waitingCount > 3 && (
                  <p className="text-[9px] text-outline italic mt-1">+{room.waitingCount - 3} người nữa...</p>
                )}
                {room.waitingCount === 0 && <p className="text-[10px] text-outline italic">Không có ai chờ</p>}
              </div>

              {/* CTA hint */}
              <div className="px-4 pb-3 pt-1 border-t border-outline-variant/20">
                <p className="text-[8px] text-purple-600 font-bold text-center flex items-center justify-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">open_in_full</span>
                  Xem chi tiết đầy đủ
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Full Detail Modal Overlay ── */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedRoom(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header — gradient by load */}
            <div className={`bg-gradient-to-r ${loadColors[selectedRoom.loadLevel].headerGrad} px-6 py-5 text-white shrink-0`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedRoom.avatar} alt={selectedRoom.dentistName} className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">{selectedRoom.room}</span>
                      <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${loadColors[selectedRoom.loadLevel].badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${loadColors[selectedRoom.loadLevel].dot}`}></span>
                        {loadColors[selectedRoom.loadLevel].label}
                      </span>
                    </div>
                    <h2 className="font-bold text-lg leading-tight">{selectedRoom.dentistName}</h2>
                    <p className="text-[11px] opacity-80 mt-0.5">{selectedRoom.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Mini KPI row inside header */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {[
                  { label: 'Đang chờ', val: selectedRoom.waitingCount, unit: 'BN', icon: 'groups' },
                  { label: 'Đã hoàn thành', val: selectedRoom.completedInRoom.length, unit: 'ca', icon: 'check_circle' },
                  { label: 'Chờ TB phòng này', val: roomAvgWaitReal(selectedRoom) > 0 ? `${roomAvgWaitReal(selectedRoom)}p` : '—', unit: '', icon: 'hourglass_empty' },
                  { label: 'Thời gian đã khám', val: selectedRoom.inChairItem ? `${selectedRoom.inChairItem.elapsedTimeMin ?? 2}p` : '—', unit: '', icon: 'timer' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                    <span className="material-symbols-outlined text-lg opacity-80">{kpi.icon}</span>
                    <p className="text-xl font-extrabold leading-tight mt-0.5">{kpi.val}<span className="text-xs font-semibold opacity-80 ml-0.5">{kpi.unit}</span></p>
                    <p className="text-[9px] opacity-70 font-semibold uppercase tracking-wide mt-0.5">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Body — 2 columns */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-outline-variant">

                {/* Left col: Ghế đang khám + Timeline chờ */}
                <div className="p-6 space-y-5">

                  {/* Ghế khám hiện tại */}
                  <section>
                    <h4 className="text-[10px] font-bold uppercase text-outline tracking-widest mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-blue-600">dentistry</span>
                      Ghế Khám Hiện Tại
                    </h4>
                    {selectedRoom.inChairItem ? (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
                        {/* Patient info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[9px] text-blue-600 font-bold uppercase">Bệnh nhân</p>
                            <p className="font-bold text-base text-on-surface">{selectedRoom.inChairItem.patientName}</p>
                            <p className="text-[10px] text-outline mt-0.5">ID: {selectedRoom.inChairItem.patientId}</p>
                          </div>
                          <div className="bg-blue-600 text-white rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                            Đang khám
                          </div>
                        </div>

                        {/* Time info row */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'Check-in lúc', val: selectedRoom.inChairItem.checkInTime, mono: true },
                            { label: 'Đã chờ', val: `${selectedRoom.inChairItem.waitTimeMin} phút`, mono: true },
                            { label: 'Đang điều trị', val: `${selectedRoom.inChairItem.elapsedTimeMin ?? 2} phút`, mono: true },
                          ].map((item, i) => (
                            <div key={i} className="bg-white rounded-lg p-2.5 border border-blue-100 text-center">
                              <p className="text-[8px] text-outline font-bold uppercase">{item.label}</p>
                              <p className={`font-bold text-xs text-blue-700 mt-0.5 ${item.mono ? 'font-data-mono' : ''}`}>{item.val}</p>
                            </div>
                          ))}
                        </div>

                        {/* Dịch vụ đang thực hiện */}
                        {selectedRoom.inChairItem.serviceName && (
                          <div className="bg-white border border-blue-100 rounded-lg p-2.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500 text-sm">medical_services</span>
                            <div>
                              <p className="text-[9px] text-outline font-bold">Dịch vụ</p>
                              <p className="text-xs font-semibold text-on-surface">{selectedRoom.inChairItem.serviceName}</p>
                            </div>
                          </div>
                        )}

                        {/* Progress bar thời gian */}
                        <div>
                          <div className="flex justify-between text-[9px] text-outline font-bold mb-1">
                            <span>Tiến trình (ước tính 30 phút/ca)</span>
                            <span>{Math.min(Math.round(((selectedRoom.inChairItem.elapsedTimeMin ?? 2) / 30) * 100), 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                              style={{ width: `${Math.min(((selectedRoom.inChairItem.elapsedTimeMin ?? 2) / 30) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col items-center gap-2 text-center">
                        <span className="material-symbols-outlined text-4xl text-emerald-500">event_seat</span>
                        <p className="font-bold text-sm text-emerald-800">Ghế đang trống</p>
                        <p className="text-[11px] text-emerald-600">Sẵn sàng nhận bệnh nhân tiếp theo</p>
                      </div>
                    )}
                  </section>

                  {/* Đã hoàn thành hôm nay (trong phòng này) */}
                  <section>
                    <h4 className="text-[10px] font-bold uppercase text-outline tracking-widest mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                      Đã Hoàn Thành Hôm Nay ({selectedRoom.completedInRoom.length} ca)
                    </h4>
                    {selectedRoom.completedInRoom.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRoom.completedInRoom.map((p) => (
                          <div key={p.id} className="flex items-center gap-3 bg-slate-50 rounded-lg border border-outline-variant/40 px-3 py-2">
                            <span className="material-symbols-outlined text-emerald-500 text-sm shrink-0">done</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xs text-on-surface truncate">{p.patientName}</p>
                              <p className="text-[9px] text-outline">Check-in: {p.checkInTime}</p>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 shrink-0">
                              {p.elapsedTimeMin ?? '?'}p
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-outline italic text-xs bg-slate-50 rounded-xl border border-dashed border-outline-variant">
                        Chưa hoàn thành ca nào hôm nay
                      </div>
                    )}
                  </section>
                </div>

                {/* Right col: Queue timeline */}
                <div className="p-6 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-outline tracking-widest mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-amber-600">queue</span>
                    Hàng Chờ & Dự Kiến Vào Khám
                  </h4>

                  {selectedRoom.waitingPatients.length > 0 ? (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-outline-variant/30"></div>

                      <div className="space-y-3">
                        {selectedRoom.waitingPatients.map((p, idx) => {
                          const estimatedWait = estimateStartTime(selectedRoom, idx);
                          const urgency = p.waitTimeMin > 30 ? 'high' : p.waitTimeMin > 15 ? 'medium' : 'low';
                          return (
                            <div key={p.id} className="relative flex items-start gap-3 pl-12">
                              {/* Timeline dot */}
                              <div className={`absolute left-3.5 w-3 h-3 rounded-full border-2 border-white z-10 shrink-0 mt-2 ${
                                urgency === 'high' ? 'bg-red-500' : urgency === 'medium' ? 'bg-amber-500' : 'bg-blue-400'
                              }`}></div>

                              {/* Queue number badge */}
                              <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                                urgency === 'high'
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : urgency === 'medium'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}>
                                {idx + 1}
                              </div>

                              {/* Card */}
                              <div className={`flex-1 rounded-xl border p-3 space-y-2 ${
                                urgency === 'high'
                                  ? 'bg-red-50 border-red-200'
                                  : urgency === 'medium'
                                  ? 'bg-amber-50 border-amber-200'
                                  : 'bg-slate-50 border-outline-variant/50'
                              }`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="font-bold text-sm text-on-surface truncate">{p.patientName}</p>
                                    <p className="text-[9px] text-outline font-mono">ID: {p.patientId}</p>
                                  </div>
                                  {urgency === 'high' && (
                                    <span className="shrink-0 text-[8px] font-bold text-red-700 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded-full">
                                      Chờ lâu!
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 text-center">
                                  <div className="bg-white rounded-lg p-1.5 border border-outline-variant/30">
                                    <p className="text-[8px] text-outline font-bold uppercase">Check-in</p>
                                    <p className="text-[10px] font-bold font-data-mono text-on-surface">{p.checkInTime}</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-1.5 border border-outline-variant/30">
                                    <p className="text-[8px] text-outline font-bold uppercase">Đã chờ</p>
                                    <p className={`text-[10px] font-bold font-data-mono ${urgency === 'high' ? 'text-red-600' : urgency === 'medium' ? 'text-amber-700' : 'text-on-surface'}`}>{p.waitTimeMin}p</p>
                                  </div>
                                  <div className="bg-white rounded-lg p-1.5 border border-outline-variant/30">
                                    <p className="text-[8px] text-outline font-bold uppercase">Còn ~</p>
                                    <p className="text-[10px] font-bold font-data-mono text-purple-700">{estimatedWait}p</p>
                                  </div>
                                </div>

                                {p.serviceName && (
                                  <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant bg-white rounded-lg border border-outline-variant/30 px-2 py-1">
                                    <span className="material-symbols-outlined text-[11px] text-purple-500">medical_services</span>
                                    {p.serviceName}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* End of queue marker */}
                        <div className="relative pl-12">
                          <div className="absolute left-3.5 w-3 h-3 rounded-full bg-outline-variant border-2 border-white z-10 mt-1"></div>
                          <div className="flex items-center gap-2 text-[10px] text-outline italic">
                            <span className="material-symbols-outlined text-sm">flag</span>
                            Cuối hàng chờ — Bệnh nhân cuối chờ thêm ~{selectedRoom.avgWait} phút
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">inbox</span>
                      <p className="font-bold text-sm text-on-surface">Không có bệnh nhân chờ</p>
                      <p className="text-[11px] text-outline mt-1">Phòng này đang rảnh, có thể nhận bệnh nhân mới ngay</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between shrink-0">
              <p className="text-[10px] text-outline">
                Cập nhật theo thời gian thực • Nhấn <kbd className="bg-white border border-outline-variant rounded px-1 text-[9px]">ESC</kbd> hoặc click bên ngoài để đóng
              </p>
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 rounded-lg border border-outline text-on-surface-variant hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
