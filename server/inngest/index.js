import { Inngest, step } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app", signingKey: process.env.INNGEST_SIGNING_KEY });

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

// Send email to user for a new connection request.
const sendnewConnectionRequest = inngest.createFunction(
    { id: "send-new-connection-request-reminder" },
    { event: "app/connection-request" },
    async ({ event, step }) => {
        const { connectionId } = event.data;

        await step.run('send-connections-request-mail', async () => {
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
            const subject = `New Connection Request`;
            const body = `<div>
            <h2>Hi ${connection.to_user_id.full_name},</h2>
            <p> You have a connections request from  ${connection.from_user_id.full_name} - @${connection.from_user_id.username})</p>
            <p>CLick 
            <a href="${process.env.FRONTEND_URL}/connections">here</a> to view your connections.
            </p>
            <br/>
            <p>Thanks, <br/>PingUp Team</p>
            </div>`

await sendEmail({
    to: connection.to_user_id.email,
    subject,
    body
})
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendnewConnectionRequest
];
