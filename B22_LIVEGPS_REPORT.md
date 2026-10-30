# تقرير B22 Live GPS

## كُتب
- b22_livegps.sql: الجداول والدوال والسياسات + pg_cron (b22_trip_cleanup كل 5 دقايق). نُفّذ في Supabase، والجداول موجودة.
- b22-livegps.js: واجهة كاملة (قائمة، إنشاء، دعوة، قبول، مشاركة، مغادرة، إنهاء، بطاقات مرتبة بالأقرب مع المسافة والاتجاه، رابط Google Maps).
- b22-livegps.css، b22_livegps_INSERTS.md، هذا التقرير.

## عُدّل بهذه الجلسة
- حُذفت Leaflet/OpenStreetMap وRealtime من الـ JS لأنها تخالف قواعد المهمة. الآن استعلام كل 15 ثانية.

## لم يُختبر فعلياً
- الاختبارات SQL فشلت بخطأ 22P02 (مصفوفة نصوص). التصحيح: `out text := ''` بدل `text[]`، وتغيير سطر `raise exception` الأخير. لم تُعاد بعد.
- الواجهة لم تُجرَّب على جهاز، ولا مع مستخدمين حقيقيين.
- لم أرَ b22_livegps.sql، فلم أتحقق أن الدوال b22_trip_people وb22_find_user وb22_trip_remove وb22_my_trips موجودة وأسماء بارامتراتها (p_trip, p_user, p_q, p_title, p_hours, p_group, p_max, p_accept, p_lat, p_lng, p_acc) مطابقة.
- الإرسال يتوقف عند قفل الشاشة (قيد المتصفحات).
