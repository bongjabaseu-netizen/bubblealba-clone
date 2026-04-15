/** 관리자 배너 — 생성/토글/삭제 + 사이즈 안내 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminCreateBanner, adminToggleBanner, adminDeleteBanner } from "@/lib/actions/banners";
import { ImageUploader } from "@/components/ImageUploader";

const BANNER_TYPES = [
  { value: "IMAGE_TOP", label: "홈 최상단 (2개, 600x300)", desc: "홈 상단 큰 가로 배너. 권장 600x300px. 2개까지." },
  { value: "IMAGE_MID", label: "홈 두번째줄 (3개, 300x300)", desc: "홈 중간 정사각 배너. 권장 300x300px. 3개까지." },
  { value: "IMAGE_BOT", label: "홈 세번째줄 (4개, 200x200)", desc: "홈 하단 작은 배너. 권장 200x200px. 4개까지." },
  { value: "TEXT_ROLLING", label: "홈 텍스트 롤링", desc: "홈 텍스트 롤링 광고. 이미지 없이 텍스트만." },
  { value: "PETS_SHOP", label: "애견자랑 배너 (3x2, 300x300)", desc: "애견자랑 상단 배너. 권장 300x300px. 6개까지." },
  { value: "LEGAL_AD", label: "법률상담 배너 (3x2, 300x300)", desc: "법률상담 상단 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_SALON", label: "미용실 배너 (3x2, 300x300)", desc: "미용 > 미용실 탭 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_NAIL", label: "네일아트 배너 (3x2, 300x300)", desc: "미용 > 네일아트 탭 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_SURGERY", label: "성형 배너 (3x2, 300x300)", desc: "미용 > 성형 탭 배너. 권장 300x300px. 6개까지." },
];

const TYPE_LABEL: Record<string, string> = {};
BANNER_TYPES.forEach(t => TYPE_LABEL[t.value] = t.label);

interface Banner {
  id: string; type: string; title: string | null; imageUrl: string | null;
  linkUrl: string | null; text: string | null; description: string | null;
  phone: string | null; address: string | null; order: number; isActive: boolean;
  createdAt: Date; user: { nickname: string | null };
}

export function BannerAdmin({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("IMAGE_TOP");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [imageUrl, setImageUrl] = useState("");

  const filtered = filter === "ALL" ? banners : banners.filter(b => b.type === filter);
  const typeInfo = BANNER_TYPES.find(t => t.value === selectedType);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", imageUrl);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await adminCreateBanner(formData);
      if (result?.error) setError(result.error);
      else { form.reset(); setImageUrl(""); setShowForm(false); router.refresh(); }
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => { await adminToggleBanner(id); router.refresh(); });
  }

  function handleDelete(id: string, title: string | null) {
    if (!confirm(`"${title ?? "배너"}" 삭제하시겠습니까?`)) return;
    startTransition(async () => { await adminDeleteBanner(id); router.refresh(); });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">배너 관리</h1>
          <p className="text-sm text-slate-500">{banners.length}개 배너</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
          {showForm ? "취소" : "+ 배너 등록"}
        </button>
      </div>

      {/* 사이즈 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 text-sm mb-2">📐 배너 이미지 사이즈 안내</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
          <div>• 홈 최상단: <b>600x300px</b> (2개)</div>
          <div>• 홈 두번째줄: <b>300x300px</b> (3개)</div>
          <div>• 홈 세번째줄: <b>200x200px</b> (4개)</div>
          <div>• 텍스트 롤링: 텍스트만</div>
          <div>• 애견/법률/미용 배너: <b>300x300px</b> (6개)</div>
          <div>• 큰 이미지도 자동 리사이징됨</div>
        </div>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">새 배너 등록</h2>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="text-sm text-slate-600">배너 타입 *</label>
            <select name="type" value={selectedType} onChange={e => setSelectedType(e.target.value)} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
              {BANNER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1">{typeInfo?.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">제목</label>
              <input name="title" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="배너 제목" />
            </div>
            <div>
              <label className="text-sm text-slate-600">순서</label>
              <input name="order" type="number" defaultValue={0} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          {selectedType !== "TEXT_ROLLING" && (
            <div>
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                folder="banners"
                label="이미지 * (파일 업로드)"
              />
            </div>
          )}

          {selectedType === "TEXT_ROLLING" && (
            <div>
              <label className="text-sm text-slate-600">롤링 텍스트 *</label>
              <input name="text" required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="광고 텍스트" />
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600">외부 링크 URL (비우면 상세페이지로)</label>
            <input name="linkUrl" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
          </div>

          {selectedType !== "TEXT_ROLLING" && (
            <>
              <div>
                <label className="text-sm text-slate-600">상세 설명</label>
                <textarea name="description" rows={3} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="배너 클릭 시 보이는 상세 내용" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">전화번호</label>
                  <input name="phone" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="02-1234-5678" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">주소</label>
                  <input name="address" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="서울 강남구 ..." />
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={isPending} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {isPending ? "등록 중..." : "배너 등록"}
          </button>
        </form>
      )}

      {/* 필터 탭 */}
      <div className="flex gap-2 flex-wrap">
        <FilterBtn label="전체" value="ALL" current={filter} onClick={setFilter} count={banners.length} />
        {BANNER_TYPES.map(t => {
          const cnt = banners.filter(b => b.type === t.value).length;
          if (cnt === 0) return null;
          return <FilterBtn key={t.value} label={t.label.split(" (")[0]} value={t.value} current={filter} onClick={setFilter} count={cnt} />;
        })}
      </div>

      {/* 배너 리스트 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">배너</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">타입</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">제목/텍스트</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">순서</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">상태</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  {b.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                      <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">TXT</div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{TYPE_LABEL[b.type] ?? b.type}</td>
                <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">{b.title ?? b.text ?? "-"}</td>
                <td className="px-4 py-3 text-center text-slate-500">{b.order}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleToggle(b.id)} disabled={isPending}
                    className={`px-2 py-1 rounded text-xs font-medium ${b.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {b.isActive ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleDelete(b.id, b.title)} disabled={isPending}
                    className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100">삭제</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">배너가 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterBtn({ label, value, current, onClick, count }: { label: string; value: string; current: string; onClick: (v: string) => void; count: number }) {
  return (
    <button onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium ${current === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
      {label} ({count})
    </button>
  );
}
