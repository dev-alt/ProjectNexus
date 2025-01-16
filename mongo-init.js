db = db.getSiblingDB('admin');

db.auth('root', process.env.MONGO_INITDB_ROOT_PASSWORD);

db = db.getSiblingDB('projectnexus');

db.createUser({
    user: "projectnexus",
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [
        {
            role: "readWrite",
            db: "projectnexus"
        }
    ]
});

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "created_by": 1 });
db.documents.createIndex({ "project_id": 1 });