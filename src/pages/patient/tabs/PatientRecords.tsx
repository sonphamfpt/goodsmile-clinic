import React, { useState } from 'react';
import { useClinic } from '../../../context/ClinicContext';

// Dental chart tooth data - full set of 32 teeth
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const CONDITION_STYLES: Record<string, { bg: string; border: string; label: string; color: string; icon: string }> = {
  healthy: { bg: 'bg-white', border: 'border-outline-variant', label: 'Khỏe mạnh', color: 'text-secondary', icon: 'dentistry' },
  decay: { bg: 'bg-amber-50', border: 'border-amber-400', label: 'Sâu răng', color: 'text-amber-700', icon: 'coronavirus' },
  treated: { bg: 'bg-primary-container', border: 'border-primary', label: 'Đã trám/điều trị', color: 'text-primary', icon: 'healing' },
  missing: { bg: 'bg-error-container', border: 'border-error', label: 'Mất răng', color: 'text-error', icon: 'close' },
  crown: { bg: 'bg-purple-50', border: 'border-purple-400', label: 'Bọc sứ/Implant', color: 'text-purple-700', icon: 'diamond' },
};

// MASTER TOOTH CONDITIONS (Snapshot of the current state)
const toothConditions: Record<number, string> = {
  38: 'missing',
  48: 'missing',
  15: 'treated',
  25: 'treated',
  16: 'crown',
  46: 'decay',
};

// CHRONOLOGICAL MEDICAL RECORD (Lịch sử khám bệnh)
const VISITS = [
  {
    id: 'V-1002',
    date: '15/10/2025',
    doctor: 'BS. Mai Lan',
    room: 'Phòng 105',
    reason: 'Đau nhức nhẹ khi ăn đồ ngọt',
    diagnosis: 'Sâu men rãnh mặt nhai răng 46',
    treatments: ['Chụp X-Quang chóp răng', 'Trám Composite thẩm mỹ răng 46'],
    notes: 'Bệnh nhân có men răng nhạy cảm, cần chú ý vệ sinh kỹ vùng răng hàm.',
    prescription: {
      id: 'RX-9922',
      medicines: [
        { name: 'Sensodyne Rapid Relief', dose: 'Chải răng 2 lần/ngày', duration: 'Thường xuyên', note: 'Kem đánh răng chống ê buốt' }
      ],
      instructions: 'Hạn chế ăn đồ ngọt, chua, quá nóng hoặc quá lạnh trong 24h đầu sau trám.'
    },
    files: [
      { id: 'F-112', type: 'image', title: 'X-Quang chóp răng 46', size: '2.1 MB' }
    ]
  },
  {
    id: 'V-1001',
    date: '28/09/2025',
    doctor: 'BS. Hoàng Nam',
    room: 'Phòng Phẫu Thuật',
    reason: 'Đau nhức dữ dội vùng hàm dưới trong cùng',
    diagnosis: 'Răng khôn 38, 48 mọc lệch ngầm',
    treatments: ['Chụp X-Quang toàn hàm (Panorama)', 'Tiểu phẫu nhổ răng khôn 38, 48'],
    notes: 'Ca phẫu thuật khó, chân răng 48 móc câu sát dây thần kinh.',
    prescription: {
      id: 'RX-8821',
      medicines: [
        { name: 'Augmentin 1g', dose: '1 viên × 2 lần/ngày', duration: '7 ngày', note: 'Uống ngay sau bữa ăn' },
        { name: 'Efferalgan 500mg', dose: '1 viên khi đau', duration: 'Tối đa 4v/ngày', note: 'Cách nhau ít nhất 4 giờ' },
        { name: 'Medrol 16mg', dose: '1 viên × 1 lần/ngày', duration: '3 ngày', note: 'Uống sau ăn sáng. Giảm sưng' },
      ],
      instructions: 'Cắn chặt gạc 1 giờ. Chườm đá 24h đầu. Không dùng ống hút, không khạc nhổ. Tái khám cắt chỉ sau 7 ngày.'
    },
    files: [
      { id: 'F-111', type: 'image', title: 'Phim X-Quang Panorama Toàn hàm', size: '4.5 MB' },
      { id: 'F-110', type: 'pdf', title: 'Phiếu cam kết phẫu thuật', size: '1.2 MB' }
    ]
  }
];

