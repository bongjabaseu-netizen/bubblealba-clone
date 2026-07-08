/** 관리자 배너 — 생성/편집/토글/삭제/순서이동 + 사이즈 안내 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Trash2, Power, Plus, Save, X } from "lucide-react";
import { adminCreateBanner, adminToggleBanner, adminDeleteBanner, adminUpdateBanner, adminSwapBannerOrder } from "@/lib/actions/banners";
import { ImageUploader } from "@/components/ImageUploader";

const BANNER_TYPES = [
  { value: "IMAGE_TOP", label: "홈 최상단 (한 줄 2개, 600×150)", desc: "홈 상단 가로 배너. 권장 600×150px (가로세로 4:1). 한 줄에 2개씩 채워지고 계속 추가 가능. 표시 높이 75px 고정." },
  { value: "IMAGE_MID", label: "홈 둘째줄 (한 줄 3개, 400×150)", desc: "홈 중간 가로 배너. 권장 400×150px (약 8:3). 한 줄에 3개씩. 표시 높이 75px 고정." },
  { value: "IMAGE_BOT", label: "홈 셋째줄~ (한 줄 4개, 300×150)", desc: "홈 하단 가로 배너. 권장 300×150px (2:1). 한 줄에 4개씩 채워지며 아래로 계속 늘어남. 표시 높이 75px 고정." },
  { value: "TEXT_ROLLING", label: "홈 텍스트 롤링", desc: "홈 텍스트 롤링 광고. 이미지 없이 텍스트만." },
  { value: "PETS_SHOP", label: "애견자랑 배너 (3x2, 300x300)", desc: "애견자랑 상단 배너. 권장 300x300px. 6개까지." },
  { value: "LEGAL_AD", label: "법률상담 배너 (3x2, 300x300)", desc: "법률상담 상단 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_SALON", label: "미용실 배너 (3x2, 300x300)", desc: "미용 > 미용실 탭 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_NAIL", label: "네일아트 배너 (3x2, 300x300)", desc: "미용 > 네일아트 탭 배너. 권장 300x300px. 6개까지." },
  { value: "BEAUTY_SURGERY", label: "성형 배너 (3x2, 300x300)", desc: "미용 > 성형 탭 배너. 권장 300x300px. 6개까지." },
];

const TYPE_LABEL: Record<string, string> = {};
BANNER_TYPES.forEach(t => TYPE_LABEL[t.value] = t.label);

// 다크 테마 공통 인풋/셀렉트 스타일 (sample-01 토큰)
const FIELD = "mt-1 w-full bg-navy-900 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none";
const FIELD_LABEL = "text-sm text-slate-300";

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
  const [editBanner, setEditBanner] = useState<Banner | null>(null);

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

  /** 같은 타입 그룹 내 위/아래 이동 — 두 배너의 표시 위치 맞바꿈 (실패 시 handleCreate와 동일한 error 상태로 노출) */
  function handleSwap(idA: string, idB: string) {
    setError("");
    startTransition(async () => {
      const result = await adminSwapBannerOrder(idA, idB);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* 등록 버튼 (헤딩 제목은 공통 헤더가 표시) */}
      <div className="flex items-center justify-end">
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "취소" : "배너 등록"}
        </button>
      </div>

      {/* 사이즈 안내 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-4">
        <h3 className="font-semibold text-white text-sm mb-2">📐 배너 이미지 사이즈 안내</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>• 홈 최상단: <b className="text-brand">600×150px</b> (한 줄 2개)</div>
          <div>• 홈 둘째줄: <b className="text-brand">400×150px</b> (한 줄 3개)</div>
          <div>• 홈 셋째줄~: <b className="text-brand">300×150px</b> (한 줄 4개·계속 추가)</div>
          <div>• 텍스트 롤링: 텍스트만</div>
          <div>• 애견/법률/미용 배너: <b className="text-brand">300×300px</b> (6개)</div>
          <div>• 홈 배너는 높이 75px로 통일 · 권장 비율이면 잘림 없음</div>
        </div>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <BannerForm
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          typeInfo={typeInfo}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          error={error}
          isPending={isPending}
          onSubmit={handleCreate}
        />
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

      {/* 순서 이동 등 실패 메시지 — 등록 폼이 닫혀 있을 때도 error 상태 노출 (폼 열림 시엔 폼 내부에 표시) */}
      {error && !showForm && <p className="text-sm text-red-400">{error}</p>}

      {/* 배너 리스트 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="px-5 py-2.5 font-semibold">배너</th>
              <th className="px-3 py-2.5 font-semibold">타입</th>
              <th className="px-3 py-2.5 font-semibold">제목/텍스트</th>
              <th className="px-3 py-2.5 font-semibold text-center">순서</th>
              <th className="px-3 py-2.5 font-semibold text-center">상태</th>
              <th className="px-5 py-2.5 font-semibold text-center">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {filtered.map((b) => {
              // 같은 타입 그룹 내 인접 배너 계산 — 그룹 경계에서는 이동 버튼 비활성 (banners는 [type, order] 정렬)
              const sameType = banners.filter((x) => x.type === b.type);
              const idx = sameType.findIndex((x) => x.id === b.id);
              const prev = idx > 0 ? sameType[idx - 1] : null;
              const next = idx < sameType.length - 1 ? sameType[idx + 1] : null;
              return (
              <tr key={b.id} className="hover:bg-navy-800/40">
                <td className="px-5 py-3">
                  {b.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg bg-navy-800 overflow-hidden">
                      <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-mute text-xs">TXT</div>
                  )}
                </td>
                <td className="px-3 py-3 text-xs text-mute">{TYPE_LABEL[b.type] ?? b.type}</td>
                <td className="px-3 py-3 text-slate-300 max-w-[200px] truncate">{b.title ?? b.text ?? "-"}</td>
                <td className="px-3 py-3 text-center text-mute">
                  <div className="flex items-center justify-center gap-1">
                    <span>{b.order}</span>
                    <button
                      onClick={() => prev && handleSwap(b.id, prev.id)}
                      disabled={isPending || !prev}
                      className="p-1.5 rounded-lg text-mute hover:bg-navy-800 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => next && handleSwap(b.id, next.id)}
                      disabled={isPending || !next}
                      className="p-1.5 rounded-lg text-mute hover:bg-navy-800 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <button onClick={() => handleToggle(b.id)} disabled={isPending}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold ${b.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-navy-700 text-slate-300"}`}>
                    <Power className="w-3.5 h-3.5" />
                    {b.isActive ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setEditBanner(b)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-brand/15 text-brand hover:bg-brand/25"><Pencil className="w-3.5 h-3.5" />편집</button>
                    <button onClick={() => handleDelete(b.id, b.title)} disabled={isPending}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"><Trash2 className="w-3.5 h-3.5" />삭제</button>
                  </div>
                </td>
              </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-mute">배너가 없습니다</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 편집 모달 */}
      {editBanner && (
        <EditBannerModal banner={editBanner} onClose={() => setEditBanner(null)} onSaved={() => { setEditBanner(null); router.refresh(); }} />
      )}
    </div>
  );
}

