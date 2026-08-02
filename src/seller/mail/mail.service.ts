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

  async sendWelcomeEmail(to: string, businessName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Welcome, Seller! 🎉',
        html: `<h2>Hi ${businessName},</h2><p>Your seller account has been created successfully. You can now list products in your store.</p>`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to send seller welcome email to ${to}: ${message}`);
    }
  }

  async sendListingPublishedEmail(to: string, title: string, price: number): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace" <${process.env.MAIL_USER}>`,
        to,
        subject: `Listing Published: ${title}`,
        html: `<p>Your listing "${title}" priced at $${price} is now live.</p>`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to send listing published email: ${message}`);
    }
  }
}