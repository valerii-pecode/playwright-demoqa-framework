import { test, expect } from "@playwright/test";
import { test as mediaTest } from "../../fixtures/MediaFixtures";

// Skip webkit (mobile) tests for media as webkit doesn't support some media formats
mediaTest.skip(({ browserName }) => browserName === "webkit");

mediaTest.describe("Audio Playback Functionality", () => {
  mediaTest.beforeEach(async ({ audioPage }) => {
    await audioPage.verifyBaseComponents();
  });

  mediaTest("Play and pause audio - MP3", async ({ audioPage }) => {
    await audioPage.selectAudio("audio-sample.mp3");
    await audioPage.verifyAudioLoaded();

    await audioPage.play();
    await audioPage.waitForTimeout(500);
    await audioPage.verifyAudioPlaying();

    await audioPage.pause();
    await audioPage.verifyAudioPaused();
  });

  mediaTest("Play and pause audio - OGG", async ({ audioPage }) => {
    await audioPage.selectAudio("audio-sample.ogg");
    await audioPage.verifyAudioLoaded();

    await audioPage.play();
    await audioPage.waitForTimeout(500);
    await audioPage.verifyAudioPlaying();

    await audioPage.pause();
    await audioPage.verifyAudioPaused();
  });

  mediaTest("Adjust audio volume", async ({ audioPage }) => {
    await audioPage.selectAudio("audio-sample.mp3");
    await audioPage.verifyAudioLoaded();

    await audioPage.setVolume(0.5);
    const volume = await audioPage.getVolume();

    expect(volume).toBeGreaterThanOrEqual(0.45);
    expect(volume).toBeLessThanOrEqual(0.55);
  });

  mediaTest("Verify audio duration", async ({ audioPage }) => {
    await audioPage.selectAudio("audio-sample.ogg");
    await audioPage.verifyAudioLoaded();

    const duration = await audioPage.getDuration();
    expect(duration).toBeGreaterThan(0);
  });

  mediaTest("Volume control across different audio formats", async ({ audioPage }) => {
    await audioPage.selectAudio("audio-sample.mp3");
    await audioPage.setVolume(0.3);
    let volume = await audioPage.getVolume();
    expect(volume).toBeGreaterThanOrEqual(0.2);
    expect(volume).toBeLessThanOrEqual(0.4);

    await audioPage.selectAudio("audio-sample.ogg");
    await audioPage.setVolume(0.7);
    volume = await audioPage.getVolume();
    expect(volume).toBeGreaterThanOrEqual(0.6);
    expect(volume).toBeLessThanOrEqual(0.8);
  });
});

