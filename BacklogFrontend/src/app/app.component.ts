import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { UserLogsComponent } from "./components/user-logs/user-logs.component";
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { BackendService } from './services/backend.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HomeComponent, UserLogsComponent, GoogleSigninButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BacklogFrontend';

  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  currentUser: User = {} as User;

  constructor( private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService){}

  ngOnInit() {
    //authState is a custom observable that will run again any time changes are noticed.
    this.socialAuthServiceConfig.authState.subscribe((userResponse: SocialUser) => {
      this.googleUser = userResponse;
      //if login fails, it will return null.
      this.loggedIn = (userResponse != null);
      if(this.loggedIn == true){
        let u:User = {
          id: 0,
          googleId: this.googleUser.id,
          userName: this.googleUser.name,
          pfp: this.googleUser.photoUrl,
          totalXp: 0,
          level: 0,
        }
        this.backendService.addUser(u).subscribe(response => console.log(response));
        this.backendService.getUsers().subscribe((response) => {
          console.log(response);
          this.currentUser = response.find(user => user.googleId == this.googleUser.id)!;
          this.backendService.currentUser = this.currentUser;
        })
      }
    });
  }
  //login component doesn't account for logging out.
  signOut(): void {
    this.socialAuthServiceConfig.signOut();
    this.currentUser = {} as User;
    this.backendService.currentUser = {} as User;
  }

  navigateToBacklog(){
    this.backendService.navigateToBacklog(this.currentUser.id);
  }
}
