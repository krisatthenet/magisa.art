migrate((db) => {
  const dao = new Dao(db);
  const collection = new Collection({
    name: 'products',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    schema: [
      { name: 'sku', type: 'text', required: true, options: { min: null, max: 50, pattern: '' } },
      { name: 'name', type: 'text', required: true, options: { min: null, max: 255, pattern: '' } },
      { name: 'price', type: 'number', required: true, options: { min: 0, max: null, noDecimal: false } },
      { name: 'description', type: 'text', required: false, options: { min: null, max: 2000, pattern: '' } },
      { name: 'category', type: 'text', required: false, options: { min: null, max: 100, pattern: '' } },
      { name: 'image', type: 'text', required: false, options: { min: null, max: 500, pattern: '' } },
      { name: 'active', type: 'bool', required: false, options: {} },
    ],
  });
  dao.saveCollection(collection);

  const products = [
    [1, 'FREYA - Necklace With Spikes', 40, 'FREYA, the Norse goddess of love, beauty, and fierce independence, embodies the warrior spirit within.', 'Necklaces', '/products/freya-necklace-with-spikes.jpg'],
    [2, 'ATHENA - Chainmail ring', 20, 'Inspired by the goddess of wisdom and warfare, ATHENA is your most stylish armour.', 'Rings', '/products/simple-chainmail-ring.jpg'],
    [3, 'OYA - Choker - O Ring Necklace', 30, 'Inspired by OYA, the goddess of storms, death, and rebirth, this is your most powerful adornment.', 'Necklaces', '/products/necklace-6.jpg'],
    [4, 'RHEA - Double-Layered Necklace', 35, 'RHEA embodies strength and transformation.', 'Necklaces', '/products/necklace-5.jpg'],
    [5, 'ISHTAR - Multipurpose Massive Necklace', 45, 'Handcrafted ring by ring, this bold O-ring choker embodies the spirit of the Rebirth collection.', 'Necklaces', '/products/necklace-4.jpg'],
    [6, 'JUNDA - Earrings', 15, 'JUNDA earrings channel the fierce spirit of the Lithuanian goddess of war.', 'Earrings', '/products/earrings-5.jpg'],
    [7, 'BELLONA - Earrings', 20, 'BELLONA earrings stand as your ultimate statement of power.', 'Earrings', '/products/earrings-4.jpg'],
    [8, 'KALI - Earrings', 15, 'KALI earrings draw inspiration from the fierce goddess of transformation and liberation.', 'Earrings', '/products/earrings-3.jpg'],
    [9, 'LAST PRAYER - Earrings', 15, 'LAST PRAYER earrings are your armor against the world.', 'Earrings', '/products/earrings-2.jpg'],
    [10, 'OYA - Chainmail Earrings', 25, 'Inspired by OYA, these are your most powerful adornments.', 'Earrings', '/products/earrings-1.jpg'],
    [11, 'ODIN - Necklace With A Chainmail Pendant', 35, 'Inspired by the god of wisdom and warfare, ODIN is your most stylish armour.', 'Necklaces', '/products/necklace-3.jpg'],
    [12, 'ATHENA - Necklace', 35, 'Inspired by the goddess of wisdom and warfare, ATHENA is your most stylish armour.', 'Necklaces', '/products/necklace-2.jpg'],
    [13, 'BELLONA - O Ring Necklace - Choker', 45, 'BELLONA stands as your ultimate statement of power.', 'Necklaces', '/products/necklace-1.jpg'],
    [14, 'LAST PRAYER - Double Ring With A Chain and A Cross', 15, 'LAST PRAYER double ring is your armor against the world.', 'Rings', '/products/ring-6.jpg'],
    [15, 'RHEA - Adjustable Double Ring With A Chain And A Dagger', 15, 'RHEA is your most powerful armour.', 'Rings', '/products/ring-5.jpg'],
    [16, 'ODIN - Chainmail Ring', 25, 'Inspired by the god of wisdom and warfare, ODIN is your most stylish armour.', 'Rings', '/products/ring-4.jpg'],
    [17, 'OYA - Chainmail ring', 15, 'Inspired by OYA, this is your most powerful adornment.', 'Rings', '/products/ring-3.jpg'],
    [18, 'FREYA - Ring With A Spike', 10, 'FREYA embodies the warrior spirit within.', 'Rings', '/products/ring-2.jpg'],
    [19, 'BELLONA - Chainmail Ring With A Blood Drop', 15, 'BELLONA stands as your ultimate statement of power.', 'Rings', '/products/ring-1.jpg'],
  ];

  products.forEach(([id, name, price, description, category, image]) => {
    const record = new Record(collection);
    record.set('sku', `MAG-${String(id).padStart(3, '0')}`);
    record.set('name', name);
    record.set('price', price);
    record.set('description', description);
    record.set('category', category);
    record.set('image', image);
    record.set('active', true);
    dao.saveRecord(record);
  });
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('products');
  dao.deleteCollection(collection);
});
