/**
 * bubblealba 클론 — Mock 데이터 (UI 전용 프로토타입)
 * Phase 1 에 실제 DB 연결 후 Prisma 쿼리로 교체 예정
 */

export const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남",
  "경북", "경남", "제주",
];

export const CATEGORIES = [
  { id: "room", name: "룸싸롱", icon: "🎤" },
  { id: "karaoke", name: "가라오케", icon: "🎶" },
  { id: "hyperblick", name: "하이퍼블릭", icon: "✨" },
  { id: "massage", name: "마사지", icon: "💆" },
  { id: "bar", name: "바", icon: "🍸" },
  { id: "ten", name: "텐카페", icon: "🍷" },
  { id: "song", name: "노래주점", icon: "🎼" },
  { id: "office", name: "오피스텔", icon: "🏢" },
  { id: "etc", name: "기타", icon: "📋" },
];

export interface MockJob {
  id: string;
  title: string;
  region: string;
  city: string;
  category: string;
  wage: string;
  images: string[];
  company: string;
  description: string;
  tags: string[];
  createdAt: string;
  views: number;
  favorites: number;
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: "JZbvXKw3yl",
    title: "강남 하이퍼블릭 1등팀 손님1등 보장",
    region: "서울",
    city: "강남구",
    category: "hyperblick",
    wage: "일 15~35만원",
    images: ["https://picsum.photos/seed/j1/400/300"],
    company: "강남 엘리트",
    description:
      "신규/경력 모두 환영합니다. 마인드 좋으신 분 우대. 의상 무상 지원. 출퇴근 자유.",
    tags: ["무경험OK", "의상지원", "당일지급"],
    createdAt: "2시간 전",
    views: 1247,
    favorites: 38,
  },
  {
    id: "qjOQrvQc",
    title: "해운대 더그랜드룸 부산1번지 신규모집",
    region: "부산",
    city: "해운대구",
    category: "room",
    wage: "일 18~40만원",
    images: ["https://picsum.photos/seed/j2/400/300"],
    company: "더그랜드룸",
    description: "해운대 탑티어 업소. 텃세 없음. 선납/지원 가능.",
    tags: ["선납가능", "텃세없음"],
    createdAt: "5시간 전",
    views: 892,
    favorites: 22,
  },
  {
    id: "phcBDF9cdA",
    title: "수원 1등 가라오케 하이퍼블릭 손님1등",
    region: "경기",
    city: "수원시",
    category: "karaoke",
    wage: "일 12~30만원",
    images: ["https://picsum.photos/seed/j3/400/300"],
    company: "수원 스타",
    description: "수원권 탑 업소. 신규 혜택 多. 언니 관리 좋음.",
    tags: ["신규혜택", "관리체계"],
    createdAt: "1일 전",
    views: 2103,
    favorites: 67,
  },
  {
    id: "ziKoWzA1XO",
    title: "퍼팩트 1등팀 강훈 재일 직속 조판 Z팀",
    region: "서울",
    city: "강남구",
    category: "hyperblick",
    wage: "일 20~50만원",
    images: ["https://picsum.photos/seed/j4/400/300"],
    company: "퍼팩트",
    description: "강남권 최정상. 고급손님 위주. 관리 철저.",
    tags: ["고급손님", "관리철저"],
    createdAt: "1일 전",
    views: 3421,
    favorites: 112,
  },
  {
    id: "8FyizanVWI",
    title: "임팩트 쩜오 헤메 렌 지원 퇴근시 티시바로지급",
    region: "서울",
    city: "송파구",
    category: "room",
    wage: "일 10~25만원",
    images: ["https://picsum.photos/seed/j5/400/300"],
    company: "임팩트",
    description: "신규/기존 모두 환영. 퇴근시 바로 정산. 편안한 분위기.",
    tags: ["당일정산", "편안한분위기"],
    createdAt: "2일 전",
    views: 567,
    favorites: 15,
  },
  {
    id: "caEsNJlU",
    title: "신규 퍼블릭 헤어메이크업 무료 지원 렌탈지원",
    region: "대전",
    city: "서구",
    category: "hyperblick",
    wage: "일 12~28만원",
    images: ["https://picsum.photos/seed/j6/400/300"],
    company: "대전 퍼블릭",
    description: "대전 신규 오픈. 헤메/렌탈 전액 지원. 출퇴근 자유.",
    tags: ["신규오픈", "헤메지원"],
    createdAt: "3일 전",
    views: 421,
    favorites: 9,
  },
  {
    id: "vUi1rgvh",
    title: "구구단 손님1등 S팀 종대",
    region: "서울",
    city: "종로구",
    category: "karaoke",
    wage: "일 15~35만원",
    images: ["https://picsum.photos/seed/j7/400/300"],
    company: "구구단",
    description: "종로권 탑. S팀 확정. 당일 면접 가능.",
    tags: ["S팀확정", "당일면접"],
    createdAt: "3일 전",
    views: 1876,
    favorites: 54,
  },
  {
    id: "2g06EpSWEw",
    title: "ROOT 구 미션 스웨디시 마사지 테이블전향 언니들 환영",
    region: "서울",
    city: "강남구",
    category: "massage",
    wage: "일 18만원~",
    images: ["https://picsum.photos/seed/j8/400/300"],
    company: "ROOT",
    description: "스웨디시 전문. 테이블 전향자 대환영. 1시간 18만원.",
    tags: ["스웨디시", "테이블전향"],
    createdAt: "4일 전",
    views: 934,
    favorites: 28,
  },
  {
    id: "C1PdAikLpl",
    title: "달토 A팀 대희",
    region: "서울",
    city: "강남구",
    category: "hyperblick",
    wage: "일 20~45만원",
    images: ["https://picsum.photos/seed/j9/400/300"],
    company: "달토",
    description: "강남 A팀 확정. 고매출 보장. 경력자 우대.",
    tags: ["A팀확정", "고매출"],
    createdAt: "5일 전",
    views: 2567,
    favorites: 89,
  },
  {
    id: "A5fH7Q9ALq",
    title: "강남 토킹바 스킨십X 술강요X 40이상 꿀알바",
    region: "서울",
    city: "강남구",
    category: "bar",
    wage: "시급 3~5만원",
    images: ["https://picsum.photos/seed/j10/400/300"],
    company: "강남 토킹바",
    description: "40대 이상 언니들 환영. 토킹 위주. 술/스킨십 절대 없음.",
    tags: ["40대환영", "술X스킨십X"],
    createdAt: "1주 전",
    views: 3211,
    favorites: 143,
  },
];

