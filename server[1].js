import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-order", async (req, res) => {
  try {
    const { amount, donorName, donorPhone, donorEmail } = req.body;

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: "DONOR_" + Date.now(),
          customer_name: donorName,
          customer_email: donorEmail,
          customer_phone: donorPhone
        }
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Cashfree order creation failed",
      error: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Cashfree Backend is Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
