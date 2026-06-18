export interface DoctorProfileDetail {
  specialty: string;
  degree: string;
  education: string[];
  experience: number;
  cases: string;
  clinicalStrengths: string[];
  certifications: string[];
  universityLogo: string;
  bio: string;
  motto: string;
  workHistory: string[];
}

export const DOCTOR_PROFILES: Record<string, DoctorProfileDetail> = {
  'D-01': {
    specialty: 'Trưởng khoa Bảo tồn & Vi Phẫu răng',
    degree: 'Thạc Sĩ - Bác Sĩ',
    education: [
      'Thạc sĩ Răng Hàm Mặt, Đại học Y Dược TP.HCM',
      'Tu nghiệp Nội nha chuyên sâu, Đại học Pennsylvania (Hoa Kỳ)',
      'Chứng chỉ điều trị vi phẫu nội nha nâng cao tại Singapore'
    ],
    experience: 12,
    cases: '8,500+',
    clinicalStrengths: [
      'Điều trị tủy răng phức tạp dưới kính hiển vi',
      'Vi phẫu cuống răng và phục hồi cuống răng tổn thương',
      'Tái tạo răng thẩm mỹ sau điều trị tủy'
    ],
    certifications: [
      'Hội viên chính thức Hiệp hội Nội nha Hoa Kỳ (AAE)',
      'Chứng nhận giảng viên vi phẫu nha khoa khu vực Đông Nam Á',
      'Hội viên Hội Răng Hàm Mặt Việt Nam (VOSA)'
    ],
    universityLogo: 'school',
    bio: 'Bác sĩ Lê Minh là chuyên gia hàng đầu về nội nha và vi phẫu tại GoodSmile. Với hơn 12 năm kinh nghiệm thực tiễn và tinh thần tỉ mỉ, bác sĩ đã cứu giữ thành công hàng ngàn chiếc răng tự nhiên cho khách hàng, hạn chế tối đa việc phải nhổ bỏ.',
    motto: 'Bảo tồn răng thật của bệnh nhân là sứ mệnh tối cao của một người bác sĩ nha khoa y đức.',
    workHistory: [
      '2014 - 2018: Bác sĩ điều trị Nội nha tại Bệnh viện Răng Hàm Mặt Trung ương TP.HCM',
      '2018 - 2022: Giảng viên lâm sàng Khoa Răng Hàm Mặt, Đại học Y Dược TP.HCM',
      '2022 - Nay: Trưởng khoa Bảo tồn & Vi Phẫu răng tại Hệ thống Nha khoa GoodSmile'
    ]
  },
  'D-02': {
    specialty: 'Giám đốc Phẫu thuật Hàm Mặt & Cấy ghép Implant',
    degree: 'Bác sĩ Chuyên Khoa II',
    education: [
      'Bác sĩ Chuyên khoa II Phẫu thuật Hàm mặt, ĐH Y Hà Nội',
      'Tu nghiệp chuyên sâu Cấy ghép Implant, Đại học Bordeaux (Pháp)',
      'Chứng chỉ cấy ghép xương hàm và nâng xoang nâng cao tại Thụy Sĩ'
    ],
    experience: 15,
    cases: '5,200+',
    clinicalStrengths: [
      'Cấy ghép Implant tức thì All-on-4 và All-on-6 cho người mất răng toàn hàm',
      'Phẫu thuật nhổ răng khôn ngầm bằng công nghệ siêu âm Piezotome không đau',
      'Ghép xương tự thân, nâng xoang kín và xoang hở trong cấy ghép Implant phức tạp'
    ],
    certifications: [
      'Thành viên chính thức Hiệp hội Implant Quốc tế (ITI Fellow)',
      'Chuyên gia cố vấn lâm sàng khu vực Châu Á - Thái Bình Dương của Straumann (Thụy Sĩ)',
      'Chứng chỉ Phẫu thuật hàm mặt chuyên sâu cấp bởi Bộ Y Tế Pháp'
    ],
    universityLogo: 'account_balance',
    bio: 'Bác sĩ Hoàng Nam được mệnh danh là "bàn tay vàng" trong lĩnh vực cấy ghép Implant tại Việt Nam. Bác sĩ luôn áp dụng các công nghệ kỹ thuật số hiện đại nhất giúp giảm thiểu sưng đau, rút ngắn thời gian lành thương tối đa cho bệnh nhân.',
    motto: 'Một ca phẫu thuật thành công không chỉ dựa trên kỹ thuật chính xác, mà còn ở sự thấu hiểu và an tâm của người bệnh.',
    workHistory: [
      '2011 - 2016: Bác sĩ Phẫu thuật hàm mặt tại Bệnh viện Hữu nghị Việt Đức',
      '2016 - 2021: Trưởng khoa Phẫu thuật cấy ghép nha khoa tại Bệnh viện Răng Hàm Mặt Quốc tế',
      '2021 - Nay: Giám đốc Phẫu thuật Hàm Mặt & Cấy ghép Implant tại Hệ thống Nha khoa GoodSmile'
    ]
  },
  'D-03': {
    specialty: 'Trưởng bộ phận Phục Hình Thẩm Mỹ & Thiết kế nụ cười',
    degree: 'Bác sĩ Chuyên Khoa I',
    education: [
      'Bác sĩ Răng Hàm Mặt, Đại học Y Dược Hải Phòng',
      'Tốt nghiệp chương trình đào tạo Nha khoa Thẩm mỹ Châu Á (AACD)',
      'Khóa đào tạo chuyên gia thiết kế nụ cười kỹ thuật số (DSD) tại Tokyo (Nhật Bản)'
    ],
    experience: 8,
    cases: '4,100+',
    clinicalStrengths: [
      'Thiết kế và dán sứ Veneer siêu mỏng Emax hạn chế tối đa mài răng thật',
      'Phục hình răng sứ thẩm mỹ CAD/CAM nguyên khối tự nhiên',
      'Thiết kế nụ cười toàn diện Digital Smile Design chuẩn nhân tướng học'
    ],
    certifications: [
      'Hội viên Hiệp hội Nha khoa Thẩm mỹ Hoa Kỳ (AACD)',
      'Chứng nhận chuyên gia DSD Master Quốc tế',
      'Thành viên Hiệp hội Nha khoa Thẩm mỹ Châu Á (AAAD)'
    ],
    universityLogo: 'local_library',
    bio: 'Bác sĩ Mai Lan là người mang lại nụ cười rạng rỡ và tự tin cho hàng ngàn khách hàng, bao gồm nhiều nghệ sĩ và doanh nhân nổi tiếng. Bác sĩ kết hợp hoàn hảo giữa kiến thức y khoa chuẩn mực và mắt thẩm mỹ tinh tế nghệ thuật.',
    motto: 'Mỗi nụ cười là một tác phẩm nghệ thuật độc bản. Bác sĩ nha khoa thẩm mỹ là một nghệ sĩ y khoa.',
    workHistory: [
      '2018 - 2020: Bác sĩ Phục hình răng tại Nha khoa Quốc tế Elite',
      '2020 - 2023: Chuyên gia phục hình thẩm mỹ cao cấp tại Nha khoa Paris',
      '2023 - Nay: Trưởng bộ phận Phục Hình Thẩm Mỹ & Thiết kế nụ cười tại Hệ thống Nha khoa GoodSmile'
    ]
  },
  'D-04': {
    specialty: 'Cố vấn Chỉnh Nha & Chỉnh hình Răng Mặt',
    degree: 'Thạc Sĩ - Bác Sĩ',
    education: [
      'Thạc sĩ Chỉnh nha chuyên sâu, Đại học Nha khoa Quốc gia Seoul (Hàn Quốc)',
      'Chứng chỉ Chỉnh nha tăng trưởng chuyên sâu Biomechanics, ĐH Sydney (Úc)',
      'Chứng chỉ chuyên gia Invisalign toàn cầu cấp bởi Align Technology (Hoa Kỳ)'
    ],
    experience: 10,
    cases: '6,300+',
    clinicalStrengths: [
      'Chỉnh nha chuyên sâu Invisalign (Niềng răng trong suốt) độ khó cao',
      'Chỉnh nha mắc cài tự buộc kết hợp minivis giải quyết hô/móm nặng không phẫu thuật',
      'Chỉnh nha tăng trưởng cho trẻ em từ sớm giúp định hình xương hàm cân đối'
    ],
    certifications: [
      'Hội viên danh dự Hội Chỉnh nha Thế giới (WFO)',
      'Bác sĩ hạng Diamond Provider của Invisalign toàn cầu',
      'Thành viên Hiệp hội Chỉnh nha Không mắc cài Châu Âu (EAS)'
    ],
    universityLogo: 'public',
    bio: 'Bác sĩ Nguyễn Hương tốt nghiệp xuất sắc khóa đào tạo Chỉnh nha tại Hàn Quốc và có nhiều năm nghiên cứu sâu về cơ học chỉnh răng. Bác sĩ nổi tiếng với khả năng lập phác đồ di chuyển răng tối ưu, an toàn, không đau và rút ngắn thời gian niềng lên tới 6 tháng.',
    motto: 'Chỉnh nha không chỉ làm đều răng, mà là tái cấu trúc nụ cười và cải thiện chất lượng sống của bệnh nhân.',
    workHistory: [
      '2016 - 2019: Bác sĩ Chỉnh nha tại Bệnh viện Nha khoa Đại học Quốc gia Seoul (Hàn Quốc)',
      '2019 - 2022: Chuyên gia chỉnh nha cấp cao tại Trung tâm Chỉnh nha Chuyên sâu GoodDental',
      '2022 - Nay: Cố vấn Chỉnh Nha & Chỉnh hình Răng Mặt tại Hệ thống Nha khoa GoodSmile'
    ]
  }
};
