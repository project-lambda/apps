---
name: TidyMac
tagline: Clean, uninstall and watch your Mac
summary: A native Mac app that frees disk space, removes apps with their leftovers, runs maintenance and shows what your machine is doing.
icon: ./icon.png
accent: '#38BDF8'
category: Utilities
status: coming-soon
order: 2
# Direct download ahead of any store. Rebuild with scripts/release.sh in
# the TidyMac repo (Developer ID signed and notarized) and replace the file.
mac:
  file: downloads/TidyMac-0.1.0-4.dmg
  version: 0.1.0 (build 4)
  minimumOS: '14'
video:
  file: media/tidymac.mp4
  poster: ./video-poster.jpg
  caption: A scan from open to finished, in real time.
screenshots:
  - ./screenshots/01-clean.webp
  - ./screenshots/02-apps.webp
  - ./screenshots/03-optimize.webp
  - ./screenshots/04-analyze.webp
  - ./screenshots/05-status.webp
features:
  - title: Clean
    text: Caches, build products and logs your tools recreate on demand. Nothing goes until you have seen the list, and everything lands in the Trash first.
  - title: Apps
    text: Search your apps, uninstall them together with the files they leave behind, see what you have not opened in months, and manage what starts at login.
  - title: Optimize
    text: Maintenance tasks that say what they fix and what they touch before they run, including freeing memory without a password.
  - title: Analyze
    text: A map of where your disk space actually went, folder by folder.
  - title: Status
    text: A live dashboard for CPU, memory, disk, network, battery and fans, with the processes behind them. The same numbers sit in the menu bar, which opens with your Mac.
  - title: Light, fast, no subscription
    text: Five tabs in one native window, built for Apple Silicon and Intel. Under 5 MB to download and under 9 MB installed, and a full scan of a well-used Mac takes about half a minute.
faq:
  - q: Does TidyMac delete anything without asking?
    a: No. Every clean shows the full list first, and cleaned files go to the Trash so you can put them back. Uninstalling an app and emptying the Trash delete permanently, and TidyMac says so before you confirm.
  - q: Which Macs does it support?
    a: macOS 14 Sonoma and later, on Apple Silicon and Intel.
  - q: Is it on the Mac App Store?
    a: No. TidyMac needs access the App Store sandbox does not allow, so it is a direct download from this page.
  - q: Is the download signed?
    a: Yes. TidyMac is signed with a Developer ID and notarized by Apple, so it opens like any other app. Drag it into Applications and open it from there.
  - q: Does TidyMac start when my Mac starts?
    a: Yes, as a small icon in the menu bar with live stats and a shortcut to the app. Turn it off with the Open at login switch in that menu, or in System Settings under General, Login Items.
  - q: Is TidyMac free?
    a: Yes. No subscription, no account and no ads.
---

TidyMac is a native Mac app for the jobs that pile up on a working machine: disk space you cannot account for, apps you removed that left files behind, maintenance you are not sure is safe to run, and a machine that feels slow with no obvious reason.

Every action explains itself before it runs. The cleaner shows what it found and why it is safe to remove. Maintenance tasks say what they fix and what they touch. Nothing is hidden behind a single big button.

One window, five tabs, free. No subscription and no account.
