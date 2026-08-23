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
