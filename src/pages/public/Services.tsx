import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';

export const Services: React.FC = () => {
  const { services } = useClinic();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const serviceDescriptions: Record<string, string> = {
    'S-01': 'Loại bỏ mảng bám, cao răng cứng đầu trên răng và dưới nướu, ngăn ngừa viêm nướu, hôi miệng hiệu quả. Khuyên dùng định kỳ mỗi 6 tháng.',
    'S-02': 'Sử dụng công nghệ ánh sáng Laser hiện đại kết hợp gel tẩy trắng chính hãng của Mỹ, nâng tông răng trắng sáng an toàn từ 2-4 tông chỉ sau 60 phút.',
    'S-03': 'Phục hồi hình dáng thẩm mỹ và chức năng nhai của răng bị sứt mẻ, thưa hoặc sâu bằng vật liệu Composite chất lượng cao trùng màu răng tự nhiên.',
    'S-04': 'Phẫu thuật nhổ răng khôn mọc lệch, mọc ngầm bằng công nghệ sóng siêu âm Piezotome hạn chế tối đa sưng đau, chảy máu, hồi phục vết thương nhanh.',
    'S-05': 'Điều trị tủy triệt để bằng hệ thống máy trâm xoay hiện đại, loại bỏ tủy viêm đau đớn, trám kín ống tủy bảo tồn tối đa răng thật của bệnh nhân.',
    'S-06': 'Giải pháp phục hình răng đã mất tối ưu nhất. Cắm trụ Implant Titanium trực tiếp vào xương hàm đóng vai trò như chân răng thật, chịu lực nhai cực tốt.',
    'S-07': 'Chỉnh nha thẩm mỹ sử dụng mắc cài kim loại/sứ hoặc khay niềng trong suốt Invisalign giúp dịch chuyển răng về đúng vị trí mong muốn, sửa khớp cắn lệch.',
    'S-08': 'Kiểm tra toàn diện sức khỏe răng miệng, chụp phim X-quang chẩn đoán hình ảnh và lập phác đồ điều trị chi tiết cùng bác sĩ chuyên khoa đầu ngành.'
  };

  const serviceIcons: Record<string, string> = {
    'S-01': 'clean_hands',
    'S-02': 'brightness_high',
    'S-03': 'dentistry',
    'S-04': 'healing',
    'S-05': 'biotech',
    'S-06': 'rebase',
    'S-07': 'grid_view',
    'S-08': 'assignment'
  };

  return (
    <div className="bg-background min-h-screen py-stack-lg px-container-padding-desktop">
      <div className="max-w-7xl mx-auto space-y-stack-lg">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-stack-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary">Dịch Vụ Nha Khoa Chuyên Sâu</h1>
          <p className="text-body-lg text-on-surface-variant">
            GoodSmile cung cấp đầy đủ các giải pháp điều trị và chăm sóc răng miệng toàn diện với công nghệ 4.0 và đội ngũ bác sĩ tay nghề cao.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">
                    {serviceIcons[service.id] || 'dentistry'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{service.name}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Mã dịch vụ: {service.id}
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {serviceDescriptions[service.id] || 'Dịch vụ nha khoa chuyên sâu chất lượng cao tại hệ thống nha khoa GoodSmile.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-outline font-bold uppercase">Chi phí trọn gói</p>
                  <p className="text-headline-sm font-bold text-primary">
                    ₫{service.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  Đặt lịch hẹn
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner call to action */}
        <div className="premium-glow rounded-xl p-8 text-on-primary flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h2 className="text-headline-md font-bold text-white">Bạn chưa tìm thấy dịch vụ phù hợp?</h2>
            <p className="text-body-lg opacity-90">
              Hãy liên hệ với chúng tôi để đặt lịch khám tổng quát miễn phí. Các bác sĩ sẽ chẩn đoán chính xác và tư vấn kế hoạch điều trị tối ưu nhất cho bạn.
            </p>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer shadow-md"
          >
            Đặt khám tổng quát
            <span className="material-symbols-outlined">verified</span>
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
