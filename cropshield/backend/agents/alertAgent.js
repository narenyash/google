export async function alertAgent({ pest, village = 'Rampur' }) {
  return {
    sent: 18,
    channels: ['SMS', 'WhatsApp', 'Village dashboard'],
    message: `${pest} risk detected near ${village}. Inspect crops and follow CropShield guidance.`
  };
}
