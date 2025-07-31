import crypto from 'crypto';

const verifyWebhookSignature = (rawBody, signature) => {
  try {
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('base64');
    return computedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
};

export { verifyWebhookSignature };
