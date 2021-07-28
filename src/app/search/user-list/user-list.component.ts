import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileData } from 'src/app/models/profile.model';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: ProfileData[] = [];
  
  constructor(private searchService: SearchService, 
    private router: Router) { }

  ngOnInit(): void {
    this.searchService.emitUsers.subscribe(users => {
      if(users) {
        this.users = users;
      }
    });
  }

  onViewProfile(id: string) {
    this.router.navigate(['/profile/' + id]);
  }
}
