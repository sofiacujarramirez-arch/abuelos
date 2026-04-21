"use client";

import { PostEditor, type ExistingPhoto } from "../../../_components/post-editor";
import { updatePostAction } from "../actions";

export function EditPostForm({
  familyId,
  postId,
  initialMessage,
  initialEventDate,
  initialStatus,
  initialPhotos,
}: {
  familyId: string;
  postId: string;
  initialMessage: string;
  initialEventDate: string | null;
  initialStatus: "draft" | "published";
  initialPhotos: ExistingPhoto[];
}) {
  return (
    <PostEditor
      familyId={familyId}
      initialMessage={initialMessage}
      initialEventDate={initialEventDate}
      initialStatus={initialStatus}
      initialPhotos={initialPhotos}
      submitLabel="Publicar"
      allowDraft={initialStatus === "draft"}
      onSubmit={async ({ message, eventDate, status, photos }) => {
        return updatePostAction({ familyId, postId, message, eventDate, status, photos });
      }}
    />
  );
}
