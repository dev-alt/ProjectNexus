print('Start #################################################################');

db = db.getSiblingDB('admin');

db.createUser(
    {
        user: "root",
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: [ { role: "root", db: "admin" } ]
    }
);

db = db.getSiblingDB('projectnexus');

db.createUser(
    {
        user: "projectnexus",
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: [
            { role: "readWrite", db: "projectnexus" }
        ]
    }
);

db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "created_by": 1 });
db.documents.createIndex({ "project_id": 1 });

print('END #################################################################');