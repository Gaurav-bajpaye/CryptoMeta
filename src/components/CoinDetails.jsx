import React from "react";
import { useEffect, useState } from "react";
import { Baseurl } from "./baseUrl";
import Loader from "./Loader";
import axios from "axios";
import { useParams } from "react-router-dom";
// import coinImage from '../coin.png'
import "./coinDetail.css";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { IoPulseOutline } from "react-icons/io5";
import CoinChart from "./CoinChart";

function formatISODate(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

const CoinDetails = () => {
  const [coin, setCoin] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [currency, setCurrency] = useState("inr");
  const currencySymbol = currency === "inr" ? "₹" : "$";
  const profit = coin.market_data?.price_change_percentage_24h > 0;
  useEffect(() => {
    const getCoin = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}/coins/${id}`);
        //  console.log(data)
        setCoin(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getCoin();
  }, [id]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className=" coin-detail">
            <div className="coin-info">
              <div className="btn">
                <button onClick={() => setCurrency("inr")}>inr</button>
                <button onClick={() => setCurrency("usd")}>usd</button>
              </div>
              <div className="time">{formatISODate(coin.last_updated)}</div>
              <div className="coin-image">
                <img height={"150px"} src={coin.image.large} alt="" />
              </div>
              <div className="coin-name">{coin.name}</div>
              <div className="coin-price">
                {currencySymbol} {coin.market_data.current_price[currency]}
              </div>
              <div className="coin-profit">
                {profit ? (
                  <BiSolidUpArrow color="green" />
                ) : (
                  <BiSolidDownArrow color="red" />
                )}
                {coin.market_data.price_change_percentage_24h} %
              </div>
              <div className="market-rank">
                <IoPulseOutline color="orange" />#{coin.market_cap_rank}
              </div>
              <div className="coin-desc">
                <p> {coin.description["en"].split(".")[0]} </p>
              </div>
            </div>
            <CoinChart currency={currency} />
          </div>
        </>
      )}
    </>
  );
};

export default CoinDetails;
