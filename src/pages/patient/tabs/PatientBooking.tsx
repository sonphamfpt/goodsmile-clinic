import React, { useState } from 'react';
import { Icon } from '../../../components/Icon';
import { useClinic } from '../../../context/ClinicContext';

type Step = 1 | 2 | 3 | 4;

const AVAILABLE_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM',
];

const BOOKED_TIMES = ['09:00 AM', '10:30 AM', '02:00 PM'];

export const PatientBooking: React.FC = () => {
  const { services, dentists, addAppointment } = useClinic();

  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState('');
  const [bookedApptId, setBookedApptId] = useState('');
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const patientName = 'Trần Nguyễn Minh';
  const patientPhone = '0901 234 567';
  const patientId = 'P-8821';

  // Build next 14 days for date picker
  const today = new Date();
  const dateOptions: { label: string; value: string; dayName: string }[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    dateOptions.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      value: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
    });
  }

  const serviceSel = services.find(s => s.id === selectedService);
  const dentistSel = dentists.find(d => d.id === selectedDentist);

  const handleConfirm = () => {
    if (!serviceSel || !dentistSel || !selectedDate || !selectedTime) return;
    const newAppt = addAppointment({
      patientId,
      patientName,
      patientPhone,
      serviceName: serviceSel.name,
      dentistId: dentistSel.id,
      dentistName: dentistSel.name,
      time: selectedTime,
    });
    setBookedApptId(newAppt.id);
    setIsBooked(true);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDentist('');
    setSelectedDate('');
    setSelectedTime('');
    setNote('');
    setIsBooked(false);
    setBookedApptId('');
  };

  const steps = [
    { num: 1, label: 'Chọn dịch vụ' },
    { num: 2, label: 'Chọn bác sĩ' },
    { num: 3, label: 'Chọn lịch' },
    { num: 4, label: 'Xác nhận' },
  ];

  return (
    <div className="p-stack-lg max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface">Đặt lịch khám mới</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Hoàn thành 4 bước đơn giản để đặt lịch khám tại GoodSmile</p>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center mb-10 px-2">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step > s.num
                    ? 'bg-secondary text-on-secondary shadow-md'
                    : step === s.num
                    ? 'bg-primary text-on-primary shadow-lg ring-4 ring-primary/20'
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                }`}
              >
                {step > s.num ? (
                  <Icon name="check" className="text-[18px]" />
                ) : (
                  s.num
                )}
              </div>
              <span className={`text-[11px] font-bold whitespace-nowrap ${step === s.num ? 'text-primary' : 'text-on-surface-variant'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s.num ? 'bg-secondary' : 'bg-outline-variant'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Chọn dịch vụ */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Bạn muốn khám dịch vụ gì?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.filter(s => s.isActive).map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedService === svc.id
                    ? 'border-primary bg-primary-container shadow-md'
                    : 'border-outline-variant bg-white hover:border-primary/40 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedService === svc.id ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                      <Icon name="dentistry" className="text-[20px]" />
                    </div>
                    <p className={`font-bold text-body-md ${selectedService === svc.id ? 'text-on-primary-container' : 'text-on-surface'}`}>{svc.name}</p>
                    <p className={`text-xs mt-1 ${selectedService === svc.id ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
                      ⏱ {svc.durationMin} phút
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-label-md ${selectedService === svc.id ? 'text-primary' : 'text-secondary'}`}>
                      ₫{svc.price.toLocaleString()}
                    </p>
                    {selectedService === svc.id && (
                      <Icon name="check_circle" className="text-primary text-[20px]" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Tiếp theo
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Chọn bác sĩ */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Chọn bác sĩ điều trị</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dentists.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDentist(doc.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                  selectedDentist === doc.id
                    ? 'border-primary bg-primary-container shadow-md'
                    : 'border-outline-variant bg-white hover:border-primary/40 hover:bg-surface-container-low'
                }`}
              >
                <img src={doc.avatar} alt={doc.name} className={`w-16 h-16 rounded-full object-cover border-2 ${selectedDentist === doc.id ? 'border-primary' : 'border-outline-variant'}`} />
                <div className="flex-1">
                  <p className={`font-bold ${selectedDentist === doc.id ? 'text-on-primary-container' : 'text-on-surface'}`}>{doc.name}</p>
                  <p className={`text-xs mt-0.5 ${selectedDentist === doc.id ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>{doc.role}</p>
                  <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedDentist === doc.id ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    <Icon name="meeting_room" className="text-[12px]" />
                    {doc.room}
                  </div>
                </div>
                {selectedDentist === doc.id && (
                  <Icon name="check_circle" className="text-primary text-[24px]" />
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="px-6 py-3 border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer flex items-center gap-2">
              <Icon name="arrow_back" />
              Quay lại
            </button>
            <button
              disabled={!selectedDentist}
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Tiếp theo
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Chọn ngày & giờ */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Chọn ngày và giờ khám</h3>

          {/* Date picker */}
          <div>
            <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3">Chọn ngày</p>
            <div className="grid grid-cols-7 gap-2">
              {dateOptions.map((d) => (
                <button
                  key={d.value}
                  onClick={() => { setSelectedDate(d.value); setSelectedTime(''); }}
                  className={`flex flex-col items-center px-2 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedDate === d.value
                      ? 'border-primary bg-primary text-on-primary shadow-md'
                      : 'border-outline-variant bg-white hover:border-primary/40 text-on-surface'
                  }`}
                >
                  <span className="text-[11px] font-bold opacity-70">{d.dayName}</span>
                  <span className="text-body-lg font-bold">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time picker */}
          {selectedDate && (
            <div>
              <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3">Chọn giờ</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
                    <Icon name="light_mode" className="text-[16px]" /> Buổi sáng
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {AVAILABLE_TIMES.filter(t => t.includes('AM')).map((time) => {
                      const isBooked = BOOKED_TIMES.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-surface-container text-outline border-outline-variant line-through cursor-not-allowed opacity-50'
                              : selectedTime === time
                              ? 'border-primary bg-primary text-on-primary shadow-md'
                              : 'border-outline-variant bg-white hover:border-primary/50 text-on-surface'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1">
                    <Icon name="wb_twilight" className="text-[16px]" /> Buổi chiều
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {AVAILABLE_TIMES.filter(t => t.includes('PM')).map((time) => {
                      const isBooked = BOOKED_TIMES.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-surface-container text-outline border-outline-variant line-through cursor-not-allowed opacity-50'
                              : selectedTime === time
                              ? 'border-primary bg-primary text-on-primary shadow-md'
                              : 'border-outline-variant bg-white hover:border-primary/50 text-on-surface'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-3">
                <span className="inline-block w-3 h-3 bg-surface-container rounded border border-outline-variant mr-1 align-middle"></span>
                Đã đặt (không khả dụng)
              </p>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-2">Ghi chú triệu chứng (tuỳ chọn)</label>
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: Răng bên phải hàm dưới bị ê buốt khi uống nước lạnh từ 2 tuần nay..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-body-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="px-6 py-3 border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer flex items-center gap-2">
              <Icon name="arrow_back" />
              Quay lại
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(4)}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Xem xác nhận
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Xác nhận hoặc Thành công */}
      {step === 4 && !isBooked && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Xác nhận thông tin lịch hẹn</h3>

          <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
            {/* Summary header */}
            <div className="bg-primary p-6 text-on-primary">
              <div className="flex items-center gap-3">
                <Icon name="event_available" className="text-3xl" />
                <div>
                  <p className="font-bold text-headline-sm">Lịch hẹn sắp xếp</p>
                  <p className="text-sm opacity-80">Vui lòng kiểm tra kỹ trước khi xác nhận</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {[
                { icon: 'person', label: 'Bệnh nhân', value: patientName },
                { icon: 'dentistry', label: 'Dịch vụ', value: serviceSel?.name || '' },
                { icon: 'schedule', label: 'Thời lượng dự kiến', value: `${serviceSel?.durationMin} phút` },
                { icon: 'stethoscope', label: 'Bác sĩ phụ trách', value: dentistSel?.name || '' },
                { icon: 'meeting_room', label: 'Phòng khám', value: dentistSel?.room || '' },
                { icon: 'calendar_today', label: 'Ngày khám', value: selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '' },
                { icon: 'access_time', label: 'Giờ khám', value: selectedTime },
                { icon: 'payments', label: 'Chi phí ước tính', value: `₫${serviceSel?.price.toLocaleString()}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 py-3 border-b border-outline-variant/50 last:border-0">
                  <div className="w-9 h-9 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container shrink-0">
                    <Icon name={item.icon} className="text-[18px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-on-surface-variant">{item.label}</p>
                    <p className="font-bold text-on-surface">{item.value}</p>
                  </div>
                </div>
              ))}
              {note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                  <Icon name="sticky_note_2" className="text-amber-600 text-[20px] shrink-0" />
                  <p className="text-sm text-amber-800">{note}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-4 flex gap-3 border border-outline-variant">
            <Icon name="info" className="text-secondary shrink-0" />
            <p className="text-xs text-on-surface-variant">
              Bạn sẽ nhận SMS xác nhận lịch hẹn trong vòng 5 phút. Vui lòng đến trước 10 phút và mang theo CCCD/Thẻ thành viên nếu có.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className="px-6 py-3 border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer flex items-center gap-2">
              <Icon name="arrow_back" />
              Sửa thông tin
            </button>
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Icon name="check_circle" />
              Xác nhận đặt lịch
            </button>
          </div>
        </div>
      )}

      {/* Success screen */}
      {step === 4 && isBooked && (
        <div className="text-center py-8 space-y-4 animate-fade-in bg-white rounded-2xl border border-outline-variant shadow-sm max-w-xl mx-auto mt-4 p-6">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-md">
            <Icon name="check_circle" className="text-4xl text-on-secondary" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Đặt lịch thành công!</h3>
            <p className="text-sm text-on-surface-variant mt-1 max-w-sm mx-auto">
              Lịch hẹn của bạn với <strong>{dentistSel?.name}</strong> lúc <strong>{selectedTime}</strong> ({selectedDate}) đã được xác nhận.
            </p>
          </div>
          
          <div className="mt-4 p-4 border-2 border-dashed border-primary/40 rounded-xl inline-block bg-primary/5">
            <p className="text-xs font-bold text-primary mb-2 uppercase">Mã QR Check-in của bạn</p>
            <div className="bg-white p-2 rounded-lg shadow-sm w-fit mx-auto border border-outline-variant">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookedApptId}`} alt="QR Code" className="w-32 h-32" />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 font-medium">Lưu lại mã này hoặc đưa cho lễ tân khi đến khám</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 inline-block text-left w-full border border-outline-variant">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thông tin tóm tắt</p>
            <div className="space-y-1.5 text-sm text-on-surface">
              <p className="flex items-center gap-2"><Icon name="dentistry" className="text-[16px] text-primary" /> {serviceSel?.name}</p>
              <p className="flex items-center gap-2"><Icon name="stethoscope" className="text-[16px] text-primary" /> {dentistSel?.name} — {dentistSel?.room}</p>
              <p className="flex items-center gap-2"><Icon name="event" className="text-[16px] text-primary" /> {selectedDate} lúc {selectedTime}</p>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Icon name="add_circle" className="text-[18px]" />
              Đặt lịch hẹn khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
