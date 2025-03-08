
import { showAlert } from './alerts.js';



export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/booking/checkout-session/${tourId}`,
      withCredentials: true,
    });

    console.log('Session:', session.data); // Debug line

    if (!session.data.session.id) {
      throw new Error('No session ID received from the server');
    }

    // 2) Create checkout form + charge credit card
    const stripe = Stripe(process.env.STRIPE_PUBLICKEY); 

    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id, 
    });

    if (result.error) {
      showAlert('error', result.error.message);
    }
  } catch (err) {
    console.error('Stripe error:', err);
    showAlert('error', err.message);
  }
};
