// import React, { useMemo, useState } from "react";

// import { useCashierStore } from "../../store/UseCashierStore.js";

// export default function CashierPage() {
//   const {
//     cart,
//     searchTerm,
//     setSearchTerm,
//     addItemValue,
//     setAddItemValue,
//     addProduct,
//     increaseQty,
//     decreaseQty,
//     removeItem,
//     updateDiscount,
//   } = useCashierStore();

//   const [customerName, setCustomerName] = useState("");
//   const [customerPaid, setCustomerPaid] = useState("");

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") addProduct();
//   };

//   const filteredCart = cart.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const subtotal = useMemo(
//     () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
//     [cart],
//   );

//   const discount = useMemo(
//     () => cart.reduce((acc, item) => acc + item.discount, 0),
//     [cart],
//   );

//   const tax = subtotal * 0.14;
//   const total = subtotal + tax - discount;
//   const change = Number(customerPaid || 0) - total;

//   const handlePrintReceipt = () => {
//     const receiptWindow = window.open("", "_blank");
//     receiptWindow.document.write(`
//       <html>
//         <head>
//           <title>PharAlert Receipt</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: 'Inter', Arial, sans-serif; padding: 32px; background: #fff; color: #333; }
//             .header { text-align: center; border-bottom: 2px solid #00ab79; padding-bottom: 20px; margin-bottom: 20px; }
//             .header h1 { font-size: 26px; font-weight: 700; color: #00ab79; }
//             .header p { color: #6b7280; font-size: 13px; margin-top: 4px; }
//             .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
//             .info-row span:first-child { color: #6b7280; }
//             .info-row span:last-child { font-weight: 600; color: #111; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th { background: #f0fdf8; color: #2b6f54; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; padding: 10px 12px; text-align: left; border-bottom: 2px solid #cdfbe4; }
//             td { padding: 12px; border-bottom: 1px solid #f0fdf8; font-size: 14px; }
//             .totals { margin-top: 20px; }
//             .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #6b7280; }
//             .totals .row.total { font-size: 20px; font-weight: 700; color: #00ab79; border-top: 2px solid #00ab79; margin-top: 10px; padding-top: 12px; }
//             .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>PharAlert</h1>
//             <p>Smart Pharmacy Receipt</p>
//           </div>
//           <div class="info-row"><span>Customer</span><span>${customerName || "Walk-in Customer"}</span></div>
//           <div class="info-row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
//           <table>
//             <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Discount</th><th>Total</th></tr></thead>
//             <tbody>
//               ${cart
//                 .map(
//                   (item) => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.quantity}</td>
//                   <td>$${item.price.toFixed(2)}</td>
//                   <td>-$${item.discount.toFixed(2)}</td>
//                   <td>$${(item.price * item.quantity - item.discount).toFixed(2)}</td>
//                 </tr>`,
//                 )
//                 .join("")}
//             </tbody>
//           </table>
//           <div class="totals">
//             <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
//             <div class="row"><span>Tax (14%)</span><span>$${tax.toFixed(2)}</span></div>
//             <div class="row"><span>Discount</span><span>-$${discount.toFixed(2)}</span></div>
//             <div class="row"><span>Paid</span><span>$${Number(customerPaid || 0).toFixed(2)}</span></div>
//             <div class="row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
//             <div class="row"><span>Change</span><span>$${change > 0 ? change.toFixed(2) : "0.00"}</span></div>
//           </div>
//           <div class="footer">Thank you for choosing PharAlert · Your health, our priority</div>
//         </body>
//       </html>
//     `);
//     receiptWindow.document.close();
//     receiptWindow.print();
//   };

//   return (
//     <div
//       className="min-h-screen py-8"
//       style={{ background: "var(--color-bg-subtle)" }}
//     >
//       {/* Subtle background mesh matching landing page */}
//       <div
//         className="fixed inset-0 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse 70% 50% at 80% 10%, var(--color-primary-6) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 5% 90%, var(--blue-50) 0%, transparent 55%)",
//           zIndex: 0,
//         }}
//       />

