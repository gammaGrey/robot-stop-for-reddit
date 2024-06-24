import { useDispatch, useSelector } from "react-redux";
import { postSelector,  changeView } from "../../features/Post/PostSlice";
import { commentsSelector, loadComments } from "../../features/Comments/CommentsSlice";
import PostContent from "../PostContent/PostContent";
import styles from "./RedditPost.module.css";
import CommentsSection from "../CommentsSection/CommentsSection";

export default function RedditPost () {
  const post = useSelector(postSelector);
  const comments = useSelector(commentsSelector); 
  const dispatch = useDispatch();

  function handleLoadComments () {
    dispatch(loadComments());
  };

  function handlePostView () {
    if (post.view !== "post") {
      dispatch(changeView("post"));
    }
  };
  
  function handleLoadingText(e) {
    setTimeout(() => {
      e.target.innerHTML = "💬";
    }, 800);

    e.target.innerHTML = "...";
  };

  return (
  <>
  <div className={`${styles.postContainer} ${post.view === "post" ? "" : styles.mini}`} onClick={handlePostView}>
    { post.isLoading
    // show animated svg while API promise is pending
    ? <svg aria-label="loading posts" width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className={styles.postLoading} cx="54" cy="54" r="51.5" stroke="url(#orange-gradient)" strokeWidth="6"/>
        <circle className={`${styles.postLoading} ${styles.backwards}`} cx="54" cy="54" r="40" stroke="url(#blue-gradient)" strokeWidth="6"/>
        <defs>
        <linearGradient id="orange-gradient" x1="54" y1="0" x2="54" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF4500"/>
        <stop offset="1" stopColor="#FF4500" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="blue-gradient" x1="54" y1="72" x2="54" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0045ff"/>
        <stop offset="1" stopColor="#0045ff" stopOpacity="0"/>
        </linearGradient>
        </defs>
      </svg>
    // render post content, e.g. text, image(s), video
    : <PostContent /> }
  </div>
  
  { post.view === "post" && post.link.numComments === 0
    ? <span className={`${styles.loadCommentsButton} ${styles.none}`}>
        No comments <span id={styles.emoji}></span>
      </span>
    : (comments.comment.body && post.view === "comments") || post.view === "reply"
      ? <CommentsSection />
      : <div
          className={ comments.isLoading
            ? `${styles.loadCommentsButton} ${styles.animatedLoad}`
            : styles.loadCommentsButton }

          onClick={ handleLoadComments }
          
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Accept") {
              handleLoadComments()
            } else {
              e.preventDefault();
            }
          }}

          onAnimationStart={e => {
            handleLoadingText(e);
            dispatch(changeView("comments"));
          }}
          
          tabIndex={0}
          aria-label={`load ${post.link.numComments} comments`}
        >
          { comments.isLoading ? "Loading"
            : post.link.numComments >= 1
              ? `${post.link.numComments} 💬`
              : "1 💬" }
        </div> }
  </>)
};