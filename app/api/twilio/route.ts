import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { to, message } = await req.json();

  try {
    await client.messages
      .create({
        body: message,
        from: twilioPhoneNumber,
        to: "+923149648345",
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.log(error));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 },
    );
  }
}