//       <div className="relative z-10 container mx-auto px-4 lg:px-8">
//         {/* ── HEADER ── */}
//         <div className="mb-8">
//           <div
//             className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
//             style={{
//               background:
//                 "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
//               border: "1px solid var(--color-primary-25)",
//               color: "var(--brand-dark)",
//             }}
//           >
//             <span className="relative flex h-2 w-2">
//               <span
//                 className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
//                 style={{ background: "var(--brand-primary)" }}
//               />
//               <span
//                 className="relative inline-flex rounded-full h-2 w-2"
//                 style={{ background: "var(--brand-primary)" }}
//               />
//             </span>
//             Pharmacy Cashier
//           </div>

//           <h1
//             className="text-4xl font-bold tracking-tight"
//             style={{ color: "var(--text-heading)" }}
//           >
//             Point of Sale
//           </h1>
//           <p className="mt-1.5" style={{ color: "var(--text-muted)" }}>
//             Manage customer orders and process payments
//           </p>
//         </div>

//         {/* ── LAYOUT ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
//           {/* ── LEFT PANEL ── */}
//           <div className="lg:col-span-8 flex flex-col gap-4">
//             {/* SEARCH */}
//             <div
//               className="rounded-2xl p-4"
//               style={{
//                 background: "var(--bg-neutral)",
//                 border: "1px solid var(--border-gray)",
//                 boxShadow: "0 1px 12px var(--color-shadow-4)",
//               }}
//             >
//               <div className="relative">
//                 <svg
//                   className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
//                   style={{ color: "var(--text-muted)" }}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   placeholder="Search items in cart..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full rounded-xl pl-12 pr-5 py-3.5 outline-none text-sm transition-all"
//                   style={{
//                     background: "var(--bg-secondary)",
//                     border: "1.5px solid var(--border-gray)",
//                     color: "var(--text-main)",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "var(--brand-primary)";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px var(--color-primary-12)";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "var(--border-gray)";
//                     e.target.style.boxShadow = "none";
//                   }}
//                 />
//               </div>
//             </div>

//             {/* ITEMS TABLE */}
//             <div
//               className="rounded-2xl flex flex-col flex-1"
//               style={{
//                 background: "var(--bg-neutral)",
//                 border: "1px solid var(--border-gray)",
//                 boxShadow: "0 1px 12px var(--color-shadow-4)",
//               }}
//             >
//               {/* Table header */}
//               <div
//                 className="px-6 py-4 rounded-t-2xl"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, var(--color-primary-6), var(--color-primary-12))",
//                   borderBottom: "1px solid var(--color-primary-25)",
//                 }}
//               >
//                 <h2
//                   className="font-semibold text-sm"
//                   style={{ color: "var(--brand-dark)" }}
//                 >
//                   Cart Items ({filteredCart.length})
//                 </h2>
//               </div>

