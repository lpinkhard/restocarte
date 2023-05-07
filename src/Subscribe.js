import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@aws-amplify/ui-react';

export default function Subscribe ({plan, comingSoon}) {
    const handleSubscribe = async e => {
        let price_key;
        switch (parseInt(plan)) {
            case 1:
                // Advanced plan
                price_key = process.env.REACT_APP_STRIPE_PLAN_1;
                break;
            default:
                // Standard plan
                price_key = process.env.REACT_APP_STRIPE_PLAN_0;
                break;
        }
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PK);
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
