"use server";

import connectMongoDB from "@/lib/MongooseConnect";
import Tweet from "@/lib/models/tweetModel";
import User from "@/lib/models/userModel";
import Like from "@/lib/models/likeModel";
import { revalidatePath } from "next/cache";
import Share from "@/lib/models/shareModel";
import { ILike } from "@/types/models/like";
import { LikeModes, ShareModes } from "@/types/enums";
import { IShare } from "@/types/models/share";
import { IExist } from "@/types/utils";

export const getSharesOfTweet = async (
  tweetId: string,
): Promise<number | null> => {
  try {
    const connect = await connectMongoDB();
    let tweetsCount: number | null = await Share.countDocuments({ tweetId });
    if (tweetsCount) {
      return tweetsCount;
    }
    console.log("tweet not found");
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getLikesOfTweet = async (
  tweetId: string,
): Promise<number | null> => {
  try {
    const connect = await connectMongoDB();
    let tweetsCount: number | null = await Like.countDocuments({ tweetId });
    if (tweetsCount) {
      return tweetsCount;
    }
    console.log("tweet not found");
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const like = async (
  likeMode: LikeModes,
  userId: string,
  tweetId: string,
  commentId?: string,
): Promise<void> => {
  try {
    const connect = await connectMongoDB();
    const [tweet, user, like] = await Promise.all([
      Tweet.exists({ _id: tweetId }),
      User.exists({ _id: userId }),
      Like.exists({ userId, tweetId, commentId }),
    ]);
    if (!tweet || !user) {
      console.log({ status: 404, message: "Tweet or user not found" });
    }
    if (like) {
      // UNLIKE
      let result = await Like.deleteOne({ _id: like._id });
      if (result) {
        return;
        // return { status: 200, message: "unliked" };
      } else {
        return;
        // return { status: 500, message: "Failed to unlike" };
      }
    } else {
      // LIKE
      if (tweet && user) {
        const newLikeData: ILike = await new Like({
          userId,
          tweetId,
        });
        if (likeMode === LikeModes.comment && commentId) {
          newLikeData.commentId = commentId;
        }

        const newLike = new Like(newLikeData);
        await newLike.save();

        return;
        // return {
        //   status: 200,
        //   message:
        //     likeMode === LikeModes.comment ? "comment liked" : "tweet liked",
        // };
      } else {
        console.log("unknown LikeMode ");
        return;
        // return { status: 300, message: "unknown Like Mode" };
      }
    }
  } catch (err) {
    console.log(err);
    return;
    // return { status: 500, message: "Internal Server Error" };
  }
};

export const share = async (
  shareMode: ShareModes,
  userId: string,
  tweetId: string,
  commentId?: string,
): Promise<void> => {
  try {
    const connect = await connectMongoDB();
    const [tweetExists, userExists, shareExists] = await Promise.all([
      Tweet.exists({ _id: tweetId }),
      User.exists({ _id: userId }),
      Share.exists({ userId, tweetId, commentId }),
    ]);

    if (!tweetExists || !userExists) {
      return;
      // return { status: 404, message: "Tweet or user not found" };
    }

    if (shareExists) {
      // UN-SHARE
      const result = await Share.deleteOne({ userId, tweetId, commentId });
      if (result.deletedCount === 1) {
        return;
        // return { status: 200, message: "unshared" };
      } else {
        return;
        // return { status: 500, message: "Failed to unshare" };
      }
    } else {
      // SHARE
      const newShareData: IShare = new Share({ userId, tweetId });
      if (shareMode === ShareModes.comment && commentId) {
        newShareData.commentId = commentId;
      }

      const newShare = new Share(newShareData);
      await newShare.save();

      return;
      // return {
      //   status: 200,
      //   message:
      //     shareMode === ShareModes.comment ? "comment shared" : "tweet shared",
      // };
    }
  } catch (err) {
    console.error("Error in share function:", err);
    return;
    // return { status: 500, message: "Internal Server Error" };
  }
};

export const isLikedByUser = async (userId: string, tweetId: string) => {
  try {
    const connect = await connectMongoDB();
    const like: IExist | null = await Like.exists({
      tweetId,
      userId,
    });
    if (like) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const isSharedByUser = async (userId: string, tweetId: string) => {
  try {
    const connect = await connectMongoDB();
    const share: IExist | null = await Share.exists({
      tweetId,
      userId,
    });
    if (share) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};