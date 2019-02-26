import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-posts-list",
  templateUrl: "./posts-list.component.html",
  styleUrls: ["./posts-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  userIsAuth: boolean = false;
  private authListenerSubs: Subscription;
  storedPosts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  currentPage;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10]

  constructor(public postService: PostService , private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage , 1);
    this.postSub = this.postService
      .getPostsUpdateLiscener()
      .subscribe((postsData: {posts: Post[] , postsCount: number}) => {
        this.isLoading = false;
        this.storedPosts = postsData.posts;
        this.totalPosts = postsData.postsCount;
      });
      this.userIsAuth = this.authService.getIsUserAuth();
      this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(result => {
        this.userIsAuth = result;
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(()=>{

      this.postService.getPosts(this.postsPerPage,this.currentPage);
    });
  }


  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }


  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
