import React from 'react';
import { useClinic } from '../../../context/ClinicContext';

export const ManagerRevenue: React.FC = () => {
  const { invoices } = useClinic();

  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid');

  // Revenue computations
  const totalServiceFee = paidInvoices.reduce((sum, inv) => sum + inv.totalPrice, 0);
  const totalInsuranceDiscount = paidInvoices.reduce((sum, inv) => sum + inv.insuranceDiscount, 0);
  const totalMemberDiscount = paidInvoices.reduce((sum, inv) => sum + inv.memberDiscount, 0);
  const netRevenue = paidInvoices.reduce((sum, inv) => sum + inv.netPrice, 0);

  // Average ticket size
  const avgTicket = paidInvoices.length > 0 ? Math.round(netRevenue / paidInvoices.length) : 0;

  // Monthly target mock
  const monthlyTarget = 150000000; // 150M VND
  const currentProgressPercent = Math.min(Math.round((netRevenue / monthlyTarget) * 100), 100);

  // Revenue by dentist (mock attribution for display)
  const dentistAttributions = [
    { name: 'Dr. Lê Minh', specialty: 'Răng sứ & Phẫu thuật', share: 0.4, count: 18 },
    { name: 'Dr. Nguyễn An', specialty: 'Chỉnh nha & Niềng răng', share: 0.35, count: 12 },
    { name: 'Dr. Phạm Vy', specialty: 'Nha khoa trẻ em', share: 0.15, count: 9 },
    { name: 'Dr. Đỗ Đức', specialty: 'Điều trị tủy & Nội nha', share: 0.1, count: 5 }
  ].map((d) => ({
    ...d,
    revenueGenerated: Math.round(netRevenue * d.share)
  }));

  // Revenue by service category
  const serviceStats = [
    { category: 'Trồng răng Implant', quantity: 5, value: 75000000, trend: 'up' },
    { category: 'Răng sứ thẩm mỹ', quantity: 12, value: 54000000, trend: 'up' },
    { category: 'Niềng răng invisalign', quantity: 2, value: 48000000, trend: 'stable' },
    { category: 'Tẩy trắng răng', quantity: 18, value: 16200000, trend: 'up' },
    { category: 'Điều trị nha chu / Nhổ răng khôn', quantity: 24, value: 18850000, trend: 'down' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 font-bold">receipt_long</span>
          <div>
            <h3 className="font-bold text-on-surface">Báo Cáo Doanh Thu</h3>
            <p className="text-xs text-on-surface-variant">Phân tích dòng tiền thực thu, thống kê hiệu suất doanh số dịch vụ</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => alert('Đã xuất báo cáo doanh thu tài chính sang Excel!')}
            className="px-4 py-2 rounded-lg border border-outline text-on-surface-variant hover:text-on-surface text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">grid_on</span>
            Xuất Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
          <span className="text-[10px] text-outline font-bold uppercase">Doanh Thu Thuần (Net)</span>
          <p className="text-xl font-extrabold text-purple-700">₫{netRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Trừ chiết khấu & bảo hiểm</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
          <span className="text-[10px] text-outline font-bold uppercase">Tổng Giá Trị Dịch Vụ</span>
          <p className="text-xl font-extrabold text-on-surface">₫{totalServiceFee.toLocaleString()}</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Giá niêm yết trước giảm</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
          <span className="text-[10px] text-outline font-bold uppercase">Giảm Giá Thành Viên</span>
          <p className="text-xl font-extrabold text-secondary">₫{totalMemberDiscount.toLocaleString()}</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Trừ trực tiếp thẻ Loyalty</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
          <span className="text-[10px] text-outline font-bold uppercase">BHYT Chi Trả</span>
          <p className="text-xl font-extrabold text-secondary">₫{totalInsuranceDiscount.toLocaleString()}</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Giảm trừ bảo hiểm liên kết</span>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-bold text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-purple-600 text-sm">target</span> Tiến trình doanh thu tháng 6
          </span>
          <span className="text-on-surface-variant">
            Đạt <strong>₫{netRevenue.toLocaleString()}</strong> / ₫{monthlyTarget.toLocaleString()} (
            <strong>{currentProgressPercent}%</strong>)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-outline-variant/30">
          <div className="bg-gradient-to-r from-purple-500 to-purple-800 h-full rounded-full transition-all duration-500" style={{ width: `${currentProgressPercent}%` }}></div>
        </div>
      </div>

      {/* Detail Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Dentist */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h4 className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-purple-600">groups</span>
              Phân Phối Doanh Thu Theo Bác Sĩ
            </h4>
          </div>

          <div className="divide-y divide-outline-variant">
            {dentistAttributions.map((dentist, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-on-surface">{dentist.name}</h5>
                  <p className="text-[10px] text-on-surface-variant font-medium">{dentist.specialty} • {dentist.count} ca</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-purple-700">₫{dentist.revenueGenerated.toLocaleString()}</p>
                  <p className="text-[9px] text-outline font-bold">Tỷ lệ: {dentist.share * 100}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue by Service type category */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h4 className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-purple-600">medical_services</span>
              Nhóm Dịch Vụ Tạo Doanh Thu Cao Nhất
            </h4>
          </div>

          <div className="divide-y divide-outline-variant">
            {serviceStats.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <h5 className="font-bold text-xs text-on-surface">{item.category}</h5>
                  <p className="text-[10px] text-on-surface-variant font-medium">Số lượt sử dụng: {item.quantity}</p>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <p className="text-xs font-bold text-on-surface">₫{item.value.toLocaleString()}</p>
                  </div>
                  <span className={`material-symbols-outlined text-sm ${
                    item.trend === 'up' ? 'text-secondary font-bold' : item.trend === 'down' ? 'text-error font-bold' : 'text-slate-400'
                  }`}>
                    {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'horizontal_rule'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
