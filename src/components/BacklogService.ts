import { type Setter } from "solid-js";
import { BacklogEventType, GameMode, type BacklogEvent, type MatchState } from "./common";

export class BacklogService {
  private url: string;
  private intervalId: number | null = null;
  private lastFetchedTimestamp: string = "";
  
  constructor(
    url: string,
    private setMatchState: Setter<MatchState>,
    private setMode: Setter<GameMode>,
    private player1Scored: () => void,
    private player2Scored: () => void,
    private player1Correction: () => void,
    private player2Correction: () => void,
    private newGame: () => void
  ) {
    this.url = url;
  }

  start() {
    if (this.intervalId) {
      this.stop();
    }
    
    // Fetch immediately, then every second
    this.fetchEvents();
    this.intervalId = window.setInterval(() => {
      this.fetchEvents();
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async fetchEvents() {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Backlog service: HTTP error ${response.status}`);
        return;
      }

      const events: BacklogEvent[] = await response.json();
      
      if (!Array.isArray(events)) {
        console.warn('Backlog service: Invalid response format');
        return;
      }

      // Filter events newer than the last fetched timestamp
      const newEvents = events.filter(event => 
        event.timestamp > this.lastFetchedTimestamp
      );

      // Sort events by timestamp to ensure proper order
      newEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      // Apply each event
      for (const event of newEvents) {
        this.applyEvent(event);
      }

      // Update last fetched timestamp if we have new events
      if (newEvents.length > 0) {
        this.lastFetchedTimestamp = newEvents[newEvents.length - 1].timestamp;
      }

    } catch (error) {
      console.warn('Backlog service: Failed to fetch events', error);
    }
  }

  private applyEvent(event: BacklogEvent) {
    console.log('Applying backlog event:', event);
    
    switch (event.type) {
      case BacklogEventType.Player1Scored:
        this.player1Scored();
        break;
      
      case BacklogEventType.Player2Scored:
        this.player2Scored();
        break;
      
      case BacklogEventType.Player1Decrease:
        this.player1Correction();
        break;
      
      case BacklogEventType.Player2Decrease:
        this.player2Correction();
        break;
      
      case BacklogEventType.RestartGame:
        this.newGame();
        break;
      
      default:
        console.warn('Backlog service: Unknown event type', event.type);
    }
  }

  updateUrl(newUrl: string) {
    this.url = newUrl;
    // Reset timestamp when URL changes to ensure we get all events
    this.lastFetchedTimestamp = "";
  }
}
