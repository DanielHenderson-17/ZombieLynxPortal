import "../assets/styles/Footer.css";

export default function Footer() {
  return (
    <div className="d-flex justify-content-center text-white p-3 footer">
      <a
        href="/privacy-policy"
        className="mx-2 text-decoration-none text-white"
      >
        Privacy Policy
      </a>
      <a href="/zlg-rules" className="mx-5 text-decoration-none text-white">
        Rules
      </a>
    </div>
  );
}
