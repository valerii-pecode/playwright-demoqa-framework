import { Page } from "@playwright/test";
import { VideoPage } from "../pages/media/videoPage";
import { AudioPage } from "../pages/media/audioPage";
import { MEDIA_URL } from "../constants/media";

export class MediaNavigationService {
  constructor(private page: Page) {}

  async openVideoPlayer(): Promise<VideoPage> {
    await this.page.goto(MEDIA_URL);
    await this.page.waitForLoadState("domcontentloaded");
    return new VideoPage(this.page);
  }

  async openAudioPlayer(): Promise<AudioPage> {
    await this.page.goto(MEDIA_URL);
    await this.page.waitForLoadState("domcontentloaded");
    return new AudioPage(this.page);
  }
}
