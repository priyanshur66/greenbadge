import axie from "../tile.jpeg";
import "./NFTTile.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };

  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo}>
      <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl tile">
        <img
          src={IPFSUrl}
          alt=""
          className="w-72 h-80 rounded-lg object-cover"
          crossOrigin="anonymous"
        />
        <div className="text-white w-full p-2 rounded-lg pt-5  tile-text">
          <div className="cjj">
            <strong className="text-xl">{data.data.name}</strong>
            <p className="display-inline">{data.data.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
