---
name: Framely
tagline: Store-ready screenshots in minutes
summary: Turn plain app screenshots into polished App Store and Google Play images, with device frames, matched backdrops and captions.
icon: ./icon.png
accent: '#1FC98A'
category: Productivity
# Change to `live` once the app is published; that shows the store button.
status: coming-soon
order: 1
packageName: com.emroze.framely
stores:
  googlePlay: https://play.google.com/store/apps/details?id=com.emroze.framely
# The Mac build ships ahead of the stores. Rebuild with
# tool/macos/build_dmg.sh in the Framely repo and replace the file.
mac:
  file: downloads/Framely-1.0.0.dmg
  version: 1.0.0
  minimumOS: '11'
screenshots:
  - ./screenshots/01-frame.png
  - ./screenshots/02-templates.png
  - ./screenshots/03-devices.png
  - ./screenshots/04-backdrops.png
  - ./screenshots/05-captions.png
  - ./screenshots/06-export.png
  - ./screenshots/07-projects.png
features:
  - title: Template sets
    text: Start from a matching five-page listing with headlines and backdrops already laid out.
  - title: Device frames
    text: Modern phones and tablets, drawn as vectors so they stay sharp at every export size.
  - title: Backdrops from your screenshot
    text: Framely reads the colours in each shot and builds matching gradients for you.
  - title: Captions that stay readable
    text: Edit headlines on the page. Switch backdrops and the text keeps its contrast.
  - title: Every store size at once
    text: App Store, Google Play, feature graphic and social sizes, exported in one pass.
  - title: Private and offline
    text: No account, no ads, no tracking. Your screenshots never leave your device.
faq:
  - q: Does Framely upload my screenshots?
    a: No. Everything happens on your phone or Mac. Framely has no servers and makes no network requests.
  - q: Which export sizes are included?
    a: App Store 6.9", 6.7", 6.5", 5.5" and iPad, Google Play phone, tablet and feature graphic, plus square, story and social link images.
  - q: Where do exported images go?
    a: On a phone, to a Framely album in your photos or to any app you pick from the share sheet. On a Mac, to a Framely folder in your Downloads, or to any app you pick from the share menu.
  - q: Which Macs does Framely run on?
    a: macOS 11 Big Sur and later, on Apple Silicon and Intel. It is a direct download from this page.
  - q: My Mac says Framely cannot be opened. What do I do?
    a: The Mac build is not notarized by Apple yet, so macOS asks you to confirm it once. Drag Framely into Applications and open it. When the warning appears, open System Settings, go to Privacy & Security, scroll down and click Open Anyway next to Framely, then confirm. After that it opens normally.
  - q: Do I need an internet connection?
    a: No. Every font and template ships inside the app, so it works fully offline.
---

Framely turns plain app screenshots into polished store listing images in minutes, right on your phone or Mac.

Drop in a screenshot, pick a device frame and a backdrop, add a headline, and export every size the App Store and Google Play ask for in one pass. Every page is rendered fresh at full resolution, so what you see in the editor is exactly what you export.

Made for indie developers, designers and anyone launching an app who would rather ship than fight a design tool.
