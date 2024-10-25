import { getServerSession } from "next-auth"; // jo bhi seession h vo backend se mil jata h ab is session se user or data nikal lenge as humne pehele hi sb daal rhkha h session me
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
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

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Messages acceptance status updated successfully",
        updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages ",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  dbConnect();
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

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User NOT found",
        },
        {
          status: 404,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error in getting message accepting ",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
