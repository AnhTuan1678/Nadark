const API_URL = 'https://api.example.com'

// Giả dữ liệu mẫu
const getStoryDetails = async (storyId) => {
  // Đợi 300ms
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: storyId,
    title: 'Sample Story',
    chapterCount: 20,
    urlAvatar:
      'https://p6-novel.byteimg.com/novel-pic/p2o37825e1ebc684e7b9d28ef1ad077c9b9~tplv-shrink:640:0.image',
    summary: 'This is a sample story summary.',
    like: 120,
    views: 4500,
    author: 'John Doe',
    publishedDate: '2023-01-01',
    status: 'Tạm ngưng',
    followers: 300,
    genres: [
      'Fantasy',
      'Adventure',
      'Action',
      'Drama',
      'Romance',
      'Comedy',
      'Horror',
      'Sci-fi',
      'Mystery'
    ],
  }
}

const getChapters = async (storyId) => {
  console.log('Fetching chapters for story ID:', storyId)
  // Đợi 300ms
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { chapterId: 1, index: 1, title: 'Chapter 1', releaseDate: '2023-01-02' },
    { chapterId: 2, index: 2, title: 'Chapter 2', releaseDate: '2023-01-03' },
    { chapterId: 3, index: 3, title: 'Chapter 3', releaseDate: '2023-01-04' },
    { chapterId: 4, index: 4, title: 'Chapter 4', releaseDate: '2023-01-05' },
    { chapterId: 5, index: 5, title: 'Chapter 5', releaseDate: '2023-01-06' },
    { chapterId: 6, index: 6, title: 'Chapter 6', releaseDate: '2023-01-07' },
    { chapterId: 7, index: 7, title: 'Chapter 7', releaseDate: '2023-01-08' },
    { chapterId: 8, index: 8, title: 'Chapter 8', releaseDate: '2023-01-09' },
    { chapterId: 9, index: 9, title: 'Chapter 9', releaseDate: '2023-01-10' },
    {
      chapterId: 10,
      index: 10,
      title: 'Chapter 10',
      releaseDate: '2023-01-11',
    },
    {
      chapterId: 11,
      index: 11,
      title: 'Chapter 11',
      releaseDate: '2023-01-12',
    },
    {
      chapterId: 12,
      index: 12,
      title:
        'Chapter 1adddarrrrrrrrrrrrrràddddddddddddddddddddddddrrrrrrrrrrq2',
      releaseDate: '2023-01-13',
    },
    {
      chapterId: 13,
      index: 13,
      title: 'Chapter 13',
      releaseDate: '2023-01-14',
    },
    {
      chapterId: 14,
      index: 14,
      title: 'Chapter 14',
      releaseDate: '2023-01-15',
    },
    {
      chapterId: 15,
      index: 15,
      title: 'Chapter 15',
      releaseDate: '2023-01-16',
    },
    {
      chapterId: 16,
      index: 16,
      title: 'Chapter 16',
      releaseDate: '2023-01-17',
    },
    {
      chapterId: 17,
      index: 17,
      title: 'Chapter 17',
      releaseDate: '2023-01-18',
    },
    {
      chapterId: 18,
      index: 18,
      title: 'Chapter 18',
      releaseDate: '2023-01-19',
    },
    {
      chapterId: 19,
      index: 19,
      title: 'Chapter 19',
      releaseDate: '2023-01-20',
    },
    {
      chapterId: 20,
      index: 20,
      title: 'Chapter 20',
      releaseDate: '2023-01-21',
    },
  ]
}

