import styles from "./CommentsSection.module.css";
import { Outlet } from "react-router-dom";

export default function CommentsSection () {
  return (
    <section id={styles.commentsSection}>
      <Outlet /> {/*Comment component*/}
    </section>
  )
};