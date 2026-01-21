import { test } from "../../fixtures/MediaFixtures";
import { expect } from "@playwright/test";

// Skip mobile tests for media as they have different behavior
test.skip(({ browserName }) => browserName === "webkit");

test.describe("Video Playback Functionality", () => {
  test.beforeEach(async ({ videoPage }) => {
    await videoPage.verifyBaseComponents();
  });

  test("Play and pause video - vp8-vorbis-sintel.webm", async ({ videoPage }) => {
    await videoPage.selectVideo("vp8-vorbis-sintel.webm");
    await videoPage.verifyVideoLoaded();

    await videoPage.play();
    await videoPage.waitForTimeout(500);
    await videoPage.verifyVideoPlaying();

    await videoPage.pause();
    await videoPage.verifyVideoPaused();
  });

  test("Play and pause video - hevc-aac-caminandes-2.mp4", async ({ videoPage }) => {
    await videoPage.selectVideo("hevc-aac-caminandes-2.mp4");
    await videoPage.verifyVideoLoaded();

    await videoPage.play();
    await videoPage.waitForTimeout(500);
    await videoPage.verifyVideoPlaying();

    await videoPage.pause();
    await videoPage.verifyVideoPaused();
  });

  test("Seek forward in video", async ({ videoPage }) => {
    await videoPage.selectVideo("vp8-vorbis-sintel.webm");
    await videoPage.verifyVideoLoaded();

    await videoPage.play();
    await videoPage.waitForTimeout(500);

    const timeBefore = await videoPage.getCurrentTime();
    await videoPage.fastForward(5);
    const timeAfter = await videoPage.getCurrentTime();

    expect(timeAfter).toBeGreaterThan(timeBefore);
  });

  test("Seek backward in video", async ({ videoPage }) => {
    await videoPage.selectVideo("hevc-aac-caminandes-2.mp4");
    await videoPage.verifyVideoLoaded();

    await videoPage.play();
    await videoPage.waitForTimeout(2000);

    const timeBefore = await videoPage.getCurrentTime();
    if (timeBefore > 0) {
      await videoPage.rewind(Math.min(2, timeBefore));
      const timeAfter = await videoPage.getCurrentTime();
      expect(timeAfter).toBeLessThan(timeBefore);
    }
  });

  test("Adjust video volume", async ({ videoPage }) => {
    await videoPage.selectVideo("vp8-vorbis-sintel.webm");
    await videoPage.verifyVideoLoaded();

    await videoPage.setVolume(0.5);
    await videoPage.waitForTimeout(500);
    const volume = await videoPage.getVolume();

    expect(volume).toBeGreaterThanOrEqual(0.4);
    expect(volume).toBeLessThanOrEqual(0.6);
  });

  test("Verify video duration", async ({ videoPage }) => {
    await videoPage.selectVideo("hevc-aac-caminandes-2.mp4");
    await videoPage.verifyVideoLoaded();
  });

  test("Video playback with different formats - avc-aac-big-buck-bunny.m4v", async ({ videoPage }) => {
    await videoPage.selectVideo("avc-aac-big-buck-bunny.m4v");
    await videoPage.verifyVideoLoaded();

    await videoPage.play();
    await videoPage.waitForTimeout(1000);
    await videoPage.verifyVideoPlaying();

    await videoPage.pause();
    await videoPage.verifyVideoPaused();
  });

  test("Volume control across different videos", async ({ videoPage }) => {
    await videoPage.selectVideo("vp8-vorbis-sintel.webm");
    await videoPage.setVolume(0.3);
    let volume = await videoPage.getVolume();
    expect(volume).toBeGreaterThanOrEqual(0.2);
    expect(volume).toBeLessThanOrEqual(0.4);

    await videoPage.selectVideo("hevc-aac-caminandes-2.mp4");
    await videoPage.setVolume(0.7);
    volume = await videoPage.getVolume();
    expect(volume).toBeGreaterThanOrEqual(0.6);
    expect(volume).toBeLessThanOrEqual(0.8);
  });
});
