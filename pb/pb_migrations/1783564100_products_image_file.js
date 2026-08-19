migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('products');
  collection.schema = new Schema([
    { name: 'sku', type: 'text', required: true, options: { min: null, max: 50, pattern: '' } },
    { name: 'name', type: 'text', required: true, options: { min: null, max: 255, pattern: '' } },
    { name: 'price', type: 'number', required: true, options: { min: 0, max: null, noDecimal: false } },
    { name: 'description', type: 'text', required: false, options: { min: null, max: 2000, pattern: '' } },
    { name: 'category', type: 'text', required: false, options: { min: null, max: 100, pattern: '' } },
    { name: 'image', type: 'file', required: false, options: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], thumbs: null, maxSelect: 1, maxSize: 5000000, protected: false } },
    { name: 'active', type: 'bool', required: false, options: {} },
  ]);
  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId('products');
  collection.schema = new Schema([
    { name: 'sku', type: 'text', required: true, options: { min: null, max: 50, pattern: '' } },
    { name: 'name', type: 'text', required: true, options: { min: null, max: 255, pattern: '' } },
    { name: 'price', type: 'number', required: true, options: { min: 0, max: null, noDecimal: false } },
    { name: 'description', type: 'text', required: false, options: { min: null, max: 2000, pattern: '' } },
    { name: 'category', type: 'text', required: false, options: { min: null, max: 100, pattern: '' } },
    { name: 'image', type: 'text', required: false, options: { min: null, max: 500, pattern: '' } },
    { name: 'active', type: 'bool', required: false, options: {} },
  ]);
  return dao.saveCollection(collection);
});