export interface MockPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: "자유" | "인기" | "업체" | "질문";
  views: number;
  likes: number;
  commentCount: number;
  createdAt: string;
}

export const MOCK_POSTS: MockPost[] = [
  {
    id: "sHx4XIIKvD",
    title: "몰카범들",
    content:
      "요즘 몰카 얘기 많이 나오는데 진짜 조심해야겠더라구요. 다들 탈의실 꼭 확인하세요.",
    author: "익명123",
    authorAvatar: "https://i.pravatar.cc/80?img=1",
    category: "자유",
    views: 892,
    likes: 23,
    commentCount: 15,
    createdAt: "2시간 전",
  },
  {
    id: "iQEvUoyQMX",
    title: "돈없어서 간만이 출근하려구 했는데...",
    content: "한달 쉬다가 다시 나가려니까 무섭네요. 다들 어떻게 극복하셨어요?",
    author: "쉬다가복귀",
    authorAvatar: "https://i.pravatar.cc/80?img=2",
    category: "자유",
    views: 1234,
    likes: 45,
    commentCount: 32,
    createdAt: "4시간 전",
  },
  {
    id: "jS82mDgzZN",
    title: "셔츠 꿀팁",
    content: "화이트 셔츠 변색 방지하는 법 공유해요. 알콜솜 + 찬물 린스.",
    author: "꿀팁언니",
    authorAvatar: "https://i.pravatar.cc/80?img=3",
    category: "인기",
    views: 3421,
    likes: 187,
    commentCount: 52,
    createdAt: "6시간 전",
  },
  {
    id: "lowNSL4IEJ",
    title: "ㄱㄱㄷ은 에이즈 터졌다매요 몰카는 무슨상황이에요",
    content: "풍문으로만 들어서 자세히 모르는데 아시는 분?",
    author: "궁금이",
    authorAvatar: "https://i.pravatar.cc/80?img=4",
    category: "자유",
    views: 4532,
    likes: 89,
    commentCount: 76,
    createdAt: "8시간 전",
  },
  {
    id: "RY8Ww5ICqZ",
    title: "돈내는 사람이 왜 이렇게 싸가지 없죠",
    content: "손님 진상 후기. 이런 사람 또 만날까봐 무서워요.",
    author: "속상해",
    authorAvatar: "https://i.pravatar.cc/80?img=5",
    category: "자유",
    views: 2876,
    likes: 134,
    commentCount: 67,
    createdAt: "10시간 전",
  },
  {
    id: "CRxFfqIucQ",
    title: "유앤미 ㄱㄱㄷ 첫출근 후기",
    content: "오늘 첫출근 다녀왔어요. 언니들도 다들 친절하시고 만족스러워요.",
    author: "신규언니",
    authorAvatar: "https://i.pravatar.cc/80?img=6",
    category: "인기",
    views: 5421,
    likes: 245,
    commentCount: 89,
    createdAt: "12시간 전",
  },
  {
    id: "idZIAmFtNC",
    title: "치열이 괜찮아 보이는데 치과 추천 좀",
    content: "강남권에서 교정 잘하는 치과 아시는 분 계세요?",
    author: "건강관리",
    authorAvatar: "https://i.pravatar.cc/80?img=7",
    category: "질문",
    views: 876,
    likes: 12,
    commentCount: 23,
    createdAt: "1일 전",
  },
];

