import styles from "./CommentsSection.module.css";
import Comment from "../Comment/Comment";

export default function CommentsSection () {
  return (
    <section id={styles.commentsSection}>
      <Comment />
    </section>
  )
};