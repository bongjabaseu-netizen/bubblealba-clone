import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">약관 & 정책</h1>

      <Tabs defaultValue="terms">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="terms">이용약관</TabsTrigger>
          <TabsTrigger value="privacy">개인정보처리방침</TabsTrigger>
          <TabsTrigger value="youth">청소년보호정책</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardContent className="p-6 prose prose-sm max-w-none">
              <h2 className="text-lg font-bold mb-3">제1조 (목적)</h2>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                본 약관은 명품알바(이하 "회사")가 제공하는 인터넷 서비스의 이용조건 및 절차, 이용자와 회사의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
              <h2 className="text-lg font-bold mb-3">제2조 (용어의 정의)</h2>
              <ul className="text-sm text-foreground space-y-1 mb-4 list-disc pl-5">
                <li>이용자: 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원</li>
                <li>회원: 회사와 서비스 이용계약을 체결하고 아이디(ID)를 부여받은 이용자</li>
                <li>비회원: 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자</li>
              </ul>
              <h2 className="text-lg font-bold mb-3">제3조 (약관의 효력 및 변경)</h2>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                본 약관은 서비스 초기 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-6 text-right">
                본 약관은 2026년 4월 11일부터 시행됩니다. (버전 1.0)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-3">1. 수집하는 개인정보 항목</h2>
              <p className="text-sm text-foreground mb-4">
                회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              </p>
              <ul className="text-sm text-foreground space-y-1 mb-4 list-disc pl-5">
                <li>필수: 이메일, 닉네임, 비밀번호</li>
                <li>선택: 프로필 이미지, 활동 지역, 휴대전화</li>
                <li>자동 수집: 접속 IP, 쿠키, 서비스 이용 기록</li>
              </ul>
              <h2 className="text-lg font-bold mb-3">2. 개인정보의 이용목적</h2>
              <ul className="text-sm text-foreground space-y-1 list-disc pl-5 mb-4">
                <li>회원 관리 및 본인 확인</li>
                <li>맞춤 서비스 제공 및 통계 분석</li>
                <li>불량 회원 부정 이용 방지</li>
              </ul>
              <h2 className="text-lg font-bold mb-3">3. 개인정보의 보유 및 이용기간</h2>
              <p className="text-sm text-foreground mb-4">
                원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="youth">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-3">청소년보호정책</h2>
              <p className="text-sm text-foreground mb-4">
                본 사이트는 만 19세 미만 청소년의 이용을 제한합니다. 만 19세 이상의 성인만 회원가입 및 서비스 이용이 가능하며, 회원가입 시 본인인증을 통해 연령을 확인합니다.
              </p>
              <p className="text-xs text-muted-foreground">
                청소년 유해 정보로부터 청소년을 보호하기 위해 청소년보호법에 따라 본 정책을 수립하여 시행하고 있습니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
