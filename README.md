# CI/CD Demo — ví dụ tối giản để giải thích cho khách hàng

Đây là 1 repo cực nhỏ, **không có mục đích dùng thật** — chỉ để minh hoạ trực quan khái niệm
**CI/CD** (Continuous Integration / Continuous Deployment), dùng làm ví dụ khi giải thích cho
khách hàng chưa quen với kỹ thuật này.

## Repo này có gì

- `site/index.html` + `site/app.js` — 1 trang web tĩnh cực đơn giản (không cần build, không cần
  cài thư viện).
- `test.js` — 1 bài test cực đơn giản cho đoạn logic trong `app.js` (dùng module `assert` có sẵn
  của Node.js, không cần cài gì thêm).
- `.github/workflows/ci-cd.yml` — pipeline CI/CD, chạy trên GitHub Actions.

## Luồng hoạt động (đúng như tên gọi CI/CD)

```
Bạn sửa code, push lên GitHub
        │
        ▼
┌───────────────────┐
│  1) CI             │   Tự động chạy `node test.js`.
│  Kiểm tra code     │   Nếu test fail → dừng lại ở đây, KHÔNG deploy gì cả.
└───────────────────┘
        │ (chỉ khi test pass VÀ code đã ở nhánh main)
        ▼
┌───────────────────┐
│  2) CD             │   Tự động đóng gói thư mục site/ và đưa lên GitHub Pages -
│  Triển khai        │   một trang web thật, có URL công khai, ai cũng xem được.
└───────────────────┘
        │
        ▼
  Trang web thật cập nhật ngay,
  không ai phải bấm nút "deploy" tay
```

Đây chính xác là 2 nửa của cụm từ CI/CD:
- **CI (Continuous Integration)** = phần 1 — tự động *kiểm tra* mỗi khi có thay đổi.
- **CD (Continuous Deployment)** = phần 2 — tự động *triển khai* nếu kiểm tra pass.

## Cách chạy thử để demo cho khách hàng

1. Tạo 1 repo mới trên GitHub (public), push toàn bộ thư mục này lên nhánh `main`.
2. Vào **Settings → Pages** của repo, mục "Build and deployment" chọn source là **GitHub Actions**
   (chỉ cần làm 1 lần).
3. Vào tab **Actions** — sẽ thấy pipeline `CI/CD Demo` tự chạy ngay sau khi push, đi qua đúng 2 bước
   `1) CI` rồi `2) CD` như sơ đồ trên.
4. Sau khi job `deploy` chạy xong, trang web sẽ có ở địa chỉ dạng
   `https://<tên-tài-khoản>.github.io/<tên-repo>/`.
5. **Để demo "phép màu" cho khách hàng**: sửa 1 chữ trong `site/index.html` (ví dụ đổi câu chào),
   commit, push — rồi mở tab Actions cho khách xem pipeline tự chạy, và refresh lại trang web thật
   để thấy nội dung đã đổi **mà không ai bấm deploy tay**.

Muốn demo phần "CI chặn code lỗi": sửa `site/app.js` cho hàm `greet` trả về sai giá trị so với
`test.js` đang kiểm tra, push lên — job `test` sẽ báo đỏ (fail), và job `deploy` **sẽ không chạy**
(vì `deploy` có điều kiện `needs: test`) — trang web thật không hề bị ảnh hưởng bởi code lỗi.

## Liên hệ với pipeline thật của dự án (RiskMapGenerator)

Ví dụ này cố tình đơn giản hoá tối đa, nhưng đúng cấu trúc với pipeline CI/CD thật đang dùng:

| Ở demo này | Ở RiskMapGenerator |
|---|---|
| `node test.js` | Build + chạy test Java/Maven (`ci.yml`) |
| Deploy lên GitHub Pages | Build Docker image → push lên AWS ECR → restart ECS/Lambda (`deploy.yml`) |
| Trigger: push vào `main` | Trigger: bấm tay ("Run workflow") chọn môi trường dev/prod |
| Environment: GitHub Pages (miễn phí, không cần tài khoản) | Environment: tài khoản AWS thật, có `dev`/`prod` riêng |

Ý tưởng cốt lõi giống hệt nhau: **code luôn được kiểm tra tự động trước, và chỉ những gì đã qua
kiểm tra mới được đưa lên môi trường thật** — con người không còn phải tự tay build/copy/deploy
thủ công, giảm rủi ro sai sót.
