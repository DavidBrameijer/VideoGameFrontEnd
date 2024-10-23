import { Component } from '@angular/core';
import { User } from '../../models/user';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent {
  allUsers:User[] = [];
  topTen:User[] = [];
  filteredUsers:User[] = [];
  name:string = "";

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(){
    this.displayUsers();
  }

  displayUsers() {
    this.backendService.getUsers().subscribe((response) => {
      console.log(response);
      this.allUsers = response;
      this.topTen = this.allUsers;
      this.topTen.sort((a, b) => b.totalXp - a.totalXp).slice(0, 10);
    })
  }

  navigateToBacklog(id:number){
    this.backendService.navigateToBacklog(id);
  }

  navigateToProfile(id:number){
    this.backendService.navigateToProfile(id);
  }

  searchFriend(){
    if (this.name)
    {
      this.filteredUsers = this.allUsers.filter(users => users.userName.toLowerCase().includes(this.name.toLowerCase()));
    }
  }
}
