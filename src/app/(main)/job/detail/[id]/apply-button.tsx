"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { applyJob } from "@/lib/actions/jobs";

export function ApplyButton({ jobId }: { jobId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  async function handleApply() {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    const result = await applyJob(jobId);
    if (result?.error) {
      setError(result.error);
    } else {
      setApplied(true);
    }
    setLoading(false);
  }

  if (applied) {
    return (
      <button className="w-full h-44px rounded-10px border border-line-gray-20 font-15rg text-font-disabled flex items-center justify-center gap-6px" disabled>
        ✓ 신청 완료
      </button>
    );
  }

  return (
    <>
      <button
        className="w-full h-44px rounded-10px border border-line-gray-20 font-15sb text-font-black flex items-center justify-center gap-6px active-bg disabled:opacity-50"
        onClick={handleApply}
        disabled={loading || status === "loading"}
      >
        {loading ? "신청 중..." : status === "loading" ? "..." : "신청하기"}
      </button>
      {error && <p className="font-12rg text-warn-red mt-4px">{error}</p>}
    </>
  );
}
