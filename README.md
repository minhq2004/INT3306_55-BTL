# BÀI TẬP LỚN Phát triển ứng dụng Web - INT3306 55

## Table of Contents

- [Giới thiệu](#giới-thiệu)
- [Video Demo](#video-demo)
- [Deploy trực tuyến](#deploy-trực-tuyến)
- [Sinh viên thực hiện](#sinh-viên-thực-hiện)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Mô tả chức năng](#mô-tả-chức-năng)
- [Các công nghệ sử dụng](#các-công-nghệ-sử-dụng)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)

## Giới thiệu

Hãng hàng không QAirline cần phát triển một website nhằm cung cấp thông tin về các chuyến bay cùng các dịch vụ bay do hãng cung cấp. Đồng thời, khách hàng có thể đặt vé trên website của QAirline.

## [Video Demo]()

## Deploy trực tuyến

FrontEnd: https://qairline-online.vercel.app/
Sử dụng Vercel để Deploy FrontEnd

BackEnd: https://qairlineonline.onrender.com/
Sử dụng Render để Deploy BackEnd

Database: Sử dụng Clever Cloud để Deploy database MySQL

Tài khoản admin mẫu:
- kiet@admin.com
- admin123

Tài khoản user mẫu:
- minh@email.com
- user123

## Sinh viên thực hiện

| Họ và tên           | Mã Sinh Viên |
| ------------------- | ------------ |
| Nguyễn Trung Nguyên | 22204553     |
| Lê Tuấn Kiệt        | 22024546     |
| Nguyễn Quang Minh   | 22024547     |

## Cấu trúc thư mục

Thư mục FrontEnd

```
frontend/
├─ public/
├─ src/
│  ├─ Admin/
│  |	├─ components/
│  |	├─ customize/
│  |	├─ pages/
│  ├─ contexts/
│  ├─ KhachHang/
│  |	├─ components/
│  |	├─ pages/
│  |	├─ stores/
│  ├─ App.css
│  ├─ App.jsx
│  ├─ index.css
│  ├─ main.jsx
├─ .eslintrc.cjs
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
```

Thư mục BackEnd

```
backend/
├─ config/
├─ controllers/
├─ middleware/
├─ models/
├─ public/
│  ├─ about/
│  ├─ announcement/
│  ├─ news/
│  ├─ promotion/
├─ routes/
├─ .env
├─ .gitignore
├─ app.js
├─ package-lock.json
├─ package.json
```

## Mô tả chức năng

### Chức năng cho khách hàng

- Xem thông tin chung và thông tin về các chuyến bay.
- Tìm chuyến bay.
- Đặt vé (không yêu cầu tích hợp thanh toán online).
- Hủy vé trong thời gian còn hạn được hủy.
- Theo dõi thông tin về các chuyến bay đã đặt.

![image](https://github.com/user-attachments/assets/c1a3fe4d-908f-4b59-a8cf-bbfb9faee278)

![image](https://github.com/user-attachments/assets/363ba3ef-1873-42e3-ac0e-9a0944197a6e)

![image](https://github.com/user-attachments/assets/a5f5a802-f4f7-44dd-941e-660228d217ed)

![image](https://github.com/user-attachments/assets/60ef7a87-5db5-4f09-afe8-46fcef055a44)

![image](https://github.com/user-attachments/assets/8a2976ca-e908-40a9-b931-3e28987cea97)

![image](https://github.com/user-attachments/assets/3ae8d3d0-74d0-4b0d-aa19-ec7dc9482571)

### Chức năng cho quản trị

- Đăng thông tin (giới thiệu, khuyến mại, thông báo, tin tức, ...) của hãng.
- Nhập dữ liệu về các tàu bay (mã, hãng sản xuất, thông tin về các ghế, ...).
- Nhập dữ liệu về các chuyến bay (số hiệu, tàu bay, điểm đi, điểm đến, giờ khởi hành, ...).
- Xem và thống kê đặt vé của khách hàng.
- Thay đổi giờ khởi hành (delay) cho chuyến bay nếu cần.

![image](https://github.com/user-attachments/assets/9e331df0-58b6-4a06-b9f1-64a378d1da90)

![image](https://github.com/user-attachments/assets/303887a6-8cd8-4b31-8b6c-4044a896ece6)

![image](https://github.com/user-attachments/assets/414b2436-19a0-45c8-a43e-786b017284fe)

![image](https://github.com/user-attachments/assets/a6b98bc7-f444-408b-bce1-a74776b50ce1)

![image](https://github.com/user-attachments/assets/19f73802-95e8-40f0-b4f3-247b9998cf05)

## Các công nghệ sử dụng

- NodeJS
- MySQL
- ExpressJS
- ReactJS
- TailwindCSS
- Sequelize

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
cd .\backend\
npm install
npm run dev
```

Terminal frontend:

```bash
cd .\frontend\
npm install
npm run dev
```
