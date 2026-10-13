/**
 * 饌味軒 ZUN WEI XUAN — 菜單資料
 * 餐廳設定
 */
const RESTAURANT = {
  name: '饌味軒',
  nameEn: 'ZUN WEI XUAN',
  slogan: '一碗麵的溫度，一桌菜的記憶',
  phone: '02-2765-8800',
  address: '台北市信義區松智路 168 號 2 樓',
  hours: '平日 11:00 – 14:30 ／ 17:00 – 21:30（週一公休）',
  deliveryFee: 60,
  freeDeliveryOver: 800,
  serviceRate: 0.1,
};

/** 菜單分類 */
const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'signature', label: '招牌主餐' },
  { id: 'noodle', label: '麵食湯品' },
  { id: 'side', label: '小菜涼拌' },
  { id: 'drink', label: '飲品' },
  { id: 'dessert', label: '甜點' },
];

/** 菜單項目 */
const MENU = [
  // ── 招牌主餐 ──
  {
    id: 'beef-noodle',
    name: '招牌牛肉麵',
    desc: '澳洲牛腱慢燉 6 小時，紅燒醬汁入味，配溏心蛋與青菜，手工現拉細麵。',
    price: 280,
    cat: 'signature',
    img: 'images/dish-beef-noodle-soup.jpg',
    tag: '招牌',
    hot: true,
  },
  {
    id: 'ribeye-steak',
    name: '炙烤肋眼牛排',
    desc: '厚切 200g 肋眼，以大火炙烤鎖住肉汁，搭配手炸薯條與迷迭香海鹽。',
    price: 520,
    cat: 'signature',
    img: 'images/dish-ribeye-steak.jpg',
    tag: '人氣',
    hot: true,
  },
  {
    id: 'salmon',
    name: '香煎鮭魚佐莎莎',
    desc: '挪威鮮鮭魚兩面煎至金黃，佐墨西哥莎莎醬與時蔬，佐餐首選。',
    price: 420,
    cat: 'signature',
    img: 'images/dish-pan-seared-salmon.jpg',
    tag: '健康',
  },
  {
    id: 'salt-pepper-chicken',
    name: '台式鹽酥雞',
    desc: '雞腿肉裹地瓜粉現炸，外酥內嫩，灑上特調鹽酥與九層塔，附炸鮮椒。',
    price: 220,
    cat: 'signature',
    img: 'images/dish-salt-pepper-chicken.jpg',
    tag: '必點',
  },
  {
    id: 'avocado-salad',
    name: '酪梨時蔬沙拉',
    desc: '澳洲酪梨、綜合生菜、水波蛋與油醋汁，清爽開胃，低脂高蛋白。',
    price: 180,
    cat: 'signature',
    img: 'images/dish-avocado-salad.jpg',
    tag: '輕食',
  },

  // ── 麵食湯品 ──
  {
    id: 'shrimp-ramen',
    name: '鮮蝦荷包蛋拉麵',
    desc: '昆布鰹魚湯底，鋪上鮮蝦、溏心蛋、青豆苗與芝麻油，香氣濃郁。',
    price: 260,
    cat: 'noodle',
    img: 'images/dish-shrimp-ramen.jpg',
    tag: '人氣',
  },
  {
    id: 'miso-ramen',
    name: '味噌豚骨拉麩定食',
    desc: '濃郁豚骨湯頭佐信州味噌，配熊掌造型炸拉麩、蟹肉棒與溏心蛋，附白飯。',
    price: 320,
    cat: 'noodle',
    img: 'images/dish-miso-ramen.jpg',
    tag: '限定',
  },
  {
    id: 'seafood-fried-rice',
    name: '蝦仁蛋炒飯',
    desc: '以文武火翻炒米粒粒粒分明，加入蝦仁、雞腿肉、玉米與香菜。',
    price: 200,
    cat: 'noodle',
    img: 'images/dish-seafood-fried-rice.jpg',
    tag: '人氣',
  },
  {
    id: 'chow-mein',
    name: '港式豉油炒麵',
    desc: '生抽老抽炒香，配芽菜、洋蔥與肉絲，鑊氣十足，麵條根根分明。',
    price: 240,
    cat: 'noodle',
    img: 'images/dish-chow-mein.jpg',
  },

  // ── 小菜涼拌 ──
  {
    id: 'edamame',
    name: '鹽水毛豆',
    desc: '精選台灣毛豆，鹽水浸泡入味，剝殼直接下酒。',
    price: 90,
    cat: 'side',
    img: 'images/dish-avocado-salad.jpg',
  },
  {
    id: 'pickled-cabbage',
    name: '台式泡菜',
    desc: '白菜、鳳梨與泡辣椒發酵三天，酸甜開胃，店家自製。',
    price: 80,
    cat: 'side',
    img: 'images/dish-salt-pepper-chicken.jpg',
  },
  {
    id: 'garlic-fries',
    name: '蒜香脆薯',
    desc: '美式薯條淋蒜香醬汁與Parsley，現炸現送，外層酥脆內心綿密。',
    price: 120,
    cat: 'side',
    img: 'images/dish-ribeye-steak.jpg',
  },

  // ── 飲品 ──
  {
    id: 'coldbrew-tea',
    name: '冷泡四季春',
    desc: '文山包種茶冷泡 8 小時，清香回甘，無糖基底可另加糖漿。',
    price: 60,
    cat: 'drink',
    img: 'images/drink-coldbrew-tea.jpg',
  },
  {
    id: 'lemon-tea',
    name: '現打檸檬冬瓜',
    desc: '手工冬瓜糖 Slow Brew，檸檬現搾，退火消渴。',
    price: 90,
    cat: 'drink',
    img: 'images/drink-coldbrew-tea.jpg',
    tag: '人氣',
  },
  {
    id: 'sparkling-water',
    name: '義式氣泡水',
    desc: '進口天然氣泡水，冷藏後搭配餐點解膩。',
    price: 70,
    cat: 'drink',
    img: 'images/drink-coldbrew-tea.jpg',
  },

  // ── 甜點 ──
  {
    id: 'raspberry-cake',
    name: '覆盆子乳酪蛋糕',
    desc: '輕柔日式芝士蛋糕夾入覆盆子果醬，佐新鮮莓果，微酸不膩。',
    price: 150,
    cat: 'dessert',
    img: 'images/dessert-raspberry-cake.jpg',
    tag: '甜點',
  },
  {
    id: 'matcha-tiramisu',
    name: '抹茶提拉米蘇',
    desc: '宇治抹茶粉、馬斯卡彭與手指餅乾層層堆疊，冷藏後享用。',
    price: 160,
    cat: 'dessert',
    img: 'images/dessert-raspberry-cake.jpg',
  },
];