import { User } from "firebase/auth";
import { z } from "zod";

export type AuthType = {
  signupWEmail: (email: string, password: string) => Promise<void>;
  signupWGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
  updateUserProfile: (data: UserType) => Promise<void>;
  currentUser: User | null;
  userEmail: string | null;
  userName: string | null;
  userPhotoUrl: string | null;
};

export type AuthLoadingContextType = {
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

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginType = z.infer<typeof loginFormSchema>;

export const updateProfileFormSchema = z.object({
  profilePhoto: z.instanceof(FileList).optional(),
  displayName: z.string().optional(),
  email: z.string().email(),
});

export type UpdateProfileFormFieldsType = z.infer<
  typeof updateProfileFormSchema
>;

export const userSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export type UserType = z.infer<typeof userSchema>;

export type UserDocType = {
  _id: string;
};
