# RobotStop (Swiper for Reddit)

## A swipe-browsing app for Reddit
Browsing Reddit has never been more "fun!"
The initial idea was to make browsing Reddit more gamified than it is already.

Browse posts and comments by swiping left and right.  
Choose which subreddit to browse and the sorting order with the Filters menu in the top-right.

The interaction of swiping posts and comments left and right to upvote/downvote was inspired by how dating apps work. The swipe-to-vote functionality was scrapped when I stopped using the OAuth API and switched to the raw json API. Most of the code that used the OAuth API has been kept, but commented out.

Feel free to fork this repo and have some fun trying to use the RedditOAuth.js methods with the rest of the app.

[Hosted on GitHub Pages](https://gammagrey.github.io/robotstop).

## Possible Future Changes
* Convert post/comment text markdown into HTML.
* Rewrite commentsSlice, reddit.getComments() and reddit.getMoreComments() to implement a tree data structure for comments and replies.
* Add components to allow browsing deeper level comments.
* Show post and comment scores.
* Allow enlarging gallery images.
* Link to view a post on reddit.com.

## Technologies Used
React 18  
Redux Toolkit 6  
JS ES6, JSX, HTML, CSS

## Usage
* Download the repo.
* Install dependencies.
* "npm start" on CLI.

Or, [visit the app](https://gammagrey.github.io/robotstop) hosted on GitHub Pages.

## Support Info
Feel free to send an email to tjuzonis@gmail.com with the subject "RobotStop Support" if you have any issues or suggestions.

## Project Status
RobotStop is a showcase of my enjoyment of using React and a RESTful API to make interesting functionality.

Updates will be uncommon aside from fixing bugs that pop up.

## License

[GNU GENERAL PUBLIC LICENSE Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html#license-text).  
Feel free to use my code, and please contact me if you do!

## Acknowledgements
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Thank you to [CodeCademy](https://www.codecademy.com/) for their course on React 18.

Big thanks to Reddit for keeping their JSON API working.