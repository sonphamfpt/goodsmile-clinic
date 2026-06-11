import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';

const TYPE_CONFIG = {
  pdf: { icon: 'picture_as_pdf', color: 'text-error bg-error-container', label: 'PDF' },
  image: { icon: 'image', color: 'text-secondary bg-secondary-container', label: 'Hình ảnh' },
  prescription: { icon: 'description', color: 'text-primary bg-primary-container', label: 'Đơn thuốc' },
};

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  decay: { label: 'Sâu răng', color: 'text-amber-700 bg-amber-100 border-amber-300' },
  treated: { label: 'Đã điều trị', color: 'text-primary bg-primary-container border-primary/30' },
  missing: { label: 'Mất răng', color: 'text-error bg-error-container border-error/30' },
  crown: { label: 'Bọc sứ', color: 'text-purple-700 bg-purple-100 border-purple-300' },
  healthy: { label: 'Khỏe mạnh', color: 'text-secondary bg-secondary-container border-secondary/30' },
};

export const DentistRecords: React.FC = () => {
  const { medicalRecords, patients } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('P-8821');
  const [activeSection, setActiveSection] = useState<'timeline' | 'files' | 'teeth'>('timeline');
  const [viewRecord, setViewRecord] = useState<typeof medicalRecords[0] | null>(null);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientRecords = medicalRecords.filter(r => r.patientId === selectedPatientId);

  const sections = [
    { key: 'timeline' as const, label: 'Lịch sử điều trị', icon: 'timeline' },
    { key: 'files' as const, label: 'Tài liệu & X-quang', icon: 'folder_shared' },
    { key: 'teeth' as const, label: 'Sơ đồ răng', icon: 'dentistry' },
  ];

  const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Aggregate all tooth conditions from records
  const toothMap: Record<number, string> = {};
  patientRecords.forEach(r => {
    r.teethMap?.forEach(t => { toothMap[t.toothNumber] = t.condition; });
  });

  // Additional static data for the selected patient
  const staticToothMap: Record<string, Record<number, string>> = {
    'P-8821': { 38: 'missing', 48: 'missing', 15: 'treated', 25: 'treated', 16: 'crown' },
    'P-9902': { 46: 'decay', 38: 'missing', 36: 'treated' },
  };
  const mergedTeethMap = { ...(staticToothMap[selectedPatientId || ''] || {}), ...toothMap };

  const TOOTH_COLORS: Record<string, string> = {
    decay: 'bg-amber-100 border-amber-400',
    treated: 'bg-primary-container border-primary',
    missing: 'bg-error-container border-error',
    crown: 'bg-purple-100 border-purple-400',
    healthy: 'bg-white border-outline-variant',
  };

  return (
    <div className="p-stack-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Hồ sơ bệnh án EMR</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Tra cứu và quản lý hồ sơ lâm sàng điện tử của tất cả bệnh nhân</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Patient search */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Tìm bệnh nhân theo tên, ID, SĐT..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            {filteredPatients.map(p => {
              const isSelected = selectedPatientId === p.id;
              const recordCount = medicalRecords.filter(r => r.patientId === p.id).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-primary bg-primary-container/20 shadow-md' : 'border-outline-variant bg-white hover:border-primary/30 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                      {p.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.id} • {p.age}t • {p.gender}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                        {recordCount} HS
                      </span>
                      {p.tier !== 'Standard' && (
                        <p className={`text-[10px] font-bold mt-0.5 ${p.tier === 'Diamond' ? 'text-purple-600' : p.tier === 'Platinum' ? 'text-primary' : 'text-amber-600'}`}>
                          {p.tier}
                        </p>
                      )}
                    </div>
                  </div>
                  {(p.criticalAllergy !== 'Không' || (p.condition && p.condition !== 'Bình thường')) && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.criticalAllergy !== 'Không' && (
                        <span className="text-[10px] bg-error-container text-error px-2 py-0.5 rounded-full font-bold">⚠ {p.criticalAllergy}</span>
                      )}
                      {p.condition && p.condition !== 'Bình thường' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{p.condition}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: EMR Detail */}
        <div className="col-span-12 lg:col-span-8">
          {selectedPatient ? (
            <div className="space-y-5">
              {/* Patient summary card */}
              <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-[#003a73] p-5 text-on-primary flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                    {selectedPatient.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm">{selectedPatient.name}</h3>
                    <p className="text-sm opacity-80">{selectedPatient.id} • {selectedPatient.age} tuổi • {selectedPatient.gender} • {selectedPatient.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-white/20`}>{selectedPatient.tier}</span>
                    <p className="text-xs opacity-70 mt-1">₫{selectedPatient.balance.toLocaleString()} ví</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-outline-variant">
                  {[
                    { label: 'Dị ứng', value: selectedPatient.criticalAllergy, alert: selectedPatient.criticalAllergy !== 'Không' },
                    { label: 'Bệnh lý nền', value: selectedPatient.condition || 'Bình thường', alert: false },
                    { label: 'Hồ sơ', value: `${patientRecords.length} tài liệu`, alert: false },
                    { label: 'Điểm tích lũy', value: `${selectedPatient.points} điểm`, alert: false },
                  ].map(item => (
                    <div key={item.label} className={`p-3 text-center ${item.alert ? 'bg-error-container/20' : ''}`}>
                      <p className={`text-[10px] font-bold uppercase ${item.alert ? 'text-error' : 'text-on-surface-variant'}`}>{item.label}</p>
                      <p className={`text-sm font-bold mt-0.5 ${item.alert ? 'text-error' : 'text-on-surface'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section tabs */}
              <div className="flex gap-1 border-b border-outline-variant">
                {sections.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSection(s.key)}
                    className={`px-5 py-3 text-label-md font-bold flex items-center gap-2 border-b-2 -mb-px transition-all cursor-pointer ${
                      activeSection === s.key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              {activeSection === 'timeline' && (
                <div className="space-y-4">
                  {patientRecords.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant">
                      <span className="material-symbols-outlined text-[60px] text-outline">history</span>
                      <p className="text-on-surface-variant mt-3">Chưa có lịch sử điều trị</p>
                    </div>
                  )}
                  {patientRecords.map((rec, i) => (
                    <div key={rec.id} className="flex gap-4 relative">
                      {i < patientRecords.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-outline-variant/50 z-0"></div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">medical_services</span>
                      </div>
                      <div className="flex-1 bg-white rounded-xl border border-outline-variant p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewRecord(rec)}>
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <p className="font-bold text-on-surface">{rec.title}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">{rec.date} • {rec.size}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_CONFIG[rec.type as keyof typeof TYPE_CONFIG]?.color || ''}`}>
                            {TYPE_CONFIG[rec.type as keyof typeof TYPE_CONFIG]?.label}
                          </span>
                        </div>
                        {rec.notes && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">sticky_note_2</span>
                            <p className="text-xs text-amber-800">{rec.notes}</p>
                          </div>
                        )}
                        {rec.teethMap && rec.teethMap.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {rec.teethMap.map((t, ti) => (
                              <span key={ti} className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${CONDITION_LABELS[t.condition]?.color || 'bg-surface-container text-on-surface-variant border-outline-variant'}`}>
                                R.{t.toothNumber}: {t.treatment}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Files */}
              {activeSection === 'files' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientRecords.map(rec => {
                    const typeConf = TYPE_CONFIG[rec.type as keyof typeof TYPE_CONFIG];
                    return (
                      <div key={rec.id} onClick={() => setViewRecord(rec)} className="bg-white rounded-xl border border-outline-variant p-4 flex items-center gap-3 hover:shadow-md cursor-pointer transition-all group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeConf?.color}`}>
                          <span className="material-symbols-outlined text-[26px]">{typeConf?.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-on-surface text-sm truncate">{rec.title}</p>
                          <p className="text-xs text-on-surface-variant">{rec.date} • {rec.size}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); alert(`Tải xuống: ${rec.title}`); }}
                          className="p-2 text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                      </div>
                    );
                  })}
                  {patientRecords.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-outline-variant">
                      <span className="material-symbols-outlined text-[60px] text-outline">folder_open</span>
                      <p className="text-on-surface-variant mt-3">Chưa có tài liệu nào</p>
                    </div>
                  )}
                </div>
              )}

              {/* Teeth map */}
              {activeSection === 'teeth' && (
                <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-headline-sm text-headline-sm">Sơ đồ răng tổng quát</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CONDITION_LABELS).map(([key, val]) => (
                        <span key={key} className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${val.color}`}>{val.label}</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center mb-3">Hàm trên</p>
                  <div className="flex justify-center gap-1.5 flex-wrap mb-3">
                    {UPPER_TEETH.map(tooth => (
                      <div key={tooth} className={`w-9 h-12 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 ${TOOTH_COLORS[mergedTeethMap[tooth] || 'healthy'] || 'bg-white border-outline-variant'}`} title={`Răng ${tooth}`}>
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">dentistry</span>
                        <span className="text-[9px] font-bold text-on-surface-variant">{tooth}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-outline-variant/50"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-on-surface-variant font-bold">Đường giữa hàm</span></div>
                  </div>
                  <div className="flex justify-center gap-1.5 flex-wrap mt-3">
                    {LOWER_TEETH.map(tooth => (
                      <div key={tooth} className={`w-9 h-12 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 ${TOOTH_COLORS[mergedTeethMap[tooth] || 'healthy'] || 'bg-white border-outline-variant'}`} title={`Răng ${tooth}`}>
                        <span className="text-[9px] font-bold text-on-surface-variant">{tooth}</span>
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">dentistry</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center mt-3">Hàm dưới</p>

                  {Object.keys(mergedTeethMap).length > 0 && (
                    <div className="mt-5 pt-4 border-t border-outline-variant">
                      <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">Tổng hợp tình trạng răng</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(mergedTeethMap).map(([toothNum, cond]) => (
                          <span key={toothNum} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${CONDITION_LABELS[cond]?.color || 'bg-surface-container border-outline-variant text-on-surface-variant'}`}>
                            R.{toothNum}: {CONDITION_LABELS[cond]?.label || cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant h-96 flex flex-col items-center justify-center text-center shadow-sm p-8">
              <span className="material-symbols-outlined text-[72px] text-outline/40">person_search</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mt-4">Chọn bệnh nhân</h4>
              <p className="text-on-surface-variant text-sm mt-2">Tìm và chọn bệnh nhân từ danh sách để xem hồ sơ bệnh án</p>
            </div>
          )}
        </div>
      </div>

      {/* View record modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewRecord(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-primary px-6 py-4 text-on-primary flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm">Chi tiết hồ sơ</h3>
              <button onClick={() => setViewRecord(null)} className="p-1 hover:bg-white/20 rounded-full cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto ${TYPE_CONFIG[viewRecord.type as keyof typeof TYPE_CONFIG]?.color}`}>
                <span className="material-symbols-outlined text-4xl">{TYPE_CONFIG[viewRecord.type as keyof typeof TYPE_CONFIG]?.icon}</span>
              </div>
              <p className="text-center font-bold text-on-surface">{viewRecord.title}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-surface-container-low rounded-lg p-2.5">
                  <p className="text-xs text-on-surface-variant">Ngày</p>
                  <p className="font-bold">{viewRecord.date}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-2.5">
                  <p className="text-xs text-on-surface-variant">Kích thước</p>
                  <p className="font-bold">{viewRecord.size}</p>
                </div>
              </div>
              {viewRecord.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-xs font-bold text-amber-800 mb-1">Ghi chú</p>
                  <p className="text-sm text-amber-900">{viewRecord.notes}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setViewRecord(null)} className="flex-1 py-2.5 border border-outline text-on-surface rounded-xl font-bold cursor-pointer">Đóng</button>
                <button onClick={() => alert(`Tải: ${viewRecord.title}`)} className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">download</span>Tải xuống
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
