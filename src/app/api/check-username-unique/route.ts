import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
//jab bhi zod use krenge to schema chahiye hota h
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  // localhost:3000/api/cu?username=hitesh?phone=android

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with Zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); // todo remove

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      console.log(usernameError); //todo remove
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query Paramters",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const existingVerifiesUser = await UserModel.findOne({
      username,
      isVerified: false,
    });

    if (existingVerifiesUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 400,
      }
    );
  } catch (err) {
    console.log("Error Checking username ", err);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
