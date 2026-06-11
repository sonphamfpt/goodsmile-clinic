import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { BookingModal } from '../../components/BookingModal';

export const Doctors: React.FC = () => {
  const { dentists } = useClinic();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const doctorDetails: Record<string, { education: string; experience: string; bio: string }> = {
    'D-01': {
      education: 'Tốt nghiệp Đại học Y Dược TP.HCM, Thạc sĩ Nội nha Đại học Pennsylvania (Hoa Kỳ).',
      experience: '12 năm kinh nghiệm điều trị nội nha lâm sàng.',
      bio: 'Bác sĩ Lê Minh là chuyên gia đầu ngành về bảo tồn răng. Với sự kiên trì và tỉ mỉ, bác sĩ đã cứu chữa thành công hàng ngàn ca viêm tủy răng phức tạp, giảm thiểu tối đa việc phải nhổ bỏ răng thật của bệnh nhân.'
    },
    'D-02': {
      education: 'Tốt nghiệp ĐH Y Hà Nội, Bác sĩ Nội trú Ngoại khoa, Chứng chỉ cấy ghép Implant Đại học Bordeaux (Pháp).',
      experience: '10 năm chuyên sâu phẫu thuật trong miệng và cấy ghép Implant.',
      bio: 'Bác sĩ Hoàng Nam nổi tiếng với kỹ thuật phẫu thuật nhổ răng khôn mọc ngầm không đau bằng sóng siêu âm. Bác sĩ cũng là chuyên gia uy tín trong việc cấy ghép Implant tức thì giúp khôi phục nụ cười nhanh chóng cho bệnh nhân.'
    },
    'D-03': {
      education: 'Tốt nghiệp ĐH Y Dược Hải Phòng, Chứng chỉ Nha khoa Thẩm mỹ chuyên sâu từ Hiệp hội Nha khoa Thẩm mỹ Châu Á.',
      experience: '8 năm kinh nghiệm phục hình thẩm mỹ.',
      bio: 'Bác sĩ Mai Lan có gu thẩm mỹ tinh tế, chuyên về thiết kế nụ cười, bọc răng sứ thẩm mỹ và tẩy trắng răng công nghệ cao. Bác sĩ luôn lắng nghe tâm tư của khách hàng để tạo ra nụ cười hài hòa, tự nhiên nhất.'
    },
    'D-04': {
      education: 'Tốt nghiệp Đại học Nha khoa Quốc gia Seoul (Hàn Quốc), Chứng chỉ Chỉnh nha Invisalign Bạch Kim từ Hoa Kỳ.',
      experience: '15 năm chuyên sâu Chỉnh nha & Niềng răng.',
      bio: 'Bác sĩ Nguyễn Hương có kinh nghiệm dày dặn trong việc nắn chỉnh răng lệch lạc, sai khớp cắn từ đơn giản đến phức tạp cho cả trẻ em lẫn người lớn. Bác sĩ luôn áp dụng những kỹ thuật chỉnh nha tiên tiến nhất thế giới để rút ngắn thời gian điều trị cho bệnh nhân.'
    }
  };

  return (
    <div className="bg-background min-h-screen py-stack-lg px-container-padding-desktop">
      <div className="max-w-7xl mx-auto space-y-stack-lg animate-in fade-in duration-200">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-stack-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary">Đội Ngũ Bác Sĩ Chuyên Gia</h1>
          <p className="text-body-lg text-on-surface-variant">
            Quy tụ những y bác sĩ có chuyên môn cao, được đào tạo bài bản trong và ngoài nước, tận tâm chăm sóc vì sức khỏe nụ cười của bạn.
          </p>
        </div>

        {/* Doctors Profiles Card Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {dentists.map((doc) => {
            const details = doctorDetails[doc.id] || { education: 'Đang cập nhật', experience: 'Đang cập nhật', bio: 'Đang cập nhật' };
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                
                {/* Image */}
                <div className="w-full md:w-44 h-48 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant">
                  <img
                    alt={doc.name}
                    src={doc.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">{doc.name}</h3>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{doc.role}</p>
                    </div>
                    
                    <p className="text-xs text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">room</span>
                      Phòng trực: {doc.room}
                    </p>

                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      {details.bio}
                    </p>

                    <div className="pt-2 space-y-1 text-xs text-on-surface-variant">
                      <p><strong>Học vấn:</strong> {details.education}</p>
                      <p><strong>Kinh nghiệm:</strong> {details.experience}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      Đặt lịch khám với {doc.name.split(' ').slice(-2).join(' ')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor trust row */}
        <div className="bg-surface-container rounded-xl p-6 text-center space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Đạt chuẩn quốc tế trong quy trình điều trị y khoa</h3>
          <p className="text-body-md text-on-surface-variant max-w-3xl mx-auto">
            100% đội ngũ y bác sĩ và phụ tá tại nha khoa GoodSmile thường xuyên tham gia các khóa tập huấn, chuyển giao công nghệ điều trị mới và đào tạo an toàn y tế định kỳ, đảm bảo quy trình vô trùng tuyệt đối theo chuẩn quốc tế.
          </p>
          <div className="flex justify-center gap-6 flex-wrap pt-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-white border border-outline-variant px-3 py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm">workspace_premium</span> ISO 13485:2016
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-white border border-outline-variant px-3 py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm">health_and_safety</span> Vô trùng chuẩn Bộ Y tế
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-white border border-outline-variant px-3 py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm">verified_user</span> Bảo hành Implant trọn đời
            </span>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
