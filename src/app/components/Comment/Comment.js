import { useDispatch, useSelector } from "react-redux";
import { /*commentVote,*/ commentsSelector, moreComments, nextComment } from "../../features/Comments/CommentsSlice"
import { changeView, postSelector } from "../../features/Post/PostSlice";
import swipe from "../../../utilities/swiper"
import styles from "./Comment.module.css"
import Reply from "../Reply/Reply";

export default function Comment () {
  const { commentList, comment, reply, isLoading } = useSelector(commentsSelector);
  const post = useSelector(postSelector);
  const dispatch = useDispatch();
  
  function handleNextComment() {
    if (comment.index < commentList.length - 2) {
      dispatch(nextComment());
    } else {
      dispatch(moreComments());
    }
  }

  /*
  function handleVote(direction) {
    dispatch(commentVote({
      direction,
      id: `t1_${comment.id}`
    }));
  }
  */

  function handleOpenReply() {
    dispatch(changeView("reply"));
  }

  function handleCloseReply() {
    if (post.view !== "comments") {
      dispatch(changeView("comments"));
    }
  }

  return (
  <>
    <div
      data-view={post.view}
      id={styles.topCommentContainer}
      onMouseDown={post.view === "comments" && post.view !== "reply"
        ? () => swipe(styles.topCommentContainer, handleNextComment/*, handleVote*/)
        : handleCloseReply}
    >
      { post.view === "reply"
        ? <>
            <p id={styles.author} aria-label="comment author">u/{comment.author}</p>
            <p id={styles.commentBody} aria-label={`comment by ${comment.author}`}>{comment.body}</p>
          </>
        : <>
            <p id={styles.author} aria-label="comment author">u/{comment.author}</p>
            <p id={styles.commentBody} aria-label={`comment by ${comment.author}`}>{ isLoading ? "loading comments..." : comment.body }</p>
          </> }
      
      { post.view === "comments" && reply.list !== null  &&
        <button id={styles.repliesLink} onClick={handleOpenReply}>Open { reply.list.length } { reply.list.length > 1 ? "Replies" : "Reply" }</button> }
    </div>

    <Reply />
  </>)
};