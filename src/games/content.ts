/**
 * Built-in game content. Everything a visitor can play without creating an
 * account lives here, so adding a new topic is a single edit to this file.
 */

export type Question = {
  prompt: string
  answers: string[]
  correctIndex: number
  /** Shown after answering, explains why the answer is right. */
  note?: string
}

export type QuizTopic = {
  slug: string
  title: string
  blurb: string
  questions: Question[]
}

export const quizTopics: QuizTopic[] = [
  {
    slug: 'tieng-anh',
    title: 'Tiếng Anh cơ bản',
    blurb: '10 câu từ vựng và mẫu câu thường gặp ở lớp 3 đến lớp 5.',
    questions: [
      {
        prompt: '"Con mèo" trong tiếng Anh là gì?',
        answers: ['Dog', 'Cat', 'Cow', 'Duck'],
        correctIndex: 1,
      },
      {
        prompt: 'Chọn câu chào buổi sáng đúng.',
        answers: ['Good night', 'Good morning', 'Good bye', 'Good luck'],
        correctIndex: 1,
      },
      {
        prompt: '"Thư viện" là nơi để làm gì?',
        answers: ['To swim', 'To read books', 'To cook', 'To sleep'],
        correctIndex: 1,
        note: 'Library là thư viện — nơi đọc và mượn sách.',
      },
      {
        prompt: 'Số 7 viết bằng tiếng Anh là:',
        answers: ['Six', 'Seven', 'Eight', 'Nine'],
        correctIndex: 1,
      },
      {
        prompt: 'Chọn từ chỉ màu sắc.',
        answers: ['Table', 'Yellow', 'Run', 'Happy'],
        correctIndex: 1,
      },
      {
        prompt: '"She ___ to school every day." Điền từ đúng.',
        answers: ['go', 'goes', 'going', 'gone'],
        correctIndex: 1,
        note: 'Chủ ngữ số ít (she) thì động từ thêm -es: goes.',
      },
      {
        prompt: '"Quả chuối" trong tiếng Anh là gì?',
        answers: ['Apple', 'Banana', 'Orange', 'Grape'],
        correctIndex: 1,
      },
      {
        prompt: 'Từ nào là tên một môn học?',
        answers: ['Kitchen', 'Maths', 'Shoes', 'Rainy'],
        correctIndex: 1,
      },
      {
        prompt: '"How old are you?" là câu hỏi về điều gì?',
        answers: ['Tên', 'Tuổi', 'Nơi ở', 'Sở thích'],
        correctIndex: 1,
      },
      {
        prompt: 'Chọn từ trái nghĩa với "hot".',
        answers: ['Warm', 'Cold', 'Big', 'Fast'],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'khoa-hoc',
    title: 'Khoa học quanh ta',
    blurb: 'Những câu hỏi về cơ thể, cây cối và Trái Đất.',
    questions: [
      {
        prompt: 'Cây xanh hút khí nào để quang hợp?',
        answers: ['Khí ô-xy', 'Khí các-bô-níc', 'Khí ni-tơ', 'Khí hi-đrô'],
        correctIndex: 1,
        note: 'Cây hút khí các-bô-níc và nhả ra khí ô-xy khi có ánh sáng.',
      },
      {
        prompt: 'Nước đóng băng ở nhiệt độ nào?',
        answers: ['10 độ C', '0 độ C', '50 độ C', '100 độ C'],
        correctIndex: 1,
      },
      {
        prompt: 'Bộ phận nào của cơ thể giúp ta bơm máu?',
        answers: ['Phổi', 'Tim', 'Gan', 'Dạ dày'],
        correctIndex: 1,
      },
      {
        prompt: 'Trái Đất quay quanh vật thể nào?',
        answers: ['Mặt Trăng', 'Mặt Trời', 'Sao Hỏa', 'Sao Kim'],
        correctIndex: 1,
      },
      {
        prompt: 'Loài vật nào sau đây là động vật lưỡng cư?',
        answers: ['Cá heo', 'Ếch', 'Chim sẻ', 'Thỏ'],
        correctIndex: 1,
        note: 'Ếch sống được cả trên cạn và trong nước nên là lưỡng cư.',
      },
      {
        prompt: 'Cầu vồng xuất hiện khi ánh sáng đi qua đâu?',
        answers: ['Đám mây đen', 'Những hạt nước nhỏ', 'Cát', 'Khói'],
        correctIndex: 1,
      },
      {
        prompt: 'Nam châm hút được vật liệu nào?',
        answers: ['Nhựa', 'Sắt', 'Gỗ', 'Thủy tinh'],
        correctIndex: 1,
      },
      {
        prompt: 'Một ngày trên Trái Đất dài bao nhiêu giờ?',
        answers: ['12 giờ', '24 giờ', '36 giờ', '48 giờ'],
        correctIndex: 1,
      },
      {
        prompt: 'Hành tinh nào gần Mặt Trời nhất?',
        answers: ['Sao Kim', 'Sao Thủy', 'Trái Đất', 'Sao Hỏa'],
        correctIndex: 1,
      },
      {
        prompt: 'Âm thanh truyền đi được nhờ đâu?',
        answers: ['Khoảng chân không', 'Sự rung động của không khí', 'Ánh sáng', 'Nhiệt độ'],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: 'dia-ly',
    title: 'Địa lý Việt Nam',
    blurb: 'Sông núi, thành phố và những vùng đất quen thuộc.',
    questions: [
      {
        prompt: 'Thủ đô của Việt Nam là thành phố nào?',
        answers: ['Đà Nẵng', 'Hà Nội', 'Huế', 'Cần Thơ'],
        correctIndex: 1,
      },
      {
        prompt: 'Đỉnh núi cao nhất Việt Nam là:',
        answers: ['Bà Đen', 'Phan Xi Păng', 'Bạch Mã', 'Lang Biang'],
        correctIndex: 1,
        note: 'Phan Xi Păng ở Lào Cai, cao 3.147 m.',
      },
      {
        prompt: 'Sông nào chảy qua đồng bằng Nam Bộ?',
        answers: ['Sông Hồng', 'Sông Mê Kông', 'Sông Mã', 'Sông Lô'],
        correctIndex: 1,
      },
      {
        prompt: 'Vịnh Hạ Long thuộc tỉnh nào?',
        answers: ['Hải Phòng', 'Quảng Ninh', 'Thái Bình', 'Nghệ An'],
        correctIndex: 1,
      },
      {
        prompt: 'Tỉnh nào nằm ở điểm cực Nam đất liền của Việt Nam?',
        answers: ['Kiên Giang', 'Cà Mau', 'Bạc Liêu', 'Sóc Trăng'],
        correctIndex: 1,
      },
      {
        prompt: 'Cao nguyên Đà Lạt nằm ở tỉnh nào?',
        answers: ['Đắk Lắk', 'Lâm Đồng', 'Gia Lai', 'Kon Tum'],
        correctIndex: 1,
      },
      {
        prompt: 'Việt Nam giáp với bao nhiêu quốc gia trên đất liền?',
        answers: ['2', '3', '4', '5'],
        correctIndex: 1,
        note: 'Việt Nam giáp Trung Quốc, Lào và Cam-pu-chia.',
      },
      {
        prompt: 'Đồng bằng sông Hồng nổi tiếng với cây trồng nào?',
        answers: ['Cà phê', 'Lúa nước', 'Cao su', 'Hồ tiêu'],
        correctIndex: 1,
      },
      {
        prompt: 'Thành phố nào được gọi là "thành phố hoa phượng đỏ"?',
        answers: ['Nha Trang', 'Hải Phòng', 'Vũng Tàu', 'Quy Nhơn'],
        correctIndex: 1,
      },
      {
        prompt: 'Hang Sơn Đoòng — hang động lớn nhất thế giới — ở tỉnh nào?',
        answers: ['Hà Giang', 'Quảng Bình', 'Ninh Bình', 'Thanh Hóa'],
        correctIndex: 1,
      },
    ],
  },
]

export function findQuizTopic(slug: string) {
  return quizTopics.find((topic) => topic.slug === slug)
}

/** Icon keys map to lucide components in MemoryGame. */
export type MemorySet = {
  slug: string
  title: string
  blurb: string
  pairs: { icon: string; label: string }[]
}

export const memorySets: MemorySet[] = [
  {
    slug: 'thien-nhien',
    title: 'Thiên nhiên',
    blurb: 'Cây cỏ, mặt trời và những con vật nhỏ.',
    pairs: [
      { icon: 'sun', label: 'Mặt trời' },
      { icon: 'cloud', label: 'Mây' },
      { icon: 'flower', label: 'Hoa' },
      { icon: 'tree', label: 'Cây' },
      { icon: 'fish', label: 'Cá' },
      { icon: 'bird', label: 'Chim' },
      { icon: 'snail', label: 'Ốc sên' },
      { icon: 'leaf', label: 'Lá' },
    ],
  },
  {
    slug: 'do-vat',
    title: 'Đồ vật quanh em',
    blurb: 'Những thứ em gặp mỗi ngày ở nhà và ở lớp.',
    pairs: [
      { icon: 'book', label: 'Sách' },
      { icon: 'pencil', label: 'Bút chì' },
      { icon: 'backpack', label: 'Ba lô' },
      { icon: 'clock', label: 'Đồng hồ' },
      { icon: 'bike', label: 'Xe đạp' },
      { icon: 'umbrella', label: 'Cái dù' },
      { icon: 'key', label: 'Chìa khóa' },
      { icon: 'lamp', label: 'Đèn bàn' },
    ],
  },
]

export function findMemorySet(slug: string) {
  return memorySets.find((set) => set.slug === slug)
}
