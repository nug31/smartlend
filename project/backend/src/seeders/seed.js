import sequelize from '../config/database.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Loan from '../models/Loan.js';
import Category from '../models/Category.js';

const seedData = async () => {
  try {
    console.log('🌱 Mulai seeding data...');

    // Buat admin user (skip jika sudah ada)
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@loan.com' },
      defaults: {
        email: 'admin@loan.com',
        firstName: 'Admin',
        lastName: 'System',
        password: 'admin123',
        role: 'admin',
        department: 'IT',
        phoneNumber: '081234567890'
      }
    });

    // Buat user biasa (skip jika sudah ada)
    const [regularUser, userCreated] = await User.findOrCreate({
      where: { email: 'user@loan.com' },
      defaults: {
        email: 'user@loan.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'user123',
        role: 'user',
        department: 'Marketing',
        phoneNumber: '081234567891'
      }
    });

    if (adminCreated) {
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    if (userCreated) {
      console.log('✅ Regular user created');
    } else {
      console.log('ℹ️ Regular user already exists');
    }

    // Buat sample categories (skip jika sudah ada)
    const categoryData = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        icon: 'Laptop',
        color: '#3b82f6',
        itemCount: 0
      },
      {
        name: 'Tools',
        description: 'Hand tools and equipment',
        icon: 'Wrench',
        color: '#10b981',
        itemCount: 0
      },
      {
        name: 'Books',
        description: 'Books and publications',
        icon: 'Book',
        color: '#f59e0b',
        itemCount: 0
      },
      {
        name: 'Furniture',
        description: 'Office and home furniture',
        icon: 'Home',
        color: '#8b5cf6',
        itemCount: 0
      },
      {
        name: 'Sports',
        description: 'Sports equipment and gear',
        icon: 'Trophy',
        color: '#ef4444',
        itemCount: 0
      },
      {
        name: 'Photography',
        description: 'Camera and photography equipment',
        icon: 'Camera',
        color: '#ec4899',
        itemCount: 0
      },
      {
        name: 'Audio',
        description: 'Audio equipment and accessories',
        icon: 'Volume2',
        color: '#06b6d4',
        itemCount: 0
      }
    ];

    // Create categories one by one to handle duplicates
    const categories = [];
    for (const catData of categoryData) {
      try {
        const [category, created] = await Category.findOrCreate({
          where: { name: catData.name },
          defaults: catData
        });
        categories.push(category);
        if (created) {
          console.log(`✅ Category '${catData.name}' created`);
        } else {
          console.log(`ℹ️ Category '${catData.name}' already exists`);
        }
      } catch (error) {
        console.log(`⚠️ Error creating category '${catData.name}':`, error.message);
      }
    }

    console.log('✅ Categories processed');

    // Buat sample items (skip jika sudah ada)
    const itemData = [
      {
        name: 'Laptop Dell XPS 13',
        description: 'Laptop untuk keperluan kerja dan presentasi',
        category: 'Electronics',
        tags: JSON.stringify(['laptop', 'computer', 'work']),
        condition: 'excellent',
        quantity: 5,
        availableQuantity: 5,
        qrCode: 'LAPTOP001',
        location: 'IT Storage Room A1',
        value: 15000000
      },
      {
        name: 'Proyektor Epson',
        description: 'Proyektor untuk presentasi dan meeting',
        category: 'Electronics',
        tags: JSON.stringify(['projector', 'presentation', 'meeting']),
        condition: 'good',
        quantity: 3,
        availableQuantity: 3,
        qrCode: 'PROJ001',
        location: 'Meeting Room Storage',
        value: 8000000
      },
      {
        name: 'Kamera Canon DSLR',
        description: 'Kamera untuk dokumentasi event dan kegiatan',
        category: 'Photography',
        tags: JSON.stringify(['camera', 'photography', 'event']),
        condition: 'excellent',
        quantity: 2,
        availableQuantity: 2,
        qrCode: 'CAM001',
        location: 'Media Storage B2',
        value: 12000000
      },
      {
        name: 'Microphone Wireless',
        description: 'Microphone untuk acara dan presentasi',
        category: 'Audio',
        tags: JSON.stringify(['microphone', 'audio', 'event']),
        condition: 'good',
        quantity: 4,
        availableQuantity: 4,
        qrCode: 'MIC001',
        location: 'Audio Equipment Room',
        value: 2000000
      },
      {
        name: 'Tablet iPad Pro',
        description: 'Tablet untuk presentasi mobile dan demo',
        category: 'Electronics',
        tags: JSON.stringify(['tablet', 'mobile', 'demo']),
        condition: 'excellent',
        quantity: 3,
        availableQuantity: 3,
        qrCode: 'TAB001',
        location: 'IT Storage Room A2',
        value: 18000000
      }
    ];

    // Create items one by one to handle duplicates
    const items = [];
    for (const itemInfo of itemData) {
      try {
        const [item, created] = await Item.findOrCreate({
          where: { qrCode: itemInfo.qrCode },
          defaults: itemInfo
        });
        items.push(item);
        if (created) {
          console.log(`✅ Item '${itemInfo.name}' created`);
        } else {
          console.log(`ℹ️ Item '${itemInfo.name}' already exists`);
        }
      } catch (error) {
        console.log(`⚠️ Error creating item '${itemInfo.name}':`, error.message);
      }
    }

    console.log('✅ Items processed');

    // Buat sample loan (peminjaman)
    const sampleLoan = await Loan.create({
      itemId: items[0].id, // Laptop Dell XPS 13
      userId: regularUser.id,
      quantity: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
      status: 'active',
      notes: 'Untuk keperluan presentasi client',
      approvedBy: adminUser.id,
      approvedAt: new Date(),
      requestedAt: new Date()
    });

    // Update available quantity
    await Item.update(
      { availableQuantity: 4 },
      { where: { id: items[0].id } }
    );

    console.log('✅ Sample loan berhasil dibuat');

    console.log('\n🎉 Seeding selesai!');
    console.log('\n📊 Data yang dibuat:');
    console.log(`👤 Admin: admin@loan.com / admin123`);
    console.log(`👤 User: user@loan.com / user123`);
    console.log(`📦 Items: ${items.length} items`);
    console.log(`📋 Loans: 1 active loan`);

  } catch (error) {
    console.error('❌ Error saat seeding:', error);
  } finally {
    await sequelize.close();
  }
};

// Jalankan seeder
seedData();
