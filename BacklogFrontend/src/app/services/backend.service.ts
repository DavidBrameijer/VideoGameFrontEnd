import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameAPI, GameVideo, Genre, Platform } from '../models/game';
import { BackLogDTO, ProgressLog, RetrieveBackLogDTO } from '../models/progresslog';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // url:string = "http://localhost:5264/"; //ALAIN
  url:string = environment.apiDomain; //David
  constructor(
    private http:HttpClient,
    private router: Router
    ) { }

  getGames():Observable<GameAPI[]>
  {
    return this.http.get<GameAPI[]>(`${this.url}api/Game`);
  }

  getFilteredGames(name?:string, genre?:string, rating?:number, companyName?:string, platform?:string, releaseYear?:string):Observable<GameAPI[]>
  {
    // Create an object for query params
    let params: any = {};

      // Add parameters only if they have a value
    if (name) params.name = name;
    if (genre) params.genre = genre;
    if (rating) params.rating = rating;
    if (companyName) params.companyName = companyName;
    if (platform) params.platform = platform;
    if (releaseYear) params.releaseYear = releaseYear;
    return this.http.get<GameAPI[]>(`${this.url}filter`, {params});
  }

  getGameById(id:number):Observable<GameAPI>
  {
    return this.http.get<GameAPI>(`${this.url}api/Game/${id}`);
  }

  getSimilarGamesById(id:number):Observable<GameAPI[]>
  {
    return this.http.get<GameAPI[]>(`${this.url}similar/${id}`);
  }

  getBacklogGamesByUserId(id:number):Observable<GameAPI[]>
  {
    return this.http.get<GameAPI[]>(`${this.url}backlog/${id}`);
  }

  getProgressLogs():Observable<ProgressLog[]>
  {
    return this.http.get<ProgressLog[]>(`${this.url}api/ProgressLog`);
  }

  deleteProgressLog():Observable<ProgressLog>
  {
    return this.http.delete<ProgressLog>(`${this.url}api/ProgressLog`);
  }

  getLogById(id:number):Observable<ProgressLog>
  {
    return this.http.get<ProgressLog>(`${this.url}api/ProgressLog/${id}`);
  }

  updateProgressLog(id:number, dto:BackLogDTO):Observable<ProgressLog>
  {
    return this.http.put<ProgressLog>(`${this.url}DTO/${id}`, dto);
  }

  addProgressLog(p:BackLogDTO):Observable<ProgressLog>
  {
    return this.http.post<ProgressLog>(`${this.url}DTO`, p);
  }

  getLogByIdDTO(id:number):Observable<ProgressLog>
  {
    return this.http.get<ProgressLog>(`${this.url}DTO/${id}`);
  }

  getLogByUserIdDTO(id:number):Observable<RetrieveBackLogDTO[]>
  {
    return this.http.get<RetrieveBackLogDTO[]>(`${this.url}DTO/userID/${id}`);
  }

  getUsers():Observable<User[]>
  {
    return this.http.get<User[]>(`${this.url}api/Users`);
  }

  addUser(u:User):Observable<User>
  {
    return this.http.post<User>(`${this.url}api/Users`, u);
  }

  deleteUser(u:User):Observable<User>
  {
    return this.http.delete<User>(`${this.url}api/Users`);
  }

  getUserById(id:number):Observable<User>
  {
    return this.http.get<User>(`${this.url}api/Users/${id}`);
  }

  getFriendsById(id:number):Observable<User[]>
  {
    return this.http.get<User[]>(`${this.url}friends/${id}`);
  }

  addFriend(userId:number, friendId:number):Observable<User>
  {
    return this.http.post<User>(`${this.url}/friends/${userId}/${friendId}`, {});
  }

  deleteFriend(userId:number, friendId:number):Observable<User>
  {
    return this.http.delete<User>(`${this.url}friends/${userId}/${friendId}`);
  }


  updateUser(u:User):Observable<User>
  {
    return this.http.put<User>(`${this.url}api/Users/${u.id}`, u);
  }
  
  updateEXP(u:User):Observable<User>
  {
    return this.http.put<User>(`${this.url}XP/${u.id}`, u);
  }

  
  

  navigateToDetails(gameId: number){
    this.router.navigate(['details/', gameId]);
  }
  
  //videos
  getGameVideosByGameId(id:number):Observable<GameVideo[]>
  {
    return this.http.get<GameVideo[]>(`${this.url}api/Game/game_videos/${id}`)
  }


}
