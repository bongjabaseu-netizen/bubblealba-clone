import { readFileSync, writeFileSync } from "node:fs";
const M = "./shots/manifest.json";
const cur = JSON.parse(readFileSync(M, "utf8")); // 33개 (capture-all)
// 34~58 복원 (jpg 직접 식별 완료)
const S = "일반 사이트", ADV = "광고주", ADM = "관리자";
const add = [
  ["34", S, "출석체크", "/attendance"],
  ["35", ADV, "광고주 초이스톡", "/advertiser/choicetalk"],
  ["36", S, "미용 게시판", "/board/beauty"],
  ["37", S, "커뮤니티 글쓰기", "/community/write"],
  ["38", S, "미용 글쓰기", "/board/beauty/write"],
  ["39", S, "법률상담 글쓰기", "/board/legal-consult/write"],
  ["40", S, "애견 글쓰기", "/board/pets/write"],
  ["41", S, "부동산 글쓰기", "/board/realestate/write"],
  ["42", S, "커뮤니티 상세", "/community/detail/cmo01l59w000kbwu82125q5lc"],
  ["43", S, "초이스톡 워라밸", "/choicetalk/worklife"],
  ["44", S, "배너/샵 상세", "/banner/pet1"],
  ["45", S, "계정 설정", "/mypage/account"],
  ["46", S, "신청 내역", "/mypage/apply"],
  ["47", S, "즐겨찾기", "/mypage/favorite"],
  ["48", S, "포인트", "/mypage/point"],
  ["49", S, "스크랩", "/mypage/scrap"],
  ["50", S, "광고 구매", "/mypage/ad-center/buy"],
  ["51", S, "주문내역", "/mypage/ad-center/orders"],
  ["52", S, "광고프로필", "/mypage/ad-center/profile"],
  ["53", S, "약관 & 정책", "/legal"],
  ["54", S, "애견 공지", "/board/pets/notice"],
  ["55", ADM, "애견자랑 관리", "/admin/board/pets"],
  ["56", ADM, "법률상담 관리", "/admin/board/legal-consult"],
  ["57", ADM, "미용 관리", "/admin/board/beauty"],
  ["58", ADM, "운세 관리", "/admin/board/fortune"],
];
const byNum = new Map(cur.map(m => [m.num, m]));
for (const [num, section, label, path] of add) {
  byNum.set(num, { num, section, label, path, status: 200, file: `${num}.jpg` });
}
const full = [...byNum.values()].sort((a,b) => +a.num - +b.num);
writeFileSync(M, JSON.stringify(full, null, 2));
console.log("manifest 복원:", full.length, "화면");
