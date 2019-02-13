import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  storedPosts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10]

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
     this.postService.getPosts();
    this.postSub = this.postService
      .getPostsUpdateLiscener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.storedPosts = posts;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }


  onChangePage(pageData: PageEvent){

  }


  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
