import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { PostService } from "../post.service";
import { mimeType } from './mime-type.validator';
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  post: Post;
  form: FormGroup;
  imageSrc: string;
  private mode = "create";
  private postId: string;
  private authStatus: Subscription;
  constructor(public postService: PostService,private authService: AuthService ,public route: ActivatedRoute) {}

  ngOnInit() {
    this.authStatus = this.authService.getAuthStatusListener().subscribe(authSts => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(updatedPost => {
          this.isLoading = false;
          this.post = {
            id: updatedPost._id,
            title: updatedPost.title,
            content: updatedPost.content,
            imagePath: updatedPost.imagePath,
            creator: updatedPost.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }


  onImageUpdate(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
    reader.readAsDataURL(file);
  }




  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode == "create") {
      this.postService.addPosts(this.form.value.title, this.form.value.content , this.form.value.image);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
      );
    }
    this.form.reset();
  }
  ngOnDestroy(): void {
   this.authStatus.unsubscribe();
  }
}
