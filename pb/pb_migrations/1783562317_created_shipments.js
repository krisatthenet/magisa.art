/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w1tysywqi9iy1mp",
    "created": "2026-07-09 01:58:36.220Z",
    "updated": "2026-07-09 01:58:36.220Z",
    "name": "shipments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "agfin4ww",
        "name": "orderRef",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "drzb5g5t",
        "name": "customerName",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "3keiu7t0",
        "name": "address",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "yo3h2mxm",
        "name": "carrier",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "DHL",
            "UPS",
            "FedEx",
            "Lithuania Post",
            "Omniva"
          ]
        }
      },
      {
        "system": false,
        "id": "qlxzoxmo",
        "name": "trackingNumber",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "luymxyjz",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "created",
            "label_generated",
            "in_transit",
            "delivered"
          ]
        }
      },
      {
        "system": false,
        "id": "dlqaqbnl",
        "name": "label",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "application/pdf"
          ],
          "thumbs": null,
          "maxSelect": 1,
          "maxSize": 5000000,
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("w1tysywqi9iy1mp");

  return dao.deleteCollection(collection);
})
