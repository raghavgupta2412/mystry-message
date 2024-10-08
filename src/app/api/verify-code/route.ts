// import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// //jab bhi zod use krenge to schema chahiye hota h
// import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verify Code Expired plz sign up again to get a new code",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Code is invalid",
        },
        {
          status: 500,
        }
      );
    }
  } catch (err) {
    console.log("Error Verifying user ", err);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
