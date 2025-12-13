import { Inngest } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });


async function fetchClerkUser(id) {
    const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
        headers: {
            Authorization: `Bearer  ${process.env.CLERK_SECRET_KEY}`
        }
    });
    if (!res.ok) {
        const msg = await res.text()
        throw new Error("clerk API Error" + msg)
    }
    return await res.json();
}

//Inngest function to store the data into database.
const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    }, {
    event: 'clerk/user.created'
},
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        let username = email_addresses[0].email_address.split('@')[0]

        // check username availability
        const user = await User.findOne({ username })

        if (user) {
            username = username + Math.floor(Math.random() * 10000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username,
        }
        await User.create(userData)
    }
)

//Inngest function to update user data in database.
const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    }, {
    event: 'clerk/user.updated'
},
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const updateUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name
        }
        await User.findByIdAndUpdate(id, updateUserData)

    }
)

//Inngest function to delete user data from the database.
const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    }, {
    event: 'clerk/user.deleted'
},
    async ({ event }) => {
        const { id } = event.data
        await User.findByIdAndDelete(id)

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
];

// import { Inngest } from "inngest";
// import User from "../models/user.js";

// export const inngest = new Inngest({ id: "pingup-app" });

// // ---------------------------
// // NEW: Helper to fetch full user from Clerk
// // ---------------------------
// async function fetchClerkUser(id) {
//     const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
//         headers: {
//             Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
//         }
//     });
//     if (!res.ok) {
//         const msg = await res.text();
//         throw new Error("Clerk API error: " + msg);
//     }
//     return await res.json();
// }

// // ---------------------------
// // CREATE HANDLER
// // ---------------------------
// const syncUserCreation = inngest.createFunction(
//     {
//         id: 'sync-user-from-clerk'
//     }, {
//         event: 'clerk/user.created'
//     },
//     async ({ event }) => {

//         // ❌ WRONG — old code:
//         // const { id, first_name, last_name, email_address, image_url } = event.data

//         // ✅ FIX — Clerk webhook gives: email_addresses = []
//         const { id, first_name, last_name, image_url, email_addresses } = event.data;

//         let email = null;

//         // Try webhook emails first
//         if (Array.isArray(email_addresses) && email_addresses.length > 0) {
//             email = email_addresses[0].email_address;
//         }

//         // If webhook has no email, fetch from Clerk API
//         if (!email) {
//             const fullUser = await fetchClerkUser(id);
//             if (Array.isArray(fullUser.email_addresses) && fullUser.email_addresses.length > 0) {
//                 email = fullUser.email_addresses[0].email_address;
//             }
//         }

//         // Fallback (should not happen, but safe)
//         if (!email) email = `${id}@noemail.com`;

//         // Username derived safely
//         let username = email.split("@")[0];

//         // Check for duplicate username
//         const userExists = await User.findOne({ username });
//         if (userExists) {
//             username = username + Math.floor(Math.random() * 10000);
//         }

//         const userData = {
//             _id: id,
//             email,
//             full_name: first_name + " " + last_name,
//             profile_picture: image_url,
//             username,
//         };

//         await User.create(userData);
//     }
// );

// // UPDATE HANDLER (fixed email)
// const syncUserUpdation = inngest.createFunction(
//     {
//         id: 'update-user-from-clerk'
//     }, {
//         event: 'clerk/user.updated'
//     },
//     async ({ event }) => {

//         const { id, first_name, last_name, email_addresses } = event.data;

//         // Same logic: get email safely
//         let email = null;

//         if (Array.isArray(email_addresses) && email_addresses.length > 0) {
//             email = email_addresses[0].email_address;
//         } else {
//             const fullUser = await fetchClerkUser(id);
//             if (Array.isArray(fullUser.email_addresses) && fullUser.email_addresses.length > 0) {
//                 email = fullUser.email_addresses[0].email_address;
//             }
//         }

//         const updateUserData = {
//             email,
//             full_name: first_name + " " + last_name
//         };

//         await User.findByIdAndUpdate(id, updateUserData);
//     }
// );

// const syncUserDeletion = inngest.createFunction(
//     {
//         id: 'delete-user-from-clerk'
//     }, {
//         event: 'clerk/user.deleted'
//     },
//     async ({ event }) => {
//         const { id } = event.data;
//         await User.findByIdAndDelete(id);
//     }
// );

// export const functions = [
//     syncUserCreation,
//     syncUserUpdation,
//     syncUserDeletion,
// ];