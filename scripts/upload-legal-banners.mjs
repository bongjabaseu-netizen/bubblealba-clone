/** 법률상담 배너 5개 Cloudinary 업로드 + DB 등록 스크립트 */
import { v2 as cloudinary } from "cloudinary";
import { readFileSync } from "fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BANNERS = [
  {
    file: "C:/Users/user/Downloads/law_banner_10.png",
    title: "상속 전문 법률 상담",
    description: "유언장 / 상속분쟁 / 유산분할 전문 법률 상담",
    phone: "1661-5500",
    linkUrl: "https://www.koreanfamilylaw.com",
    order: 1,
  },
  {
    file: "C:/Users/user/Downloads/law_banner_09.png",
    title: "의료사고 전문 변호사",
    description: "의료분쟁 / 의료과실 피해보상 무료 상담 신청",
    phone: null,
    linkUrl: null,
    order: 2,
  },
  {
    file: "C:/Users/user/Downloads/law_banner_05.png",
    title: "노동법 전문 상담",
    description: "부당해고 / 임금체불 해결 — 한솔 법률사무소",
    phone: null,
    linkUrl: null,
    order: 3,
  },
  {
    file: "C:/Users/user/Downloads/law_banner_03.png",
    title: "형사 전문 변호사",
    description: "무죄 판결 전문 — 김앤장 법률사무소",
    phone: null,
    linkUrl: null,
    order: 4,
  },
  {
    file: "C:/Users/user/Downloads/law_banner_01.png",
    title: "법률상담 무료",
    description: "변호사 직접 상담",
    phone: "1588-0000",
    linkUrl: null,
    order: 5,
  },
];

// 관리자 유저 찾기
const admin = await prisma.user.findFirst({ where: { loginId: "adm" } });
if (!admin) {
  console.error("관리자 계정(adm)을 찾을 수 없습니다");
  process.exit(1);
}
console.log(`관리자: ${admin.nickname} (${admin.id})`);

for (const banner of BANNERS) {
  console.log(`\n업로드 중: ${banner.title}`);

  // Cloudinary 업로드
  const buffer = readFileSync(banner.file);
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bubblealba/banners", resource_type: "image" },
      (error, res) => {
        if (error || !res) return reject(error ?? new Error("upload failed"));
        resolve(res);
      }
    );
    stream.end(buffer);
  });

  console.log(`  Cloudinary URL: ${result.secure_url}`);

  // DB 등록
  await prisma.bannerAd.create({
    data: {
      type: "LEGAL_AD",
      title: banner.title,
      imageUrl: result.secure_url,
      linkUrl: banner.linkUrl,
      description: banner.description,
      phone: banner.phone,
      order: banner.order,
      isActive: true,
      userId: admin.id,
    },
  });
  console.log(`  DB 등록 완료!`);
}

console.log("\n=== 법률상담 배너 5개 등록 완료 ===");
await prisma.$disconnect();
