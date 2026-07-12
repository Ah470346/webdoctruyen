---
name: translate-chinese-convert-novel
description: >
  Dịch truyện convert từ tiếng Trung sang tiếng Việt tự nhiên. Truyện convert là bản dịch máy thô
  từ tiếng Trung - nơi ngữ pháp Trung (đọc phải qua trái) được giữ nguyên thay vì chuyển sang
  ngữ pháp Việt (trái qua phải). Skill này hướng dẫn cách nhận diện và sửa các lỗi convert phổ biến,
  biến văn bản máy dịch thành tiếng Việt đọc trôi chảy, tự nhiên. Kích hoạt khi user yêu cầu:
  "dịch truyện convert", "convert sang tiếng Việt", "dịch truyện Trung", "biên dịch truyện",
  "sửa bản convert", "dịch novel", "translate convert novel".
---

# Skill: Dịch Truyện Convert Trung → Việt

## 1. Hiểu Bản Chất "Truyện Convert"

Truyện convert là bản dịch máy (machine translation) từ tiếng Trung sang tiếng Việt, trong đó:

- **Tiếng Trung**: Ngữ pháp đọc từ **phải qua trái** (bổ ngữ/tính từ đứng trước danh từ, trạng ngữ đứng trước động từ)
- **Tiếng Việt**: Ngữ pháp đọc từ **trái qua phải** (bổ ngữ/tính từ đứng sau danh từ, trạng ngữ linh hoạt hơn)

Bản convert giữ nguyên trật tự tiếng Trung, chỉ thay từng từ/cụm từ bằng nghĩa tiếng Việt → câu đọc ngược, tối nghĩa, lủng củng.

**Nhiệm vụ của bạn**: Đọc hiểu ý gốc tiếng Trung ẩn sau bản convert, rồi viết lại thành tiếng Việt tự nhiên, trôi chảy, giữ nguyên nội dung và cảm xúc.

---

## 2. Các Lỗi Phổ Biến Trong Bản Convert & Cách Sửa

### 2.1. Đảo ngữ pháp (Lỗi chính - Phải→Trái thành Trái→Phải)

Đây là lỗi cốt lõi. Tiếng Trung đặt bổ ngữ/tính từ **trước** danh từ, tiếng Việt đặt **sau**.

| Convert (sai trật tự) | Tiếng Việt tự nhiên |
|---|---|
| "hùng vĩ đồ sộ vú lớn" | "bộ ngực đồ sộ hùng vĩ" |
| "trắng nõn như tuyết làn da" | "làn da trắng nõn như tuyết" |
| "một cỗ hoàng đế oai nghiêm" | "một bộ dáng oai nghiêm của hoàng đế" |
| "khủng bố uy áp" | "uy áp khủng bố" |
| "to dài côn thịt" | "côn thịt to dài" |
| "trong lòng hận" | "hận trong lòng" |
| "sắc mặt lạnh lùng" | "sắc mặt lạnh lùng" (giữ nguyên nếu đã đúng) |
| "thực vất vả" | "rất vất vả" |
| "phi thường cảm kích" | "cảm kích vô cùng" |
| "cổ xưa nhất lão tổ" | "lão tổ cổ xưa nhất" |
| "thật lớn lực" | "lực rất lớn" |
| "quá kinh khủng" | "kinh khủng quá" |
| "thất thải cột sáng" | "cột sáng bảy màu" |
| "uy nghiêm đế bào" | "đế bào uy nghiêm" |
| "mỹ diệu vô cùng" | "vô cùng mỹ diệu" (hoặc giữ nguyên tuỳ ngữ cảnh) |

### 2.2. Đại từ nhân xưng và xưng hô

Tiếng Trung dùng chung đại từ, convert dịch máy thường sai ngôi/giới tính:

| Convert | Tiếng Việt tự nhiên | Ghi chú |
|---|---|---|
| "ta" (我) | "ta" / "tôi" / "con" / "thiếp" | Tùy ngữ cảnh, quan hệ nhân vật |
| "ngươi" (你) | "ngươi" / "con" / "nàng" / "anh" | Tùy quan hệ |
| "hắn" dùng cho nữ | "nàng" (她) | Trung không phân biệt trong nói |
| "hắn nhóm" (他们) | "bọn họ" / "chúng" | |
| "mẫu thân" | "mẫu thân" / "mẹ" / "nương" | Giữ nguyên phong cách cổ trang |
| "phụ thân" | "phụ thân" / "cha" | |

