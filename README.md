# 🍜 饌味軒 ZUN WEI XUAN — 餐飲線上點餐網站

一個以 **純前端 HTML / CSS / JavaScript** 打造的響應式餐飲點餐網站。
沒有框架、沒有建置步驟，clone 下來就能直接用瀏覽器開啟。

---

## ✨ 功能特色

| 功能 | 說明 |
| --- | --- |
| 🗂️ 分類瀏覽 | 招牌主餐 / 麵食湯品 / 小菜涼拌 / 飲品 / 甜點 共 5 類 17 道 |
| 🛒 購物車 | 抽屜式購物車，即時小計、服務費、外送費與總計 |
| 🔢 數量步進器 | 每道菜可直接 +/−，數量上限 99 |
| 📦 配送與自取 | 切換外送／自取，費用即時重算，外送滿 800 免運 |
| ✅ 表單驗證 | 姓名、電話格式、地址必填檢查 |
| 🧾 訂單完成 | 產生訂單編號與訂單明細摘要 |
| 💾 購物車持久化 | 以 `localStorage` 保存，重新整理不會遺失 |
| 🖼️ 完整相簿 | 11 張實拍照片瀑布式版面 |
| 📱 響應式 | 桌機 / 平板 / 手機三種斷點 |
| ♿ 無障礙 | 鍵盤操作、焦點鎖定於抽屜、Esc 關閉、`aria-*` 標記、`prefers-reduced-motion` 支援 |
| 🎬 動效 | 滾動淡入、Hero 緩慢推近、Toast 提示 |

> **Lighthouse 分數：無障礙 100 ／ 最佳實務 100 ／ SEO 100**

---

## 🚀 快速開始

### 方式一：直接開檔

```
雙擊 index.html
```

### 方式二：本地伺服器（建議）

```bash
# 選一種
npx serve .
python -m http.server 8000
```

然後開啟 <http://localhost:8000>

---

## 📁 專案結構

```
restaurant-ordering/
├── index.html          # 單頁主體
├── css/
│   └── style.css       # 樣式（CSS 變數 + RWD）
├── js/
│   ├── data.js         # 餐廳設定 + 菜單資料（改這裡就能換菜單）
│   └── app.js          # 點購、購物車、驗證、結帳邏輯
├── images/             # 12 張餐點照片（相簿區使用其中 11 張）
├── README.md
├── LICENSE
└── .gitignore
```

---

## ✏️ 如何修改

### 換菜單
編輯 `js/data.js`，照著既有格式新增或修改：

```js
{
  id: 'dish-id',                    // 唯一代碼
  name: '菜名',
  desc: '描述文字',
  price: 280,                       // 數字，單位為元
  cat: 'signature',                 // 對應 CATEGORIES 的 id
  img: 'images/your-photo.jpg',
  tag: '招牌',                      // 可選，左上角標籤
  hot: true,                        // 可選，標籤改用橘色
}
```

### 換餐廳設定
同檔案頂端的 `RESTAURANT`：

```js
const RESTAURANT = {
  name: '你的店名',
  deliveryFee: 60,          // 外送費
  freeDeliveryOver: 800,    // 免運門檻
  serviceRate: 0.1,         // 服務費比例
};
```

### 換配色
編輯 `css/style.css` 最上方的 `:root` 變數：

```css
:root {
  --brand: #b3341f;   /* 主色 */
  --gold:  #c08a3e;   /* 輔色 */
  --bg:    #fdfbf8;   /* 背景 */
}
```

---

## 🧮 費用計算

```
外送費 = (小計 < 免運門檻 且 為外送) ? deliveryFee : 0
服務費 = round(小計 × serviceRate)
總計   = 小計 + 服務費 + 外送費
```

自取不收外送費；外送滿 800 元免運。

---

## 🌐 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "feat: 餐飲線上點餐網站"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<倉庫名>.git
git push -u origin main
```

接著到 **Settings → Pages → Source 選 `main` 分支、根目錄 `/`**，幾秒後網址就會是：

```
https://<你的帳號>.github.io/<倉庫名>/
```

---

## 🖼️ 圖片來源

全部餐點照片取自 [Unsplash](https://unsplash.com)，依
[Unsplash License](https://unsplash.com/license) 使用（可免費商用、無需署名）。
本網站為示範／作品集用途。

---

## 🧰 瀏覽器支援

Chrome / Edge / Firefox / Safari 最新兩個版本。
使用了 `100dvh`、`backdrop-filter`、CSS `:has()`，舊版瀏覽器會有輕微退化成原始樣式，但功能仍可正常使用。

---

## 📝 授權

程式碼以 [MIT License](LICENSE) 釋出。