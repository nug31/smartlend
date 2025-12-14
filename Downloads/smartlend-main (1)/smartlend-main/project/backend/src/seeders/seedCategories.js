import sequelize from '../config/database.js';
import Category from '../models/Category.js';

const seedCategories = async () => {
  try {
    console.log('🌱 Mulai seeding categories...');

    // Check if categories already exist
    const existingCategories = await Category.count();
    if (existingCategories > 0) {
      console.log('✅ Categories sudah ada, skip seeding');
      return;
    }

    // Buat sample categories
    const categories = await Category.bulkCreate([
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
    ]);

    console.log('✅ Categories berhasil dibuat:', categories.length);

  } catch (error) {
    console.error('❌ Error saat seeding categories:', error);
  } finally {
    await sequelize.close();
  }
};

seedCategories();
