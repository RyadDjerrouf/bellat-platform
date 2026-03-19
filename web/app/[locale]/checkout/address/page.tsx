"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/context/CheckoutContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { useParams } from 'next/navigation';

// This is the first step of the checkout: the delivery address form.
// It's a Client Component to handle form state and user interactions.
export default function AddressPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { address, setAddress } = useCheckout();

  // Form state is pre-filled with data from the context if it exists.
  // This allows users to go back and see their previously entered data.
  const [fullName, setFullName] = useState(address?.fullName || '');
  const [phone, setPhone] = useState(address?.phone || '');
  const [addressLine, setAddressLine] = useState(address?.address || '');
  const [wilaya, setWilaya] = useState(address?.wilaya || '');
  const [commune, setCommune] = useState(address?.commune || '');

  // This function handles the form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // As per the spec, no complex validation is needed for the prototype.
    const newAddress = { fullName, phone, address: addressLine, wilaya, commune };
    
    // Save the entered data to the shared checkout context.
    setAddress(newAddress);
    
    // Navigate the user to the next step in the checkout flow.
    router.push('/checkout/delivery');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CheckoutProgress currentStep={1} locale={locale as 'fr' | 'ar'} />
      
      <Card>
        <CardHeader>
          <CardTitle>Adresse de livraison</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Form Fields */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 ..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wilaya">Wilaya</Label>
                <Input id="wilaya" value={wilaya} onChange={(e) => setWilaya(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input id="commune" value={commune} onChange={(e) => setCommune(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Continuer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
