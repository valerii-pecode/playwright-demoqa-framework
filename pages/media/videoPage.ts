import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export class VideoPage extends BasePage {
  private readonly videoTable: Locator;
  private readonly videoElement: Locator;
  private readonly videoSelector: string = "video#media";
  private readonly tableSelector: string = "table#mediaTable";

  constructor(page: Page) {
    super(page);
    this.videoTable = page.locator(this.tableSelector);
    this.videoElement = page.locator(this.videoSelector);
  }

  async verifyBaseComponents() {
    await expect(this.videoTable).toBeVisible();
  }

  async selectVideo(videoName: string) {
    const videoLink = this.page.locator(
      `${this.tableSelector} a:has-text("${videoName}")`
    );
    
    await videoLink.click();
    await this.page.waitForSelector(this.videoSelector, { timeout: 10000 });
    
    const selector = this.videoSelector;
    await this.page.waitForFunction(
      (sel) => {
        const video = document.querySelector(sel) as HTMLVideoElement;
        return video && (video.readyState > 0 || video.src || video.currentSrc);
      },
      selector,
      { timeout: 10000 }
    );
    
    await this.waitForTimeout(1000);
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async isPaused(): Promise<boolean> {
    return this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      return video?.paused ?? true;
    }, this.videoSelector);
  }

  async play() {
    await this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      if (video) {
        video.play();
      }
    }, this.videoSelector);
  }

  async pause() {
    await this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      if (video) {
        video.pause();
      }
    }, this.videoSelector);
  }

  async rewind(seconds: number) {
    const selector = this.videoSelector;
    await this.page.evaluate(({ selector: sel, secs }) => {
      const video = document.querySelector(sel) as HTMLVideoElement;
      if (video) {
        video.currentTime = Math.max(0, video.currentTime - secs);
      }
    }, { selector, secs: seconds });
  }

  async fastForward(seconds: number) {
    const selector = this.videoSelector;
    await this.page.evaluate(({ selector: sel, secs }) => {
      const video = document.querySelector(sel) as HTMLVideoElement;
      if (video) {
        video.currentTime += secs;
      }
    }, { selector, secs: seconds });
  }

  async getCurrentTime(): Promise<number> {
    return this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      return video?.currentTime ?? 0;
    }, this.videoSelector);
  }

  async getDuration(): Promise<number> {
    return this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      return video?.duration ?? 0;
    }, this.videoSelector);
  }

  async setVolume(value: number) {
    const selector = this.videoSelector;
    await this.page.evaluate(({ selector: sel, vol }) => {
      const video = document.querySelector(sel) as HTMLVideoElement;
      if (video) video.volume = vol;
    }, { selector, vol: value });
  }

  async getVolume(): Promise<number> {
    return this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      return video?.volume ?? 0;
    }, this.videoSelector);
  }

  async enterFullscreen() {
    await this.page.evaluate((selector) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      if (video) {
        video.requestFullscreen();
      }
    }, this.videoSelector);
  }

  async verifyVideoLoaded() {
    const selector = this.videoSelector;
    const isVideoElement = await this.page.evaluate((sel) => {
      const video = document.querySelector(sel) as HTMLVideoElement;
      return !!(video && (video.readyState > 0 || video.currentSrc || video.src));
    }, selector);
    expect(isVideoElement).toBeTruthy();
  }

  async verifyVideoPlaying() {
    const isPaused = await this.isPaused();
    expect(isPaused).toBeFalsy();
  }

  async verifyVideoPaused() {
    const isPaused = await this.isPaused();
    expect(isPaused).toBeTruthy();
  }
}
