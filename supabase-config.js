/* BAHR — supabase-config.js : إعداد الاتصال بـ Supabase (الرابط والمفتاح العام anon فقط).
   لا تضع مفتاح service_role هنا أبدًا. يجب تحميله قبل app.js. */
window.BAHR_CONFIG = Object.freeze({
  supabaseUrl: "https://pezzhqdhyfdexaxrwdpx.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlenpocWRoeWZkZXhheHJ3ZHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MjI2NzAsImV4cCI6MjEwODA5ODY3MH0.kMTYcp-Nk2xLWiFZnXpIiSt2ijZ4bXksCCQPKemv2fU",
  /* B45 Web Push: المفتاح العام VAPID فقط (لا مفتاح خاص هنا). اتركهما فارغين/false حتى تنشر دالة Netlify وتختبرها. */
  vapidPublicKey: "",
  pushEnabled: false
});
