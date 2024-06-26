import { Suspense } from "react";
import Tweets from "./tweets";
import { getServerSession } from "next-auth";
import { SessionType, options } from "../api/auth/[...nextauth]/options";
import PostTweet from "./post-tweet";
import ReloadCircle from "./reload-circle";
import TweetSkel from "./tweet-skel";

export default async function Home() {
  const data: SessionType | null = await getServerSession(options);
  return (
    <>
      {data && <PostTweet data={data} />}
      <ReloadCircle />
      <Suspense
        fallback={
          <>
            <TweetSkel />
            <TweetSkel />
            <TweetSkel />
            <TweetSkel />
            <TweetSkel />
          </>
        }
      >
        <Tweets data={data} mode={0} />
      </Suspense>
    </>
  );
}
