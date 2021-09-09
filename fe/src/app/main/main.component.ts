import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface Image {
  date: string;
  explanation: string;
  title: string;
  url: string;
  liked: boolean;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public startDate: FormGroup;
  public imageList: Image[];
  public likedImages = new Set([]);
  public image: Image;
  public loading: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.imageList = [];
  }

  ngOnInit(): void {
    let loadLiked = JSON.parse(localStorage.getItem('likedImages'));
    if(loadLiked) {
      for(var i=0;i<loadLiked.length;i++){
        this.likedImages.add(loadLiked[i]);
      }
    }
    this.initForm();
    this.getImages();
  }

  private initForm(): void {
    this.startDate = this.fb.group({
      startDate: ''
    })
  }

  public handleLike(post: Image) {
    if(!post.liked) {
      this.likedImages.add(post.url);
    }
    else {
      this.likedImages.delete(post.url);
    }
    post.liked = !post.liked;

    localStorage.setItem('likedImages', JSON.stringify([...this.likedImages]));
  }

  public onSubmit(): void {
    this.getImages(this.startDate.value['startDate']);
  }

  public getImages(date: string = "2021-09-01") {
    this.loading = true;
    this.http.get<Image[]>(
      'https://api.nasa.gov/planetary/apod', 
      {
        params: {
          'start_date' : date,
          'api_key' : 'oRDfUpx9qgqFYOfForjA4RH75Yoeg1eyMRQGLQi2'
        }
      }
    ).subscribe(
      res => {
        for(var i=res.length-1;i>=0;i--){
          this.image = res[i];
          if(this.likedImages.has(res[i].url)) {
            this.image.liked = true;
          }
          else {
            this.image.liked = false;
          }
          this.imageList.push(this.image);
        }
        this.loading = false;
      }
    )
  }
}
