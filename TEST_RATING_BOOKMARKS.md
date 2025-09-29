# Hướng dẫn test các chức năng đánh giá và yêu thích

## Lỗi đã được sửa và cải tiến:

### 1. Lỗi so sánh User ID
**Vấn đề:** Không nhất quán giữa việc sử dụng `user.id` và `user._id`
**Giải pháp:** Tạo utility functions để so sánh user ID một cách nhất quán

### 2. Lỗi error handling
**Vấn đề:** Không có feedback rõ ràng khi có lỗi
**Giải pháp:** Thêm error handling tốt hơn với thông báo cụ thể

### 3. Lỗi validation
**Vấn đề:** Không validate đầy đủ dữ liệu input
**Giải pháp:** Thêm validation cho rating (phải là số nguyên từ 1-5)

### 4. Lỗi state management
**Vấn đề:** Không cập nhật state đúng cách sau khi rating
**Giải pháp:** Cập nhật cả averageRating và ratings array

### 5. Cải tiến UX Rating (MỚI)
**Vấn đề:** Click trực tiếp vào sao gây confusion và có thể submit nhầm
**Giải pháp:** 
- Thêm form rating với nút "Gửi đánh giá"
- Người dùng chọn sao trước, sau đó click nút Submit
- Có nút "Hủy" để reset về rating cũ
- Hiển thị rating hiện tại của user
- Hiển thị số sao đã chọn

## Cách test:

### Test đánh giá (Rating) - PHIÊN BẢN MỚI:
1. Truy cập chi tiết một thực vật
2. Đăng nhập với tài khoản bình thường
3. Thấy form "Đánh giá thực vật này" (nếu chưa đánh giá) hoặc "Đánh giá của bạn (hiện tại: X sao)"
4. Click chọn số sao (1-5) - chỉ là chọn, chưa submit
5. Thấy hiển thị "Đã chọn: X sao"
6. Click nút "Gửi đánh giá" để submit
7. Kiểm tra:
   - Thông báo "Đánh giá thành công!"
   - Rating được cập nhật và hiển thị đúng
   - Average rating thay đổi
   - Nút thay đổi thành "Cập nhật đánh giá"

### Test hủy rating:
1. Chọn sao khác với rating hiện tại
2. Thấy nút "Hủy" xuất hiện
3. Click "Hủy" để reset về rating cũ

### Test yêu thích (Bookmark) - KHÔNG THAY ĐỔI:
1. Truy cập chi tiết một thực vật
2. Đăng nhập
3. Click nút "Yêu thích" 
4. Kiểm tra:
   - Thông báo "Đã thêm vào yêu thích"
   - Icon trái tim đổi màu đỏ
   - Vào trang Bookmarks để kiểm tra

### Test quyền xóa comment - KHÔNG THAY ĐỔI:
1. Tạo comment với user A
2. Đăng nhập user B -> không thể xóa comment của A
3. Đăng nhập admin -> có thể xóa mọi comment
4. Đăng nhập user A -> có thể xóa comment của mình

## Các file đã được cập nhật:
- `client/src/pages/PlantDetail.jsx`: 
  - Thêm tempRating state
  - Thay đổi handleRating thành handleSubmitRating
  - Cải tiến giao diện rating form
  - Thêm nút Hủy và feedback tốt hơn
- `client/src/utils/userUtils.js`: Utility functions mới
- `server/routes/plants.js`: Cải thiện validation rating
- `server/routes/bookmarks.js`: Cải thiện error handling

## Ưu điểm của phiên bản mới:
- Tránh việc submit nhầm rating
- UX rõ ràng hơn: chọn trước, submit sau
- Có thể preview trước khi submit
- Có thể hủy nếu chọn nhầm
- Hiển thị rating hiện tại một cách rõ ràng

## Lưu ý:
- Đảm bảo server và client đều đang chạy
- Kiểm tra console để thấy error details nếu có
- Test với nhiều user khác nhau để đảm bảo phân quyền đúng
- Test cả trường hợp đánh giá lần đầu và cập nhật đánh giá