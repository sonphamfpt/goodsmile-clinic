import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPatientName?: string;
  defaultPatientPhone?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultPatientName = '',
  defaultPatientPhone = ''
}) => {
  const { services, dentists, addAppointment } = useClinic();
  
  const [patientName, setPatientName] = useState(defaultPatientName);
  const [patientPhone, setPatientPhone] = useState(defaultPatientPhone);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [date, setDate] = useState('2026-06-06');
  const [timeSlot, setTimeSlot] = useState('09:00 AM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !selectedServiceId || !selectedDentistId) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const service = services.find(s => s.id === selectedServiceId);
    const dentist = dentists.find(d => d.id === selectedDentistId);

    if (!service || !dentist) return;

    addAppointment({
      patientId: `P-${Math.floor(1000 + Math.random() * 9000)}`, // mock new id or link
      patientName,
      patientPhone,
      serviceName: service.name,
      dentistId: dentist.id,
      dentistName: dentist.name,
      time: `${date} @ ${timeSlot}`
    });

    alert('Đăng ký lịch hẹn thành công!');
    onClose();
  };

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:15 AM', '11:00 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-outline-variant max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
          <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
            <span className="material-symbols-outlined">calendar_today</span>
            Đặt Lịch Hẹn Khám
          </h3>
          <button
            onClick={onClose}
            className="text-on-primary/80 hover:text-on-primary cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
              Họ và tên bệnh nhân *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
              Số điện thoại liên hệ *
            </label>
            <input
              type="tel"
              required
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="Ví dụ: 0912345678"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
              Dịch vụ nha khoa điều trị *
            </label>
            <select
              required
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="">-- Chọn dịch vụ --</option>
              {services.filter(s => s.isActive).map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (₫{s.price.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
              Bác sĩ điều trị *
            </label>
            <select
              required
              value={selectedDentistId}
              onChange={(e) => setSelectedDentistId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="">-- Chọn bác sĩ --</option>
              {dentists.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.room})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                Ngày khám *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-label-md font-bold uppercase text-on-surface-variant mb-1">
                Khung giờ *
              </label>
              <select
                required
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-outline-variant flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline text-on-surface font-bold rounded-lg hover:bg-surface-container-low transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all"
            >
              Đăng Ký Hẹn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
