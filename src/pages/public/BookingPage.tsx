import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';

export const BookingPage: React.FC = () => {
  const { services, dentists, addAppointment } = useClinic();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    // Return YYYY-MM-DD
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !selectedServiceId || !selectedDentistId) {
      alert('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)!');
      return;
    }

    const service = services.find(s => s.id === selectedServiceId);
    const dentist = dentists.find(d => d.id === selectedDentistId);

    if (!service || !dentist) return;

    const newAppt = addAppointment({
      patientId: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientPhone,
      serviceName: service.name,
      dentistId: dentist.id,
      dentistName: dentist.name,
      time: `${date} @ ${timeSlot}`
    });

    setCreatedAppointment(newAppt);
    setIsSuccess(true);
  };

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:15 AM', '11:00 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-body-md pb-20">
      {/* ── Premium Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00478d] via-[#005fa8] to-[#006d33] py-16 px-6 md:px-16 text-center text-white">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <span className="text-white/80 font-bold tracking-widest uppercase text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Dịch vụ Y tế Đẳng cấp
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Đặt Lịch Hẹn Khám Bệnh
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">
            Đặt lịch hẹn trực tuyến nhanh chóng chỉ trong 1 phút. Nhận ngay cuộc hẹn ưu tiên cùng Hội đồng y khoa đầu ngành GoodSmile.
          </p>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        {isSuccess && createdAppointment ? (
          /* SUCCESS SCREEN */
          <div className="bg-white border-2 border-emerald-500 max-w-2xl mx-auto p-8 md:p-12 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0f172a] mb-2">Đặt Hẹn Thành Công!</h2>
            <p className="text-emerald-700 font-bold text-sm mb-6">
              Mã lịch hẹn của bạn là: {createdAppointment.id}
            </p>

            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-6 text-left space-y-3 max-w-md mx-auto mb-8 text-sm">
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                <span className="text-[#64748b] font-medium">Bệnh nhân:</span>
                <span className="text-[#0f172a] font-bold">{createdAppointment.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                <span className="text-[#64748b] font-medium">Số điện thoại:</span>
                <span className="text-[#0f172a] font-bold">{createdAppointment.patientPhone}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                <span className="text-[#64748b] font-medium">Dịch vụ điều trị:</span>
                <span className="text-[#0f172a] font-bold">{createdAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                <span className="text-[#64748b] font-medium">Bác sĩ phụ trách:</span>
                <span className="text-[#0f172a] font-bold">{createdAppointment.dentistName}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#64748b] font-medium">Thời gian hẹn:</span>
                <span className="text-[#005eb8] font-bold">{createdAppointment.time}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              * Vui lòng tới trước lịch hẹn khoảng 10-15 phút để quầy tiếp đón làm thủ tục và kiểm tra sức khỏe cơ bản. Xin cảm ơn quý khách!
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setPatientName('');
                  setPatientPhone('');
                  setSelectedServiceId('');
                  setSelectedDentistId('');
                  setNotes('');
                }}
                className="bg-white text-[#005eb8] border border-[#005eb8] px-6 py-2.5 font-bold hover:bg-[#eff6ff] transition-colors cursor-pointer"
              >
                Đặt thêm lịch mới
              </button>
              <Link
                to="/"
                className="bg-[#005eb8] text-white px-6 py-2.5 font-bold hover:bg-[#004a94] transition-colors cursor-pointer"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          /* FORM SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Guidelines */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-[#e2e8f0] p-6 shadow-sm">
                <h3 className="text-[#0f172a] font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="material-symbols-outlined text-[#005eb8]">info</span>
                  Hướng Dẫn Đặt Lịch
                </h3>
                <ul className="space-y-4 text-sm text-[#475569]">
                  <li className="flex gap-3">
                    <span className="bg-[#eff6ff] text-[#1d4ed8] w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                    <p className="leading-relaxed">
                      <strong>Chọn dịch vụ chuyên khoa:</strong> Giúp phòng khám sắp xếp đúng trang thiết bị chuyên dụng phục vụ việc thăm khám của bạn.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#eff6ff] text-[#1d4ed8] w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                    <p className="leading-relaxed">
                      <strong>Chọn bác sĩ phụ trách:</strong> Bạn có thể tự do lựa chọn chuyên gia mong muốn điều trị cho mình hoặc chọn bất kỳ bác sĩ phù hợp.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-[#eff6ff] text-[#1d4ed8] w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">3</span>
                    <p className="leading-relaxed">
                      <strong>Xác nhận thông tin:</strong> Hệ thống sẽ lưu giữ thông tin đặt lịch để quầy Lễ tân chủ động chuẩn bị hồ sơ bệnh án đón tiếp khi bạn tới.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#eff6ff] to-[#f0fdf4] border border-[#bfdbfe] p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1d4ed8] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">support_agent</span>
                  Hỗ Trợ Khẩn Cấp
                </h4>
                <p className="text-sm text-[#1e3a8a] leading-relaxed">
                  Nếu bạn gặp triệu chứng đau buốt tủy cấp tính hoặc chấn thương răng hàm khẩn cấp, vui lòng gọi điện thoại hotline <strong>0982.135.606</strong> để nhận lịch cấp cứu nha khoa lập tức.
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[#0f172a] mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005eb8]">edit_calendar</span>
                  Điền Thông Tin Đăng Ký
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Họ và tên bệnh nhân *
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* Patient Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Ví dụ: 0912 345 678"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Select Service */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Dịch vụ điều trị *
                      </label>
                      <select
                        required
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      >
                        <option value="">-- Chọn dịch vụ --</option>
                        {services.filter(s => s.isActive).map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} (₫{s.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Dentist */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Bác sĩ thăm khám *
                      </label>
                      <select
                        required
                        value={selectedDentistId}
                        onChange={(e) => setSelectedDentistId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      >
                        <option value="">-- Chọn bác sĩ phụ trách --</option>
                        {dentists.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Ngày hẹn khám *
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* Time slot */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                        Khung giờ hẹn *
                      </label>
                      <select
                        required
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all"
                      >
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes / Symptom */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#475569] mb-2">
                      Ghi chú triệu chứng hoặc nhu cầu đặc biệt (Không bắt buộc)
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mô tả qua tình trạng răng miệng hiện tại (VD: ê buốt khi uống nước lạnh, niềng răng tháo lắp...)"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#005eb8] focus:bg-white rounded px-4 py-2.5 text-sm outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 border-t border-slate-100 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="bg-[#005eb8] hover:bg-[#004a94] text-white font-bold px-8 py-2.5 shadow hover:shadow-md transition-all cursor-pointer"
                    >
                      Đăng Ký Đặt Hẹn
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
