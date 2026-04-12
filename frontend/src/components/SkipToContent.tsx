/**
 * Skip-to-content link for keyboard / screen reader users.
 * Invisible until focused via Tab key.
 */
export default function SkipToContent() {
  return (
    <a href="#main-content" className="skip-to-content">
      Skip to main content
    </a>
  );
}
