const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  { name: 'Samsung Galaxy S23 Ultra', description: 'Latest Samsung flagship with 200MP camera, S Pen support, and Snapdragon 8 Gen 2 processor. 6.8" Dynamic AMOLED 2X display.', price: 74999, originalPrice: 124999, category: 'Electronics', brand: 'Samsung', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/d/l/z/-original-imaghx9qkugk8sft.jpeg'], stock: 50, ratings: 4.6, numReviews: 1280, isFeatured: true, highlights: ['200MP Camera','5000mAh Battery','S Pen Included','12GB RAM'], seller: 'Samsung India' },
  { name: 'Apple iPhone 15 Pro', description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, 48MP main camera with 5x optical zoom.', price: 119900, originalPrice: 134900, category: 'Electronics', brand: 'Apple', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/p/l/p/-original-imagthgfzgez7lra.jpeg'], stock: 30, ratings: 4.8, numReviews: 2100, isFeatured: true, highlights: ['A17 Pro Chip','Titanium Build','USB-C port','ProMotion 120Hz'], seller: 'Apple India' },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with 30-hour battery, crystal clear calls, and exceptional sound quality.', price: 24990, originalPrice: 34990, category: 'Electronics', brand: 'Sony', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/t/c/e/-original-imagnez3hmuehwfc.jpeg'], stock: 75, ratings: 4.7, numReviews: 890, isFeatured: true, highlights: ['30hr Battery','ANC','LDAC Support','Multipoint Connection'], seller: 'Sony India' },
  { name: 'Nike Air Max 270', description: 'Nike Air Max 270 lifestyle shoes with the tallest Air unit yet for all-day comfort.', price: 8995, originalPrice: 12995, category: 'Fashion', brand: 'Nike', images: ['https://rukminim2.flixcart.com/image/312/312/kzgwqy80/shoe/c/d/h/7-ah8050-102-nike-7-original-imagbc5fyjdnghfh.jpeg'], stock: 100, ratings: 4.4, numReviews: 540, isFeatured: true, highlights: ['Air cushioning','Mesh upper','Rubber outsole'], seller: 'Nike Authorized Seller' },
  { name: 'LG 55" 4K OLED TV', description: 'LG C3 OLED evo TV with α9 AI Processor Gen6, Dolby Vision IQ, and NVIDIA G-Sync compatible.', price: 89990, originalPrice: 149990, category: 'Electronics', brand: 'LG', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/television/d/c/b/-original-imagnk5ghxf3gzxg.jpeg'], stock: 20, ratings: 4.9, numReviews: 320, highlights: ['4K OLED','Dolby Vision','120Hz','WebOS'], seller: 'LG India' },
  { name: 'Instant Pot Duo 7-in-1', description: '7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer & yogurt maker.', price: 7999, originalPrice: 12999, category: 'Appliances', brand: 'Instant Pot', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/electric-cooker/m/3/7/-original-imaggfgy5qqrj7q9.jpeg'], stock: 60, ratings: 4.5, numReviews: 2300, isFeatured: true, highlights: ['7-in-1 Functions','6 Litre','Safety Lid Lock','14 Smart Programs'], seller: 'Kitchen Essentials' },
  { name: 'Levi\'s 511 Slim Fit Jeans', description: 'Classic Levi\'s 511 slim fit jeans in stretch denim for all-day comfort and style.', price: 2499, originalPrice: 4599, category: 'Fashion', brand: 'Levis', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/jean/q/q/9/-original-imagmxsfvjxygxgf.jpeg'], stock: 200, ratings: 4.3, numReviews: 1500, highlights: ['Slim Fit','Stretch Denim','5 Pocket Style'], seller: 'Levi Strauss India' },
  { name: 'Dyson V15 Detect Vacuum', description: 'Laser detects microscopic dust. Automatically adapts suction. Scientific proof of a deep clean with piezo sensor.', price: 52900, originalPrice: 65900, category: 'Appliances', brand: 'Dyson', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/vacuum-cleaner/j/3/e/-original-imagpghd7zhkpwff.jpeg'], stock: 15, ratings: 4.8, numReviews: 450, highlights: ['Laser Detection','60min Run Time','HEPA Filter','LCD Display'], seller: 'Dyson India' },
  { name: 'Atomic Habits - James Clear', description: 'Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits & Break Bad Ones.', price: 299, originalPrice: 499, category: 'Books', brand: 'Penguin', images: ['https://rukminim2.flixcart.com/image/312/312/jzgchs80/book/7/3/9/atomic-habits-original-imafa5m6kghjxqdz.jpeg'], stock: 500, ratings: 4.7, numReviews: 12000, isFeatured: true, highlights: ['International Bestseller','Practical Framework','Real-life examples'], seller: 'Penguin India' },
  { name: 'boAt Rockerz 550 Bluetooth Headphones', description: 'boAt Rockerz 550 with 20-hour playback, 50mm drivers, and ultra-deep bass experience.', price: 1499, originalPrice: 3990, category: 'Electronics', brand: 'boAt', images: ['https://rukminim2.flixcart.com/image/312/312/kzfh0280/headphone/t/u/i/rockerz-550-boat-original-imagbf9tqzhwf6q8.jpeg'], stock: 150, ratings: 4.2, numReviews: 4500, isFeatured: true, highlights: ['20hr Playback','50mm Drivers','Foldable Design','Padded Ear Cushions'], seller: 'boAt Official Store' },
  { name: 'Philips Air Fryer HD9252', description: 'Fry, Bake, Grill & Roast with little or no oil. 1400W for faster results. 4.1L capacity.', price: 8999, originalPrice: 14995, category: 'Appliances', brand: 'Philips', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/air-fryer/y/d/r/-original-imagzchcjzthg4tf.jpeg'], stock: 40, ratings: 4.4, numReviews: 3200, highlights: ['4.1L Capacity','1400W','Rapid Air Tech','Up to 75% less fat'], seller: 'Philips India' },
  { name: 'IKEA KALLAX Shelf Unit', description: 'KALLAX shelf unit is perfect for storing and displaying. Can also be used as a room divider.', price: 5999, originalPrice: 7999, category: 'Home & Furniture', brand: 'IKEA', images: ['https://rukminim2.flixcart.com/image/312/312/xif0q/shelf-unit/c/g/f/-original-imagzjk9zhq4k4yz.jpeg'], stock: 25, ratings: 4.5, numReviews: 680, highlights: ['Versatile storage','Easy assembly','Multiple color options'], seller: 'IKEA India' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Old products deleted');

    await Product.insertMany(products);
    console.log(`${products.length} products seeded!`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@flipkart.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin User', email: 'admin@flipkart.com', password: 'admin123', role: 'admin' });
      console.log('Admin user created: admin@flipkart.com / admin123');
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