const getChapterContent = async (chapterId) => {
  // Giả dữ liệu nội dung chương
  return {
    chapterId,
    index: chapterId,
    title: `Chapter ${chapterId}`,
    releaseDate: '2023-01-02',
    content: `Nội dung chương ${chapterId}...
  
【 Cứ như vậy Mã Huy sống sót quay trở về Trà trang, mãi cho đến hoàng hôn buông xuống, các ngươi mới chủ động lên môn.】
【 “Lâm công tử, có thể bị ngài nói đúng, Đường có long quả thật có vấn đề!!” Mã Huy nhìn thấy ngươi sau, lập tức kích động nói.】
【 “A? Ngươi cẩn thận nói một chút!” 】
【 Mã Huy bưng lên trên bàn thủy, uống một hơi cạn sạch, lòng vẫn còn sợ hãi nói: “Ta từ khách sạn trở về Trà trang sau, vừa mới bắt đầu Đường có long cũng không có tại Trà trang, mà là tại sau nửa canh giờ mới trở về. Gặp qua ta trở về, hắn rõ ràng cả kinh, còn hỏi ta tại sao trở lại!
Lúc đó ta liền cấp nhãn, chẳng lẽ ta không trở lại, còn phải đi chết sao?
Hắn ánh mắt kia rõ ràng mang theo kinh ngạc, ta hỏi lại hắn đi cái nào, hắn lại ấp úng, nhưng ở nghe nói ta không thấy Đường Kỳ sau, còn ngược lại chỉ trích ta không phải.
Ta xem hắn chính là gặp ta không chết, vô cùng ngoài ý muốn, ra ngoài lâu như vậy làm không cẩn thận chính là gặp vị kia Độc Sư!
【 Mã Huy bô bô nói một tràng, cơ hồ có thể định tính vấn đề nằm ở chỗ Đường có trên thân rồng.】
【 Còn khẩn cầu ngươi mau chóng động thủ, đem hắn cho giết chết!】
【 Đối với cái này, chính ngươi cùng Mã Huy nói ra vòng thứ ba bắt sống Độc Sư kế hoạch, nhưng mà cần để cho hắn lấy thân làm mồi!】
【 Mã Huy nghe xong do dự, nhưng mà nghĩ đến chính mình kế tiếp còn phải trông cậy vào phủ thành chủ lấy thời gian qua, không đáp ứng cũng không được!】
【 Không liều mạng sẽ bị hại chết, liều chết lời còn có một chút hi vọng sống!】
【 Mã Huy dựa theo ngươi giao phó sau khi trở về, lập tức bắt đầu triệu tập còn lại hai vị huynh đệ tới thương lượng.】
【 “Huy ca xảy ra chuyện gì sao?” 】
【 “Ta và các ngươi nói, Đường có long có chút không bình thường, ta hoài nghi hắn đã bị người của phủ thành chủ cho kêu gọi đầu hàng.” Mã Huy thừa dịp Đường có Long Bất tại, bắt đầu lừa gạt những người còn lại.】
【 “Có lời gì các ngươi nói đi, lần này không thấy Đường Kỳ, cũng là bởi vì chỗ tối có người của phủ thành chủ nhìn chằm chằm. Các ngươi ngẫm lại xem, chúng ta từ tuần vệ ti phòng giam bên trong chạy đến, lâu như vậy cũng không có điều tra đến, sẽ có may mắn như vậy chuyện sao?
Cái này sau lưng khẳng định có người bán rẻ chúng ta, trên người của ta mang theo nhiệm vụ, liên quan đến chúng ta Thiên Ma Điện sinh tử, chính là bởi vì người của phủ thành chủ âm thầm theo dõi, mới đưa đến không thấy cái kia người liên hệ.
Mà cái này Đường có long, ba phen mấy bận ra ngoài, cực lớn xác suất chính là mật báo, làm không cẩn thận đêm nay liền phải dẫn tới người của phủ thành chủ trảo chúng ta.” 】
【 Lời nói này nói chuyện, trực tiếp cho hai người nói sợ hãi!】
【 “Huy ca ngươi kiểu nói này thật có khả năng, vậy chúng ta nên làm cái gì?” 】
【 “Theo ta thấy ở đây làm không cẩn thận Nhặt bảođã bị để mắt tới, việc cấp bách là mau chóng thay đổi vị trí!” 】
【 “Thế nhưng là chúng ta có thể đi nơi nào đâu, Vân Xuyên Thành ba chỗ cửa thành phong bế, chúng ta căn bản không có cơ hội chạy đi a!” Có người tuyệt vọng nói.】
【 nhưng nga, nhưng vào lúc này Đường có long trở về!】
【 Hắn sau khi trở về, thần thái sáng láng mở miệng nói: “Các huynh đệ, ta tìm được một cái mới chỗ, Trà trang bên này không phải rất an toàn, ta nghiêm trọng hoài nghi ở đây ra phản đồ, chúng ta tốt nhất hướng nơi khác thay đổi vị trí.” 】
【 “Đường lão đệ, lời này của ngươi là có ý gì? Trong chúng ta xuất hiện phản đồ, ngươi chỉ là ai?” 】
【 Đường có da rồng cười nhạt nói: “Lúc ta trở lại, thấy được mấy cái tuần vệ ti người giấu ở trà Trang Chu vây, phủ thành chủ đã để mắt tới ở đây. Mã huynh ngươi có thể bình yên vô sự từ khách sạn trở về, có hay không một loại khả năng, cũng đem phủ thành chủ con mắt cũng dẫn tới ở đây!” 】
【 Mặc dù mình chính là phản đồ, nhưng mà loại này tự dưng chỉ trích hắn cũng không thể tiếp nhận.】
【 Còn không đợi hắn mở miệng, người bên cạnh liền châm chọc khiêu khích nói: “Đường có long ngươi nói lời này lương tâm không có trở ngại sao, nếu không phải là Huy ca xuất thủ cứu giúp, chúng ta bây giờ còn tại tuần vệ ti trong địa lao, làm không cẩn thận đầu cũng đã dọn nhà.
Hơn nữa Huy ca trên thân còn có sư tôn lời nhắn nhủ nhiệm vụ, nếu là hắn có vấn đề, chúng ta có thể sống đến bây giờ?” 】
【 “Ngươi..... Các ngươi sao có thể nói như vậy!” Đường có mặt rồng sắc đột biến, âm thanh cất cao không thiếu, rõ ràng là gấp, “Ta hảo tâm cùng các ngươi nói chuyện này, bên ngoài ngược lại đã có người của phủ thành chủ, các ngươi thích đi hay không, ngược lại ta cũng không muốn trở về chịu chết!” 】
【 “Ha ha!” Mã Huy trong lòng cười lạnh, loại phép khích tướng này cũng không cảm thấy ngại nói ra miệng, thực sự là không có đầu óc, nếu không phải là Lâm công tử có sắp xếp, hắn cao thấp động thủ đem Đường có long giết chết.】
【 “Tốt lắm, chúng ta cùng ngươi đi..... Ngươi tốt nhất thực sự nói thật!” 】
【 “Huy ca.... Chúng ta?” Còn lại hai người không ngờ tới Mã Huy vậy mà đồng ý.】
【 “Không ngại! Chúng ta có ba người, không sợ hắn ra vẻ, cùng lắm thì cùng chết đi!” Mã Huy cười cười nói.】
【 Đường có long nhìn hắn nụ cười trong lòng có chút sợ, không biết thế nào sẽ có loại cảm giác này, nghĩ lại ngược lại có người thu thập bọn họ, chỉ cần bọn hắn chết, nhiệm vụ của hắn cũng sẽ hoàn thành.】
【 Một màn này tự nhiên toàn ở phủ thành chủ dưới sự theo dõi!】
【 Phùng Trạch hạ lệnh không cho phép đả thảo kinh xà, đi theo cước bộ của bọn hắn, rất nhanh là đến thành nam một chỗ dân túc đại viện, đó là một mảnh Dân thành, cư trú phần lớn cũng là người bình thường.】
【 Qua một hồi, bên trong truyền đến tiếng cãi vã.】
【 “Lâm tiểu hữu, có chút ra ngoài ý định a, Độc Sư không có hiện thân, chẳng lẽ ngay tại trong nội viện chờ lấy bọn hắn?” 】
【 Ngươi ánh mắt ngưng lại, đột nhiên mở miệng nói: “Phùng thành chủ có thể hạ lệnh động thủ, Độc Sư liền tại bên trong!” 】
【 Ra lệnh một tiếng, giấu ở chỗ tối tuần vệ ti giáp sĩ dốc toàn bộ lực lượng, trong nháy mắt đem đất đai cực kỳ rộng lớn đại viện bao vây đứng lên, đồng thời phá cửa mà vào.】
`,
  }
}

export { API_URL, getStoryDetails, getChapters, getChapterContent }
