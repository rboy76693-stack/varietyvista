'use client';

import { useState } from 'react';
import { Save, Store, Bell, Shield, Truck, CreditCard, Mail, Globe } from 'lucide-react';

function SettingSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#1a1a1a', background: '#0f0f0f' }}>
        <Icon className="w-4 h-4" style={{ color: '#c8922a' }} />
        <h3 className="font-bold uppercase tracking-widest text-sm" style={{ color: '#f0ead6' }}>{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, id, type = 'text', defaultValue, hint }: { label: string; id: string; type?: string; defaultValue?: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>{label}</label>
      <input id={id} type={type} defaultValue={defaultValue}
        className="px-3 py-2.5 text-sm rounded-lg outline-none"
        style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
      />
      {hint && <p className="text-xs" style={{ color: '#3a3020' }}>{hint}</p>}
    </div>
  );
}

function Toggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium" style={{ color: '#f0ead6' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#4a4030' }}>{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ background: on ? '#c8922a' : '#2a2a2a' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full transition-transform"
          style={{ left: on ? '24px' : '4px', background: on ? '#0d0d0d' : '#4a4030' }}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#f0ead6', fontFamily: "'Playfair Display', serif" }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: '#4a4030' }}>Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all"
          style={{ background: saved ? '#4ade80' : 'linear-gradient(135deg, #f5d97a, #c8922a)', color: '#0d0d0d' }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Store Details */}
      <SettingSection title="Store Details" icon={Store}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Store Name" id="store_name" defaultValue="Variety Vista" />
          <Field label="Store Email" id="store_email" type="email" defaultValue="hello@varietyvista.in" />
          <Field label="Support Phone" id="store_phone" defaultValue="+91 98765 43210" />
          <Field label="GSTIN" id="gstin" defaultValue="27AABCV1234M1ZX" hint="For GST invoices" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Store Address</label>
          <textarea rows={2} defaultValue="29th Road, Bandra West, Mumbai, Maharashtra — 400050"
            className="px-3 py-2.5 text-sm rounded-lg outline-none resize-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
          />
        </div>
      </SettingSection>

      {/* Shipping */}
      <SettingSection title="Shipping & Delivery" icon={Truck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Free Shipping Threshold (₹)" id="free_shipping" defaultValue="999" hint="Orders above this amount get free shipping" />
          <Field label="COD Fee (₹)" id="cod_fee" defaultValue="99" hint="Extra charge for cash on delivery" />
          <Field label="Standard Delivery Days" id="delivery_days" defaultValue="5" />
          <Field label="Express Delivery Days" id="express_days" defaultValue="2" />
        </div>
        <div className="border-t pt-4 space-y-3" style={{ borderColor: '#1e1e1e' }}>
          <Toggle label="Enable Cash on Delivery" description="Allow COD as a payment option at checkout" defaultChecked />
          <Toggle label="Enable Express Delivery" description="Offer faster shipping at premium pricing" />
        </div>
      </SettingSection>

      {/* Payments */}
      <SettingSection title="Payment Gateway" icon={CreditCard}>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Razorpay Key ID" id="rzp_key" defaultValue="rzp_test_xxxxxxxxxxxxxxxx" hint="Found in your Razorpay dashboard" />
          <Field label="Razorpay Webhook Secret" id="rzp_webhook" type="password" defaultValue="••••••••••••••••" hint="Used to verify payment webhooks securely" />
        </div>
        <div className="border-t pt-4 space-y-3" style={{ borderColor: '#1e1e1e' }}>
          <Toggle label="Live Mode" description="Switch from test to live Razorpay keys" />
          <Toggle label="Auto-capture Payments" description="Capture payments automatically on order" defaultChecked />
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Notifications" icon={Bell}>
        <div className="space-y-3">
          <Toggle label="Order Confirmation SMS" description="Send SMS to customer when order is placed" defaultChecked />
          <Toggle label="Shipping Update SMS" description="Notify customer when order is shipped" defaultChecked />
          <Toggle label="Low Stock Alerts" description="Alert admin when product stock falls below 10" defaultChecked />
          <Toggle label="New Order Email" description="Email admin on every new order received" />
        </div>
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Email Configuration" icon={Mail}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="From Name" id="email_name" defaultValue="Variety Vista" />
          <Field label="From Email" id="email_from" defaultValue="orders@varietyvista.in" />
          <Field label="SMTP Host" id="smtp_host" defaultValue="smtp.resend.com" />
          <Field label="SMTP Port" id="smtp_port" defaultValue="587" />
        </div>
      </SettingSection>

      {/* SEO */}
      <SettingSection title="SEO & Meta" icon={Globe}>
        <Field label="Default Meta Title" id="meta_title" defaultValue="Variety Vista | Premium Denim & Streetwear" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6a5a40' }}>Default Meta Description</label>
          <textarea rows={2} defaultValue="Shop premium jeans and denim at Variety Vista. Curated fits for the Indian market — Baggy, Straight, Cargo Denim, and more."
            className="px-3 py-2.5 text-sm rounded-lg outline-none resize-none"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ead6' }}
          />
        </div>
        <Toggle label="Noindex Admin Pages" description="Prevent search engines from indexing /admin routes" defaultChecked />
      </SettingSection>

      {/* Security */}
      <SettingSection title="Security" icon={Shield}>
        <div className="space-y-3">
          <Toggle label="Two-Factor Authentication" description="Require 2FA for admin login" />
          <Toggle label="Force HTTPS" description="Redirect all HTTP traffic to HTTPS" defaultChecked />
          <Toggle label="Maintenance Mode" description="Show a maintenance page to customers" />
        </div>
        <div className="mt-2 p-3 rounded-lg" style={{ background: '#0d0d0d', border: '1px solid #1e1e1e' }}>
          <p className="text-xs font-bold" style={{ color: '#c8922a' }}>Danger Zone</p>
          <p className="text-xs mt-1 mb-3" style={{ color: '#3a3020' }}>These actions are irreversible. Proceed with caution.</p>
          <button className="px-4 py-2 text-xs font-bold rounded border" style={{ borderColor: '#f8717140', color: '#f87171', background: '#f8717110' }}>
            Clear All Cache
          </button>
        </div>
      </SettingSection>
    </div>
  );
}
