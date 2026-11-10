---
name: Hushtype
tagline: Write it right. Offline.
summary: A keyboard for iPhone with one extra key. Tap ✨ to fix, rewrite, translate or reply with AI that runs on your phone. No account, no daily limit.
icon: ./icon.png
screenshots:
  - ./screenshots/01-main.webp
  - ./screenshots/02-preview.webp
  - ./screenshots/03-action-menu.webp
  - ./screenshots/05-airplane.webp
  - ./screenshots/06-translate.webp
  - ./screenshots/10-dark.webp
accent: '#0F766E'
category: Productivity
status: coming-soon
order: 1
packageName: com.projectlambda.hushtype
# A direct Android download ahead of Google Play: the release APK signed with
# the upload key, arm64 only (every phone Hushtype Small runs on, and under
# GitHub's 100 MB file limit). In the Hushtype repo, from android/:
# ./gradlew assembleRelease -PhtAbiFilter=arm64-v8a, then
# replace the file in public/downloads.
android:
  file: downloads/Hushtype-0.9.1.apk
  version: 0.9.1
  minimumOS: '10'
features:
  - title: One key to fix it
    text: Type the way you always do and tap ✨. You see every change marked before you choose Replace or Insert below, and Undo stays one tap away for 10 seconds.
  - title: AI that runs on your phone
    text: Apple's on-device model where it is available, or a model you download once. After that it works in airplane mode.
  - title: Translate what you copied
    text: Copy a message in another language and turn it into English with one tap.
  - title: Talk instead of type
    text: Voice runs on your iPhone too, and your audio is never saved or sent.
  - title: It learns how you write
    text: Your words, Banglish included, are learned the first time you use them, offered first, and kept on your phone.
  - title: Your own AI, if you want it
    text: Connect your own key with Pro. Text then goes straight to that provider, and every result from it carries a cloud mark.
faq:
  - q: How do I turn on the keyboard?
    a: Open Settings, then General, Keyboard, Keyboards, Add New Keyboard, and pick Hushtype. In any text field, hold the globe key and choose Hushtype. Opening the Hushtype app walks you through the same steps.
  - q: Do I need to allow Full Access?
    a: No. Without it you can type, autocorrect, translate and run ✨ with Apple's on-device model. Turn it on only for Reply, translating what you copied, your own AI key, Hushtype Small, the Offline pack, voice, history and key haptics. The keyboard makes no network calls unless you connect your own AI, and then every result is marked.
  - q: Why does ✨ send me to the Hushtype app?
    a: On iPhones without Apple Intelligence, rewrites run in the Hushtype app, because a keyboard has too little memory for a language model. Download Hushtype Small once in Settings, then Engine, in the Hushtype app. After that it works offline.
  - q: How do I restore a purchase?
    a: Open Hushtype, then Settings, then Restore purchases. You are not charged again. Your purchase is tied to your Apple Account, so there is no Hushtype account to sign in to.
  - q: How do I cancel a subscription or ask for a refund?
    a: Open the iPhone's Settings, tap your name, then Subscriptions, then Hushtype Pro. Cancel at least 24 hours before the current period ends. Apple handles refunds at reportaproblem.apple.com.
  - q: How do I erase what Hushtype keeps?
    a: History and learned words stay on your iPhone. You can erase them on the Privacy screen in the Hushtype app, and deleting the app removes them too.
---

Hushtype is a keyboard for iPhone with one extra key. Type a message the way you always do, tap ✨, and Hushtype fixes it. It can also make your text shorter or longer, change its tone, translate it, or draft a reply to a message you copied.

The AI runs on your iPhone. There is no account, no sign-in and no tracking. What you type stays on your iPhone unless you connect your own AI key, and every result from that key is marked.
