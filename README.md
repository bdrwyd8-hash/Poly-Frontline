# Polyfield Frontline

## تحميل ملف APK مباشرة من GitHub (الإصدارات / Releases)

عند رفع المشروع إلى GitHub (أو الدفع إلى فرع `main` / `master` أو نشر Tag مثل `v1.0.0`)، يقوم مسار GitHub Actions التلقائي (`.github/workflows/build-apk.yml`) ببناء تطبيق أندرويد وإرفاق ملف APK مباشر للتحميل:

1. **من قسم الإصدارات (Releases)** في الصفحة الرئيسية للمستودع على اليمين (`Releases -> Polyfield Frontline — Latest APK`) ستجد ملف **`Polyfield-Frontline.apk`** جاهزاً للتحميل والتثبيت مباشرة.
2. **من تبويب Actions** -> **`Build Android APK & Publish Release`** -> **`Artifacts`** يمكنك أيضاً تحميل **`Polyfield-Frontline-APK`**.

### بناء حزمة الأندرويد محلياً
```bash
npm install
npm run build:android
cd android && ./gradlew assembleDebug
```
سيتم توليد الملف في:
`android/app/build/outputs/apk/debug/app-debug.apk`
