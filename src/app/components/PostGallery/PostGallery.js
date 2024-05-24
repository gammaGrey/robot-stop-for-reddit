import { postSelector } from "../../features/Post/PostSlice";
import { useSelector } from "react-redux";

import styles from "../PostContent/PostContent.module.css";

export default function PostGallery () {
  const { link } = useSelector(postSelector);

  function handleGalleryEnlarge () {
    
  };

  return (
    <div id={styles.galleryGrid} aria-label="post gallery grid">
      { link.gallerySources.map((url, i) => {
        // changes "preview.redd.it" to "i.redd.it"
        const y = url.replace("preview", "i");

        return (<img src={y} className={styles.postImg} alt="external URL" key={i} onClick={handleGalleryEnlarge}/>);
      }) }
    </div> 
  )
}