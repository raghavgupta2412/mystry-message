import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "rg2412147@gmail.com",
      to: email,
      subject: "Mystry Message | Verifiction Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verifiction email send successfulyy" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verifiction email" };
  }
}
