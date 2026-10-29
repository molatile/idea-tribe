import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Mail, 
  ShoppingBag, 
  AlertCircle, 
  MapPin, 
  Phone, 
  User, 
  Send, 
  Printer, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { sendOrderReceipt, EMAILJS_CONFIG, isEmailJsConfigured } from '../../services/emailService';

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(String(priceStr).replace(/[^\d]/g, ''), 10) || 0;
};

const generateOrderId = () => `VNJ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

const formatCurrentDate = () => new Date().toLocaleString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const CheckoutModal = ({ isOpen, onClose, items = [], onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    notes: '',
    targetEmail: EMAILJS_CONFIG.receiptEmail || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showEmailConfigTip, setShowEmailConfigTip] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (total, item) => total + parsePrice(item.discountPrice || item.price) * (item.quantity || 1),
    0
  );

  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const isConfigured = isEmailJsConfigured();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Please fill in your name, email, phone number, and delivery address.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid customer email address.');
      return;
    }

    const destinationEmail = (formData.targetEmail.trim() || EMAILJS_CONFIG.receiptEmail || formData.email).trim();
    if (!emailRegex.test(destinationEmail)) {
      setErrorMessage('Please enter a valid destination email address for the receipt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const orderId = generateOrderId();
    const orderDate = formatCurrentDate();

    const orderPayload = {
      id: orderId,
      date: orderDate,
      items,
      total: totalAmount,
    };

    const customerPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: `${formData.address.trim()}${formData.pincode ? ` - PIN: ${formData.pincode.trim()}` : ''}`,
      notes: formData.notes.trim(),
    };

    try {
      const result = await sendOrderReceipt({
        order: orderPayload,
        customer: customerPayload,
        targetEmail: destinationEmail,
      });

      setCompletedOrder({
        orderId,
        date: orderDate,
        items,
        total: totalAmount,
        customer: customerPayload,
        recipient: destinationEmail,
        isSimulated: result.simulated,
      });

      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(
        err?.text || err?.message || 'Could not send the email receipt. Please verify your EmailJS setup in .env or try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleModalClose = () => {
    setCompletedOrder(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D1F17] via-stone-900 to-[#1A2E24] text-white px-6 py-5 flex items-center justify-between border-b border-[#C68537]/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C68537]/20 border border-[#C68537]/40 flex items-center justify-center text-[#C68537]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-white tracking-wide">
                {completedOrder ? 'Order Confirmed' : 'Checkout & Receipt Delivery'}
              </h2>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Direct tribal artisan support with automatic EmailJS receipt
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-stone-50">
          {completedOrder ? (
            /* Order Success View */
            <div className="max-w-2xl mx-auto py-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 ring-8 ring-emerald-50">
                <CheckCircle size={44} />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
                <Sparkles size={13} /> Order Placed Successfully
              </span>

              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-stone-900 mb-2">
                Thank you, {completedOrder.customer.name}!
              </h3>
              
              <p className="text-stone-600 text-sm max-w-lg mx-auto mb-6">
                Your order has been registered. An automated receipt has been generated and dispatched to the designated email address.
              </p>

              {/* Receipt Target Badge */}
              <div className="bg-white border border-[#C68537]/30 rounded-2xl p-5 mb-6 text-left shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#C68537] mt-0.5">
                    <Mail size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C68537]">
                      Email Receipt Destination
                    </div>
                    <div className="text-base font-bold text-stone-900 mt-0.5 break-all">
                      {completedOrder.recipient}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Customer notification also recorded for: <span className="font-medium text-stone-700">{completedOrder.customer.email}</span>
                    </p>
                  </div>
                </div>

                {completedOrder.isSimulated && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-amber-700 bg-amber-50/70 p-3 rounded-xl">
                    <Info size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <strong className="font-semibold">Simulated Email Delivery:</strong> EmailJS credentials are not yet set in <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code>. Once you add your Service ID, Template ID, and Public Key, real emails will be delivered instantly to this inbox.
                    </div>
                  </div>
                )}
              </div>

              {/* Order Details Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 text-left shadow-sm mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-4 text-xs">
                  <div>
                    <span className="text-stone-500">Order ID:</span>{' '}
                    <span className="font-mono font-bold text-stone-800">{completedOrder.orderId}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Date:</span>{' '}
                    <span className="font-medium text-stone-800">{completedOrder.date}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg bg-stone-100" 
                        />
                        <div>
                          <div className="font-medium text-stone-900">{item.name}</div>
                          <div className="text-xs text-stone-500">Qty: {item.quantity || 1} • {item.tribe || 'Craft'}</div>
                        </div>
                      </div>
                      <div className="font-semibold text-stone-900">
                        ₹{((parsePrice(item.discountPrice || item.price)) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Delivery Address</span>
                    <span className="font-medium text-stone-800 text-right max-w-xs">{completedOrder.customer.address}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Contact Phone</span>
                    <span className="font-medium text-stone-800">{completedOrder.customer.phone}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total Amount Paid</span>
                    <span className="text-[#C68537]">₹{completedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer size={16} /> Print Receipt
                </button>
                <button
                  onClick={handleModalClose}
                  className="px-8 py-3 rounded-xl bg-[#0D1F17] hover:bg-stone-800 text-white font-medium shadow-md transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Customer & Delivery Details */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-lg font-bold font-playfair text-stone-900 mb-1">
                    Customer & Delivery Information
                  </h3>
                  <p className="text-xs text-stone-500">
                    Provide delivery details for artisan shipment and receipt dispatch.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ananya Soren"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Customer Email *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="ananya@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Shipping / Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3 text-stone-400" />
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House / Street, Landmark, District, State"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                        required
                      />
                    </div>
                  </div>

                  {/* Pincode & Order Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="834001"
                        maxLength={6}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Special Instructions / Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="e.g. Call before delivery"
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C68537]/50 focus:border-[#C68537]"
                      />
                    </div>
                  </div>

                  {/* EmailJS Target Receipt Email Customization */}
                  <div className="p-4 bg-amber-50/70 border border-[#C68537]/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Mail size={14} className="text-[#C68537]" />
                        Automatic Receipt Destination Email
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowEmailConfigTip(!showEmailConfigTip)}
                        className="text-[11px] text-[#C68537] hover:underline flex items-center gap-1"
                      >
                        <Info size={12} /> {showEmailConfigTip ? 'Hide info' : 'How does this work?'}
                      </button>
                    </div>

                    <input
                      type="email"
                      name="targetEmail"
                      value={formData.targetEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. orders@yourdomain.com or admin@gmail.com"
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C68537]/50"
                    />

                    <p className="text-[11px] text-stone-500 mt-1.5">
                      This is the specific email inbox where the purchase receipt will be automatically delivered by EmailJS.
                    </p>

                    {showEmailConfigTip && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-[11px] text-stone-600 leading-relaxed space-y-1">
                        <p>
                          ✨ In EmailJS, configure your template's <strong>"To Email"</strong> field to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{"{{to_email}}"}</code> so every receipt routes automatically to this address.
                        </p>
                        <p>
                          💡 You can also set a default in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> via <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_EMAILJS_RECEIPT_EMAIL</code>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Placement */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-playfair font-bold text-stone-900 text-base">
                      Order Items ({totalItemsCount})
                    </h4>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium">
                      Artisan Direct
                    </span>
                  </div>

                  {/* Items scroll */}
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {items.length === 0 ? (
                      <p className="text-xs text-stone-500 py-4 text-center">No items selected.</p>
                    ) : (
                      items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate">{item.name}</h5>
                            <span className="text-[11px] text-[#C68537] font-semibold">
                              {item.discountPrice || item.price}
                            </span>
                            <span className="text-[11px] text-stone-400 ml-2">Qty: {item.quantity || 1}</span>
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            ₹{((parsePrice(item.discountPrice || item.price)) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Total calculation */}
                  <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Shipping & Packaging</span>
                      <span className="text-emerald-600 font-semibold">FREE (Subsidized)</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Payment Method</span>
                      <span className="text-stone-800 font-medium">Cash / UPI on Delivery</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                      <span>Total Amount</span>
                      <span className="text-xl text-[#C68537]">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 px-1">
                  <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>
                    EmailJS Status: {isConfigured ? 'Connected & Ready' : 'Development/Simulated (Keys pending in .env)'}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#0D1F17] hover:bg-[#C68537] text-white py-4 px-6 rounded-2xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching Receipt via EmailJS...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Confirm Order & Send Receipt (₹{totalAmount.toLocaleString('en-IN')})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
