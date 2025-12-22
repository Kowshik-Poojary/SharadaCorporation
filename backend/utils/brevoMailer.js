import axios from "axios";

export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  try {
    // Ensure 'to' is in the correct format
    const toArray = Array.isArray(to) 
      ? to.map(item => typeof item === 'string' ? { email: item } : item)
      : [{ email: to }];

    const payload = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: toArray,
      subject,
      textContent: text,
    };

    // Only add htmlContent if provided
    if (html) {
      payload.htmlContent = html;
    }

    // Only add replyTo if provided
    if (replyTo) {
      payload.replyTo = { email: replyTo };
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(
      "❌ Brevo mail error:",
      err.response?.data || err.message
    );
    throw err;
  }
};
