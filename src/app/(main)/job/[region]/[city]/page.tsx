import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Heart, ChevronRight } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-data";

export default async function JobRegionPage({
  params,
}: {
  params: Promise<{ region: string; city: string }>;
}) {
  const { region, city } = await params;
  const decodedRegion = decodeURIComponent(region);
  const decodedCity = decodeURIComponent(city);

  // Mock: 지역 필터 (city 가 "전체"면 region 매치만)
  const filtered =
    decodedCity === "전체"
      ? MOCK_JOBS.filter((j) => j.region === decodedRegion)
      : MOCK_JOBS.filter(
          (j) => j.region === decodedRegion && j.city === decodedCity,
        );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">홈</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/job" className="hover:text-primary">구인</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{decodedRegion}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{decodedCity}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {decodedRegion} {decodedCity} 구인
        </h1>
        <p className="text-sm text-muted-foreground">
          총 {filtered.length}개 공고 {filtered.length === 0 && "(이 지역은 아직 등록된 공고가 없어요)"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((job) => (
          <Link key={job.id} href={`/job/detail/${job.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div
                className="h-40 bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${job.images[0]})` }}
              />
              <CardContent className="p-4">
                <div className="flex gap-1 mb-2 flex-wrap">
                  {job.tags.slice(0, 2).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin className="w-3 h-3" />
                  {job.region} {job.city}
                </div>
                <div className="text-sm font-bold text-primary mb-2">{job.wage}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {job.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {job.favorites}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