export const PatientRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'timeline'>('chart');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [viewRecord, setViewRecord] = useState<any>(null); // For viewing files
  const [printVisit, setPrintVisit] = useState<any>(null); // For printing visit record

  const getCondition = (tooth: number) => toothConditions[tooth] || 'healthy';

  const summaryCounts = {
    healthy: 32 - Object.keys(toothConditions).length,
    decay: Object.values(toothConditions).filter(c => c === 'decay').length,
    treated: Object.values(toothConditions).filter(c => c === 'treated').length,
    missing: Object.values(toothConditions).filter(c => c === 'missing').length,
    crown: Object.values(toothConditions).filter(c => c === 'crown').length,
  };

  return (
    <>
    <div className={`p-stack-lg max-w-[1200px] mx-auto ${printVisit ? 'print:hidden' : ''}`}>
      {/* Header & Simple Profile */}
      <div className="mb-8 bg-white rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Hồ sơ bệnh án điện tử</h2>
          <p className="text-body-md text-on-surface-variant mt-1">Bệnh nhân: <strong className="text-on-surface">Trần Nguyễn Minh</strong> (Mã BN: P-8821)</p>
        </div>
        <div className="flex gap-4 text-sm text-on-surface-variant">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant">
            <span className="block text-[10px] uppercase font-bold">Giới tính</span>
            <span className="font-bold text-on-surface">Nam</span>
          </div>
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant">
            <span className="block text-[10px] uppercase font-bold">Ngày sinh</span>
            <span className="font-bold text-on-surface">15/04/1998 (28t)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl w-fit border border-outline-variant">
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-6 py-2.5 text-sm font-bold flex items-center gap-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'chart' ? 'bg-white text-primary shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dentistry</span>
          Sơ đồ răng tổng quan
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-6 py-2.5 text-sm font-bold flex items-center gap-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'timeline' ? 'bg-white text-primary shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">history</span>
          Lịch sử điều trị
        </button>
      </div>

      {/* TAB 1: SƠ ĐỒ RĂNG TỔNG QUAN (Current Master State) */}
      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dentistry</span>
                Sơ đồ răng 32 chiếc
              </h3>
            </div>

            {/* Visual Chart */}
            <div className="space-y-12 pb-8">
              {/* UPPER JAW */}
              <div className="relative">
                <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Hàm trên</p>
                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {UPPER_TEETH.map((tooth, idx) => {
                    const cond = getCondition(tooth);
                    const style = CONDITION_STYLES[cond];
                    const distFromCenter = Math.abs(idx - 7.5);
                    const mt = distFromCenter * distFromCenter * 1.5; 
                    
                    return (
                      <button
                        key={tooth}
                        onClick={() => setSelectedTooth(selectedTooth === tooth ? null : tooth)}
                        style={{ marginTop: `${mt}px` }}
                        className={`w-8 h-12 sm:w-10 sm:h-14 rounded-b-2xl rounded-t-sm border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-110 shadow-sm relative group ${style.bg} ${style.border} ${selectedTooth === tooth ? 'ring-4 ring-primary/30 scale-110 z-10' : ''}`}
                        title={`Răng ${tooth} - ${style.label}`}
                      >
                        <span className={`material-symbols-outlined text-[16px] ${cond === 'missing' ? 'opacity-30' : ''}`}>{style.icon}</span>
                        <span className="text-[10px] font-black">{tooth}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Center Line */}
              <div className="relative flex justify-center items-center h-4">
                <div className="absolute w-full border-t-2 border-dashed border-outline-variant"></div>
                <span className="bg-white px-4 text-xs font-bold text-outline uppercase tracking-widest z-10">Lưỡi / Khoang miệng</span>
              </div>

              {/* LOWER JAW */}
              <div className="relative">
                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {LOWER_TEETH.map((tooth, idx) => {
                    const cond = getCondition(tooth);
                    const style = CONDITION_STYLES[cond];
                    const distFromCenter = Math.abs(idx - 7.5);
                    const mb = distFromCenter * distFromCenter * 1.5; 
                    
                    return (
                      <button
                        key={tooth}
                        onClick={() => setSelectedTooth(selectedTooth === tooth ? null : tooth)}
                        style={{ marginBottom: `${mb}px` }}
                        className={`w-8 h-12 sm:w-10 sm:h-14 rounded-t-2xl rounded-b-sm border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-110 shadow-sm relative group ${style.bg} ${style.border} ${selectedTooth === tooth ? 'ring-4 ring-primary/30 scale-110 z-10' : ''}`}
                        title={`Răng ${tooth} - ${style.label}`}
                      >
                        <span className="text-[10px] font-black">{tooth}</span>
                        <span className={`material-symbols-outlined text-[16px] ${cond === 'missing' ? 'opacity-30' : ''}`}>{style.icon}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Hàm dưới</p>
              </div>
            </div>
          </div>

          {/* Summary & Details Side Panel */}
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-3xl border border-outline-variant p-6">
              <h4 className="font-bold text-on-surface mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">pie_chart</span>
                Thống kê tình trạng
              </h4>
              <div className="space-y-3">
                {Object.entries(CONDITION_STYLES).map(([key, style]) => {
                  const count = summaryCounts[key as keyof typeof summaryCounts];
                  if (count === 0 && key !== 'healthy') return null;
                  return (
                    <div key={key} className="flex items-center justify-between bg-white p-3 rounded-xl border border-outline-variant">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} border ${style.border} ${style.color}`}>
                          <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
                        </div>
                        <span className="font-bold text-sm text-on-surface">{style.label}</span>
                      </div>
                      <span className="text-lg font-black text-on-surface-variant">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedTooth && (
              <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-lg animate-fade-in relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${CONDITION_STYLES[getCondition(selectedTooth)].bg} ${CONDITION_STYLES[getCondition(selectedTooth)].border} border-l-4`}></div>
                <div className="pl-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Chi tiết</p>
                      <h4 className="text-2xl font-black text-on-surface mt-1">Răng số {selectedTooth}</h4>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${CONDITION_STYLES[getCondition(selectedTooth)].bg} ${CONDITION_STYLES[getCondition(selectedTooth)].border} ${CONDITION_STYLES[getCondition(selectedTooth)].color}`}>
                      <span className="material-symbols-outlined text-[24px]">{CONDITION_STYLES[getCondition(selectedTooth)].icon}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Trạng thái hiện tại</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${CONDITION_STYLES[getCondition(selectedTooth)].bg} ${CONDITION_STYLES[getCondition(selectedTooth)].border} ${CONDITION_STYLES[getCondition(selectedTooth)].color}`}>
                      {CONDITION_STYLES[getCondition(selectedTooth)].label}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!selectedTooth && (
              <div className="bg-surface-container-low border border-outline-variant border-dashed rounded-3xl p-6 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[150px]">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">touch_app</span>
                <p className="text-sm">Bấm vào một răng trên sơ đồ để xem trạng thái.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LỊCH SỬ ĐIỀU TRỊ (Chronological Timeline) */}
      {activeTab === 'timeline' && (
        <div className="max-w-4xl mx-auto relative animate-fade-in">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-outline-variant/50 rounded-full"></div>

          <div className="space-y-12">
            {VISITS.map((visit, index) => (
              <div key={visit.id} className="relative pl-12 md:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-2.5 md:left-6 w-4 h-4 rounded-full bg-primary ring-4 ring-primary-container z-10 top-6"></div>
                
                {/* Visit Card */}
                <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
                  
                  {/* Visit Header */}
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary-container px-3 py-1 rounded-full mr-3">{visit.date}</span>
                      <span className="font-bold text-on-surface text-lg">Khám lâm sàng & Điều trị</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant bg-white px-3 py-1.5 rounded-lg border border-outline-variant">
                        <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                        {visit.doctor} ({visit.room})
                      </div>
                      <button 
                        onClick={() => setPrintVisit(visit)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
                        title="Xem & In hồ sơ đợt khám này"
                      >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        <span className="hidden sm:inline">In Phiếu Khám</span>
                      </button>
                    </div>
                  </div>

                  {/* Visit Body */}
                  <div className="p-6 space-y-6">
                    {/* Reason & Diagnosis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1 mb-1">
                          <span className="material-symbols-outlined text-[14px]">record_voice_over</span> Lý do khám
                        </p>
                        <p className="text-sm font-medium text-on-surface">{visit.reason}</p>
                      </div>
                      <div className="bg-error-container/20 border border-error/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-error uppercase tracking-widest flex items-center gap-1 mb-1">
                          <span className="material-symbols-outlined text-[14px]">vital_signs</span> Chẩn đoán bệnh
                        </p>
                        <p className="text-sm font-bold text-error">{visit.diagnosis}</p>
                      </div>
                    </div>

                    {/* Treatments Done */}
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">healing</span> Thủ thuật đã thực hiện
                      </p>
                      <ul className="space-y-2">
                        {visit.treatments.map((t, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-on-surface font-medium bg-surface-container-low p-2 rounded-lg border border-outline-variant w-fit">
                            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {visit.notes && (
                       <p className="text-sm italic text-on-surface-variant border-l-4 border-outline-variant pl-3">
                         <strong>Ghi chú bác sĩ:</strong> {visit.notes}
                       </p>
                    )}

                    {/* Attachments: Prescription & Files */}
                    <div className="pt-4 border-t border-outline-variant">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Tài liệu kèm theo đợt khám</p>
                      <div className="flex flex-wrap gap-4">
                        
                        {/* Prescription Button */}
                        {visit.prescription && (
                          <div className="bg-white border-2 border-primary/20 rounded-xl p-4 flex-1 min-w-[250px]">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-primary-container text-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm text-on-surface">Đơn thuốc ({visit.prescription.medicines.length} loại)</p>
                                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Mã: {visit.prescription.id}</p>
                              </div>
                            </div>
                            <div className="space-y-2 mt-3">
                              {visit.prescription.medicines.map((m, i) => (
                                <p key={i} className="text-xs text-on-surface flex justify-between border-b border-outline-variant border-dashed pb-1">
                                  <span className="font-medium">{m.name}</span>
                                  <span className="text-on-surface-variant">{m.dose}</span>
                                </p>
                              ))}
                            </div>
                            <button className="w-full mt-3 py-2 bg-surface-container text-on-surface font-bold text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors">
                              <span className="material-symbols-outlined text-[16px]">print</span>
                              In chi tiết
                            </button>
                          </div>
                        )}

                        {/* Files Area */}
                        {visit.files && visit.files.length > 0 && (
                          <div className="flex-1 min-w-[250px] space-y-2">
                            {visit.files.map(file => (
                              <div 
                                key={file.id} 
                                onClick={() => setViewRecord(file)}
                                className="bg-surface-container-low border border-outline-variant p-3 rounded-xl flex items-center gap-3 hover:bg-surface-container cursor-pointer transition-colors group"
                              >
                                <div className="w-10 h-10 bg-zinc-800 text-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                                  {file.type === 'image' && <span className="material-symbols-outlined text-white/30 text-[40px] absolute">skeleton</span>}
                                  <span className="material-symbols-outlined z-10 text-[18px]">
                                    {file.type === 'image' ? 'image' : 'picture_as_pdf'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{file.title}</p>
                                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">{file.size}</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">visibility</span>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setViewRecord(null)}>
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Chi tiết tệp tin
              </h3>
              <button onClick={() => setViewRecord(null)} className="p-2 hover:bg-surface-container rounded-full cursor-pointer transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-full bg-zinc-900 rounded-2xl h-[250px] flex flex-col items-center justify-center relative overflow-hidden mb-6 shadow-inner">
                {viewRecord.type === 'image' ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-transparent"></div>
                    <span className="material-symbols-outlined text-white/20 text-[120px]">skeleton</span>
                  </>
                ) : (
                  <span className="material-symbols-outlined text-white/20 text-[100px]">description</span>
                )}
              </div>
              
              <h4 className="font-bold text-on-surface text-xl mb-1">{viewRecord.title}</h4>
              <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-6">{viewRecord.size}</p>

              <button
                onClick={() => alert(`Tải xuống: ${viewRecord.title}`)}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Tải File Về Máy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Print Preview Modal */}
    {printVisit && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-fade-in print:p-0 print:bg-white print:block print:absolute print:inset-0">
        
        {/* Floating Action Bar (Hidden in Print) */}
        <div className="absolute top-4 right-4 z-[60] flex gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">print</span>
            Xuất Ra Máy In
          </button>
          <button 
            onClick={() => setPrintVisit(null)}
            className="flex items-center justify-center w-12 h-12 bg-white text-on-surface rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* A4 Paper Container */}
        <div className="bg-white w-full max-w-[800px] h-full max-h-[1000px] sm:h-auto sm:rounded-sm shadow-2xl overflow-y-auto print:shadow-none print:w-full print:max-w-none print:h-auto print:overflow-visible">
          
          <div className="p-8 sm:p-12 print:p-0 text-on-surface">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-xl print:bg-white print:border-2 print:border-black print:text-black">
                  <span className="material-symbols-outlined text-4xl">dentistry</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-widest">Nha Khoa GoodSmile</h1>
                  <p className="text-sm font-bold uppercase mt-1">Hệ Thống Chăm Sóc Răng Miệng Tiêu Chuẩn</p>
                  <p className="text-xs mt-1">123 Đường Hàm Nghi, Quận 1, TP.HCM</p>
                  <p className="text-xs">Hotline: 1900 8888</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black uppercase tracking-wider mb-2">Phiếu Khám Bệnh</h2>
                <p className="font-mono text-sm">Số: {printVisit.id}</p>
                <p className="font-mono text-sm">Ngày: {printVisit.date}</p>
              </div>
            </div>

            {/* Patient Info */}
            <h3 className="font-bold uppercase border-b border-dashed border-gray-400 pb-2 mb-4">I. Hành Chính</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm mb-8">
              <p><strong>Họ và tên bệnh nhân:</strong> Trần Nguyễn Minh</p>
              <p><strong>Mã Bệnh Nhân:</strong> P-8821</p>
              <p><strong>Ngày sinh:</strong> 15/04/1998 (28 tuổi)</p>
              <p><strong>Giới tính:</strong> Nam</p>
              <p className="col-span-2"><strong>Địa chỉ:</strong> 45/2 Nguyễn Đình Chiểu, Phường 3, Quận Phú Nhuận</p>
            </div>

            {/* Clinical Info */}
            <h3 className="font-bold uppercase border-b border-dashed border-gray-400 pb-2 mb-4">II. Khám Lâm Sàng & Điều Trị</h3>
            <div className="space-y-4 text-sm mb-8">
              <p><strong>1. Lý do đến khám:</strong> {printVisit.reason}</p>
              <p><strong>2. Chẩn đoán:</strong> {printVisit.diagnosis}</p>
              <div>
                <strong>3. Thủ thuật thực hiện:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {printVisit.treatments.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              {printVisit.notes && (
                <p><strong>4. Lời dặn của bác sĩ:</strong> {printVisit.notes}</p>
              )}
            </div>

            {/* Prescription (if any) */}
            {printVisit.prescription && (
              <>
                <h3 className="font-bold uppercase border-b border-dashed border-gray-400 pb-2 mb-4">III. Đơn Thuốc (Mã: {printVisit.prescription.id})</h3>
                <div className="space-y-4 text-sm mb-8">
                  {printVisit.prescription.medicines.map((m: any, i: number) => (
                    <div key={i} className="pl-4 border-l-2 border-black">
                      <p className="font-bold text-base">{i + 1}. {m.name}</p>
                      <p className="mt-1">Cách dùng: {m.dose} - Số lượng: {m.duration}</p>
                      <p className="italic text-gray-600">Ghi chú: {m.note}</p>
                    </div>
                  ))}
                  <p className="mt-4 border-t border-dotted border-gray-300 pt-4"><strong>Hướng dẫn chung:</strong> {printVisit.prescription.instructions}</p>
                </div>
              </>
            )}

            {/* Signatures */}
            <div className="flex justify-between mt-16 pt-8 text-center">
              <div>
                <p className="font-bold mb-16">Bệnh nhân ký nhận</p>
                <p>(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="italic mb-2">TP.HCM, ngày {printVisit.date.split('/')[0]} tháng {printVisit.date.split('/')[1]} năm {printVisit.date.split('/')[2]}</p>
                <p className="font-bold mb-16">Bác sĩ điều trị</p>
                <p className="font-bold uppercase">{printVisit.doctor}</p>
              </div>
            </div>

            {/* Footer notice */}
            <div className="mt-16 text-center text-[10px] text-gray-500 italic border-t border-gray-200 pt-4">
              Phiếu khám bệnh có giá trị lưu hành nội bộ tại Phòng khám GoodSmile. Vui lòng mang theo phiếu này trong các lần tái khám.
            </div>

          </div>
        </div>
      </div>
    )}
    </>
  );
};
