import { Component, OnInit } from '@angular/core';
import { ProfileData } from '../models/profile.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  searchQuery: string;
  filter: string = "posts";
  users: ProfileData[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  runSearch() {
    if(this.filter) {
      if(this.filter === 'posts') {
        this.searchService.getPostsByQuery(this.searchQuery);
      } else if(this.filter === 'users') {
        this.searchService.getUsersByQuery(this.searchQuery);
      }
    }
  }

}
