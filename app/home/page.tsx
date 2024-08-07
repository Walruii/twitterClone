import Tweets from "./tweets-container";
import { getServerSession } from "next-auth";
import { SessionType, options } from "../api/auth/[...nextauth]/options";
import PostTweet from "./post-tweet";
import ReloadCircle from "./reload-circle";
import { TweetModes, TweetType } from "@/types/enums";

export default async function Home() {
  const data: SessionType | null = await getServerSession(options);
  return (
    <>
      {data && <PostTweet data={data} tweetType={TweetType.tweet} />}
      <ReloadCircle />
      <Tweets data={data} mode={TweetModes.all} />
    </>
  );
}
