import React from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';

export const ManagerRevenue: React.FC = () => {
  const { invoices, dentists } = useClinic();

  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid' || inv.status === 'Partially Paid');

  // Revenue computations
  const netRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalServiceFee = invoices.reduce((sum, inv) => {
    if (inv.status === 'Paid') return sum + inv.totalPrice;
    if (inv.status === 'Partially Paid') {
      const ratio = (inv.paidAmount || 0) / inv.netPrice;
      return sum + Math.round(inv.totalPrice * ratio);
    }
    return sum;
  }, 0);
  const totalInsuranceDiscount = 0; // Phòng khám không nhận BHYT
  const totalMemberDiscount = invoices.reduce((sum, inv) => {
    if (inv.status === 'Paid') return sum + inv.memberDiscount;
    if (inv.status === 'Partially Paid') {
      const ratio = (inv.paidAmount || 0) / inv.netPrice;
      return sum + Math.round(inv.memberDiscount * ratio);
    }
    return sum;
  }, 0);

  // Average ticket size
  const avgTicket = paidInvoices.length > 0 ? Math.round(netRevenue / paidInvoices.length) : 0;

  // Monthly target mock
  const monthlyTarget = 150000000; // 150M VND
  const currentProgressPercent = Math.min(Math.round((netRevenue / monthlyTarget) * 100), 100);

  // --- Phân phối doanh thu theo bác sĩ --- tính từ invoices thực tế
  const dentistRevenueMap: Record<string, { name: string; revenue: number; count: number }> = {};
  invoices.forEach((inv) => {
    const paid = inv.paidAmount || 0;
    if (paid === 0) return;
    const key = inv.dentistName || 'Không xác định';
    if (!dentistRevenueMap[key]) {
      dentistRevenueMap[key] = { name: key, revenue: 0, count: 0 };
    }
    dentistRevenueMap[key].revenue += paid;
    dentistRevenueMap[key].count += 1;
  });
  const dentistAttributions = Object.values(dentistRevenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .map((d) => ({
      ...d,
      share: netRevenue > 0 ? Math.round((d.revenue / netRevenue) * 100) : 0
    }));

  // --- Doanh thu theo nhóm dịch vụ --- tính từ invoices[].services[]
  const serviceRevenueMap: Record<string, { category: string; quantity: number; value: number }> = {};
  invoices.forEach((inv) => {
    if ((inv.paidAmount || 0) === 0) return;
    inv.services.forEach((svc) => {
      const key = svc.serviceName;
      if (!serviceRevenueMap[key]) {
        serviceRevenueMap[key] = { category: key, quantity: 0, value: 0 };
      }
      serviceRevenueMap[key].quantity += 1;
      serviceRevenueMap[key].value += svc.price;
    });
  });
  const serviceStats = Object.values(serviceRevenueMap)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 dịch vụ

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="receipt_long" className="text-purple-600 font-bold" />
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
            <Icon name="grid_on" className="text-sm" />
            Xuất Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
          <span className="text-[10px] text-outline font-bold uppercase">Doanh Thu Thuần (Net)</span>
          <p className="text-xl font-extrabold text-purple-700">₫{netRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Trừ chiết khấu thành viên VIP</span>
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
          <span className="text-[10px] text-outline font-bold uppercase">Số Lượt Giao Dịch</span>
          <p className="text-xl font-extrabold text-purple-700">{paidInvoices.length} lượt</p>
          <span className="text-[10px] text-on-surface-variant font-medium">Số ca giao dịch thành công</span>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-bold text-on-surface flex items-center gap-1">
            <Icon name="target" className="text-purple-600 text-sm" /> Tiến trình doanh thu tháng 6
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
        {/* Revenue by Dentist - tính từ dữ liệu thực */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h4 className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
              <Icon name="groups" className="text-sm text-purple-600" />
              Phân Phối Doanh Thu Theo Bác Sĩ
            </h4>
          </div>

          <div className="divide-y divide-outline-variant">
            {dentistAttributions.length > 0 ? dentistAttributions.map((dentist, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-on-surface">{dentist.name}</h5>
                  <p className="text-[10px] text-on-surface-variant font-medium">{dentist.count} giao dịch có thanh toán</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-purple-700">₫{dentist.revenue.toLocaleString()}</p>
                  <p className="text-[9px] text-outline font-bold">Tỷ lệ: {dentist.share}%</p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-xs text-on-surface-variant italic">Chưa có giao dịch nào được thanh toán</div>
            )}
          </div>
        </section>

        {/* Revenue by Service type - tính từ invoices thực */}
        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h4 className="font-bold text-xs uppercase text-on-surface flex items-center gap-1.5">
              <Icon name="medical_services" className="text-sm text-purple-600" />
              Nhóm Dịch Vụ Tạo Doanh Thu Cao Nhất
            </h4>
          </div>

          <div className="divide-y divide-outline-variant">
            {serviceStats.length > 0 ? serviceStats.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <h5 className="font-bold text-xs text-on-surface">{item.category}</h5>
                  <p className="text-[10px] text-on-surface-variant font-medium">Số lượt sử dụng: {item.quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-on-surface">₫{item.value.toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-xs text-on-surface-variant italic">Chưa có dịch vụ nào được ghi nhận thanh toán</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
