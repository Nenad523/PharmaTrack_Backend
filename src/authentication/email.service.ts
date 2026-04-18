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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Dobrodošli na PharmaTrack!</h2>
          <p>Kliknite na dugme ispod da verifikujete vašu email adresu:</p>
          <a href="${verificationUrl}" 
             style="background: #2563eb; color: white; padding: 12px 24px; 
                    border-radius: 8px; text-decoration: none; display: inline-block;">
            Verifikuj email
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 16px;">
            Link važi 24 sata. Ako niste kreirali nalog, ignorišite ovaj email.
          </p>
        </div>
      `
    })
  }
}