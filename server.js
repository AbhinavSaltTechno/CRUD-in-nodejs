const express = require("express");
const cors = require("cors");
const { fakeStoreData } = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    console.log("req from client");
    res
      .status(200)
      .json({ message: "Hello there", data: fakeStoreData, success: true });
  } catch (e) {
    res.status(400).json({ message: "Error", success: false });
    console.log("I got a req error");
  }
});

app.get("/api/products/categories", async (req, res) => {
  try {
    console.log("req from client");
    return res.status(200).json({
      message: "Hello there",
      data: ["electronics", "jewelery", "men's clothing", "women's clothing"],
      success: true,
    });
  } catch (e) {
    res.status(500).json({ message: "server Error", success: false });
    console.log("I got a req error");
  }
});

app.get("/api/product/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id > fakeStoreData.length) {
      return res.status(400).json({
        message: "client error",
        error: "Id does not exist",
        success: false,
      });
    }
    if (id === fakeStoreData.length) {
      return res.status(400).json({
        message: "Enjoy...",
        data: fakeStoreData[fakeStoreData.length - 1],
        success: true,
      });
    }
    console.log("req id", id);

    let product = fakeStoreData.find((ele) => ele.id === id);
    return res.status(200).json({
      message: "Enjoy",
      data: product,
      success: true,
    });
  } catch (e) {
    res.status(500).json({ message: "server Error", success: false });
    console.log("I got a req error");
  }
});

app.post("/api/product", (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.title || !req.body.price) {
      return res.status(400).json({
        message: "client error",
        error: "Title and price are required.",
        success: false,
      });
    }

    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.description || null;
    let category = req.body.category || "men's clothing";
    let rating = req.body.rating || null;
    let image = req.body.imageUrl || null;
    let dataObj = {
      id: fakeStoreData.length + 1,
      title,
      price,
      description,
      category,
      rating,
      image,
    };
    fakeStoreData.push(dataObj);
    return res.status(201).json({
      message: "Product successfully added",
      success: true,
      data: dataObj,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/product/:id", (req, res) => {
  try {
    console.log(req.body);
    const id = parseInt(req.params.id);
    const { title, price, description, category, rating, image } = req.body;
    if (id > fakeStoreData.length) {
      return res.status(400).json({
        message: "client error",
        error: "Id does not exist",
        success: false,
      });
    }

    if (!title || !price || !description || !category || !rating || !image) {
      console.log(!title, !price, !description, !category, !rating);

      return res.status(400).json({
        message: "client error",
        error: "give atleast one property to update",
        success: false,
      });
    }
    const productIndex = fakeStoreData.findIndex((ele) => ele.id === id);
    const updatedProduct = {
      id: id,
      title: title || fakeStoreData[productIndex].title,
      price: price || fakeStoreData[productIndex].price,
      description: description || fakeStoreData[productIndex].description,
      category: category || fakeStoreData[productIndex].category,
      rating: rating || fakeStoreData[productIndex].rating,
      image: image || fakeStoreData[productIndex].image,
    };

    fakeStoreData[productIndex] = updatedProduct;

    return res.status(201).json({
      message: "Product successfully updated",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/product/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID", success: false });
    }

    const productIndex = fakeStoreData.findIndex((ele) => ele.id === id);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Id does not exist", success: false });
    }

    fakeStoreData.splice(productIndex, 1);

    return res.status(200).json({
      message: "Product successfully deleted",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server has started"));