### 2.3. Từ vựng Hán-Việt dịch máy sai/lạ

Máy dịch thường chọn sai nghĩa hoặc dịch quá sát chữ Hán:

| Convert | Tiếng Việt | Giải thích |
|---|---|---|
| "thối thể" (蜕体) | "thoái thể" | Cảnh giới tu luyện |
| "khuy nguyệt" (窥月) | "khuy nguyệt" / "dòm trăng" | Cảnh giới |
| "tụ nhật" (聚日) | "tụ nhật" / "tụ mặt trời" | Cảnh giới |
| "man di" (蛮夷) | "man hoang" / "mọi rợ" | Chỉ vùng đất hoang vu |
| "truyền tống trận" (传送阵) | "trận truyền tống" / "trận dịch chuyển" | Đảo lại cho đúng |
| "Quy Nhất" (归一) | "Quy Nhất" | Giữ nguyên tên cảnh giới |
| "chứng đạo" (证道) | "chứng đạo" | Giữ nguyên |
| "hoàn khố" (纨绔) | "hoàn khố" / "công tử bột" | Chỉ thiếu gia ăn chơi |
| "tẩu hỏa nhập ma" | "tẩu hỏa nhập ma" | Giữ nguyên thuật ngữ tu tiên |
| "phá quan" (破关) | "phá quan" / "xuất quan" | Ra khỏi bế quan |
| "thần thức" (神识) | "thần thức" | Giữ nguyên |
| "linh lực" (灵力) | "linh lực" | Giữ nguyên |

### 2.4. Cấu trúc câu lủng củng

Convert thường giữ cấu trúc câu Trung, cần tách/ghép/sắp xếp lại:

**Ví dụ 1 - Câu miêu tả dài:**
```
CONVERT: "Mỹ phụ đi hướng trước xoa nhẹ thiếu niên gương mặt, dặn dò"
→ VIỆT: "Mỹ phụ bước tới, nhẹ nhàng xoa mặt thiếu niên, dặn dò"
```

**Ví dụ 2 - Câu hành động:**
```
CONVERT: "Tần Thiên bắt lấy mẫu thân tay nhỏ, một tay ôm mẫu thân eo nhỏ, đem mẫu thân kéo đến trong lòng"
→ VIỆT: "Tần Thiên nắm lấy bàn tay nhỏ của mẫu thân, một tay ôm lấy eo nàng, kéo nàng vào lòng"
```

**Ví dụ 3 - Câu đối thoại:**
```
CONVERT: "Bọn hắn phỏng chừng nằm mơ cũng không nghĩ đến, Thiên Ngân đế quốc Lạc Ngân nữ đế nhưng thật ra là một cái cùng con loạn luân dâm phụ a?"
→ VIỆT: "Bọn họ nằm mơ cũng không ngờ được, Lạc Ngân nữ đế của Thiên Ngân đế quốc thực ra lại là một dâm phụ loạn luân với con trai mình sao?"
```

**Ví dụ 4 - Câu nội tâm:**
```
CONVERT: "hắn là người xuyên việt, hắn là thiên mệnh chi tử, mà bây giờ làm hắn không thể tiếp nhận, hắn nữ nhân bị người khác cướp đi rồi!"
→ VIỆT: "Hắn là người xuyên việt, hắn là thiên mệnh chi tử, thế mà giờ đây hắn không thể chấp nhận được – nữ nhân của hắn đã bị người khác cướp mất!"
```

### 2.5. Hư từ và liên từ sai/thừa

Convert hay dịch hư từ Trung sang Việt một cách máy móc:

