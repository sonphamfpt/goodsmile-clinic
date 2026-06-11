import React, { useState } from 'react';

// Cập nhật Mock Data với chi tiết dịch vụ đầy đủ
const MOCK_INVOICES = [
  {
    id: 'INV-20250928-01',
    patientId: 'P-8821',
    patientName: 'Trần Nguyễn Minh',
    createdAt: '2025-09-28T10:30:00Z',
    status: 'Pending', // Chờ thanh toán
    cashierName: 'Nguyễn Thị Thu',
    services: [
      { serviceName: 'Chụp X-Quang Panorama toàn hàm', unitPrice: 200000, quantity: 1, total: 200000 },
      { serviceName: 'Tiểu phẫu nhổ răng khôn mọc lệch ngầm', unitPrice: 1500000, quantity: 2, total: 3000000 },
    ],
    totalPrice: 3200000,
    insuranceDiscount: 500000, // Thẻ bảo hiểm giảm 500k
    netPrice: 2700000,
    paymentMethod: null,
  },
  {
    id: 'INV-20250527-02',
    patientId: 'P-8821',
    patientName: 'Trần Nguyễn Minh',
    createdAt: '2025-05-27T14:15:00Z',
    status: 'Paid',
    cashierName: 'Lê Văn B',
    services: [
      { serviceName: 'Điều trị tủy răng hàm', unitPrice: 1200000, quantity: 1, total: 1200000 },
      { serviceName: 'Trám Composite xoang II', unitPrice: 300000, quantity: 1, total: 300000 },
    ],
    totalPrice: 1500000,
    insuranceDiscount: 0,
    netPrice: 1500000,
    paymentMethod: 'Chuyển khoản (VNPay)',
    paidAt: '2025-05-27T14:20:00Z',
  },
  {
    id: 'INV-20250515-05',
    patientId: 'P-8821',
    patientName: 'Trần Nguyễn Minh',
    createdAt: '2025-05-15T09:00:00Z',
    status: 'Paid',
    cashierName: 'Lê Văn B',
    services: [
      { serviceName: 'Khám tổng quát & Tư vấn', unitPrice: 100000, quantity: 1, total: 100000 },
      { serviceName: 'Cạo vôi răng siêu âm mức độ 2', unitPrice: 200000, quantity: 1, total: 200000 },
    ],
    totalPrice: 300000,
    insuranceDiscount: 0,
    netPrice: 300000,
    paymentMethod: 'Tiền mặt',
    paidAt: '2025-05-15T09:30:00Z',
  }
];

