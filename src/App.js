/*
    RobotStop - Browse Reddit by swiping
    Made in 2023-2024 by Tom Juzonis <https://gammagrey.github.io/>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    For technical support, or to discuss this program, please contact
    me at tjuzonis@gmail.com with the subject line "ROBOTSTOP Support."
*/

import "./App.css";
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "./app/components/Home/Home";
import Post from "./app/components//Post/Post";
import RedditPost from "./app/components/RedditPost/RedditPost";
import CommentsSection from "./app/components/CommentsSection/CommentsSection";
import Comment from "./app/components/Comment/Comment";
import Reply from "./app/components/Reply/Reply";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Home /> }>
    <Route path="" element={<Post />}>
      <Route path="post" element={<RedditPost />}>
        <Route path="comments" element={<CommentsSection />}>
          <Route path="" element={<Comment />}>
            <Route path="reply" element={<Reply />}/>
          </Route>
        </Route>
      </Route>
    </Route>
  </Route>
));

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}