db = db.getSiblingDB('admin');

// Create admin user
db.createUser({
    user: process.env.MONGO_ADMIN_USER,
    pwd: process.env.MONGO_ADMIN_PASSWORD,
    roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
});

db = db.getSiblingDB('projectnexus');

// Create application user with limited privileges
db.createUser({
    user: process.env.MONGO_APP_USER,
    pwd: process.env.MONGO_APP_PASSWORD,
    roles: [{ role: "readWrite", db: "projectnexus" }]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "created_by": 1 });
db.documents.createIndex({ "project_id": 1 });
