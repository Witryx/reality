import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const requiredFields = ['name', 'email', 'phone', 'message'];

const getTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const missing = requiredFields.filter((field) => !payload?.[field]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  const to = process.env.CONTACT_TO || 'petahecik@gmail.com';
  const subject = `Contact form: ${payload.name || 'New inquiry'}`;
  const text = `
Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}

Message:
${payload.message}
  `.trim();

  const transporter = getTransport();

  if (!transporter) {
    return NextResponse.json(
      { error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.' },
      { status: 503 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Website" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/contact send failed', error);
    return NextResponse.json(
      { error: 'Failed to send email.', detail: error.message },
      { status: 500 }
    );
  }
}
