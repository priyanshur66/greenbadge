import Navbar from "./Navbar";
import "./NFTpage.css";
import axie from "../tile.jpeg";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token
    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);
  if (typeof data.image == "string")
    data.image = GetIpfsUrlFromPinata(data.image);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20 mb-10">
        <img
          src={data.image}
          alt=""
          className="w-2/5 nft_img mt-2 rounded-2xl border border-gray-100 dark:border-gray-700"
        />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>
            Name:{" "}
            <span className="text-l font-extrabold font-serif">
              {data.name}
            </span>
          </div>
          <div>
            Description:{" "}
            <span className="text-l font-extrabold font-serif">
              {data.description}
            </span>
          </div>
          <div>
            Price:{" "}
            <span className="text-l font-extrabold font-serif">
              {data.price + " ETH"}
            </span>
          </div>
          <div>
            Owner:{" "}
            <span className="text-l font-bold font-mono">{data.owner}</span>
          </div>
          <div>
            Seller:{" "}
            <span className="text-l font-bold font-mono">{data.seller}</span>
          </div>

          <div>
            {currAddress != data.owner && currAddress != data.seller ? (
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-20 rounded-full text-l mt-24"
                onClick={() => buyNFT(tokenId)}
              >
                Own This Badge
              </button>
            ) : (
              <div class="flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border border-emerald-500 cursor-pointer rounded-xl">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-emerald-500 sm:h-9 sm:w-9"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <div class="flex flex-col items-center mx-5 space-y-1">
                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
                      You have donated For This Proposal
                    </h2>
                  </div>
                </div>
              </div>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
