import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface PayPalSubscriptionButtonProps {
  planId: string;
  planName: string;
  price: number;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: any) => void;
  disabled?: boolean;
}

const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planId,
  planName,
  price,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: planId,
      application_context: {
        brand_name: 'Maxy Electa Beats',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`
      }
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Send subscription data to your n8n webhook
      const response = await fetch('https://maxyelectazone.app.n8n.cloud/webhook-test/6d5c6048-7f93-4616-93dd-0e6b93f5ee49', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id: data.subscriptionID,
          plan_id: planId,
          plan_name: planName,
          price: price,
          payment_method: 'paypal',
          status: 'active',
          payer_id: data.payerID,
          order_id: data.orderID
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process subscription');
      }

      toast.success('PayPal subscription activated successfully!');
      onSuccess?.(data.subscriptionID);
      
      // Redirect to success page with subscription details
      window.location.href = `/success?subscription_id=${data.subscriptionID}&payment_method=paypal`;
    } catch (error) {
      console.error('PayPal subscription error:', error);
      toast.error('Failed to activate subscription. Please contact support.');
      onError?.(error);
    }
  };

  const onCancel = (data: any) => {
    console.log('PayPal subscription cancelled:', data);
    toast.error('PayPal subscription cancelled');
    window.location.href = '/cancel';
  };

  const onErrorHandler = (err: any) => {
    console.error('PayPal error:', err);
    toast.error('PayPal payment error occurred');
    onError?.(err);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="text-center py-4 text-red-600">
        Failed to load PayPal. Please try again.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <PayPalButtons
        createSubscription={createSubscription}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onErrorHandler}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'subscribe',
          height: 45
        }}
        disabled={disabled}
      />
    </motion.div>
  );
};

export default PayPalSubscriptionButton;