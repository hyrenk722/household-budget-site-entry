# Builder log — NestEgg rev2 (round 3 fixes)

- Ngày: 2026-11-29 ~00:20–00:45 VN
- Base: `a23d891` (submission vòng 2, hạng 4770/5723)
- Nguồn sửa: `reviews/reviewers-round3.md`, `reviews/browser-verify-round3.md`, `reviews/gemma-round3.md`
- Kiểm chứng: Chromium thật (Playwright chromium-1255, `--headless=new`), app serve
  bằng `python3 -m http.server 8123` từ `app/`, điều khiển qua CDP bằng script
  Node (`/tmp/nestegg/r3-verify.mjs`, `/tmp/nestegg/r3-shots.mjs`).
  Số đo trước = chạy lại script trên code `a23d891` (khớp đúng kết luận round 3).

## 1. F-19 (BLOCKER) — Edit/Delete chết sau search/filter — PASS

- Sửa: `app/view-transactions.js` — bỏ 2 khối `querySelectorAll("[data-del]")` /
  `"[data-edit]"` gắn listener một lần trong `bind()`; thay bằng **một handler
  delegation trên `tbody`** (`e.target.closest("[data-del]"/"[data-edit]")`),
  logic mở form Edit tách thành `openEdit(id)`. `refreshTable()` thay
  `tbody.innerHTML` giờ không còn làm mồ côi listener.
- Đo trước (code cũ): search "costco" → 2 dòng → Delete → vẫn 2 dòng; Edit →
  form không mở.
- Đo sau: search "costco" → 2 nút Delete → Delete → **1 nút** (đúng trừ 1);
  Edit sau search → form mở, `#e-desc` = "Thanksgiving groceries — Costco".
- Lưu ý: lần verify đầu Delete báo 2→2 do Chrome cũ từ lượt baseline còn chạy
  kẹt profile; kill sạch + chạy lại thì PASS. Debug riêng (`dbg-f19.mjs`)
  cũng xác nhận 2→1, 0 page exception.

## 2. A-01 / F-21 / F-22 / F-23 — số liệu "tiết kiệm" trung thực — PASS

