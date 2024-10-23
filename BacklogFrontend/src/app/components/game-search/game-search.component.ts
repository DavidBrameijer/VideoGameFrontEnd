import { Component } from '@angular/core';
import { GameAPI, Genre } from '../../models/game';
import { BackendService } from '../../services/backend.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BackLogDTO } from '../../models/progresslog';
import { User } from '../../models/user';

@Component({
  selector: 'app-game-search',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink],
  templateUrl: './game-search.component.html',
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent {
  filteredGames:GameAPI[] = [];
  display:boolean = false;
  name:string = "";
  genre:string = "";
  total_rating:number|undefined;
  companyName:string|undefined;
  platform:string|undefined;
  releaseYear:string|undefined;
  newProgressLog:BackLogDTO = {} as BackLogDTO;
  currentUser = {} as User;

  constructor(
    private backendService:BackendService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.getCurrentUser();
  }

  // getCurrentUser(){
  //   this.activatedRoute.paramMap.subscribe((params) => {
  //     let id: number = Number(params.get('id'));

  //     this.backendService.getUserById(id).subscribe((response) => {
  //       console.log(response);
  //       this.currentUser = response;
  //     });
  //   });
  // }

  filterGames(){
    this.name || undefined,
    this.genre || undefined,
    this.total_rating !== null && this.total_rating !== 0 ? this.total_rating : undefined,
    this.companyName || undefined,
    this.platform || undefined,
    this.releaseYear || undefined
    this.backendService.getFilteredGames(this.name, this.genre, this.total_rating, this.companyName, this.platform, this.releaseYear).subscribe(response =>{
      console.log(response);
      this.filteredGames = response;
    })
  }

  displayToggle(){
    this.display = !this.display;
  }

  getGenres(genres: Genre[]): string{
    if (genres == null)
    {
      return "N/A";
    }
    else
    {
      return genres.map(genre => genre.name).join(', ');
    }
    
  }

  navigateToDetails(gameId: number){
    this.router.navigate(['details/', gameId]);
  }

  addToBacklog(gameId:number){
    this.newProgressLog.gameId = gameId;
    this.newProgressLog.userId = this.backendService.currentUser.id;
    console.log(this.newProgressLog);
    this.backendService.addProgressLog(this.newProgressLog).subscribe(response => {
      console.log(response);
    });
  }
  
}
