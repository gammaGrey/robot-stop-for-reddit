import { useSelector, useDispatch } from "react-redux";
import { UserLoginSelector, login } from "../../features/UserLogin/UserLoginSlice";
import styles from "./Header.module.css";
// import { useEffect } from "react";

export default function Header () {
  const { user } = useSelector(UserLoginSelector);
  const dispatch = useDispatch();

  function handleLogin () {
    if (!user.accessToken && !user.username) {
      dispatch(login());
    }
  };

  // useEffect(handleLogin, []);

  return (
    <header id={styles.headerBar}>
      <button id={styles.menuButton}>menu</button>
      <div id={styles.headerFlex}>
        { user.loginTime &&
          <span>🕖 Time on app: <span id={styles.timer}>{user.usageTime}</span></span> }
          { user.username
            ? <>
              <span>{user.username}</span>
              <img id={styles.userIcon} src={user.icon}/>
              </>
            : <button onClick={handleLogin}>
                { sessionStorage.getItem("authCode")
                  ? "Login"
                  : "Grant Reddit Authorisation"
                }
              </button> }
      </div>
    </header>
  )
};