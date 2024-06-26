import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import {
  getLikedBy,
  getLikesOfTweet,
  getSharedBy,
  getSharesOfTweet,
} from "@/actions/actions";
import Like from "./like";
import Share from "./share";
import Link from "next/link";

export default async function LikeAndShare({
  tweetId,
  sessionUserId,
}: {
  tweetId: string;
  sessionUserId: string | null;
}) {
  const likes: number | null | undefined = await getLikesOfTweet(tweetId);
  const shares: number | null | undefined = await getSharesOfTweet(tweetId);

  if (sessionUserId && tweetId) {
    const likedBy: boolean = await getLikedBy(tweetId, sessionUserId);
    const sharedBy: boolean = await getSharedBy(tweetId, sessionUserId);
    return (
      <div className="mr-6 mt-4 pb-1 ml-20 flex justify-evenly text-gray-700">
        <div className="flex flex-col items-center">
          <Like
            tweetId={tweetId}
            sessionUserId={sessionUserId}
            likedBy={likedBy}
          />
          <h1>{likes}</h1>
        </div>

        <div className="flex flex-col items-center">
          <Share
            tweetId={tweetId}
            sessionUserId={sessionUserId}
            sharedBy={sharedBy}
          />
          <h1>{shares}</h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mr-6 mt-4 pb-1 ml-20 flex justify-evenly text-gray-700">
        <Link
          href="auth/signin"
          className="flex flex-col items-center cursor-pointer"
        >
          <FontAwesomeIcon className="float-left" icon={faHeart} />
          <h1>{likes}</h1>
        </Link>
        <Link
          href="auth/signin"
          className="flex flex-col items-center cursor-pointer"
        >
          <FontAwesomeIcon className="float-left" icon={faRetweet} />
          <h1>{shares}</h1>
        </Link>
      </div>
    );
  }
}

// not loged in
