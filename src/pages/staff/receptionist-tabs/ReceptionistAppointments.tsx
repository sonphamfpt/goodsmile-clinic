import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';
import { BookingModal } from '../../../components/BookingModal';

const APPT_STATUS: Record<string, { label: string; badge: string; icon: string }> = {
  Confirmed: { label: 'Đã xác nhận', badge: 'bg-secondary-container text-on-secondary-container', icon: 'check_circle' },
  Pending: { label: 'Chờ xác nhận', badge: 'bg-amber-100 text-amber-800', icon: 'pending' },
  'In-Progress': { label: 'Đang khám', badge: 'bg-primary-container text-on-primary-container', icon: 'medical_services' },
  Cancelled: { label: 'Đã hủy', badge: 'bg-error-container text-error', icon: 'cancel' },
  Completed: { label: 'Hoàn tất', badge: 'bg-surface-container text-on-surface-variant', icon: 'task_alt' },
};

// Static full weekly schedule for a richer view
const WEEK_SLOTS = [
  { time: '08:00 AM', dentist: 'Bác sĩ Lê Minh', patient: 'Nguyễn Văn A', service: 'Điều trị tủy răng', status: 'Confirmed', phone: '0912 345 678' },
  { time: '08:30 AM', dentist: 'Bác sĩ Hoàng Nam', patient: 'Trần Thị B', service: 'Nhổ răng khôn', status: 'In-Progress', phone: '0987 654 321' },
  { time: '09:00 AM', dentist: 'Bác sĩ Mai Lan', patient: 'Lê Quang C', service: 'Tẩy trắng răng thẩm mỹ', status: 'Confirmed', phone: '0976 543 210' },
  { time: '09:30 AM', dentist: 'Bác sĩ Nguyễn Hương', patient: 'Phạm Thu D', service: 'Khám chỉnh nha', status: 'Pending', phone: '0909 999 888' },
  { time: '10:15 AM', dentist: 'Bác sĩ Lê Minh', patient: 'Đặng Minh Khoa', service: 'Trám răng thẩm mỹ', status: 'Confirmed', phone: '0911 222 555' },
  { time: '10:45 AM', dentist: 'Bác sĩ Mai Lan', patient: 'Nguyễn Thùy Linh', service: 'Lấy cao răng', status: 'Pending', phone: '0911 333 666' },
  { time: '11:30 AM', dentist: 'Bác sĩ Nguyễn Hương', patient: 'Lý Kiều Trinh', service: 'Niềng răng trong suốt', status: 'Confirmed', phone: '0911 444 777' },
  { time: '02:00 PM', dentist: 'Bác sĩ Hoàng Nam', patient: 'Nguyễn Thị Lan', service: 'Nhổ răng khôn', status: 'Confirmed', phone: '0901 222 333' },
  { time: '02:30 PM', dentist: 'Bác sĩ Lê Minh', patient: 'Trần Nguyễn Minh', service: 'Tái khám chỉnh nha', status: 'Confirmed', phone: '0901 234 567' },
  { time: '03:15 PM', dentist: 'Bác sĩ Mai Lan', patient: 'Phạm Thu D', service: 'Tẩy trắng tại nhà', status: 'Pending', phone: '0909 999 888' },
  { time: '04:00 PM', dentist: 'Bác sĩ Nguyễn Hương', patient: 'Nguyễn Văn A', service: 'Kiểm tra khay niềng', status: 'Confirmed', phone: '0912 345 678' },
];

