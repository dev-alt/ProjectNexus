db = db.getSiblingDB('admin');

db.createUser({
    user: "root",
    pwd: "mongodbpass",
    roles: [
        { role: "root", db: "admin" }
    ]
});

db = db.getSiblingDB('projectnexus');

db.createUser(
    {
        user: "root",
        pwd: "mongodbpass",
        roles: [
            { role: "readWrite", db: "projectnexus" },
            { role: "dbAdmin", db: "projectnexus" }
        ]
    }
);