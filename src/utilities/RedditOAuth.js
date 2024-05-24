/*Originally designed for use with the Reddit OAuth API, which allowed for far more interesting functionality.
Everything here works if you have an API key, but you're rate-limited to 10 requests per minute. */

/** add this to the <head> of public/index.html
 <script>
  if (sessionStorage.getItem("authCode")) {
    sessionStorage.removeItem("authCode");
    
  } else if (location.hash) {
    let authCode = location.toString().match(/(?<=code=)([^#]*)/)[0];
    sessionStorage.setItem("authCode", authCode);
  }
    </script>
 */

const APIKey = process.env.REACT_APP_API_KEY; //nothing here
let authCode;
let accessToken;
let refreshToken;

// reddit object with methods for API calls
// each method handles reddit API data and returns usable data in the form of a string, an array of objects, etc.
// e.g. it's easy to call reddit.getPage() inside createAsyncThunk()
const reddit = {
  async getAuthCode () {
    if (accessToken) {
      console.log("access token exists??");
      return;
    } else if (sessionStorage.getItem("authCode") !== null) {
      authCode = sessionStorage.getItem("authCode");
      return authCode;

    } else if (window.location.hash) {
      authCode = window.location.toString().match(/(?<=code=)([^#]*)/)[0];
      return authCode;

    } else {
      window.location = `https://www.reddit.com/api/v1/authorize?client_id=-r3GwuNRL_NU8PIN8KGJ6g&response_type=code&state=tom&redirect_uri=https://gammagrey.github.io/robotstop/&duration=permanent&scope=identity read vote history mysubreddits`;
    };
  },

  async getAccessToken () {
    if (accessToken) {
      return accessToken;
    } else if (authCode) {
      try {
        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${APIKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=authorization_code&code=${authCode}&redirect_uri=https://gammagrey.github.io/robotstop/` // replace redirect_uri with app URI
        });
        
        if (response.ok) {
          sessionStorage.removeItem("authCode");
          console.log(response);
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          accessToken = jsonResponse.access_token;
          refreshToken = jsonResponse.refresh_token;
          return accessToken;
        };
      } catch (e) {
        console.log(e)
      };
    };
  },

  async refreshAccessToken () {
    if (accessToken) {
      window.location = ""; //replace with app URL
      console.log(accessToken);
      return accessToken;

    } else if (window.location.hash) {
      authCode = window.location.toString().match(/(?<=code=)([^#]*)/)[0];
      try {
        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${APIKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        });
        
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
          accessToken = jsonResponse.access_token;
          return accessToken;
        };
      } catch (e) {
        console.log(e)
      };
    };
  },

  async getUser (token) {
    try {
      const response = await fetch("https://oauth.reddit.com/api/v1/me.json", {
        method: "get",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        }
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const user = {
          name: jsonResponse.name,
          icon: jsonResponse.icon_img
        }
        return user;
      }
    } catch (e) {
      console.log(e);
    }
  },

  async getPage (token, subreddit, sort, after = null) {
    let endpoint;
    if (!subreddit) {
      endpoint = `https://oauth.reddit.com/${sort}.json?limit=25`;

    } else {
      endpoint = `https://oauth.reddit.com/r/${subreddit}/${sort}.json?limit=25`;
    };

    if (after) {
      endpoint += `&after=${after}`;
    };

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        }
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        // List: an array of reddit link objects with useful properties extracted from jsonResponse
        const list = jsonResponse.data.children.map(link => {
          return {
            subreddit: link.data.subreddit,
            url: link.data.permalink,
            id: link.data.id,
            title: link.data.title,
            imageURL: link.data.post_hint === "image"
              ? link.data.is_reddit_media_domain
                ? link.data.url
                : link.data.url_overridden_by_dest
              : null,
            postText: link.data.selftext,
            isVideo: link.data.is_video,
            videoUrl: link.data.domain === "v.reddit.com" ? link.data.fallback_url
              : link.data.domain === "v.redd.it" ? link.data.media.reddit_video.fallback_url
              : null,
            isGallery: link.data.is_gallery,
            galleryData: link.data.is_gallery
              ? link.data.gallery_data.items.map((item) => {
                let m = item.media_id;
                if (link.data.media_metadata[m].e === "AnimatedImage") {
                  return link.data.media_metadata[m].s.gif;
                }
                return link.data.media_metadata[m].s.u;
              })
              : null,
            numComments: link.data.num_comments.toString(),
          };
        });
          return {
            list,
            after: jsonResponse.data.after,
          };
      };
    } catch (e) {
      console.log(e);
    };
  },

  // current limit of 25 total comments loaded
  async getComments (token, subreddit, articleID, limit = 25) {
    try {
      const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/comments/${articleID}?sort=top&limit=${limit}&showmedia=true&depth=2`, {
        method: "GET",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        }
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("comments response:");
        console.log(jsonResponse);

        const comments = jsonResponse[1].data.children.map(comment => {
          if (comment.data.stickied) {
            return;

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
              // returns 2 levels of replies, up to 6 replies for each level
              // absolute maximum of 900 comments loaded
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
                    };
                    if( i < 6 && reply_2) {
                      return {
                        kind: "t1",
                        body: reply_2.data.body,
                        author: reply_2.data.author,
                        id: reply_2.data.id
                      };
                    }})
                    : null,
                  };
                }})
                : null,
            };
          };
        }).filter(comment => comment ? true : false);
        console.log("comments:");
        console.log(comments);
        return comments;
      };
    } catch (e) {
      console.log(e);
    };
  },

  async getMoreComments (token, linkFullname, children) {
    if (!children || children.length === 0) {
      console.log("no child comments found");
      return;
    }

    let endpoint = `https://oauth.reddit.com/api/morechildren.json?link_id=t3_${linkFullname}&children=${children}&api_type=json&limit_children=true&sort=top`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        }
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const comments = jsonResponse.json.data.things.map(comment => {
          if (comment.data.stickied) {
            return;
          }
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
              // returns 2 levels of replies, up to 6 replies for each level
              // absolute maximum of 900 comments loaded
              replies: comment.data.replies !== "" ? comment.data.replies.data.children.map((reply, i) => {
                if (reply.kind === "more") {
                  return {
                    kind: "more",
                    numOmitted: reply.data.count,
                    idArray: reply.data.children
                  }
                };
                if( i < 6 ) {
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
                    };
                    if( i < 6 && reply_2) {
                      return {
                        kind: "t1",
                        body: reply_2.data.body,
                        author: reply_2.data.author,
                        id: reply_2.data.id
                      };
                    }})
                    : null,
                  };
                }})
                : null,
            };
          };
        }).filter(comment => comment ? true : false);
        return comments;
      }
    } catch (e) {
      console.log(e)
    }

  },

  async getSubreddits (token) {
    try {
      const response = await fetch("https://oauth.reddit.com/subreddits/mine/subscriber.json", {
        method: "GET",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        }
      });
      if (response) {
        console.log(response);
        if (response.status === 401) {
          return ["Please login!"]
        } else if (response.ok) {
        const subredditListing = await response.json();
        console.log(subredditListing);
        let list = subredditListing.data.children.map(sub => {
          return {
            subreddit: sub.data.display_name,
            title: sub.data.title,
            id: sub.data.id
          }
        });
        list.sort((a,b) =>  {
          let i = 0;
          let x = a.subreddit.toLowerCase();
          let y = b.subreddit.toLowerCase();
          let z = x.charCodeAt(0) - y.charCodeAt(0);
          do {
            z = x.charCodeAt(i) - y.charCodeAt(i);
            i++;
          } while (z === 0);
          return z;
        });
        return list;
      }
    }
    } catch (e) {
      console.log(e);
    }
  },

  async vote (args, token) { //args = object containing vote direction and post/comment
    const endpoint = `https://oauth.reddit.com/api/vote?dir=${args.direction}&id=${args.id}`;
    try {
      const response = await fetch(endpoint, {
        method: "post",
        headers: {
          "Authorization": `bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        console.log(`vote cast on ${args.id}!`)

        const jsonResponse = await response.json();
        // console.log(jsonResponse);
        return jsonResponse;
      };
    } catch (e) {
      console.log(e);
    }
  }
};

export default reddit;