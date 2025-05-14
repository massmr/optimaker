export interface IUser extends Document {
  role: "superuser" | "student" | "project_owner";
  email: string;
  passwordHash: string;
  name?: string;
  classe?: "ADI_1" | "ADI_2";
  preferences?: {
    theme_prefered: string;
    themes_liked: string[];
  };
}