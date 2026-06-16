export default function Background() {
  return (
    <>
      {/* Top-right blob — rose pink */}
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          background: "rgba(225,29,72,0.10)",
          top: -160,
          right: -100,
          animationDelay: "0s",
        }}
      />
      {/* Bottom-left blob — soft rose */}
      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          background: "rgba(251,113,133,0.10)",
          bottom: -100,
          left: -80,
          animationDelay: "-5s",
        }}
      />
      {/* Center blob — blush */}
      <div
        className="blob"
        style={{
          width: 280,
          height: 280,
          background: "rgba(253,164,175,0.09)",
          top: "42%",
          left: "38%",
          animationDelay: "-10s",
        }}
      />
    </>
  );
}