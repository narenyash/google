import { Camera, CloudUpload } from 'lucide-react';

export default function UploadScreen() {
  return (
    <section className="screen two-column">
      <div>
        <p className="eyebrow">Screen 1</p>
        <h2>Upload crop photo</h2>
        <p className="lede">
          Farmer captures a leaf or fruit image from the affected area. CropShield prepares it for agent analysis.
        </p>
        <div className="upload-drop">
          <CloudUpload size={36} />
          <span>Drop image here or tap to upload</span>
        </div>
      </div>
      <div className="phone-frame">
        <Camera size={42} />
        <span>Field camera preview</span>
      </div>
    </section>
  );
}