| Convert | Tiếng Việt | Ghi chú |
|---|---|---|
| "đem" (把 - bǎ) | bỏ hoặc thay bằng cấu trúc phù hợp | Câu chữ 把 rất phổ biến |
| "liền" (就) | "thì" / "liền" / bỏ | Tùy ngữ cảnh |
| "nhưng thật ra" (但其实) | "nhưng thực ra" / "thực ra" | |
| "bất quá" (不过) | "nhưng mà" / "tuy nhiên" | |
| "kỳ thật" (其实) | "thực ra" / "kỳ thực" | |
| "đối với" (对于) | "với" / "đối với" | Thường thừa |
| "tại" (在) | "ở" / "đang" | Tùy ngữ cảnh |
| "phi thường" (非常) | "vô cùng" / "rất" | |
| "thực" (实/真) | "thật" / "rất" | |
| "chính là" (就是) | "chính là" / "là" | Thường thừa |

### 2.6. Thành ngữ & cụm cố định dịch sai

| Convert | Tiếng Việt | Gốc Trung |
|---|---|---|
| "thấy người sang bắt quàng làm họ" | "xu nịnh người quyền quý" / "nịnh hót kẻ mạnh" | 攀高枝 |
| "con vịt đã đun sôi đến bờ môi bay" | "miếng ăn đến miệng lại bay mất" | 煮熟的鸭子飞了 |
| "hảo tâm đương lòng lang dạ thú" | "tốt bụng lại bị xem là có ý xấu" | 好心当做驴肝肺 |
| "vỗ mông ngựa" | "nịnh hót" / "nịnh nọt" | 拍马屁 |
| "mạch thượng nhân như ngọc, công tử thế vô song" | "người trên đường như ngọc, công tử đời không hai" | 陌上人如玉，公子世无双 |

---

## 3. Quy Tắc Dịch Thuật

### 3.1. Nguyên tắc cốt lõi

1. **Đảo trật tự từ Trung→Việt**: Bổ ngữ, tính từ phải đặt SAU danh từ
2. **Giữ nguyên tên riêng**: Tên nhân vật, địa danh, tông phái, cảnh giới tu luyện giữ phiên âm Hán-Việt
3. **Giữ phong cách cổ trang**: Dùng từ ngữ phù hợp thể loại (tu tiên, cổ đại, huyền huyễn)
4. **Ưu tiên đọc trôi chảy**: Câu phải đọc tự nhiên như tiếng Việt, không gượng gạo
5. **Bảo toàn nội dung 100%**: Không thêm/bớt/thay đổi ý nghĩa, tình tiết, cảm xúc
6. **Giữ nguyên mức độ 18+**: Nếu bản gốc có nội dung người lớn, giữ nguyên mức độ, không censored

### 3.2. Xử lý tên riêng

- **Tên nhân vật**: Giữ phiên âm Hán-Việt (Tần Thiên, Cung Tiêu Nguyệt, Vũ Băng Thiền, Hồ Cửu Ly, Lâm Phàm...)
- **Tên địa danh/tông phái**: Giữ nguyên (Thiên Ngân đế quốc, Thiên Kiếm thánh địa, Thiên Thương giới...)
- **Tên cảnh giới**: Giữ nguyên Hán-Việt (Luyện Khí, Tẩy Tủy, Huyền Đan, Ngưng Thần, Hóa Hồn, Quy Nhất, Xem Sao, Khuy Nguyệt, Tụ Nhật, Chuẩn Đế, Đại Đế...)
- **Tên kỹ năng/vật phẩm**: Giữ Hán-Việt (Long Nguyên Đan, trận truyền tống...)

### 3.3. Phong cách văn phong

- **Miêu tả**: Dùng câu dài, uyển chuyển, giàu hình ảnh
- **Đối thoại**: Ngắn gọn, sắc bén, phù hợp tính cách nhân vật
- **Nội tâm**: Mượt mà, thể hiện rõ cảm xúc
- **Hành động/chiến đấu**: Nhanh, mạnh, dứt khoát
- **Hài hước/trêu ghẹo**: Tự nhiên, hóm hỉnh

---

## 4. Quy Trình Dịch

### Bước 1: Đọc và phân tích file nguồn
- Đọc file .txt nguồn trong thư mục `sources/`
- Xác định cấu trúc: tiêu đề truyện, lời tác giả, thiết lập thế giới, các chương
- Nhận diện pattern đánh dấu chương (ví dụ: `Chương 01::`, `Chương 02::`, ...)
- Xác định tên nhân vật, địa danh, thuật ngữ xuất hiện lặp lại

