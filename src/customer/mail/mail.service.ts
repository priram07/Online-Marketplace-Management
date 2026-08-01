import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, fullName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Welcome to Online Marketplace 🎉',
        html: `<h2>Hi ${fullName},</h2><p>Your customer account has been created successfully.</p>`,
      });
    } catch (err) {
      // Do not block registration flow if email fails; just log it
      this.logger.error(`Failed to send welcome email to ${to}: ${err.message}`);
    }
  }

  async sendOrderConfirmation(to: string, orderId: number, amount: number): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace" <${process.env.MAIL_USER}>`,
        to,
        subject: `Order #${orderId} Confirmed`,
        html: `<p>Your order #${orderId} for $${amount} has been placed successfully.</p>`,
      });
    } catch (err) {
      this.logger.error(`Failed to send order confirmation: ${err.message}`);
    }
  }
}
