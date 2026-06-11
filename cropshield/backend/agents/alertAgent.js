import Alert from '../models/Alert.js';

const MESSAGES = {
  RED: (pestName) => `ತುರ್ತು ಎಚ್ಚರಿಕೆ. ನಿಮ್ಮ ಹತ್ತಿರ ${pestName} ರೋಗ ಪತ್ತೆಯಾಗಿದೆ. ತಕ್ಷಣ ನಿಮ್ಮ ಬೆಳೆ ಪರೀಕ್ಷಿಸಿ.`,
  ORANGE: (pestName) => `ಎಚ್ಚರಿಕೆ. ${pestName} ರೋಗ 48 ಗಂಟೆಗಳಲ್ಲಿ ತಲುಪಬಹುದು. ಬೆಳೆ ಪರೀಕ್ಷಿಸಿ.`,
  YELLOW: (pestName) => `ಮೇಲ್ವಿಚಾರಣೆ. ${pestName} ರೋಗ 72 ಗಂಟೆಗಳಲ್ಲಿ ತಲುಪಬಹುದು. ಜಾಗರೂಕರಾಗಿರಿ.`
};

async function saveAlertsForZone(farms, zone, pestName, diseaseName, severity, originFarmId) {
  const saved = [];
  for (const farm of farms) {
    const msg = MESSAGES[zone](pestName);
    const alert = new Alert({
      fromFarmId: originFarmId,
      toFarmId: farm.farmId,
      ownerName: farm.ownerName,
      pest: pestName,
      diseaseName,
      riskLevel: severity,
      zone,
      message: msg,
      language: farm.language || 'kannada',
      sentAt: new Date(),
      status: 'sent'
    });
    await alert.save();
    saved.push(msg);
  }
  return saved;
}

export async function sendAlerts(redZoneFarms, orangeZoneFarms, yellowZoneFarms, pestName, diseaseName, severity, originFarmId) {
  const redMessages = await saveAlertsForZone(redZoneFarms, 'RED', pestName, diseaseName, severity, originFarmId);
  const orangeMessages = await saveAlertsForZone(orangeZoneFarms, 'ORANGE', pestName, diseaseName, severity, originFarmId);
  const yellowMessages = await saveAlertsForZone(yellowZoneFarms, 'YELLOW', pestName, diseaseName, severity, originFarmId);

  const sampleAlert = redMessages[0] || orangeMessages[0] || yellowMessages[0] || MESSAGES.YELLOW(pestName);

  return {
    redZoneAlertsSent: redZoneFarms.length,
    orangeZoneAlertsSent: orangeZoneFarms.length,
    yellowZoneAlertsSent: yellowZoneFarms.length,
    totalAlertsSent: redZoneFarms.length + orangeZoneFarms.length + yellowZoneFarms.length,
    alertsSavedToMongoDB: true,
    sampleAlert
  };
}
