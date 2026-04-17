import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, HelpCircle } from "lucide-react";

const FAQ = [
  { q: "회원가입은 어떻게 하나요?", a: "우측 상단 '로그인' 버튼을 눌러 카카오, 네이버, 구글, 애플 중 원하는 방식으로 가입하시면 됩니다." },
  { q: "포인트는 어떻게 쌓나요?", a: "출석 체크, 게시물 작성, 친구 추천 등으로 적립되며, 프리미엄 공고 열람이나 채팅에 사용할 수 있습니다." },
  { q: "공고 등록은 어떻게 하나요?", a: "사업주 계정(ADVERTISER)으로 전환 후 공고 등록 버튼을 눌러주세요. 심사 후 노출됩니다." },
  { q: "허위 공고 신고는 어디서 하나요?", a: "각 공고 상세 페이지의 '신고' 버튼을 누르면 관리자가 확인합니다." },
  { q: "개인정보는 안전한가요?", a: "모든 개인정보는 암호화되어 저장되며, 제3자에게 절대 공유하지 않습니다." },
];

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">회사소개 & 고객센터</h1>
        <p className="text-muted-foreground">
          명품알바는 대한민국 No.1 여성 전용 구인 플랫폼입니다.
        </p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <Phone className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold mb-1">전화 상담</div>
            <div className="text-xs text-muted-foreground">평일 10:00~19:00</div>
            <div className="text-sm font-bold mt-2">1588-0000</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold mb-1">이메일</div>
            <div className="text-xs text-muted-foreground">24시간 접수</div>
            <div className="text-sm font-bold mt-2">help@bubble.clone</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-semibold mb-1">카톡 상담</div>
            <div className="text-xs text-muted-foreground">평일 실시간</div>
            <div className="text-sm font-bold mt-2">@명품알바</div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          자주 묻는 질문
        </h2>
        <Card>
          <div className="divide-y divide-border">
            {FAQ.map((f, i) => (
              <div key={i} className="p-4">
                <div className="font-semibold mb-2 flex items-start gap-2">
                  <span className="text-primary font-bold">Q.</span>
                  <span>{f.q}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-start gap-2 ml-5">
                  <span className="text-muted-foreground/70 font-bold">A.</span>
                  <span>{f.a}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
