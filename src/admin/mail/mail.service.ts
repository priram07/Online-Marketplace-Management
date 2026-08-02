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

  async sendAdminWelcomeEmail(to: string, fullName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace Admin" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Admin Account Created',
        html: `<h2>Welcome ${fullName},</h2><p>Your admin account is ready.</p>`,
      });
    } catch (err) {
      this.logger.error(`Failed to send admin welcome email: ${err.message}`);
    }
  }

  async sendLowStockAlert(
    to: string,
    productName: string,
    stock: number,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Online Marketplace Admin" <${process.env.MAIL_USER}>`,
        to,
        subject: `Low Stock Alert: ${productName}`,
        html: `<p>${productName} is running low. Current stock: ${stock}.</p>`,
      });
    } catch (err) {
      this.logger.error(`Failed to send low stock alert: ${err.message}`);
    }
  }
}