export interface MockUser {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  region: string;
  points: number;
  role: "USER" | "ADVERTISER" | "ADMIN";
  createdAt: string;
  lastLogin: string;
}

export const MOCK_CURRENT_USER: MockUser = {
  id: "u_001",
  nickname: "달빛언니",
  email: "moonlight@example.com",
  avatar: "https://i.pravatar.cc/120?img=16",
  region: "서울 강남구",
  points: 12450,
  role: "USER",
  createdAt: "2025-11-23",
  lastLogin: "방금 전",
};

export const MOCK_USERS: MockUser[] = [
  MOCK_CURRENT_USER,
  {
    id: "u_002",
    nickname: "부산갈매기",
    email: "busan@example.com",
    avatar: "https://i.pravatar.cc/120?img=20",
    region: "부산 해운대구",
    points: 8320,
    role: "USER",
    createdAt: "2025-09-15",
    lastLogin: "10분 전",
  },
  {
    id: "u_003",
    nickname: "강남퍼블릭",
    email: "gn_public@example.com",
    avatar: "https://i.pravatar.cc/120?img=30",
    region: "서울 강남구",
    points: 0,
    role: "ADVERTISER",
    createdAt: "2025-06-10",
    lastLogin: "1시간 전",
  },
  {
    id: "u_004",
    nickname: "관리자",
    email: "admin@bubble.clone",
    avatar: "https://i.pravatar.cc/120?img=68",
    region: "서울",
    points: 999999,
    role: "ADMIN",
    createdAt: "2025-01-01",
    lastLogin: "5분 전",
  },
  {
    id: "u_005",
    nickname: "대전언니",
    email: "daejeon@example.com",
    avatar: "https://i.pravatar.cc/120?img=25",
    region: "대전 서구",
    points: 3450,
    role: "USER",
    createdAt: "2026-01-08",
    lastLogin: "3일 전",
  },
  {
    id: "u_006",
    nickname: "해운대사라",
    email: "sara@example.com",
    avatar: "https://i.pravatar.cc/120?img=47",
    region: "부산 해운대구",
    points: 15230,
    role: "USER",
    createdAt: "2025-03-22",
    lastLogin: "30분 전",
  },
];

export interface MockNotification {
  id: string;
  type: "apply" | "message" | "system" | "like";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n_01",
    type: "apply",
    title: "신청 완료",
    body: "강남 엘리트 공고에 신청이 접수됐어요.",
    createdAt: "5분 전",
    read: false,
  },
  {
    id: "n_02",
    type: "message",
    title: "새 메시지",
    body: "강남퍼블릭: 면접 시간 조율 가능하실까요?",
    createdAt: "1시간 전",
    read: false,
  },
  {
    id: "n_03",
    type: "like",
    title: "좋아요",
    body: "회원님의 게시글 '셔츠 꿀팁'에 23명이 좋아요를 눌렀어요.",
    createdAt: "3시간 전",
    read: true,
  },
  {
    id: "n_04",
    type: "system",
    title: "포인트 적립",
    body: "출석 체크 포인트 100P 지급 완료",
    createdAt: "1일 전",
    read: true,
  },
  {
    id: "n_05",
    type: "apply",
    title: "신청 대기",
    body: "해운대 더그랜드룸 공고에 신청 대기 중입니다.",
    createdAt: "2일 전",
    read: true,
  },
];

