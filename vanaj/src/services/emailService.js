import emailjs from '@emailjs/browser';

// Helper to safely access environment variables in Vite (import.meta.env) or Node.js (process.env)
const getEnvVar = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process?.env?.[key]) {
    return process.env[key];
  }
  return '';
};

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: getEnvVar('VITE_EMAILJS_SERVICE_ID'),
  publicKey: getEnvVar('VITE_EMAILJS_PUBLIC_KEY'),
  // Template for you (the store owner)
  adminTemplateId: getEnvVar('VITE_EMAILJS_ADMIN_TEMPLATE_ID') || getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
  // Template for the client (the buyer)
  buyerTemplateId: getEnvVar('VITE_EMAILJS_BUYER_TEMPLATE_ID') || getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
  // Fallback single template ID
  templateId: getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
  // The specific store owner email address where order receipts must go
  receiptEmail: getEnvVar('VITE_EMAILJS_RECEIPT_EMAIL') || 'orders@vanaj.org',
};

/**
 * Checks if EmailJS credentials are configured in the environment
 */
export const isEmailJsConfigured = () => {
  const hasService = Boolean(EMAILJS_CONFIG.serviceId && !EMAILJS_CONFIG.serviceId.includes('your_'));
  const hasKey = Boolean(EMAILJS_CONFIG.publicKey && !EMAILJS_CONFIG.publicKey.includes('your_'));
  const hasTemplate = Boolean(
    (EMAILJS_CONFIG.adminTemplateId && !EMAILJS_CONFIG.adminTemplateId.includes('your_')) ||
    (EMAILJS_CONFIG.buyerTemplateId && !EMAILJS_CONFIG.buyerTemplateId.includes('your_')) ||
    (EMAILJS_CONFIG.templateId && !EMAILJS_CONFIG.templateId.includes('your_'))
  );

  return hasService && hasKey && hasTemplate;
};

/**
 * Formats order items into a clean plain text receipt summary
 */
export const formatItemsSummary = (items) => {
  if (!items || items.length === 0) return 'No items';
  return items
    .map((item, idx) => {
      const priceNum = parseInt(String(item.discountPrice || item.price).replace(/[^\d]/g, ''), 10) || 0;
      const totalItemPrice = priceNum * (item.quantity || 1);
      return `${idx + 1}. ${item.name} (${item.tribe || 'Handcrafted'}) - Qty: ${item.quantity || 1} @ ${item.discountPrice || item.price} = ₹${totalItemPrice.toLocaleString('en-IN')}`;
    })
    .join('\n');
};

/**
 * Formats order items into an HTML snippet for HTML-capable email templates
 */
export const formatItemsHtml = (items) => {
  if (!items || items.length === 0) return '<p>No items</p>';
  return items
    .map((item) => {
      const priceNum = parseInt(String(item.discountPrice || item.price).replace(/[^\d]/g, ''), 10) || 0;
      const totalItemPrice = priceNum * (item.quantity || 1);
      return `
        <tr style="border-bottom: 1px solid #e7e5e4;">
          <td style="padding: 12px 8px; font-size: 14px; color: #1c1917; vertical-align: top;">
            <strong style="color: #1c1917; font-size: 14px;">${item.name}</strong><br/>
            <span style="font-size: 12px; color: #78716c;">${item.tribe || 'Indigenous Tribal Craft'}</span>
          </td>
          <td style="padding: 12px 8px; font-size: 14px; text-align: center; color: #44403c; vertical-align: top;">${item.quantity || 1}</td>
          <td style="padding: 12px 8px; font-size: 14px; text-align: right; color: #44403c; vertical-align: top;">${item.discountPrice || item.price}</td>
          <td style="padding: 12px 8px; font-size: 14px; text-align: right; font-weight: 600; color: #C68537; vertical-align: top;">₹${totalItemPrice.toLocaleString('en-IN')}</td>
        </tr>
      `;
    })
    .join('');
};

/**
 * Sends automated receipt emails using EmailJS:
 * 1. An Order Alert receipt sent to the Store Owner (your specific email).
 * 2. A Purchase Confirmation receipt sent to the Buyer (client's email).
 *
 * @param {Object} params
 * @param {Object} params.order - The order details { id, items, total, date }
 * @param {Object} params.customer - Customer details { name, email, phone, address, notes }
 * @param {string} [params.targetEmail] - The specific store owner email destination
 * @returns {Promise<Object>}
 */
