import React from 'react';
import { useClinic } from '../../../context/ClinicContext';

export const ManagerQueue: React.FC = () => {
  const { queue, dentists } = useClinic();

  const activeQueue = queue.filter((q) => q.status !== 'Completed');
  const waitingPatients = activeQueue.filter((q) => q.status === 'Waiting');
  const inChairPatients = activeQueue.filter((q) => q.status === 'In Chair');

  // Compute stats per dentist room
  const dentistRooms = dentists.map((dentist) => {
    const dentistActiveQueue = activeQueue.filter((q) => q.dentistId === dentist.id);
    const inChair = dentistActiveQueue.find((q) => q.status === 'In Chair');
    const waitingCount = dentistActiveQueue.filter((q) => q.status === 'Waiting').length;
    
    // Average wait calculation
    const avgWait = waitingCount * 15; // 15 mins per waiting patient estimate

    return {
      dentistId: dentist.id,
      dentistName: dentist.name,
      room: dentist.room,
      specialty: dentist.role,
      inChairPatient: inChair ? inChair.patientName : null,
      elapsedTime: inChair ? inChair.elapsedTimeMin || 2 : null,
      waitingCount,
      avgWait
    };
  });

  const avgQueueWait = 12.5;
  const chairOccupancy = dentists.length > 0 ? Math.round((inChairPatients.length / dentists.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 font-bold">pending_actions</span>
          <div>
            <h3 className="font-bold text-on-surface">Giám Sát Hàng Chờ & Ghế Khám</h3>
            <p className="text-xs text-on-surface-variant">Thời gian thực tải buồng ghế khám lâm sàng và hàng đợi đón tiếp</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-purple-50 text-purple-800 text-[10px] rounded-lg font-bold border border-purple-200 uppercase">
            Hiệu suất ghế: {chairOccupancy}%
          </div>
        </div>
      </div>

      {/* Analytics Gauge Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">person_search</span>
          </div>
          <div>
            <span className="text-[10px] text-outline font-bold uppercase block">Đang Chờ Khám</span>
            <span className="text-xl font-extrabold text-on-surface">{waitingPatients.length} Bệnh nhân</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">dentistry</span>
          </div>
          <div>
            <span className="text-[10px] text-outline font-bold uppercase block">Đang Trên Ghế Điều Trị</span>
            <span className="text-xl font-extrabold text-on-surface">{inChairPatients.length} Ghế</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">hourglass_empty</span>
          </div>
          <div>
            <span className="text-[10px] text-outline font-bold uppercase block">Thời Gian Chờ Trung Bình</span>
            <span className="text-xl font-extrabold text-on-surface">{avgQueueWait} phút</span>
          </div>
        </div>
      </div>

      {/* Dentist Room Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dentistRooms.map((room) => (
          <div
            key={room.dentistId}
            className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4 hover:border-purple-600 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-extrabold text-[9px] rounded uppercase tracking-wide">
                  Phòng {room.room}
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1.5">{room.dentistName}</h4>
                <p className="text-[10px] text-on-surface-variant font-medium">{room.specialty}</p>
              </div>

              <span
                className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${
                  room.inChairPatient
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {room.inChairPatient ? 'Đang điều trị' : 'Sẵn sàng'}
              </span>
            </div>

            {/* Current Treatment State */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-outline-variant/50 space-y-2">
              {room.inChairPatient ? (
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[9px] text-outline uppercase font-bold">Bệnh nhân trên ghế</p>
                    <strong className="text-on-surface font-bold">{room.inChairPatient}</strong>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-outline uppercase font-bold">Thời gian đã khám</p>
                    <span className="text-blue-600 font-bold font-data-mono flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px] animate-spin">progress_activity</span>
                      {room.elapsedTime} phút
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center text-on-surface-variant italic text-xs flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  Ghế trống - Sẵn sàng nhận bệnh nhân mới
                </div>
              )}
            </div>

            {/* Queue info */}
            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant pt-2 border-t border-dashed border-outline-variant/30">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">groups</span> Hàng đợi chờ khám:
                <strong className="text-on-surface font-extrabold">{room.waitingCount} người</strong>
              </span>

              {room.waitingCount > 0 && (
                <span className="text-amber-800 text-[10px]">Thời gian chờ ước tính: ~{room.avgWait}m</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
