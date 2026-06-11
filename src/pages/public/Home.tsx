import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingModal } from '../../components/BookingModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="hero-gradient px-container-padding-desktop py-stack-lg min-h-[600px] flex flex-col md:flex-row items-center gap-stack-lg overflow-hidden">
        <div className="flex-1 space-y-stack-md max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-label-md font-label-md">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Giải pháp nha khoa 4.0 hàng đầu Việt Nam
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            Nâng Tầm Trải Nghiệm <br /> <span className="text-primary">Chăm Sóc Răng Miệng</span>
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg">
            Hệ thống quản lý chuyên sâu dành riêng cho phòng khám nha khoa hiện đại. Tối ưu hóa quy trình từ đặt lịch, điều trị đến thanh toán trong một nền tảng duy nhất.
          </p>
          <div className="flex flex-wrap gap-stack-md pt-base">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-primary text-on-primary px-stack-lg py-3 rounded-lg font-bold font-headline-sm flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Đặt lịch khám ngay
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/services')}
              className="border border-outline-variant bg-white text-on-surface px-stack-lg py-3 rounded-lg font-bold font-headline-sm flex items-center gap-2 hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Xem dịch vụ
            </button>
          </div>
          <div className="flex items-center gap-stack-md pt-stack-lg border-t border-outline-variant/30 mt-stack-lg">
            <div className="flex -space-x-3">
              <img
                alt="Doctor"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRh1BEbDItxmTS5t_FtQcOx4-Ji9qxa8SBaoqimlDJVAGi4uX_G2jBX7EFW3IMwtToObvTs2mcuKKoDjqJUdwXqiuFb4qWxe6bLf-rT3H75pDiivhMleiFb679WEYEgzCBc3sI_P015xZ627wSQZBCNog0wXvQRc_zaQyQ54mPp6EXIPRm4NhBAokHg7kAQHsACDQnEghzcJjJ3r04Jhy0k9_EeCaGCCndhtcmftP4_Jm4oPe1sLZ3ZEffU_8L5pP9zF2VXn9LLGw"
              />
              <img
                alt="Doctor"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANTEVtuLUOOjAmogqJN7Hi0xUg1x9U_4OgE3smE7dVTgg65UKKvpKlhV9fLKifMZ1f6DVysRbc9fLDjvKqmcZTmt1-svdnhJ3jt4RIpZvUNUmF75Bclcxn5GRUo85zTmLEkQznpMOuAXqGfDYefQZ4xE0ys7eUr0vvcvOQbfFMGnE1REf3_q9YPU1Bwv5OSrGTJ-oXeSbkMRlISSGI9zSDa6pk0Xq0OiZSAkyRkROKGJlJ-iDt8fDvPFhHPF0BRXOeOQiLuXvDet8"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-container text-white flex items-center justify-center text-xs font-bold">+500</div>
            </div>
            <p className="text-label-md font-label-md text-on-surface-variant">
              Được tin dùng bởi <span className="text-primary font-bold">500+</span> phòng khám trên toàn quốc
            </p>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/50">
            <img
              alt="Dental Clinic Dashboard"
              className="w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfUrHmtMGnZ1OUH-uhBulefOmmGLKTgBltVqHa4tDI3TrhTtPZfkGHptoWpcB5A0P6PcoXNFuhNoHx8xbKNDARSkqrDL82MCD3FJx5bxj-g1mw0Ml1ZWAFH0Nk3uKy8lnYHzgt-F2OCWBIgMdFbNP2di8ryODVbvX6XxMMr7vNdfDfkyvgagCkarAUpUn-fSNei2z0c1VWQU_C31UbdqjNsk1j9rZLCw6QMvGoRJwN9XwJ6MdCg-cyFb_yPkAHZXlZQT3Hup3a5S4"
            />
          </div>
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-20 transition-all duration-700 hidden lg:block border border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface-variant">Hàng chờ thực tế</p>
                <p className="text-headline-sm font-headline-sm text-secondary">08 Bệnh nhân</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="px-container-padding-desktop py-stack-lg bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Công Nghệ Đi Đầu - Chăm Sóc Tận Tâm</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant mt-stack-sm max-w-2xl mx-auto">
              Chúng tôi cung cấp các công cụ tối tân nhất để đội ngũ y bác sĩ tập trung vào điều quan trọng nhất: Sức khỏe nụ cười của bệnh nhân.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-stack-lg flex flex-col justify-between overflow-hidden relative group transition-all duration-300 hover:shadow-md">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-4xl mb-stack-sm">monitor_heart</span>
                <h3 className="font-headline-md text-headline-md mb-stack-sm">Hàng Chờ Thực Tế (Real-time)</h3>
                <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
                  Theo dõi trạng thái bệnh nhân từ lúc check-in đến khi hoàn tất điều trị. Đồng bộ tức thì giữa lễ tân, bác sĩ và thu ngân.
                </p>
              </div>
              <div className="mt-stack-lg bg-surface-container-low rounded-lg p-stack-md flex items-center gap-stack-md transition-transform">
                <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
                <span className="text-label-md font-label-md text-primary font-bold">Hiệu suất 85%</span>
              </div>
            </div>
            
            <div className="bg-secondary-container rounded-xl p-stack-lg flex flex-col justify-between text-on-secondary-container hover:shadow-md transition-all">
              <div>
                <span className="material-symbols-outlined text-3xl mb-stack-sm">psychology</span>
                <h3 className="font-headline-md text-headline-md mb-stack-sm">Trợ Lý AI Thông Minh</h3>
                <p className="text-body-md font-body-md">
                  Tư vấn sức khỏe tự động và dự đoán các vấn đề nha khoa tiềm ẩn dựa trên dữ liệu lâm sàng.
                </p>
              </div>
              <div
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-label-md font-label-md font-bold cursor-pointer hover:underline"
              >
                Khám phá AI <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>

            <div className="bg-primary text-on-primary rounded-xl p-stack-lg flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <span className="material-symbols-outlined text-3xl mb-stack-sm">biotech</span>
                <h3 className="font-headline-md text-headline-md mb-stack-sm">Độ Chính Xác Tuyệt Đối</h3>
                <p className="text-body-md font-body-md">
                  Hệ thống sơ đồ răng kỹ thuật số giúp bác sĩ lập kế hoạch điều trị chi tiết và minh bạch.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">stars</span>
                <span className="text-label-md font-label-md">Tiêu chuẩn quốc tế ISO 13485</span>
              </div>
            </div>

            <div className="md:col-span-2 bg-surface-container rounded-xl p-stack-lg flex flex-row items-center gap-stack-lg hover:shadow-md transition-all">
              <div className="flex-1">
                <h3 className="font-headline-md text-headline-md mb-stack-sm">Bảo Mật Dữ Liệu Y Tế</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Hồ sơ bệnh án điện tử (EMR) được mã hóa theo tiêu chuẩn HIPAA, đảm bảo quyền riêng tư và an toàn thông tin tuyệt đối.
                </p>
              </div>
              <div className="hidden sm:flex w-32 h-32 bg-white rounded-full items-center justify-center shadow-inner flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-5xl">encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="px-container-padding-desktop py-stack-lg bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-stack-lg">
          <div className="lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-surface-container">
              <img
                alt="Đội ngũ chuyên gia"
                className="w-full h-[450px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmNTPdPWOpvH6AtoUKFyT-HuZsWnbZ9F3ae6lQl1efD39NCwYrFvRu8axpWrTGMn7AXngQMO2wVXYM3YEahDukt6jw41MHGBZHVjcdpFWEP4J9lb-FHQFCz_I6ngBwuQ_AXWhHGSTm4WujM-GI1S6G9NyIBmzEg_YeVOat8o28G8ss1v2XVBkktRQu6csAFY0XBnHQkxHcFQlZijbcyetHww8nf8GE2Db3oMNdTP8p0gFPRB-C7EJs79GVk_hX0PfdOIF8gLASb_A"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-on-primary p-6 rounded-xl shadow-xl">
              <div className="text-headline-lg font-headline-lg">15+</div>
              <div className="text-label-md font-label-md">Năm kinh nghiệm</div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-stack-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Chuyên Gia Của GoodSmile</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Đội ngũ y bác sĩ tại GoodSmile là những chuyên gia đầu ngành, luôn tận tâm và không ngừng nâng cao tay nghề để mang lại kết quả điều trị tốt nhất.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md pt-base">
              <div className="flex items-start gap-3">
                <div className="bg-primary-fixed p-2 rounded-lg text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary">Chứng Chỉ Quốc Tế</h4>
                  <p className="text-body-md text-on-surface-variant">Chuyên gia Implant & Chỉnh nha được đào tạo tại Hoa Kỳ và Châu Âu.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-secondary-container p-2 rounded-lg text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-secondary">Tận Tâm Phục Vụ</h4>
                  <p className="text-body-md text-on-surface-variant">Lắng nghe và thấu hiểu, xây dựng phác đồ cá nhân hóa cho từng bệnh nhân.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="mt-stack-md border border-primary text-primary px-6 py-3 rounded-lg font-bold font-label-md hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
            >
              Tìm hiểu thêm về đội ngũ
            </button>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="px-container-padding-desktop py-stack-lg bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-stack-lg">
          <div className="lg:w-1/2 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                alt="Cơ sở vật chất hiện đại"
                className="w-full h-[450px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2OCQezoI--bnawVnp9cJGPb079sB7zMtIuYYLJBAWIdKaxmbOAsdb-EWNvZfkRgog7hwSolUcZeH3cUJfGfS4B_mAEFGOkQnaIpXSxJcXmrcUgDI-PbR-uHapcvQsWqSIEehLFcxvSlwh1saKWnZFyeiTnJXmtiL1yWC9ZEk7s0HsAfGMVOial9-K8Ran0jrF6Gtwa2Q-yjywCQpedKPuDmNve0j0L-Qg7n3482MaV_K1OnYirK9rsuppiQ-kK--tVM31QcRgZc"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-stack-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Cơ Sở Vật Chất Hiện Đại</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Chúng tôi đầu tư mạnh mẽ vào hạ tầng và trang thiết bị để tạo ra một không gian điều trị vô trùng, an toàn và thoải mái nhất cho khách hàng.
            </p>
            <ul className="space-y-stack-sm font-semibold">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <span className="text-body-lg font-body-lg">Phòng phẫu thuật vô trùng đạt chuẩn quốc tế</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <span className="text-body-lg font-body-lg">Hệ thống máy chụp CT Cone Beam 3D hiện đại nhất</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <span className="text-body-lg font-body-lg">Thiết bị lấy dấu hàm kỹ thuật số iTero 5D</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <span className="text-body-lg font-body-lg">Không gian chờ sang trọng, thư giãn và tiện nghi</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
