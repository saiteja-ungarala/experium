export class FramePreloader {
  private cache: Map<number, HTMLImageElement> = new Map();
  private totalFrames: number;
  private pathTemplate: (index: number) => string;
  private preloadQueue: number[] = [];
  private startPromise: Promise<void> | null = null;
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

  /** The requested frame, or the nearest loaded one (preferring earlier
   *  frames), so a fast scroll ahead of the loader shows a close frame
   *  instead of a black screen. */
  public getNearestFrame(index: number): HTMLImageElement | undefined {
    const exact = this.cache.get(index);
    if (exact) return exact;
    for (let i = index - 1; i >= 1; i--) {
      const img = this.cache.get(i);
      if (img) return img;
    }
    for (let i = index + 1; i <= this.totalFrames; i++) {
      const img = this.cache.get(i);
      if (img) return img;
    }
    return undefined;
  }

  public startPreloading(priorityFrames: number = 10): Promise<void> {
    // Idempotent: repeat calls (e.g. React StrictMode's double effect run)
    // get the ORIGINAL promise, which resolves only once the priority frames
    // have genuinely loaded — never an instantly-resolved duplicate.
    if (this.startPromise) return this.startPromise;

    this.startPromise = new Promise((resolve) => {
      let initialLoadCount = 0;

      const loadNext = () => {
        if (this.preloadQueue.length === 0) {
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
    return this.startPromise;
  }
}
