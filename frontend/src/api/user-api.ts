import { useMutation } from "@tanstack/react-query";
import axiosClient from "./axios-client";

export const useUserInfoUpdate = () => {
  return useMutation({
    mutationFn: (data: { name: string }) =>
      axiosClient.patch("/user/update", data),
  });
};

export const useGenetorAvatarUploadUrl = () => {
  return useMutation({
    mutationFn: (data: { extension: string; contentType: string }) =>
      axiosClient.post("/user/avatar-gen", data),
  });
};
