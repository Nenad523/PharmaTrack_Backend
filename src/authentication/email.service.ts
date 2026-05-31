/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    
  private transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // App password, ne obična lozinka
      }
  })

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    const html = `
      <div style="background: #f3f6fb; padding: 32px 16px; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); color: #fff; padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 30px; line-height: 1.25; font-weight: 700;">Potvrdite vašu email adresu</h1>
            <p style="margin: 10px 0 0 0; font-size: 17px; line-height: 1.5; opacity: 0.96;">
              Još jedan korak do aktivacije vašeg PharmaTrack naloga.
            </p>
          </div>

          <div style="padding: 30px 32px 34px 32px; color: #111827;">
            <p style="margin: 0 0 18px 0; font-size: 18px; line-height: 1.65;">
              Da biste završili registraciju, kliknite na dugme ispod i verifikujte email adresu.
            </p>

            <div style="margin: 26px 0 30px 0; text-align: center;">
              <a
                href="${verificationUrl}"
                style="background: #2563eb; color: #ffffff; font-weight: 700; font-size: 19px; letter-spacing: 0.2px; text-decoration: none; display: inline-block; padding: 16px 34px; border-radius: 10px; box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);"
              >
                Verifikuj email adresu
              </a>
            </div>

            <p style="margin: 0 0 10px 0; font-size: 15px; color: #374151;">
              Ako dugme ne radi, kopirajte i otvorite ovaj link u browseru:
            </p>
            <p style="margin: 0; word-break: break-all; font-size: 14px; color: #1d4ed8;">
              <a href="${verificationUrl}" style="color: #1d4ed8; text-decoration: underline;">${verificationUrl}</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px 0;" />

            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
              Link važi <strong>24 sata</strong>. Ako niste kreirali nalog, slobodno ignorišite ovaj email.
            </p>
          </div>
        </div>
      </div>
    `

    const subject = 'Verifikacija email adrese — PharmaTrack';

    if (process.env.BREVO_API_KEY) {
      await this.sendWithBrevo(email, subject, html);
      return;
    }

    await this.transporter.sendMail({
      from: `"PharmaTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    })
  }

  async sendAvailabilityNotification(
    email: string,
    medicationName: string,
    strength: string,
    pharmacyName: string,
  ) {
    const searchUrl = `${process.env.FRONTEND_URL}/search`;
    const subject = `${medicationName} ${strength} je dostupan!`;
    const html = `
      <div style="background: #f3f6fb; padding: 32px 16px; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1d4ed8, #2563eb); color: #fff; padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 30px; line-height: 1.25; font-weight: 700;">${medicationName} ${strength} je dostupan!</h1>
            <p style="margin: 10px 0 0 0; font-size: 17px; line-height: 1.5; opacity: 0.96;">
              Lijek koji pratite je ponovo na stanju.
            </p>
          </div>

          <div style="padding: 30px 32px 34px 32px; color: #111827;">
            <p style="margin: 0 0 18px 0; font-size: 18px; line-height: 1.65;">
              <strong>${medicationName} ${strength}</strong> je dostupan u:
            </p>

            <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 6px; margin: 0 0 26px 0;">
              <p style="margin: 0; font-size: 17px; font-weight: 600; color: #1d4ed8;">→ ${pharmacyName}</p>
            </div>

            <div style="margin: 0 0 30px 0; text-align: center;">
              <a
                href="${searchUrl}"
                style="background: #2563eb; color: #ffffff; font-weight: 700; font-size: 19px; letter-spacing: 0.2px; text-decoration: none; display: inline-block; padding: 16px 34px; border-radius: 10px; box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);"
              >
                Pretražite apoteke
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px 0;" />

            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
              Dobili ste ovaj email jer ste se pretplatili na obavijesti za ovaj lijek putem PharmaTrack platforme.
            </p>
          </div>
        </div>
      </div>
    `;

    if (process.env.BREVO_API_KEY) {
      await this.sendWithBrevo(email, subject, html);
      return;
    }

    await this.transporter.sendMail({
      from: `"PharmaTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
  }

  private async sendWithBrevo(email: string, subject: string, html: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? process.env.EMAIL_USER;
    const senderName = process.env.BREVO_SENDER_NAME ?? 'PharmaTrack';

    if (!apiKey) {
      throw new Error('BREVO_API_KEY mora biti postavljen.');
    }

    if (!senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL ili EMAIL_USER mora biti postavljen.');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Brevo slanje emaila nije uspjelo: ${response.status} ${text}`);
    }
  }
}