### Bước 2: Tạo bảng thuật ngữ (Glossary)
Trước khi dịch, tạo một bảng thuật ngữ nhất quán cho toàn bộ truyện:
```
Ví dụ:
- Tần Thiên → Tần Thiên (nhân vật chính nam)
- Cung Tiêu Nguyệt → Cung Tiêu Nguyệt (mẫu thân, Lạc Ngân nữ đế)
- Vũ Băng Thiền → Vũ Băng Thiền (thánh nữ Thiên Kiếm)
- Hồ Cửu Ly → Hồ Cửu Ly (mẫu thân Vũ Băng Thiền, hồ yêu)
- thiên kiếm thánh địa → Thiên Kiếm thánh địa
- đại thiên đạo vực → Đại Thiên Đạo Vực (thượng giới)
- thiên thương giới → Thiên Thương giới (hạ giới)
```

### Bước 3: Dịch từng chương
- Dịch từng đoạn, giữ nguyên cấu trúc phân đoạn
- Đảo ngữ pháp Trung→Việt
- Sửa từ vựng sai/lạ
- Làm mượt câu văn
- Kiểm tra tính nhất quán thuật ngữ

### Bước 4: Lưu file đã dịch
- Lưu vào thư mục `sources/translated/` với tên file gốc + hậu tố `_translated`
- Hoặc theo chỉ định của user

---

## 5. Ví Dụ Dịch Đầy Đủ

### INPUT (bản convert):

```
Chương 01::

"Mẫu thân, ta đi trước."

Một vị thiếu niên đứng ở một chỗ truyền tống trận bên trong, vẫy tay hướng một vị mỹ phụ nhân
cáo biệt, thiếu niên anh tuấn phi thường, khí chất xuất chúng, chính như mạch thượng nhân như
ngọc, công tử thế vô song.

Mà mỹ phụ nhân mặc một bộ rộng thùng thình y phục thường, nhưng quần áo không chỉnh tề, cả
kiện quần áo trượt xuống xuống, đem nàng kia hùng vĩ đồ sộ vú lớn lộ ra bên ngoài, trắng nõn
như tuyết làn da dưới ánh mặt trời lập lờ tia sáng chói mắt, phụ nhân rất đẹp, giống như một
khỏa chín muồi trái cây, mỹ vị và nhiều chất lỏng, mày liễu mắt hạnh anh đào miệng, nâng
ngực eo nhỏ mật đào mông, tốt một cái xinh đẹp tuyệt luân mỹ phụ nhân.

Mỹ phụ đi hướng trước xoa nhẹ thiếu niên gương mặt, dặn dò: "Thiên nhi, lần này trong triều
lão tổ suy tính ra, tại hạ giới có một kiện về tổ long cơ duyên sắp xuất thế, mặc dù chẳng
biết tại sao bực này cơ duyên sẽ xuất hiện tại hạ giới bực này man di nơi, nhưng nhất định
phải bắt tới tay, đôi này ngươi ngày sau trọng yếu phi thường, toàn bộ ta tất cả an bài xong,
mau một chút trở về."
```

### OUTPUT (bản dịch tiếng Việt):

```
Chương 1:

"Mẫu thân, con đi đây."

Một thiếu niên đứng giữa trận truyền tống, vẫy tay chào tạm biệt một mỹ phụ. Thiếu niên anh
tuấn phi phàm, khí chất xuất chúng, đúng là "người trên đường tựa ngọc, công tử đời vô song."

Mỹ phụ mặc một bộ thường phục rộng thùng thình, quần áo không mấy chỉnh tề, cả tấm áo tuột
xuống, để lộ bộ ngực đồ sộ hùng vĩ ra bên ngoài. Làn da trắng nõn như tuyết dưới ánh mặt trời
lấp lánh chói mắt. Nàng rất đẹp, tựa như một trái cây chín mọng, ngọt ngào đầy nước. Mày
liễu mắt hạnh, miệng anh đào, ngực căng eo nhỏ, mông tròn như đào — quả thật là một mỹ phụ
xinh đẹp tuyệt trần.

Mỹ phụ bước tới, nhẹ nhàng xoa mặt thiếu niên, dặn dò: "Thiên nhi, lần này lão tổ trong triều
tính toán ra, ở hạ giới có một cơ duyên liên quan đến Tổ Long sắp xuất thế. Mặc dù không hiểu
vì sao cơ duyên bậc này lại xuất hiện ở chốn man hoang hạ giới, nhưng nhất định phải lấy được.
Điều này vô cùng quan trọng đối với tương lai của con. Mọi thứ mẹ đã sắp xếp xong hết rồi,
đi nhanh rồi sớm quay về."
```

