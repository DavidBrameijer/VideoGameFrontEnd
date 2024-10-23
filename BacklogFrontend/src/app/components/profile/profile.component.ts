import { Component } from '@angular/core';
import { User } from '../../models/user';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isLoggedIn: Boolean = false;
  currentUser:User = {} as User;
  friends: User[] = [];
  numGames:number = {} as number;
  yourProfile: boolean = false;

  constructor(
    private backendService: BackendService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(){
    this.displayUserInfo();
  }

  displayUserInfo(){
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = Number(params.get('id'));
    
      this.getUserInfo(id);

      this.getFriends(id);

    })
  }

  getUserInfo(id:number){
    this.backendService.getUserById(id).subscribe(response => {
      console.log(response);
      this.currentUser = response;
      if(this.currentUser.id == this.backendService.currentUser.id){
        this.yourProfile = true;
      }
      else if(this.backendService.currentUser.id)
      {
        this.isLoggedIn = true;
      }
    })
  }

  getFriends(id:number){
    this.backendService.getFriendsById(id).subscribe(response => {
      console.log(response);
      this.friends = response;
    })
  }

  addFriend(id:number){
    this.backendService.addFriend(this.backendService.currentUser.id, id).subscribe(response => {
      console.log(response);
    },
    err => {
      this.getFriends(id);
    }
  );
  this.getFriends(id);
  }
  
  removeFriend(id:number){
    console.log(id);
    this.backendService.deleteFriend(this.backendService.currentUser.id, id).subscribe(response => {
      console.log(response);
      this.getFriends(this.backendService.currentUser.id);
      this.backendService.deleteFriend(id, this.backendService.currentUser.id).subscribe(response => {
        console.log(response);
        
      },
    err => {
      console.log(err);
    })
      
    }, err => {
      console.log(err);
      this.getFriends(this.backendService.currentUser.id);
      this.backendService.deleteFriend(id, this.backendService.currentUser.id).subscribe(response => {
        console.log(response);
        
      },
      err => {
        console.log(err);
      }
    )
    })
   
  }

  navigateToBacklog(id:number){
    this.backendService.navigateToBacklog(id);
  }

  navigateToProfile(id:number){
    this.backendService.navigateToProfile(id);
  }

}
