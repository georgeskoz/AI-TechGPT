import { SendGridMail } from '@sendgrid/mail';

interface ReceiptData {
  jobId: string;
  invoiceNumber: string;
  serviceDate: string;
  serviceTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  serviceProviderName: string;
  serviceProviderId: string;
  serviceType: 'onsite' | 'remote' | 'phone';
  serviceDetails: {
    category: string;
    description: string;
    duration: number;
    hourlyRate: number;
    total: number;
  };
  hardwareItems: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  gst: number; // 5% GST
  tvq: number; // 9.975% TVQ for Quebec
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  completedAt: string;
}

export class ReceiptService {
  
  /**
   * Calculate Quebec taxes for a given subtotal
   */
  static calculateQuebecTaxes(subtotal: number): { gst: number; tvq: number; total: number } {
    const gst = subtotal * 0.05; // 5% GST
    const tvq = subtotal * 0.09975; // 9.975% TVQ
    const total = subtotal + gst + tvq;
    
    return {
      gst: Math.round(gst * 100) / 100,
      tvq: Math.round(tvq * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  /**
   * Generate receipt data for a completed job
   */
  static generateReceiptData(jobData: any): ReceiptData {
    const serviceTotal = jobData.serviceDetails.total;
    const hardwareTotal = jobData.hardwareItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const subtotal = serviceTotal + hardwareTotal;
    
    const taxes = this.calculateQuebecTaxes(subtotal);
    
    return {
      jobId: jobData.jobId,
      invoiceNumber: `INV-${Date.now()}-${jobData.jobId}`,
      serviceDate: jobData.serviceDate,
      serviceTime: jobData.serviceTime,
      customerName: jobData.customerName,
      customerEmail: jobData.customerEmail,
      customerPhone: jobData.customerPhone,
      customerAddress: jobData.customerAddress,
      serviceProviderName: jobData.serviceProviderName,
      serviceProviderId: jobData.serviceProviderId,
      serviceType: jobData.serviceType,
      serviceDetails: jobData.serviceDetails,
      hardwareItems: jobData.hardwareItems,
      subtotal: subtotal,
      gst: taxes.gst,
      tvq: taxes.tvq,
      total: taxes.total,
      paymentMethod: jobData.paymentMethod,
      paymentStatus: jobData.paymentStatus,
      completedAt: new Date().toLocaleString('en-CA', { 
        timeZone: 'America/Toronto',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
  }

  /**
   * Generate text receipt for SMS
   */
  static generateTextReceipt(receiptData: ReceiptData): string {
    const hardwareItemsText = receiptData.hardwareItems.length > 0 
      ? receiptData.hardwareItems.map(item => 
          `${item.name} (${item.quantity}x) - $${item.total.toFixed(2)}`
        ).join('\n')
      : 'No hardware items';

    return `
TechGPT Service Receipt
======================

Invoice: ${receiptData.invoiceNumber}
Job ID: ${receiptData.jobId}
Date: ${receiptData.serviceDate}
Time: ${receiptData.serviceTime}

Customer: ${receiptData.customerName}
Service Provider: ${receiptData.serviceProviderName}

Service Details:
- Category: ${receiptData.serviceDetails.category}
- Duration: ${Math.floor(receiptData.serviceDetails.duration / 60)}h ${receiptData.serviceDetails.duration % 60}m
- Rate: $${receiptData.serviceDetails.hourlyRate.toFixed(2)}/hour
- Service Cost: $${receiptData.serviceDetails.total.toFixed(2)}

Hardware & Parts:
${hardwareItemsText}

Billing Summary:
- Subtotal: $${receiptData.subtotal.toFixed(2)}
- GST (5%): $${receiptData.gst.toFixed(2)}
- TVQ (9.975%): $${receiptData.tvq.toFixed(2)}
- Total: $${receiptData.total.toFixed(2)} CAD

Payment: ${receiptData.paymentMethod} (${receiptData.paymentStatus})
Completed: ${receiptData.completedAt}

Thank you for choosing TechGPT!
Support: support@techgpt.com
    `.trim();
  }

  /**
   * Generate HTML receipt for email
   */
  static generateHTMLReceipt(receiptData: ReceiptData): string {
    const hardwareItemsHTML = receiptData.hardwareItems.length > 0 
      ? receiptData.hardwareItems.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${item.total.toFixed(2)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="5" style="padding: 8px; text-align: center; color: #666;">No hardware items</td></tr>';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TechGPT Service Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; border-radius: 8px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1f2937; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-box { background: #f9fafb; padding: 15px; border-radius: 6px; }
        .info-box h4 { margin: 0 0 10px 0; font-size: 14px; font-weight: bold; }
        .info-box p { margin: 5px 0; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: #f3f4f6; padding: 12px 8px; text-align: left; font-weight: bold; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .total-section { background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: #059669; border-top: 2px solid #d1d5db; padding-top: 10px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TechGPT Service Receipt</div>
            <p>Professional Technical Support Services</p>
        </div>

        <div class="info-grid">
            <div class="info-box">
                <h4>Invoice Information</h4>
                <p><strong>Invoice Number:</strong> ${receiptData.invoiceNumber}</p>
                <p><strong>Job ID:</strong> ${receiptData.jobId}</p>
                <p><strong>Service Date:</strong> ${receiptData.serviceDate}</p>
                <p><strong>Service Time:</strong> ${receiptData.serviceTime}</p>
                <p><strong>Completed:</strong> ${receiptData.completedAt}</p>
            </div>
            
            <div class="info-box">
                <h4>Payment Information</h4>
                <p><strong>Payment Method:</strong> ${receiptData.paymentMethod}</p>
                <p><strong>Status:</strong> ${receiptData.paymentStatus.toUpperCase()}</p>
                <p><strong>Total Amount:</strong> <span style="color: #059669; font-weight: bold;">$${receiptData.total.toFixed(2)} CAD</span></p>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-box">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${receiptData.customerName}</p>
                <p><strong>Email:</strong> ${receiptData.customerEmail}</p>
                <p><strong>Phone:</strong> ${receiptData.customerPhone}</p>
                <p><strong>Address:</strong> ${receiptData.customerAddress}</p>
            </div>
            
            <div class="info-box">
                <h4>Service Provider</h4>
                <p><strong>Name:</strong> ${receiptData.serviceProviderName}</p>
                <p><strong>Provider ID:</strong> ${receiptData.serviceProviderId}</p>
                <p><strong>Service Type:</strong> ${receiptData.serviceType === 'onsite' ? 'On-Site Service' : receiptData.serviceType === 'remote' ? 'Remote Support' : 'Phone Support'}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Service Details</div>
            <div class="info-box">
                <p><strong>Category:</strong> ${receiptData.serviceDetails.category}</p>
                <p><strong>Description:</strong> ${receiptData.serviceDetails.description}</p>
                <p><strong>Duration:</strong> ${Math.floor(receiptData.serviceDetails.duration / 60)}h ${receiptData.serviceDetails.duration % 60}m</p>
                <p><strong>Rate:</strong> $${receiptData.serviceDetails.hourlyRate.toFixed(2)}/hour</p>
                <p><strong>Service Cost:</strong> $${receiptData.serviceDetails.total.toFixed(2)}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Hardware & Parts</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${hardwareItemsHTML}
                </tbody>
            </table>
        </div>

        <div class="total-section">
            <div class="section-title">Billing Summary</div>
            <div class="total-row">
                <span>Service Cost:</span>
                <span>$${receiptData.serviceDetails.total.toFixed(2)}</span>
            </div>
            ${receiptData.hardwareItems.length > 0 ? `
            <div class="total-row">
                <span>Hardware & Parts:</span>
                <span>$${receiptData.hardwareItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
            </div>` : ''}
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>GST (5%):</span>
                <span>$${receiptData.gst.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>TVQ (9.975%):</span>
                <span>$${receiptData.tvq.toFixed(2)}</span>
            </div>
            <div class="total-row total-final">
                <span>Total Amount:</span>
                <span>$${receiptData.total.toFixed(2)} CAD</span>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for choosing TechGPT Technical Support Services</p>
            <p>For support or questions, contact us at support@techgpt.com</p>
            <p>&copy; ${new Date().getFullYear()} TechGPT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}