---

## 6. Xử Lý Các Trường Hợp Đặc Biệt

### 6.1. Ký hiệu tiếng Trung còn sót
Nếu thấy ký tự Trung (《》,「」, 、, ，) → chuyển sang dấu câu Việt tương ứng.
- 《》→ « » hoặc ""
- 「」→ " "
- 、→ , (phẩy)

### 6.2. Lời tác giả / ghi chú
Phần lời tác giả đầu truyện, ghi chú dịch giả → dịch bình thường nhưng giữ nguyên ý, không cần quá trau chuốt văn phong.

### 6.3. Thơ / câu đối / hệ thống thông báo
- **Thơ**: Cố gắng giữ vần điệu nếu có thể, nếu không thì ưu tiên nghĩa
- **Hệ thống thông báo** (kiểu system prompt trong truyện): Dịch rõ ràng, ngắn gọn
- **Bảng thiết lập** (cảnh giới, hệ thống): Giữ format gạch đầu dòng, dịch rõ ràng

### 6.4. File lớn (>100K dòng)
- Dịch theo batch, mỗi lần xử lý 1-3 chương
- Hỏi user muốn dịch chương nào hoặc dịch tuần tự
- Lưu tiến trình để có thể tiếp tục

### 6.5. Watermark / quảng cáo nguồn
Dòng đầu tiên thường là watermark nguồn truyện (ví dụ: "Truyện bạn đang theo dõi được thực hiện & thuộc bản quyền của..."). Bỏ qua dòng này trong bản dịch.

---

## 7. Checklist Kiểm Tra Chất Lượng

Sau khi dịch xong mỗi chương, kiểm tra:

- [ ] **Trật tự từ**: Tất cả cụm từ đã đảo từ Trung→Việt chưa?
- [ ] **Tên riêng**: Nhất quán xuyên suốt?
- [ ] **Đại từ**: "hắn/nàng" dùng đúng giới tính?
- [ ] **Xưng hô**: Phù hợp quan hệ nhân vật? (con nói với mẹ, đệ tử nói với sư phụ...)
- [ ] **Câu văn**: Đọc to lên có trôi chảy tự nhiên không?
- [ ] **Thuật ngữ tu tiên**: Nhất quán, đúng Hán-Việt?
- [ ] **Nội dung**: Không bị mất/thêm ý so với bản gốc?
- [ ] **Format**: Giữ nguyên phân đoạn, xuống dòng hội thoại?

---

## 8. Template Output

Khi dịch, output theo format:

```markdown
# [Tên truyện tiếng Việt]

**Tác giả**: [Tên tác giả]
**Thể loại**: [Thể loại]
**Số chương**: [Số chương]

---

## Chương [số]: [Tên chương nếu có]

[Nội dung đã dịch]

---

## Chương [số]: [Tên chương nếu có]

[Nội dung đã dịch]
```

---

## 9. Lưu Ý Quan Trọng

1. **KHÔNG dịch lại từ đầu** nếu bản convert đã có đoạn đọc được → chỉ sửa những chỗ lủng củng
2. **KHÔNG thêm nội dung** mới, không sáng tạo thêm tình tiết
3. **KHÔNG kiểm duyệt** nội dung 18+ — giữ nguyên bản gốc
4. **KHÔNG đổi tên** nhân vật/địa danh sang dạng khác (ví dụ không đổi "Tần Thiên" thành "Qin Tian")
5. **Hỏi user** nếu gặp đoạn quá khó hiểu, không đoán bừa
6. **Lưu glossary** riêng cho mỗi truyện để đảm bảo nhất quán khi dịch nhiều session
