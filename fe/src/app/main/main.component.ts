import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Image {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public imageList: Image[];
  public loaded: boolean;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get<Image[]>(
      'https://api.nasa.gov/planetary/apod', 
      {
        params: {
          'start_date' : '2021-09-01',
          'end_date' : '2021-09-04',
          'api_key' : 'oRDfUpx9qgqFYOfForjA4RH75Yoeg1eyMRQGLQi2'
        }
      }
    ).subscribe(
      res => {
        this.loaded = true;
        this.imageList = res;
      }
    )
  }

}
