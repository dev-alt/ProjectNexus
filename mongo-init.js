db = db.getSiblingDB('admin');

// Create root user (if not exists)
db.createUser({
    user: "root",
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [ { role: "root", db: "admin" } ]
});

db = db.getSiblingDB('projectnexus');

// Create application database and user
db.createUser({
    user: "projectnexus",
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: "readWrite", db: "projectnexus" }]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "created_by": 1 });
db.documents.createIndex({ "project_id": 1 });