//               <div className="overflow-x-auto flex-1">
//                 <table className="w-full">
//                   <thead>
//                     <tr
//                       style={{ borderBottom: "1px solid var(--border-gray)" }}
//                     >
//                       {[
//                         "Product",
//                         "Price",
//                         "Quantity",
//                         "Discount",
//                         "Total",
//                         "",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-4"
//                           style={{ color: "var(--text-muted)" }}
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredCart.length === 0 ? (
//                       <tr>
//                         <td colSpan={6} className="text-center py-16">
//                           <div className="flex flex-col items-center gap-3">
//                             <div
//                               className="w-14 h-14 rounded-2xl flex items-center justify-center"
//                               style={{ background: "var(--color-primary-6)" }}
//                             >
//                               <svg
//                                 className="w-7 h-7"
//                                 style={{ color: "var(--brand-primary)" }}
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={1.5}
//                                   d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                                 />
//                               </svg>
//                             </div>
//                             <p
//                               className="text-sm font-medium"
//                               style={{ color: "var(--text-muted)" }}
//                             >
//                               Cart is empty
//                             </p>
//                             <p
//                               className="text-xs"
//                               style={{ color: "var(--text-muted)" }}
//                             >
//                               Add a product using the field below
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredCart.map((item) => (
//                         <tr
//                           key={item.id}
//                           className="transition-colors group"
//                           style={{
//                             borderBottom: "1px solid var(--border-gray)",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.background =
//                               "var(--color-primary-6)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.background = "transparent")
//                           }
//                         >
//                           {/* Product */}
//                           <td className="py-4 px-5">
//                             <div className="flex items-center gap-3">
//                               <div
//                                 className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
//                                 style={{
//                                   border: "1.5px solid var(--color-primary-20)",
//                                 }}
//                               >
//                                 <img
//                                   src={item.image}
//                                   alt={item.name}
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <div>
//                                 <p
//                                   className="font-semibold text-sm"
//                                   style={{ color: "var(--text-heading)" }}
//                                 >
//                                   {item.name}
//                                 </p>
//                                 <p
//                                   className="text-xs mt-0.5"
//                                   style={{ color: "var(--text-muted)" }}
//                                 >
//                                   SKU: {item.sku}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Price */}
//                           <td className="py-4 px-5">
//                             <span
//                               className="font-medium text-sm"
//                               style={{ color: "var(--text-main)" }}
//                             >
//                               ${item.price.toFixed(2)}
//                             </span>
//                           </td>

//                           {/* Quantity */}
//                           <td className="py-4 px-5">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => decreaseQty(item.id)}
//                                 className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all"
//                                 style={{
//                                   border: "1.5px solid var(--border-gray)",
//                                   color: "var(--text-muted)",
//                                   background: "var(--bg-secondary)",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.borderColor =
//                                     "var(--brand-primary)";
//                                   e.currentTarget.style.color =
//                                     "var(--brand-primary)";
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.borderColor =
//                                     "var(--border-gray)";
//                                   e.currentTarget.style.color =
//                                     "var(--text-muted)";
//                                 }}
//                               >
//                                 −
//                               </button>
//                               <span
//                                 className="w-8 text-center font-bold text-sm"
//                                 style={{ color: "var(--text-heading)" }}
//                               >
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() => increaseQty(item.id)}
//                                 className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all"
//                                 style={{
//                                   background: "var(--brand-primary)",
//                                   color: "#fff",
//                                   border: "none",
//                                 }}
//                                 onMouseEnter={(e) =>
//                                   (e.currentTarget.style.background =
//                                     "var(--brand-dark)")
//                                 }
//                                 onMouseLeave={(e) =>
//                                   (e.currentTarget.style.background =
//                                     "var(--brand-primary)")
//                                 }
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </td>

//                           {/* Discount */}
//                           <td className="py-4 px-5">
//                             <div className="relative">
//                               <span
//                                 className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
//                                 style={{ color: "var(--text-muted)" }}
//                               >
//                                 $
//                               </span>
//                               <input
//                                 type="number"
//                                 value={item.discount}
//                                 onChange={(e) =>
//                                   updateDiscount(item.id, e.target.value)
//                                 }
//                                 className="w-24 rounded-lg pl-6 pr-3 py-2 text-sm outline-none transition-all"
//                                 style={{
//                                   border: "1.5px solid var(--border-gray)",
//                                   background: "var(--bg-secondary)",
//                                   color: "var(--text-main)",
//                                 }}
//                                 onFocus={(e) => {
//                                   e.target.style.borderColor =
//                                     "var(--brand-primary)";
//                                   e.target.style.boxShadow =
//                                     "0 0 0 3px var(--color-primary-12)";
//                                 }}
//                                 onBlur={(e) => {
//                                   e.target.style.borderColor =
//                                     "var(--border-gray)";
//                                   e.target.style.boxShadow = "none";
//                                 }}
//                               />
//                             </div>
//                           </td>

//                           {/* Total */}
//                           <td className="py-4 px-5">
//                             <span
//                               className="font-bold text-sm"
//                               style={{ color: "var(--brand-primary)" }}
//                             >
//                               $
//                               {(
//                                 item.price * item.quantity -
//                                 item.discount
//                               ).toFixed(2)}
//                             </span>
//                           </td>

//                           {/* Remove */}
//                           <td className="py-4 px-5">
//                             <button
//                               onClick={() => removeItem(item.id)}
//                               className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
//                               style={{
//                                 color: "#ef4444",
//                                 border: "1.5px solid #fecaca",
//                                 background: "#fff1f2",
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.background = "#ef4444";
//                                 e.currentTarget.style.color = "#fff";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.background = "#fff1f2";
//                                 e.currentTarget.style.color = "#ef4444";
//                               }}
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M6 18L18 6M6 6l12 12"
//                                 />
//                               </svg>
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* ADD ITEM */}
//               <div
//                 className="p-5 mt-auto"
//                 style={{ borderTop: "1px solid var(--border-gray)" }}
//               >
//                 <div className="flex flex-col md:flex-row gap-3">
//                   <div className="relative flex-1">
//                     <svg
//                       className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
//                       style={{ color: "var(--text-muted)" }}
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 4v16m8-8H4"
//                       />
//                     </svg>
//                     <input
//                       type="text"
//                       placeholder="Enter barcode or product name…"
//                       value={addItemValue}
//                       onChange={(e) => setAddItemValue(e.target.value)}
//                       onKeyDown={handleKeyDown}
//                       className="w-full rounded-xl pl-11 pr-5 py-3.5 text-sm outline-none transition-all"
//                       style={{
//                         border: "1.5px solid var(--border-gray)",
//                         background: "var(--bg-secondary)",
//                         color: "var(--text-main)",
//                       }}
//                       onFocus={(e) => {
//                         e.target.style.borderColor = "var(--brand-primary)";
//                         e.target.style.boxShadow =
//                           "0 0 0 3px var(--color-primary-12)";
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = "var(--border-gray)";
//                         e.target.style.boxShadow = "none";
//                       }}
//                     />
//                   </div>
//                   <button
//                     onClick={addProduct}
//                     className="px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
//                     style={{
//                       background:
//                         "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
//                       boxShadow: "var(--shadow-button)",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.boxShadow =
//                         "var(--shadow-button-hover)";
//                       e.currentTarget.style.transform = "translateY(-1px)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.boxShadow = "var(--shadow-button)";
//                       e.currentTarget.style.transform = "none";
//                     }}
//                   >
//                     Add Item
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── RIGHT PANEL — SUMMARY ── */}
//           <div className="lg:col-span-4">
//             <div
//               className="rounded-2xl p-6 h-full flex flex-col sticky top-8"
//               style={{
//                 background: "var(--bg-neutral)",
//                 border: "1px solid var(--border-gray)",
//                 boxShadow: "0 1px 12px var(--color-shadow-4)",
//               }}
//             >
//               {/* Title */}
//               <div className="flex items-center gap-2 mb-6">
//                 <div
//                   className="w-8 h-8 rounded-lg flex items-center justify-center"
//                   style={{
//                     background:
//                       "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
//                   }}
//                 >
//                   <svg
//                     className="w-4 h-4 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 2.5 2 2.5-2 3.5 2z"
//                     />
//                   </svg>
//                 </div>
//                 <h2
//                   className="text-lg font-bold"
//                   style={{ color: "var(--text-heading)" }}
//                 >
//                   Order Summary
//                 </h2>
//               </div>

