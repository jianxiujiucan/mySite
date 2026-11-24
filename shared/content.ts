import type { CalligraphyWork, PhotoAlbum, Profile, Project } from "./types";

export const profile: Profile = {
  name: "静听风声",
  englishName: "NING JING",
  avatar: "/images/home/avatar.svg",
  introduction: [
    "这个网站用来整理我正在做的事情：项目、摄影，以及书法。项目记录想法如何变成可用的页面，摄影保存走过的片段，书法留下一笔一画。",
    "我喜欢清楚、耐看的表达，也愿意花时间把细节打磨好。这里不追求更新得很快，只把值得保留的内容慢慢收进来。",
    "欢迎从首页选择一个栏目，慢慢翻看。",
  ],
};

export const projects: Project[] = [
  {
    slug: "personal-site",
    title: "静听风声 · 个人主页",
    english: "PERSONAL SITE",
    summary: "以米白、墨黑与朱红构成的个人主页，收拢作品与生活记录。",
    description:
      "这是本站的设计与前端实现。主页只保留四个入口，内页围绕阅读与看图展开，让内容本身占据主要位置。",
    image: "/images/projects/personal-site.svg",
    features: ["Vue 3 与 TypeScript", "桌面与移动端适配", "MySQL 内容接口"],
    relatedRoute: "/about",
    relatedLabel: "查看个人简介",
  },
  {
    slug: "photo-journal",
    title: "摄影相册",
    english: "PHOTO JOURNAL",
    summary: "按主题整理照片，用缩略图、相册与灯箱串起浏览路径。",
    description:
      "相册首页采用类似朋友圈的多图缩略布局。进入主题后可以逐张查看，也可以打开灯箱，用按钮或键盘切换前后照片。",
    image: "/images/projects/photo-journal.svg",
    features: ["主题相册", "响应式图片网格", "键盘切换与焦点管理"],
    relatedRoute: "/photography",
    relatedLabel: "浏览摄影相册",
  },
  {
    slug: "calligraphy-archive",
    title: "书法练习档案",
    english: "CALLIGRAPHY ARCHIVE",
    summary: "以照片墙收纳字稿，让不同尺寸的作品自然排列。",
    description:
      "书法栏目使用多列照片墙保留作品的纸张比例。点击图片即可放大，并能连续翻看整组练习。",
    image: "/images/projects/calligraphy-archive.svg",
    features: ["多列照片墙", "连续放大浏览", "移动端双列布局"],
    relatedRoute: "/calligraphy",
    relatedLabel: "查看书法作品",
  },
];

export const albums: PhotoAlbum[] = [
  {
    slug: "mountain-light",
    title: "山间光线",
    subtitle: "山路、湖面与天色",
    photos: [
      {
        id: 1,
        src: "/images/photos/mountain-01.jpg",
        title: "湖岸",
        alt: "山间湖泊与远处的山峰",
      },
      {
        id: 2,
        src: "/images/photos/mountain-02.jpg",
        title: "山居",
        alt: "树林与山间房屋",
      },
      {
        id: 3,
        src: "/images/photos/mountain-03.jpg",
        title: "山谷",
        alt: "群山环抱的湖泊",
      },
      {
        id: 4,
        src: "/images/photos/mountain-04.jpg",
        title: "夜色",
        alt: "夜色中的雪山与星空",
      },
    ],
  },
  {
    slug: "city-walk",
    title: "城市漫步",
    subtitle: "街道、建筑与行人",
    photos: [
      {
        id: 5,
        src: "/images/photos/city-01.jpg",
        title: "街口",
        alt: "城市街道与建筑",
      },
      {
        id: 6,
        src: "/images/photos/city-02.jpg",
        title: "天际线",
        alt: "城市建筑组成的天际线",
      },
      {
        id: 7,
        src: "/images/photos/city-03.jpg",
        title: "高楼",
        alt: "仰视城市高层建筑",
      },
      {
        id: 8,
        src: "/images/photos/city-04.jpg",
        title: "入夜",
        alt: "夜幕中的城市灯光",
      },
    ],
  },
  {
    slug: "daily-fragments",
    title: "日常片段",
    subtitle: "桌面、咖啡与短暂停留",
    photos: [
      {
        id: 9,
        src: "/images/photos/daily-01.jpg",
        title: "一杯咖啡",
        alt: "桌面上的咖啡",
      },
      {
        id: 10,
        src: "/images/photos/daily-02.jpg",
        title: "工作桌",
        alt: "摆放着电脑与文具的桌面",
      },
      {
        id: 11,
        src: "/images/photos/daily-03.jpg",
        title: "窗边",
        alt: "窗边安静的生活一角",
      },
      {
        id: 12,
        src: "/images/photos/daily-04.jpg",
        title: "书页",
        alt: "桌面上的书籍与纸张",
      },
    ],
  },
];

export const calligraphyWorks: CalligraphyWork[] = [
  {
    slug: "ning-jing-zhi-yuan",
    title: "宁静致远",
    src: "/images/calligraphy/ning-jing.svg",
    alt: "宁静致远书法练习",
    ratio: "4 / 5",
  },
  {
    slug: "guan-shan",
    title: "观山",
    src: "/images/calligraphy/guan-shan.svg",
    alt: "观山书法练习",
    ratio: "3 / 4",
  },
  {
    slug: "ting-yu",
    title: "听雨",
    src: "/images/calligraphy/ting-yu.svg",
    alt: "听雨书法练习",
    ratio: "4 / 5",
  },
  {
    slug: "shou-zhuo",
    title: "守拙",
    src: "/images/calligraphy/shou-zhuo.svg",
    alt: "守拙书法练习",
    ratio: "1 / 1",
  },
  {
    slug: "xing-yun",
    title: "行云",
    src: "/images/calligraphy/xing-yun.svg",
    alt: "行云书法练习",
    ratio: "3 / 4",
  },
  {
    slug: "zhi-zu",
    title: "知足",
    src: "/images/calligraphy/zhi-zu.svg",
    alt: "知足书法练习",
    ratio: "4 / 5",
  },
];
