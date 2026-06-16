import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';

type CheckInMode = 'existing' | 'new' | 'qr';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  title = 'Đón tiếp & Check-in',
}) => {
  const { queue, patients, dentists, checkInPatient, addPatient } = useClinic();

  const [mode, setMode] = useState<CheckInMode>('existing');
  const [isScanning, setIsScanning] = useState(false);
  const [existingPatientId, setExistingPatientId] = useState('');
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState('30');
  const [newGender, setNewGender] = useState('Nam');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setMode('existing');
    setIsScanning(false);
    setExistingPatientId('');
    setSelectedDentistId('');
    setNewName('');
    setNewPhone('');
    setNewAge('30');
    setNewGender('Nam');
    setIsSuccess(false);
    onClose();
  };

  const handleScanFake = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const patient = patients.find((p) => !queue.some((q) => q.patientId === p.id && q.status !== 'Completed')) || patients[0];
      const dentist = dentists[0];
      if (patient && dentist) {
        setExistingPatientId(patient.id);
        setSelectedDentistId(dentist.id);
        setMode('existing');
        alert(`Đã quét QR thành công!\nBệnh nhân: ${patient.name}\nBác sĩ: ${dentist.name}`);
      }
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let patientId = existingPatientId;

    if (mode === 'new') {
      if (!newName.trim() || !newPhone.trim()) {
        alert('Vui lòng điền đầy đủ thông tin bệnh nhân mới!');
        return;
      }

      const addedPatient = addPatient({
        name: newName.trim(),
        phone: newPhone.trim(),
        age: Number.parseInt(newAge, 10) || 0,
        gender: newGender,
        criticalAllergy: 'Không',
        condition: 'Mới khám đầu',
      });
      patientId = addedPatient.id;
    }

    if (!patientId || !selectedDentistId) {
      alert('Vui lòng chọn bệnh nhân và bác sĩ khám!');
      return;
    }

    const alreadyWaiting = queue.some((item) => item.patientId === patientId && item.status !== 'Completed');
    if (alreadyWaiting) {
      alert('Bệnh nhân này đã có trong hàng chờ. Vui lòng kiểm tra lại danh sách.');
      return;
    }

    checkInPatient(patientId, selectedDentistId);
    setIsSuccess(true);
    setTimeout(resetAndClose, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-on-secondary">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Check-in thành công!</h3>
            <p className="text-on-surface-variant">Bệnh nhân đã được đưa vào hàng chờ</p>
          </div>
        ) : (
          <>
            <div className="bg-primary px-6 py-4 text-on-primary flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined">how_to_reg</span>
                {title}
              </h3>
              <button onClick={resetAndClose} className="hover:bg-white/20 p-1 rounded-full cursor-pointer" type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex border border-outline-variant rounded-xl overflow-hidden">
                {[
                  { key: 'qr' as const, label: 'Quét QR' },
                  { key: 'existing' as const, label: 'Bệnh nhân cũ' },
                  { key: 'new' as const, label: 'Đăng ký mới' },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setMode(option.key)}
                    className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      mode === option.key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {mode === 'qr' && (
                <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl">
                  <div className="relative">
                    <span className="material-symbols-outlined text-[64px] text-primary">qr_code_scanner</span>
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-full border-t-2 border-secondary animate-bounce pointer-events-none" />
                    )}
                  </div>
                  <p className="font-bold text-primary mt-4 mb-2">{isScanning ? 'Đang quét...' : 'Sẵn sàng quét mã QR'}</p>
                  <p className="text-xs text-on-surface-variant text-center max-w-xs mb-4">
                    Hướng camera vào mã QR của lịch hẹn trên điện thoại của bệnh nhân.
                  </p>
                  <button
                    type="button"
                    onClick={handleScanFake}
                    disabled={isScanning}
                    className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold cursor-pointer hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">camera_alt</span>
                    Giả lập quét QR
                  </button>
                </div>
              )}

              {mode === 'existing' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Chọn bệnh nhân *</label>
                  <select
                    value={existingPatientId}
                    onChange={(e) => setExistingPatientId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} • {patient.phone} • {patient.tier}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mode === 'new' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Họ và tên *</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Số điện thoại *</label>
                      <input
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="09XXXXXXXX"
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Tuổi</label>
                      <input
                        type="number"
                        value={newAge}
                        onChange={(e) => setNewAge(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['Nam', 'Nữ', 'Khác'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setNewGender(gender)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          newGender === gender ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode !== 'qr' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Bác sĩ khám chỉ định *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {dentists.map((dentist) => {
                        const isBusy = queue.some((item) => item.dentistId === dentist.id && item.status === 'In Chair');
                        return (
                          <button
                            key={dentist.id}
                            type="button"
                            onClick={() => setSelectedDentistId(dentist.id)}
                            className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                              selectedDentistId === dentist.id
                                ? 'border-primary bg-primary-container/20'
                                : 'border-outline-variant hover:border-primary/40'
                            }`}
                          >
                            <p className="text-xs font-bold text-on-surface">{dentist.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{dentist.room}</p>
                            <span className={`text-[10px] font-bold ${isBusy ? 'text-amber-600' : 'text-secondary'}`}>
                              ● {isBusy ? 'Đang khám' : 'Rảnh'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={resetAndClose} className="flex-1 py-3 border border-outline text-on-surface rounded-xl font-bold cursor-pointer hover:bg-surface-container">
                      Hủy
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">how_to_reg</span>
                      Xác nhận
                    </button>
                  </div>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};
