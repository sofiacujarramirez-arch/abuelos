"use client";

import { PostEditor } from "../../_components/post-editor";
import { createPostAction } from "./actions";

export function PostForm({ familyId }: { familyId: string }) {
  return (
    <PostEditor
      familyId={familyId}
      submitLabel="Publicar en la gaceta"
      onSubmit={async ({ message, eventDate, status, photos }) => {
        return createPostAction({ familyId, message, eventDate, status, photos });
      }}
    />
  );
}
