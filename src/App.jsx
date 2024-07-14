import Twubric from "./Components/Twubric";

function App() {
  return (
    <>
      <div className="flex py-10 flex-col justify-center items-center">
        <div className="text-[24px] font-sans">
          ExhiByte Solution Frontend Assignment: <span className="text-[#5263ff]">Twubric!</span>{" "}
        </div>
        <Twubric />
      </div>
    </>
  );
}

export default App;
