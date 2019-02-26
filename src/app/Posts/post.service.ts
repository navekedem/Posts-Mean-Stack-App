import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[] , postsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    const queryPage = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; postsCount: number }>(
        "http://localhost:3000/api/posts" + queryPage
      )
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postsData.postsCount
          };
        })
      )
      .subscribe(newPostsData => {
        console.log(newPostsData);
        this.posts = newPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postsCount: newPostsData.maxPosts});
      });
  }

  getPostsUpdateLiscener() {

    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);

    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }

    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(result => {

        this.router.navigate(["/"]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);

  }
}
