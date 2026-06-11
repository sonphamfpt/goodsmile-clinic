import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';
import { DentalChart } from '../../components/DentalChart';
import { ToothState } from '../../types/clinic';

// Tab imports
import { DentistQueue } from './dentist-tabs/DentistQueue';
import { DentistRecords } from './dentist-tabs/DentistRecords';

// ─── Home (Bàn khám lâm sàng) ──────────────────────────────────────────────────
const DentistHome: React.FC = () => {
  const { queue, patients, medicalRecords, services, startTreatment, completeTreatment } = useClinic();

  const dentistId = 'D-04';
  const dentistName = 'Bác sĩ Nguyễn Hương';

  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'teeth' | 'prescription'>('teeth');
  const [selectedToothNum, setSelectedToothNum] = useState<number | null>(null);

  const [symptoms, setSymptoms] = useState<string[]>(['Ê buốt cơ học', 'Đau khi nhai']);
  const [chiefComplaint, setChiefComplaint] = useState('Bệnh nhân buốt răng hàm dưới khi ăn lạnh');
  const [icdCode, setIcdCode] = useState('K02.1 - Sâu ngà răng');
  const [rxTemplate, setRxTemplate] = useState('Sau điều trị sâu răng / Hàn răng');

  const [activeTeethState, setActiveTeethState] = useState<ToothState[]>([
    { toothNumber: 46, condition: 'decay', treatment: 'Sâu ngà mặt nhai' },
    { toothNumber: 38, condition: 'missing', treatment: 'Đã nhổ' }
  ]);
  const [performedServices, setPerformedServices] = useState<string[]>([]);

  const dentistQueue = queue.filter(q => q.dentistId === dentistId && q.status !== 'Completed');
  const activeQueueItem = queue.find(q => q.id === selectedQueueId);
  const activePatient = activeQueueItem ? patients.find(p => p.id === activeQueueItem.patientId) : null;
  const activePatientRecords = activePatient ? medicalRecords.filter(r => r.patientId === activePatient.id) : [];

  const handleSelectQueueItem = (id: string) => {
    setSelectedQueueId(id);
    const item = queue.find(q => q.id === id);
    if (item && item.status === 'Waiting') {
      startTreatment(id);
    }
    if (item?.patientId === 'P-9902') {
      setActiveTeethState([
        { toothNumber: 46, condition: 'decay', treatment: 'Hàn răng Composite' },
        { toothNumber: 38, condition: 'missing', treatment: 'Đã nhổ' }
      ]);
    } else {
      setActiveTeethState([
        { toothNumber: 46, condition: 'decay', treatment: 'Sâu ngà mặt nhai' },
        { toothNumber: 38, condition: 'missing', treatment: 'Đã nhổ' }
      ]);
    }
    setPerformedServices([]);
    setActiveTab('teeth');
  };

  const handleToothClick = (num: number) => { setSelectedToothNum(num); };

  const handleDiagnoseTooth = (condition: ToothState['condition'], serviceId?: string) => {
    if (!selectedToothNum) return;
    const service = services.find(s => s.id === serviceId);
    const newToothState: ToothState = {
      toothNumber: selectedToothNum,
      condition,
      treatment: service ? service.name : undefined
    };
    setActiveTeethState(prev => {
      const filtered = prev.filter(t => t.toothNumber !== selectedToothNum);
      if (condition === 'healthy') return filtered;
      return [...filtered, newToothState];
    });
    if (serviceId && !performedServices.includes(serviceId)) {
      setPerformedServices(prev => [...prev, serviceId]);
    }
    alert(`Đã chẩn đoán Răng ${selectedToothNum}: ${condition.toUpperCase()}`);
    setSelectedToothNum(null);
  };

  const handleServiceCheckbox = (id: string) => {
    setPerformedServices(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleFinalize = () => {
    if (!selectedQueueId) return;
    completeTreatment(
      selectedQueueId,
      activeTeethState,
      chiefComplaint + ' - Chẩn đoán: ' + icdCode,
      performedServices.length > 0 ? performedServices : ['S-08']
    );
    alert('Đã hoàn tất ca điều trị lâm sàng và gửi hóa đơn thanh toán thành công!');
    setSelectedQueueId(null);
    setPerformedServices([]);
  };

  return (
    <div className="p-container-padding-desktop space-y-6 animate-in fade-in duration-200">

      {/* Top Bento Section */}
      <div className="grid grid-cols-12 gap-6">

        {/* Waiting Line Monitor */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-outline-variant clinical-shadow overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">pending_actions</span>
              <h2 className="font-headline-sm text-headline-sm">Hàng Chờ Khám Của Bác Sĩ ({dentistName})</h2>
            </div>
            <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold">
              {dentistQueue.length} Bệnh nhân chờ
            </span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dentistQueue.length > 0 ? (
              dentistQueue.map((item) => {
                const isActive = selectedQueueId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectQueueItem(item.id)}
                    className={`p-4 rounded-lg flex flex-col justify-between hover:shadow-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white border-2 border-primary'
                        : 'bg-surface-container-low border-l-4 border-primary'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold ${isActive ? 'text-white/80' : 'text-primary'}`}>
                        {item.status === 'In Chair' ? 'Đang khám' : 'Đang đợi'}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-white/70' : 'text-on-surface-variant'}`}>
                        {item.room}
                      </span>
                    </div>
                    <p className="font-bold truncate text-body-lg">{item.patientName}</p>
                    <div className="mt-4 flex items-center justify-between text-xs opacity-90">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {item.status === 'In Chair' ? `${item.elapsedTimeMin || 0}m đã qua` : `Đợi ${item.waitTimeMin}m`}
                      </span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-on-surface-variant italic">
                Bác sĩ chưa có bệnh nhân nào trong hàng đợi khám lâm sàng.
              </div>
            )}
          </div>
        </section>

        {/* Status statistics */}
        <section className="col-span-12 lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-xl">how_to_reg</span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Tổng Tiếp Nhận</p>
              <p className="text-headline-sm font-bold">12</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">hourglass_empty</span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Đang đợi khám</p>
              <p className="text-headline-sm font-bold">{dentistQueue.filter(q => q.status === 'Waiting').length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Khám xong hôm nay</p>
              <p className="text-headline-sm font-bold">8</p>
            </div>
          </div>
        </section>
      </div>

      {activeQueueItem && activePatient ? (
        /* Active Treatment Area */
        <div className="grid grid-cols-12 gap-6 animate-in slide-in-from-bottom duration-300">

          {/* Left: Patient details summary */}
          <section className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col h-fit">
            <div className="p-6 border-b border-outline-variant relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-headline-sm">
                    {activePatient.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{activePatient.name}</h3>
                    <p className="text-xs text-on-surface-variant">ID: #{activePatient.id} • {activePatient.age} Tuổi • {activePatient.gender}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-error-container/20 border border-error/20 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-error uppercase mb-1">Dị ứng nghiêm trọng</p>
                  <p className="text-xs font-bold text-on-error-container">{activePatient.criticalAllergy}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">Bệnh lý nền</p>
                  <p className="text-xs font-bold text-amber-900">{activePatient.condition}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                Lịch sử điều trị gần đây
              </h4>
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {activePatientRecords.map((rec, index) => (
                  <div key={rec.id} className="flex gap-3 relative text-xs">
                    {index < activePatientRecords.length - 1 && (
                      <div className="w-[1.5px] bg-outline-variant absolute left-3 top-6 bottom-0"></div>
                    )}
                    <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary flex-shrink-0 z-10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px]">medical_services</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{rec.title}</p>
                      <p className="text-[10px] text-on-surface-variant">{rec.date}</p>
                      {rec.notes && <p className="text-on-surface-variant italic mt-1 bg-surface p-1.5 rounded">"{rec.notes}"</p>}
                    </div>
                  </div>
                ))}
                {activePatientRecords.length === 0 && (
                  <p className="text-xs text-on-surface-variant italic">Chưa có lịch sử điều trị</p>
                )}
              </div>
            </div>
          </section>

          {/* Right: Diagnosis and Interactive dental chart */}
          <section className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-outline-variant shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-6">
                {[
                  { key: 'teeth' as const, label: 'Sơ đồ răng khám' },
                  { key: 'diagnosis' as const, label: 'Chẩn đoán & Chỉ định dịch vụ' },
                  { key: 'prescription' as const, label: 'Đơn thuốc mẫu' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`font-bold pb-2 transition-all cursor-pointer ${activeTab === t.key ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold font-data-mono bg-surface-container px-3 py-1 rounded">
                Phiên khám: #EMR-{activeQueueItem.id}
              </span>
            </div>

            <div className="p-6 space-y-6">

              {/* Tab 1: Dental chart */}
              {activeTab === 'teeth' && (
                <div className="space-y-6">
                  <DentalChart
                    teethState={activeTeethState}
                    selectedTooth={selectedToothNum}
                    onSelectTooth={handleToothClick}
                  />
                  {selectedToothNum && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3 animate-in fade-in duration-200">
                      <h4 className="font-bold text-primary text-xs uppercase">Chẩn đoán và xử lý cho Răng {selectedToothNum}:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button type="button" onClick={() => handleDiagnoseTooth('healthy')} className="bg-white border border-outline-variant rounded p-2 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer">Khỏe mạnh (Xóa bệnh lý)</button>
                        <button type="button" onClick={() => handleDiagnoseTooth('decay', 'S-03')} className="bg-error-container text-error border border-error rounded p-2 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer">Sâu răng (Trám răng)</button>
                        <button type="button" onClick={() => handleDiagnoseTooth('crown', 'S-03')} className="bg-amber-50 text-amber-800 border border-amber-500 rounded p-2 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer">Hỏng bọc sứ (Làm răng sứ)</button>
                        <button type="button" onClick={() => handleDiagnoseTooth('missing', 'S-04')} className="bg-slate-100 text-outline border border-outline border-dashed rounded p-2 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">Răng sâu nặng (Nhổ răng)</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Diagnosis & services */}
              {activeTab === 'diagnosis' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Triệu chứng & Lý do khám *</label>
                      <textarea value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-body-md focus:ring-1 focus:ring-primary focus:outline-none" rows={3} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Chẩn đoán y khoa (Mã ICD-10) *</label>
                      <input type="text" value={icdCode} onChange={e => setIcdCode(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-1 focus:ring-primary focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-on-surface-variant">Dịch vụ thực hiện trong phiên này *</label>
                    <div className="border border-outline-variant rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar bg-slate-50">
                      {services.map(s => (
                        <label key={s.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input type="checkbox" checked={performedServices.includes(s.id)} onChange={() => handleServiceCheckbox(s.id)} className="rounded text-primary focus:ring-0" />
                          {s.name} (₫{s.price.toLocaleString()})
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Prescription */}
              {activeTab === 'prescription' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Mẫu đơn thuốc chỉ định</label>
                    <select value={rxTemplate} onChange={e => setRxTemplate(e.target.value)} className="w-full bg-surface-container border border-outline-variant rounded-lg p-2 text-body-md focus:outline-none">
                      <option>Sau điều trị sâu răng / Hàn răng</option>
                      <option>Chăm sóc sau nhổ răng khôn</option>
                      <option>Sau điều trị tủy răng (Nội nha)</option>
                    </select>
                  </div>
                  <div className="p-4 border border-dashed border-outline-variant bg-slate-50 rounded-lg text-center text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 text-outline">medication</span>
                    <p className="font-bold">Đơn thuốc mẫu được áp dụng:</p>
                    <p className="italic mt-1 text-primary">
                      {rxTemplate === 'Chăm sóc sau nhổ răng khôn'
                        ? 'Amoxicillin 500mg (20 viên) - Uống 1 viên sau ăn trưa/tối. Paracetamol 500mg (10 viên) - Uống 1 viên khi đau.'
                        : 'Paracetamol 500mg (10 viên) - Uống 1 viên khi đau.'}
                    </p>
                    <div className="mt-4 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md font-bold">
                      Lưu ý: Bệnh nhân tự mang đơn thuốc ra ngoài mua. Phòng khám không bán thuốc.
                    </div>
                  </div>
                </div>
              )}

              {/* Finalize button */}
              <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
                <div className="text-xs text-on-surface-variant font-medium">
                  {performedServices.length > 0 ? (
                    <span>
                      Đã chọn: <strong>{performedServices.length} dịch vụ</strong>. Tổng cộng sơ bộ:{' '}
                      <strong className="text-primary">
                        ₫{performedServices.map(id => services.find(s => s.id === id)?.price || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-error font-bold">Vui lòng chọn ít nhất 1 dịch vụ đã thực hiện!</span>
                  )}
                </div>
                <button
                  onClick={handleFinalize}
                  disabled={performedServices.length === 0}
                  className={`px-8 py-3 rounded-lg font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer ${
                    performedServices.length > 0 ? 'bg-secondary hover:bg-secondary/90 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span className="material-symbols-outlined">task_alt</span>
                  Ký Bệnh Án & Gửi Hóa Đơn
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Empty Workspace screen */
        <div className="bg-white rounded-xl border border-outline-variant p-12 text-center text-on-surface-variant clinical-shadow flex flex-col justify-center items-center h-96">
          <span className="material-symbols-outlined text-[64px] text-primary/20 mb-4 animate-bounce">dentistry</span>
          <h3 className="text-headline-sm font-bold text-on-surface">Không Có Bệnh Nhân Nào Đang Chọn</h3>
          <p className="text-body-md text-on-surface-variant max-w-sm mt-2">
            Vui lòng chọn một bệnh nhân từ danh sách hàng chờ trực tuyến ở trên để tải hồ sơ nha khoa lâm sàng.
          </p>
        </div>
      )}
    </div>
  );
};

export const DentistDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  switch (tab) {
    case 'queue':    return <DentistQueue />;
    case 'records':  return <DentistRecords />;
    default:         return <DentistHome />;
  }
};
