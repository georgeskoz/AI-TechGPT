import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set - email functionality disabled");
}

if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  console.error("Invalid SendGrid API key format - must start with 'SG.'");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Check if SendGrid is properly configured
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY is not configured');
    return false;
  }

  if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.error('Cannot send email: Invalid SendGrid API key format');
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: {
        email: 'noreply@techgpt.app',
        name: 'TechGPT Support'
      },
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generatePasswordResetEmail(resetLink: string, userEmail: string): { html: string; text: string } {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your TechGPT Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 14px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔧 TechGPT</h1>
        <p>Password Reset Request</p>
      </div>
      
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        
        <p>We received a request to reset the password for your TechGPT account associated with <strong>${userEmail}</strong>.</p>
        
        <p>Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 3px; font-family: monospace;">
          ${resetLink}
        </p>
        
        <div class="warning">
          <strong>⚠️ Important:</strong>
          <ul>
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <p>If you continue to have problems, please contact our support team.</p>
        
        <p>Best regards,<br>
        The TechGPT Support Team</p>
      </div>
      
      <div class="footer">
        <p>© 2025 TechGPT - AI-Powered Technical Support Platform</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    TechGPT - Password Reset Request
    
    Hello,
    
    We received a request to reset the password for your TechGPT account associated with ${userEmail}.
    
    Please click the following link to reset your password:
    ${resetLink}
    
    IMPORTANT:
    - This link will expire in 1 hour for security reasons
    - If you didn't request this reset, please ignore this email
    - Never share this link with anyone
    
    If you continue to have problems, please contact our support team.
    
    Best regards,
    The TechGPT Support Team
    
    © 2025 TechGPT - AI-Powered Technical Support Platform
    This is an automated message. Please do not reply to this email.
  `;

  return { html, text };
}