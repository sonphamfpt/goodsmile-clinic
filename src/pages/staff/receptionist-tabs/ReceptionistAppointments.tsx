import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';
import { BookingModal } from '../../../components/BookingModal';

const APPT_STATUS: Record<string, { label: string; badge: string; icon: string }> = {
  Confirmed:   { label: 'Đã xác nhận',  badge: 'bg-secondary-container text-on-secondary-container', icon: 'check_circle' },
  Pending:     { label: 'Chờ xác nhận', badge: 'bg-amber-100 text-amber-800',                        icon: 'pending' },
  'In-Progress':{ label: 'Đang khám',   badge: 'bg-primary-container text-on-primary-container',     icon: 'medical_services' },
  Cancelled:   { label: 'Đã hủy',       badge: 'bg-error-container text-error',                      icon: 'cancel' },
  Completed:   { label: 'Hoàn tất',     badge: 'bg-surface-container text-on-surface-variant',       icon: 'task_alt' },
};

// ── Helpers tính ngày ──────────────────────────────────────────────────────────
const todayStr = () => new Date().toLocaleDateString('vi-VN');
const tomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('vi-VN');
};

/** Từ chuỗi giờ như "09:00 AM" hoặc "Ngày mai @ 10:00 AM", lấy ngày đính kèm.
 *  Mock data hiện tại không có trường date riêng, nên ta dùng quy ước:
 *  - Nếu time có "@ " => parse trước "@"
 *  - Ngược lại coi là hôm nay
 */
const parseDateFromTime = (time: string): string => {
  if (time.includes('@')) {
    return time.split('@')[0].trim();
  }
  return todayStr();
};

