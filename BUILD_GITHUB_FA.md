# ساخت APK هوندا با GitHub Actions

این پروژه بر پایه Expo SDK 57 است و Workflow آن در مسیر `.github/workflows/build-apk.yml` قرار دارد.

GitHub Actions ابتدا وابستگی‌ها را نصب می‌کند، پروژه Native Android را با `expo prebuild` می‌سازد و سپس APK قابل نصب را با Gradle تولید می‌کند.

نام خروجی:
`HONDA-Phone1-debug.apk`

این APK برای نصب مستقیم روی گوشی و تست کامل برنامه مناسب است. برای انتشار Google Play باید بعداً کلید امضای Release مستقل و دائمی تعریف شود.

ارتباط محلی با ESP8266 از HTTP استفاده می‌کند، بنابراین `usesCleartextTraffic` در تنظیمات Android فعال شده است.
