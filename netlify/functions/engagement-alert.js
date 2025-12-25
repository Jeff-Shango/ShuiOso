// netlify/functions/engagement-alert.js

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");

    const {
      type = "unknown",
      path = "/",
      routeCount = 0,
      engagedSeconds = 0,
      sessionId = "",
      referrer = "",
      userAgent = "",
    } = body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.ALERT_TO_EMAIL || "shuinetworks@gmail.com";
    const FROM = process.env.ALERT_FROM_EMAIL || "onboarding@resend.dev";

    if (!RESEND_API_KEY) {
      return { statusCode: 500, body: "Missing RESEND_API_KEY" };
    }

    const email = {
      from: FROM,
      to: TO,
      subject: `[ShuiOsoSite] Alert: ${type}`,
      text: [
        `Type: ${type}`,
        `Path: ${path}`,
        `Route count: ${routeCount}`,
        `Engaged seconds: ${engagedSeconds}`,
        `Session: ${sessionId}`,
        `Referrer: ${referrer}`,
        `User-Agent: ${userAgent}`,
      ].join("\n"),
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: 500, body: err };
    }

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
