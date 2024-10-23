import { Component } from '@angular/core';
import { GameAPI } from '../../models/game';
import { BackendService } from '../../services/backend.service';
import { BackLogDTO, ProgressLog, RetrieveBackLogDTO } from '../../models/progresslog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-logs',
  standalone: true,
  imports: [FormsModule, DragDropModule, CommonModule],
  templateUrl: './user-logs.component.html',
  styleUrl: './user-logs.component.css'
})
export class UserLogsComponent {
  
  display: boolean[] = [];
  userLogs:RetrieveBackLogDTO[] = [];
  updateLog:RetrieveBackLogDTO = {} as RetrieveBackLogDTO;
  allLogs:ProgressLog[] = [];
  userGames: GameAPI[] = [];
  updatedGame = {} as RetrieveBackLogDTO;
  currentUser = {} as User;
  test:BackLogDTO = {} as BackLogDTO;
  yourBacklog: boolean = false;
  hideCompleted: boolean = false;
  showCompleted:boolean = false;

  constructor(
    private backendService:BackendService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getGamesById() {
    console.log(this.currentUser.id);
    this.backendService.getLogByUserIdDTO(this.currentUser.id).subscribe(response => {
      console.log(response);
      this.userLogs = response;
      this.display = new Array(this.userLogs.length).fill(false); // Initialize the display array
    })
  }

  navigateToDetails(gameId: number){
    this.router.navigate(['details/', gameId]);
  }

  updateGame(updatedLog:RetrieveBackLogDTO, index:number){
    this.test.gameId = updatedLog.game.id;

    if (this.updateLog.status)
    {
      this.test.status = this.updateLog.status;
    }
    else
    {
      this.test.status = updatedLog.status;
    }
    if (this.updateLog.playTime)
      {
        this.test.playTime = this.updateLog.playTime;
      }
      else
      {
        this.test.playTime = updatedLog.playTime;
      }
    this.test.order = updatedLog.order
    this.backendService.updateProgressLog(this.currentUser.id, this.test).subscribe(response => {
      console.log(response);
      this.userLogs[index].playTime = response.playtime;
      this.userLogs[index].status = response.status;
      updatedLog.order = response.order;
      this.updateLog = {} as RetrieveBackLogDTO;
    
    });
    if(updatedLog.status == "Complete")
    {
      this.backendService.updateEXP(this.currentUser).subscribe((response) => {
      console.log(response);
      })
    }
    this.getGamesById();
  }

  getCurrentUser(){
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = Number(params.get('id'));
      this.backendService.getUserById(id).subscribe((response) => {
        console.log(response);
        this.currentUser = response;
        if(this.currentUser.id == this.backendService.currentUser.id){
          this.yourBacklog = true;
        }
        else{
          this.yourBacklog = false;
        }
        this.getGamesById();
      });

     
    });
  }

  validateCurrentUser(){
  }

  displayToggle(index:number){
    this.display[index] = !this.display[index];
    this.updatedGame.game.id = this.userLogs[index].game.id;
  }

  drop(event: CdkDragDrop<RetrieveBackLogDTO[]>){
    moveItemInArray(this.userLogs, event.previousIndex, event.currentIndex);
    this.userLogs.forEach((log, index) => {
      log.order = index;
      this.updateGame(log, index);
    });
  }



    getUpdatedImage(url:string): string{
    return url.replace("t_thumb", "t_original");
  }

}
