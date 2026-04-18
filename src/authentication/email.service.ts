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

    await this.transporter.sendMail({
      from: `"PharmaTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifikacija email adrese — PharmaTrack',
      html: `
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
    })
  }
}