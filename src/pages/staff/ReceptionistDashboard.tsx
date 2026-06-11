import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';

// Tab imports
import { ReceptionistQueue } from './receptionist-tabs/ReceptionistQueue';
import { ReceptionistAppointments } from './receptionist-tabs/ReceptionistAppointments';
import { ReceptionistReminders } from './receptionist-tabs/ReceptionistReminders';

// ─── Home: Bàn tiếp nhận ──────────────────────────────────────────────────────
const ReceptionistHome: React.FC = () => {
  const { queue, appointments, patients, dentists, checkInPatient, addPatient } = useClinic();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const [existingPatientId, setExistingPatientId] = useState('');
  const [checkinMode, setCheckinMode] = useState<'existing' | 'new' | 'qr'>('existing');
  const [isScanning, setIsScanning] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('30');
  const [newPatientGender, setNewPatientGender] = useState('Nam');
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [checkinDone, setCheckinDone] = useState(false);

  const activeQueue = queue.filter(q => q.status !== 'Completed');
  const waitingPatients = activeQueue.filter(q => q.status === 'Waiting');
  const averageWaitTime = 12.5;

  const [now] = useState(new Date());
  const dayStr = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let targetPatientId = existingPatientId;
    if (checkinMode === 'new') {
      if (!newPatientName || !newPatientPhone) { alert('Vui lòng điền thông tin bệnh nhân mới!'); return; }
      const added = addPatient({ name: newPatientName, phone: newPatientPhone, age: parseInt(newPatientAge), gender: newPatientGender, criticalAllergy: 'Không', condition: 'Mới khám đầu' });
      targetPatientId = added.id;
    }
    if (!targetPatientId || !selectedDentistId) { alert('Vui lòng chọn bệnh nhân và bác sĩ chỉ định!'); return; }
    checkInPatient(targetPatientId, selectedDentistId);
    setCheckinDone(true);
    setTimeout(() => {
      setCheckinDone(false);
      setShowCheckInModal(false);
      setCheckinMode('existing');
      setExistingPatientId('');
      setNewPatientName('');
      setNewPatientPhone('');
      setSelectedDentistId('');
    }, 2000);
  };

  const handleScanFake = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const patient = patients[0];
      const dentist = dentists[0];
      if (patient && dentist) {
        setExistingPatientId(patient.id);
        setSelectedDentistId(dentist.id);
        setCheckinMode('existing');
        alert(`Đã quét QR thành công!\nBệnh nhân: ${patient.name}\nBác sĩ: ${dentist.name}`);
      }
    }, 2000);
  };

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
                        <p className="text-xs text-on-surface-variant">{item.room} • {item.dentistName}</p>
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

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-outline-variant max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {checkinDone ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-4xl text-on-secondary">check_circle</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">Check-in thành công!</h3>
                <p className="text-on-surface-variant">Bệnh nhân đã vào hàng chờ</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
                  <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">how_to_reg</span>
                    Đón Tiếp & Check-in Bệnh Nhân
                  </h3>
                  <button onClick={() => setShowCheckInModal(false)} className="text-on-primary hover:text-white cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <form onSubmit={handleCheckInSubmit} className="p-6 space-y-4">
                  <div className="flex border rounded-lg overflow-hidden border-outline-variant">
                    {[
                      { key: 'qr', label: 'Quét QR' },
                      { key: 'existing', label: 'Bệnh nhân cũ' },
                      { key: 'new', label: 'Đăng ký mới' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setCheckinMode(opt.key as any)}
                        className={`flex-1 py-2 text-xs font-bold cursor-pointer ${checkinMode === opt.key ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container-low text-on-surface-variant'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {checkinMode === 'qr' && (
                    <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl">
                      <div className="relative">
                        <span className="material-symbols-outlined text-[64px] text-primary">qr_code_scanner</span>
                        {isScanning && (
                          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-secondary animate-bounce pointer-events-none"></div>
                        )}
                      </div>
                      <p className="font-bold text-primary mt-4 mb-2">{isScanning ? 'Đang quét...' : 'Sẵn sàng quét mã QR'}</p>
                      <p className="text-xs text-on-surface-variant text-center max-w-xs mb-4">
                        Hướng camera vào mã QR của lịch hẹn trên điện thoại của bệnh nhân.
                      </p>
                      <button
                        type="button"
                        onClick={handleScanFake}
                        disabled={isScanning}
                        className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold cursor-pointer hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">camera_alt</span>
                        Giả lập quét QR
                      </button>
                    </div>
                  )}

                  {checkinMode === 'existing' && (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Chọn bệnh nhân từ danh sách *</label>
                      <select value={existingPatientId} onChange={e => setExistingPatientId(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg p-2 text-body-md focus:ring-1 focus:ring-primary focus:outline-none">
                        <option value="">-- Chọn bệnh nhân --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                      </select>
                    </div>
                  )}

                  {checkinMode === 'new' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Họ tên bệnh nhân *</label>
                        <input type="text" required placeholder="Ví dụ: Lê Văn E" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-1 focus:ring-primary focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Số điện thoại *</label>
                          <input type="tel" required placeholder="09XXXXXXXX" value={newPatientPhone} onChange={e => setNewPatientPhone(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-md" />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Tuổi</label>
                          <input type="number" value={newPatientAge} onChange={e => setNewPatientAge(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-md" />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkinMode !== 'qr' && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Bác sĩ khám chỉ định *</label>
                        <select value={selectedDentistId} onChange={e => setSelectedDentistId(e.target.value)} required className="w-full bg-surface-container border border-outline-variant rounded-lg p-2 text-body-md focus:ring-1 focus:ring-primary focus:outline-none">
                          <option value="">-- Chọn bác sĩ khám --</option>
                          {dentists.map(d => <option key={d.id} value={d.id}>{d.name} ({d.room})</option>)}
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                        <button type="button" onClick={() => setShowCheckInModal(false)} className="px-4 py-2 border border-outline text-on-surface rounded-lg text-xs font-bold cursor-pointer">Đóng</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all active:scale-95 cursor-pointer">Xác nhận Check-in</button>
                      </div>
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}

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
