# The Curious Forge 🔬

แพลตฟอร์มการเรียนรู้วิทยาศาสตร์ผ่านการทดลอง สร้างด้วย Nuxt 3 + TailwindCSS

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# รันเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev

# build สำหรับ production
npm run build
```

## คุณสมบัติ

- คลังพิมพ์เขียวการทดลอง
- คำแนะนำทีละขั้นตอน 
- บันทึกการทดลองที่ชอบ
- ส่งไอเดียการทดลองใหม่
- ธีมสีมืด (Dark Theme)
- รองรับการแสดงผลบนมือถือ

## เทคโนโลยีที่ใช้

- Nuxt 3
- TypeScript
- TailwindCSS 
- Vue Composition API

## โครงสร้างโปรเจกต์

```
pages/
 ├─ index.vue             → หน้า Home
 ├─ library.vue           → คลังพิมพ์เขียว
 ├─ blueprints/[id].vue   → รายละเอียดโปรเจกต์
 ├─ submit.vue            → แบบฟอร์มส่งไอเดีย
 ├─ profile.vue           → โปรไฟล์
 ├─ contact.vue           → ติดต่อเรา
 └─ about.vue             → เกี่ยวกับเรา

components/
 ├─ BlueprintCard.vue     → การ์ดโปรเจกต์
 ├─ StatCard.vue          → การ์ดสถิติ
 └─ AppFooter.vue         → ส่วนท้ายเว็บ

assets/
 ├─ css/tailwind.css      → สไตล์หลัก
 └─ data/blueprints.json  → ข้อมูลตัวอย่าง
```