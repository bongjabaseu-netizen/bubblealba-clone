/**
 * DB Seed — mock-data 기반 초기 데이터
 * 실행: npx prisma db seed
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ========== Users ==========
  const adminPw = await hash("admin1234", 10);
  const userPw = await hash("user1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bubble.clone" },
    update: {},
    create: {
      email: "admin@bubble.clone",
      name: "관리자",
      nickname: "관리자",
      password: adminPw,
      role: "ADMIN",
      region: "서울",
      points: 999999,
      phoneVerified: true,
      isAdult: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user@bubble.clone" },
    update: {},
    create: {
      email: "user@bubble.clone",
      name: "달빛언니",
      nickname: "달빛언니",
      password: userPw,
      role: "USER",
      region: "서울 강남구",
      points: 12450,
      phoneVerified: true,
      isAdult: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "busan@bubble.clone" },
    update: {},
    create: {
      email: "busan@bubble.clone",
      name: "부산갈매기",
      nickname: "부산갈매기",
      password: userPw,
      role: "USER",
      region: "부산 해운대구",
      points: 8320,
    },
  });

  const advertiser = await prisma.user.upsert({
    where: { email: "gn_public@bubble.clone" },
    update: {},
    create: {
      email: "gn_public@bubble.clone",
      name: "강남퍼블릭",
      nickname: "강남퍼블릭",
      password: userPw,
      role: "ADVERTISER",
      region: "서울 강남구",
      points: 0,
    },
  });

  // ========== Boards ==========
  const boards = await Promise.all(
    [
      { name: "자유", slug: "free", order: 1 },
      { name: "인기", slug: "popular", order: 2 },
      { name: "업체", slug: "company", order: 3 },
      { name: "질문", slug: "question", order: 4 },
    ].map((b) =>
      prisma.board.upsert({
        where: { slug: b.slug },
        update: {},
        create: { ...b, createdById: admin.id },
      })
    )
  );
  const freeBoard = boards[0];
  const popularBoard = boards[1];
  const questionBoard = boards[3];

  // ========== Jobs ==========
  const jobsData = [
    { title: "강남 하이퍼블릭 1등팀 손님1등 보장", region: "서울", city: "강남구", category: "hyperblick", wage: "티씨 20만원", company: "강남 엘리트", description: "신규/경력 모두 환영합니다. 마인드 좋으신 분 우대.", tags: '["무경험OK","의상지원","당일지급"]', views: 1247 },
    { title: "해운대 더그랜드룸 부산1번지 신규모집", region: "부산", city: "해운대구", category: "room", wage: "티씨 10만원", company: "더그랜드룸", description: "해운대 탑티어 업소. 텃세 없음.", tags: '["선납가능","텃세없음"]', views: 892 },
    { title: "수원 1등 가라오케 하이퍼블릭 손님1등", region: "경기", city: "수원시", category: "karaoke", wage: "티씨 15만원", company: "수원 스타", description: "수원권 탑 업소.", tags: '["신규혜택"]', views: 2103 },
    { title: "퍼팩트 1등팀 강훈 재일 직속 조판 Z팀", region: "서울", city: "강남구", category: "hyperblick", wage: "티씨 11만원", company: "퍼팩트", description: "강남권 최정상.", tags: '["고급손님"]', views: 3421 },
    { title: "임팩트 쩜오 헤메 렌 지원 퇴근시 티시바로지급", region: "서울", city: "송파구", category: "room", wage: "티씨 20만원", company: "임팩트", description: "퇴근시 바로 정산.", tags: '["당일정산"]', views: 567 },
    { title: "신규 퍼블릭 헤어메이크업 무료 지원 렌탈지원", region: "대전", city: "서구", category: "hyperblick", wage: "티씨 12만원", company: "대전 퍼블릭", description: "대전 신규 오픈.", tags: '["신규오픈","헤메지원"]', views: 421 },
    { title: "구구단 손님1등 S팀 종대", region: "서울", city: "종로구", category: "karaoke", wage: "티씨 20만원", company: "구구단", description: "종로권 탑.", tags: '["S팀확정"]', views: 1876 },
    { title: "ROOT 구 미션 스웨디시 마사지 테이블전향 언니들 환영", region: "서울", city: "강남구", category: "massage", wage: "시급 15만원", company: "ROOT", description: "스웨디시 전문.", tags: '["스웨디시"]', views: 934 },
    { title: "달토 A팀 대희", region: "서울", city: "강남구", category: "hyperblick", wage: "티씨 11만원", company: "달토", description: "강남 A팀 확정.", tags: '["A팀확정"]', views: 2567 },
    { title: "강남 토킹바 스킨십X 술강요X 40이상 꿀알바", region: "서울", city: "강남구", category: "bar", wage: "시급 3만원", company: "강남 토킹바", description: "40대 이상 환영.", tags: '["40대환영"]', views: 3211 },
  ];

  const jobs = await Promise.all(
    jobsData.map((j, i) =>
      prisma.job.create({
        data: { ...j, authorId: advertiser.id, displayOrder: (i + 1) * 10, images: `["https://picsum.photos/seed/j${i + 1}/400/300"]` },
      })
    )
  );

  // ========== Community Posts ==========
  const postsData = [
    { title: "몰카범들", content: "요즘 몰카 얘기 많이 나오는데 진짜 조심해야겠더라구요.", boardId: freeBoard.id, authorId: user1.id, views: 892, likes: 23 },
    { title: "돈없어서 간만이 출근하려구 했는데...", content: "한달 쉬다가 다시 나가려니까 무섭네요.", boardId: freeBoard.id, authorId: user2.id, views: 1234, likes: 45 },
    { title: "셔츠 꿀팁", content: "화이트 셔츠 변색 방지하는 법 공유해요.", boardId: popularBoard.id, authorId: user1.id, views: 3421, likes: 187 },
    { title: "ㄱㄱㄷ은 에이즈 터졌다매요 몰카는 무슨상황이에요", content: "풍문으로만 들어서 자세히 모르는데 아시는 분?", boardId: freeBoard.id, authorId: user2.id, views: 4532, likes: 89 },
    { title: "유앤미 ㄱㄱㄷ 첫출근 후기", content: "오늘 첫출근 다녀왔어요.", boardId: popularBoard.id, authorId: user1.id, views: 5421, likes: 245 },
    { title: "치열이 괜찮아 보이는데 치과 추천 좀", content: "강남권에서 교정 잘하는 치과 아시는 분?", boardId: questionBoard.id, authorId: user2.id, views: 876, likes: 12 },
  ];

  const posts = await Promise.all(postsData.map((p) => prisma.communityPost.create({ data: p })));

  // ========== Comments ==========
  await prisma.comment.createMany({
    data: [
      { content: "진짜 공감이요 ㅠㅠ", authorId: user1.id, postId: posts[0].id, likes: 12 },
      { content: "힘내세요. 다들 한번씩 겪는 거예요.", authorId: user2.id, postId: posts[0].id, likes: 8 },
      { content: "저도 그랬어요. 지금은 괜찮아졌어요 ㅎㅎ", authorId: user1.id, postId: posts[1].id, likes: 3 },
    ],
  });

  // ========== Notifications ==========
  await prisma.notification.createMany({
    data: [
      { type: "APPLY", title: "신청 완료", body: "강남 엘리트 공고에 신청이 접수됐어요.", userId: user1.id },
      { type: "MESSAGE", title: "새 메시지", body: "강남퍼블릭: 면접 시간 조율 가능하실까요?", userId: user1.id },
      { type: "LIKE", title: "좋아요", body: "셔츠 꿀팁에 23명이 좋아요를 눌렀어요.", userId: user1.id, read: true },
      { type: "SYSTEM", title: "포인트 적립", body: "출석 체크 포인트 100P 지급 완료", userId: user1.id, read: true },
    ],
  });

  // ========== Favorites & Applications ==========
  await prisma.favorite.createMany({
    data: jobs.slice(0, 3).map((j) => ({ userId: user1.id, jobId: j.id })),
  });

  await prisma.jobApplication.create({
    data: { userId: user1.id, jobId: jobs[0].id, status: "ACCEPTED", message: "지원합니다" },
  });

  // ========== Ad Packages ==========
  await prisma.adPackage.createMany({
    data: [
      { name: "1일 광고", durationDays: 1, price: 1200000, tier: "premium", description: "하루 동안 최상단 노출" },
      { name: "30일 광고", durationDays: 30, price: 400000, tier: "standard", description: "30일간 상단 노출 + GOLD 배지" },
      { name: "90일 광고", durationDays: 90, price: 990000, tier: "basic", description: "90일간 상단 노출 + GOLD 배지 + 추천" },
    ],
  });

  // ========== ChoiceTalk ==========
  const choiceRooms = [
    { name: "갤럭시", slug: "galaxy", roomCount: 20, memberCount: 28 },
    { name: "달리는토끼", slug: "running-rabbit", roomCount: 15, memberCount: 22 },
    { name: "도파민", slug: "dopamine", roomCount: 12, memberCount: 18 },
    { name: "엘리트", slug: "elite", roomCount: 8, memberCount: 14 },
    { name: "워라밸", slug: "worklife", roomCount: 6, memberCount: 10 },
  ];

  const createdRooms = await Promise.all(
    choiceRooms.map((r) =>
      prisma.choiceTalkRoom.upsert({
        where: { slug: r.slug },
        update: {},
        create: { ...r, ownerId: advertiser.id, lastMessageAt: new Date() },
      })
    )
  );

  // 각 방에 샘플 메시지 추가
  const sampleMessages = [
    "🌌 석촌동 158 오픈 맞출 가능",
    "💎 오늘 S급 언니 출근완료",
    "🔥 지금 바로 맞출 가능합니다",
    "✨ 신규 언니 입성! 프로필 확인하세요",
    "💫 금요일 대기 많아요 서두르세요",
  ];

  for (const room of createdRooms) {
    await prisma.choiceTalkMessage.createMany({
      data: sampleMessages.map((content, i) => ({
        content,
        roomId: room.id,
        authorId: advertiser.id,
        createdAt: new Date(Date.now() - (sampleMessages.length - i) * 3600000),
      })),
    });
  }

  console.log("✅ Seed 완료: users 4, boards 4, jobs 10, posts 6, comments 3, notifications 4, adPackages 3, choiceTalkRooms 5");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