//               {/* Breakdown */}
//               <div className="space-y-3 mb-5">
//                 {[
//                   {
//                     label: "Subtotal",
//                     value: `$${subtotal.toFixed(2)}`,
//                     muted: true,
//                   },
//                   {
//                     label: "Tax (14%)",
//                     value: `$${tax.toFixed(2)}`,
//                     muted: true,
//                   },
//                   {
//                     label: "Discount",
//                     value: `-$${discount.toFixed(2)}`,
//                     red: true,
//                   },
//                 ].map(({ label, value, muted, red }) => (
//                   <div
//                     key={label}
//                     className="flex justify-between items-center"
//                   >
//                     <span
//                       className="text-sm"
//                       style={{ color: "var(--text-muted)" }}
//                     >
//                       {label}
//                     </span>
//                     <span
//                       className="text-sm font-semibold"
//                       style={{ color: red ? "#ef4444" : "var(--text-main)" }}
//                     >
//                       {value}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Total */}
//               <div
//                 className="rounded-xl p-4 mb-6"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
//                   border: "1px solid var(--color-primary-25)",
//                 }}
//               >
//                 <div className="flex justify-between items-center">
//                   <span
//                     className="font-bold text-base"
//                     style={{ color: "var(--brand-dark)" }}
//                   >
//                     Total Due
//                   </span>
//                   <span
//                     className="text-3xl font-bold"
//                     style={{ color: "var(--brand-primary)" }}
//                   >
//                     ${total.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               {/* Customer Name */}
//               <div className="mb-4">
//                 <label
//                   className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
//                   style={{ color: "var(--text-muted)" }}
//                 >
//                   Customer Name
//                 </label>
//                 <input
//                   type="text"
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   placeholder="Walk-in customer"
//                   className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
//                   style={{
//                     border: "1.5px solid var(--border-gray)",
//                     background: "var(--bg-secondary)",
//                     color: "var(--text-main)",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "var(--brand-primary)";
//                     e.target.style.boxShadow =
//                       "0 0 0 3px var(--color-primary-12)";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "var(--border-gray)";
//                     e.target.style.boxShadow = "none";
//                   }}
//                 />
//               </div>

