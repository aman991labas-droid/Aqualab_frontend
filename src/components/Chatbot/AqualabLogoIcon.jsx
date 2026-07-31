/** Cropped Aqualab symbol from /images/logo.png — for small circular UI slots. */
export default function AqualabLogoIcon({ className, alt = '' }) {
  return (
    <img
      src="/images/logo-icon.png"
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}
