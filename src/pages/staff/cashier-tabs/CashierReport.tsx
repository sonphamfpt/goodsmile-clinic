import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';

export const CashierReport: React.FC = () => {
  const { invoices } = useClinic();

  // Shift details
  const initialCash = 15200000; // 15.2M VND starter fund
  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid' || inv.status === 'Partially Paid');

  // Calculate shift income per payment method
  const cashIncome = invoices.reduce((sum, inv) => {
    if (inv.payments && inv.payments.length > 0) {
      return sum + inv.payments.filter(p => p.method === 'Cash').reduce((s, p) => s + p.amount, 0);
    }
    if (inv.status === 'Paid' && inv.paymentMethod === 'Cash') {
      return sum + inv.netPrice;
    }
    return sum;
  }, 0);

  const nonCashIncome = invoices.reduce((sum, inv) => {
    if (inv.payments && inv.payments.length > 0) {
      return sum + inv.payments.filter(p => p.method !== 'Cash').reduce((s, p) => s + p.amount, 0);
    }
    if (inv.status === 'Paid' && inv.paymentMethod && inv.paymentMethod !== 'Cash') {
      return sum + inv.netPrice;
    }
    return sum;
  }, 0);

  const totalCollected = cashIncome + nonCashIncome;
  const expectedPhysicalCash = initialCash + cashIncome;

  // Form states
  const [actualCashInput, setActualCashInput] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const actualCash = parseFloat(actualCashInput) || 0;
  const discrepancy = actualCash - expectedPhysicalCash;

  const handleShiftClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualCashInput) {
      alert('Vui lòng nhập số tiền mặt thực tế kiểm đếm!');
      return;
    }

    setIsSubmitted(true);
    alert('Báo cáo ca trực đã được chốt và gửi lên hệ thống quản lý thành công!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex items-center gap-2">
        <Icon name="analytics" className="text-amber-600 font-bold" />
        <div>
          <h3 className="font-bold text-on-surface">Báo Cáo Ca Trực & Sổ Quỹ</h3>
          <p className="text-xs text-on-surface-variant">Chốt doanh thu ca trực, đối soát tiền mặt ngăn kéo và chốt ca làm việc</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Statistics Columns */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
              <span className="text-[10px] text-outline font-bold uppercase">Tổng Doanh Thu Ca</span>
              <p className="text-xl font-extrabold text-amber-700">₫{totalCollected.toLocaleString()}</p>
              <span className="text-[10px] text-on-surface-variant font-medium">Lượt chốt: {paidInvoices.length} hóa đơn</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
              <span className="text-[10px] text-outline font-bold uppercase">Tiền Mặt Ngăn Kéo (Lý thuyết)</span>
              <p className="text-xl font-extrabold text-on-surface">₫{expectedPhysicalCash.toLocaleString()}</p>
              <span className="text-[9px] text-on-surface-variant leading-tight">
                Vốn đầu ca: ₫{initialCash.toLocaleString()} + Thu mặt: ₫{cashIncome.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-28">
              <span className="text-[10px] text-outline font-bold uppercase">Ví/Thẻ/Chuyển Khoản</span>
              <p className="text-xl font-extrabold text-secondary">₫{nonCashIncome.toLocaleString()}</p>
              <span className="text-[10px] text-on-surface-variant font-medium">Được chuyển trực tiếp vào tài khoản phòng khám</span>
            </div>
          </div>

          {/* Closing Verification Form */}
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-headline-sm border-b border-outline-variant/30 pb-3 flex items-center gap-1.5">
              <Icon name="assignment_turned_in" className="text-amber-600" />
              Bảng Kiểm Kê & Bàn Giao Ca
            </h3>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg p-5 text-center space-y-3">
                <Icon name="task_alt" className="text-4xl text-emerald-600" />
                <h4 className="font-bold">CA TRỰC ĐÃ CHỐT SỔ THÀNH CÔNG</h4>
                <p className="text-xs text-emerald-800">
                  Dữ liệu bàn giao của bạn đã được lưu lại lúc {new Date().toLocaleTimeString('vi-VN')} vào sổ cái kế toán.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setActualCashInput('');
                      setReportNotes('');
                    }}
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded text-xs hover:bg-emerald-700"
                  >
                    Khai báo lại ca mới
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleShiftClose} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                      Tổng tiền mặt thực tế đếm được *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-outline">₫</span>
                      <input
                        type="number"
                        required
                        placeholder="Nhập số tiền thực tế..."
                        value={actualCashInput}
                        onChange={(e) => setActualCashInput(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-600 font-data-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">
                      Chênh lệch (Lý thuyết vs Thực tế)
                    </label>
                    <div
                      className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                        discrepancy === 0
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : discrepancy > 0
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'bg-error-container/30 border-error text-error'
                      }`}
                    >
                      {discrepancy === 0 ? (
                        'Đủ khớp hoàn toàn (0đ)'
                      ) : discrepancy > 0 ? (
                        `Thừa: ₫${discrepancy.toLocaleString()}`
                      ) : (
                        `Thiếu hụt: ₫${Math.abs(discrepancy).toLocaleString()}`
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant mb-1">Ghi chú bàn giao</label>
                  <textarea
                    rows={3}
                    placeholder="Điền ghi chú (Ví dụ: bàn giao lẻ tiền mặt, thẻ POS hết giấy, v.v...)"
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-medium focus:outline-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md hover:bg-amber-700 cursor-pointer"
                  >
                    <Icon name="lock_clock" className="text-sm" />
                    KHOÁ SỔ & CHỐT CA TRỰC
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Section: Rules & System Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase text-amber-900 flex items-center gap-1">
              <Icon name="info" className="text-sm" /> Quy trình chốt quỹ
            </h4>
            <ul className="text-xs text-on-surface-variant space-y-2 list-decimal list-inside leading-relaxed">
              <li>Đếm tiền mặt thực tế trong ngăn kéo trước khi chốt ca.</li>
              <li>Nhập số tiền mặt thực tế kiểm đếm vào ô kê khai.</li>
              <li>Đối chiếu các khoản chênh lệch phát sinh (nếu có).</li>
              <li>In báo cáo ca từ máy in hóa đơn (nếu có nhu cầu lưu trữ giấy).</li>
              <li>Tiến hành ký biên bản giao nhận tiền mặt với nhân viên ca sau.</li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-xl border border-outline-variant p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase text-on-surface">Lịch sử chốt ca gần đây</h4>
            <div className="space-y-2.5 text-[10px] text-on-surface-variant font-medium">
              <div className="flex justify-between border-b border-outline-variant/50 pb-1.5">
                <span>04/06 - Ca Sáng:</span>
                <span className="text-emerald-700 font-bold">Khớp quỹ (Chốt lúc 12:05)</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/50 pb-1.5">
                <span>04/06 - Ca Chiều:</span>
                <span className="text-emerald-700 font-bold">Khớp quỹ (Chốt lúc 18:12)</span>
              </div>
              <div className="flex justify-between">
                <span>05/06 - Ca Sáng:</span>
                <span className="text-amber-800 font-bold">Thừa 20,000đ (Chốt lúc 12:01)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
