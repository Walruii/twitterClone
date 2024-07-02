"use client";
import { TweetModes } from "@/actions/util";
import { SessionType } from "../api/auth/[...nextauth]/options";
import LikeAndShare from "./likeAndShare";
import DeleteTweet from "./profile/DeleteTweet";

export default function Tweet({
  tweetContent,
  tweetId,
  username,
  nickname,
  image,
  likes,
  shares,
  data,
  likedBy,
  sharedBy,
  mode,
}: {
  tweetContent: string;
  username: string;
  nickname: string;
  image: string;
  tweetId: string;
  likes: number;
  shares: number;
  likedBy: boolean;
  sharedBy: boolean;
  data: SessionType | null;
  mode: TweetModes;
}) {
  let sessionUserId: string | null = null;
  if (data && data.user && data.user.userId) {
    sessionUserId = data.user.userId;
  }
  return (
    <article className="pt-2 text-white border-b border-borderGray">
      <div className="h-[40px] w-[40px] float-left mt-2 ml-4 rounded-full overflow-hidden ">
        <img src={image} />
      </div>
      <div className="mr-6 pt-1 ml-16">
        <h1 className="inline font-semibold">{nickname} </h1>
        <h1 className="inline text-gray-600 text-sm">@{username}</h1>
      </div>
      {mode === TweetModes.userTweets && data ? (
        <DeleteTweet tweetId={tweetId} userId={data?.user.userId} />
      ) : (
        <></>
      )}
      <div className="mr-6 pb-1 ml-16">
        <h1>{tweetContent}</h1>
      </div>
      <LikeAndShare
        tweetId={tweetId}
        sessionUserId={sessionUserId}
        likes={likes}
        shares={shares}
        likedBy={likedBy}
        sharedBy={sharedBy}
      />
    </article>
  );
}
