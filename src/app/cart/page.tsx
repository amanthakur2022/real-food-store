"use client";
import { useContext, useState } from "react";
import Image from "next/image";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductsContext } from "../context/GetProducts";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

const Cartlist = () => {
  const [items] = useContext(ProductsContext);

  // cart item UI
  function CartItem({
    productImage,
    productName,
    sellingPrice,
    productId,
    stock,
    qty,
  }) {
    const [purchaseQty, setPurchaseQty] = useState(qty);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // add quantity
    function addQty() {
      const url = "http://localhost:5000/cart/" + productId;
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qty: purchaseQty + 1 }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setPurchaseQty(purchaseQty + 1);
        });
    }

    // remove quantity
    function removeQty() {
      const url = "http://localhost:5000/cart/" + productId;
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qty: purchaseQty - 1 }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setPurchaseQty(purchaseQty - 1);
        });
    }

    // delete modal
    function DeleteModal() {
      function removeFromCart() {
        const url = "http://localhost:5000/cart/" + productId;
        fetch(url, {
          method: "DELETE",
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            items.trigger((prevTrigger) => prevTrigger + 1);
            setIsModalOpen(false);
          });
      }

      return (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${
            isModalOpen ? "" : "hidden"
          }`}
        >
          <div className="bg-white p-8 rounded-md shadow-md">
            <button type="button" className="text-gray-500 float-end" onClick={() => setIsModalOpen(false)}><FontAwesomeIcon icon={faXmark} size="xl" /></button>
            <div className="flex justify-center border-4 border-red-600 border-spacing-2 w-fit m-auto px-4 py-3 rounded-full text-2xl my-5 text-red-600"><FontAwesomeIcon icon={faXmark} size="xl" /></div>
            <p className="text-3xl mb-10 px-8 text-center">
              Are you sure?
            </p>
            <p className="capitalize mb-5 text-base px-5">do you really want to delete this item?</p>
            <div className="flex justify-end px-8 mb-5">
              <button
                className="bg-white border hover:bg-gray-400 shadow-md text-gray-800 font-bold py-2 px-4 rounded mr-4"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 shadow-md text-white font-bold py-2 px-4 rounded"
                onClick={removeFromCart}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <tr className="border-b odd:bg-gray-100 even:bg-white">
        <td className="py-2 md:px-4 px-2">
          <div className="flex flex-col md:flex-row items-center md:ps-12 text-center">
            <Image
              className="h-12 w-12 object-cover rounded"
              src={productImage}
              width={600}
              height={400}
              alt="product image"
            />
            <span className="font-medium md:ml-4">{productName}</span>
          </div>
        </td>
        <td className="py-2 md:px-4 px-2">${sellingPrice}</td>
        <td className="py-2 md:px-4 px-2">
          <div className={`flex items-center my-4 w-fit py-2 rounded-md ${purchaseQty === 0 ? 'bg-white' : 'bg-lime-600'} border ${purchaseQty === 0 ? 'text-black' : 'text-white'}`}>
            <button onClick={removeQty} disabled={purchaseQty === 0} className="md:w-10 w-5">
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <span className="md:w-10 text-center w-5">
              {purchaseQty}
            </span>
            <button onClick={addQty} disabled={purchaseQty === stock} className="md:w-10 w-5">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </td>
        <td className="py-2 md:px-4 px-2">${purchaseQty * sellingPrice}</td>
        <td className="py-2 md:px-4 px-2">
          <button
            className="text-red-500 hover:text-red-700 focus:outline-none"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <DeleteModal />
        </td>
      </tr>
    );
  }

  return (
    <>
    <Navbar />
      <h1 className="text-2xl font-bold my-4 text-center">My Shopping Cart</h1>
      <div className="bg-white shadow-md my-6 md:w-11/12 mx-auto rounded-md">
        <table className="w-full table-auto">
          <thead className="bg-lime-600 h-16 text-white">
            <tr className="border-b text-left md:text-xl *:py-5">
              <th className="md:ps-16 ps-4">Product</th>
              <th className="md:px-4">Price</th>
              <th className="md:px-4">Quantity</th>
              <th className="md:px-4">Total</th>
              <th className="md:px-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.cartList.length > 0 ? (
              items.cartList.map((cartItem) => (
                <CartItem
                  qty={cartItem.qty}
                  key={cartItem.id}
                  stock={cartItem.stock}
                  productImage={cartItem.productImage}
                  productName={cartItem.productName}
                  sellingPrice={cartItem.sellingPrice}
                  productId={cartItem.id}
                />
              ))
            ) : (
              <tr>
                <td className="ps-4 py-8">No products added to the cart!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-8 w-11/12 mx-auto">
        <a href="/products" target="_blank" className="text-lime-500 hover:underline">
          Continue Shopping
        </a>
        <button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded">
          Checkout
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Cartlist;
