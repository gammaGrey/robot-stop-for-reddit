/* TODO
 * Comment class for redditJSON getComments and getMoreComments methods
*/
/*
class Comment {
  constructor (id, body, author, parent, replies = null, type = "t1", more = null) {
    this.id = id;
    this.body = body;
    this.author = author;
    this.parent = parent;
    this.replies = replies;
    this.type = type;
    this.more = more;
  }
};
*/

/*
  * redditJSON object with methods for API calls
  * Each method handles reddit API data and returns usable data as strings, arrays of objects, etc.
  * e.g. easy to call reddit.getPage() inside createAsyncThunk()
*/

const redditJSON = {
  async getPage (subreddit, sort, after = null) {
    let endpoint;
    if (!subreddit) {
      endpoint = `https://www.reddit.com/${sort}.json?limit=25`;

    } else {
      endpoint = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=25`;
    };

    if (after) {
      endpoint += `&after=${after}`;
    };

    try {
      const response = await fetch(endpoint, {
        method: "GET"
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        
        // rawList: an array of reddit link objects with useful properties extracted from jsonResponse
        const rawList = jsonResponse.data.children.map(link => {
          if (link.data.stickied !== true) {
            return {
              subreddit: link.data.subreddit,
              url: link.data.permalink,
              author: link.data.author,
              id: link.data.id,
              title: link.data.title,
              imageURL: link.data.is_reddit_media_domain
                ? link.data.url
                : link.data.post_hint === "link" 
                  ? link.data.thumbnail
                  : link.data.url_overridden_by_dest,

              postText: link.data.selftext ? link.data.selftext : null,

              isVideo: link.data.is_video,
              videoUrl: link.data.is_video && (link.data.domain === "v.reddit.com" || link.data.domain === "v.redd.it")
                ? link.data.media.reddit_video.fallback_url
                : null,

              isGallery: link.data.is_gallery,
              gallerySources: link.data.is_gallery
                ? link.data.gallery_data.items.map(item => {
                  let media_id = item.media_id;

                  if (link.data.media_metadata[media_id].e === "AnimatedImage") {
                    return link.data.media_metadata[media_id].s.mp4;

                  } else {
                    return link.data.media_metadata[media_id].s.u;
                  }
                })
                : null,

              numComments: link.data.num_comments,
              gilded: link.data.gilded,
            };

          } else {
            return null;
          };
        });
        // filter out stickied/[Removed] posts
        const list = rawList.filter(element => element
          ? element.title === "[ Removed by Reddit ]"
            ? false
            : true
          : false);
        return {
          list,
          after: jsonResponse.data.after,
        };
      };
    } catch (e) {
      console.log(e);
    };
  },

  // limit restricts the total number of comments loaded
  async getComments (subreddit, linkFullname, limit = 25) {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${linkFullname}.json?sort=top&limit=${limit}&showmedia=true`, {
        method: "GET"
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("comments response:");
        console.log(jsonResponse);

        const rawComments = jsonResponse[1].data.children.map(comment => {
          if (comment.data.stickied) {
            return null;
          };
          if (comment.kind === "more") {
            return {
              kind: "more",
              numOmitted: comment.data.count,
              idArray: comment.data.children
            };

          } else if (!comment.data.stickied) {
            return {
              kind: "t1",
              body: comment.data.body,
              author: comment.data.author,
              id: comment.data.id,
              replies: comment.data.replies !== "" ? comment.data.replies.data.children.map((reply, i) => {
                if (reply.kind === "more") {
                  return {
                    kind: "more",
                    numOmitted: reply.data.count,
                    idArray: reply.data.children
                  }
                } else if( i < 6 ) {
                  return {
                  kind: "t1",
                  body: reply.data.body,
                  author: reply.data.author,
                  id: reply.data.id,
                  replies: reply.data.replies !== "" ? reply.data.replies.data.children.map((reply_2, i) => {
                    if (reply_2.kind === "more") {
                      return {
                        kind: "more",
                        numOmitted: reply_2.data.count,
                        idArray: reply_2.data.children
                      }
                    } else if( i < 6 && reply_2) {
                      return {
                        kind: "t1",
                        body: reply_2.data.body,
                        author: reply_2.data.author,
                        id: reply_2.data.id
                      };
                    } else {
                      return null;
                    }})
                    : null,
                  };
                } else {
                  return null;
                }})
                : null,
            };
          } else {
            return null;
          };
        });
        const comments = rawComments.filter(comment => comment ? true : false);
        console.log("comments:");
        console.log(rawComments);
        return comments;
      };
    } catch (e) {
      console.log(e);
    };
  },

  // loads every comment supplied in the children parameter (array of comment id strings)
  /**TODO
   * Implement tree structure with comments as nodes, post as root node
   * replies are linked to parent comments using parent comment fullnames, e.g.t1_abcde1
   */
  async getMoreComments (linkFullname, children, startIndex = 0) {
    if (!children || children.length === 0) {
      console.log("no child comments found");
      return;
    }

    //return the first ~100 comment IDs in the children array
    const limitedChildren = () => {
      if (children.length >= 100) {
        return children.slice(startIndex, (startIndex + 99));
      } else {
        return children.slice(0, children.length);
      }
    };

    let endpoint = `https://www.reddit.com/api/morechildren.json?link_id=t3_${linkFullname}&children=${limitedChildren()}&api_type=json&limit_children=true&sort=top`;

    try {
      const response = await fetch(endpoint, {
        method: "GET"
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const comments = jsonResponse.json.data.things.map(comment => {
          if (comment.data.stickied) {
            return null;
          } else if (comment.kind === "more") {
            return {
              kind: "more",
              numOmitted: comment.data.count,
              idArray: comment.data.children
            };

          } else if (!comment.data.stickied) {
            return {
              kind: "t1",
              body: comment.data.body,
              author: comment.data.author,
              id: comment.data.id,
              replies: comment.data.replies !== "" ? comment.data.replies.data.children.map((reply, i) => {
                if (reply.kind === "more") {
                  return {
                    kind: "more",
                    numOmitted: reply.data.count,
                    idArray: reply.data.children
                  }
                } else if( i < 6 ) {
                  return {
                  kind: "t1",
                  body: reply.data.body,
                  author: reply.data.author,
                  id: reply.data.id,
                  replies: reply.data.replies !== "" ? reply.data.replies.data.children.map((reply_2, i) => {
                    if (reply_2.kind === "more") {
                      return {
                        kind: "more",
                        numOmitted: reply_2.data.count,
                        idArray: reply_2.data.children
                      }
                    } else if( i < 6 && reply_2) {
                      return {
                        kind: "t1",
                        body: reply_2.data.body,
                        author: reply_2.data.author,
                        id: reply_2.data.id
                      };
                    } else {
                      return null;
                    }})
                    : null,
                  };
                } else {
                  return null
                }})
                : null,
            };
          } else {
            return null;
          };
        }).filter(comment => comment ? true : false);
        return comments;
      }
    } catch (e) {
      console.log(e)
    }

  },
};

export default redditJSON;