//               {/* Customer Paid */}
//               <div className="mb-5">
//                 <label
//                   className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
//                   style={{ color: "var(--text-muted)" }}
//                 >
//                   Amount Paid
//                 </label>
//                 <div className="relative">
//                   <span
//                     className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm"
//                     style={{ color: "var(--brand-primary)" }}
//                   >
//                     $
//                   </span>
//                   <input
//                     type="number"
//                     value={customerPaid}
//                     onChange={(e) => setCustomerPaid(e.target.value)}
//                     placeholder="0.00"
//                     className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
//                     style={{
//                       border: "1.5px solid var(--border-gray)",
//                       background: "var(--bg-secondary)",
//                       color: "var(--text-main)",
//                     }}
//                     onFocus={(e) => {
//                       e.target.style.borderColor = "var(--brand-primary)";
//                       e.target.style.boxShadow =
//                         "0 0 0 3px var(--color-primary-12)";
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = "var(--border-gray)";
//                       e.target.style.boxShadow = "none";
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Change */}
//               <div
//                 className="rounded-xl p-4 mb-6"
//                 style={{
//                   background:
//                     change > 0
//                       ? "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))"
//                       : "var(--bg-secondary)",
//                   border: `1px solid ${change > 0 ? "var(--color-primary-25)" : "var(--border-gray)"}`,
//                 }}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p
//                       className="text-xs font-semibold uppercase tracking-wider"
//                       style={{ color: "var(--text-muted)" }}
//                     >
//                       Change
//                     </p>
//                     <p
//                       className="text-sm mt-0.5 font-medium"
//                       style={{ color: "var(--brand-dark)" }}
//                     >
//                       Return to Customer
//                     </p>
//                   </div>
//                   <span
//                     className="text-2xl font-bold"
//                     style={{
//                       color:
//                         change > 0
//                           ? "var(--brand-primary)"
//                           : "var(--text-muted)",
//                     }}
//                   >
//                     ${change > 0 ? change.toFixed(2) : "0.00"}
//                   </span>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="mt-auto space-y-3">
//                 <button
//                   className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
//                   style={{
//                     background:
//                       "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
//                     boxShadow: "var(--shadow-button)",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.boxShadow =
//                       "var(--shadow-button-hover)";
//                     e.currentTarget.style.transform = "translateY(-1px)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.boxShadow = "var(--shadow-button)";
//                     e.currentTarget.style.transform = "none";
//                   }}
//                 >
//                   ✓ Confirm Order
//                 </button>

//                 <button
//                   onClick={handlePrintReceipt}
//                   className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
//                   style={{
//                     border: "1.5px solid var(--border-gray)",
//                     background: "var(--bg-neutral)",
//                     color: "var(--text-main)",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = "var(--brand-primary)";
//                     e.currentTarget.style.color = "var(--brand-primary)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = "var(--border-gray)";
//                     e.currentTarget.style.color = "var(--text-main)";
//                   }}
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
//                     />
//                   </svg>
//                   Print Receipt
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useState } from "react";
import { useCashierStore } from "../../store/UseCashierStore.js";
import RequireActiveSubscription from "../../components/General/RequireActiveSubscription";
import DemandModal from "./DemandModal";

export default function CashierPage() {
  return (
    <RequireActiveSubscription role="pharmacy">
      <CashierInner />
    </RequireActiveSubscription>
  );
}