/** 배너 등록 폼 (공통) */
function BannerForm({ selectedType, setSelectedType, typeInfo, imageUrl, setImageUrl, error, isPending, onSubmit }: {
  selectedType: string; setSelectedType: (v: string) => void;
  typeInfo: typeof BANNER_TYPES[0] | undefined;
  imageUrl: string; setImageUrl: (v: string) => void;
  error: string; isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5 space-y-4">
      <h2 className="text-[14px] font-bold text-white">새 배너 등록</h2>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div>
        <label className={FIELD_LABEL}>배너 타입 *</label>
        <select name="type" value={selectedType} onChange={e => setSelectedType(e.target.value)} className={FIELD}>
          {BANNER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <p className="text-xs text-mute mt-1">{typeInfo?.desc}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={FIELD_LABEL}>제목</label>
          <input name="title" className={FIELD} placeholder="배너 제목" />
        </div>
        <div>
          <label className={FIELD_LABEL}>순서</label>
          <input name="order" type="number" defaultValue={0} className={FIELD} />
        </div>
      </div>
      {selectedType !== "TEXT_ROLLING" && (
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="banners" label="이미지 * (파일 업로드)" />
      )}
      {selectedType === "TEXT_ROLLING" && (
        <div>
          <label className={FIELD_LABEL}>롤링 텍스트 *</label>
          <input name="text" required className={FIELD} placeholder="광고 텍스트" />
        </div>
      )}
      <div>
        <label className={FIELD_LABEL}>외부 링크 URL (비우면 상세페이지로)</label>
        <input name="linkUrl" className={FIELD} placeholder="https://..." />
      </div>
      {selectedType !== "TEXT_ROLLING" && (
        <>
          <div>
            <label className={FIELD_LABEL}>상세 설명</label>
            <textarea name="description" rows={3} className={FIELD} placeholder="배너 클릭 시 보이는 상세 내용" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={FIELD_LABEL}>전화번호</label>
              <input name="phone" className={FIELD} placeholder="02-1234-5678" />
            </div>
            <div>
              <label className={FIELD_LABEL}>주소</label>
              <input name="address" className={FIELD} placeholder="서울 강남구 ..." />
            </div>
          </div>
        </>
      )}
      <button type="submit" disabled={isPending} className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow disabled:opacity-50">
        <Plus className="w-4 h-4" />
        {isPending ? "등록 중..." : "배너 등록"}
      </button>
    </form>
  );
}

/** 배너 편집 모달 */
function EditBannerModal({ banner, onClose, onSaved }: { banner: Banner; onClose: () => void; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editImageUrl, setEditImageUrl] = useState(banner.imageUrl ?? "");
  const isTextRolling = banner.type === "TEXT_ROLLING";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    if (!isTextRolling) formData.set("imageUrl", editImageUrl);

    startTransition(async () => {
      const result = await adminUpdateBanner(banner.id, formData);
      if (result.success) onSaved();
      else setError(result.error ?? "저장 실패");
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-navy-900 border border-line rounded-2xl shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-bold text-white">배너 편집</h2>
          <button onClick={onClose} className="text-mute hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="text-sm font-medium text-slate-300">배너 타입</label>
            <select name="type" defaultValue={banner.type} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-brand/60 focus:outline-none">
              {BANNER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">제목</label>
              <input name="title" defaultValue={banner.title ?? ""} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">순서</label>
              <input name="order" type="number" defaultValue={banner.order} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-brand/60 focus:outline-none" />
            </div>
          </div>

          {!isTextRolling && (
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">이미지</label>
              <ImageUploader value={editImageUrl} onChange={setEditImageUrl} folder="banners" />
            </div>
          )}

          {isTextRolling && (
            <div>
              <label className="text-sm font-medium text-slate-300">롤링 텍스트</label>
              <input name="text" defaultValue={banner.text ?? ""} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-300">외부 링크 URL</label>
            <input name="linkUrl" defaultValue={banner.linkUrl ?? ""} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" placeholder="https://..." />
          </div>

          {!isTextRolling && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-300">상세 설명</label>
                <textarea name="description" defaultValue={banner.description ?? ""} rows={3} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">전화번호</label>
                  <input name="phone" defaultValue={banner.phone ?? ""} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">주소</label>
                  <input name="address" defaultValue={banner.address ?? ""} className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 bg-navy-850 border border-line rounded-lg hover:border-brand/60"><X className="w-4 h-4" />취소</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-navy-950 bg-brand rounded-lg hover:bg-brand-soft shadow-glow disabled:opacity-50">
              <Save className="w-4 h-4" />
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FilterBtn({ label, value, current, onClick, count }: { label: string; value: string; current: string; onClick: (v: string) => void; count: number }) {
  return (
    <button onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${current === value ? "bg-brand/15 text-brand border-brand/40" : "bg-navy-850 text-mute border-line hover:text-slate-200"}`}>
      {label} ({count})
    </button>
  );
}
