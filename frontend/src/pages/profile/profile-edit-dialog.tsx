import { useState, useCallback } from "react";
import { AVATAR_MAX_FILE_SIZE, AVATAR_ACCEPTED_TYPES } from "@/contansts";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useGenetorAvatarUploadUrl, useUserInfoUpdate } from "@/api/user-api";
import { extractFileMeta } from "@/lib/valid-image-size";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import type { UserProfile } from "./types";

interface ProfileUpdateDialogProps {
  user: UserProfile;
  setIsEditOpen: (b: boolean) => void;
  isEditOpen: boolean;
}

export const ProfileUpdateDialog = ({
  user,
  setIsEditOpen,
  isEditOpen,
}: ProfileUpdateDialogProps) => {
  const [name, setName] = useState(user.name);
  const [uploading, setUploading] = useState(false);

  const userInfoUpdateMutation = useUserInfoUpdate();
  const avatarUploadUrlMutation = useGenetorAvatarUploadUrl();

  const uploadToS3 = async (url: string, file: File) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);

      const { contentType, extension } = extractFileMeta(
        file,
        AVATAR_ACCEPTED_TYPES,
        AVATAR_MAX_FILE_SIZE
      );
      if (!extension) {
        throw new Error("Extenstion are the Required");
      }

      const { data } = await avatarUploadUrlMutation.mutateAsync({
        contentType,
        extension,
      });

      const uploadUrl = data.data;
      if (!uploadUrl) {
        throw new Error("Missing Upload url ");
      }
      await uploadToS3(uploadUrl, file);

      toast.success("Avatar updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* -------------------- dropzone -------------------- */

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleAvatarUpload(acceptedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: AVATAR_ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: AVATAR_MAX_FILE_SIZE,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("Image must be smaller than 2MB");
      } else if (error?.code === "file-invalid-type") {
        toast.error("Invalid image type");
      } else {
        toast.error("Invalid file");
      }
    },
  });

  const saveUserInfo = () => {
    toast.promise(userInfoUpdateMutation.mutateAsync({ name }), {
      loading: "Updating profile...",
      error: "Failed to update profile",
      success: () => {
        user.name = name;
        setIsEditOpen(false);
        return "Profile updated successfully";
      },
    });
  };

  return (
    <ConfirmDialog
      title={"Edit Profile"}
      desc={" Update your profile information and avatar."}
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      handleConfirm={saveUserInfo}
      confirmText={" Save changes"}
      cancelBtnText='Cancel'
      disabled={userInfoUpdateMutation.isPending}
      isLoading={userInfoUpdateMutation.isPending}
    >
      <div className='grid gap-6 py-4'>
        {/* Avatar upload */}
        <div
          {...getRootProps()}
          className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-5 cursor-pointer transition
              ${isDragActive ? "border-primary bg-primary/5" : "border-border"}
            `}
        >
          <input {...getInputProps()} />

          <UserAvatarProfile
            user={user}
            className='h-24 w-24 text-4xl'
            showInfo={false}
          />

          <Button variant='outline' size='sm' disabled={uploading}>
            {uploading ? (
              <Spinner />
            ) : (
              <>
                <Upload className='mr-2 h-3 w-3' />
                Change Avatar
              </>
            )}
          </Button>

          <p className='text-[10px] text-muted-foreground'>
            JPG, PNG, WEBP • Max 2MB
          </p>
        </div>

        {/* Name */}
        <div className='grid gap-2'>
          <Label htmlFor='name'>Display Name</Label>
          <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </ConfirmDialog>
  );
};