function CashierInner() {
  const {
    cart,
    searchTerm,
    setSearchTerm,
    addItemValue,
    setAddItemValue,
    addProduct,
    addItemError,
    barcodeLoading,
    increaseQty,
    decreaseQty,
    removeItem,
    updateDiscount,
    fetchProducts,
    productsLoading,
    customerName,
    setCustomerName,
    confirmOrder,
    orderLoading,
    orderSuccess,
    orderError,
    lastFailedBarcode,
  } = useCashierStore();

  const [customerPaid, setCustomerPaid] = useState("");
  const [demandModalOpen, setDemandModalOpen] = useState(false);
  const [demandPreselect, setDemandPreselect] = useState(null);

  // Load products from API on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addProduct();
  };

  const filteredCart = cart.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const discount = useMemo(
    () => cart.reduce((acc, item) => acc + item.discount, 0),
    [cart]
  );

  const tax = subtotal * 0.14;
  const total = subtotal + tax - discount;
  const change = Number(customerPaid || 0) - total;

  const handlePrintReceipt = () => {
    const receiptWindow = window.open("", "_blank");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>PharAlert Receipt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', Arial, sans-serif; padding: 32px; background: #fff; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #00ab79; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { font-size: 26px; font-weight: 700; color: #00ab79; }
            .header p { color: #6b7280; font-size: 13px; margin-top: 4px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .info-row span:first-child { color: #6b7280; }
            .info-row span:last-child { font-weight: 600; color: #111; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f0fdf8; color: #2b6f54; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; padding: 10px 12px; text-align: left; border-bottom: 2px solid #cdfbe4; }
            td { padding: 12px; border-bottom: 1px solid #f0fdf8; font-size: 14px; }
            .totals { margin-top: 20px; }
            .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #6b7280; }
            .totals .row.total { font-size: 20px; font-weight: 700; color: #00ab79; border-top: 2px solid #00ab79; margin-top: 10px; padding-top: 12px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PharAlert</h1>
            <p>Smart Pharmacy Receipt</p>
          </div>
          <div class="info-row"><span>Customer</span><span>${customerName || "Walk-in Customer"}</span></div>
          <div class="info-row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price (EGP)</th><th>Discount</th><th>Total</th></tr></thead>
            <tbody>
              ${cart
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>-${item.discount.toFixed(2)}</td>
                  <td>${(item.price * item.quantity - item.discount).toFixed(2)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <div class="row"><span>Subtotal</span><span>${subtotal.toFixed(2)} EGP</span></div>
            <div class="row"><span>Tax (14%)</span><span>${tax.toFixed(2)} EGP</span></div>
            <div class="row"><span>Discount</span><span>-${discount.toFixed(2)} EGP</span></div>
            <div class="row"><span>Paid</span><span>${Number(customerPaid || 0).toFixed(2)} EGP</span></div>
            <div class="row total"><span>Total</span><span>${total.toFixed(2)} EGP</span></div>
            <div class="row"><span>Change</span><span>${change > 0 ? change.toFixed(2) : "0.00"} EGP</span></div>
          </div>
          <div class="footer">Thank you for choosing PharAlert · Your health, our priority</div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div
      className="min-h-screen py-8"
      style={{ background: "var(--color-bg-subtle)" }}
    >
      {/* Background mesh */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 10%, var(--color-primary-6) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 5% 90%, var(--blue-50) 0%, transparent 55%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {/* ── HEADER ── */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
              border: "1px solid var(--color-primary-25)",
              color: "var(--brand-dark)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                style={{ background: "var(--brand-primary)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--brand-primary)" }}
              />
            </span>
            Pharmacy Cashier
          </div>

          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "var(--text-heading)" }}
          >
            Point of Sale
          </h1>
          <p className="mt-1.5" style={{ color: "var(--text-muted)" }}>
            {productsLoading
              ? "Loading products from server…"
              : "Manage customer orders and process payments"}
          </p>
        </div>

        {/* ── TOAST NOTIFICATIONS ── */}
        {orderSuccess && (
          <div
            className="mb-5 px-5 py-4 rounded-xl flex items-center gap-3 font-medium text-sm"
            style={{
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              border: "1px solid #6ee7b7",
              color: "#065f46",
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Order confirmed successfully! Receipt is ready.
          </div>
        )}

        {orderError && (
          <div
            className="mb-5 px-5 py-4 rounded-xl flex items-center gap-3 font-medium text-sm"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {orderError}
          </div>
        )}

        {addItemError && (
          <div
            className="mb-5 px-5 py-4 rounded-xl flex items-center gap-3 font-medium text-sm"
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              color: "#92400e",
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1">{addItemError}</span>
            <button
              type="button"
              onClick={() => {
                setDemandPreselect(lastFailedBarcode);
                setDemandModalOpen(true);
              }}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              }}
            >
              Log Demand
            </button>
          </div>
        )}

        {/* ── LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* SEARCH CART */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--text-muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search items in cart…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl pl-12 pr-5 py-3.5 outline-none text-sm transition-all"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1.5px solid var(--border-gray)",
                    color: "var(--text-main)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-gray)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div
              className="rounded-2xl flex flex-col flex-1"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              {/* Table header */}
              <div
                className="px-6 py-4 rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-6), var(--color-primary-12))",
                  borderBottom: "1px solid var(--color-primary-25)",
                }}
              >
                <h2
                  className="font-semibold text-sm"
                  style={{ color: "var(--brand-dark)" }}
                >
                  Cart Items ({filteredCart.length})
                </h2>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-gray)" }}>
                      {["Product", "Price", "Quantity", "Discount", "Total", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left text-xs font-semibold uppercase tracking-wider px-5 py-4"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCart.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center"
                              style={{ background: "var(--color-primary-6)" }}
                            >
                              <svg
                                className="w-7 h-7"
                                style={{ color: "var(--brand-primary)" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Cart is empty
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Scan a barcode or type a product name below
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCart.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors group"
                          style={{ borderBottom: "1px solid var(--border-gray)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--color-primary-6)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {/* Product */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {/* Icon placeholder instead of image */}
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold"
                                style={{
                                  background: "var(--color-primary-12)",
                                  color: "var(--brand-primary)",
                                  border: "1.5px solid var(--color-primary-25)",
                                }}
                              >
                                {item.name.charAt(0)}
                              </div>
                              <div>
                                <p
                                  className="font-semibold text-sm"
                                  style={{ color: "var(--text-heading)" }}
                                >
                                  {item.name}
                                </p>
                                <p
                                  className="text-xs mt-0.5"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {item.genericName} · {item.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-5">
                            <span
                              className="font-medium text-sm"
                              style={{ color: "var(--text-main)" }}
                            >
                              {item.price.toFixed(2)} EGP
                            </span>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decreaseQty(item.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all"
                                style={{
                                  border: "1.5px solid var(--border-gray)",
                                  color: "var(--text-muted)",
                                  background: "var(--bg-secondary)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "var(--brand-primary)";
                                  e.currentTarget.style.color = "var(--brand-primary)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "var(--border-gray)";
                                  e.currentTarget.style.color = "var(--text-muted)";
                                }}
                              >
                                −
                              </button>
                              <span
                                className="w-8 text-center font-bold text-sm"
                                style={{ color: "var(--text-heading)" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseQty(item.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all"
                                style={{
                                  background: "var(--brand-primary)",
                                  color: "#fff",
                                  border: "none",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = "var(--brand-dark)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = "var(--brand-primary)")
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Discount */}
                          <td className="py-4 px-5">
                            <div className="relative">
                              <input
                                type="number"
                                value={item.discount}
                                onChange={(e) =>
                                  updateDiscount(item.id, e.target.value)
                                }
                                className="w-24 rounded-lg px-3 py-2 text-sm outline-none transition-all"
                                style={{
                                  border: "1.5px solid var(--border-gray)",
                                  background: "var(--bg-secondary)",
                                  color: "var(--text-main)",
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = "var(--brand-primary)";
                                  e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "var(--border-gray)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-4 px-5">
                            <span
                              className="font-bold text-sm"
                              style={{ color: "var(--brand-primary)" }}
                            >
                              {(item.price * item.quantity - item.discount).toFixed(2)} EGP
                            </span>
                          </td>

                          {/* Remove */}
                          <td className="py-4 px-5">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                              style={{
                                color: "#ef4444",
                                border: "1.5px solid #fecaca",
                                background: "#fff1f2",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#ef4444";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#fff1f2";
                                e.currentTarget.style.color = "#ef4444";
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* ADD ITEM */}
              <div
                className="p-5 mt-auto"
                style={{ borderTop: "1px solid var(--border-gray)" }}
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    {barcodeLoading ? (
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin"
                        style={{ color: "var(--brand-primary)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--text-muted)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    <input
                      type="text"
                      placeholder="Enter barcode or product name…"
                      value={addItemValue}
                      onChange={(e) => setAddItemValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={barcodeLoading}
                      className="w-full rounded-xl pl-11 pr-5 py-3.5 text-sm outline-none transition-all"
                      style={{
                        border: "1.5px solid var(--border-gray)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-main)",
                        opacity: barcodeLoading ? 0.6 : 1,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--brand-primary)";
                        e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-gray)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <button
                    onClick={addProduct}
                    disabled={barcodeLoading}
                    className="px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                      boxShadow: "var(--shadow-button)",
                      opacity: barcodeLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-button)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    {barcodeLoading ? "Searching…" : "Add Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL — SUMMARY ── */}
          <div className="lg:col-span-4">
            <div
              className="rounded-2xl p-6 h-full flex flex-col sticky top-8"
              style={{
                background: "var(--bg-neutral)",
                border: "1px solid var(--border-gray)",
                boxShadow: "0 1px 12px var(--color-shadow-4)",
              }}
            >
              {/* Title */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                  }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 2.5 2 2.5-2 3.5 2z"
                    />
                  </svg>
                </div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text-heading)" }}
                >
                  Order Summary
                </h2>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-5">
                {[
                  { label: "Subtotal", value: `${subtotal.toFixed(2)} EGP`, muted: true },
                  { label: "Tax (14%)", value: `${tax.toFixed(2)} EGP`, muted: true },
                  { label: "Discount", value: `-${discount.toFixed(2)} EGP`, red: true },
                ].map(({ label, value, red }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: red ? "#ef4444" : "var(--text-main)" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
                  border: "1px solid var(--color-primary-25)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-bold text-base"
                    style={{ color: "var(--brand-dark)" }}
                  >
                    Total Due
                  </span>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {total.toFixed(2)} <span className="text-base">EGP</span>
                  </span>
                </div>
              </div>

              {/* Customer Name */}
              <div className="mb-4">
                <label
                  className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in customer"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid var(--border-gray)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-gray)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Amount Paid */}
              <div className="mb-5">
                <label
                  className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Amount Paid (EGP)
                </label>
                <input
                  type="number"
                  value={customerPaid}
                  onChange={(e) => setCustomerPaid(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid var(--border-gray)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--brand-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-gray)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Change */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{
                  background:
                    change > 0
                      ? "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))"
                      : "var(--bg-secondary)",
                  border: `1px solid ${change > 0 ? "var(--color-primary-25)" : "var(--border-gray)"}`,
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Change
                    </p>
                    <p
                      className="text-sm mt-0.5 font-medium"
                      style={{ color: "var(--brand-dark)" }}
                    >
                      Return to Customer
                    </p>
                  </div>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color:
                        change > 0 ? "var(--brand-primary)" : "var(--text-muted)",
                    }}
                  >
                    {change > 0 ? change.toFixed(2) : "0.00"} EGP
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={confirmOrder}
                  disabled={orderLoading || cart.length === 0}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
                    boxShadow: "var(--shadow-button)",
                    opacity: orderLoading || cart.length === 0 ? 0.6 : 1,
                    cursor:
                      orderLoading || cart.length === 0 ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!orderLoading && cart.length > 0) {
                      e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-button)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {orderLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    "✓ Confirm Order"
                  )}
                </button>

                <button
                  onClick={handlePrintReceipt}
                  disabled={cart.length === 0}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    border: "1.5px solid var(--border-gray)",
                    background: "var(--bg-neutral)",
                    color: "var(--text-main)",
                    opacity: cart.length === 0 ? 0.5 : 1,
                    cursor: cart.length === 0 ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (cart.length > 0) {
                      e.currentTarget.style.borderColor = "var(--brand-primary)";
                      e.currentTarget.style.color = "var(--brand-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-gray)";
                    e.currentTarget.style.color = "var(--text-main)";
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DemandModal
        open={demandModalOpen}
        onClose={() => setDemandModalOpen(false)}
        onSuccess={() => {
          setDemandModalOpen(false);
          setDemandPreselect(null);
        }}
        preselectedMedication={demandPreselect}
      />
    </div>
  );
}