export interface MockChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  avatar: string;
}

export const MOCK_CHATS: MockChatRoom[] = [
  {
    id: "c_01",
    name: "강남퍼블릭",
    lastMessage: "네 내일 7시에 뵙겠습니다",
    lastAt: "방금",
    unread: 2,
    avatar: "https://i.pravatar.cc/80?img=30",
  },
  {
    id: "c_02",
    name: "해운대 더그랜드룸",
    lastMessage: "사진 확인 부탁드려요",
    lastAt: "1시간 전",
    unread: 0,
    avatar: "https://i.pravatar.cc/80?img=33",
  },
  {
    id: "c_03",
    name: "수원 스타",
    lastMessage: "감사합니다 😊",
    lastAt: "어제",
    unread: 0,
    avatar: "https://i.pravatar.cc/80?img=36",
  },
];

export interface MockMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

export const MOCK_MESSAGES: MockMessage[] = [
  { id: "m1", fromMe: false, text: "안녕하세요. 이력서 봤습니다.", time: "14:20" },
  { id: "m2", fromMe: true, text: "네 안녕하세요!", time: "14:22" },
  { id: "m3", fromMe: false, text: "내일 저녁에 면접 가능하실까요?", time: "14:23" },
  { id: "m4", fromMe: true, text: "네 몇 시에 가면 될까요?", time: "14:25" },
  { id: "m5", fromMe: false, text: "7시에 오시면 됩니다. 위치는 강남역 3번 출구 근처예요.", time: "14:26" },
  { id: "m6", fromMe: true, text: "네 내일 7시에 뵙겠습니다", time: "14:28" },
];

export interface MockComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export const MOCK_COMMENTS: MockComment[] = [
  {
    id: "cm1",
    author: "달빛언니",
    avatar: "https://i.pravatar.cc/80?img=16",
    content: "진짜 공감이요 ㅠㅠ 저도 얼마전에 비슷한 일 있었어요",
    createdAt: "1시간 전",
    likes: 12,
  },
  {
    id: "cm2",
    author: "부산갈매기",
    avatar: "https://i.pravatar.cc/80?img=20",
    content: "힘내세요. 다들 한번씩 겪는 거예요.",
    createdAt: "30분 전",
    likes: 8,
  },
  {
    id: "cm3",
    author: "대전언니",
    avatar: "https://i.pravatar.cc/80?img=25",
    content: "저도 그랬어요. 지금은 괜찮아졌어요 ㅎㅎ",
    createdAt: "15분 전",
    likes: 3,
  },
];

export interface MockReport {
  id: string;
  type: "job" | "post" | "user";
  targetId: string;
  targetTitle: string;
  reason: string;
  reporter: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

export const MOCK_REPORTS: MockReport[] = [
  {
    id: "r_01",
    type: "job",
    targetId: "JZbvXKw3yl",
    targetTitle: "강남 하이퍼블릭 1등팀 손님1등 보장",
    reason: "허위 광고 의심",
    reporter: "user_042",
    status: "pending",
    createdAt: "10분 전",
  },
  {
    id: "r_02",
    type: "post",
    targetId: "CRxFfqIucQ",
    targetTitle: "유앤미 ㄱㄱㄷ 첫출근 후기",
    reason: "욕설/비방",
    reporter: "user_118",
    status: "pending",
    createdAt: "1시간 전",
  },
  {
    id: "r_03",
    type: "user",
    targetId: "u_099",
    targetTitle: "스팸광고계정",
    reason: "스팸 DM",
    reporter: "user_023",
    status: "resolved",
    createdAt: "2일 전",
  },
];

export const ADMIN_STATS = {
  totalUsers: 12847,
  totalJobs: 3421,
  totalPosts: 8923,
  pendingReports: 14,
  todayVisits: 45120,
  todaySignups: 87,
  todayJobs: 32,
  todayPosts: 143,
};
