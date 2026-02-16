export function resolvePrices(listing) {
  const reg = Number(listing?.regularPrice || 0);
  const disc = Number(listing?.discountedPrice || 0);

  let originalPrice = reg;
  let finalPrice = reg;

  if (listing?.offer) {
    // Normal case: discountedPrice is the lower final price.
    if (disc > 0 && disc <= reg) {
      originalPrice = reg;
      finalPrice = disc;
    } else if (disc > reg) {
      // Inverted values detected: discountedPrice actually holds the original price
      originalPrice = disc;
      finalPrice = reg;
    } else {
      // No valid discounted value provided — fall back to regular
      originalPrice = reg;
      finalPrice = reg;
    }
  } else {
    originalPrice = reg;
    finalPrice = reg;
  }

  const discountAmount = Math.max(0, originalPrice - finalPrice);
  return { finalPrice, originalPrice, discountAmount };
}

export default resolvePrices;
