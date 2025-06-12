import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { generateSaleId, generateUniqueId } from '../utils/sessionUtils';
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
      // Generate unique identifiers for tracking
      const saleId = generateSaleId(11); // e.g., "45223596136"
      const actionId = generateUniqueId('subscription'); // e.g., "subscription_1703123456789_abc12345"
      
      // Create Basic Auth header
      const credentials = btoa('WBK5Pwbk5p:174747m3dWBK5P');

      // Send subscription data to your n8n webhook for processing (PRODUCTION URL)
      const response = await fetch('https://maxyelectazone.app.n8n.cloud/webhook/6d5c6048-7f93-4616-93dd-0e6b93f5ee49', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          // Unique tracking identifiers
          saleId: saleId,
          actionId: actionId,
          actionType: 'paypal_subscription',
          
          // PayPal data
          subscription_id: data.subscriptionID,
          plan_id: planId,
          plan_name: planName,
          price: price,
          payment_method: 'paypal',
          status: 'active',
          payer_id: data.payerID,
          order_id: data.orderID,
          
          // Metadata
          timestamp: new Date().toISOString(),
          source: 'maxy_electa_website'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process subscription');
      }

      // Send welcome email notification to the CHECKOUT.ORDER.COMPLETED webhook
      try {
        await fetch('https://maxyelectazone.app.n8n.cloud/webhook/30ed453d-708a-4015-b94c-0d92c29ad215', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify({
            // Unique tracking identifiers
            saleId: saleId,
            actionId: generateUniqueId('welcome_email'),
            actionType: 'checkout_order_completed',
            
            // Order completion data
            subscription_id: data.subscriptionID,
            plan_id: planId,
            plan_name: planName,
            price: price,
            payment_method: 'paypal',
            status: 'completed',
            payer_id: data.payerID,
            order_id: data.orderID,
            
            // Email trigger data
            email_type: 'welcome_subscription',
            customer_email: data.payerEmail || '', // PayPal should provide this
            customer_name: data.payerName || '', // PayPal should provide this
            
            // Metadata
            timestamp: new Date().toISOString(),
            source: 'maxy_electa_website',
            event_type: 'CHECKOUT.ORDER.COMPLETED'
          })
        });
        
        console.log('Welcome email webhook triggered successfully');
      } catch (emailError) {
        console.warn('Welcome email webhook failed, but subscription was successful:', emailError);
        // Don't fail the entire process if email fails
      }

      console.log('PayPal subscription processed with tracking IDs:', { saleId, actionId, subscriptionId: data.subscriptionID });

      toast.success('PayPal subscription activated successfully!');
      onSuccess?.(data.subscriptionID);
      
      // Redirect to success page with subscription details
      window.location.href = `/success?subscription_id=${data.subscriptionID}&payment_method=paypal&sale_id=${saleId}`;
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