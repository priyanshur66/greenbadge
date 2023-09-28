import Footer from "./Footer";
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import Land from "./land";
import "./marketplace.css";
export default function Marketplace() {
  const sampleData = [];

  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
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
    //create an NFT Token
    let transaction = await contract.getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar></Navbar>
      <div>
        <Land />
      </div>
      <div class="bg-green-400 border-2 flex justify-center p-2 font-extrabold rounded-1/2 rounded-tl-md rounded-br-md text-3xl mr-2 ml-2 hover:shadow-2xl cursor-pointer font-serif" id="ui">" Our Misson : Click Here "</div>
      <div className="flex flex-col place-items-center mt-10">
        <div className="md:text-5xl font-bold text-white mb-3 ul">Current Proposal</div>
        <div className="md:text-2xl font-bold text-white font-serif"> Click Them To Explore More ! </div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>

      <div className="bg-yellow-400 w-full ">
          <h3 className="text-4xl font-bold mb-2 ml-16 mt-5">For Users</h3>
          <p className="text-2xl p-5 mr-10 ml-10 font-roboto mt-8 ">Our platform is designed with users like you in mind. By becoming part of our community, you have the chance to play a significant role in shaping a sustainable and better future for our planet. Your contributions to NGOs working tirelessly on critical environmental and social causes are made more rewarding with the issuance of NFTs as proof of support. <br /> <br /> These NFTs not only symbolize your commitment but also unlock tangible benefits in the form of extra cashback or personalized loyalty rewards at collaborating brands. You become an active participant in the global movement toward a more eco-conscious world, knowing that your support has a real and measurable impact.</p>
      </div>

      <div className="bg-fuchsia-400 w-full ">
          <h3 className="text-4xl font-bold mb-2 ml-16">For Business</h3>
          <p className="text-2xl p-5 mr-10 ml-10 font-roboto mt-8">Incorporate sustainability into the core of your brand with our platform. By collaborating with us, your business can offset its carbon footprint and embrace eco-friendly practices with guidance from experienced NGOs. This not only aligns with the growing global push for environmental responsibility but also enhances your brand's reputation and appeal. <br /> <br /> Our transparent and verifiable processes ensure that your commitment to sustainability is visible to your customers and stakeholders, fostering trust and loyalty. Furthermore, our platform facilitates rewarding your customers with enticing benefits such as cashback and customized loyalty rewards, reinforcing your brand's positive image and creating a win-win relationship.
</p>
      </div>

      <div className="bg-green-400  w-full ">
          <h3 className="text-4xl font-bold mb-2 ml-16">About NGO</h3>
          <p className="text-2xl p-5 mr-10 ml-10 font-roboto mt-8">Our platform offers NGOs like yours a powerful avenue to amplify your impact on pressing global issues. By joining our ecosystem, you gain access to a vast network of donors and forward-thinking brands that share your vision for a sustainable future. This collaboration goes beyond financial support; it allows you to share your expertise in sustainability with businesses eager to embrace eco-friendly practices. <br /> <br /> With our transparent and verifiable operations, you can focus on your mission while donors receive NFT-based proof of their support, enhancing their trust and satisfaction. Together with businesses, you form mutually beneficial partnerships that drive change, making a meaningful difference in the world.</p>
      </div>
      <Footer />
    </div>
  );
}
