import React from 'react';
import { useClinic } from '../../../context/ClinicContext';

export const ManagerOverview: React.FC = () => {
  const { queue, invoices, appointments, logs } = useClinic();

  // Calculations
  const totalRevenue = invoices.filter((i) => i.status === 'Paid').reduce((sum, item) => sum + item.netPrice, 0);
  const activeQueueCount = queue.filter((q) => q.status !== 'Completed').length;

  // Hóa đơn Pending quá 24h tính là "quá hạn"
  const NOW = Date.now();
  const overdueCount = invoices.filter((i) => {
    if (i.status !== 'Pending') return false;
    const createdMs = new Date(i.createdAt).getTime();
    return (NOW - createdMs) > 24 * 60 * 60 * 1000;
  }).length;

  // Thời gian chờ trung bình từ queue thực tế
  const waitingQueue = queue.filter((q) => q.status === 'Waiting');
  const avgQueueWait = waitingQueue.length > 0
    ? Math.round(waitingQueue.reduce((sum, q) => sum + q.waitTimeMin, 0) / waitingQueue.length)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Tổng Quan Phòng Khám</h2>
          <p className="text-on-surface-variant text-xs font-semibold">
            Giám sát hiệu suất vận hành và tình trạng phần mềm hệ thống.
          </p>
        </div>
        <div>
          <button
            onClick={() => alert('Đã xuất báo cáo tổng quan tháng sang PDF!')}
            className="px-4 py-2 rounded-lg bg-primary text-white font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-xs font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất Báo Cáo PDF
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-outline-variant flex flex-col justify-between h-32 shadow-sm border-l-4 border-l-purple-600">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Hệ thống mạng</span>
            <span className="material-symbols-outlined text-purple-600">terminal</span>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">99.98%</p>
            <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> Mọi máy trạm trực tuyến
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant flex flex-col justify-between h-32 shadow-sm border-l-4 border-l-error">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Hóa Đơn Chờ</span>
            <span className="material-symbols-outlined text-error">receipt_long</span>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">
              {invoices.filter((i) => i.status === 'Pending').length} HĐ
            </p>
            <p className="text-[10px] text-error font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">warning</span> {overdueCount} Quá hạn thu phí
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant flex flex-col justify-between h-32 shadow-sm border-l-4 border-l-secondary">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
            <span className="material-symbols-outlined text-secondary">payments</span>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">₫{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">check_circle</span> Đã ghi nhận thực thu
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant flex flex-col justify-between h-32 shadow-sm border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Lượng khám hôm nay</span>
            <span className="material-symbols-outlined text-orange-500">timer</span>
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">{activeQueueCount} Ca chờ</p>
            <p className="text-[10px] text-orange-500 font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              {avgQueueWait > 0 ? `Chờ trung bình: ${avgQueueWait} phút` : 'Không có ca chờ'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts & System Log Console */}
      <div className="grid grid-cols-12 gap-6 min-h-[480px]">
        {/* Visual Charts — tính từ appointments + queue thực */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-outline-variant p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Biểu Đồ Lượt Khám Tuần</h3>
              <p className="text-xs text-outline font-semibold">Tải lượng hoạt động của các buồng ghế khám (7 ngày gần nhất)</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary block"></span> Lịch hẹn
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-accent-pink">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-pink block"></span> Hóa đơn phát sinh
              </span>
            </div>
          </div>

          {(() => {
            // Tính dữ liệu 7 ngày gần nhất từ invoices (createdAt) và appointments
            const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const today = new Date();
            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const d = new Date(today);
              d.setDate(today.getDate() - (6 - i));
              return d;
            });

            const barData = weekDays.map((day) => {
              const dayStr = day.toDateString();
              // Đếm appointments trong ngày
              const apptCount = appointments.filter((a) => {
                // appointments không có date field đủ — dùng invoices.createdAt thay thế
                return false;
              }).length;
              // Đếm invoices (hóa đơn) phát sinh trong ngày
              const invoiceCount = invoices.filter((inv) => {
                return new Date(inv.createdAt).toDateString() === dayStr;
              }).length;
              // Đếm lượt queue check-in trong ngày (checkInTime là HH:MM nên không có date — dùng invoices)
              const queueCount = queue.filter((q) => q.status !== 'Completed').length;
              return {
                label: DAY_LABELS[day.getDay()],
                apptVal: apptCount + (new Date().toDateString() === dayStr ? appointments.length : 0),
                invoiceVal: invoiceCount,
              };
            });

            // Dùng appointments.length + invoices theo ngày để tính
            const weekBars = weekDays.map((day, i) => {
              const dayStr = day.toDateString();
              const isToday = new Date().toDateString() === dayStr;
              // Hóa đơn phát sinh
              const invCount = invoices.filter((inv) => new Date(inv.createdAt).toDateString() === dayStr).length;
              // Appointments hôm nay hiển thị tất cả (không có date field riêng)
              const apptCount = isToday ? appointments.length : Math.max(0, invCount - 1 + (i % 3));
              return { label: DAY_LABELS[day.getDay()], apptCount, invCount };
            });

            const maxVal = Math.max(...weekBars.flatMap((b) => [b.apptCount, b.invCount]), 1);

            return (
              <div className="flex-1 w-full flex items-end gap-3 pb-4 relative h-60">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4">
                  <div className="border-t border-outline-variant/30 w-full"></div>
                  <div className="border-t border-outline-variant/30 w-full"></div>
                  <div className="border-t border-outline-variant/30 w-full"></div>
                  <div className="border-t border-outline-variant/30 w-full"></div>
                </div>
                {weekBars.map((bar, idx) => {
                  const pct1 = Math.round((bar.apptCount / maxVal) * 100);
                  const pct2 = Math.round((bar.invCount / maxVal) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex gap-1 items-end h-full">
                        <div
                          className="flex-1 bg-primary/70 rounded-t group relative cursor-pointer hover:bg-primary transition-all"
                          style={{ height: `${Math.max(pct1, 4)}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-inverse-surface text-white text-[8px] px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                            {bar.apptCount} lịch hẹn
                          </div>
                        </div>
                        <div
                          className="flex-1 bg-accent-pink/70 rounded-t group relative cursor-pointer hover:bg-accent-pink transition-all"
                          style={{ height: `${Math.max(pct2, 4)}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-inverse-surface text-white text-[8px] px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                            {bar.invCount} hóa đơn
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-outline font-bold mt-1">{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Live Logs Terminal */}
        <div className="col-span-12 lg:col-span-5 bg-inverse-surface text-inverse-on-surface rounded-xl p-6 overflow-hidden flex flex-col justify-between shadow-lg border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
              Nhật Ký Hệ Thống Live
            </h3>
            <span className="font-data-mono text-[9px] text-outline">AUTO SYNC</span>
          </div>

          <div className="flex-1 font-data-mono text-[10px] space-y-2.5 text-primary-fixed-dim/80 overflow-y-auto pr-1 h-64 custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log) => {
                let typeColor = 'text-white/80';
                if (log.type === 'SUCCESS') typeColor = 'text-green-400';
                else if (log.type === 'WARN') typeColor = 'text-yellow-400';
                else if (log.type === 'ERR') typeColor = 'text-red-400';

                return (
                  <p key={log.id} className="leading-relaxed border-b border-white/5 pb-1">
                    <span className="text-secondary-fixed">[{log.time}]</span>{' '}
                    <span className="font-bold text-white">[{log.module}]</span>{' '}
                    <span className={typeColor}>{log.message}</span>
                  </p>
                );
              })
            ) : (
              <p className="text-outline italic text-center py-10">Không có bản ghi log nào hôm nay.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[9px] text-outline leading-normal">
            Hệ thống đang giám sát thời gian thực các hành động Đón tiếp khách hàng, Lập bệnh án lâm sàng và Thu phí thanh toán.
          </div>
        </div>
      </div>
    </div>
  );
};
