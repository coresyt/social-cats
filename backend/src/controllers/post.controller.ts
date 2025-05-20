import postCreate from "./post/postcreate.controller";
import postId from "./post/postid.controller";
import postLike from "./post/postlike.controller";
import postsList from "./post/postlist.controller";
import postUnlike from "./post/postunlike.controller";
import postUpdate from "./post/postupdate.controller";
import postDelete from "./post/postdelete.controller";

export default {
  postsList,
  postId,
  postCreate,
  postUpdate,
  postLike,
  postUnlike,
  postDelete
}
