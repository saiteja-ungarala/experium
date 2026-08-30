export class FramePreloader {
  private cache: Map<number, HTMLImageElement> = new Map();
  private totalFrames: number;
  private pathTemplate: (index: number) => string;
  private preloadQueue: number[] = [];
  private loading: boolean = false;
  private onProgressCallback?: (progress: number) => void;
  private framesLoaded: number = 0;

  constructor(totalFrames: number, pathTemplate: (index: number) => string) {
    this.totalFrames = totalFrames;
    this.pathTemplate = pathTemplate;
    
    // Initialize the queue sequentially
    for (let i = 1; i <= totalFrames; i++) {
      this.preloadQueue.push(i);
    }
  }

  public setOnProgress(callback: (progress: number) => void) {
    this.onProgressCallback = callback;
  }

  public getFrame(index: number): HTMLImageElement | undefined {
    return this.cache.get(index);
  }

  /**
   * The closest frame we actually hold. The queue fills in order, so a jump
   * deep into the sequence (a reload part-way down the page, a fast scrub)
   * asks for a frame that has not arrived yet; returning the nearest one keeps
   * a real image on screen instead of leaving the canvas blank.
   */
  public getNearestFrame(index: number): HTMLImageElement | undefined {
    const exact = this.cache.get(index);
    if (exact) return exact;

    let best: HTMLImageElement | undefined;
    let bestDistance = Infinity;
    this.cache.forEach((img, i) => {
      const distance = Math.abs(i - index);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = img;
      }
    });
    return best;
  }

  /**
   * Re-orders whatever is still queued so the frames around `index` load first.
   * Without this a reload half-way down the page waits for every earlier frame
   * to download before the one actually on screen is fetched.
   */
  public prioritizeAround(index: number) {
    if (this.preloadQueue.length < 2) return;
    this.preloadQueue.sort((a, b) => Math.abs(a - index) - Math.abs(b - index));
  }

  public startPreloading(priorityFrames: number = 10): Promise<void> {
    return new Promise((resolve) => {
      if (this.loading) {
        resolve();
        return;
      }
      this.loading = true;

      let initialLoadCount = 0;
      
      const loadNext = () => {
        if (this.preloadQueue.length === 0) {
          this.loading = false;
          return;
        }

        const index = this.preloadQueue.shift()!;
        const img = new Image();
        img.src = this.pathTemplate(index);

        img.onload = () => {
          this.cache.set(index, img);
          this.framesLoaded++;
          
          if (this.onProgressCallback) {
            this.onProgressCallback(this.framesLoaded / this.totalFrames);
          }

          if (initialLoadCount < priorityFrames) {
            initialLoadCount++;
            if (initialLoadCount === priorityFrames) {
              resolve(); // Resolve once the priority frames are loaded
            }
          }
          
          // Continue loading the next one
          requestAnimationFrame(loadNext);
        };

        img.onerror = () => {
          console.error(`Failed to load frame ${index}`);
          // Still proceed so one missing frame doesn't block everything
          if (initialLoadCount < priorityFrames) {
            initialLoadCount++;
            if (initialLoadCount === priorityFrames) {
              resolve();
            }
          }
          requestAnimationFrame(loadNext);
        };
      };

      // Start multiple parallel streams for faster initial loading, then settle into sequential
      const maxConcurrent = 4;
      for (let i = 0; i < Math.min(maxConcurrent, this.totalFrames); i++) {
        loadNext();
      }
    });
  }
}
