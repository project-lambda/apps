---
name: PhotoRelay
tagline: Your photos, onto everything you trust
summary: Wireless photo and video transfer from your phone to computers, NAS boxes, cloud storage and other devices, with no middleman service.
icon: ./icon.png
accent: '#34D399'
category: Photography
status: coming-soon
order: 3
packageName: com.photorelay.photo_relay
# Direct downloads ahead of the stores. In the PhotoRelay repo, rebuild the
# Mac DMG with tool/macos/build_dmg.sh and the APK with
# `flutter build apk --release`, then replace the files in public/downloads.
mac:
  file: downloads/PhotoRelay-1.0.0.dmg
  version: 1.0.0
  minimumOS: '10.15'
android:
  file: downloads/PhotoRelay-1.0.0.apk
  version: 1.0.0
  minimumOS: '6.0'
screenshots:
  - ./screenshots/01-mac-home.webp
  - ./screenshots/02-mac-devices.webp
  - ./screenshots/03-mac-receive.webp
  - ./screenshots/04-mac-settings.webp
  - ./screenshots/05-phone-route.webp
  - ./screenshots/06-phone-receive.webp
  - ./screenshots/07-phone-cleanup.webp
  - ./screenshots/08-phone-settings.webp
features:
  - title: Send anywhere
    text: Another phone, a computer, a NAS over FTP, SFTP or WebDAV, S3-compatible storage, Dropbox, or a folder on the device itself.
  - title: Direct transfers
    text: Files go straight from your device to the destination you set up. Nothing passes through a server of ours.
  - title: Receive mode
    text: Turn a device into a destination. Other devices find it automatically, and any computer can open it in a browser.
  - title: Rules per destination
    text: Each destination keeps its own folder structure, quality setting and delete-after-transfer policy.
  - title: Never send twice
    text: Transfers are tracked per destination, so repeat runs only send what is new.
  - title: Clean up your library
    text: Find what is filling your phone and clear it once copies are safely away.
faq:
  - q: Do my photos go through your servers?
    a: No. PhotoRelay connects your device straight to the destination you configure. There is no account and no service in the middle.
  - q: Which destinations are supported?
    a: Another device running PhotoRelay, a computer, FTP and FTPS, SFTP, WebDAV, S3-compatible storage, Dropbox, and folders on the device.
  - q: Where are my server passwords kept?
    a: In your device's own secure storage, the keychain. They are used only to connect to the servers you set up.
  - q: Which platforms does it run on?
    a: iPhone and iPad on iOS 14 or later, Android 6 or later, and Mac on macOS 10.15 or later.
  - q: macOS says it cannot check PhotoRelay for malicious software. What do I do?
    a: The Mac build is not notarized by Apple yet, so macOS asks you to confirm it once. Drag PhotoRelay into Applications and open it. When the warning appears, open System Settings, go to Privacy & Security, scroll down and click Open Anyway next to PhotoRelay, then confirm. After that it opens normally.
  - q: How do I install the Android APK?
    a: Download the APK on your phone and open it. Android asks you to allow installs from your browser or Files app the first time; allow it, then tap Install. PhotoRelay needs Android 6.0 or later.
  - q: My phone does not show up on my Mac. What should I check?
    a: Both devices need to be on the same Wi-Fi network, with PhotoRelay open on the phone and Receive turned on. Allow Local Network access when the phone and the Mac ask for it; if you declined, turn it back on in Settings under Privacy & Security, Local Network. Guest networks and many office or hotel networks keep devices from seeing each other.
  - q: Where do files sent to my iPhone go?
    a: Into the PhotoRelay Inbox, which you can open in the Files app under On My iPhone, PhotoRelay. You can also see them in PhotoRelay's Receive tab.
---

PhotoRelay moves photos and videos off your phone and onto the places you already trust: your computer, the NAS in the cupboard, your own cloud storage, or another phone.

Set up a destination once, with its own folder structure and quality settings, and send to it whenever you like. Transfers go directly from your device to that destination, so nothing passes through anyone else's service, and there is no account to create.

When the copies are safely away, PhotoRelay tells you what is taking up space so you can clear the originals with confidence.
