import transporter from "../config/email.js";

const sendEmail = async ({ to, subject, html }) => {
    try {

        const info = await transporter.sendMail({
            from:"welcome to QuickNest",
            to,
            subject,
            html
        })

        console.log("Email sent id", info.messageId)
    } catch (error) {
        console.log(error.message)
    }
}

export default sendEmail