export const PatientBilling: React.FC = () => {
  const patientId = 'P-8821';
  const patientName = 'Trần Nguyễn Minh';
  
  const pendingInvoices = MOCK_INVOICES.filter(i => i.status === 'Pending');
  const paidInvoices = MOCK_INVOICES.filter(i => i.status === 'Paid');

  const [printInvoice, setPrintInvoice] = useState<any>(null); // State quản lý việc mở modal in

  return (
    <>
    {/* Thêm print:hidden để khi in sẽ ẩn toàn bộ giao diện chính */}
    <div className={`p-stack-lg max-w-[1000px] mx-auto ${printInvoice ? 'print:hidden' : ''}`}>
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface">Lịch sử giao dịch</h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          Xem danh sách hóa đơn và lịch sử thanh toán của bệnh nhân <strong>{patientName}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Khối Cảnh báo (Hóa đơn nợ) - Chiếm 1 cột trên Desktop */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-600">pending_actions</span>
            Cần thanh toán
          </h3>

          {pendingInvoices.length === 0 ? (
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-secondary opacity-50 mb-2">check_circle</span>
              <p className="font-bold text-sm">Tuyệt vời!</p>
              <p className="text-xs mt-1">Bạn không có khoản nợ nào.</p>
            </div>
          ) : (
            pendingInvoices.map((inv) => (
              <div key={inv.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-200/50 px-2 py-1 rounded">Chưa thanh toán</span>
                    <p className="text-xs text-amber-900 mt-2 font-mono">#{inv.id}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-amber-900">
                  {inv.services.map((s, i) => (
                     <div key={i} className="flex justify-between">
                       <span className="line-clamp-1 flex-1 pr-2">• {s.serviceName}</span>
                     </div>
                  ))}
                </div>

                <div className="border-t border-amber-200/50 pt-3 flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-bold uppercase text-amber-800/70">Tổng thanh toán</p>
                     <p className="text-2xl font-black text-amber-700">₫{inv.netPrice.toLocaleString()}</p>
                   </div>
                </div>

                <button
                  onClick={() => alert('Vui lòng đến quầy thu ngân để quẹt thẻ hoặc quét mã QR.')}
                  className="w-full mt-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-amber-700 transition-colors"
                >
                  Hướng dẫn thanh toán
                </button>
              </div>
            ))
          )}
        </div>

        {/* Khối Lịch sử (Đã thanh toán) - Chiếm 2 cột trên Desktop */}
        <div className="lg:col-span-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">task_alt</span>
            Lịch sử giao dịch
          </h3>

          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            {paidInvoices.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-[64px] text-outline">receipt_long</span>
                <p className="text-on-surface-variant mt-4 font-bold">Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant">
                {paidInvoices.map((inv) => (
                  <div key={inv.id} className="p-6 hover:bg-surface-container-low transition-colors">
                    
                    {/* Invoice Header */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-container text-primary rounded-2xl flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[24px]">payments</span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-lg">₫{inv.netPrice.toLocaleString()}</p>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">{new Date(inv.paidAt || inv.createdAt).toLocaleString('vi-VN')} • {inv.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                           <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã thanh toán
                         </span>
                         <button 
                           onClick={() => setPrintInvoice(inv)}
                           className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                         >
                           <span className="material-symbols-outlined text-[16px]">receipt</span>
                           Xem biên lai
                         </button>
                      </div>
                    </div>

                    {/* Invoice Items Summary */}
                    <div className="pl-16">
                      <div className="bg-surface-container rounded-xl p-4 text-sm text-on-surface-variant space-y-2">
                        {inv.services.map((s, i) => (
                           <div key={i} className="flex justify-between items-center">
                             <span className="flex-1 truncate pr-4">{i + 1}. {s.serviceName} (x{s.quantity})</span>
                             <span className="font-medium">₫{s.total.toLocaleString()}</span>
                           </div>
                        ))}
                        {inv.insuranceDiscount > 0 && (
                          <div className="flex justify-between items-center text-secondary pt-2 border-t border-outline-variant">
                            <span>Giảm giá bảo hiểm</span>
                            <span className="font-bold">-₫{inv.insuranceDiscount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>

    {/* PRINT PREVIEW MODAL (Giả lập Bill in nhiệt cỡ 80mm hoặc A5) */}
    {printInvoice && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-fade-in print:p-0 print:bg-white print:block print:absolute print:inset-0">
        
        {/* Floating Action Bar (Hidden in Print) */}
        <div className="absolute top-4 right-4 z-[60] flex gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">print</span>
            Xuất Ra Máy In
          </button>
          <button 
            onClick={() => setPrintInvoice(null)}
            className="flex items-center justify-center w-12 h-12 bg-white text-on-surface rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Receipt Container - Thiết kế mô phỏng Bill in nhiệt (Receipt/Invoice) */}
        {/* Style: Trắng đen, viền răng cưa mờ, font chữ đơn giản */}
        <div className="bg-white w-full max-w-[400px] max-h-[90vh] sm:rounded-md shadow-2xl overflow-y-auto print:shadow-none print:w-[80mm] print:max-w-[80mm] print:h-auto print:overflow-visible relative text-black">
          
          {/* CSS Trick: Zigzag border at top and bottom for web view */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_4px,#fff_4px)] bg-[length:10px_10px] -mt-1.5 rotate-180 drop-shadow-sm print:hidden"></div>
          
          <div className="p-6 font-mono text-sm leading-tight">
             
             {/* Header */}
             <div className="text-center mb-6">
                <h1 className="text-xl font-black uppercase tracking-wider mb-1">GoodSmile Clinic</h1>
                <p className="text-xs">123 Hàm Nghi, Quận 1, TP.HCM</p>
                <p className="text-xs">ĐT: 1900 8888 - MST: 0312345678</p>
                <div className="my-4 border-b-2 border-dashed border-gray-400"></div>
                <h2 className="text-lg font-bold uppercase mt-2 mb-1">Biên Lai Thu Tiền</h2>
                <p className="text-[10px]">Số: {printInvoice.id}</p>
                <p className="text-[10px]">Ngày in: {new Date().toLocaleString('vi-VN')}</p>
             </div>

             {/* Patient Info */}
             <div className="mb-4">
               <div className="flex justify-between mb-1">
                 <span>Khách hàng:</span>
                 <span className="font-bold">{printInvoice.patientName}</span>
               </div>
               <div className="flex justify-between mb-1">
                 <span>Mã BN:</span>
                 <span>{printInvoice.patientId}</span>
               </div>
               <div className="flex justify-between mb-1">
                 <span>Thu ngân:</span>
                 <span>{printInvoice.cashierName}</span>
               </div>
             </div>

             <div className="border-b-2 border-dashed border-gray-400 mb-4"></div>

             {/* Services Table */}
             <div className="mb-4">
               <div className="flex font-bold border-b border-gray-300 pb-1 mb-2">
                 <span className="flex-1">Tên Dịch Vụ</span>
                 <span className="w-10 text-center">SL</span>
                 <span className="w-24 text-right">Thành Tiền</span>
               </div>
               
               {printInvoice.services.map((s: any, i: number) => (
                 <div key={i} className="flex mb-2 items-start text-xs">
                   <div className="flex-1 pr-2">
                      <p>{s.serviceName}</p>
                      <p className="text-[10px] text-gray-500">Đơn giá: {s.unitPrice.toLocaleString()}</p>
                   </div>
                   <span className="w-10 text-center">{s.quantity}</span>
                   <span className="w-24 text-right">{s.total.toLocaleString()}</span>
                 </div>
               ))}
             </div>

             <div className="border-b-2 border-dashed border-gray-400 mb-4"></div>

             {/* Total calculations */}
             <div className="space-y-1 mb-6">
                <div className="flex justify-between">
                  <span>Tổng tiền dịch vụ:</span>
                  <span>{printInvoice.totalPrice.toLocaleString()}</span>
                </div>
                {printInvoice.insuranceDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá / BH:</span>
                    <span>-{printInvoice.insuranceDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg mt-2 border-t border-gray-300 pt-2">
                  <span>TỔNG THANH TOÁN:</span>
                  <span>{printInvoice.netPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span>Hình thức TT:</span>
                  <span>{printInvoice.paymentMethod}</span>
                </div>
                {printInvoice.paidAt && (
                   <div className="flex justify-between text-xs">
                     <span>Thời gian TT:</span>
                     <span>{new Date(printInvoice.paidAt).toLocaleString('vi-VN')}</span>
                   </div>
                )}
             </div>

             {/* Footer */}
             <div className="text-center mt-8 border-t-2 border-dashed border-gray-400 pt-4">
                <p className="font-bold mb-1">CẢM ƠN QUÝ KHÁCH!</p>
                <p className="text-[10px] italic">Vui lòng kiểm tra kỹ biên lai trước khi rời quầy.<br/>Biên lai có giá trị xuất hóa đơn đỏ trong ngày.</p>
             </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle,transparent_4px,#fff_4px)] bg-[length:10px_10px] -mb-1.5 drop-shadow-sm print:hidden"></div>
        </div>
      </div>
    )}
    </>
  );
};
