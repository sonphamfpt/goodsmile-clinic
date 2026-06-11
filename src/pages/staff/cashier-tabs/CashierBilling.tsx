import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';

export const CashierBilling: React.FC = () => {
  const { invoices, processPayment } = useClinic();

  // State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Transfer'>('Cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const pendingInvoices = invoices.filter(
    (inv) =>
      inv.status === 'Pending' &&
      (inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.patientPhone.includes(searchQuery))
  );

  const activeInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  const handleConfirmPayment = () => {
    if (!selectedInvoiceId || !activeInvoice) return;

    setIsProcessing(true);

    setTimeout(() => {
      processPayment(selectedInvoiceId, paymentMethod);
      setIsProcessing(false);
      setShowToast(true);
      setSelectedInvoiceId(null);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header filter */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 font-bold">payments</span>
          <div>
            <h3 className="font-bold text-on-surface">Thu Phí Hóa Đơn</h3>
            <p className="text-xs text-on-surface-variant">Xử lý thu phí dịch vụ điều trị và khám lâm sàng</p>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân hoặc mã HD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Invoices List Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm text-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">pending</span>
                Hóa Đơn Chờ Thanh Toán
              </h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-[10px] font-extrabold uppercase border border-amber-200">
                  {pendingInvoices.length} Đang Chờ
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Mã HD</th>
                    <th className="px-6 py-3">Bệnh nhân</th>
                    <th className="px-6 py-3">Chi tiết dịch vụ</th>
                    <th className="px-6 py-3 text-right">Tổng phải thu</th>
                    <th className="px-6 py-3 text-center">Trạng thái</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-body-md">
                  {pendingInvoices.length > 0 ? (
                    pendingInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className={`hover:bg-amber-600/5 transition-colors cursor-pointer ${
                          selectedInvoiceId === inv.id ? 'bg-amber-600/5 font-semibold' : ''
                        }`}
                        onClick={() => setSelectedInvoiceId(inv.id)}
                      >
                        <td className="px-6 py-4 font-data-mono text-data-mono text-amber-600 font-bold">{inv.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{inv.patientName}</p>
                          <p className="text-xs text-on-surface-variant">{inv.patientPhone}</p>
                        </td>
                        <td className="px-6 py-4 truncate max-w-[200px]">
                          {inv.services.map((s) => s.serviceName).join(', ')}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-amber-700">
                          ₫{inv.netPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                            Chờ thu
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoiceId(inv.id);
                            }}
                            className="px-3 py-1 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded text-xs font-bold transition-all cursor-pointer"
                          >
                            Xử lý
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-on-surface-variant italic">
                        <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                        <p>Hiện tại không có hóa đơn chờ thanh toán nào khớp bộ lọc.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Checkout Breakdown & Wizard Panel */}
          {activeInvoice && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-200">
              {/* Detailed billing components */}
              <div className="bg-white rounded-xl border border-outline-variant p-5 border-l-4 border-l-amber-600 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline-sm text-headline-sm">Chi tiết: {activeInvoice.id}</h3>
                    <span className="text-[10px] font-bold text-on-surface-variant">
                      {new Date(activeInvoice.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                    <div className="flex justify-between border-b border-dashed border-outline-variant pb-1.5">
                      <span>Bệnh nhân:</span>
                      <strong className="text-on-surface">{activeInvoice.patientName}</strong>
                    </div>
                    <div className="space-y-1">
                      {activeInvoice.services.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>• {item.serviceName}:</span>
                          <span className="font-data-mono">₫{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-dashed border-outline-variant pt-2 flex justify-between">
                      <span>Tổng tiền dịch vụ:</span>
                      <span className="font-data-mono">₫{activeInvoice.totalPrice.toLocaleString()}</span>
                    </div>
                    {activeInvoice.insuranceDiscount > 0 && (
                      <div className="flex justify-between text-secondary">
                        <span>BHYT giảm trừ (15%):</span>
                        <span className="font-data-mono font-bold">-₫{activeInvoice.insuranceDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    {activeInvoice.memberDiscount > 0 && (
                      <div className="flex justify-between text-secondary">
                        <span>Chiết khấu hội viên:</span>
                        <span className="font-data-mono font-bold">-₫{activeInvoice.memberDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-outline-variant pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-on-surface">Cần thanh toán:</span>
                  <span className="text-headline-md text-amber-700 font-extrabold">
                    ₫{activeInvoice.netPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment selection & confirm */}
              <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Phương thức thanh toán
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'Cash'
                        ? 'border-amber-600 bg-amber-600/5 text-amber-700'
                        : 'border-outline-variant hover:border-amber-600/20 text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">payments</span>
                    <span className="text-[10px] font-bold">Tiền mặt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-amber-600 bg-amber-600/5 text-amber-700'
                        : 'border-outline-variant hover:border-amber-600/20 text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">credit_card</span>
                    <span className="text-[10px] font-bold">Ví / Thẻ POS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transfer')}
                    className={`flex flex-col items-center gap-1.5 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'Transfer'
                        ? 'border-amber-600 bg-amber-600/5 text-amber-700'
                        : 'border-outline-variant hover:border-amber-600/20 text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">qr_code_2</span>
                    <span className="text-[10px] font-bold">Chuyển khoản</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3 bg-amber-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md hover:bg-amber-700 cursor-pointer text-xs"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        ĐANG XỬ LÝ THANH TOÁN...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        HOÀN TẤT THU PHÍ (₫{activeInvoice.netPrice.toLocaleString()})
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReceipt(true)}
                    className="w-full py-2.5 border border-outline text-on-surface-variant rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-surface-container transition-all cursor-pointer text-xs"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Xem trước & In hóa đơn
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Section: Active Waitlist Queue Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden h-[360px] flex flex-col shadow-sm">
            <div className="p-4 bg-amber-50 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                Hàng Chờ Đóng Phí Dịch Vụ
              </h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-bold uppercase">
                {pendingInvoices.length} Bệnh nhân
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50">
              {pendingInvoices.map((inv, index) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoiceId(inv.id)}
                  className={`p-3 bg-white border rounded-lg flex items-center gap-3 cursor-pointer transition-all shadow-sm hover:border-amber-600 ${
                    selectedInvoiceId === inv.id ? 'border-amber-600 ring-1 ring-amber-600' : 'border-outline-variant/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">{inv.patientName}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">
                      {inv.services.map((s) => s.serviceName).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-amber-700">₫{inv.netPrice.toLocaleString()}</p>
                    <p className="text-[8px] text-outline uppercase font-bold">{inv.id}</p>
                  </div>
                </div>
              ))}

              {pendingInvoices.length === 0 && (
                <div className="h-full flex flex-col justify-center items-center text-on-surface-variant text-center p-6">
                  <span className="material-symbols-outlined text-3xl mb-1 text-outline">verified</span>
                  <p className="text-xs font-bold">Đã hoàn thành mọi khoản thu phí!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-amber-900 text-amber-50 p-5 rounded-xl border border-amber-800 shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-[100px]">receipt_long</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Nhắc nhở Nghiệp Vụ</p>
            <p className="text-xs leading-relaxed">
              Các hóa đơn có chiết khấu bảo hiểm y tế hoặc thẻ thành viên Diamond/Platinum cần được đối chiếu thẻ cứng trước khi lưu trạng thái đã đóng phí.
            </p>
            <div className="pt-2 flex justify-between text-xs border-t border-amber-800 text-amber-200">
              <span>Hỗ trợ kĩ thuật:</span>
              <strong className="text-white">NHÁNH 2 (102)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Success payment Toast */}
      <div
        className={`fixed bottom-10 right-10 bg-secondary text-on-secondary px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 z-50 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined">check_circle</span>
        <div>
          <p className="font-bold">Thành công!</p>
          <p className="text-xs opacity-90">Hóa đơn đã chốt và ghi nhận vào sổ quỹ.</p>
        </div>
      </div>

      {/* Print receipt preview Modal */}
      {showReceipt && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4 shadow-2xl border border-outline-variant max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="text-center space-y-1">
              <h2 className="font-bold text-lg">BIÊN LAI THANH TOÁN</h2>
              <p className="text-xs text-on-surface-variant">Nha Khoa GoodSmile Pro</p>
              <p className="text-[10px] text-on-surface-variant">Kiều Mai, Từ Liêm, Hà Nội • ĐT: 1900 6789</p>
            </div>

            <hr className="border-t border-dashed border-outline" />

            <div className="text-xs space-y-1">
              <p>
                <strong>Mã hóa đơn:</strong> {activeInvoice.id}
              </p>
              <p>
                <strong>Ngày xuất:</strong> {new Date().toLocaleString('vi-VN')}
              </p>
              <p>
                <strong>Khách hàng:</strong> {activeInvoice.patientName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {activeInvoice.patientPhone}
              </p>
            </div>

            <hr className="border-t border-dashed border-outline" />

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-outline">
                  <th className="py-1">Dịch vụ</th>
                  <th className="py-1 text-right">Giá</th>
                </tr>
              </thead>
              <tbody>
                {activeInvoice.services.map((s, idx) => (
                  <tr key={idx}>
                    <td className="py-1">{s.serviceName}</td>
                    <td className="py-1 text-right font-data-mono">₫{s.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="border-t border-dashed border-outline" />

            <div className="text-xs space-y-1 text-right">
              <p>Tổng chi phí dịch vụ: ₫{activeInvoice.totalPrice.toLocaleString()}</p>
              {activeInvoice.insuranceDiscount > 0 && (
                <p className="text-secondary">Khấu trừ BHYT (15%): -₫{activeInvoice.insuranceDiscount.toLocaleString()}</p>
              )}
              {activeInvoice.memberDiscount > 0 && (
                <p className="text-secondary">Chiết khấu hội viên: -₫{activeInvoice.memberDiscount.toLocaleString()}</p>
              )}
              <p className="text-sm font-bold text-amber-700">Tổng thực thu: ₫{activeInvoice.netPrice.toLocaleString()}</p>
            </div>

            <div className="text-center text-[10px] text-on-surface-variant pt-4 border-t border-dashed border-outline">
              <p>Chúc Quý khách luôn có nụ cười rạng rỡ và khỏe mạnh!</p>
              <p>Hẹn gặp lại quý khách lần tới.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-1.5 border border-outline text-on-surface rounded text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert('Đang gửi dữ liệu đến máy in hóa đơn k-80...');
                  setShowReceipt(false);
                }}
                className="flex-1 py-1.5 bg-amber-600 text-white rounded text-xs font-bold cursor-pointer"
              >
                Xác Nhận In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
