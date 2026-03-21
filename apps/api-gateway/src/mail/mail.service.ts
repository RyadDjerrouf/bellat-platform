import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  /** Shared helper — sends an email via SendGrid v3. Returns false on missing key. */
  private async send(payload: object): Promise<void> {
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    if (!apiKey || apiKey === 'REPLACE_ME') return; // dev fallback handled by callers

    const body = JSON.stringify(payload);
    await new Promise<void>((resolve) => {
      const req = https.request(
        {
          hostname: 'api.sendgrid.com',
          path: '/v3/mail/send',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode && res.statusCode < 300) {
              resolve();
            } else {
              this.logger.error(`SendGrid error ${res.statusCode}: ${data}`);
              resolve(); // fail silently — never block the caller
            }
          });
        },
      );
      req.on('error', (err) => {
        this.logger.error(`SendGrid request failed: ${err.message}`);
        resolve();
      });
      req.write(body);
      req.end();
    });
  }

  async sendWelcome(toEmail: string, fullName: string): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    const fromEmail = this.config.get<string>('MAIL_FROM') ?? 'noreply@bellat.dz';
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');

    if (!apiKey || apiKey === 'REPLACE_ME') {
      this.logger.log(`[DEV] Welcome email would be sent to ${toEmail}`);
      return;
    }

    await this.send({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: 'Bellat' },
      subject: 'Bienvenue chez Bellat 🎉',
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px">
              <img src="${appUrl}/icons/icon-192.png" width="56" alt="Bellat" style="margin-bottom:24px"/>
              <h2 style="color:#15803d;margin:0 0 8px">Bienvenue, ${fullName} !</h2>
              <p style="color:#374151;line-height:1.6">
                Merci de nous avoir rejoints. Votre compte Bellat est prêt — découvrez notre gamme de
                produits halal frais et passez votre première commande dès maintenant.
              </p>
              <p style="margin:24px 0">
                <a href="${appUrl}/fr/products"
                   style="background:#15803d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
                  Découvrir nos produits
                </a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
              <p style="color:#9ca3af;font-size:12px">Bellat — Conserverie de Viandes d'Algérie</p>
            </div>
          `,
        },
      ],
    });

    this.logger.log(`Welcome email sent to ${toEmail}`);
  }

  async sendOrderConfirmation(
    toEmail: string,
    fullName: string,
    order: {
      id: string;
      total: number | string;
      deliverySlotDate: Date | string;
      deliverySlotTime: string;
      deliveryAddress: { wilaya?: string; commune?: string; addressLine1?: string } | unknown;
      items: { nameFr: string; quantity: number; priceAtPurchase: number | string }[];
    },
  ): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    const fromEmail = this.config.get<string>('MAIL_FROM') ?? 'noreply@bellat.dz';
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');

    if (!apiKey || apiKey === 'REPLACE_ME') {
      this.logger.log(`[DEV] Order confirmation email would be sent to ${toEmail} for order ${order.id}`);
      return;
    }

    const addr = order.deliveryAddress as { wilaya?: string; commune?: string; addressLine1?: string };
    const deliveryDate = new Date(order.deliverySlotDate).toLocaleDateString('fr-DZ', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;color:#374151">${item.nameFr}</td>
            <td style="padding:8px 0;text-align:center;color:#6b7280">x${item.quantity}</td>
            <td style="padding:8px 0;text-align:right;color:#374151;font-weight:600">
              ${(Number(item.priceAtPurchase) * item.quantity).toLocaleString('fr-DZ')} DZD
            </td>
          </tr>`,
      )
      .join('');

    await this.send({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: 'Bellat' },
      subject: `Commande confirmée — ${order.id}`,
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px">
              <img src="${appUrl}/icons/icon-192.png" width="56" alt="Bellat" style="margin-bottom:24px"/>
              <h2 style="color:#15803d;margin:0 0 4px">Votre commande est confirmée !</h2>
              <p style="color:#6b7280;margin:0 0 24px">Bonjour ${fullName}, merci pour votre commande.</p>

              <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Numéro de commande</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#111827">${order.id}</p>
              </div>

              <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
                <thead>
                  <tr style="border-bottom:2px solid #e5e7eb">
                    <th style="text-align:left;padding:8px 0;font-size:13px;color:#6b7280">Produit</th>
                    <th style="text-align:center;padding:8px 0;font-size:13px;color:#6b7280">Qté</th>
                    <th style="text-align:right;padding:8px 0;font-size:13px;color:#6b7280">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr style="border-top:2px solid #e5e7eb">
                    <td colspan="2" style="padding:12px 0;font-weight:700;color:#111827">Total</td>
                    <td style="padding:12px 0;text-align:right;font-weight:700;color:#15803d;font-size:16px">
                      ${Number(order.total).toLocaleString('fr-DZ')} DZD
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div style="background:#f0fdf4;border-left:4px solid #15803d;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Livraison prévue</p>
                <p style="margin:0 0 2px;font-weight:600;color:#111827">${deliveryDate}</p>
                <p style="margin:0 0 8px;color:#374151;font-size:14px">${order.deliverySlotTime}</p>
                <p style="margin:0;color:#6b7280;font-size:13px">
                  ${addr?.addressLine1 ?? ''}, ${addr?.commune ?? ''}, ${addr?.wilaya ?? ''}
                </p>
              </div>

              <p style="margin:24px 0">
                <a href="${appUrl}/fr/orders"
                   style="background:#15803d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
                  Suivre ma commande
                </a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
              <p style="color:#9ca3af;font-size:12px">Bellat — Conserverie de Viandes d'Algérie</p>
            </div>
          `,
        },
      ],
    });

    this.logger.log(`Order confirmation email sent to ${toEmail} for order ${order.id}`);
  }

  async sendStockAlert(
    toEmail: string,
    adminName: string,
    alerts: {
      outOfStock: { id: string; nameFr: string }[];
      lowStock:   { id: string; nameFr: string }[];
    },
  ): Promise<void> {
    const appUrl    = this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    const fromEmail = this.config.get<string>('MAIL_FROM') ?? 'noreply@bellat.dz';
    const apiKey    = this.config.get<string>('SENDGRID_API_KEY');

    if (!apiKey || apiKey === 'REPLACE_ME') {
      this.logger.warn(
        `[DEV] Stock alert for ${toEmail}: ` +
        `${alerts.outOfStock.length} out-of-stock, ${alerts.lowStock.length} low-stock`,
      );
      return;
    }

    const listHtml = (items: { nameFr: string }[], color: string) =>
      items.map((p) => `<li style="color:${color};padding:2px 0">${p.nameFr}</li>`).join('');

    await this.send({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: 'Bellat' },
      subject: `[Alerte stock] ${alerts.outOfStock.length} rupture(s), ${alerts.lowStock.length} stock faible`,
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px">
              <img src="${appUrl}/icons/icon-192.png" width="56" alt="Bellat" style="margin-bottom:24px"/>
              <h2 style="color:#dc2626;margin:0 0 8px">Alerte Stock</h2>
              <p style="color:#374151">Bonjour ${adminName}, voici l'état des stocks critiques :</p>

              ${alerts.outOfStock.length > 0 ? `
              <h3 style="color:#dc2626;margin:16px 0 8px">Rupture de stock (${alerts.outOfStock.length})</h3>
              <ul>${listHtml(alerts.outOfStock, '#dc2626')}</ul>
              ` : ''}

              ${alerts.lowStock.length > 0 ? `
              <h3 style="color:#d97706;margin:16px 0 8px">Stock faible (${alerts.lowStock.length})</h3>
              <ul>${listHtml(alerts.lowStock, '#d97706')}</ul>
              ` : ''}

              <p style="margin:24px 0">
                <a href="${appUrl}/admin/inventory"
                   style="background:#15803d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
                  Gérer l'inventaire
                </a>
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
              <p style="color:#9ca3af;font-size:12px">Bellat — rapport automatique horaire</p>
            </div>
          `,
        },
      ],
    });
  }

  async sendPasswordReset(toEmail: string, resetToken: string): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    const fromEmail = this.config.get<string>('MAIL_FROM') ?? 'noreply@bellat.dz';
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    const resetLink = `${appUrl}/fr/reset-password?token=${resetToken}`;

    if (!apiKey || apiKey === 'REPLACE_ME') {
      this.logger.warn(`[DEV] Password reset link for ${toEmail}: ${resetLink}`);
      return;
    }

    await this.send({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: 'Bellat' },
      subject: 'Réinitialisation de votre mot de passe Bellat',
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px">
              <img src="${appUrl}/icons/icon-192.png" width="56" alt="Bellat" style="margin-bottom:24px"/>
              <h2 style="color:#15803d;margin:0 0 8px">Réinitialisation du mot de passe</h2>
              <p style="color:#374151;line-height:1.6">
                Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte Bellat.
              </p>
              <p style="margin:24px 0">
                <a href="${resetLink}"
                   style="background:#15803d;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
                  Réinitialiser mon mot de passe
                </a>
              </p>
              <p style="color:#6b7280;font-size:13px">
                Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
              <p style="color:#9ca3af;font-size:12px">Bellat — Conserverie de Viandes d'Algérie</p>
            </div>
          `,
        },
      ],
    });

    this.logger.log(`Password reset email sent to ${toEmail}`);
  }
}
