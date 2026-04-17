const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

const products = [
  { name: 'Samsung Galaxy S23 Ultra', description: 'Flagship smartphone with 200MP camera, S Pen and Snapdragon 8 Gen 2.', price: 89999, originalPrice: 124999, category: 'Electronics', brand: 'Samsung', images: ['https://images.samsung.com/is/image/samsung/p6pim/in/sm-s918bzkcins/gallery/in-galaxy-s23-ultra-sm-s918-sm-s918bzkcins-534851252.jpg'], stock: 50, ratings: 4.5, numReviews: 120, seller: 'Samsung India', isFeatured: true, highlights: ['200MP Main Camera','Snapdragon 8 Gen 2','5000mAh Battery','S Pen Included'], discount: 28 },
  { name: 'Apple iPhone 15 Pro', description: 'Latest iPhone with A17 Pro chip, titanium design and ProCamera system.', price: 134900, originalPrice: 149900, category: 'Electronics', brand: 'Apple', images: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium.jpg'], stock: 30, ratings: 4.8, numReviews: 200, seller: 'Apple India', isFeatured: true, discount: 10 },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling wireless headphones with 30hr battery.', price: 26990, originalPrice: 34990, category: 'Electronics', brand: 'Sony', images: ['https://www.sony.co.in/image/5d02da5df552836db894cead8a68f764?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'], stock: 100, ratings: 4.6, numReviews: 85, seller: 'Sony India', isFeatured: true, discount: 23 },
  { name: "Men's Classic Polo T-Shirt", description: 'Premium cotton polo t-shirt, perfect for casual and semi-formal wear.', price: 699, originalPrice: 1499, category: 'Fashion', brand: 'Arrow', images: ['https://via.placeholder.com/300x300?text=Polo+Shirt'], stock: 200, ratings: 4.2, numReviews: 340, seller: 'Arrow Fashions', isFeatured: false, discount: 53 },
  { name: 'Nike Air Max 270', description: 'Iconic air cushioning meets modern design for all-day comfort.', price: 8495, originalPrice: 11995, category: 'Fashion', brand: 'Nike', images: ['https://via.placeholder.com/300x300?text=Nike+AirMax'], stock: 75, ratings: 4.4, numReviews: 178, seller: 'Nike India', isFeatured: true, discount: 29 },
  { name: 'LG 1.5 Ton 5 Star AC', description: 'Energy efficient split AC with dual inverter technology and wifi control.', price: 32990, originalPrice: 45000, category: 'Appliances', brand: 'LG', images: ['https://via.placeholder.com/300x300?text=LG+AC'], stock: 20, ratings: 4.3, numReviews: 67, seller: 'LG Electronics', isFeatured: true, discount: 27 },
  { name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker, slow cooker, rice cooker, yogurt maker and more.', price: 7499, originalPrice: 9999, category: 'Home & Furniture', brand: 'Instant Pot', images: ['https://via.placeholder.com/300x300?text=Instant+Pot'], stock: 45, ratings: 4.7, numReviews: 233, seller: 'Kitchen World', isFeatured: false, discount: 25 },
  { name: 'LEGO City Police Station', description: 'Build the ultimate police headquarters with this 743-piece LEGO set.', price: 4999, originalPrice: 6499, category: 'Toys', brand: 'LEGO', images: ['https://via.placeholder.com/300x300?text=LEGO+Police'], stock: 60, ratings: 4.8, numReviews: 112, seller: 'Toy Galaxy', isFeatured: false, discount: 23 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('✅ Sample products seeded!');
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
