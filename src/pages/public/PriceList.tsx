import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';

export const PriceList: React.FC = () => {
  const { services } = useClinic();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'aesthetic' | 'surgical'>('all');

  const getServiceCategory = (id: string): 'general' | 'aesthetic' | 'surgical' => {
    if (id === 'S-01' || id === 'S-08' || id === 'S-05') return 'general';
    if (id === 'S-02' || id === 'S-03' || id === 'S-07') return 'aesthetic';
    return 'surgical'; // S-04, S-06
  };

  const filteredServices = services
    .filter(s => s.isActive)
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterCategory === 'all') return matchesSearch;
      return matchesSearch && getServiceCategory(s.id) === filterCategory;
    });

  return (
    <div className="bg-background min-h-screen py-stack-lg px-container-padding-desktop">
      <div className="max-w-5xl mx-auto space-y-stack-lg animate-in fade-in duration-200">
        
        {/* Title */}
        <div className="text-center space-y-stack-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary">Bảng Giá Dịch Vụ Niêm Yết</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            GoodSmile cam kết chi phí minh bạch, trọn gói, không phát sinh chi phí ẩn trong suốt quá trình điều trị nha khoa.
          </p>
        </div>

        {/* Controls: Search and Filter Tabs */}
        <div className="bg-white rounded-xl border border-outline-variant p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              type="text"
              placeholder="Tìm tên dịch vụ hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-surface-container-low rounded-lg p-1 gap-1 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterCategory('general')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === 'general'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Khám & Điều trị chung
            </button>
            <button
              onClick={() => setFilterCategory('aesthetic')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === 'aesthetic'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Nha khoa thẩm mỹ
            </button>
            <button
              onClick={() => setFilterCategory('surgical')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === 'surgical'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tiểu phẫu & Cấy ghép
            </button>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-label-md text-on-surface-variant uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã</th>
                <th className="px-6 py-4">Tên dịch vụ</th>
                <th className="px-6 py-4">Thời gian thực hiện</th>
                <th className="px-6 py-4 text-right">Chi phí niêm yết</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-body-md">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-data-mono text-data-mono text-primary font-bold">
                      {service.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {service.durationMin} phút
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary text-body-lg">
                      ₫{service.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setIsBookingOpen(true)}
                        className="px-4 py-1.5 bg-primary text-on-primary rounded-lg font-bold text-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                      >
                        Đặt hẹn
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant italic">
                    Không tìm thấy dịch vụ nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Insurance Policy Note */}
        <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant space-y-2">
          <h4 className="font-bold flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">info</span>
            Chính sách giảm trừ bảo hiểm & Thẻ thành viên GoodSmile
          </h4>
          <ul className="list-disc pl-5 text-xs text-on-surface-variant space-y-1">
            <li>Hỗ trợ giảm trực tiếp 15% chi phí dịch vụ cho bệnh nhân có bệnh lý lâm sàng và sở hữu bảo hiểm y tế liên kết (Bảo Việt, PVI, Manulife, v.v.).</li>
            <li>Giảm thêm theo thứ hạng thẻ hội viên: Thành viên Gold (giảm 2%), Platinum (giảm 5%), Diamond (giảm 10%).</li>
            <li>Hỗ trợ trả góp lãi suất 0% đối với các dịch vụ Niềng răng và Trồng răng Implant thông qua các ngân hàng liên kết.</li>
          </ul>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
