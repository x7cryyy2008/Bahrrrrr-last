# إدراج B22 Live GPS في index.html (مقطعان فقط)

## 1) داخل <head>، قبل </head>
```html
<link rel="stylesheet" href="b22-livegps.css">
```

## 2) قبل </body>، وبعد سطر `supabase-config.js` (مهم: الترتيب)
```html
<script src="b22-livegps.js" defer></script>
```

## الاستدعاء من المجموعات (اختياري)
```js
BAHR_LIVEGPS.openCreate({ groupId: 'UUID', title: 'اسم الطلعة' })
```

## ملاحظات
- لا يظهر زر «📍 الطلعات» إلا للمسجّل دخوله.
- متغيرات الألوان في أول ملف CSS: بدّل أسماءها (`--bg` `--card` `--text` `--muted` `--primary` `--border`) بأسماء style.css عندك.
- بعد الرفع على Netlify غيّر `?v=` لتفادي الكاش، أو افتح بتبويب خاص.
