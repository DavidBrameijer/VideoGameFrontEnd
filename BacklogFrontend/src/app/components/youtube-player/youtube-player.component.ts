import { Component, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, Input } from '@angular/core';

declare var YT: any;

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  template: '<div #player></div>',
  styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit, OnChanges {
  @ViewChild('player', { static: true }) playerElement!: ElementRef;
  @Input() videoId!: string;
  player: any;
  isPlayerReady = false;

  ngOnInit(): void {
    if (!window['YT']) {
      this.loadYouTubeAPI();
    } else {
      this.createPlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoId'] && this.player && this.isPlayerReady) {
      this.player.loadVideoById(this.videoId); // Load the new video
      this.player.stopVideo(); // Stop the current video
    }
  }

  createPlayer() {
    this.player = new YT.Player(this.playerElement.nativeElement, {
      height: '390',
      width: '640',
      videoId: this.videoId,
      playerVars: {
        autoplay: 0,
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this),
      },
    });
  }

  loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      this.createPlayer();
    };
  }

  onPlayerReady(event: any) {
    this.isPlayerReady = true; // Set the player ready flag
  }

  onPlayerStateChange(event: any) {
    // Handle player state changes if needed
  }
}