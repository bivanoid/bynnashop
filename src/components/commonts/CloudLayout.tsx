import CloudSvg from "../../assets/svg/topcloud2.svg?react";

interface props {
  top?: string;
}

export default function CloudLayout({top}: props) {
  return (
    <div
      style={{
        left: "0",
        top: top
      }}

      className="cloud"
    >
      <CloudSvg />
    </div>
  );
}
