import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { /*commentVote,*/ commentsSelector, moreComments, nextComment } from "../../features/Comments/CommentsSlice"
import { changeView, postSelector } from "../../features/Post/PostSlice";
import swipe from "../../../utilities/swiper"
import styles from "./Comment.module.css"

export default function Comment () {
  const { commentList, comment, reply, isLoading } = useSelector(commentsSelector);
  const post = useSelector(postSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  function handleNextComment() {
    if (comment.index < commentList.length - 2) {
      dispatch(nextComment());
    } else {
      dispatch(moreComments());
    }
  }

  /*
  const handleVote = (direction) => {
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
      navigate("");
    }
  }

  return (
  <>
    <div
      data-view={post.view}
      id={styles.topCommentContainer}
      onMouseDown={post.view === "comments" && post.view !== "reply"
        ? () => swipe(styles.topCommentContainer, handleNextComment, /*handleVote*/)
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
        <Link
          id={styles.repliesLink}
          to="reply"
          onClick={handleOpenReply}
        >
          <button>Open { reply.list.length } { reply.list.length > 1 ? "Replies" : "Reply" }</button>
        </Link> }
    </div>
    {/* Reply component */}
    <Outlet />
  </>)
};