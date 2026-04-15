import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

(async () => {
  const admin = await p.user.findUnique({ where: { email: 'admin@bubble.clone' } });
  if (!admin) throw new Error('admin not found');

  // 기존 배너 삭제 후 새로 생성
  await p.bannerAd.deleteMany({});

  // 홈 최상단 (2개, 600x300)
  const imageTop = [
    { id: 'btop1', title: '강남 대형 룸싸롱 오픈!', imageUrl: 'https://picsum.photos/seed/ad1/600/300', description: '강남 신규 오픈. 선납/주급 가능.', phone: '02-1111-1111', address: '서울 강남구' },
    { id: 'btop2', title: '부산 해운대 하이퍼블릭', imageUrl: 'https://picsum.photos/seed/ad2/600/300', description: '해운대 탑 클래스 업소. 텃세 없음.', phone: '051-2222-2222', address: '부산 해운대구' },
  ];

  // 홈 두번째줄 (3개, 300x300)
  const imageMid = [
    { id: 'bmid1', title: '임팩트', imageUrl: 'https://picsum.photos/seed/ad3/300/300', description: '퇴근시 티시바로지급.', phone: '02-3333-3333', address: '서울 송파구' },
    { id: 'bmid2', title: '대전 퍼블릭', imageUrl: 'https://picsum.photos/seed/ad4/300/300', description: '대전 신규 오픈. 헤메지원.', phone: '042-4444-4444', address: '대전 서구' },
    { id: 'bmid3', title: '구구단', imageUrl: 'https://picsum.photos/seed/ad5/300/300', description: 'S팀 확정. 종로권 탑.', phone: '02-5555-5555', address: '서울 종로구' },
  ];

  // 홈 세번째줄 (4개, 200x200)
  const imageBot = [
    { id: 'bbot1', title: 'ROOT 마사지', imageUrl: 'https://picsum.photos/seed/ad6/200/200', description: '스웨디시 전문.', phone: '02-6666-6666', address: '서울 강남구' },
    { id: 'bbot2', title: '달토 A팀', imageUrl: 'https://picsum.photos/seed/ad7/200/200', description: '강남 A팀 확정.', phone: '02-7777-7777', address: '서울 강남구' },
    { id: 'bbot3', title: '강남 토킹바', imageUrl: 'https://picsum.photos/seed/ad8/200/200', description: '40대 이상 환영. 스킨십X.', phone: '02-8888-8888', address: '서울 강남구' },
    { id: 'bbot4', title: '신규 퍼블릭', imageUrl: 'https://picsum.photos/seed/ad9/200/200', description: '헤어메이크업 무료 지원.', phone: '02-9999-9999', address: '서울 마포구' },
  ];

  // 텍스트 롤링 (8개)
  const textRolling = [
    { id: 'trl1', text: '강남 엘리트 하이퍼블릭 1등팀 손님1등 보장 티씨20만' },
    { id: 'trl2', text: '해운대 더그랜드룸 부산1번지 신규모집 티씨10만' },
    { id: 'trl3', text: '수원 스타 가라오케 1등 손님1등 티씨15만' },
    { id: 'trl4', text: '퍼팩트 1등팀 강훈 재일 직속 조판 Z팀 티씨11만' },
    { id: 'trl5', text: '임팩트 쩜오 헤메 렌 지원 퇴근시 티시바로지급' },
    { id: 'trl6', text: '신규 퍼블릭 헤어메이크업 무료 지원 렌탈지원' },
    { id: 'trl7', text: '구구단 손님1등 S팀 종대 티씨20만' },
    { id: 'trl8', text: '강남 토킹바 스킨십X 40이상 꿀알바 시급3만' },
  ];

  // 애견샵 (6개, 300x300)
  const petsShop = [
    { id: 'pet1', title: '멍멍살롱 애견미용', imageUrl: 'https://picsum.photos/seed/pet1/300/300', description: '강남 최고의 애견미용 전문샵. 목욕, 미용, 스파까지 원스톱 서비스. 대형견도 가능합니다.', phone: '02-1234-5678', address: '서울 강남구 역삼동 123' },
    { id: 'pet2', title: '해피동물병원', imageUrl: 'https://picsum.photos/seed/pet2/300/300', description: '24시 응급진료 가능. 건강검진, 예방접종, 수술 전문. 15년 경력 수의사가 직접 진료합니다.', phone: '02-9876-5432', address: '서울 서초구 서초동 456' },
    { id: 'pet3', title: '펫푸드마켓', imageUrl: 'https://picsum.photos/seed/pet3/300/300', description: '프리미엄 사료, 수제간식, 영양제 전문 매장. 온라인 주문 당일배송.', phone: '1588-1234', address: '서울 마포구 상암동 789' },
    { id: 'pet4', title: '댕댕이미용 강남점', imageUrl: 'https://picsum.photos/seed/pet4/300/300', description: '소형견 전문 미용실. 테디컷, 하이바 전문. 예약제 운영.', phone: '02-5555-1234', address: '서울 강남구 신사동 234' },
    { id: 'pet5', title: '펫호텔위드', imageUrl: 'https://picsum.photos/seed/pet5/300/300', description: '여행갈 때 안심하고 맡기세요. CCTV 24시간 모니터링. 산책 서비스 포함.', phone: '02-7777-8888', address: '서울 송파구 잠실동 567' },
    { id: 'pet6', title: '펫스튜디오', imageUrl: 'https://picsum.photos/seed/pet6/300/300', description: '반려동물 전문 촬영. 가족사진, 프로필, 앨범 제작. 자연광 스튜디오.', phone: '02-3333-4444', address: '서울 용산구 이태원동 890' },
  ];

  // 법률상담 (6개, 300x300)
  const legalAd = [
    { id: 'leg1', title: '김변호사 법률사무소', imageUrl: 'https://picsum.photos/seed/leg1/300/300', description: '이혼, 상속, 부동산 분쟁 전문. 무료 초기상담 가능. 변호사 직접 상담.', phone: '02-1111-2222', address: '서울 서초구 법조타운' },
    { id: 'leg2', title: '법무법인 정의', imageUrl: 'https://picsum.photos/seed/leg2/300/300', description: '형사, 민사, 기업법무 전문. 승소율 95%. 야간상담 가능.', phone: '02-3333-4444', address: '서울 강남구 테헤란로' },
    { id: 'leg3', title: '노동법률센터', imageUrl: 'https://picsum.photos/seed/leg3/300/300', description: '부당해고, 임금체불, 산재 전문. 근로자 무료상담. 노무사 상주.', phone: '1600-5678', address: '서울 영등포구 여의도동' },
    { id: 'leg4', title: '박변호사 교통사고', imageUrl: 'https://picsum.photos/seed/leg4/300/300', description: '교통사고 전문. 보험금 청구, 합의, 소송 대리. 성공보수제.', phone: '02-5555-6666', address: '서울 마포구 공덕동' },
    { id: 'leg5', title: '가정법률상담소', imageUrl: 'https://picsum.photos/seed/leg5/300/300', description: '가정폭력, 이혼, 양육권 상담. 여성 변호사 상담 가능.', phone: '02-7777-8888', address: '서울 종로구 종로' },
    { id: 'leg6', title: '세무법인 한울', imageUrl: 'https://picsum.photos/seed/leg6/300/300', description: '세금, 상속세, 증여세 전문. 절세 전략 컨설팅.', phone: '02-9999-0000', address: '서울 강남구 삼성동' },
  ];

  // 미용실 (6개, 300x300) - BEAUTY_SALON
  const beautySalon = [
    { id: 'bea1', title: '헤어살롱 루나', imageUrl: 'https://picsum.photos/seed/bea1/300/300', description: '커트, 염색, 펌 전문. 트렌디한 스타일링. 두피관리 서비스. 예약 필수.', phone: '02-1234-1234', address: '서울 강남구 압구정동' },
    { id: 'bea2', title: '뷰티헤어 강남점', imageUrl: 'https://picsum.photos/seed/bea2/300/300', description: '웨딩헤어, 업스타일 전문. 메이크업 동시 가능. 출장 서비스.', phone: '02-5678-5678', address: '서울 강남구 논현동' },
    { id: 'bea3', title: '네츄럴헤어', imageUrl: 'https://picsum.photos/seed/bea3/300/300', description: '오가닉 염색 전문. 두피에 순한 천연 제품만 사용. 탈모 케어.', phone: '02-9012-9012', address: '서울 마포구 홍대입구' },
    { id: 'bea4', title: '바버샵 제임스', imageUrl: 'https://picsum.photos/seed/bea4/300/300', description: '남성 전문 바버샵. 페이드컷, 투블럭, 면도. 위스키 서비스.', phone: '02-3456-3456', address: '서울 용산구 이태원동' },
    { id: 'bea5', title: '헤어앤스파 릴렉스', imageUrl: 'https://picsum.photos/seed/bea5/300/300', description: '헤드스파, 두피관리, 탈모치료 전문. 프라이빗룸 완비.', phone: '02-7890-7890', address: '서울 서초구 방배동' },
    { id: 'bea6', title: '커트앤컬러 스튜디오', imageUrl: 'https://picsum.photos/seed/bea6/300/300', description: '컬러 전문 디자이너 상주. 발레아쥬, 옴브레, 하이라이트.', phone: '02-2345-2345', address: '서울 성동구 성수동' },
  ];

  // 네일아트 (6개)
  const beautyNail = [
    { id: 'nail1', title: '네일아트 프리티', imageUrl: 'https://picsum.photos/seed/nail1/300/300', description: '젤네일, 패디큐어 전문. 트렌디한 네일아트. 예약제.', phone: '02-1111-3333', address: '서울 강남구 신사동' },
    { id: 'nail2', title: '네일살롱 루비', imageUrl: 'https://picsum.photos/seed/nail2/300/300', description: '웨딩네일, 파츠아트, 그라데이션 전문.', phone: '02-2222-4444', address: '서울 마포구 홍대' },
    { id: 'nail3', title: '다이아네일', imageUrl: 'https://picsum.photos/seed/nail3/300/300', description: '손톱케어, 네일연장, 속눈썹 동시 가능.', phone: '02-3333-5555', address: '서울 서초구 잠원동' },
    { id: 'nail4', title: '블링네일', imageUrl: 'https://picsum.photos/seed/nail4/300/300', description: '캐릭터네일, 시즌네일, SNS 인기.', phone: '02-4444-6666', address: '서울 성동구 성수동' },
    { id: 'nail5', title: '네일바 소소', imageUrl: 'https://picsum.photos/seed/nail5/300/300', description: '심플네일, 오피스네일, 합리적 가격.', phone: '02-5555-7777', address: '서울 종로구 광화문' },
    { id: 'nail6', title: '아트네일 스튜디오', imageUrl: 'https://picsum.photos/seed/nail6/300/300', description: '핸드페인팅 전문. 작가 네일리스트.', phone: '02-6666-8888', address: '서울 용산구 한남동' },
  ];

  // 성형 (6개)
  const beautySurgery = [
    { id: 'surg1', title: '미래성형외과', imageUrl: 'https://picsum.photos/seed/surg1/300/300', description: '코성형, 눈성형 전문. 자연스러운 라인. 1:1 상담.', phone: '02-1234-9999', address: '서울 강남구 압구정로' },
    { id: 'surg2', title: '뷰티라인 의원', imageUrl: 'https://picsum.photos/seed/surg2/300/300', description: '쌍꺼풀, 지방흡입, 리프팅 전문.', phone: '02-5678-0000', address: '서울 강남구 신사동' },
    { id: 'surg3', title: '바노바기 성형외과', imageUrl: 'https://picsum.photos/seed/surg3/300/300', description: '윤곽수술, 안면거상, 피부과 동시 진료.', phone: '02-9012-1111', address: '서울 강남구 논현동' },
    { id: 'surg4', title: '나인성형외과', imageUrl: 'https://picsum.photos/seed/surg4/300/300', description: '가슴성형, 체형교정 전문. 여의사 상담.', phone: '02-3456-2222', address: '서울 서초구 방배동' },
    { id: 'surg5', title: '글로벌 피부과', imageUrl: 'https://picsum.photos/seed/surg5/300/300', description: '보톡스, 필러, 레이저 시술. 당일 시술 가능.', phone: '02-7890-3333', address: '서울 마포구 상암동' },
    { id: 'surg6', title: '에스라인 의원', imageUrl: 'https://picsum.photos/seed/surg6/300/300', description: '지방이식, 줄기세포 시술, 안티에이징.', phone: '02-2345-4444', address: '서울 강남구 삼성동' },
  ];

  const all = [
    ...imageTop.map((b, i) => ({ ...b, type: 'IMAGE_TOP' as const, order: i + 1, linkUrl: null, text: null })),
    ...imageMid.map((b, i) => ({ ...b, type: 'IMAGE_MID' as const, order: i + 1, linkUrl: null, text: null })),
    ...imageBot.map((b, i) => ({ ...b, type: 'IMAGE_BOT' as const, order: i + 1, linkUrl: null, text: null })),
    ...textRolling.map((b, i) => ({ ...b, type: 'TEXT_ROLLING' as const, order: i + 1, title: null, imageUrl: null, linkUrl: null, description: null, phone: null, address: null })),
    ...petsShop.map((b, i) => ({ ...b, type: 'PETS_SHOP' as const, order: i + 1, linkUrl: null, text: null })),
    ...legalAd.map((b, i) => ({ ...b, type: 'LEGAL_AD' as const, order: i + 1, linkUrl: null, text: null })),
    ...beautySalon.map((b, i) => ({ ...b, type: 'BEAUTY_SALON' as const, order: i + 1, linkUrl: null, text: null })),
    ...beautyNail.map((b, i) => ({ ...b, type: 'BEAUTY_NAIL' as const, order: i + 1, linkUrl: null, text: null })),
    ...beautySurgery.map((b, i) => ({ ...b, type: 'BEAUTY_SURGERY' as const, order: i + 1, linkUrl: null, text: null })),
  ];

  for (const b of all) {
    await p.bannerAd.create({
      data: {
        ...b,
        isActive: true,
        userId: admin.id,
      },
    });
  }

  const count = await p.bannerAd.count();
  console.log(`✅ 배너 ${count}개 생성 완료`);

  const byType = await p.bannerAd.groupBy({ by: ['type'], _count: true });
  byType.forEach(t => console.log(`  ${t.type}: ${t._count}`));

  process.exit(0);
})();
