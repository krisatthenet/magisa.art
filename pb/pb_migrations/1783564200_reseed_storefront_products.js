migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('products');
  const products = [
    [1, 'FREYA - Necklace With Spikes', 40, 'Necklaces'],
    [2, 'ATHENA - Chainmail ring', 20, 'Rings'],
    [3, 'OYA - Choker - O Ring Necklace', 30, 'Necklaces'],
    [4, 'RHEA - Double-Layered Necklace', 35, 'Necklaces'],
    [5, 'ISHTAR - Multipurpose Massive Necklace', 45, 'Necklaces'],
    [6, 'JUNDA - Earrings', 15, 'Earrings'],
    [7, 'BELLONA - Earrings', 20, 'Earrings'],
    [8, 'KALI - Earrings', 15, 'Earrings'],
    [9, 'LAST PRAYER - Earrings', 15, 'Earrings'],
    [10, 'OYA - Chainmail Earrings', 25, 'Earrings'],
    [11, 'ODIN - Necklace With A Chainmail Pendant', 35, 'Necklaces'],
    [12, 'ATHENA - Necklace', 35, 'Necklaces'],
    [13, 'BELLONA - O Ring Necklace - Choker', 45, 'Necklaces'],
    [14, 'LAST PRAYER - Double Ring With A Chain and A Cross', 15, 'Rings'],
    [15, 'RHEA - Adjustable Double Ring With A Chain And A Dagger', 15, 'Rings'],
    [16, 'ODIN - Chainmail Ring', 25, 'Rings'],
    [17, 'OYA - Chainmail ring', 15, 'Rings'],
    [18, 'FREYA - Ring With A Spike', 10, 'Rings'],
    [19, 'BELLONA - Chainmail Ring With A Blood Drop', 15, 'Rings'],
  ];

  products.forEach(([id, name, price, category]) => {
    const sku = `MAG-${String(id).padStart(3, '0')}`;
    try {
      dao.findFirstRecordByData('products', 'sku', sku);
      return;
    } catch (_error) {
      // The record does not exist yet.
    }
    const record = new Record(collection);
    record.set('sku', sku);
    record.set('name', name);
    record.set('price', price);
    record.set('category', category);
    record.set('active', true);
    dao.saveRecord(record);
  });
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('products');
  for (let id = 1; id <= 19; id += 1) {
    try {
      const record = dao.findFirstRecordByData('products', 'sku', `MAG-${String(id).padStart(3, '0')}`);
      dao.deleteRecord(record);
    } catch (_error) {
      // The record is already absent.
    }
  }
});
