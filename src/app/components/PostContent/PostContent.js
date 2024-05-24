import { useDispatch, useSelector } from "react-redux";
import { postSelector, next, getPage, changeView, filter } from "../../features/Post/PostSlice";
import { firstComment } from "../../features/Comments/CommentsSlice";
import PostGallery from "../PostGallery/PostGallery";
import swipe from "../../../utilities/swiper";
import styles from "./PostContent.module.css";


export default function PostContent () {
  const {link, list, listIndex, view} = useSelector(postSelector);
  const dispatch = useDispatch();

  function handleNext () {
    dispatch(changeView("post"));

    if (listIndex === list.length - 1) {
      dispatch(getPage());
    } else {
      dispatch(next());
      dispatch(firstComment());
    }
  };
  
  function handleNextWithKey (e) {
    console.log(e);
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      dispatch(next());
      dispatch(firstComment());
      dispatch(changeView("post"));
    }
  };

  function handleFilter (e) {
    if (e.target.value === "Front Page") {
      dispatch(filter(""));
    } else {
      dispatch(filter(link.subreddit));
    }
    dispatch(getPage());
  };

  /* Functionality disabled for Reddit JSON API
  function handleVote(direction) {
    return;
    dispatch(postVote({
      direction,
      id: `t3_${link.id}`
    }));
  }
  */

  return (
  <div
    tabIndex={0}
    id="swipePost"
    className={view === "post"
      ? styles.postContent
      : `${styles.postContent} ${styles.mini}`}
    onMouseDown={() => {swipe("swipePost", handleNext)}}
    onKeyDown={(e) => {handleNextWithKey(e)}}

    aria-label="swiper"
  >
    {/* Post title and image(s)/video, minimised when viewing comments */}
  { view === "post"
    ? <div className={styles.postHeader}>
        <h3 aria-label="post title">{link.title}</h3>
        <div className={styles.postInfo}>
          <h4 aria-label="subreddit" className={styles.subreddit} onClick={e => handleFilter(e)}>r/{link.subreddit}</h4>
          <h5 aria-label="author" id={styles.author}>u/{link.author}</h5>
        </div>
      </div>
    : <div className={`${styles.postHeader} ${styles.mini}`}>
        <div className={styles.miniTitle}>
          <h3 aria-label="post title" className={`${styles.postTitle} ${styles.mini}`}>{link.title}</h3>
          <div className={styles.postInfo}>
            <h4 aria-label="subreddit" className={`${styles.subreddit} ${styles.mini}`}>r/{link.subreddit}</h4>
            <h5 aria-label="author" id={styles.author}>u/{link.author}</h5>
          </div>
        </div>
        
        { link.isGallery !== true && (link.imageURL || link.isVideo) &&
          <img className={`${styles.postImg} ${styles.mini}`} src={link.imageURL} alt="external link" draggable="false" /> }
      </div> }

    {/* handle different post content types: gallery, video, self text */}
    { view === "post" &&
    <div id={styles.postPreview}>
      { link.isGallery && 
        <PostGallery /> }

      { !link.isGallery && link.imageURL && !link.isVideo && view === "post" &&
        <img className={styles.postImg} src={link.imageURL} alt="external link" draggable="false"/> }

      { link.isVideo &&
        <video id={styles.videoPost} src={link.videoUrl} controls></video> }

      { link.postText !== null &&
        <span aria-label="post self text" className={`${styles.selfText} ${view !== "post" ? styles.mini : ""}`}>
          { view === "post" //Only show first 130 characters of self text when viewing comments
            ? link.postText
            : link.postText.slice(0, 130) + "..."
          }
        </span> }
    </div> }
  </div>
  )
};