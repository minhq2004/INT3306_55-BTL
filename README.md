# BÀI TẬP LỚN Phát triển ứng dụng Web - QAirline

## [Video Demo]()

## Sinh viên thực hiện

| Họ và tên           | Mã Sinh Viên |
| ------------------- | ------------ |
| Nguyễn Trung Nguyên | 22204553     |
| Lê Tuấn Kiệt        | 22024546     |
| Nguyễn Quang Minh   | 22024547     |

## Giới thiệu

Hãng hàng không QAirline cần phát triển một website nhằm cung cấp thông tin về các chuyến bay cùng các dịch vụ bay do hãng cung cấp. Đồng thời, khách hàng có thể đặt vé trên website của QAirline.

## Mô tả chức năng

### Chức năng cho khách hàng

- Xem thông tin chung và thông tin về các chuyến bay.
- Tìm chuyến bay.
- Đặt vé (không yêu cầu tích hợp thanh toán online).
- Hủy vé trong thời gian còn hạn được hủy.
- Theo dõi thông tin về các chuyến bay đã đặt.

### Chức năng cho quản trị

- Đăng thông tin (giới thiệu, khuyến mại, thông báo, tin tức, ...) của hãng.
- Nhập dữ liệu về các tàu bay (mã, hãng sản xuất, thông tin về các ghế, ...).
- Nhập dữ liệu về các chuyến bay (số hiệu, tàu bay, điểm đi, điểm đến, giờ khởi hành, ...).
- Xem và thống kê đặt vé của khách hàng.
- Thay đổi giờ khởi hành (delay) cho chuyến bay nếu cần.

## Các công nghệ sử dụng

- NodeJS
- MySQL
- ReactJS
- TailwindCSS

## Hướng dẫn sử dụng

- Tải XAMPP tại "https://www.apachefriends.org/download.html" sau đó mở XAMPP control panel rồi bật lần lượt "start" ở Apache và MySQL. Sau đó bật "admin" ở MySQL.
- Tại trang admin, hãy ấn "mới" tạo tên database là "qairline" rồi sau đó ấn "Tạo".
- Sau đó ấn "nhập", tải file [qairline.sql](backend/config/qairline.sql) và upload lên. Bỏ tích ở phần "Kiểm tra khóa ngoại" và kéo xuống dưới ấn "Nhập".
- clone respiratory về máy "https://github.com/minhq2004/INT3306_55-BTL.git".
- Tạo file .env ở trong thư mục backend và thêm các biến môi trường sau:

```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=qairline
DB_PORT=3306
JWT_SECRET=my_super_secret_key
```

- Chia thành 2 terminal và chạy lần lượt các lệnh sau:

Terminal backend:

```bash
cd backend/
npm install
npm run dev
```

Terminal frontend:

```bash
cd frontend/
npm install
npm run dev
```
