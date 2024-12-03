import { User, UserCredential } from "firebase/auth";
import { z } from "zod";

export type AuthType = {
  signupWEmail: (email: string, password: string) => Promise<UserCredential>;
  signupWGoogle: () => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  reloadUser: () => boolean;
  updateUserProfile: (data: UpdateProfileFormFieldsType) => Promise<void>;
  currentUser: User | null;
  userEmail: string | null;
  userName: string | null;
  userPhotoUrl: string | null;
};

export type SignupLoadingContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const signupFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(
    (values) => {
      return values.confirmPassword === values.password;
    },
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

export type SignupFormFieldsType = z.infer<typeof signupFormSchema>;

export const updateProfileFormSchema = z.object({
  photoUrl: z.string().url().optional(),
  displayName: z.string().optional(),
  email: z.string().email(),
});

export type UpdateProfileFormFieldsType = z.infer<
  typeof updateProfileFormSchema
>;
