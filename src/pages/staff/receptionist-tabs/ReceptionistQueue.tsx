import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';

const STATUS_CONFIG = {
  Waiting: { label: 'Đang chờ', bg: 'bg-amber-50', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', priority: 2 },
  'In Chair': { label: 'Đang khám', bg: 'bg-primary-container/20', border: 'border-primary/40', badge: 'bg-primary-container text-on-primary-container', dot: 'bg-primary', priority: 1 },
  Completed: { label: 'Hoàn tất', bg: 'bg-surface-container-low', border: 'border-outline-variant', badge: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline', priority: 3 },
};

export const ReceptionistQueue: React.FC = () => {
  const { queue, patients, dentists, checkInPatient, addPatient } = useClinic();

  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinMode, setCheckinMode] = useState<'existing' | 'new' | 'qr'>('existing');
  const [isScanning, setIsScanning] = useState(false);
  const [existingPatientId, setExistingPatientId] = useState('');
  const [selectedDentistId, setSelectedDentistId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState('30');
  const [newGender, setNewGender] = useState('Nam');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Waiting' | 'In Chair' | 'Completed'>('all');
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  const filteredQueue = queue
    .filter(q => filterStatus === 'all' || q.status === filterStatus)
    .sort((a, b) => {
      const pa = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG]?.priority ?? 9;
      const pb = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG]?.priority ?? 9;
      return pa - pb;
    });

  const waitingCount = queue.filter(q => q.status === 'Waiting').length;
  const inChairCount = queue.filter(q => q.status === 'In Chair').length;
  const completedCount = queue.filter(q => q.status === 'Completed').length;
  const avgWait = queue.filter(q => q.status === 'Waiting').reduce((s, q) => s + q.waitTimeMin, 0) / (waitingCount || 1);

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    let patientId = existingPatientId;
    if (checkinMode === 'new') {
      if (!newName || !newPhone) { alert('Vui lòng điền đầy đủ thông tin!'); return; }
      const added = addPatient({ name: newName, phone: newPhone, age: parseInt(newAge), gender: newGender, criticalAllergy: 'Không', condition: 'Mới khám đầu' });
      patientId = added.id;
    }
    if (!patientId || !selectedDentistId) { alert('Vui lòng chọn bệnh nhân và bác sĩ!'); return; }
    checkInPatient(patientId, selectedDentistId);
    setCheckinSuccess(true);
    setTimeout(() => {
      setCheckinSuccess(false);
      setShowCheckinModal(false);
      setCheckinMode('existing');
      setExistingPatientId('');
      setSelectedDentistId('');
      setNewName('');
      setNewPhone('');
    }, 2000);
  };

  const handleScanFake = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Giả lập quét thành công một lịch hẹn / bệnh nhân
      const patient = patients[0];
      const dentist = dentists[0];
      if (patient && dentist) {
        setExistingPatientId(patient.id);
        setSelectedDentistId(dentist.id);
        setCheckinMode('existing');
        alert(`Đã quét QR thành công!\nBệnh nhân: ${patient.name}\nBác sĩ: ${dentist.name}`);
      }
    }, 2000);
  };

  const [now] = useState(new Date());
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-stack-lg">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Hàng chờ trực tiếp</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Quản lý hàng chờ phòng khám theo thời gian thực •
            <span className="inline-flex items-center gap-1 ml-2 text-secondary font-bold">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse inline-block"></span>
              {timeStr}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowCheckinModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined">how_to_reg</span>
          Check-in bệnh nhân
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Đang chờ', value: waitingCount, icon: 'hourglass_top', color: 'text-amber-700 bg-amber-50 border-amber-200', pulse: true },
          { label: 'Đang khám', value: inChairCount, icon: 'medical_services', color: 'text-primary bg-primary-container border-primary/20', pulse: true },
          { label: 'Hoàn tất hôm nay', value: completedCount, icon: 'task_alt', color: 'text-secondary bg-secondary-container border-secondary/20' },
          { label: 'Chờ TB', value: `${avgWait.toFixed(0)} phút`, icon: 'avg_pace', color: 'text-on-surface bg-surface-container border-outline-variant' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color}`}>
            <div className="relative">
              <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
              {(s as any).pulse && (s.value as number) > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all' as const, label: `Tất cả (${queue.length})` },
          { key: 'Waiting' as const, label: `Đang chờ (${waitingCount})` },
          { key: 'In Chair' as const, label: `Đang khám (${inChairCount})` },
          { key: 'Completed' as const, label: `Hoàn tất (${completedCount})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${filterStatus === f.key ? 'bg-primary text-on-primary border-primary' : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/40'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Queue table */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase">
                {['#', 'Bệnh nhân', 'Bác sĩ phụ trách', 'Phòng', 'Check-in', 'Thời gian', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredQueue.map((item, idx) => {
                const conf = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Waiting;
                const patient = patients.find(p => p.id === item.patientId);
                return (
                  <tr key={item.id} className={`hover:bg-surface-container-low transition-colors ${item.status === 'Completed' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${conf.badge}`}>{idx + 1}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold shrink-0">
                          {item.patientName.split(' ').pop()?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface text-sm">{item.patientName}</p>
                          <p className="text-xs text-on-surface-variant">{patient?.phone || item.patientId}</p>
                          {patient && patient.criticalAllergy !== 'Không' && (
                            <span className="text-[10px] bg-error-container text-error px-1.5 py-0.5 rounded-full font-bold">⚠ {patient.criticalAllergy}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-on-surface">{item.dentistName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface-variant">{item.room}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">{item.checkInTime}</td>
                    <td className="px-4 py-3">
                      {item.status === 'Waiting' && (
                        <span className="text-xs text-amber-700 font-bold">⏳ {item.waitTimeMin} phút</span>
                      )}
                      {item.status === 'In Chair' && (
                        <span className="text-xs text-primary font-bold animate-pulse">⏱ {item.elapsedTimeMin ?? 0} phút</span>
                      )}
                      {item.status === 'Completed' && (
                        <span className="text-xs text-on-surface-variant">✓ Xong</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${conf.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot} ${item.status !== 'Completed' ? 'animate-pulse' : ''}`}></span>
                        {conf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => alert(`Chi tiết bệnh nhân: ${item.patientName}\nPhòng: ${item.room}\nBác sĩ: ${item.dentistName}`)}
                          className="px-2.5 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container-high transition-all cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        {item.status === 'Waiting' && (
                          <button
                            onClick={() => alert(`Đã thông báo gọi bệnh nhân: ${item.patientName}`)}
                            className="px-2.5 py-1.5 bg-primary-container text-on-primary-container rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                            title="Gọi bệnh nhân"
                          >
                            <span className="material-symbols-outlined text-[16px]">campaign</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredQueue.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-[72px] text-outline/40">queue_play_next</span>
              <p className="text-on-surface-variant mt-4">Không có bệnh nhân nào trong hàng chờ</p>
            </div>
          )}
        </div>
      </div>

      {/* Dentist room load overview */}
      <div className="mt-6 bg-white rounded-2xl border border-outline-variant shadow-sm p-5">
        <h4 className="font-headline-sm text-headline-sm mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">meeting_room</span>
          Tải lượng phòng khám theo bác sĩ
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dentists.map(d => {
            const dQueue = queue.filter(q => q.dentistId === d.id && q.status !== 'Completed');
            const inChair = dQueue.some(q => q.status === 'In Chair');
            return (
              <div key={d.id} className={`rounded-xl border p-4 ${inChair ? 'border-primary/30 bg-primary-container/10' : 'border-outline-variant bg-surface-container-low'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${inChair ? 'bg-primary animate-pulse' : dQueue.length > 0 ? 'bg-amber-500' : 'bg-outline'}`}></div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{d.room}</p>
                </div>
                <p className="text-sm font-bold text-on-surface truncate">{d.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">{d.role.split('&')[0]}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-bold ${inChair ? 'text-primary' : dQueue.length > 0 ? 'text-amber-700' : 'text-secondary'}`}>
                    {inChair ? '🟢 Đang khám' : dQueue.length > 0 ? `⏳ ${dQueue.length} chờ` : '⚪ Rảnh'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {checkinSuccess ? (
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
                    Đón tiếp & Check-in
                  </h3>
                  <button onClick={() => setShowCheckinModal(false)} className="hover:bg-white/20 p-1 rounded-full cursor-pointer">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <form onSubmit={handleCheckin} className="p-6 space-y-4">
                  {/* Toggle Mode */}
                  <div className="flex border border-outline-variant rounded-xl overflow-hidden">
                    {[
                      { key: 'qr', label: 'Quét QR' },
                      { key: 'existing', label: 'Bệnh nhân cũ' },
                      { key: 'new', label: 'Đăng ký mới' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setCheckinMode(opt.key as any)}
                        className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer ${checkinMode === opt.key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {checkinMode === 'qr' && (
                    <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl">
                      <div className="relative">
                        <span className="material-symbols-outlined text-[64px] text-primary">qr_code_scanner</span>
                        {isScanning && (
                          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-secondary animate-bounce pointer-events-none"></div>
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

                  {checkinMode === 'existing' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Chọn bệnh nhân *</label>
                      <select
                        value={existingPatientId}
                        onChange={e => setExistingPatientId(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      >
                        <option value="">-- Chọn bệnh nhân --</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} • {p.phone} • {p.tier}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {checkinMode === 'new' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Họ và tên *</label>
                        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nguyễn Văn A" className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Số điện thoại *</label>
                          <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="09XXXXXXXX" className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Tuổi</label>
                          <input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-sm outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {['Nam', 'Nữ', 'Khác'].map(g => (
                          <button key={g} type="button" onClick={() => setNewGender(g)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${newGender === g ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant'}`}>{g}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkinMode !== 'qr' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Bác sĩ khám chỉ định *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {dentists.map(d => {
                            const dBusy = queue.some(q => q.dentistId === d.id && q.status === 'In Chair');
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setSelectedDentistId(d.id)}
                                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${selectedDentistId === d.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/40'}`}
                              >
                                <p className="text-xs font-bold text-on-surface">{d.name}</p>
                                <p className="text-[10px] text-on-surface-variant">{d.room}</p>
                                <span className={`text-[10px] font-bold ${dBusy ? 'text-amber-600' : 'text-secondary'}`}>{dBusy ? '● Đang khám' : '● Rảnh'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowCheckinModal(false)} className="flex-1 py-3 border border-outline text-on-surface rounded-xl font-bold cursor-pointer hover:bg-surface-container">Hủy</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">how_to_reg</span>
                          Xác nhận Check-in
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
