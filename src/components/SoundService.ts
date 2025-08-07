/**
 * Simple sound service for playing audio cues during score changes
 */
export class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = false;
  private audioQueue: Array<{ score: number; delay: number }> = [];
  private isProcessingQueue: boolean = false;
  private isIpadDevice: boolean = false;
  private preloadedAudio: HTMLAudioElement | null = null;

  constructor() {
    // Only initialize audio context in browser environment
    if (typeof window !== 'undefined') {
      this.detectIpadDevice();
      this.initializeAudioContext();
      this.preloadAudio();
    }
  }

  private detectIpadDevice() {
    // Detect iPad and iPad-style devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isIpad = /ipad/.test(userAgent) || 
                   (/macintosh/.test(userAgent) && 'ontouchend' in document);
     // Seems single mp3 solution works better on iPad
    this.isIpadDevice = false; // isIpad;
  }

  private initializeAudioContext() {
    try {
      // Create AudioContext only when needed and with user interaction
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.enabled = true;
    } catch (error) {
      console.warn('Audio not supported in this browser:', error);
      this.enabled = false;
    }
  }

  private preloadAudio() {
    try {
      // Preload the consolidated scores.mp3 file
      this.preloadedAudio = new Audio();
      this.preloadedAudio.preload = 'auto';
      this.preloadedAudio.volume = 1;
      this.preloadedAudio.src = '/sound/scores.mp3';
      this.preloadedAudio.load();
    } catch (error) {
      console.warn('Error preloading audio:', error);
      this.preloadedAudio = null;
    }
  }

  /**
   * Play score announcement sounds for both players
   */
  public playScoreSound(player1Score: number, player2Score: number) {
    if (typeof window === 'undefined' || !this.enabled) return;

    try {
      this.audioQueue = [];
      
      // Add both scores to queue (do not clear queue)
      this.audioQueue.push({ score: player1Score, delay: 0 });

      if (!this.isIpadDevice) {
        this.audioQueue.push({ score: player2Score, delay: 0 });
      }
     
      // Start processing queue if not already running
      this.processAudioQueue();
    } catch (error) {
      console.warn('Error playing score sound:', error);
    }
  }

  /**
   * Process audio queue sequentially to ensure reliable playback on iOS
   */
  private async processAudioQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;
    try {
      while (this.audioQueue.length > 0) {
        const item = this.audioQueue.shift();
        if (!item) continue;
        if (item.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, item.delay));
        }
        await this.playPlayerScoreAsync(item.score);
      }
    } catch (error) {
      console.warn('Error processing audio queue:', error);
    } finally {
      this.isProcessingQueue = false;
      // If new items were added while processing, process them now
      if (this.audioQueue.length > 0) {
        this.processAudioQueue();
      }
    }
  }

  /**
   * Ensure audio is preloaded, attempt to preload if not available
   */
  private async ensureAudioPreloaded(): Promise<HTMLAudioElement | null> {
    if (this.preloadedAudio) {
      return this.preloadedAudio;
    }

    // Try to preload audio if not already done
    try {
      this.preloadedAudio = new Audio();
      this.preloadedAudio.preload = 'auto';
      this.preloadedAudio.volume = 1;
      this.preloadedAudio.src = '/sound/scores.mp3';
      
      // Wait for audio to be ready
      return new Promise((resolve, reject) => {
        this.preloadedAudio!.oncanplaythrough = () => {
          resolve(this.preloadedAudio);
        };
        
        this.preloadedAudio!.onerror = () => {
          reject(new Error('Failed to preload audio'));
        };
        
        // Set a timeout to avoid hanging
        setTimeout(() => {
          reject(new Error('Audio preload timeout'));
        }, 5000);
        
        this.preloadedAudio!.load();
      });
    } catch (error) {
      console.warn('Error preloading audio on demand:', error);
      return null;
    }
  }

  /**
   * Play individual player score asynchronously
   */
  private playPlayerScoreAsync(score: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Use beep for iPad devices, consolidated MP3 file for others
        if (this.isIpadDevice) {
          this.playBeepSound(score).then(resolve).catch(reject);
        } else {
          // Ensure audio is preloaded
          const audio = await this.ensureAudioPreloaded();
          if (!audio) {
            reject(new Error('Audio not available'));
            return;
          }

          // Calculate start time in the consolidated audio file
          let startTime: number;
          if (score <= 16) {
            startTime = score; // 0-16 seconds for scores 0-16
          } else {
            startTime = 17; // Use "point" sound for scores > 16
          }
          
          // Set current time to start position
          audio.currentTime = startTime;
          
          audio.play()
            .then(() => {
              // Stop after 1 second and resolve
              setTimeout(() => {
                audio.pause();
                resolve();
              }, 1000);
            })
            .catch(reject);
        }
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Play a beep sound for iPad devices using Web Audio API
   */
  private playBeepSound(score: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.audioContext) {
          reject(new Error('Audio context not available'));
          return;
        }

        // Resume audio context if it's suspended
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }

        // Create oscillator and gain nodes
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Calculate frequency based on score (higher scores = higher pitch)
        const baseFreq = 400; // Base frequency
        const frequency = baseFreq + (score * 25); // Increase frequency by 50Hz per point
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';

        // Set volume envelope for maximum volume beep
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        // Play the beep sound
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);

        // Resolve after the sound finishes
        setTimeout(() => {
          resolve();
        }, 350); // Slightly longer than sound duration

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Play a different sound for corrections (lower pitch)
   */
  public playCorrectionSound() {
    if (typeof window === 'undefined' || !this.enabled || !this.audioContext) return;

    try {
      // Resume audio context if it's suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a lower pitched beep for corrections
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure the correction sound (lower pitch)
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime); // 400Hz tone
      oscillator.type = 'sine';

      // Set volume envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

      // Play the sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);

    } catch (error) {
      console.warn('Error playing correction sound:', error);
    }
  }

  /**
   * Play a special sound for game wins
   */
  public playWinSound(winner: 'player1' | 'player2' = 'player1') {
    if (typeof window === 'undefined' || !this.enabled) return;

    // Add 3 second delay before playing win sound
    setTimeout(async () => {
      try {
        if (this.isIpadDevice) {
          // Play a special beep sequence for win on iPad
          this.playWinBeepSequence(winner);
        } else {
          // Ensure audio is preloaded
          const audio = await this.ensureAudioPreloaded();
          if (!audio) {
            console.warn('Audio not available for win sound');
            return;
          }

          // Use consolidated audio file with time-based playback
          const startTime = winner === 'player1' ? 18 : 19; // 18-19s for home_won, 19-20s for quest_won
          
          // Set current time to start position
          audio.currentTime = startTime;
          
          audio.play()
            .then(() => {
              // Stop after 1 second
              setTimeout(() => {
                audio.pause();
              }, 1000);
            })
            .catch(error => {
              console.warn(`Error playing win sound for ${winner}:`, error);
            });
        }

      } catch (error) {
        console.warn('Error playing win sound:', error);
      }
    }, 3000); // 3 second delay
  }

  /**
   * Play a celebratory beep sequence for win on iPad devices
   */
  private playWinBeepSequence(winner: 'player1' | 'player2') {
    if (!this.audioContext) return;

    try {
      // Resume audio context if it's suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Define different sequences for each player
      const frequencies = winner === 'player1' 
        ? [523, 659, 784, 1047] // C5, E5, G5, C6 - ascending melody
        : [1047, 784, 659, 523]; // C6, G5, E5, C5 - descending melody

      // Play sequence of beeps
      frequencies.forEach((freq, index) => {
        const startTime = this.audioContext!.currentTime + (index * 0.2);
        
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = 'sine';

        // Set volume envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

        // Play the beep
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.18);
      });

    } catch (error) {
      console.warn('Error playing win beep sequence:', error);
    }
  }

  /**
   * Enable or disable sound
   */
  public setEnabled(enabled: boolean) {
    this.enabled = enabled && !!this.audioContext;
  }

  /**
   * Check if sound is available and enabled
   */
  public isEnabled(): boolean {
    return this.enabled && !!this.audioContext;
  }
}

// Export a singleton instance with safe initialization
let soundServiceInstance: SoundService | null = null;

export const soundService = (() => {
  if (typeof window !== 'undefined' && !soundServiceInstance) {
    soundServiceInstance = new SoundService();
  }
  return soundServiceInstance || {
    playScoreSound: () => {},
    playCorrectionSound: () => {},
    playWinSound: () => {},
    setEnabled: () => {},
    isEnabled: () => false,
  };
})();
