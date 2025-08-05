import { PrismaClient, TicketStatus, Priority } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'ผู้ดูแลระบบ',
      role: 'ADMIN'
    }
  })

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@company.com' },
    update: {},
    create: {
      email: 'user@company.com',
      name: 'พนักงานทั่วไป',
      role: 'USER'
    }
  })

  // Create demo knowledge base articles
  const articles = [
    {
      title: 'วิธีการรีเซ็ตรหัสผ่าน',
      content: `# วิธีการรีเซ็ตรหัสผ่าน

## ขั้นตอนการรีเซ็ตรหัสผ่าน

1. เข้าไปที่หน้า Login
2. คลิกที่ "ลืมรหัสผ่าน"
3. กรอกอีเมลของคุณ
4. ตรวจสอบอีเมลและคลิกลิงก์รีเซ็ต
5. ตั้งรหัสผ่านใหม่

## หมายเหตุ
- รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร
- ควรประกอบด้วยตัวอักษรใหญ่ เล็ก ตัวเลข และอักขระพิเศษ`,
      category: 'Authentication',
      tags: 'password,reset,login',
      published: true,
      views: 156,
      authorId: adminUser.id
    },
    {
      title: 'การตั้งค่า VPN เพื่อเชื่อมต่อออฟฟิศ',
      content: `# การตั้งค่า VPN

## ขั้นตอนการติดตั้ง

### สำหรับ Windows:
1. ดาวน์โหลด VPN Client จาก IT
2. ติดตั้งโปรแกรม
3. กรอก Server และ Credentials
4. ทดสอบการเชื่อมต่อ

### สำหรับ Mac:
1. เปิด System Preferences
2. เลือก Network
3. เพิ่ม VPN Configuration
4. กรอกข้อมูลเซิร์ฟเวอร์

## การแก้ไขปัญหาที่พบบ่อย
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ตรวจสอบ Username/Password
- ติดต่อ IT หากยังไม่สามารถเชื่อมต่อได้`,
      category: 'Network',
      tags: 'vpn,network,connection',
      published: true,
      views: 89,
      authorId: adminUser.id
    },
    {
      title: 'วิธีการขอสิทธิ์เข้าถึงโฟลเดอร์ที่แชร์',
      content: `# การขอสิทธิ์เข้าถึงโฟลเดอร์แชร์

## ขั้นตอนการขอสิทธิ์

1. ระบุโฟลเดอร์ที่ต้องการเข้าถึง
2. ระบุประเภทสิทธิ์ที่ต้องการ (อ่าน/เขียน)
3. ระบุเหตุผลในการขอสิทธิ์
4. ส่งคำขอผ่านระบบ Ticket
5. รอการอนุมัติจากหัวหน้างาน

## ประเภทสิทธิ์
- **Read Only**: สามารถดูไฟล์ได้อย่างเดียว
- **Read/Write**: สามารถแก้ไขและสร้างไฟล์ได้
- **Full Control**: มีสิทธิ์เต็มในโฟลเดอร์`,
      category: 'File Access',
      tags: 'file,access,permission,folder',
      published: true,
      views: 203,
      authorId: adminUser.id
    }
  ]

  for (const article of articles) {
    await prisma.article.create({
      data: article
    })
  }

  // Create demo tickets
  const tickets = [
    {
      title: 'ไม่สามารถเข้าถึง Email ได้',
      description: `เมื่อเช้านี้ผมไม่สามารถเข้าถึง Email ได้ครับ

รายละเอียดปัญหา:
- เข้า Outlook แล้วขึ้น Error "Cannot connect to server"
- ลองใช้ Webmail ก็เข้าไม่ได้เหมือนกัน
- ลองกับเครื่องอื่นก็เป็นเช่นเดียวกัน

กรุณาช่วยตรวจสอบให้หน่อยครับ`,
      status: TicketStatus.OPEN,
      priority: Priority.HIGH,
      userId: regularUser.id
    },
    {
      title: 'ขอติดตั้งโปรแกรม Adobe Photoshop',
      description: `สวัสดีครับ ผมต้องการขอติดตั้งโปรแกรม Adobe Photoshop สำหรับงาน Design

รายละเอียด:
- ต้องการใช้สำหรับแก้ไขรูปภาพโครงการ
- เครื่องผม: Windows 11, RAM 16GB
- มี License ของบริษัทแล้ว

ขอบคุณครับ`,
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      userId: regularUser.id
    },
    {
      title: 'Printer ห้องประชุม A ไม่ทำงาน',
      description: `Printer ในห้องประชุม A ไม่สามารถใช้งานได้ครับ

อาการ:
- เปิดเครื่องแล้วไฟแดงกะพริบ
- ส่งงานพิมพ์แล้วไม่มีการตอบสนอง
- มี Paper Jam เมื่อวานแต่แก้ไขแล้ว

งานประชุมใหญ่พรุ่งนี้ครับ ช่วยแก้ไขด่วนได้ไหมครับ`,
      status: TicketStatus.RESOLVED,
      priority: Priority.URGENT,
      userId: regularUser.id
    }
  ]

  for (const ticket of tickets) {
    await prisma.ticket.create({
      data: ticket
    })
  }

  console.log('✅ Seed data created successfully!')
  console.log('Demo accounts:')
  console.log('- Admin: admin@company.com')
  console.log('- User: user@company.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
