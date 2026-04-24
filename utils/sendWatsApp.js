import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM; 

const client = twilio(accountSid, authToken);


const sendWhatsApp = async ({ to, body }) => {
    try {
        const message = await client.messages.create({
            from: fromNumber,
            to: `whatsapp:${to}`,
            body,
        });

        console.log("WhatsApp message sent, SID:", message.sid);
        return message;
    } catch (error) {
        console.error("WhatsApp send error:", error.message);
    }
};

export default sendWhatsApp;