- Sửa:
  - `app/view-dashboard.js:11`: `saveRate` = `savingsMoved(state, month) / income`
    (trước: `(income - spent) / income`). Note đổi thành "Moved to savings ·
    Goal: 15% of income"; class `good` chỉ khi ≥ 15% (0% không còn xanh).
  - `app/view-reports.js:22-24`: `avgSaved` → `avgLeftOver`, thẻ "Average left
    over / mo", note "17% left over, before planned saving" (không còn
    "savings rate"); tips trong cùng file đổi "Average saving…" → "Average
    left over…", "best month … saved" → "… left over". Đồng thời sửa F-27:
    class `good`/`warn` theo dấu của `avgLeftOver` (trước luôn xanh).
  - `app/view-tips.js:9-13` (tip #1): "The Alvarez family saves $800 a month
    this way" → "aims to move $800 a month this way — their Savings budget is
    $800, and nothing has moved yet"; save-line → "Moves $800 a month to
    savings, automatically".
  - `app/view-goals.js`: thêm 1 dòng hint dưới lede: số dư goals được tích lũy
    từ trước khi lịch sử giao dịch trên site bắt đầu, nên không có giao dịch
    Savings nào cho chúng trong Transactions; chỉ contribution mới tạo giao
    dịch Savings. **Giữ nguyên số liệu seed ($10,550), không bịa số.**
- Đo trước: Dashboard "Savings rate 31%" kề "$0.00 moved to savings"; Reports
  "Average saved / mo $1,208.01 · 23% savings rate" (tháng 11; tháng 7 là 17%);
  Tips #1 khẳng định gia đình "saves $800 a month".
- Đo sau: Dashboard **"Savings rate 0%"** kề "$0.00 moved to savings";
  Reports **"Average left over / mo $300.50 · 17% left over, before planned
  saving"** (tháng 7) và không còn chuỗi "Average saved"/"savings rate" nào
  trong body Reports; Tips #1 không còn câu khẳng định sai; Goals có dòng
  giải thích nguồn số dư.

## 3. F-09/F-10 — tháng mặc định động — PASS

- Sửa: `app/format.js` thêm `currentMonth()` (từ `new Date()`); `app/main.js`
  dùng `currentMonth()` lúc khởi động **và** lúc Reset demo (trước hard-code
  `"2026-11"` cả 2 chỗ).
- Đo trước (giả lập clock 01/12/2026 10:00 +07 qua `Page.addScriptToEvaluateOnNewDocument`):
  dashboard vẫn "November 2026", form Add mặc định 2026-11-15.
- Đo sau (cùng mock): header + H1 = **"December 2026"**, form Add mặc định
  **2026-12-15**, 0 page exception. Đồng hồ thật 29/11 vẫn hiện November 2026
  đúng seed.

## 4. F-20 — bảng so sánh Reports trống tháng 6–8/2026 — PASS

- Sửa: `app/view-reports.js` — khi không có dòng so sánh theo hạng mục nào,
  hiện 1 dòng "Total spending" lấy từ `MONTH_SUMMARIES` (fallback
  `monthTotals`) + 1 dòng ghi rõ không có dữ liệu từng giao dịch nên không có
  breakdown theo hạng mục.
- Đo trước: tháng 7/2026 → tbody **0 dòng** (trong khi biểu đồ có số).
- Đo sau: tháng 7/2026 → **2 dòng**: "Total spending $4,185.00 $4,412.00
  ▲ $227.00" + dòng giải thích. Tháng 11 (có giao dịch) vẫn hiện đủ 9 dòng
  hạng mục như cũ.

## 5. F-24 — sửa ngày sang tháng khác thì dòng biến mất không báo — PASS

- Sửa: `app/view-transactions.js` — đường submit Edit: nếu `monthOf(date) !==
  month` thì đặt `addNotice` = "Moved to <tháng mới> — use the month arrows
  on the Dashboard to see it." (cùng cơ chế one-shot với đường Add F-09).
  Kèm sửa: `render()` mở form Add khi có notice (`class="inline-form open"`),
  vì trước đây notice nằm trong form đóng nên thực tế không ai thấy được —
  cả đường Add F-09 cũng được hưởng.
- Đo trước: edit Costco 2026-11-11 → 2026-12-05: dòng biến mất, notice rỗng,
  không thấy gì.
- Đo sau: notice **"Moved to December 2026 — use the month arrows on the
  Dashboard to see it."**, `noticeVisible=true`, form Add tự mở, bảng còn
  1 dòng Costco (dòng kia đã sang tháng 12).

## 6. Nhãn "Amount ($)" form Add — PASS

- Sửa: `app/view-transactions.js` — label rút về đúng "Amount ($)", phần giải
  thích dấu chuyển xuống `<p class="hint">` dưới ô input.
- Đo trước: label cao **43.6px = 2 dòng**, ô Amount lệch hàng so với Date.
- Đo sau (form mở): label cao **21.8px = 1 dòng**, `amtTop == dateTop`
  (316.34px, lệch 0px), hint hiện dưới ô: "Minus for spending — the sign is
  fixed for you if you forget."

## Screenshots (chụp lại, đã xem bằng mắt)

- `screenshots/1-cover-dashboard.jpg` (1280×657): Savings rate **0%**, nhất
  quán với "$0.00 moved to savings"; không lỗi mới.
- `screenshots/2-transactions.jpg` (1280×657): form Add mở, nhãn Amount ($)
  1 dòng thẳng hàng, hint nằm gọn dưới ô.
- `screenshots/3-budget.jpg` (1280×657): không đổi, không lỗi mới.
- `screenshots/4-dashboard-phone.jpg` (390×844): nav 2 hàng, stat 2 cột,
  Savings rate 0%; donut bắt đầu ở cuối viewport như ảnh cũ (dưới fold,
  không phải lỗi mới — giữ nguyên khung hình vòng trước).
- Lưu ý kỹ thuật: headless Chrome ép chiều rộng cửa sổ tối thiểu 500px nên
  ảnh phone dùng `Emulation.setDeviceMetricsOverride` 390×844 để đúng
  viewport trong `shots.json`.

## Tổng kết verify

- Script `/tmp/nestegg/r3-verify.mjs`: **11/11 PASS** (chạy lại sau khi sửa
  xong toàn bộ; baseline trên code cũ: 3/11 — 2 PASS giả do đo sai: label đo
  khi form đóng, F-20 đo nhầm tháng 11; đã sửa script rồi mới lấy số đo sau).
- 0 page exception trong mọi tab kiểm (thường + giả lập clock + phone).

## KHÔNG LÀM (theo brief — để vòng sau nếu còn thời gian)

- Month-switcher lên header chung (chỉ Dashboard có nút đổi tháng).
- Đồng bộ tab bằng `storage` event (Ponytail #6).
- Goals sửa/xóa (Ponytail #4).
- Các mục khác ngoài brief (F-25/F-26/F-27 đã sửa ké 1 phần: F-27 xong cùng
  F-21; F-25/F-26/F-28/F-29 chưa đụng).
