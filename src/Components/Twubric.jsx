import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AboutMe from "./AboutMe";

const Twubric = () => {
  const [sortedData, setSortedData] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState("");

  // Fetch data from the API
  const getData = async () => {
    const res = await fetch(
      "https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/82e3ef99cde5b6e313922a5ccce7f38e17f790ac/twubric.json"
    );
    const result = await res.json();
    setSortedData(result);
  };

  // Format timestamp to a readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle sorting logic
  const handleSort = useCallback((criterion) => {
     if (sortCriterion === criterion) {
       // Toggle sort order if the same criterion is clicked again
       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
     } else {
       // Set new sort criterion and default to ascending order
       setSortCriterion(criterion);
       setSortOrder("asc");
     }
  }, []);
   

  // Remove a user by filtering out the user with the given uid
  const removeUser = (uid) => {
    const newUsers = sortedData.filter((user) => user.uid !== uid);
    setSortedData(newUsers);
  };

  // Fetch data on component mount
  useEffect(() => {
    getData();
  }, []);

  // Effect to sort and filter data whenever sortCriterion, sortOrder, startDate, or endDate changes
  useEffect(() => {
    const sortAndFilterData = () => {
      let filteredData = [...sortedData];

      // Filter data based on date range
      if (startDate && endDate) {
        const startTimestamp = new Date(startDate).getTime() / 1000;
        const endTimestamp = new Date(endDate).getTime() / 1000;
        filteredData = filteredData.filter(
          (user) =>
            user.join_date >= startTimestamp && user.join_date <= endTimestamp
        );
      }

      // Sort data based on the selected criterion and order
      if (sortCriterion) {
        filteredData.sort((a, b) => {
          if (a.twubric[sortCriterion] < b.twubric[sortCriterion])
            return sortOrder === "asc" ? -1 : 1;
          if (a.twubric[sortCriterion] > b.twubric[sortCriterion])
            return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }
      return filteredData;
    };

    setSortedData(sortAndFilterData());
    setLoading(false);
  }, [sortCriterion, sortOrder, startDate, endDate]);

  // Handle keydown event for filter
  useEffect(() => {
    const handleKeyDown = (event) => {
        event.preventDefault();
      if (event.ctrlKey && (event.key === "b" || event.key === "B")) {
        handleSort("total");
      }
      if (event.ctrlKey && (event.key === "f" || event.key === 'F')) {
        handleSort("friends"); 
      }
      if (event.ctrlKey && (event.key === "I" || event.key === "i")) {
        handleSort("influence");
      }
      if (event.ctrlKey && (event.key === "H" || event.key === "h")) {
        handleSort("chirpiness");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSort]);
  return (
    <div>
        <AboutMe />
      <div className="pt-10 flex justify-center items-center">
        <div className="flex flex-col gap-4">
          {/* Sorting options */}
          <div className="font-sans font-medium">Sort By</div>
          <div className="flex mb-6 border border-[#5263ff] rounded-lg">
            <div
              onClick={() => handleSort("total")}
              className={`py-4 cursor-pointer rounded-tl-md rounded-bl-md ${
                sortCriterion === "total" ? "bg-[#5263ff]" : ""
              } hover:bg-[#5263ff] text-center w-[80px] sm:w-[150px] px-4 border-r-[1px] border-r-[#5263ff]`}
            >
              Twubric Score{" "}
              {sortCriterion === "total" && (sortOrder === "asc" ? "↑" : "↓")}
            </div>
            <div
              onClick={() => handleSort("friends")}
              className={`py-4 cursor-pointer ${
                sortCriterion === "friends" ? "bg-[#5263ff]" : ""
              } hover:bg-[#5263ff] px-4 text-center w-[80px] sm:w-[150px] border-r-[2px] border-r-[#5263ff]`}
            >
              Friends{" "}
              {sortCriterion === "friends" && (sortOrder === "asc" ? "↑" : "↓")}
            </div>
            <div
              onClick={() => handleSort("influence")}
              className={`py-4 cursor-pointer ${
                sortCriterion === "influence" ? "bg-[#5263ff]" : ""
              } hover:bg-[#5263ff] text-center w-[80px] sm:w-[150px] px-4 border-r-[2px] border-r-[#5263ff]`}
            >
              Influence{" "}
              {sortCriterion === "influence" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </div>
            <div
              onClick={() => handleSort("chirpiness")}
              className={`py-4 cursor-pointer rounded-tr-md rounded-br-md ${
                sortCriterion === "chirpiness" ? "bg-[#5263ff]" : ""
              } hover:bg-[#5263ff] w-[80px] sm:w-[150px] text-center px-4 `}
            >
              Chirpiness{" "}
              {sortCriterion === "chirpiness" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </div>
          </div>
        </div>
      </div>
      {/* Date range filter */}
      <div className="flex mt-10 mb-6 flex-col justify-center items-center">
        <div className="flex relative border border-[#5263ff] rounded-lg">
          <div className="font-sans font-medium absolute -top-10 left-0 ">
            Joined Twitter between
          </div>
          <label className="flex pb-2  border-r-[1px] py-1 px-4 border-r-[#5263ff] flex-col gap-2">
            Start Date:
            <input
              type="date"
              className="text-black px-4 py-2 bg-[#f0f0f0] rounded-lg w-[180px] sm:w-[270px]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className="flex  pb-2 px-4 py-1 flex-col gap-2">
            End Date:
            <input
              type="date"
              className="text-black px-4 py-2 bg-[#f0f0f0] rounded-lg w-[180px] sm:w-[270px]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Display sorted and filtered data or loading state */}
      {loading === false ? (
        <div className="md:grid md:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedData.map((ele, index) => {
            console.log(ele, index);
            return (
              <motion.div
                key={index}
                className="w-[361px] mt-4 p-6 group mx-auto hover:border-[#5263FF] hover:border-[3px] hover:cursor-pointer rounded-[30px] h-[300px]  gap-4 border-[1px] border-[#5263FF70] "
                whileHover={{
                  scale: 1.05,
                  translateY: -10,
                  background:
                    "linear-gradient(45deg, #1E2242 90%, #5263FF 100%)",
                  transition: { duration: 0.5 },
                }}
                style={{
                  background:
                    "linear-gradient(45deg, #040617 85%, #5263FF 100%)",
                }}
              >
                <div className="flex  justify-between">
                  <img src={ele.image} alt="" className="rounded-full" />
                  <div className="flex gap-6 flex-col">
                    <div
                      className="cursor-pointer font-sans font-medium hover:text-[#e44a4a]"
                      onClick={() => removeUser(ele.uid)}
                    >
                      Remove
                    </div>
                    <div className="font-mono font-medium text-[16px]">
                      {formatDate(ele.join_date)}
                    </div>
                  </div>
                </div>
                <div className="flex py-2 justify-between">
                  <div className="font-serif">{ele.fullname}</div>
                  <div className="font-sans">
                    Twubric :- {ele.twubric.total}
                  </div>
                </div>
                <div className="border-b-2 mt-2 border-b-[#5263ff]"></div>
                <div className="flex gap-4 pt-4 justify-between">
                  <div className="flex gap-1 flex-col">
                    <div className="text-center">{ele.twubric?.friends}</div>
                    <div className="font-sans">Freiends</div>
                  </div>
                  <div className="flex gap-1 flex-col">
                    <div className="text-center">{ele.twubric.influence}</div>
                    <div className="font-sans">influence</div>
                  </div>
                  <div className="flex gap-1 flex-col">
                    <div className="text-center">{ele.twubric.chirpiness}</div>
                    <div className="font-sans">Chirpiness</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Twubric;
