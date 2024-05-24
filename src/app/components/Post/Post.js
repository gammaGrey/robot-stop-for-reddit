import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { postSelector, getPage, changeView } from "../../features/Post/PostSlice";
// import { UserLoginSelector, startTime } from "../../features/UserLogin/UserLoginSlice";
import styles from "./Post.module.css";

export default function Post () {
  const post = useSelector(postSelector);
  // const user = useSelector(UserLoginSelector);
  const dispatch = useDispatch();

  const handleLoadPage = () => {
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
  };

  return (
    <div id={styles.swiper}>
      { post.list[0] || post.isLoading
        ? <Outlet /> //RedditPost component
        : <Link to="post"> {/*reddit post placeholder*/}
          <div aria-label="press enter to start" className={styles.postPlaceholder}
            onClick={handleLoadPage}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === "Accept") {
                handleLoadPage();
              }
            }}
          >
            <p>Click to load Reddit posts</p>
            <p>We have filters!</p>
          </div>
        </Link> }
    </div>
  )
}