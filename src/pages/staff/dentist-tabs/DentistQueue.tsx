import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';

const STATUS_STYLES = {
  Waiting: { bg: 'bg-amber-50', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', label: 'Đang chờ', icon: 'hourglass_top' },
  'In Chair': { bg: 'bg-primary-container/30', border: 'border-primary/30', badge: 'bg-primary-container text-on-primary-container', dot: 'bg-primary', label: 'Đang khám', icon: 'medical_services' },
  Completed: { bg: 'bg-surface-container-low', border: 'border-outline-variant', badge: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline', label: 'Hoàn tất', icon: 'check_circle' },
};

export const DentistQueue: React.FC = () => {
  const { queue, patients, services, startTreatment, completeTreatment } = useClinic();
  const dentistId = 'D-04';

  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [performedServices, setPerformedServices] = useState<string[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const dentistQueue = queue.filter(q => q.dentistId === dentistId);
  const activeQueue = dentistQueue.filter(q => q.status !== 'Completed');
  const completedToday = dentistQueue.filter(q => q.status === 'Completed');

  const selectedItem = dentistQueue.find(q => q.id === selectedQueueId);
  const selectedPatient = selectedItem ? patients.find(p => p.id === selectedItem.patientId) : null;

  const handleSelect = (id: string) => {
    setSelectedQueueId(id);
    setPerformedServices([]);
    setChiefComplaint('');
    setIcdCode('K02.1 - Sâu ngà răng');
  };

  const handleStartTreatment = (id: string) => {
    startTreatment(id);
    setSelectedQueueId(id);
  };

  const handleFinalize = () => {
    if (!selectedQueueId) return;
    completeTreatment(
      selectedQueueId,
      [],
      chiefComplaint || 'Khám lâm sàng định kỳ — ' + icdCode,
      performedServices.length > 0 ? performedServices : ['S-08']
    );
    setShowCompleteModal(false);
    setSelectedQueueId(null);
    setPerformedServices([]);
    setChiefComplaint('');
  };

  const toggleService = (id: string) => {
    setPerformedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalEstimate = performedServices.reduce((sum, id) => sum + (services.find(s => s.id === id)?.price || 0), 0);

  return (
    <div className="p-stack-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Hàng chờ bác sĩ</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Quản lý lượt khám và điều trị bệnh nhân trong ca làm việc</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Đang chờ', value: activeQueue.filter(q => q.status === 'Waiting').length, icon: 'hourglass_top', color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Đang khám', value: activeQueue.filter(q => q.status === 'In Chair').length, icon: 'medical_services', color: 'text-primary bg-primary-container border-primary/20' },
          { label: 'Hoàn tất hôm nay', value: completedToday.length, icon: 'task_alt', color: 'text-secondary bg-secondary-container border-secondary/20' },
          { label: 'Tổng ca trong ngày', value: dentistQueue.length, icon: 'calendar_today', color: 'text-on-surface bg-surface-container border-outline-variant' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.color}`}>
            <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Queue list */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Danh sách hàng chờ ({activeQueue.length})
          </h3>
          {activeQueue.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-outline-variant">
              <span className="material-symbols-outlined text-[56px] text-outline">queue_play_next</span>
              <p className="text-on-surface-variant mt-3">Chưa có bệnh nhân nào trong hàng chờ</p>
            </div>
          )}
          {activeQueue.map((item) => {
            const status = STATUS_STYLES[item.status as keyof typeof STATUS_STYLES] || STATUS_STYLES.Completed;
            const patient = patients.find(p => p.id === item.patientId);
            const isSelected = selectedQueueId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary-container/20 shadow-md' :
                  `${status.bg} ${status.border}`
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                      {item.patientName.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{item.patientName}</p>
                      <p className="text-xs text-on-surface-variant">{item.room} • Check-in {item.checkInTime}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${status.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${item.status === 'In Chair' ? 'animate-pulse' : ''}`}></span>
                    {status.label}
                  </span>
                </div>

                {patient && (
                  <div className="flex gap-2 text-[11px]">
                    {patient.criticalAllergy !== 'Không' && (
                      <span className="bg-error-container text-error px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">warning</span>
                        Dị ứng: {patient.criticalAllergy}
                      </span>
                    )}
                    {patient.condition && patient.condition !== 'Bình thường' && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{patient.condition}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant">
                    {item.status === 'In Chair' ? `⏱ Đang khám ${item.elapsedTimeMin ?? 0} phút` : `⏳ Chờ ${item.waitTimeMin} phút`}
                  </p>
                  {item.status === 'Waiting' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartTreatment(item.id); }}
                      className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      Bắt đầu khám
                    </button>
                  )}
                  {item.status === 'In Chair' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedQueueId(item.id); setShowCompleteModal(true); }}
                      className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">task_alt</span>
                      Kết thúc ca
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Completed today section */}
          {completedToday.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Đã hoàn tất hôm nay ({completedToday.length})</h4>
              {completedToday.map(item => (
                <div key={item.id} className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-center gap-3 mb-2 opacity-70">
                  <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.patientName}</p>
                    <p className="text-xs text-on-surface-variant">{item.room} • Check-in {item.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Patient detail panel */}
        <div className="col-span-12 lg:col-span-7">
          {selectedItem && selectedPatient ? (
            <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              {/* Patient header */}
              <div className="bg-primary p-6 text-on-primary relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center">
                  <span className="material-symbols-outlined text-[120px]">person_search</span>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {selectedPatient.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm">{selectedPatient.name}</h3>
                    <p className="text-sm opacity-80">#{selectedPatient.id} • {selectedPatient.age} tuổi • {selectedPatient.gender}</p>
                    <p className="text-xs opacity-70 mt-0.5">{selectedPatient.phone}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Medical alerts */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${selectedPatient.criticalAllergy !== 'Không' ? 'bg-error-container/30 border-error/30' : 'bg-surface-container border-outline-variant'}`}>
                    <p className="text-[10px] font-bold uppercase text-error mb-0.5">⚠ Dị ứng nghiêm trọng</p>
                    <p className="text-sm font-bold text-on-surface">{selectedPatient.criticalAllergy}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="text-[10px] font-bold uppercase text-amber-700 mb-0.5">Bệnh lý nền</p>
                    <p className="text-sm font-bold text-amber-900">{selectedPatient.condition}</p>
                  </div>
                </div>

                {/* Session info */}
                <div className="bg-surface-container-low rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Phòng khám', value: selectedItem.room },
                    { label: 'Check-in', value: selectedItem.checkInTime },
                    { label: 'Thời gian', value: selectedItem.status === 'In Chair' ? `${selectedItem.elapsedTimeMin ?? 0} phút` : `Chờ ${selectedItem.waitTimeMin}p` },
                  ].map(i => (
                    <div key={i.label}>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold">{i.label}</p>
                      <p className="font-bold text-on-surface text-sm mt-0.5">{i.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="flex gap-3 pt-2">
                  {selectedItem.status === 'Waiting' && (
                    <button
                      onClick={() => handleStartTreatment(selectedItem.id)}
                      className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                      Bắt đầu khám
                    </button>
                  )}
                  {selectedItem.status === 'In Chair' && (
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="flex-1 py-3 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined">task_alt</span>
                      Ký bệnh án & Kết thúc ca
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Ghi chú thêm cho bệnh nhân: ${selectedPatient.name}`)}
                    className="px-4 py-3 border border-outline text-on-surface rounded-xl font-bold hover:bg-surface-container transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined">edit_note</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant h-80 flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <span className="material-symbols-outlined text-[72px] text-outline/50">touch_app</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mt-4">Chọn bệnh nhân</h4>
              <p className="text-on-surface-variant text-sm mt-2 max-w-xs">
                Nhấn vào một bệnh nhân trong danh sách hàng chờ để xem thông tin và bắt đầu ca khám
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Complete Treatment Modal */}
      {showCompleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="bg-secondary p-5 text-on-secondary flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm">Ký kết bệnh án</h3>
                <p className="text-sm opacity-80">{selectedItem.patientName}</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Complaint */}
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Triệu chứng & chẩn đoán *</label>
                <textarea
                  rows={3}
                  value={chiefComplaint}
                  onChange={e => setChiefComplaint(e.target.value)}
                  placeholder="Mô tả triệu chứng, chẩn đoán lâm sàng..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Mã ICD-10</label>
                <input
                  value={icdCode}
                  onChange={e => setIcdCode(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>

              {/* Services */}
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">Dịch vụ đã thực hiện</label>
                <div className="border border-outline-variant rounded-xl p-3 space-y-2 max-h-44 overflow-y-auto bg-surface-container-low custom-scrollbar">
                  {services.map(s => (
                    <label key={s.id} className="flex items-center gap-3 cursor-pointer hover:bg-white rounded-lg p-1.5 transition-colors">
                      <input
                        type="checkbox"
                        checked={performedServices.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                        className="rounded text-secondary"
                      />
                      <span className="text-sm flex-1 text-on-surface">{s.name}</span>
                      <span className="text-xs font-bold text-secondary">₫{s.price.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
                {performedServices.length > 0 && (
                  <div className="mt-2 flex justify-between text-sm px-1">
                    <span className="text-on-surface-variant">{performedServices.length} dịch vụ được chọn</span>
                    <span className="font-bold text-primary">Tổng: ₫{totalEstimate.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCompleteModal(false)} className="flex-1 py-3 border border-outline text-on-surface rounded-xl font-bold cursor-pointer hover:bg-surface-container transition-all">
                  Hủy
                </button>
                <button
                  onClick={handleFinalize}
                  className="flex-1 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined">send</span>
                  Ký & Gửi hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
