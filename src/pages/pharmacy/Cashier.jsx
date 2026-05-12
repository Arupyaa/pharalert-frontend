// src/pages/CashierPage.jsx

import React, {
  useMemo,
  useState,
} from "react";

import { useCashierStore } from "../../store/UseCashierStore.js"

export default function CashierPage() {
  const {
    cart,
    searchTerm,
    setSearchTerm,
    addItemValue,
    setAddItemValue,
    addProduct,
    increaseQty,
    decreaseQty,
    removeItem,
    updateDiscount,
  } = useCashierStore();

  // CUSTOMER NAME
  const [customerName, setCustomerName] =
    useState("");

  // CUSTOMER PAID
  const [customerPaid, setCustomerPaid] =
    useState("");

  // ENTER
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addProduct();
    }
  };

  // FILTER
  const filteredCart = cart.filter((item) =>
    item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // TOTALS
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.price * item.quantity,
      0
    );
  }, [cart]);

  const discount = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.discount,
      0
    );
  }, [cart]);

  const tax = subtotal * 0.14;

  const total = subtotal + tax - discount;

  // CHANGE
  const change =
    Number(customerPaid || 0) - total;

  // PRINT RECEIPT
  const handlePrintReceipt = () => {
    const receiptWindow =
      window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>

          <style>
            body{
              font-family: Arial;
              padding:20px;
            }

            h1{
              text-align:center;
            }

            table{
              width:100%;
              border-collapse: collapse;
              margin-top:20px;
            }

            th, td{
              border:1px solid #ddd;
              padding:10px;
              text-align:left;
            }

            .total{
              margin-top:20px;
              font-size:20px;
              font-weight:bold;
              text-align:right;
            }

            .info{
              margin-top:10px;
            }
          </style>
        </head>

        <body>
          <h1>Pharmacy Receipt</h1>

          <div class="info">
            <strong>Customer:</strong>
            ${
              customerName ||
              "Walk-in Customer"
            }
          </div>

          <div class="info">
            <strong>Date:</strong>
            ${new Date().toLocaleString()}
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${cart
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>

                  <td>${item.quantity}</td>

                  <td>$${item.price}</td>

                  <td>
                    $${(
                      item.price *
                        item.quantity -
                      item.discount
                    ).toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            Subtotal:
            $${subtotal.toFixed(2)}
          </div>

          <div class="total">
            Tax:
            $${tax.toFixed(2)}
          </div>

          <div class="total">
            Discount:
            -$${discount.toFixed(2)}
          </div>

          <div class="total">
            Total:
            $${total.toFixed(2)}
          </div>

          <div class="total">
            Paid:
            $${customerPaid || 0}
          </div>

          <div class="total">
            Change:
            $
            ${
              change > 0
                ? change.toFixed(2)
                : "0.00"
            }
          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();

    receiptWindow.print();
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Pharmacy Cashier
          </h1>

          <p className="text-slate-500 mt-2">
            Manage customer orders and payments
          </p>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT SIDE */}
          <div className="lg:col-span-8 flex flex-col">
            {/* SEARCH */}
            <div className="bg-white rounded-3xl shadow-md p-5 mb-4">
              <input
                type="text"
                placeholder="Search item..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl shadow-md p-8 h-full flex flex-col">
              <table className="w-full">
                {/* HEADER */}
                <thead>
                  <tr className="border-b text-slate-500 text-sm">
                    <th className="text-left font-semibold pb-5 px-2">
                      Product
                    </th>

                    <th className="text-left font-semibold pb-5 px-2">
                      Price
                    </th>

                    <th className="text-left font-semibold pb-5 px-2">
                      Quantity
                    </th>

                    <th className="text-left font-semibold pb-5 px-2">
                      Discount
                    </th>

                    <th className="text-left font-semibold pb-5 px-2">
                      Total
                    </th>

                    <th className="pb-5"></th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {filteredCart.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-slate-50 transition"
                    >
                      {/* PRODUCT */}
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-2xl object-cover border"
                          />

                          <div>
                            <h2 className="font-bold text-slate-800">
                              {item.name}
                            </h2>

                            <p className="text-sm text-slate-400 mt-1">
                              SKU: {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="py-6 px-2 font-medium text-slate-700">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* QUANTITY */}
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              decreaseQty(item.id)
                            }
                            className="w-10 h-10 rounded-xl border hover:bg-slate-100 transition"
                          >
                            -
                          </button>

                          <div className="w-10 text-center font-semibold">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              increaseQty(item.id)
                            }
                            className="w-10 h-10 rounded-xl border hover:bg-slate-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* DISCOUNT */}
                      <td className="py-6 px-2">
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            updateDiscount(
                              item.id,
                              e.target.value
                            )
                          }
                          className="w-24 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                      </td>

                      {/* TOTAL */}
                      <td className="py-6 px-2 font-bold text-slate-800">
                        $
                        {(
                          item.price *
                            item.quantity -
                          item.discount
                        ).toFixed(2)}
                      </td>

                      {/* REMOVE */}
                      <td className="py-6 px-2">
                        <button
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ADD ITEM */}
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <input
                  type="text"
                  placeholder="Enter barcode or product name"
                  value={addItemValue}
                  onChange={(e) =>
                    setAddItemValue(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  className="flex-1 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <button
                  onClick={addProduct}
                  className="bg-emerald-500 hover:bg-emerald-600 transition text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-md p-6 h-full flex flex-col">
              {/* TITLE */}
              <h2 className="text-2xl font-bold mb-8 text-slate-800">
                Summary
              </h2>

              {/* SUMMARY */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    Tax (14%)
                  </span>

                  <span className="font-semibold text-lg">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="font-semibold text-red-500 text-lg">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t my-8"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold">
                  Total
                </span>

                <span className="text-4xl font-bold text-emerald-500">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* CUSTOMER NAME */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  placeholder="Enter customer name"
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-400 text-lg"
                />
              </div>

              {/* CUSTOMER PAID */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Customer Paid
                </label>

                <input
                  type="number"
                  value={customerPaid}
                  onChange={(e) =>
                    setCustomerPaid(
                      e.target.value
                    )
                  }
                  placeholder="Enter paid amount"
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-400 text-lg"
                />
              </div>

              {/* CHANGE */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500">
                      Change
                    </p>

                    <h3 className="text-xl font-bold text-slate-800 mt-1">
                      Return To Customer
                    </h3>
                  </div>

                  <span className="text-4xl font-bold text-emerald-500">
                    $
                    {change > 0
                      ? change.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-auto space-y-4">
                {/* CONFIRM */}
                <button className="bg-emerald-500 hover:bg-emerald-600 transition text-white py-4 rounded-2xl w-full font-semibold text-lg">
                  Confirm Order
                </button>

                {/* PRINT */}
                <button
                  onClick={
                    handlePrintReceipt
                  }
                  className="border border-slate-300 hover:bg-slate-100 transition text-slate-700 py-4 rounded-2xl w-full font-semibold text-lg"
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}