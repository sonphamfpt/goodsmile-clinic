import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClinic } from '../../../context/ClinicContext';
import { DentalChart } from '../../../components/DentalChart';
import { ToothState } from '../../../types/clinic';

const TYPE_CONFIG = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-700 bg-red-50 border border-red-200', label: 'PDF' },
  image: { icon: 'image', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', label: 'Hình ảnh' },
  prescription: { icon: 'description', color: 'text-sky-700 bg-sky-50 border border-sky-200', label: 'Đơn thuốc' },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPatientId = searchParams.get('patientId');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(urlPatientId);
  const [activeSection, setActiveSection] = useState<'timeline' | 'files' | 'teeth'>('timeline');
  const [viewRecord, setViewRecord] = useState<typeof medicalRecords[0] | null>(null);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPatientId(urlPatientId);
  }, [urlPatientId]);

  const selectPatient = (id: string) => {
    setSelectedPatientId(id);
    setSearchParams(prev => {
      prev.set('patientId', id);
      return prev;
    });
  };

  const clearPatient = () => {
    setSelectedPatientId(null);
    setSearchParams(prev => {
      prev.delete('patientId');
      return prev;
    });
  };

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

      {!selectedPatient ? (
        /* View 1: Patient List Table (Full Width) */
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col clinical-shadow animate-in fade-in duration-200">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Tìm bệnh nhân theo tên, mã hoặc SĐT..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              Tìm thấy <strong>{filteredPatients.length}</strong> bệnh nhân
            </div>
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-container text-on-surface-variant font-bold text-xs uppercase tracking-wider border-b border-outline-variant">
                <tr>
                  <th className="p-4 w-16 text-center">STT</th>
                  <th className="p-4">Mã bệnh nhân</th>
                  <th className="p-4">Họ và tên</th>
                  <th className="p-4">Thông tin cá nhân</th>
                  <th className="p-4">Tiền sử bệnh lý</th>
                  <th className="p-4 text-center">Hồ sơ lưu trữ</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredPatients.map((p, idx) => {
                  const recordCount = medicalRecords.filter(r => r.patientId === p.id).length;
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="p-4 text-center font-medium text-on-surface-variant">{idx + 1}</td>
                      <td className="p-4 font-bold text-primary text-xs">{p.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs">
                            {p.name.split(' ').pop()?.charAt(0)}
                          </div>
                          <span className="font-bold text-on-surface">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-on-surface">{p.phone}</p>
                        <p className="text-xs text-on-surface-variant">{p.age} tuổi • {p.gender}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {p.criticalAllergy !== 'Không' ? (
                            <span className="text-[10px] bg-error-container text-error px-2.5 py-0.5 rounded-full font-bold">
                              ⚠ Dị ứng: {p.criticalAllergy}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-semibold">
                              Không dị ứng
                            </span>
                          )}
                          {p.condition && p.condition !== 'Bình thường' && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                              {p.condition}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-bold bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full border border-outline-variant/30">
                          {recordCount} hồ sơ
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => selectPatient(p.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs bg-primary text-white hover:bg-primary/95 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          Xem hồ sơ EMR
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-3">search_off</span>
                <p className="text-on-surface font-bold">Không tìm thấy bệnh nhân nào</p>
                <p className="text-on-surface-variant text-sm mt-1">Vui lòng thử từ khóa hoặc mã số khác</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* View 2: Patient EMR Details (Full Width Workspace) */
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Back button and navigation bar */}
          <div className="flex items-center justify-between bg-surface-container-low border border-outline-variant p-4 rounded-2xl shadow-sm">
            <button 
              onClick={clearPatient}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-container border border-outline-variant text-on-surface hover:text-primary rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Quay lại danh sách bệnh nhân
            </button>
            <div className="text-xs text-on-surface-variant font-semibold">
              Đang xem hồ sơ: <span className="text-primary font-bold">{selectedPatient.name} ({selectedPatient.id})</span>
            </div>
          </div>

          {/* Patient summary card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-[#003a73] p-5 text-on-primary flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                {selectedPatient.name.split(' ').pop()?.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-headline-sm text-headline-sm">{selectedPatient.name}</h3>
                <p className="text-sm opacity-80">{selectedPatient.id} • {selectedPatient.age} tuổi • {selectedPatient.gender} • {selectedPatient.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs bg-white/20 px-3 py-1.5 rounded-xl font-bold">Ví thành viên: ₫{selectedPatient.balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 bg-slate-50/50">
              {[
                { label: 'Dị ứng', value: selectedPatient.criticalAllergy, alert: selectedPatient.criticalAllergy !== 'Không' },
                { label: 'Bệnh lý nền', value: selectedPatient.condition || 'Bình thường', alert: false },
                { label: 'Hồ sơ lưu trữ', value: `${patientRecords.length} tài liệu`, alert: false },
              ].map((item, idx) => (
                <div key={item.label} className={`py-4 px-6 text-center flex flex-col justify-center ${item.alert ? 'bg-red-50/60' : ''} ${idx < 2 ? 'border-r border-slate-100' : ''}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${item.alert ? 'text-red-600' : 'text-slate-500'}`}>{item.label}</p>
                  <p className={`text-base font-extrabold mt-1 ${item.alert ? 'text-red-700' : 'text-slate-800'}`}>{item.value}</p>
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

          {/* Timeline (now Table view) */}
          {activeSection === 'timeline' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 overflow-hidden flex flex-col">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-4 px-4 w-16 text-center">STT</th>
                      <th className="py-4 px-4">Ngày khám</th>
                      <th className="py-4 px-4">Nội dung / Dịch vụ</th>
                      <th className="py-4 px-4">Loại hồ sơ</th>
                      <th className="py-4 px-4">Trạng thái</th>
                      <th className="py-4 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientRecords.map((rec, idx) => {
                      const typeConf = TYPE_CONFIG[rec.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.pdf;
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-5 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                          <td className="py-5 px-4 font-bold text-slate-700">{rec.date}</td>
                          <td className="py-5 px-4">
                            <div className="max-w-[280px] truncate font-extrabold text-slate-800" title={rec.title}>
                              {rec.title}
                            </div>
                            {rec.notes && (
                              <p className="text-xs text-slate-500 max-w-[280px] truncate mt-1 font-medium" title={rec.notes}>
                                {rec.notes}
                              </p>
                            )}
                          </td>
                          <td className="py-5 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full ${typeConf.color}`}>
                              <span className="material-symbols-outlined text-[13px]">{typeConf.icon}</span>
                              {typeConf.label}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                              <span className="material-symbols-outlined text-[13px]">lock</span>
                              Đã ký số
                            </span>
                          </td>
                          <td className="py-5 px-4 text-right">
                            <button
                              onClick={() => setViewRecord(rec)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs border border-primary/20 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {patientRecords.length === 0 && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-[60px] text-outline">history</span>
                    <p className="text-on-surface-variant mt-3">Chưa có lịch sử điều trị</p>
                  </div>
                )}
              </div>
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
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
                <DentalChart
                  teethState={Object.entries(mergedTeethMap).map(([num, cond]) => ({
                    toothNumber: Number(num),
                    condition: cond as ToothState['condition'],
                    treatment: patientRecords.flatMap(r => r.teethMap || []).find(t => t.toothNumber === Number(num))?.treatment
                  }))}
                  selectedTooth={selectedTooth}
                  onSelectTooth={(toothNum) => setSelectedTooth(selectedTooth === toothNum ? null : toothNum)}
                  patientAge={selectedPatient?.age}
                />
              </div>

              {Object.keys(mergedTeethMap).length > 0 && (
                <div className="mt-5 pt-4 border-t border-outline-variant bg-white rounded-2xl border border-outline-variant p-6 shadow-sm">
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
      )}

      {/* View record modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewRecord(null)}>
          <div className="bg-slate-100 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">folder_shared</span>
                <div>
                  <h3 className="font-bold text-sm">Chi tiết Hồ sơ Bệnh án EMR</h3>
                  <p className="text-[10px] text-slate-400">Mã hồ sơ: #{viewRecord.id} • Ngày lập: {viewRecord.date}</p>
                </div>
              </div>
              <button onClick={() => setViewRecord(null)} className="p-1.5 hover:bg-white/20 rounded-full cursor-pointer flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left side: Clinical Details & Teeth map */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-outline-variant p-4 shadow-sm">
                    <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">clinical_notes</span>
                      Thông tin chẩn đoán
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hồ sơ / Điều trị chính</p>
                        <p className="font-bold text-sm text-slate-900">{viewRecord.title}</p>
                      </div>
                      
                      {viewRecord.notes && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ghi chú & Đơn thuốc</p>
                          <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed font-medium">
                            {viewRecord.notes.includes('|') ? (
                              <div className="space-y-2">
                                {viewRecord.notes.split('|').map((part, pIdx) => {
                                  const trimmed = part.trim();
                                  if (trimmed.startsWith('Dị ứng:')) {
                                    return <p key={pIdx}><strong>Dị ứng:</strong> <span className="text-error font-bold">{trimmed.replace('Dị ứng:', '')}</span></p>;
                                  }
                                  if (trimmed.startsWith('Bệnh lý nền:')) {
                                    return <p key={pIdx}><strong>Bệnh lý nền:</strong> <span className="text-amber-800 font-bold">{trimmed.replace('Bệnh lý nền:', '')}</span></p>;
                                  }
                                  if (trimmed.toLowerCase().includes('đơn thuốc:')) {
                                    return (
                                      <div key={pIdx} className="border-t border-amber-200/40 pt-2 mt-2">
                                        <p className="font-bold text-[10px] text-amber-800 uppercase tracking-wider mb-1">Đơn thuốc:</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                          {trimmed.replace(/đơn thuốc:/i, '').split(';').map((drug, dIdx) => (
                                            <li key={dIdx}>{drug.trim()}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  }
                                  return <p key={pIdx} className="border-t border-amber-200/40 pt-2 mt-2">{trimmed}</p>;
                                })}
                              </div>
                            ) : (
                              <p className="whitespace-pre-line">{viewRecord.notes}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Bác sĩ thực hiện</p>
                          <p className="font-bold text-slate-800">Bác sĩ Nguyễn Hương</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Kích thước lưu trữ</p>
                          <p className="font-bold text-slate-800">{viewRecord.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teeth Map recorded on that day */}
                  {viewRecord.teethMap && viewRecord.teethMap.length > 0 && (
                    <div className="bg-white rounded-xl border border-outline-variant p-4 shadow-sm">
                      <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">dentistry</span>
                        Sơ đồ răng điều trị ngày {viewRecord.date}
                      </h4>
                      
                      {/* Mini Tooth map */}
                      <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50 space-y-4">
                        {/* Upper */}
                        <div className="flex justify-center gap-1 flex-wrap">
                          {UPPER_TEETH.map(tooth => {
                            const match = viewRecord.teethMap?.find(t => t.toothNumber === tooth);
                            const cond = match?.condition || 'healthy';
                            const isTreated = cond !== 'healthy';
                            return (
                              <div 
                                key={tooth} 
                                className={`w-7 h-10 rounded border-2 flex flex-col items-center justify-center text-[8px] transition-all ${
                                  isTreated ? TOOTH_COLORS[cond] : 'bg-white border-slate-200 opacity-40'
                                }`}
                                title={`Răng ${tooth}: ${match?.treatment || CONDITION_LABELS[cond]?.label || 'Bình thường'}`}
                              >
                                <span className="material-symbols-outlined text-[11px]">dentistry</span>
                                <span className="font-bold">{tooth}</span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="border-t border-dashed border-slate-200 my-1 text-center relative">
                          <span className="bg-white px-2 py-0.5 text-[8px] text-slate-400 font-bold border border-slate-200 rounded-full absolute -top-2.5 left-1/2 -translate-x-1/2">ĐƯỜNG GIỮA HÀM</span>
                        </div>
                        
                        {/* Lower */}
                        <div className="flex justify-center gap-1 flex-wrap pt-1">
                          {LOWER_TEETH.map(tooth => {
                            const match = viewRecord.teethMap?.find(t => t.toothNumber === tooth);
                            const cond = match?.condition || 'healthy';
                            const isTreated = cond !== 'healthy';
                            return (
                              <div 
                                key={tooth} 
                                className={`w-7 h-10 rounded border-2 flex flex-col items-center justify-center text-[8px] transition-all ${
                                  isTreated ? TOOTH_COLORS[cond] : 'bg-white border-slate-200 opacity-40'
                                }`}
                                title={`Răng ${tooth}: ${match?.treatment || CONDITION_LABELS[cond]?.label || 'Bình thường'}`}
                              >
                                <span className="font-bold">{tooth}</span>
                                <span className="material-symbols-outlined text-[11px]">dentistry</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detailed tooth conditions table */}
                      <div className="mt-3 space-y-1 max-h-[120px] overflow-y-auto custom-scrollbar">
                        {viewRecord.teethMap.map((t, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-700">Răng số {t.toothNumber}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CONDITION_LABELS[t.condition]?.color || ''}`}>
                                {CONDITION_LABELS[t.condition]?.label}
                              </span>
                              {t.treatment && (
                                <span className="text-slate-500 font-medium truncate max-w-[120px]">({t.treatment})</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Print/Download helper buttons */}
                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => alert(`Đang tải file EMR-${viewRecord.id}.pdf về thiết bị...`)}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>Tải PDF bệnh án
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="py-2.5 px-4 border border-outline-variant hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>In hồ sơ
                  </button>
                </div>
              </div>

              {/* Right side: Signed PDF Document view (A4 sheet replica) */}
              <div className="lg:col-span-7 bg-slate-400/20 rounded-xl border border-slate-300 p-4 lg:p-6 flex justify-center items-start overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="bg-white max-w-[595px] w-full p-6 lg:p-8 shadow-lg rounded border border-slate-300 text-slate-700 text-xs font-medium space-y-6 relative">
                  
                  {/* Signed Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none select-none border-8 border-green-700 p-6 rounded-full text-center rotate-12">
                    <span className="text-4xl font-extrabold text-green-700 tracking-wider">ĐÃ KÝ SỐ EMR</span>
                    <br />
                    <span className="text-xl font-bold text-green-700">GOOD SMILE CLINIC</span>
                  </div>

                  {/* PDF Header */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-sm font-black text-primary">NHA KHOA GOOD SMILE</h2>
                      <p className="text-[9px] text-slate-500 mt-0.5">Địa chỉ: 123 Đường Ba Tháng Hai, Quận 10, TP.HCM</p>
                      <p className="text-[9px] text-slate-500">Hotline: 1900 6789 | Email: contact@goodsmile.vn</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-600 whitespace-nowrap">MÃ SỐ BỆNH ÁN: EMR-{viewRecord.id}</p>
                      <p className="text-[9px] text-slate-400 whitespace-nowrap">Ngày lưu trữ: {viewRecord.date}</p>
                    </div>
                  </div>

                  <h1 className="text-center text-sm font-black uppercase text-slate-900 tracking-wider">HỒ SƠ BỆNH ÁN ĐIỆN TỬ</h1>
                  
                  {/* Patient Info */}
                  {selectedPatient && (
                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200/50">
                      <p className="text-[9px] font-bold text-primary uppercase border-b border-slate-200 pb-1">Thông tin hành chính</p>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-700">
                        <p className="col-span-2"><strong>Họ và tên bệnh nhân:</strong> {selectedPatient.name}</p>
                        <p><strong>Mã bệnh nhân:</strong> {selectedPatient.id}</p>
                        <p><strong>Tuổi / Giới tính:</strong> {selectedPatient.age} tuổi / {selectedPatient.gender}</p>
                        <p><strong>Số điện thoại:</strong> {selectedPatient.phone}</p>
                        <p><strong>Bệnh lý toàn thân:</strong> {selectedPatient.condition || 'Bình thường'}</p>
                        <p className="col-span-2"><strong>Dị ứng:</strong> <span className={selectedPatient.criticalAllergy !== 'Không' ? 'text-error font-bold' : ''}>{selectedPatient.criticalAllergy}</span></p>
                      </div>
                    </div>
                  )}

                  {/* Treatment details */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-primary uppercase border-b border-slate-200 pb-1">Chẩn đoán và Thủ thuật điều trị</p>
                    <div className="space-y-1.5">
                      <p><strong>Dịch vụ chính thực hiện:</strong> {viewRecord.title}</p>
                      {viewRecord.type === 'image' && (
                        <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center h-[220px]">
                          <img 
                            src={viewRecord.id === 'MR-02' ? '/braces_progress.png' : '/xray_panorama.png'} 
                            alt={viewRecord.title} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      )}
                      {viewRecord.teethMap && viewRecord.teethMap.length > 0 && (
                        <div className="pl-3 border-l-2 border-primary/50 text-[11px] text-slate-600 space-y-1">
                          <p className="font-semibold text-slate-700 text-xs">Chi tiết răng điều trị:</p>
                          {viewRecord.teethMap.map((t, idx) => (
                            <p key={idx}>• Răng số {t.toothNumber}: {CONDITION_LABELS[t.condition]?.label} {t.treatment ? `— ${t.treatment}` : ''}</p>
                          ))}
                        </div>
                      )}
                      {viewRecord.notes && (
                        <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                          <p className="font-bold text-slate-600 mb-1 text-[10px] uppercase">Ghi chú lâm sàng:</p>
                          <p className="italic">"{viewRecord.notes.includes('|') ? viewRecord.notes.split('|').filter(p => !p.trim().startsWith('Dị ứng:') && !p.trim().startsWith('Bệnh lý nền:') && !p.toLowerCase().includes('đơn thuốc:')).join('. ').trim() : viewRecord.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PDF prescription if it contains prescription */}
                  {viewRecord.notes && viewRecord.notes.toLowerCase().includes('đơn thuốc:') && (
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-primary uppercase border-b border-slate-200 pb-1">Toa thuốc điều trị chỉ định</p>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-[9px] font-bold">
                            <th className="py-1.5">Tên thuốc</th>
                            <th className="py-1.5 text-center w-16">SL</th>
                            <th className="py-1.5">Hướng dẫn sử dụng</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {viewRecord.notes.split('|').filter(part => part.toLowerCase().includes('đơn thuốc:')).map((rxPart, rxIdx) => {
                            const rawDrugs = rxPart.replace(/đơn thuốc:/i, '').trim().split(';');
                            return rawDrugs.map((drug, drugIdx) => {
                              const match = drug.match(/(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
                              if (match) {
                                return (
                                  <tr key={`${rxIdx}-${drugIdx}`}>
                                    <td className="py-1.5 font-bold text-slate-800">{match[1]}</td>
                                    <td className="py-1.5 text-center">{match[2]}</td>
                                    <td className="py-1.5 italic text-slate-600">{match[3]}</td>
                                  </tr>
                                );
                              }
                              return (
                                <tr key={`${rxIdx}-${drugIdx}`}>
                                  <td colSpan={3} className="py-1.5 italic text-slate-600">{drug.trim()}</td>
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Official sign area */}
                  <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-center text-[10px]">
                    <div>
                      <p className="uppercase font-bold text-slate-400">Người bệnh / Người giám hộ</p>
                      <p className="text-[8px] text-slate-400 italic">(Đã ký điện tử qua cổng Patient App)</p>
                      <div className="h-14 flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          ĐÃ XÁC NHẬN
                        </span>
                      </div>
                      <p className="font-bold text-slate-800">{selectedPatient?.name}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold text-slate-400">Bác sĩ điều trị ký</p>
                      <p className="text-[8px] text-slate-400 italic">(Ký và đóng dấu số điện tử E-Signature)</p>
                      <div className="h-14 flex flex-col items-center justify-center relative">
                        <span className="font-serif text-primary text-sm font-extrabold italic border-b border-primary/50 leading-none pb-0.5">Nguyễn Hương</span>
                        <span className="text-[7px] text-green-700 bg-green-50 px-1 border border-green-200 rounded mt-1 font-mono uppercase tracking-widest scale-90">DIGITALLY SIGNED</span>
                      </div>
                      <p className="font-bold text-slate-800">Bác sĩ Nguyễn Hương</p>
                    </div>
                  </div>

                  {/* Verification footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[8px] text-slate-400 font-mono">
                    <span className="flex items-center gap-0.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[10px] text-green-600">verified_user</span>
                      Xác thực số: EMR-SECURE-SHA256
                    </span>
                    <span className="truncate max-w-[260px]" title="5a9f2d8e7b1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d">
                      SHA-256: 5a9f2d8e7b1a2c3d4e5f6a7b8c9...
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
