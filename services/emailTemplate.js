function generateEmailTemplate(templateData) {
    const {
        subject = "Welcome to QuickNest 🎉",
        userName = "User",
        buttonUrl = "#"
    } = templateData;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; color:#ffffff; padding:30px; text-align:center;">
              <h1 style="margin:0;">Welcome to QuickNest 🚀</h1>
              <p style="margin:8px 0 0; font-size:14px;">Smart Booking Made Easy</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px;">
              
              <p style="font-size:16px;">Hi ${userName},</p>

              <p style="font-size:15px; color:#555; line-height:1.6;">
                Welcome to <strong>QuickNest</strong>! 🎉  
                We're excited to have you on board.
              </p>

              <p style="font-size:15px; color:#555; line-height:1.6;">
                QuickNest is your all-in-one platform to easily discover, book, and manage services — 
                whether it's home services, professional help, or quick appointments.
              </p>

              <!-- Features -->
              <table width="100%" style="margin:20px 0;">
                <tr>
                  <td style="padding:10px 0;">
                    ✅ Easy Service Booking  
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    ✅ Secure & Reliable Platform  
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    ✅ Real-Time Availability  
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    ✅ Manage Your Bookings Anytime  
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table align="center" cellpadding="0" cellspacing="0" style="margin:25px 0;">
                <tr>
                  <td align="center" bgcolor="#4f46e5" style="border-radius:5px;">
                    <a href="${buttonUrl}" 
                       style="display:inline-block; padding:12px 30px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold;">
                       Explore Services
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Extra Info -->
              <p style="font-size:14px; color:#777;">
                Need help getting started? Our support team is always here for you.
              </p>

              <p style="font-size:14px; color:#777;">
                Let’s make your booking experience smooth and fast with QuickNest 🚀
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #eee;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; font-size:12px; color:#999;">
              <p style="margin:5px 0;">© 2026 QUICKNEST. All rights reserved.</p>
              <p style="margin:5px 0;">
                <a href="#" style="color:#4f46e5; text-decoration:none;">Privacy Policy</a> |
                <a href="#" style="color:#4f46e5; text-decoration:none;">Terms</a> |
                <a href="#" style="color:#4f46e5; text-decoration:none;">Contact</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

export default generateEmailTemplate;