import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserLoginSelector, setUsageTime } from "../../features/UserLogin/UserLoginSlice";
import styles from "./Timer.module.css";

export default function Timer () {
  const { user } = useSelector(UserLoginSelector);
  const time = user.usageTime;
  const dispatch = useDispatch();

  let ms = 0;
  function timer () {
    if (user.usageTime === "0:00") {
      const tick = setInterval(() => {
        ms += 1000;
        let clock = new Date(ms);
        let minutes = clock.getMinutes().toString().padStart(2, "0");
        let seconds = clock.getSeconds().toString().padStart(2, "0");
        dispatch(setUsageTime(`${minutes}:${seconds}`));
      }, 1000);
      return () => {clearInterval(tick)};
    }
  };

  // effect fires one time on page load
  useEffect(timer, []);

  return (
    <div id={styles.timer}>
      <span>Time spent here: </span>
      <span id={styles.time}>{time}</span>
    </div>
  )
}