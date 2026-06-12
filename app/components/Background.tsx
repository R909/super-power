export default function Background() {
  return (
    <>
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          background: "rgba(244,114,182,0.12)",
          top: -160,
          right: -100,
          animationDelay: "0s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          background: "rgba(167,139,250,0.12)",
          bottom: -100,
          left: -80,
          animationDelay: "-5s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 280,
          height: 280,
          background: "rgba(52,211,153,0.1)",
          top: "42%",
          left: "38%",
          animationDelay: "-10s",
        }}
      />
    </>
  );
}
