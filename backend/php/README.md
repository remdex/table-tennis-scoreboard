# Backend API Documentation

This directory contains the PHP backend for handling game events and maintaining a backlog of all game actions.

## Supported Event Types

The system supports 5 different event types for tracking game state:

```js
export enum BacklogEventType {
  Player1Scored = 1,    // Player 1 scores a point
  Player2Scored = 2,    // Player 2 scores a point
  Player1Decrease = 3,  // Player 1 loses a point (correction)
  Player2Decrease = 4,  // Player 2 loses a point (correction)
  RestartGame = 5,      // Game is restarted
}
```

## Payload Structure

Events are stored in JSON format as an array of objects. Each event contains:
- `type`: The event type (1-5 as defined above)
- `timestamp`: When the event occurred (YYYY-MM-DD HH:MM:SS format)

### Example payload.json:

```json
[
    {
        "type": 1,
        "timestamp": "2025-08-06 07:08:51"
    },
    {
        "type": 2,
        "timestamp": "2025-08-06 07:08:52"
    }
]
```

## API Usage

Send HTTP GET requests to `payload.php` with the event type parameter:

### Home Assistant Integration Example:

```yaml
shell_command:
  player_1_scored: 'curl -k "http://example.com/payload.php?type=1"'
  player_2_scored: 'curl -k "http://example.com/payload.php?type=2"'
  player_1_decrease: 'curl -k "http://example.com/payload.php?type=3"'
  player_2_decrease: 'curl -k "http://example.com/payload.php?type=4"'
  restart_game: 'curl -k "http://example.com/payload.php?type=5"'
```

## Files

- `payload.php` - Main API endpoint for receiving and processing events
- `payload.json` - JSON file storing the event backlog
- `README.md` - This documentation file