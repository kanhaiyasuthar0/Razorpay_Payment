import { useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [amount, setAmount] = useState("");

  function loadRazorpay() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      alert("Razorpay load failed");
    };

    script.onload = async () => {
      let val = amount;
      try {
        // console.log(val);
        // console.log(amount);
        const result = await axios.post(
          "https://razorpaypayment.herokuapp.com/create-order",
          {
            amount: val + "00",
          }
        );

        const { amount, id: order_id, currency } = result.data;

        const options = {
          key: "rzp_test_rEPq0VmasV0z3t",
          amount: amount.toString(),
          currency: currency,
          name: "kanhaiya",
          description: "expalme desc",
          order_id: order_id,
          handler: async function (response) {
            console.log("response", response);
            const result = await axios.post(
              "https://razorpaypayment.herokuapp.com/pay-order",
              {
                amount: amount,
                razorpayPaymendId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }
            );
            alert("Payment is successfull");
          },
          prefill: {
            // name: "Kanhaiya",
            // email: "emial@email.com",
            // contact: "8976879231",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.log("error occured");
      }
    };
    // console.log("completed");
    document.body.appendChild(script);
  }
  return (
    <div className="App">
      <input
        type="number"
        placeholder="Amount in INR"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <button onClick={loadRazorpay}>CheckOut</button>
      {/* <button onClick={handle}>submit</button> */}
    </div>
  );
}

export default App;
