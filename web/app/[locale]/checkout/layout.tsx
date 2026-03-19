import { CheckoutProvider } from '@/context/CheckoutContext';

// This is a layout component specifically for the /checkout route group.
// Its primary purpose is to wrap all checkout pages with the CheckoutProvider,
// so they can share state (address, delivery slot, etc.).
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckoutProvider>
      <div className="container mx-auto px-4 py-8">
        {/* A progress bar could go here in the future to show checkout steps */}
        {/* e.g., <CheckoutProgress currentStep={1} /> */}
        <main>{children}</main>
      </div>
    </CheckoutProvider>
  );
}
