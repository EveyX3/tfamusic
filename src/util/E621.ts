import type { Post } from "e621";
import E6 from "e621";
const E621 = new E6({
    authUser: process.env.e621User,
    authKey: process.env.e621APIKey,
    userAgent: process.env.userAgent
});
export const filterPosts = (posts: Array<Post>, noVideo: boolean, noFlash: boolean) => posts.filter(p => !Object.values(p.tags).reduce((a, b) => a.concat(b)).some(t => ["cub", "young"].includes(t)) || (noVideo && p.file.ext === "webm") || (noFlash && p.file.ext === "swf"));
export default E621;