export const ReceptionistAppointments: React.FC = () => {
  const { appointments, dentists, confirmAppointment, cancelAppointment, checkInPatient } = useClinic();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [filterDentist, setFilterDentist] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDay, setViewDay] = useState<'today' | 'tomorrow' | 'week'>('today');

  // ── Lọc dữ liệu live từ Context ──────────────────────────────────────────────
  const filtered = appointments.filter(a => {
    // Lọc theo ngày
    const apptDate = parseDateFromTime(a.time);
    if (viewDay === 'today' && apptDate !== todayStr() && !a.time.includes('@')) {
      // Các lịch hẹn không có @ coi là hôm nay → pass
    }
    if (viewDay === 'tomorrow' && apptDate !== tomorrowStr() && !a.time.includes('Ngày mai')) {
      // Chỉ show nếu có "Ngày mai" trong chuỗi time hoặc ngày = ngày mai
      // Vì mock data hôm nay không có lịch ngày mai, filter này sẽ ẩn tất cả → wanh thì show all
    }
    // Lọc bác sĩ
    if (filterDentist !== 'all' && a.dentistId !== filterDentist) return false;
    // Lọc trạng thái
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    // Tìm kiếm
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.patientName.toLowerCase().includes(q) && !a.patientPhone.includes(q) && !a.serviceName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleCheckin = (appt: typeof appointments[0]) => {
    checkInPatient(appt.patientId, appt.dentistId, undefined, appt.serviceName);
  };

  const totalAppts = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const inProgressCount = appointments.filter(a => a.status === 'In-Progress').length;

  return (
    <div className="p-stack-lg">
      {/* ── Header ── */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Lịch hẹn phòng khám</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Quản lý, xác nhận và check-in lịch hẹn khám chữa bệnh</p>
        </div>
        <button
          id="btn-new-appointment"
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Icon name="calendar_add_on" />
          Đặt lịch hẹn mới
        </button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tổng lịch hẹn',  value: totalAppts,      icon: 'calendar_today',  color: 'text-on-surface bg-surface-container border-outline-variant' },
          { label: 'Đã xác nhận',    value: confirmedCount,  icon: 'check_circle',    color: 'text-secondary bg-secondary-container border-secondary/20' },
          { label: 'Chờ xác nhận',   value: pendingCount,    icon: 'pending',         color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Đang khám',      value: inProgressCount, icon: 'medical_services',color: 'text-primary bg-primary-container border-primary/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color}`}>
            <Icon name={s.icon} className="text-[26px]" />
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pending Alert ── */}
      {pendingCount > 0 && filterStatus !== 'Confirmed' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl mb-5">
          <Icon name="notification_important" className="text-amber-600" />
          <p className="text-sm text-amber-800 font-bold">
            Có {pendingCount} lịch hẹn đang chờ xác nhận.
            {' '}
            <button
              className="underline cursor-pointer"
              onClick={() => setFilterStatus('Pending')}
            >
              Lọc xem ngay
            </button>
          </p>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex gap-2 mb-5 flex-wrap items-center">
        {/* Day toggle */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant">
          {[
            { key: 'today' as const,    label: 'Hôm nay' },
            { key: 'tomorrow' as const, label: 'Ngày mai' },
            { key: 'week' as const,     label: 'Cả tuần' },
          ].map(d => (
            <button
              key={d.key}
              id={`btn-day-filter-${d.key}`}
              onClick={() => setViewDay(d.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewDay === d.key ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant" />
          <input
            placeholder="Tên, SĐT, dịch vụ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none w-44"
          />
        </div>

        {/* Dentist filter */}
        <select
          value={filterDentist}
          onChange={e => setFilterDentist(e.target.value)}
          className="px-3 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none cursor-pointer"
        >
          <option value="all">Tất cả bác sĩ</option>
          {dentists.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none cursor-pointer"
        >
          <option value="all">Mọi trạng thái</option>
          {Object.entries(APPT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>

        {/* Clear filters */}
        {(filterDentist !== 'all' || filterStatus !== 'all' || searchQuery) && (
          <button
            onClick={() => { setFilterDentist('all'); setFilterStatus('all'); setSearchQuery(''); }}
            className="text-xs text-on-surface-variant border border-outline-variant rounded-xl px-3 py-2 hover:bg-surface-container cursor-pointer flex items-center gap-1"
          >
            <Icon name="filter_alt_off" className="text-[14px]" />
            Xóa lọc
          </button>
        )}
      </div>

      {/* ── Appointments Table ── */}
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
              {filtered.map((appt) => {
                const conf = APPT_STATUS[appt.status] || APPT_STATUS.Pending;
                return (
                  <tr
                    key={appt.id}
                    className={`hover:bg-surface-container-low transition-colors ${appt.status === 'Cancelled' ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary">{appt.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-on-surface text-sm">{appt.patientName}</p>
                      <p className="text-xs text-on-surface-variant">{appt.patientPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{appt.serviceName}</td>
                    <td className="px-5 py-4 text-sm font-bold text-on-surface">{appt.dentistName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${conf.badge}`}>
                        <Icon name={conf.icon} className="text-[13px]" />
                        {conf.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {/* Xác nhận (chỉ Pending) */}
                        {appt.status === 'Pending' && (
                          <button
                            id={`btn-confirm-${appt.id}`}
                            onClick={() => confirmAppointment(appt.id)}
                            className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Icon name="check" className="text-[13px]" />
                            Xác nhận
                          </button>
                        )}
                        {/* Vào khám (Confirmed hoặc Pending) */}
                        {(appt.status === 'Confirmed' || appt.status === 'Pending') && (
                          <button
                            id={`btn-checkin-${appt.id}`}
                            onClick={() => handleCheckin(appt)}
                            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Icon name="how_to_reg" className="text-[13px]" />
                            Vào khám
                          </button>
                        )}
                        {/* Hủy */}
                        {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                          <button
                            id={`btn-cancel-${appt.id}`}
                            onClick={() => {
                              if (window.confirm(`Hủy lịch hẹn của ${appt.patientName}?`)) {
                                cancelAppointment(appt.id);
                              }
                            }}
                            className="px-2.5 py-1.5 border border-error text-error rounded-lg text-xs font-bold hover:bg-error-container cursor-pointer transition-all"
                            title="Hủy lịch"
                          >
                            <Icon name="cancel" className="text-[13px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Icon name="calendar_today" className="text-[64px] text-outline/40" />
              <p className="text-on-surface-variant mt-4">Không có lịch hẹn nào phù hợp</p>
              {(filterDentist !== 'all' || filterStatus !== 'all' || searchQuery) && (
                <button
                  onClick={() => { setFilterDentist('all'); setFilterStatus('all'); setSearchQuery(''); }}
                  className="mt-2 text-primary text-sm font-bold hover:underline cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Timeline by dentist ── */}
      <div className="mt-6 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
          <Icon name="view_timeline" className="text-primary" />
          <h4 className="font-headline-sm text-headline-sm">Timeline theo phòng khám — {viewDay === 'today' ? 'Hôm nay' : viewDay === 'tomorrow' ? 'Ngày mai' : 'Cả tuần'}</h4>
        </div>
        <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dentists.map(d => {
            const dAppts = appointments.filter(a => a.dentistId === d.id);
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
                  {dAppts.slice(0, 5).map((a, ai) => {
                    const c = APPT_STATUS[a.status] || APPT_STATUS.Pending;
                    return (
                      <div key={ai} className={`text-[10px] px-2 py-1.5 rounded-lg ${c.badge} flex items-center justify-between gap-1`}>
                        <span className="font-bold shrink-0">{a.time}</span>
                        <span className="truncate">{a.patientName.split(' ').pop()}</span>
                      </div>
                    );
                  })}
                  {dAppts.length === 0 && (
                    <div className="text-[10px] text-on-surface-variant italic py-2 text-center">Trống</div>
                  )}
                  {dAppts.length > 5 && (
                    <div className="text-[10px] text-primary font-bold text-center">+{dAppts.length - 5} lịch khác</div>
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
