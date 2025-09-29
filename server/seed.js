const mongoose = require('mongoose');
const Plant = require('./models/Plant');
require('dotenv').config();

// Dữ liệu mẫu 50 plants
const samplePlants = [
  {
    name: "Cây Lan Hồ Điệp",
    scientificName: "Phalaenopsis amabilis",
    description: "Lan hồ điệp là loài hoa lan nổi tiếng với vẻ đẹp tinh tế và dễ trồng. Hoa có nhiều màu sắc khác nhau và có thể nở quanh năm.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, đặc biệt là Việt Nam",
    characteristics: "Lá dày, hoa lớn dạng cánh bướm, có nhiều màu sắc",
    uses: "Trang trí nội thất, quà tặng, nghiên cứu khoa học",
    family: "Orchidaceae",
    habitat: "Rừng nhiệt đới",
    growthConditions: "Ánh sáng gián tiếp, độ ẩm cao, nhiệt độ 20-30°C"
  },
  {
    name: "Cây Mai Vàng",
    scientificName: "Ochna integerrima",
    description: "Cây mai vàng là biểu tượng của mùa xuân Việt Nam với những bông hoa vàng rực rỡ. Cây có ý nghĩa văn hóa sâu sắc.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
    distribution: "Việt Nam, Trung Quốc, Ấn Độ",
    characteristics: "Lá xanh bóng, hoa vàng, quả đỏ tươi",
    uses: "Trang trí, biểu tượng văn hóa, làm cảnh",
    family: "Ochnaceae",
    habitat: "Rừng nhiệt đới",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước tốt"
  },
  {
    name: "Cây Bàng Singapore",
    scientificName: "Heritiera littoralis",
    description: "Cây bàng Singapore là biểu tượng của thành phố Singapore với tán lá xanh mát và khả năng chịu gió biển tốt.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, ven biển",
    characteristics: "Lá dày, vỏ cây xám, chịu gió biển tốt",
    uses: "Trang trí đô thị, chắn gió, làm cảnh",
    family: "Malvaceae",
    habitat: "Vùng ven biển",
    growthConditions: "Chịu mặn, ánh sáng đầy đủ"
  },
  {
    name: "Cây Cọ Dầu",
    scientificName: "Elaeis guineensis",
    description: "Cây cọ dầu là nguồn cung cấp dầu cọ quan trọng trên thế giới, được trồng phổ biến ở các nước nhiệt đới.",
    image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop",
    distribution: "Tây Phi, Đông Nam Á",
    characteristics: "Lá lớn hình quạt, quả chùm màu đỏ",
    uses: "Sản xuất dầu thực phẩm, dầu công nghiệp",
    family: "Arecaceae",
    habitat: "Đồng bằng nhiệt đới",
    growthConditions: "Nhiệt độ cao, độ ẩm lớn"
  },
  {
    name: "Cây Đa Búp Đỏ",
    scientificName: "Ficus benjamina",
    description: "Cây đa búp đỏ có lá màu đỏ hồng khi non, rất đẹp mắt. Là loại cây cảnh phổ biến trong nhà.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop",
    distribution: "Nam Á, Đông Nam Á",
    characteristics: "Lá non màu đỏ, lá già xanh, thân mảnh",
    uses: "Cây cảnh nội thất, bonsai",
    family: "Moraceae",
    habitat: "Rừng nhiệt đới",
    growthConditions: "Ánh sáng gián tiếp, độ ẩm cao"
  },
  {
    name: "Cây Trầu Bà",
    scientificName: "Piper betle",
    description: "Cây trầu bà là loại cây dây leo, lá được dùng để gói trầu. Có ý nghĩa văn hóa trong các nước Đông Nam Á.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Ấn Độ",
    characteristics: "Lá xanh bóng, thân leo, hoa nhỏ",
    uses: "Gói trầu, thuốc dân gian, gia vị",
    family: "Piperaceae",
    habitat: "Rừng ẩm",
    growthConditions: "Bóng râm, độ ẩm cao"
  },
  {
    name: "Cây Bồ Đề",
    scientificName: "Ficus religiosa",
    description: "Cây bồ đề là cây thiêng trong Phật giáo, nơi Đức Phật thành đạo. Lá hình trái tim đặc trưng.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Ấn Độ, Đông Nam Á",
    characteristics: "Lá hình trái tim, vỏ cây xám nhẵn",
    uses: "Tôn giáo, trang trí, làm thuốc",
    family: "Moraceae",
    habitat: "Rừng khô",
    growthConditions: "Ánh sáng đầy đủ, chịu khô hạn"
  },
  {
    name: "Cây Xanh Thủy Tùng",
    scientificName: "Cupressus sempervirens",
    description: "Cây thủy tùng xanh có hình dáng đẹp, lá nhỏ xanh quanh năm. Thường được trồng làm hàng rào hoặc cây cảnh.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Địa Trung Hải, trồng khắp nơi",
    characteristics: "Lá nhỏ xanh, hình dáng cột",
    uses: "Trang trí, hàng rào, gỗ xây dựng",
    family: "Cupressaceae",
    habitat: "Vùng ôn đới",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Dừa",
    scientificName: "Cocos nucifera",
    description: "Cây dừa là biểu tượng của vùng nhiệt đới, cung cấp nhiều sản phẩm quý giá như nước dừa, cơm dừa, dầu dừa.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Các nước nhiệt đới ven biển",
    characteristics: "Thân cao, lá lớn, quả dừa",
    uses: "Thực phẩm, đồ uống, dầu, vật liệu",
    family: "Arecaceae",
    habitat: "Biển nhiệt đới",
    growthConditions: "Chịu mặn, gió biển"
  },
  {
    name: "Cây Cau",
    scientificName: "Areca catechu",
    description: "Cây cau có quả dùng để nhai trầu, là loại cây kinh tế quan trọng ở Việt Nam và nhiều nước Đông Nam Á.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Ấn Độ",
    characteristics: "Thân thẳng, lá lớn, quả đỏ",
    uses: "Nhai trầu, gỗ, trang trí",
    family: "Arecaceae",
    habitat: "Đồng bằng",
    growthConditions: "Nhiệt độ cao, độ ẩm lớn"
  },
  {
    name: "Cây Bưởi",
    scientificName: "Citrus maxima",
    description: "Cây bưởi cho quả lớn, vị ngọt thanh. Là loại cây ăn quả phổ biến ở Việt Nam, đặc biệt là bưởi da xanh.",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Trung Quốc",
    characteristics: "Lá xanh, hoa trắng, quả lớn",
    uses: "Thực phẩm, nước uống, tinh dầu",
    family: "Rutaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Mít",
    scientificName: "Artocarpus heterophyllus",
    description: "Cây mít cho quả lớn với nhiều múi vàng thơm ngon. Cây có tán rộng, lá lớn, rất phổ biến ở vùng nhiệt đới.",
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Ấn Độ",
    characteristics: "Lá lớn, quả gai, múi vàng",
    uses: "Thực phẩm, gỗ, thuốc",
    family: "Moraceae",
    habitat: "Đồng bằng nhiệt đới",
    growthConditions: "Nhiệt độ cao, đất thoát nước"
  },
  {
    name: "Cây Sầu Riêng",
    scientificName: "Durio zibethinus",
    description: "Cây sầu riêng cho quả có mùi đặc trưng, được gọi là 'vua của các loại trái cây'. Rất được ưa chuộng ở Đông Nam Á.",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Lá lớn, quả gai, múi vàng",
    uses: "Thực phẩm, xuất khẩu",
    family: "Malvaceae",
    habitat: "Đồng bằng",
    growthConditions: "Nhiệt độ cao, độ ẩm lớn"
  },
  {
    name: "Cây Măng Cụt",
    scientificName: "Garcinia mangostana",
    description: "Cây măng cụt cho quả tròn nhỏ với múi trắng thơm ngon. Được gọi là 'nữ hoàng của các loại trái cây'.",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Lá xanh bóng, quả tròn, múi trắng",
    uses: "Thực phẩm, thuốc, xuất khẩu",
    family: "Clusiaceae",
    habitat: "Đồng bằng",
    growthConditions: "Bóng râm, đất màu mỡ"
  },
  {
    name: "Cây Vú Sữa",
    scientificName: "Calotropis gigantea",
    description: "Cây vú sữa có hoa màu tím hồng đẹp mắt, lá dày. Thường mọc hoang ở vùng nhiệt đới.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    distribution: "Châu Á nhiệt đới",
    characteristics: "Lá dày, hoa màu tím, quả dạng hộp",
    uses: "Thuốc dân gian, làm keo",
    family: "Apocynaceae",
    habitat: "Đồng cỏ, ven đường",
    growthConditions: "Chịu khô hạn, đất nghèo"
  },
  {
    name: "Cây Bông Gòn",
    scientificName: "Gossypium hirsutum",
    description: "Cây bông gòn cung cấp sợi bông để sản xuất vải. Là loại cây công nghiệp quan trọng trên thế giới.",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    distribution: "Các nước nhiệt đới và ôn đới",
    characteristics: "Lá hình tay, hoa vàng, quả bông",
    uses: "Sản xuất vải, dầu",
    family: "Malvaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Cà Phê",
    scientificName: "Coffea arabica",
    description: "Cây cà phê cung cấp hạt cà phê nổi tiếng thế giới. Việt Nam là nước xuất khẩu cà phê lớn.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    distribution: "Châu Phi, châu Á",
    characteristics: "Lá xanh bóng, quả đỏ, hạt cà phê",
    uses: "Đồ uống, thực phẩm",
    family: "Rubiaceae",
    habitat: "Đồi núi",
    growthConditions: "Bóng râm, đất màu mỡ"
  },
  {
    name: "Cây Điều",
    scientificName: "Anacardium occidentale",
    description: "Cây điều cung cấp hạt điều dùng làm thức ăn. Việt Nam là nước sản xuất điều lớn nhất thế giới.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Ấn Độ",
    characteristics: "Thân nhỏ, lá lớn, quả điều",
    uses: "Thực phẩm, dầu công nghiệp",
    family: "Anacardiaceae",
    habitat: "Đồng bằng khô",
    growthConditions: "Chịu khô hạn, đất cát"
  },
  {
    name: "Cây Tiêu",
    scientificName: "Piper nigrum",
    description: "Cây tiêu cung cấp hạt tiêu đen nổi tiếng. Việt Nam là nước xuất khẩu tiêu lớn nhất thế giới.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, Ấn Độ",
    characteristics: "Thân leo, lá xanh, quả nhỏ",
    uses: "Gia vị, thuốc, xuất khẩu",
    family: "Piperaceae",
    habitat: "Rừng ẩm",
    growthConditions: "Bóng râm, độ ẩm cao"
  },
  {
    name: "Cây Gừng",
    scientificName: "Zingiber officinale",
    description: "Cây gừng có củ dùng làm gia vị và thuốc. Có tác dụng chống viêm, giảm đau, tốt cho tiêu hóa.",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf09ae?w=400&h=300&fit=crop",
    distribution: "Châu Á nhiệt đới",
    characteristics: "Lá dài, hoa vàng, củ gừng",
    uses: "Gia vị, thuốc, thực phẩm",
    family: "Zingiberaceae",
    habitat: "Đồng bằng ẩm",
    growthConditions: "Bóng râm, đất thoát nước"
  },
  {
    name: "Cây Sả",
    scientificName: "Cymbopogon citratus",
    description: "Cây sả có lá dùng làm gia vị và trà. Có mùi thơm đặc trưng và tác dụng tốt cho sức khỏe.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á, châu Phi",
    characteristics: "Lá dài mỏng, mùi thơm",
    uses: "Gia vị, trà, thuốc",
    family: "Poaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Húng Quế",
    scientificName: "Ocimum basilicum",
    description: "Cây húng quế có lá thơm dùng làm gia vị trong nấu ăn. Có nhiều loại khác nhau với mùi vị đặc trưng.",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf09ae?w=400&h=300&fit=crop",
    distribution: "Châu Á, châu Phi",
    characteristics: "Lá xanh, hoa trắng tím, mùi thơm",
    uses: "Gia vị, thuốc, tinh dầu",
    family: "Lamiaceae",
    habitat: "Vườn nhà",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Rau Má",
    scientificName: "Centella asiatica",
    description: "Cây rau má là loại rau sống phổ biến ở Việt Nam. Có tác dụng thanh nhiệt, giải độc, tốt cho da.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Châu Á, châu Phi",
    characteristics: "Lá tròn, thân mọc sát đất",
    uses: "Rau ăn sống, thuốc",
    family: "Apiaceae",
    habitat: "Đất ẩm",
    growthConditions: "Bóng râm, độ ẩm cao"
  },
  {
    name: "Cây Cỏ ngọt",
    scientificName: "Stevia rebaudiana",
    description: "Cây cỏ ngọt chứa chất ngọt tự nhiên, được dùng thay thế đường cho người tiểu đường.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá nhỏ, hoa trắng, vị ngọt",
    uses: "Chất ngọt tự nhiên, thuốc",
    family: "Asteraceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Atiso",
    scientificName: "Cynara scolymus",
    description: "Cây atiso có hoa lớn màu tím đẹp mắt. Hoa và lá được dùng làm thuốc và thực phẩm.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Địa Trung Hải, trồng khắp nơi",
    characteristics: "Lá lớn xẻ thùy, hoa tím lớn",
    uses: "Thực phẩm, thuốc, trang trí",
    family: "Asteraceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Cải Thảo",
    scientificName: "Brassica oleracea",
    description: "Cây cải thảo có lá xanh dùng làm rau ăn. Là loại rau phổ biến trong ẩm thực Việt Nam.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Châu Âu, trồng khắp nơi",
    characteristics: "Lá xanh lớn, hoa vàng",
    uses: "Rau ăn, thực phẩm",
    family: "Brassicaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Cà Rốt",
    scientificName: "Daucus carota",
    description: "Cây cà rốt có củ màu cam giàu vitamin A. Là loại rau phổ biến trên thế giới.",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
    distribution: "Châu Á, châu Âu",
    characteristics: "Lá xanh, củ cam dài",
    uses: "Thực phẩm, vitamin A",
    family: "Apiaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất cát"
  },
  {
    name: "Cây Khoai Tây",
    scientificName: "Solanum tuberosum",
    description: "Cây khoai tây có củ giàu tinh bột, là lương thực quan trọng trên thế giới.",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá xanh, củ dưới đất",
    uses: "Thực phẩm, tinh bột",
    family: "Solanaceae",
    habitat: "Đồi núi",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Ớt",
    scientificName: "Capsicum annuum",
    description: "Cây ớt có quả cay dùng làm gia vị. Có nhiều loại ớt khác nhau với độ cay khác nhau.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá xanh, quả nhiều màu",
    uses: "Gia vị, thực phẩm",
    family: "Solanaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Cà Chua",
    scientificName: "Solanum lycopersicum",
    description: "Cây cà chua có quả đỏ dùng làm rau ăn. Là loại rau phổ biến trong nấu ăn.",
    image: "https://images.unsplash.com/photo-1546470427-e9e85214c3b0?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá xanh, quả tròn đỏ",
    uses: "Thực phẩm, nước uống",
    family: "Solanaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Dưa Leo",
    scientificName: "Cucumis sativus",
    description: "Cây dưa leo có quả dài xanh dùng làm rau ăn sống. Thường dùng trong salad.",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
    distribution: "Ấn Độ, trồng khắp nơi",
    characteristics: "Lá xanh, quả dài xanh",
    uses: "Rau ăn sống, thực phẩm",
    family: "Cucurbitaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Bí Đao",
    scientificName: "Cucurbita ficifolia",
    description: "Cây bí đao có quả lớn dùng làm thực phẩm. Quả có thể ăn được cả khi còn xanh và chín.",
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá lớn, quả dài",
    uses: "Thực phẩm, nấu ăn",
    family: "Cucurbitaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Bầu",
    scientificName: "Lagenaria siceraria",
    description: "Cây bầu có quả dùng làm thực phẩm và đồ dùng. Quả có hình dạng đặc trưng.",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    distribution: "Châu Phi, châu Á",
    characteristics: "Lá xanh, quả hình bầu dục",
    uses: "Thực phẩm, đồ dùng",
    family: "Cucurbitaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Mướp Đắng",
    scientificName: "Momordica charantia",
    description: "Cây mướp đắng có quả xanh dùng làm rau. Có vị đắng đặc trưng và tác dụng tốt cho sức khỏe.",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&h=300&fit=crop",
    distribution: "Châu Á nhiệt đới",
    characteristics: "Lá xanh, quả hình ngôi sao",
    uses: "Rau ăn, thuốc",
    family: "Cucurbitaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Rau Muống",
    scientificName: "Ipomoea aquatica",
    description: "Cây rau muống là loại rau phổ biến ở Việt Nam. Thân và lá dùng làm thực phẩm.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Thân mọc nổi, lá xanh",
    uses: "Rau ăn, thực phẩm",
    family: "Convolvulaceae",
    habitat: "Ao hồ, ruộng nước",
    growthConditions: "Nước, ánh sáng đầy đủ"
  },
  {
    name: "Cây Bông Bí",
    scientificName: "Hibiscus rosa-sinensis",
    description: "Cây bông bí có hoa lớn nhiều màu sắc. Là loại cây cảnh phổ biến ở Việt Nam.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=300&fit=crop",
    distribution: "Châu Á nhiệt đới",
    characteristics: "Lá xanh, hoa lớn nhiều màu",
    uses: "Trang trí, làm thuốc",
    family: "Malvaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Mai Đỏ",
    scientificName: "Plumeria rubra",
    description: "Cây mai đỏ có hoa thơm đẹp, là biểu tượng của vùng nhiệt đới. Hoa có mùi hương quyến rũ.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá xanh, hoa đỏ hồng thơm",
    uses: "Trang trí, hoa, tinh dầu",
    family: "Apocynaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Bạch Đàn",
    scientificName: "Plumeria obtusa",
    description: "Cây bạch đàn có hoa trắng tinh khôi. Là loại cây cảnh phổ biến ở các vùng nhiệt đới.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=300&fit=crop",
    distribution: "Caribe, trồng khắp nơi",
    characteristics: "Lá xanh, hoa trắng thơm",
    uses: "Trang trí, hoa, tinh dầu",
    family: "Apocynaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Cẩm Nhung",
    scientificName: "Hibiscus mutabilis",
    description: "Cây cẩm nhung có hoa thay đổi màu từ trắng sang hồng. Hoa nở về chiều tối rất đẹp.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
    distribution: "Trung Quốc, Việt Nam",
    characteristics: "Lá xanh, hoa thay đổi màu",
    uses: "Trang trí, hoa",
    family: "Malvaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Dừa Cạn",
    scientificName: "Nypa fruticans",
    description: "Cây dừa cạn mọc ở vùng ngập mặn, lá dùng lợp nhà. Là loại cây đặc trưng của vùng đồng bằng sông Cửu Long.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Thân ngắn, lá quạt lớn",
    uses: "Lợp nhà, làm đường",
    family: "Arecaceae",
    habitat: "Vùng ngập mặn",
    growthConditions: "Chịu mặn, nước"
  },
  {
    name: "Cây Bần",
    scientificName: "Avicennia marina",
    description: "Cây bần là loại cây chịu mặn, giúp chống xói lở bờ biển. Rễ cây có tác dụng lọc nước.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Ven biển nhiệt đới",
    characteristics: "Rễ thở, lá dày, hoa nhỏ",
    uses: "Chống xói lở, lọc nước",
    family: "Acanthaceae",
    habitat: "Vùng ven biển",
    growthConditions: "Chịu mặn, đất lầy"
  },
  {
    name: "Cây Đước",
    scientificName: "Rhizophora apiculata",
    description: "Cây đước có rễ cọc giúp chống xói lở và tạo môi trường sống cho thủy hải sản.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Rễ cọc, lá dày, hoa nhỏ",
    uses: "Chống xói lở, bảo vệ môi trường",
    family: "Rhizophoraceae",
    habitat: "Vùng ngập mặn",
    growthConditions: "Chịu mặn, nước"
  },
  {
    name: "Cây Vẹt",
    scientificName: "Strombosia javanica",
    description: "Cây vẹt có gỗ quý, lá xanh bóng. Thường được trồng làm cây bóng mát.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Lá xanh bóng, gỗ quý",
    uses: "Gỗ, trang trí",
    family: "Olacaceae",
    habitat: "Rừng nhiệt đới",
    growthConditions: "Bóng râm, đất màu mỡ"
  },
  {
    name: "Cây Giổi",
    scientificName: "Cinnamomum cassia",
    description: "Cây quế cung cấp vỏ quế dùng làm gia vị. Việt Nam là nước xuất khẩu quế lớn.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Lá xanh, vỏ thơm",
    uses: "Gia vị, thuốc, tinh dầu",
    family: "Lauraceae",
    habitat: "Đồi núi",
    growthConditions: "Bóng râm, đất màu mỡ"
  },
  {
    name: "Cây Long Não",
    scientificName: "Cinnamomum camphora",
    description: "Cây long não cung cấp tinh dầu long não. Cây có tán rộng, lá xanh quanh năm.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Đông Á",
    characteristics: "Lá xanh bóng, gỗ thơm",
    uses: "Tinh dầu, gỗ, thuốc",
    family: "Lauraceae",
    habitat: "Đồi núi",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Hồi",
    scientificName: "Illicium verum",
    description: "Cây hồi cung cấp hạt hồi dùng làm gia vị. Có mùi thơm đặc trưng.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    distribution: "Trung Quốc, Việt Nam",
    characteristics: "Lá xanh, hoa nhỏ, quả hình sao",
    uses: "Gia vị, thuốc",
    family: "Schisandraceae",
    habitat: "Đồi núi",
    growthConditions: "Bóng râm, độ ẩm cao"
  },
  {
    name: "Cây Bạch Dương",
    scientificName: "Betula pendula",
    description: "Cây bạch dương có vỏ trắng đặc trưng, lá nhỏ. Thường mọc ở vùng ôn đới.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Châu Âu, châu Á",
    characteristics: "Vỏ trắng, lá nhỏ",
    uses: "Gỗ, trang trí",
    family: "Betulaceae",
    habitat: "Rừng ôn đới",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Thông",
    scientificName: "Pinus sylvestris",
    description: "Cây thông có lá kim xanh quanh năm, quả hình nón. Là loại cây biểu tượng của mùa Giáng sinh.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Châu Âu, châu Á",
    characteristics: "Lá kim, quả nón",
    uses: "Gỗ, trang trí, tinh dầu",
    family: "Pinaceae",
    habitat: "Đồi núi",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Bách Xanh",
    scientificName: "Juniperus chinensis",
    description: "Cây bách xanh có lá nhỏ xanh quanh năm, hình dáng đẹp. Thường được trồng làm bonsai.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Đông Á",
    characteristics: "Lá nhỏ xanh, quả nhỏ",
    uses: "Trang trí, bonsai",
    family: "Cupressaceae",
    habitat: "Đồi núi",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  },
  {
    name: "Cây Tùng La Hán",
    scientificName: "Podocarpus macrophyllus",
    description: "Cây tùng la hán có lá dày xanh bóng, rất bền. Thường được trồng làm cây cảnh.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    distribution: "Đông Á",
    characteristics: "Lá dày xanh, quả đỏ",
    uses: "Trang trí, gỗ",
    family: "Podocarpaceae",
    habitat: "Đồi núi",
    growthConditions: "Bóng râm, đất màu mỡ"
  },
  {
    name: "Cây Phát Tài",
    scientificName: "Crassula ovata",
    description: "Cây phát tài có lá dày tròn, dễ trồng. Là loại cây cảnh tượng trưng cho sự giàu có.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    distribution: "Nam Phi, trồng khắp nơi",
    characteristics: "Lá dày tròn, hoa nhỏ",
    uses: "Cây cảnh, tượng trưng",
    family: "Crassulaceae",
    habitat: "Sa mạc",
    growthConditions: "Ánh sáng đầy đủ, ít nước"
  },
  {
    name: "Cây Kim Tiền",
    scientificName: "Pilea peperomioides",
    description: "Cây kim tiền có lá tròn đặc trưng, dễ nhân giống. Là loại cây cảnh phổ biến.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    distribution: "Trung Quốc, trồng khắp nơi",
    characteristics: "Lá tròn, thân mỏng",
    uses: "Cây cảnh nội thất",
    family: "Urticaceae",
    habitat: "Rừng ẩm",
    growthConditions: "Ánh sáng gián tiếp, độ ẩm cao"
  },
  {
    name: "Cây Lưỡi Hổ",
    scientificName: "Sansevieria trifasciata",
    description: "Cây lưỡi hổ có lá cứng đứng thẳng, dễ chăm sóc. Có khả năng lọc không khí tốt.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop",
    distribution: "Châu Phi, trồng khắp nơi",
    characteristics: "Lá cứng đứng, hoa nhỏ",
    uses: "Cây cảnh, lọc không khí",
    family: "Asparagaceae",
    habitat: "Sa mạc",
    growthConditions: "Ánh sáng gián tiếp, chịu khô"
  },
  {
    name: "Cây Trầu Bà Nam Mỹ",
    scientificName: "Philodendron hederaceum",
    description: "Cây trầu bà Nam Mỹ có lá xanh bóng, dễ trồng. Là loại cây dây leo phổ biến trong nhà.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop",
    distribution: "Nam Mỹ, trồng khắp nơi",
    characteristics: "Lá xanh bóng, thân leo",
    uses: "Cây cảnh nội thất",
    family: "Araceae",
    habitat: "Rừng nhiệt đới",
    growthConditions: "Ánh sáng gián tiếp, độ ẩm cao"
  },
  {
    name: "Cây Cầu Vồng",
    scientificName: "Dracaena marginata",
    description: "Cây cầu vồng có lá dài với viền hồng đỏ đẹp mắt. Là loại cây cảnh đứng phổ biến.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&h=300&fit=crop",
    distribution: "Madagascar, trồng khắp nơi",
    characteristics: "Lá dài viền hồng, thân gỗ",
    uses: "Cây cảnh nội thất",
    family: "Asparagaceae",
    habitat: "Rừng khô",
    growthConditions: "Ánh sáng gián tiếp, đất thoát nước"
  },
  {
    name: "Cây Cau Vua",
    scientificName: "Roystonea regia",
    description: "Cây cau vua có thân thẳng, lá lớn đẹp mắt. Thường được trồng làm cây cảnh đô thị.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Caribe, trồng khắp nơi",
    characteristics: "Thân thẳng, lá quạt lớn",
    uses: "Trang trí đô thị",
    family: "Arecaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất màu mỡ"
  },
  {
    name: "Cây Dừa Lùn",
    scientificName: "Cocos nucifera var. nana",
    description: "Cây dừa lùn có thân thấp hơn dừa thường, dễ chăm sóc hơn. Cũng cho quả dừa như dừa bình thường.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    distribution: "Đông Nam Á",
    characteristics: "Thân thấp, lá lớn, quả dừa",
    uses: "Trang trí, thực phẩm",
    family: "Arecaceae",
    habitat: "Đồng bằng",
    growthConditions: "Ánh sáng đầy đủ, đất thoát nước"
  }
];

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plant-portal')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Hàm seed dữ liệu
async function seedDatabase() {
  try {
    // Xóa dữ liệu cũ trước khi thêm mới
    console.log('🗑️  Clearing existing plants...');
    await Plant.deleteMany({});
    console.log('✅ Cleared existing plants');
    
    console.log('🌱 Adding new plants to database...');

    // Thêm 50 dữ liệu mẫu mới
    await Plant.insertMany(samplePlants);
    console.log('🌱 New plants inserted successfully');
    console.log(`📊 Added ${samplePlants.length} new plants`);

    // Hiển thị tổng số plants
    const totalPlants = await Plant.countDocuments();
    console.log(`📊 Total plants in database: ${totalPlants}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Chạy seed
console.log('🌱 Starting database seeding...');
seedDatabase();