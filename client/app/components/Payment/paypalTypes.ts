// paypalTypes.ts

// Interfaces pour les paramètres data et actions
export interface PayPalOrderData {
    // Ajoutez des propriétés spécifiques si nécessaire
  }
  
  export interface PayPalActions {
    order: {
      create: (options: { purchase_units: { amount: { value: string } }[] }) => Promise<string>;
      capture: () => Promise<any>;
    };
  }
  