export const sendOrderReceipt = async ({ order, customer, targetEmail }) => {
  const storeOwnerEmail = (targetEmail || EMAILJS_CONFIG.receiptEmail || 'orders@vanaj.org').trim();
  const buyerEmail = (customer.email || '').trim();
  const orderId = order.id || `VNJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderDate = order.date || new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const plainSummary = formatItemsSummary(order.items);
  const htmlSummary = formatItemsHtml(order.items);
  const itemsCount = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const formattedTotal = `₹${(order.total || 0).toLocaleString('en-IN')}`;

  // Comprehensive aliases so that ANY variable used in EmailJS templates works seamlessly
  const baseParams = {
    // Customer identification
    customer_name: customer.name || 'Valued Customer',
    name: customer.name || 'Valued Customer',
    user_name: customer.name || 'Valued Customer',

    // Customer contact
    customer_email: buyerEmail || 'Not provided',
    email: buyerEmail || 'Not provided',
    user_email: buyerEmail || 'Not provided',
    customer_phone: customer.phone || 'Not provided',
    phone: customer.phone || 'Not provided',
    mobile: customer.phone || 'Not provided',
    contact: customer.phone || 'Not provided',

    // Shipping & delivery
    shipping_address: customer.address || 'Standard Delivery',
    address: customer.address || 'Standard Delivery',
    delivery_address: customer.address || 'Standard Delivery',
    notes: customer.notes || 'None',
    special_instructions: customer.notes || 'None',

    // Order specifics
    order_id: orderId,
    orderId: orderId,
    id: orderId,
    order_date: orderDate,
    date: orderDate,

    // Pricing & items
    total_amount: formattedTotal,
    total: formattedTotal,
    amount: formattedTotal,
    price: formattedTotal,
    items_count: itemsCount,
    quantity: itemsCount,
    items_summary: plainSummary,
    items: plainSummary,
    orders: plainSummary,
    items_html: htmlSummary,

    // Store context
    currency: 'INR',
    store_name: 'Vanaj Tribal Heritage Marketplace',
    admin_email: storeOwnerEmail,
  };

  // If EmailJS is in development / simulated mode
  if (!isEmailJsConfigured()) {
    console.warn(
      '[EmailJS Service] Running in Simulated Demo Mode (Keys not yet added in .env).',
      '\n-> Admin Receipt would go to:', storeOwnerEmail,
      '\n-> Buyer Confirmation would go to:', buyerEmail,
      '\nOrder details:', baseParams
    );

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      simulated: true,
      orderId,
      storeOwnerEmail,
      buyerEmail,
      message: `Simulated receipt sent to store (${storeOwnerEmail}) and buyer (${buyerEmail}).`,
    };
  }

  const results = {
    adminSent: false,
    buyerSent: false,
    errors: [],
  };

  const adminTpl = EMAILJS_CONFIG.adminTemplateId || EMAILJS_CONFIG.templateId;
  const buyerTpl = EMAILJS_CONFIG.buyerTemplateId;

  // Formatted fallback messages for default EmailJS templates (which use {{message}})
  const adminMessage = `New order placed by ${customer.name || 'a customer'}!\n\nOrder ID: ${orderId}\nDate: ${orderDate}\nTotal: ${formattedTotal}\n\nCustomer Details:\n- Name: ${customer.name || 'N/A'}\n- Phone: ${customer.phone || 'N/A'}\n- Email: ${buyerEmail || 'N/A'}\n- Delivery Address: ${customer.address || 'N/A'}\n- Notes: ${customer.notes || 'None'}\n\nItems Ordered:\n${plainSummary}`;

  const buyerMessage = `Dear ${customer.name || 'Valued Customer'},\n\nThank you for your order! Your purchase from Vanaj Tribal Heritage Marketplace has been confirmed.\n\nOrder ID: ${orderId}\nOrder Date: ${orderDate}\nTotal: ${formattedTotal}\nDelivery Address: ${customer.address || 'N/A'}\n\nItems Ordered:\n${plainSummary}`;

  // 1. Send Order Notification to the Store Owner (Your specific email)
  if (adminTpl) {
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        adminTpl,
        {
          ...baseParams,
          to_name: 'Store Owner',
          from_name: customer.name || 'Valued Customer',
          message: adminMessage,
          to_email: storeOwnerEmail,
          target_email: storeOwnerEmail,
          recipient_email: storeOwnerEmail,
          reply_to: buyerEmail || storeOwnerEmail,
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
      results.adminSent = true;
    } catch (err) {
      console.error('[EmailJS] Failed to send admin order notification:', err);
      results.errors.push(`Admin receipt failed: ${err?.text || err?.message || 'Unknown error'}`);
    }
  }

  // 2. Send Purchase Receipt to the Client (Buyer)
  // Only send if a buyer template is configured and buyer has an email
  if (buyerTpl && buyerEmail && buyerTpl !== adminTpl) {
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        buyerTpl,
        {
          ...baseParams,
          to_name: customer.name || 'Valued Customer',
          from_name: 'Vanaj Tribal Heritage Marketplace',
          message: buyerMessage,
          to_email: buyerEmail,
          target_email: buyerEmail,
          recipient_email: buyerEmail,
          reply_to: storeOwnerEmail,
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
      results.buyerSent = true;
    } catch (err) {
      console.error('[EmailJS] Failed to send buyer confirmation receipt:', err);
      results.errors.push(`Buyer receipt failed: ${err?.text || err?.message || 'Unknown error'}`);
    }
  }

  // If admin email failed and nothing was sent, throw so user gets visible alert
  if (!results.adminSent && !results.buyerSent && results.errors.length > 0) {
    throw new Error(results.errors.join('; '));
  }

  return {
    success: true,
    simulated: false,
    orderId,
    storeOwnerEmail,
    buyerEmail,
    results,
  };
};
