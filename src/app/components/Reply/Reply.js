import { useSelector } from "react-redux";
import { commentsSelector } from "../../features/Comments/CommentsSlice";
import { postSelector } from "../../features/Post/PostSlice";
import styles from "./Reply.module.css";

export default function Reply () {
  const comments = useSelector(commentsSelector);
  const { view } = useSelector(postSelector);

  return (
    <div id={styles.replyContainer}>
      { view === "reply" &&
        <span>Replies:</span>
      }
      { view === "reply" &&
      comments.reply.list.map((reply, i) => {
        if (reply.kind === "more") {
          return (
            <div key={i}>
              <span className={styles.loadMore}>
                {reply.idArray.length} more replies (+{reply.numOmitted - reply.idArray.length} child comments)
              </span>
            </div>
          )
        } else {
          return (
            <div key={i} className={styles.reply}>
            <span aria-label="comment author" className={styles.author}>
              u/{reply.author}
            </span>
            <p aria-label="comment body" className={styles.replyBody}>
              {reply.body}
            </p>
            <span id={styles.numReplies}>
              {reply.replies && Object.values(reply.replies[reply.replies.length - 1]).includes("more")
                // total replies, including replies omitted due to limit in API request 
                ? reply.replies.length + reply.replies[reply.replies.length - 1].numOmitted - 1
                : reply.replies // check if the current reply has more replies
                  ? reply.replies.length
                  : "No" }
              { // handle plural for "reply/replies"
                reply.replies === null || reply.replies.length > 1 || (reply.replies.length === 1 && reply.replies[0].kind === "more")
                ? " replies"
                : " reply" }
            </span>
            </div>
          )
        }
      })}
    </div>
  )
};