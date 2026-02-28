import type { AVATAR_ACCEPTED_TYPES_T } from "@/contansts";

export const extractFileMeta = (
  file: File,
  ACCEPTED_TYPES: AVATAR_ACCEPTED_TYPES_T,
  MAX_FILE_SIZE: number
) => {
  if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
    throw new Error("Only JPG, PNG and WEBP images are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 2MB");
  }

  return {
    contentType: file.type,
    extension: file.name.split(".").pop()?.toLowerCase(),
  };
};
