import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SubredditList from "../SubredditList/SubredditList";
import { menuSelector } from "../../features/Menu/MenuSlice";
import Welcome from "../Welcome/Welcome";
import Timer from "../Timer/Timer";
import styles from "./Home.module.css";

export default function Home () {
  const { welcome } = useSelector(menuSelector);

  return (
    <>
    { welcome && <Welcome /> }
      <div id={styles.header} aria-label="header">
        <span id={styles.appName} aria-label="logo">Robot<span id={styles.stop}>Stop</span></span>
        <Timer />
        <SubredditList />
      </div>
      <Outlet />
    </>
  );
};

/*TO DO:
  long-term changes:
  * Menu sidebar (later implementation)
  * Store the comment chain in a tree structure
    * Implement Comment Class and Reply Class
      * Properties: {type, author, body, id, parent, replies, more = null/[IDs]}
      * When redditJSON.getMoreComments() is called, run a function that sorts each comment:
        * link comment to parent: either the post or a parent comment
        * add child comments to the replies array
*/