"use client";

import { useTransition } from "react";
import { cancelAdOrder } from "@/lib/actions/ads";
import { useRouter } from "next/navigation";

export function CancelButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await cancelAdOrder(orderId);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="font-12rg text-red-600 disabled:opacity-40"
    >
      {isPending ? "취소중..." : "주문 취소"}
    </button>
  );
}
