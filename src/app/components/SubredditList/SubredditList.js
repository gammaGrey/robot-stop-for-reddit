import { useDispatch, useSelector } from "react-redux";
import { getPage, filter, sort, changeView } from "../../features/Post/PostSlice";
import { menuSelector, toggleFilters } from "../../features/Menu/MenuSlice";
import styles from "./SubredditList.module.css";
// import { UserLoginSelector, getSubreddits } from "../../features/UserLogin/UserLoginSlice";

export default function SubredditList () {
  // const userLogin = useSelector(UserLoginSelector);
  const { toggle } = useSelector(menuSelector);
  const dispatch = useDispatch();

  // const handleGetSubreddits = () => {
  //   if (!userLogin.subreddits.list || userLogin.subreddits.list[0] === "Please login!") {
  //     dispatch(getSubreddits());
  //   } else {
  //     dispatch(getSubreddits());
  //   }
  // };

  function handleToggleFilterMenu () {
    dispatch(toggleFilters());
  }

  function handleFilter(e) {
    if (e.target.value === "Front Page") {
      dispatch(filter(""));
    } else {
      dispatch(filter(e.target.value));
    }
  }
  
  function handleGetFilteredPage () {
    dispatch(getPage());
    dispatch(changeView("post"));
  }

  function handleSort(e) {
    dispatch(sort(e.target.value));
    dispatch(getPage());
  }

  return (<>
    { toggle.filter
    ? <div id={styles.subredditFilterForm}>
        <button className={styles.button} id={styles.closeButton} onClick={handleToggleFilterMenu} aria-label="close filters">×</button>
        <form>
          <label htmlFor={styles.subredditSearch}>Filter by subreddit: </label>
          <input type="text" placeholder="Correct spelling only" id={styles.subredditSearch} name="subreddit" onChange={handleFilter} onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGetFilteredPage();
            }
          }}/>

          <div>
            <label htmlFor={styles.sortList}>Sort posts by </label>
            <select className={styles.list} id={styles.sortList} onChange={handleSort}>
              <option value="hot" defaultValue>hot</option>
              <option value="new">new</option>
              <option value="rising">rising</option>
            </select>
          </div>
        </form>
        <div>
          <button className={styles.button} onClick={handleGetFilteredPage}>Filter</button>
        </div>
      </div>
    : <button className={styles.button} onClick={handleToggleFilterMenu}>Filters</button> }
  </>)
};

/* <select> element for listing user-subscribed subreddits with OAuth API:

<label htmlFor={styles.subredditList}>Filter by subreddit: </label>
<select
  id={styles.subredditList}
  name={styles.subredditList}
  form="subreddits"
  placeholder="choose subreddit"
  onClick={handleGetSubreddits}
  onChange={e => {
    e.preventDefault();
    handleFilter(e)}
  }
  className={styles.list}
>
  <option>Front Page</option>
  { userLogin.subreddits.isLoading &&
    <option>Loading...</option>
  }
  { userLogin.subreddits.list &&
    userLogin.subreddits.list.map((x, i) => (
      <option
        value={x.subreddit ? x.subreddit : x}
        key={i}
      >
        {x.subreddit ? x.subreddit : x}
      </option>
  ))}
</select>
*/