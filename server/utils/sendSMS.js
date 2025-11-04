import config from "config";
import Twilio from "twilio";

const SEND_SMS = config.get("SEND_SMS");

let client = null;

if (SEND_SMS) {
  const SID = config.get("TWILIO_ACCOUNT_SID");
  const TOKEN = config.get("TWILIO_AUTH_TOKEN");
  client = new Twilio(SID, TOKEN);
}

export default async function sendSMS(smsData) {
  try {
    if (!SEND_SMS || !client) {
      console.log("SMS sending disabled or Twilio not configured.");
      return;
    }

    await client.messages.create({
      body: smsData.body,
      to: smsData.phonenumber,
      from: config.get("TWILIO_PHONE_NUMBER"),
    });

    console.log("✅ SMS sent successfully!");
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
}