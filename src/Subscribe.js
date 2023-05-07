import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@aws-amplify/ui-react';
export default function Subscribe ({plan, comingSoon}) {
    const handleSubscribe = async e => {
        let price_key;
        switch (parseInt(plan)) {
            case 1:
                // Advanced plan
                price_key = 'price_1N4URcJlwbqaAWHszIj27NsN';
                break;
            default:
                // Standard plan
                price_key = 'price_1N4UQeJlwbqaAWHsh9gJhF6v';
                break;
        }
        const stripe = await loadStripe('pk_test_51KtYPUJlwbqaAWHsXdJc7kAIYQIqpFgi0hdecopXGCOoMxCQSW90w7UrzSx0LIrtTRNKuQXRhJ4yHqa9f6HA0xTl00usLrEtJX')
        const baseUrl = window.location.protocol + '//' + window.location.host + '/';
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: price_key,
                quantity: 1
            }],
            mode: 'subscription',
            successUrl: baseUrl + 'restaurant-setup',
            cancelUrl: baseUrl + 'sign-up',
        })
    }

    return <Button className="orderButton" onClick={handleSubscribe} disabled={comingSoon}>{comingSoon ? 'Coming Soon' : 'Subscribe'}</Button>
}
