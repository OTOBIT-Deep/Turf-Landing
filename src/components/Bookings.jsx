import React, { useState, useEffect, useCallback, useContext } from "react";
import classnames from "classnames";
import axios from "axios";
import { BiCalendarWeek } from "react-icons/bi";
import { toast } from "react-toastify";
import styles from "../css/Bookings.module.css";
import GroundImage from "../images/ground.png";
import GroundImageSelected from "../images/ground_selected.png";
import api from "../config/api";
import headerWithoutToken from "../config/headerWithoutToken";
import { Context } from "../data/context";
import SlotItems from "./SlotItems";
import {
  convertMinsToHrsMins,
  getMaxAllowedMonth,
} from "../utils/TimeConverter";
import { Link } from "react-router-dom";
import { filterData } from "../utils/filterData";

const Bookings = () => {
  const {
    setGroundData,
    totalTime,
    bookDate,
    setBookDate,
    setCartId,
    setPhoneNumber,
    setCartData,
  } = useContext(Context);

  const [isGroundSelected1, setIsGroundSelected1] = useState(true);
  const [isGroundSelected2, setIsGroundSelected2] = useState(false);
  const [isGroundSelected3, setIsGroundSelected3] = useState(false);
  const [maxAllowedDate, setMaxAllowedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleFetchedData = useCallback(
    (res) => {
      if (res.data.success) {
        if (res.data.body) {
          if (res.data.body.selectedSlots.length) {
            const [sortedData] = filterData(res.data.body);
            setCartData(sortedData);
          }
        }
      }
    },
    [setCartData]
  );

  const fetchCartData = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("turfUserDetails"));
    const cartLocalId = localStorage.getItem("turfCart");

    setCartId(() => (cartLocalId ? cartLocalId : null));

    setPhoneNumber(() =>
      data?.user?.phoneNumber ? data.user.phoneNumber : null
    );

    // if (data === null && cartLocalId === null) {
    //   setCartId(null);
    // } else if (data === null && cartLocalId != null) {
    //   setCartId(cartLocalId);
    // } else {
    //   setPhoneNumber(data.user.phoneNumber);
    // }

    if (data === null) {
      axios
        .get(api + "user/cart?cartId=" + cartLocalId, headerWithoutToken)
        .then((res) => {
          handleFetchedData(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          api + "user/cart?phoneNumber=" + data.user.phoneNumber,
          headerWithoutToken
        )
        .then((res) => {
          handleFetchedData(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [handleFetchedData, setCartId, setPhoneNumber]);

  const markSelectedCard = useCallback(
    (groundDataNew) => {
      if (groundDataNew.turf01) {
        groundDataNew.turf01.forEach((item) => {
          item.id = `${item.startTime}_g1_${item.date}`;
        });
      }
      if (groundDataNew.turf02) {
        groundDataNew.turf02.forEach((item) => {
          item.id = `${item.startTime}_g2_${item.date}`;
        });
      }
      if (groundDataNew.turf03) {
        groundDataNew.turf03.forEach((item) => {
          item.id = `${item.startTime}_g3_${item.date}`;
        });
      }

      setGroundData(groundDataNew);
    },
    [setGroundData]
  );

  const getAllSlotsByDateTime = useCallback(() => {
    const groundList = [];

    if (isGroundSelected1) {
      groundList.push("turf01");
    }
    if (isGroundSelected2) {
      groundList.push("turf02");
    }
    if (isGroundSelected3) {
      groundList.push("turf03");
    }
    const postData = {
      turfIds: [...groundList],
      date: bookDate,
      openTime: "2020-12-24T08:00:00.000Z",
      closeTime: "2020-12-24T16:00:10.000Z",
      slotDuration: 30,
    };
    axios
      .post(api + "user/get-all-slots-by-date", postData, headerWithoutToken)
      .then((res) => {
        const responseData = res.data.body;
        console.log("Get All Slots by Date ", responseData);
        if (responseData) {
          markSelectedCard(responseData);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error.message);
      });
  }, [
    isGroundSelected1,
    isGroundSelected2,
    isGroundSelected3,
    bookDate,
    markSelectedCard,
  ]);

  const setUserData = useCallback(() => {
    const turfcartId = localStorage.getItem("turfCart");
    const data = JSON.parse(localStorage.getItem("turfUserDetails"));

    setCartId(() => (turfcartId ? turfcartId : null));
    setPhoneNumber(() =>
      data?.user?.phoneNumber ? data?.user?.phoneNumber : null
    );
  }, [setCartId, setPhoneNumber]);

  useEffect(() => {
    getMaxAllowedMonth(setMaxAllowedDate);
    setUserData();
    getAllSlotsByDateTime();
    fetchCartData();
  }, [getAllSlotsByDateTime, fetchCartData, setUserData]);

  return (
    <div className={classnames("container is-fluid")}>
      <div className={classnames("columns", styles.columnsWrapper)}>
        <div className={classnames("column box", styles.addGroundBackground)}>
          <figure
            className="image"
            onClick={() => {
              setIsGroundSelected1(!isGroundSelected1);
            }}
          >
            {isGroundSelected1 ? (
              <img
                src={GroundImageSelected}
                alt="Ground 1"
                className={styles.GroundImage}
              />
            ) : (
              <img
                src={GroundImage}
                alt="Ground 1"
                className={styles.GroundImage}
              />
            )}
          </figure>

          <figure
            className="image"
            onClick={() => {
              setIsGroundSelected2(!isGroundSelected2);
            }}
          >
            {isGroundSelected2 ? (
              <img
                src={GroundImageSelected}
                alt="Ground 2"
                className={styles.GroundImage}
              />
            ) : (
              <img
                src={GroundImage}
                alt="Ground 2"
                className={styles.GroundImage}
              />
            )}
          </figure>

          <figure
            className="image"
            onClick={() => {
              setIsGroundSelected3(!isGroundSelected3);
            }}
          >
            {isGroundSelected3 ? (
              <img
                src={GroundImageSelected}
                alt="Ground 3"
                className={styles.GroundImage}
              />
            ) : (
              <img
                src={GroundImage}
                alt="Ground 3"
                className={styles.GroundImage}
              />
            )}
          </figure>
        </div>

        <div
          className={classnames(
            "column box is-two-thirds",
            styles.addMinHeight,
            styles.addBookingBackground
          )}
        >
          <div className={classnames(styles.timeBarWrapper)}>
            <div style={{ display: "flex" }} className={styles.dateWrapper}>
              <BiCalendarWeek size={40} color="#FFF" className="mx-3" />
              <div className="control has-icons-right">
                <input
                  className="input"
                  type="date"
                  placeholder="Pick Date"
                  value={bookDate}
                  min={new Date().toISOString().slice(0, 10)}
                  max={maxAllowedDate}
                  onChange={(event) => {
                    setBookDate(event.target.value);
                  }}
                />
                <span className="icon is-small is-right">
                  <BiCalendarWeek color="#000" />
                </span>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <BiCalendarWeek size={40} color="#FFF" className="mx-3" />
              <div className="control">
                <input
                  className="input "
                  type="time"
                  placeholder="Pick Start Time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>
              <div className="control">
                <input
                  className="input ml-3"
                  type="time"
                  placeholder="Pick End Time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={classnames(styles.slotsWrapper)}>
            <SlotItems />
          </div>
          <div className={classnames(styles.checkoutWrapper, "my-3")}>
            <div className={styles.timeBarWrapper}>
              <div style={{ display: "flex" }} className={styles.dateWrapper}>
                <div className="field">
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Total Hours"
                      readOnly
                      value={convertMinsToHrsMins(totalTime)}
                    />
                  </div>
                </div>
              </div>

              <Link to="/cart" className="button is-success is-light my-3">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
