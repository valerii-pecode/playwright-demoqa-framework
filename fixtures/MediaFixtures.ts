import { test as base } from "@playwright/test";
import { VideoPage } from "../pages/media/videoPage";
import { AudioPage } from "../pages/media/audioPage";
import { MediaNavigationService } from "../services/MediaNavigationService";

export type MediaFixtures = {
  mediaNavigationService: MediaNavigationService;
  videoPage: VideoPage;
  audioPage: AudioPage;
};

export const test = base.extend<MediaFixtures>({
  mediaNavigationService: async ({ page }, use) => {
    const service = new MediaNavigationService(page);
    await use(service);
  },

  videoPage: async ({ mediaNavigationService }, use) => {
    const videoPage = await mediaNavigationService.openVideoPlayer();
    await use(videoPage);
  },

  audioPage: async ({ mediaNavigationService }, use) => {
    const audioPage = await mediaNavigationService.openAudioPlayer();
    await use(audioPage);
  },
});
