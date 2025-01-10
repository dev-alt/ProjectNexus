db = db.getSiblingDB('admin');

db.createUser({
    user: "root",
    pwd: "mongodbpass",
    roles: [
        { role: "root", db: "admin" },
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" }
    ]
});

db = db.getSiblingDB('projectnexus');

db.createUser({
    user: "root",
    pwd: "mongodbpass",
    roles: [
        { role: "readWrite", db: "projectnexus" },
        { role: "dbAdmin", db: "projectnexus" }
    ]
});