﻿db = db.getSiblingDB('admin');

// Create an admin user (do this only once, and only if necessary)
// If you are always creating the root user on startup, you don't need this
db.createUser({
    user: "admin",
    pwd: "lXC2L98i91dlythSizdYiB0QNQl36E+uPqFN5QhdHzY=", // Set a strong password for the admin user
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" }
    ]
});

db = db.getSiblingDB('projectnexus');

// Create an application-specific user with limited privileges
db.createUser({
    user: "projectnexus_user",
    pwd: "lXC2L98i91dlythSizdYiB0QNQl36E+uPqFN5QhdHzY=", // *** Use the newly generated password here ***
    roles: [
        { role: "readWrite", db: "projectnexus" }
    ]
});