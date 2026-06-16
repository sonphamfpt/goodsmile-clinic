import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';
import { CheckInModal } from '../../components/CheckInModal';

// Tab imports
import { ReceptionistQueue } from './receptionist-tabs/ReceptionistQueue';
import { ReceptionistAppointments } from './receptionist-tabs/ReceptionistAppointments';
import { ReceptionistReminders } from './receptionist-tabs/ReceptionistReminders';

// ─── Home: Bàn tiếp nhận ──────────────────────────────────────────────────────
const ReceptionistHome: React.FC = () => {
  const { queue, appointments, checkInPatient } = useClinic();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const activeQueue = queue.filter(q => q.status !== 'Completed');
  const waitingPatients = activeQueue.filter(q => q.status === 'Waiting');
  const averageWaitTime = 12.5;

  const [now] = useState(new Date());
  const dayStr = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-container-padding-desktop space-y-6 animate-in fade-in duration-200">

      {/* Hero greeting */}
      <div className="premium-glow rounded-xl p-6 text-on-primary flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm opacity-80 text-white">{dayStr}</p>
          <h2 className="font-headline-lg text-headline-lg text-white mt-1">Chào buổi sáng, Lễ tân!</h2>
          <p className="text-sm opacity-80 mt-1 text-white/80">Có <strong>{appointments.length}</strong> lịch hẹn và <strong>{waitingPatients.length}</strong> bệnh nhân đang chờ hôm nay</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
          <span className="material-symbols-outlined text-[120px] text-white">support_agent</span>
        </div>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-12 gap-6">
        {/* Large Action Buttons */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowCheckInModal(true)}
            className="h-32 bg-primary-container text-white rounded-xl p-6 flex items-center gap-6 hover:scale-[1.01] transition-transform shadow-xl shadow-primary-container/20 cursor-pointer text-left"
          >
            <div className="bg-white/20 p-4 rounded-full">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-bold text-white">Đón Tiếp Bệnh Nhân</h3>
              <p className="text-body-md opacity-80">Check-in đưa bệnh nhân vào hàng khám</p>
            </div>
          </button>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="h-32 bg-tertiary-container text-white rounded-xl p-6 flex items-center gap-6 hover:scale-[1.01] transition-transform shadow-xl shadow-tertiary-container/20 cursor-pointer text-left"
          >
            <div className="bg-white/20 p-4 rounded-full">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-bold text-white">Đặt Lịch Hẹn Mới</h3>
              <p className="text-body-md opacity-80">Tạo lịch khám mới cho khách hàng</p>
            </div>
          </button>
        </div>

        {/* Analytics card */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border-l-4 border-secondary shadow-sm flex flex-col justify-between border border-outline-variant">
            <div className="flex justify-between items-start">
              <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">Thời gian chờ TB</p>
              <span className="material-symbols-outlined text-secondary font-bold">trending_down</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-headline-lg font-headline-lg text-on-surface">{averageWaitTime}</span>
              <span className="text-body-md text-on-surface-variant">phút</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-label-md text-secondary font-medium mt-1">Tốt hơn 4% so với hôm qua</p>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Chờ khám', value: waitingPatients.length, color: 'text-amber-700' },
              { label: 'Đang khám', value: activeQueue.filter(q => q.status === 'In Chair').length, color: 'text-primary' },
              { label: 'Lịch hẹn', value: appointments.length, color: 'text-secondary' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-outline-variant p-3 text-center shadow-sm">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left: Appointments Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_today</span>
              Danh Sách Lịch Hẹn Trong Ngày
            </h3>
            <span className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-xs font-bold">
              {appointments.length} Lịch hẹn
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-label-md text-on-surface-variant uppercase">
                <tr>
                  {['Giờ hẹn', 'Bệnh nhân', 'Dịch vụ', 'Bác sĩ phụ trách', 'Trạng thái', ''].map(h => (
                    <th key={h} className="px-6 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-body-md divide-y divide-outline-variant">
                {appointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">{appt.time.split(' @ ').pop() || appt.time}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-on-surface">{appt.patientName}</div>
                      <div className="text-xs text-on-surface-variant">{appt.patientPhone}</div>
                    </td>
                    <td className="px-6 py-4">{appt.serviceName}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{appt.dentistName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        appt.status === 'Confirmed' ? 'bg-secondary-container text-on-secondary-container' :
                        appt.status === 'In-Progress' ? 'bg-primary-container text-on-primary-container' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.status === 'Confirmed' ? 'Đã xác nhận' : appt.status === 'In-Progress' ? 'Đang khám' : 'Chờ xác nhận'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => checkInPatient(appt.patientId, appt.dentistId)}
                        className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-container transition-all cursor-pointer active:scale-95"
                      >
                        Vào khám
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Queue + SMS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Waiting Queue */}
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col h-[380px] shadow-sm">
            <div className="p-5 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="font-headline-sm text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined">pending_actions</span>
                Hàng Chờ Tiếp Đón
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                {waitingPatients.length} Chờ
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50">
              {activeQueue.length > 0 ? (
                activeQueue.map((item, idx) => (
                  <div key={item.id} className="bg-white p-3.5 rounded-lg border border-outline-variant/60 flex items-center justify-between shadow-sm hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{item.patientName}</p>
                        <p className="text-xs text-on-surface-variant">BS. <strong className="text-primary">{item.dentistName}</strong> • {item.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${item.status === 'In Chair' ? 'text-secondary animate-pulse' : 'text-primary'}`}>
                        {item.status === 'In Chair' ? 'Đang khám' : 'Đang chờ'}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        {item.status === 'In Chair' ? `${item.elapsedTimeMin || 0} phút khám` : `Chờ ${item.waitTimeMin} phút`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-on-surface-variant text-center p-4">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline">group</span>
                  <p className="text-xs font-bold">Hàng chờ hiện đang trống</p>
                </div>
              )}
            </div>
          </div>

          {/* SMS / Zalo quick send */}
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[#26A17B]">chat_bubble</span>
              <h3 className="font-headline-sm">Truyền Thông Nhắc Lịch</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <button onClick={() => alert('Đã bắt đầu gửi SMS nhắc hẹn tự động!')} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs cursor-pointer">
                  <span className="material-symbols-outlined text-sm">sms</span> SMS Nhắc Hẹn
                </button>
                <button onClick={() => alert('Đã đồng bộ nhắc hẹn qua Zalo OA!')} className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs cursor-pointer">
                  <span className="material-symbols-outlined text-sm">alternate_email</span> Zalo OA
                </button>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50">
                <p className="text-xs font-bold mb-1">Nội dung tin mẫu</p>
                <p className="text-xs text-on-surface-variant italic leading-relaxed">
                  "Kính gửi Quý khách, nhắc nhở: Lịch khám răng định kỳ của Quý khách vào ngày mai tại phòng khám Nha khoa GoodSmile..."
                </p>
                <div className="mt-3 flex justify-end">
                  <button onClick={() => alert('Đã gửi tin nhắc thành công!')} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer">
                    Gửi ngay <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Đón tiếp & Check-in bệnh nhân"
      />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

// ─── Main ReceptionistDashboard (Tab Router) ────────────────────────────────────
export const ReceptionistDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  switch (tab) {
    case 'queue':        return <ReceptionistQueue />;
    case 'appointments': return <ReceptionistAppointments />;
    case 'reminders':    return <ReceptionistReminders />;
    default:             return <ReceptionistHome />;
  }
};
