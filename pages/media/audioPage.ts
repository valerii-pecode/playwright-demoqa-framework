import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../BasePage";

export class AudioPage extends BasePage {
  private readonly audioTable: Locator;
  private readonly audioElement: Locator;
  private readonly audioSelector: string = "audio#media";
  private readonly tableSelector: string = "table#mediaTable";

  constructor(page: Page) {
    super(page);
    this.audioTable = page.locator(this.tableSelector);
    this.audioElement = page.locator(this.audioSelector);
  }

  async verifyBaseComponents() {
    await expect(this.audioTable).toBeVisible();
  }

  async selectAudio(audioName: string) {
    const audioLink = this.page.locator(
      `${this.tableSelector} a:has-text("${audioName}")`
    );
    
    await audioLink.click();
    await this.page.waitForSelector(this.audioSelector, { timeout: 10000 });
    
    const selector = this.audioSelector;
    await this.page.waitForFunction(
      (sel) => {
        const audio = document.querySelector(sel) as HTMLAudioElement;
        return audio && (audio.readyState > 1 || (audio.duration && audio.duration > 0));
      },
      selector,
      { timeout: 10000 }
    );

    await this.waitForTimeout(1500);
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  async play() {
    await this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      if (audio) {
        audio.play();
      }
    }, this.audioSelector);
  }

  async pause() {
    await this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      audio?.pause();
    }, this.audioSelector);
  }

  async isPaused(): Promise<boolean> {
    return this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      return audio?.paused ?? true;
    }, this.audioSelector);
  }

  async getCurrentTime(): Promise<number> {
    return this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      return audio?.currentTime ?? 0;
    }, this.audioSelector);
  }

  async getDuration(): Promise<number> {
    return this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      return audio?.duration ?? 0;
    }, this.audioSelector);
  }

  async setVolume(value: number) {
    const selector = this.audioSelector;
    await this.page.evaluate(({ selector: sel, vol }) => {
      const audio = document.querySelector(sel) as HTMLAudioElement;
      if (audio) audio.volume = vol;
    }, { selector, vol: value });
  }

  async getVolume(): Promise<number> {
    return this.page.evaluate((selector) => {
      const audio = document.querySelector(selector) as HTMLAudioElement;
      return audio?.volume ?? 0;
    }, this.audioSelector);
  }

  async verifyAudioLoaded() {
    const selector = this.audioSelector;
    const isAudioElement = await this.page.evaluate((sel) => {
      const audio = document.querySelector(sel) as HTMLAudioElement;
      return !!(audio && (audio.readyState > 0 || audio.currentSrc || audio.src));
    }, selector);
    expect(isAudioElement).toBeTruthy();
  }

  async verifyAudioPlaying() {
    const isPaused = await this.isPaused();
    expect(isPaused).toBeFalsy();
  }

  async verifyAudioPaused() {
    const isPaused = await this.isPaused();
    expect(isPaused).toBeTruthy();
  }
}
