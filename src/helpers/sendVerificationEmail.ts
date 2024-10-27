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
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });
    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );
    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: "raghav.gupta_cs21@gla.ac.in",
          to: email,
          subject: "Mystry Message | Verifiction Code",
          html: emailHtml,
        },
        (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        }
      );
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
