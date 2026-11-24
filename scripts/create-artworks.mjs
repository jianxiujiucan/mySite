import { mkdir, writeFile } from "node:fs/promises";

const paper = "#f7f3e9";
const ink = "#20211e";
const accent = "#c5523a";

const works = [
  { file: "ning-jing", chars: ["宁", "静", "致", "远"], height: 1000 },
  { file: "guan-shan", chars: ["观", "山"], height: 960 },
  { file: "ting-yu", chars: ["听", "雨"], height: 1000 },
  { file: "shou-zhuo", chars: ["守", "拙"], height: 800 },
  { file: "xing-yun", chars: ["行", "云"], height: 960 },
  { file: "zhi-zu", chars: ["知", "足"], height: 1000 },
];

await mkdir("web/public/images/calligraphy", { recursive: true });
await mkdir("web/public/images/projects", { recursive: true });

for (const [index, work] of works.entries()) {
  const fontSize = work.chars.length === 4 ? 190 : 270;
  const startY = work.chars.length === 4 ? 205 : 340;
  const step = work.chars.length === 4 ? 195 : 285;
  const characters = work.chars
    .map(
      (char, charIndex) =>
        `<text x="400" y="${startY + charIndex * step}" text-anchor="middle" font-family="KaiTi, STKaiti, SimSun, serif" font-size="${fontSize}" fill="${ink}">${char}</text>`,
    )
    .join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${work.height}">
  <rect width="800" height="${work.height}" fill="${paper}"/>
  <path d="M65 0V${work.height}M735 0V${work.height}" stroke="#d9d1c2" stroke-width="2"/>
  <path d="M0 70H800M0 ${work.height - 70}H800" stroke="#e2dbce" stroke-width="2"/>
  ${characters}
  <rect x="590" y="${work.height - 175}" width="70" height="70" rx="4" fill="${accent}"/>
  <text x="625" y="${work.height - 137}" text-anchor="middle" font-family="SimSun, serif" font-size="25" fill="${paper}">宁静</text>
  <text x="625" y="${work.height - 112}" text-anchor="middle" font-family="SimSun, serif" font-size="25" fill="${paper}">之印</text>
  <text x="90" y="${work.height - 85}" font-family="serif" font-size="18" fill="#777a71">练习 ${String(index + 1).padStart(2, "0")}</text>
</svg>`;
  await writeFile(`web/public/images/calligraphy/${work.file}.svg`, svg);
}

const projectSvgs = {
  "personal-site": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#e4e1d8"/>
    <rect x="110" y="90" width="980" height="620" rx="10" fill="#faf9f5"/>
    <path d="M110 160H1090" stroke="#20211e" stroke-width="3"/>
    <circle cx="160" cy="125" r="10" fill="#c5523a"/><circle cx="195" cy="125" r="10" fill="#a9b0a2"/>
    <circle cx="600" cy="280" r="75" fill="#e4e1d8"/><circle cx="600" cy="260" r="28" fill="#20211e"/>
    <path d="M540 335C550 300 575 290 600 290C625 290 650 300 660 335" fill="#c5523a"/>
    <path d="M450 390H750" stroke="#20211e" stroke-width="12"/>
    <path d="M510 425H690" stroke="#777a71" stroke-width="5"/>
    <g transform="translate(230 510)"><rect width="160" height="110" fill="#e4e1d8"/><rect x="195" width="160" height="110" fill="#e2e5df"/><rect x="390" width="160" height="110" fill="#e1e5e5"/><rect x="585" width="160" height="110" fill="#e8e1d9"/></g>
  </svg>`,
  "photo-journal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#e1e5e5"/>
    <rect x="95" y="85" width="1010" height="630" rx="10" fill="#faf9f5"/>
    <text x="150" y="175" font-family="serif" font-size="54" fill="#20211e">山间光线</text>
    <text x="150" y="215" font-family="sans-serif" font-size="18" letter-spacing="5" fill="#777a71">PHOTO JOURNAL</text>
    <g transform="translate(150 275)"><g><rect width="400" height="330" fill="#d8dedb"/><circle cx="290" cy="85" r="45" fill="#a9b0a2"/><path d="M0 280L150 95L265 235L330 155L400 245V330H0Z" fill="#c5523a"/><path d="M0 300L130 195L230 270L310 220L400 290V330H0Z" fill="#20211e"/></g><g transform="translate(440)"><rect width="400" height="155" fill="#e4e1d8"/><path d="M0 130L120 35L210 120L300 55L400 130V155H0Z" fill="#a9b0a2"/><rect y="175" width="400" height="155" fill="#e8e1d9"/><circle cx="95" cy="250" r="42" fill="#c5523a"/><path d="M0 330L150 225L250 305L330 245L400 300V330H0Z" fill="#20211e"/></g></g>
  </svg>`,
  "calligraphy-archive": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#e8e1d9"/>
    <rect x="105" y="80" width="990" height="640" rx="10" fill="#faf9f5"/>
    <g font-family="KaiTi, STKaiti, serif" text-anchor="middle" fill="#20211e"><text x="330" y="330" font-size="190">宁</text><text x="330" y="520" font-size="190">静</text><text x="600" y="310" font-size="155">观</text><text x="600" y="475" font-size="155">山</text><text x="855" y="340" font-size="180">听</text><text x="855" y="530" font-size="180">雨</text></g>
    <g fill="#c5523a"><rect x="405" y="555" width="55" height="55"/><rect x="655" y="510" width="55" height="55"/><rect x="915" y="565" width="55" height="55"/></g>
    <path d="M490 145V640M745 145V640" stroke="#d2d0c8" stroke-width="2"/>
  </svg>`,
};

for (const [name, svg] of Object.entries(projectSvgs)) {
  await writeFile(`web/public/images/projects/${name}.svg`, svg);
}
