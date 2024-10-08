import { getServerSession } from "next-auth"; // jo bhi seession h vo backend se mil jata h ab is session se user or data nikal lenge as humne pehele hi sb daal rhkha h session me
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  //kyuki id string bna di thi hmne
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "$messages", //isse jitne bhi messages h vo array na hoke alag objects ban jayenge jisse hum usme operations kr payenge
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "messages" } }, //ek obj me sare object puch hogye
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("an unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "Error getting messages",
      },
      {
        status: 500,
      }
    );
  }
}
