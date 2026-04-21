"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePostAction } from "./actions";

export function DeletePostButton({
  familyId,
  postId,
  variant = "button",
}: {
  familyId: string;
  postId: string;
  variant?: "button" | "menu-item";
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => {
      deletePostAction({ familyId, postId });
    });
  }

  if (variant === "menu-item") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="flex items-center gap-2 w-full text-left px-4 py-2 font-body text-envelope hover:bg-envelope-tint transition disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        {pending ? "Borrando..." : confirming ? "¿Seguro? Click de nuevo" : "Borrar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 px-5 py-3 border-2 border-envelope text-envelope font-body font-semibold hover:bg-envelope hover:text-parchment transition disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      {pending ? "Borrando..." : confirming ? "¿Seguro? Click de nuevo para confirmar" : "Borrar"}
    </button>
  );
}