export const ReceptionistAppointments: React.FC = () => {
  const { appointments, dentists, checkInPatient, patients } = useClinic();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [filterDentist, setFilterDentist] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDay, setViewDay] = useState<'today' | 'tomorrow' | 'week'>('today');

  // Merge context appointments with static ones
  const allAppts = [
    ...appointments.map(a => ({
      time: a.time,
      dentist: a.dentistName,
      patient: a.patientName,
      service: a.serviceName,
      status: a.status,
      phone: a.patientPhone,
      id: a.id,
      dentistId: a.dentistId,
      patientId: a.patientId,
    })),
    ...WEEK_SLOTS.map((s, i) => ({ ...s, id: `STATIC-${i}`, dentistId: '', patientId: '' })),
  ];

  const filtered = allAppts.filter(a => {
    if (filterDentist !== 'all' && !a.dentist.includes(filterDentist)) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery && !a.patient.toLowerCase().includes(searchQuery.toLowerCase()) && !a.phone.includes(searchQuery)) return false;
    return true;
  });

  const confirmed = allAppts.filter(a => a.status === 'Confirmed').length;
  const pending = allAppts.filter(a => a.status === 'Pending').length;
  const inProgress = allAppts.filter(a => a.status === 'In-Progress').length;

  const handleCheckinFromAppt = (dentistId: string, patientId: string, patientName: string) => {
    if (!dentistId || !patientId) { alert(`Đã chuyển ${patientName} vào hàng chờ.`); return; }
    checkInPatient(patientId, dentistId);
    alert(`✅ Check-in thành công cho ${patientName}!`);
  };

  return (
    <div className="p-stack-lg">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Lịch hẹn phòng khám</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Quản lý và xác nhận toàn bộ lịch hẹn khám chữa bệnh</p>
        </div>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined">calendar_add_on</span>
          Đặt lịch hẹn mới
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tổng lịch hẹn', value: allAppts.length, icon: 'calendar_today', color: 'text-on-surface bg-surface-container border-outline-variant' },
          { label: 'Đã xác nhận', value: confirmed, icon: 'check_circle', color: 'text-secondary bg-secondary-container border-secondary/20' },
          { label: 'Chờ xác nhận', value: pending, icon: 'pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Đang khám', value: inProgress, icon: 'medical_services', color: 'text-primary bg-primary-container border-primary/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color}`}>
            <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Day toggle */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant">
          {[
            { key: 'today' as const, label: 'Hôm nay' },
            { key: 'tomorrow' as const, label: 'Ngày mai' },
            { key: 'week' as const, label: 'Cả tuần' },
          ].map(d => (
            <button
              key={d.key}
              onClick={() => setViewDay(d.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewDay === d.key ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
            <input
              placeholder="Tìm bệnh nhân, SĐT..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none w-48"
            />
          </div>

          <select
            value={filterDentist}
            onChange={e => setFilterDentist(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả bác sĩ</option>
            {dentists.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">Mọi trạng thái</option>
            {Object.entries(APPT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Appointments table */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase">
                {['Giờ hẹn', 'Bệnh nhân', 'Dịch vụ', 'Bác sĩ', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((appt, i) => {
                const conf = APPT_STATUS[appt.status] || APPT_STATUS.Pending;
                return (
                  <tr key={`${appt.id}-${i}`} className={`hover:bg-surface-container-low transition-colors ${appt.status === 'Cancelled' ? 'opacity-50 line-through' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary">{appt.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-on-surface text-sm">{appt.patient}</p>
                      <p className="text-xs text-on-surface-variant">{appt.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{appt.service}</td>
                    <td className="px-5 py-4 text-sm font-bold text-on-surface">{appt.dentist}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${conf.badge}`}>
                        <span className="material-symbols-outlined text-[14px]">{conf.icon}</span>
                        {conf.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {appt.status === 'Pending' && (
                          <button
                            onClick={() => alert(`Đã xác nhận lịch hẹn của ${appt.patient}`)}
                            className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Xác nhận
                          </button>
                        )}
                        {(appt.status === 'Confirmed' || appt.status === 'Pending') && (
                          <button
                            onClick={() => handleCheckinFromAppt(appt.dentistId, appt.patientId, appt.patient)}
                            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                            Vào khám
                          </button>
                        )}
                        <button
                          onClick={() => alert(`Hủy lịch hẹn của ${appt.patient}?`)}
                          className="px-2.5 py-1.5 border border-error text-error rounded-lg text-xs font-bold hover:bg-error-container cursor-pointer"
                          title="Hủy lịch"
                        >
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-[72px] text-outline/40">calendar_today</span>
              <p className="text-on-surface-variant mt-4">Không có lịch hẹn nào phù hợp bộ lọc</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline view for today */}
      <div className="mt-6 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">today</span>
          <h4 className="font-headline-sm text-headline-sm">Timeline hôm nay theo phòng khám</h4>
        </div>
        <div className="p-5 grid grid-cols-4 gap-4">
          {dentists.map(d => {
            const dAppts = allAppts.filter(a => a.dentist === d.name);
            return (
              <div key={d.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                    {d.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{d.name.replace('Bác sĩ ', '')}</p>
                    <p className="text-[10px] text-on-surface-variant">{d.room}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {dAppts.slice(0, 4).map((a, ai) => {
                    const conf = APPT_STATUS[a.status] || APPT_STATUS.Pending;
                    return (
                      <div key={ai} className={`text-[10px] px-2 py-1.5 rounded-lg ${conf.badge} flex items-center justify-between`}>
                        <span className="font-bold">{a.time}</span>
                        <span className="truncate ml-1 max-w-[80px]">{a.patient.split(' ').pop()}</span>
                      </div>
                    );
                  })}
                  {dAppts.length === 0 && (
                    <div className="text-[10px] text-on-surface-variant italic py-2 text-center">Trống</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};
