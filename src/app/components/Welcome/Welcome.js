import { useDispatch } from "react-redux";
import { closeWelcome } from "../../features/Menu/MenuSlice";
import styles from "./Welcome.module.css";

export default function Welcome () {
  const dispatch = useDispatch();

  function enterApp() {
    dispatch(closeWelcome());
  };

  return (
    <div id={styles.blackout}>
      <section id={styles.welcomeCard}>
        <h2>Welcome to RobotStop!</h2>
        <h3>How to use</h3>
        <p>
          Swipe left and right, or use the arrow keys to go to the next post.
          <br></br>
          <br></br>
          You can't go back.
        </p>
        <p>
          <br></br>
          The original idea was to be able to upvote or downvote depending on the swipe direction. See the commented-out functionality <a id={styles.repoLink} href="https://github.com/gammagrey/robotstop">in the repo</a> if you're interested.
        </p>

        <h3>Disclaimer</h3>
        <p id={styles.tldr}>
          TL;DR<br></br>
          Don't browse Reddit at work/school/on a bus if you can't deal with the consequences of your browsing habits.
        </p>
        <p>
          As a user of <span className={styles.logo}>Robot<span className={styles.stop}>Stop</span></span>, you browse Reddit at your own discretion.
        </p>
        <p>
          By using <span className={styles.logo}>Robot<span className={styles.stop}>Stop</span></span> you understand that you may come across sensitive user-generated content, which is your own responsibility to handle.
        </p>
        <p>This may include:</p>
        <ul>
          <li>Uses of strong language</li>
          <li>Themes and content not safe for workplace or public viewing</li>
          <li>Themes of a disturbing nature</li>
          <li>General immaturity</li>
        </ul>
        <div id={styles.buttonFlex}>
          <button onClick={enterApp} aria-label="accept and continue">Yeah, I get it</button>
          <button onClick={() => {window.location = "https://gammagrey.github.io/"}} className={styles.decline} aria-label="decline and redirect">No way, I'm outta here</button>
        </div>
      </section>
    </div>
  )
};