import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';

// Tab page imports
import { PatientBooking } from './tabs/PatientBooking';
import { PatientAppointments } from './tabs/PatientAppointments';
import { PatientQueue } from './tabs/PatientQueue';
import { PatientRecords } from './tabs/PatientRecords';
import { PatientBilling } from './tabs/PatientBilling';

// ─── Home Tab (Dashboard Overview) ────────────────────────────────────────────
const PatientHome: React.FC = () => {
  const { patients, medicalRecords, invoices } = useClinic();

  const patientId = 'P-8821';
  const patient = patients.find(p => p.id === patientId) || {
    id: patientId,
    name: 'Trần Nguyễn Minh',
    phone: '0901 234 567',
    age: 28,
    gender: 'Nam',
    criticalAllergy: 'Không',
    condition: 'Nhạy cảm ngà'
  };

  const records = medicalRecords.filter(r => r.patientId === patientId);
  const patientInvoices = invoices.filter(i => i.patientId === patientId || i.patientName === patient.name);
  const pendingInvoices = patientInvoices.filter(i => i.status === 'Pending');

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Extract prescription from latest record
  const latestRecordWithPrescription = records.find(r => r.prescription || r.notes?.includes('| Đơn thuốc:'));
  
  const activeMedicines = React.useMemo(() => {
    if (!latestRecordWithPrescription) return [];
    
    if (latestRecordWithPrescription.prescription?.medicines) {
      return latestRecordWithPrescription.prescription.medicines;
    }
    
    const notes = latestRecordWithPrescription.notes || '';
    const rxIndex = notes.indexOf('| Đơn thuốc:');
    if (rxIndex !== -1) {
      const rxPart = notes.substring(rxIndex + 12).trim();
      const drugs = rxPart.split(';');
      return drugs.map(drug => {
        const trimmedDrug = drug.trim();
        if (!trimmedDrug) return null;
        const match = trimmedDrug.match(/(.*?)\s*\(\s*(\d+)\s*([^)]*)\)\s*-\s*(.*)/);
        if (match) {
          return {
            name: match[1].trim(),
            dose: match[4].trim(),
            duration: `${match[2]} ${match[3].trim()}`,
            note: ''
          };
        }
        return {
          name: trimmedDrug,
          dose: 'Theo chỉ dẫn của bác sĩ',
          duration: 'Đang điều trị',
          note: ''
        };
      }).filter(Boolean) as Array<{ name: string; dose: string; duration: string; note: string }>;
    }
    return [];
  }, [latestRecordWithPrescription]);

  // AI Chatbot State
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Chào bạn! Tôi là trợ lý AI nha khoa. Tôi có thể giúp gì cho sức khỏe răng miệng của bạn hôm nay?' },
    { sender: 'user', text: 'Tôi cảm thấy hơi ê buốt khi uống nước lạnh.' },
    { sender: 'bot', text: 'Ê buốt khi dùng đồ lạnh có thể là dấu hiệu của nhạy cảm ngà răng hoặc sâu răng nhẹ. Bạn nên đặt lịch kiểm tra sớm nhé!' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputText('');

    setTimeout(() => {
      let reply = 'Cảm ơn thông tin của bạn. Để đảm bảo chẩn đoán chính xác, bạn nên đăng ký lịch hẹn khám để các bác sĩ kiểm tra trực tiếp nhé.';
      const query = userText.toLowerCase();

      if (query.includes('ê buốt') || query.includes('đau răng') || query.includes('buốt')) {
        reply = 'Tình trạng ê buốt răng khi uống đồ lạnh có thể do mòn men răng, tụt nướu hoặc sâu răng. Bạn nên dùng kem đánh răng chống ê buốt chuyên dụng và tránh đồ quá lạnh/quá nóng.';
      } else if (query.includes('niềng') || query.includes('chỉnh nha') || query.includes('mắc cài')) {
        reply = 'Chào bạn, GoodSmile hỗ trợ niềng răng mắc cài kim loại, sứ và niềng răng trong suốt Invisalign trả góp 0%. Hãy đặt lịch hẹn để bác sĩ Hương chụp phim và tư vấn phác đồ miễn phí nhé!';
      } else if (query.includes('implant') || query.includes('mất răng')) {
        reply = 'Cấy ghép Implant là phương pháp phục hình răng đã mất tối ưu nhất hiện nay. GoodSmile sử dụng trụ nhập khẩu Châu Âu chính hãng được bảo hành trọn đời.';
      } else if (query.includes('lấy cao') || query.includes('vệ sinh')) {
        reply = 'Lấy cao răng là quy trình nhanh chóng (chỉ khoảng 30 phút), giúp ngăn ngừa viêm nướu, hôi miệng và rụng răng sớm. Chi phí niêm yết tại GoodSmile là ₫300,000.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  // Removed handlePayInvoice and handleRecharge

  return (
    <div className="p-stack-lg grid grid-cols-12 gap-gutter">
      {/* Left Column: Primary Actions & Records */}
      <div className="col-span-12 lg:col-span-8 space-y-gutter">

        {/* Premium Banner CTA */}
        <section className="premium-glow rounded-xl p-8 text-on-primary shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-lg">
            <h3 className="font-headline-lg text-headline-lg text-white">Bạn đã sẵn sàng cho buổi kiểm tra định kỳ?</h3>
            <p className="text-body-lg font-body-lg opacity-90 text-white/90">
              Lần lấy cao răng gần nhất của bạn là 6 tháng trước. Hãy duy trì nụ cười rạng rỡ với buổi tư vấn chuyên nghiệp.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-lg cursor-pointer"
            >
              <span className="material-symbols-outlined">calendar_add_on</span>
              Đặt lịch hẹn mới
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-[180px] text-white">dentistry</span>
          </div>
        </section>

        {/* Treatment Progress Timeline */}
        <div className="bg-white rounded-xl border border-outline-variant p-6 role-accent-patient">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-sm text-headline-sm">Tiến độ điều trị chỉnh nha</h4>
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-md font-bold rounded-full">
              Đang thực hiện
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container transform -translate-y-1/2 -z-0"></div>
            <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-secondary transform -translate-y-1/2 -z-0"></div>

            {[
              { label: 'Tư vấn khám', done: true },
              { label: 'Lấy dấu hàm', done: true },
              { label: 'Đeo khay niềng', active: true },
              { label: 'Hoàn tất', done: false },
            ].map((milestone, i) => (
              <div key={i} className="z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  milestone.done ? 'bg-secondary text-on-secondary' :
                  milestone.active ? 'bg-secondary text-on-secondary animate-pulse' :
                  'bg-surface-container text-outline border border-outline-variant'
                }`}>
                  <span className="material-symbols-outlined">
                    {milestone.done || milestone.active ? (milestone.active ? 'medical_services' : 'check') : 'verified'}
                  </span>
                </div>
                <p className={`mt-2 text-label-md font-bold ${milestone.done || milestone.active ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {milestone.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Bills */}
        {pendingInvoices.length > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-amber-800">
              <span className="material-symbols-outlined text-amber-600">payments</span>
              Hóa đơn cần thanh toán gấp
            </h4>
            <div className="space-y-3">
              {pendingInvoices.map((inv) => (
                <div key={inv.id} className="bg-white p-4 rounded-lg border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="font-bold text-on-surface">{inv.services.map(s => s.serviceName).join(', ')}</p>
                    <p className="text-xs text-on-surface-variant">Mã hóa đơn: {inv.id} • Ngày tạo: {new Date(inv.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-body-lg font-bold text-primary">₫{inv.netPrice.toLocaleString()}</span>
                    <button
                      onClick={() => alert('Vui lòng đến quầy thu ngân để thanh toán hóa đơn này.')}
                      className="px-4 py-2 border border-amber-600 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
                    >
                      Hướng dẫn thanh toán
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Medical Records */}
        <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h4 className="font-headline-sm text-headline-sm">Hồ sơ bệnh án gần đây</h4>
            <span className="text-xs text-outline font-bold uppercase">{records.length} Tệp tin</span>
          </div>
          <div className="divide-y divide-outline-variant">
            {records.map((rec) => (
              <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[32px]">
                      {rec.type === 'pdf' && 'picture_as_pdf'}
                      {rec.type === 'image' && 'image'}
                      {rec.type === 'prescription' && 'description'}
                    </span>
                  </div>
                  <div>
                    <p className="font-body-lg font-bold text-on-surface">{rec.title}</p>
                    <p className="text-xs text-on-surface-variant">{rec.date} • {rec.size}</p>
                    {rec.notes && <p className="text-xs italic text-primary mt-1">"{rec.notes}"</p>}
                  </div>
                </div>
                <button
                  onClick={() => alert(`Xem chi tiết bệnh án: ${rec.title}\n${rec.notes || 'Không có ghi chú.'}`)}
                  className="p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors material-symbols-outlined cursor-pointer"
                  title="Xem"
                >
                  visibility
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Status, Wallet, AI & Notifications */}
      <div className="col-span-12 lg:col-span-4 space-y-gutter">

        {/* Removed Membership Wallet Card */}

        {/* AI Health Assistant Widget */}
        <div className="bg-white rounded-xl border border-outline-variant flex flex-col h-[380px] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3 bg-surface-container-low">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
            </div>
            <div>
              <p className="text-label-md font-bold text-on-surface">AI tư vấn sức khỏe</p>
              <p className="text-[10px] text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full inline-block animate-pulse"></span>
                Trực tuyến
              </p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[85%] text-body-md ${
                  msg.sender === 'bot'
                    ? 'bg-white text-on-surface border border-outline-variant/50 rounded-tl-none shadow-sm'
                    : 'bg-primary-container text-on-primary-container rounded-tr-none ml-auto shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-outline-variant flex gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi về ê buốt răng, chỉnh nha, bọc sứ..."
              className="flex-1 bg-surface-container border-none rounded-lg text-body-md focus:ring-1 focus:ring-primary px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>

        {/* Reminders & Notifications */}
        <section className="bg-white rounded-xl border border-outline-variant p-4 space-y-3">
          <h4 className="font-bold text-on-surface text-label-md uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
            Lịch nhắc & Thông báo
          </h4>
          <div className="space-y-2">
            {activeMedicines.length > 0 ? (
              activeMedicines.map((med, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-error-container/15 rounded-xl border border-error/10">
                  <span className="material-symbols-outlined text-error mt-0.5">medication</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-on-error-container truncate">Thuốc: {med.name}</p>
                    <p className="text-[11px] text-on-error-container/85 font-bold mt-0.5">{med.dose}</p>
                    <p className="text-[9px] text-on-error-container/60 mt-0.5 font-medium">Liệu trình: {med.duration}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5">verified</span>
                <div>
                  <p className="text-xs font-bold text-emerald-800">Không có đơn thuốc hiện tại</p>
                  <p className="text-[11px] text-emerald-700/85 mt-0.5 font-medium">Bạn không có lịch uống thuốc trong thời gian này. Hãy luôn giữ gìn vệ sinh răng miệng nhé!</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary mt-0.5">event</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-on-surface">Lịch hẹn tái khám chỉnh nha</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">Khám ngày mai lúc 09:00 AM — Bác sĩ Nguyễn Hương</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Removed Recharge Wallet Modal */}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultPatientName={patient.name}
        defaultPatientPhone={patient.phone}
      />
    </div>
  );
};

// ─── Main Patient Dashboard (Tab Router) ───────────────────────────────────────
export const PatientDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  switch (tab) {
    case 'booking':      return <PatientBooking />;
    case 'appointments': return <PatientAppointments />;
    case 'queue':        return <PatientQueue />;
    case 'records':      return <PatientRecords />;
    case 'billing':      return <PatientBilling />;
    default:             return <PatientHome />;
  }
};
