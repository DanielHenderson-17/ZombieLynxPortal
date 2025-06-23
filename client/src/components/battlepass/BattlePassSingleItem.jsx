export default function BattlePassSingleItem({ reward }) {
  if (!reward) return null;

  return (
    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
      <img
        src={reward.img}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className="w-75 h-auto mb-3"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
