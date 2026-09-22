---
name: My App
tagline: A few words on what it does
summary: One or two sentences for the home page card and search results. Keep it under 170 characters.
icon: ./icon.png
accent: '#3B82F6'
category: Productivity
# live, coming-soon or retired
status: coming-soon
order: 10
packageName: com.example.myapp
stores:
  googlePlay: https://play.google.com/store/apps/details?id=com.example.myapp
  # appStore: https://apps.apple.com/app/id0000000000
screenshots:
  - ./screenshots/01.png
features:
  - title: First feature
    text: What it does for the user, in one sentence.
faq:
  - q: A question people ask?
    a: The answer.
# Only for apps with sign-in. Remove the whole block otherwise. Google Play
# needs the account deletion page this generates.
accounts:
  steps:
    - Open the app and go to Settings.
    - Tap Account, then Delete account.
    - Confirm. Your account is deleted straight away.
  deleted:
    - Your profile and sign-in details
    - Everything you created in the app
  retained:
    - Purchase records, which the law requires us to keep
  retention: Retained records are deleted after 7 years.
---

The long description. Write it as normal Markdown: paragraphs, **bold**,
lists and links all work.
