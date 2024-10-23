import { render } from "@react-email/components";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );
    transporter.sendMail({
      from: "raghav.gupta_cs21@gla.ac.in",
      to: email,
      subject: "Mystry Message | Verifiction Code",
      html: emailHtml,
    });
    return { success: true, message: "verifiction email send successfulyy" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verifiction email" };
  }
}
// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     await resend.emails.send({
//       from: "raghav.gupta_cs21@gla.ac.in",
//       to: email,
//       subject: "Mystry Message | Verifiction Code",
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });
//     return { success: true, message: "verifiction email send successfulyy" };
//   } catch (emailError) {
//     console.error("Error sending verification email", emailError);
//     return { success: false, message: "Failed to send verifiction email" };
//   }
// }
