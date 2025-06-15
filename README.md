# kn-goodcar-iframe

**ระบบแสดงรถมือสองเชียงใหม่ สำหรับฝังบน GoDaddy หรือเว็บอื่น ๆ ผ่าน iframe**

## วิธีใช้

1. อัปโหลดไฟล์ทั้งหมด (`iframe-kn-goodcar.html`, `style.css`, `script.js`) ขึ้น GitHub repo
2. ตั้งค่า GitHub Pages ให้ใช้ branch `main` หรือ `master` แล้วเลือก `/ (root)`
3. ใช้ URL ของไฟล์นี้ใน GoDaddy เช่น
   ```
   <iframe src="https://USERNAME.github.io/kn-goodcar-iframe/iframe-kn-goodcar.html" style="width:100%;min-height:1800px;border:none;"></iframe>
   ```
4. ระบบแคตตาล็อกรถจะแสดงฟีเจอร์ครบ
   - ค้นหารถ
   - ปุ่มเลื่อนหน้า (pagination)
   - นับยอดวิว Firebase
   - SEO meta tag, og, canonical
   - Responsive ครบทุกจอ