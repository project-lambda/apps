---
effectiveDate: 2026-10-31
---

Hushtype is a keyboard for iPhone, made by Abdullah Emroze, with an AI key that fixes,
rewrites, translates and replies. It is built so that what you type stays
on your phone. This page says exactly what that means.

## The short version

- We collect nothing you type. Hushtype has no account, no Hushtype server,
  no analytics, no ads and no tracking.
- What you type is processed on your phone and never sent to us.
- Your text leaves your phone in one case only: you connect your own AI
  account with your own key. Then it goes straight from your phone to that
  company, and every result says so.
- Crash reports stay on your phone unless you choose to share one.
- Apple handles payments. Our payment service, RevenueCat, keeps the record
  of what you bought under a random id. We never see your card, your name or
  your Apple ID.

## What we collect

Only what a purchase needs, through RevenueCat (see Purchases below): the
record of what you bought, a random id for this install and basic device
facts. We, the developer, do not receive what you type, your history, your
learned words, your voice, your settings, your contacts, your location or
any usage statistics. There is no Hushtype server for any of it to go to.

## What stays on your phone

Everything Hushtype keeps lives in the app's own storage and in the storage
it shares with its own keyboard, on your phone:

- **Your settings**, such as your chosen engine, layout, tone and the
  targets and tokens you set up.
- **History** of your recent AI results, if you turn it on. It is capped,
  you choose how long it is, and you can erase it at any time on the
  Privacy screen in the Hushtype app.
- **Learned words and recent emoji**, so suggestions fit how you write. You
  can erase them on the Privacy screen in the Hushtype app.
- **Voice typing**: your voice is turned into text on the phone. Audio is
  never saved to a file and never sent anywhere. The words are handed from
  the app to the keyboard and then deleted.
- **Crash and hang reports** (see below).

History, learned words, recent emoji, voice transcripts, the hand-off queue
between the app and the keyboard, and crash reports are excluded from
iCloud and computer backups, so a backup never carries what you typed. The
cost: a new or restored phone starts with an empty dictionary and no
history. Your settings are part of your normal phone backup.

## Where the AI runs

- **On your phone.** By default Hushtype uses the AI built into iOS (Apple
  Intelligence, where available) or a Hushtype model you download into the
  app. Both run on the phone. Translation uses the translation built into
  iOS, which also runs on the phone once its language is downloaded.
- **Model and language downloads.** When you download a Hushtype model, the
  app fetches it from Hugging Face, a public model host. That download sends
  none of your text; like any website, the host sees your IP address while
  it serves the file. Language packs for translation and voice are
  downloaded by iOS from Apple.

## Full Access (iPhone)

iOS shows a warning for every third-party keyboard when you turn on "Allow
Full Access". Hushtype works without it: it types, suggests, corrects and
runs the AI built into iOS. Full Access lets the keyboard do these extra
things, and nothing else:

- **Talk to the Hushtype app**: save history, share learned words with the
  app, pass text to the app for voice typing and for "Finish in Hushtype"
  (running a downloaded model in the app).
- **Read what you copied**, only when you tap Reply or Translate, and write
  to the clipboard when you tap Copy. While the keyboard is open it can notice
  that something new was copied, without reading it, to offer a translation.
  You can turn that off in Settings.
- **Haptics**: iOS blocks vibration for keyboards without Full Access.
- **Reach your own AI**, only if you connected one (next section).

Without your own AI connected, the keyboard makes no network connection,
with or without Full Access. Password fields and other secure fields never
run AI.

## Your own AI key (optional)

If you are a Pro user, you can connect your own account at OpenAI,
Anthropic (Claude) or Google (Gemini) by pasting an API key. Only then, and
only when "Offline only" is off and the keyboard has Full Access:

- **What is sent:** the text the action runs on (your selection, or the
  text around the cursor that the action needs), the instructions for that
  action (for example "make this shorter" or the target language) and your
  key.
- **Where it goes:** straight from your phone to the company you chose. It
  does not pass through us. That company's own privacy policy and terms
  apply to it.
- **How you know:** every result that came from your AI carries a cloud
  mark, and the app says "Text leaves your phone" wherever that is true.
  The Privacy screen counts what was sent.
- **Checking a key** sends only the key, to confirm it works.
- **Your key** is stored in the iOS Keychain on this phone only. It is not
  synced to iCloud Keychain and does not move to another phone.

Turn on "Offline only" and nothing leaves your phone, even with a key
saved.

## Crash reports

Hushtype has no crash-reporting service. iOS gives the app its own crash
and hang reports, and they stay on the phone, under Diagnostics on
the Privacy screen in the Hushtype app. If something breaks, you can choose to share a report with us
through the share sheet; nothing is sent unless you do. Separately, if you
turned on "Share With App Developers" in iOS Settings › Privacy & Security
› Analytics & Improvements, Apple may share crash data with us under
Apple's own policy. You can turn that off at any time.

## Purchases

Hushtype Pro is bought through the App Store.
The store handles payment. We use RevenueCat, a subscription service, to
check purchases and keep track of who has Pro. When you open the paywall,
buy, restore or open the app, the app talks to RevenueCat and sends:

- **the store's purchase record** (the App Store receipt or transaction:
  which plan, when it started, when it renews or ends, whether it was a
  trial or refunded);
- **a random id** that RevenueCat makes for this install. It is not your
  name, email or Apple ID, and it is not used to track you;
- **basic device facts**: the device model, iOS version, app version,
  language and region, store country, and the per-app device id iOS gives
  every app from the same developer (identifierForVendor).

What you type, your history and your voice are never part of it. RevenueCat
processes this on our behalf to tell the app whether you have Pro; it is
not used for ads or tracking. RevenueCat's privacy policy:
https://www.revenuecat.com/privacy. We never see your name, email, card or
Apple ID.

## Children

Hushtype is not directed at children. It collects no data from anyone
beyond the purchase record described above.

## Changes

If this policy changes, the new version is posted here with a new
effective date. Apart from the purchase records RevenueCat keeps, we hold no
data about you, so a change can never apply to anything else.

## Contact

Questions: emrozeae@gmail.com.
