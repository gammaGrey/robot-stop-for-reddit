import { useDispatch, useSelector } from "react-redux";
import { postSelector, getPage, changeView } from "../../features/Post/PostSlice";
// import { UserLoginSelector, startTime } from "../../features/UserLogin/UserLoginSlice";
import styles from "./Post.module.css";
import RedditPost from "../RedditPost/RedditPost";

export default function Post () {
  const post = useSelector(postSelector);
  // const user = useSelector(UserLoginSelector);
  const dispatch = useDispatch();

  function handleLoadPage() {
    // if (/*user.accessToken*/true) {
    dispatch(getPage());
    dispatch(changeView("post"));
    // } else {
    //   console.log("failed to load page");
    //   return;
    // }
    // if (!user.user.loginTime) {
    // dispatch(startTime(Date.now()));
    // }
  }
  function handleLoadPageWithKey(e) {
    if (e.key === "Enter" || e.key === "Accept") {
      handleLoadPage();
    }
  };

  return (
    <div id={styles.swiper}>
      { post.list[0] || post.isLoading
        ? <RedditPost />
        
        //reddit post placeholder
        : <div aria-label="press enter to start" className={styles.postPlaceholder} onClick={handleLoadPage} onKeyDown={handleLoadPageWithKey}>
            <p>Click to load Reddit posts</p>
            <p>We have filters!</p>
          </div> }
    </div>
  )
}