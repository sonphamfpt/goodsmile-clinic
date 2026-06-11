import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';
import { Invoice } from '../../../types/clinic';

export const CashierHistory: React.FC = () => {
  const { invoices } = useClinic();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [showPrintToast, setShowPrintToast] = useState(false);

  // Filter paid invoices
  const paidInvoices = invoices.filter((inv) => {
    const isPaid = inv.status === 'Paid';
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientPhone.includes(searchQuery);

    const matchesMethod = methodFilter === 'ALL' || inv.paymentMethod === methodFilter;

    return isPaid && matchesSearch && matchesMethod;
  });

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  const handleReprint = (id: string) => {
    setSelectedInvoiceId(id);
    setShowPrintToast(true);
    setTimeout(() => {
      setShowPrintToast(false);
    }, 2500);
  };

  const getMethodBadge = (method?: Invoice['paymentMethod']) => {
    switch (method) {
      case 'Cash':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Card':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Transfer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodLabel = (method?: Invoice['paymentMethod']) => {
    switch (method) {
      case 'Cash':
        return 'Tiền mặt';
      case 'Card':
        return 'Ví / Thẻ';
      case 'Transfer':
        return 'Chuyển khoản';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Filters */}
      <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 font-bold">history</span>
          <div>
            <h3 className="font-bold text-on-surface">Lịch Sử Thanh Toán</h3>
            <p className="text-xs text-on-surface-variant">Tra cứu và in lại biên lai của toàn bộ hóa đơn đã hoàn tất</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              placeholder="Tìm theo tên bệnh nhân, SĐT hoặc mã HD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              <option value="ALL">Tất cả phương thức</option>
              <option value="Cash">Tiền mặt</option>
              <option value="Card">Ví / Thẻ POS</option>
              <option value="Transfer">Chuyển khoản</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Table list */}
        <div className={`${selectedInvoice ? 'col-span-12 lg:col-span-7' : 'col-span-12'} transition-all duration-300`}>
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Mã HD</th>
                    <th className="px-6 py-3.5">Khách hàng</th>
                    <th className="px-6 py-3.5">Thực thu</th>
                    <th className="px-6 py-3.5 text-center">Phương thức</th>
                    <th className="px-6 py-3.5">Thời gian</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-xs">
                  {paidInvoices.length > 0 ? (
                    paidInvoices.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedInvoiceId(inv.id)}
                        className={`hover:bg-amber-600/5 transition-all cursor-pointer ${
                          selectedInvoiceId === inv.id ? 'bg-amber-600/5 font-semibold' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-data-mono text-amber-600 font-bold">{inv.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-on-surface">{inv.patientName}</p>
                          <p className="text-[10px] text-on-surface-variant">{inv.patientPhone}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-amber-700">₫{inv.netPrice.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${getMethodBadge(inv.paymentMethod)}`}>
                            {getMethodLabel(inv.paymentMethod)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant font-medium">
                          {new Date(inv.createdAt).toLocaleDateString('vi-VN')} {new Date(inv.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReprint(inv.id);
                            }}
                            className="p-1 border border-outline hover:border-amber-600 text-on-surface-variant hover:text-amber-600 rounded transition-all cursor-pointer"
                            title="In lại hóa đơn"
                          >
                            <span className="material-symbols-outlined text-sm block">print</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-on-surface-variant italic">
                        <span className="material-symbols-outlined text-4xl text-outline mb-2">history</span>
                        <p>Chưa có hóa đơn thanh toán nào trong lịch sử.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected invoice drawer detail */}
        {selectedInvoice && (
          <div className="col-span-12 lg:col-span-5 animate-in slide-in-from-right duration-250">
            <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-600/5 rounded-bl-full flex items-center justify-center pointer-events-none">
                <span className="material-symbols-outlined text-amber-600/20 text-3xl translate-x-2 -translate-y-2">check_circle</span>
              </div>

              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <h3 className="font-bold text-sm text-on-surface">Chi Tiết Hóa Đơn {selectedInvoice.id}</h3>
                <button
                  onClick={() => setSelectedInvoiceId(null)}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 text-on-surface-variant">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-outline">Bệnh nhân</span>
                    <strong className="text-on-surface">{selectedInvoice.patientName}</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-outline">Số điện thoại</span>
                    <strong className="text-on-surface">{selectedInvoice.patientPhone}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="block text-[9px] uppercase font-bold text-outline">Thời gian tạo</span>
                    <strong className="text-on-surface">{new Date(selectedInvoice.createdAt).toLocaleString('vi-VN')}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="block text-[9px] uppercase font-bold text-outline">Phương thức</span>
                    <strong className="text-on-surface">{getMethodLabel(selectedInvoice.paymentMethod)}</strong>
                  </div>
                </div>

                <div className="border-t border-outline-variant/30 pt-3 space-y-2">
                  <span className="block text-[9px] uppercase font-bold text-outline mb-1">Dịch vụ thực hiện</span>
                  {selectedInvoice.services.map((srv, idx) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span>{srv.serviceName}</span>
                      <span className="font-data-mono">₫{srv.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant/30 pt-3 space-y-1.5 text-right font-medium text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Tổng tiền niêm yết:</span>
                    <span>₫{selectedInvoice.totalPrice.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.insuranceDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>BHYT giảm (15%):</span>
                      <span>-₫{selectedInvoice.insuranceDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedInvoice.memberDiscount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Giảm giá thành viên:</span>
                      <span>-₫{selectedInvoice.memberDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-amber-700 border-t border-dashed border-outline-variant pt-2 mt-1">
                    <span>Tổng thực thu:</span>
                    <span>₫{selectedInvoice.netPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex gap-2 border-t border-outline-variant/30">
                  <button
                    onClick={() => handleReprint(selectedInvoice.id)}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    In lại biên lai
                  </button>
                  <button
                    onClick={() => alert(`Đã gửi email biên lai hóa đơn điện tử cho ${selectedInvoice.patientName}!`)}
                    className="py-2 px-3 border border-outline text-on-surface-variant hover:text-on-surface rounded text-xs font-bold transition-all cursor-pointer"
                    title="Gửi Email"
                  >
                    <span className="material-symbols-outlined text-sm block">mail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printing toast notification */}
      <div
        className={`fixed bottom-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
          showPrintToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-amber-400 animate-pulse">print</span>
        <div>
          <p className="font-bold text-xs">Đang truyền lệnh in...</p>
          <p className="text-[10px] opacity-80">
            Hóa đơn {selectedInvoiceId} đã được chuyển tới hàng đợi máy in nhiệt.
          </p>
        </div>
      </div>
    </div>
  );
};
