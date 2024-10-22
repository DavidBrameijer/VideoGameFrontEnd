import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

declare var YT: any; // Declare YT to avoid TypeScript errors

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  template: '<div #player></div>', // Create a placeholder for the player
  styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit {
  @ViewChild('player', { static: true }) playerElement!: ElementRef; // Reference to the player div
  @Input() videoId!: string; // Input property to receive the video ID
  player: any; // YouTube player instance

  ngOnInit(): void {
    if (!window['YT']) {
      this.loadYouTubeAPI();
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    this.player = new YT.Player(this.playerElement.nativeElement, {
      height: '390',
      width: '640',
      videoId: this.videoId,
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
    // Optionally, autoplay the video when the player is ready
    // event.target.playVideo();
  }

  onPlayerStateChange(event: any) {
    // Handle player state changes if needed
  }
}