"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { fetchAddresses, type Address } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';

export default function AddressPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const ar = locale === 'ar';
  const { address, setAddress } = useCheckout();
  const { token, isAuthenticated } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

  // Form fields — pre-filled from context if user navigated back
  const [fullName, setFullName] = useState(address?.fullName || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [addressLine, setAddressLine] = useState(address?.address || '');
  const [wilaya, setWilaya] = useState(address?.wilaya || '');
  const [commune, setCommune] = useState(address?.commune || '');

  // Load saved addresses for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchAddresses(token).then((addrs) => {
      setSavedAddresses(addrs);
      // Auto-select default address if form is empty
      if (!address && addrs.length > 0) {
        const def = addrs.find((a) => a.isDefault) ?? addrs[0];
        applyAddress(def);
        setSelectedSavedId(def.id);
      }
    });
  }, [isAuthenticated, token]);

  const applyAddress = (addr: Address) => {
    setFullName(addr.fullName);
    setPhone(addr.phoneNumber);
    setAddressLine(addr.addressLine1);
    setWilaya(addr.wilaya);
    setCommune(addr.commune);
  };

  const handleSelectSaved = (addr: Address) => {
    setSelectedSavedId(addr.id);
    applyAddress(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress({ fullName, phone, address: addressLine, wilaya, commune });
    router.push(`/${locale}/checkout/delivery`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CheckoutProgress currentStep={1} locale={locale as 'fr' | 'ar'} />

      {/* Saved addresses picker */}
      {savedAddresses.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {ar ? 'عناويني المحفوظة' : 'Mes adresses enregistrées'}
          </p>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => handleSelectSaved(addr)}
                className={`w-full text-start p-3 rounded-xl border-2 transition-colors flex items-start gap-3 ${
                  selectedSavedId === addr.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${selectedSavedId === addr.id ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{addr.fullName}</span>
                    {addr.isDefault && <Star className="h-3 w-3 text-yellow-500 fill-yellow-400" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{addr.addressLine1}, {addr.commune}, {addr.wilaya}</p>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setSelectedSavedId(null); setFullName(''); setPhone(''); setAddressLine(''); setWilaya(''); setCommune(''); }}
              className={`w-full text-start p-3 rounded-xl border-2 transition-colors text-sm text-gray-600 ${
                selectedSavedId === null && !fullName ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 hover:border-gray-400'
              }`}
            >
              + {ar ? 'عنوان جديد' : 'Nouvelle adresse'}
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{ar ? 'عنوان التوصيل' : 'Adresse de livraison'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{ar ? 'الاسم الكامل' : 'Nom complet'}</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{ar ? 'الهاتف' : 'Téléphone'}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213555123456" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{ar ? 'العنوان' : 'Adresse'}</Label>
              <Input id="address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wilaya">{ar ? 'الولاية' : 'Wilaya'}</Label>
                <Input id="wilaya" value={wilaya} onChange={(e) => setWilaya(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commune">{ar ? 'البلدية' : 'Commune'}</Label>
                <Input id="commune" value={commune} onChange={(e) => setCommune(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {ar ? 'متابعة' : 'Continuer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
