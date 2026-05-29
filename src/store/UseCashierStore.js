// import { create } from "zustand";

// export const useCashierStore = create((set, get) => ({
//   // =========================================
//   // PRODUCTS
//   // =========================================
//   products: [
//     {
//       id: 1,
//       name: "Amoxicillin 500mg",
//       barcode: "1111",
     
//       price: 12.5,
//       image:
//         "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400",
//     },
//     {
//       id: 2,
//       name: "Panadol Extra",
//       barcode: "2222",
     
//       price: 5,
//       image:
//         "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=400",
//     },
//     {
//       id: 3,
//       name: "Vitamin C 1000mg",
//       barcode: "3333",
    
//       price: 18,
//       image:
//         "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400",
//     },
//     {
//       id: 4,
//       name: "Paracetamol 500mg",
//       barcode: "4444",
      
//       price: 9.5,
//       image:
//         "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400",
//     },
//   ],

//   // =========================================
//   // CUSTOMER
//   // =========================================
//   customerName: "",

//   setCustomerName: (name) =>
//     set({
//       customerName: name,
//     }),

//   clearCustomer: () =>
//     set({
//       customerName: "",
//     }),

//   // =========================================
//   // SEARCH
//   // =========================================
//   searchTerm: "",

//   setSearchTerm: (value) =>
//     set({
//       searchTerm: value,
//     }),

//   // =========================================
//   // ADD ITEM INPUT
//   // =========================================
//   addItemValue: "",

//   setAddItemValue: (value) =>
//     set({
//       addItemValue: value,
//     }),

//   // =========================================
//   // CART
//   // =========================================
//   cart: [
//     {
//       id: 1,
//       name: "Amoxicillin 500mg",
//       barcode: "1111",
//       sku: "84920183",
//       price: 12.5,
//       quantity: 2,
//       discount: 0,
//       image:
//         "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400",
//     },
//     {
//       id: 2,
//       name: "Panadol Extra",
//       barcode: "2222",
//       sku: "49201833",
//       price: 5,
//       quantity: 3,
//       discount: 0,
//       image:
//         "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=400",
//     },
//     {
//       id: 3,
//       name: "Vitamin C 1000mg",
//       barcode: "3333",
//       sku: "19203844",
//       price: 18,
//       quantity: 1,
//       discount: 2,
//       image:
//         "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400",
//     },
//     {
//       id: 4,
//       name: "Paracetamol 500mg",
//       barcode: "4444",
//       sku: "58291044",
//       price: 9.5,
//       quantity: 1,
//       discount: 0,
//       image:
//         "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400",
//     },
//   ],

//   // =========================================
//   // ADD PRODUCT
//   // =========================================
//   addProduct: () => {
//     const {
//       products,
//       addItemValue,
//       cart,
//     } = get();

//     if (!addItemValue.trim()) return;

//     const foundProduct = products.find(
//       (product) =>
//         product.barcode === addItemValue ||
//         product.name.toLowerCase() ===
//           addItemValue.toLowerCase()
//     );

//     if (!foundProduct) {
//       alert("Product not found");
//       return;
//     }

//     const existingItem = cart.find(
//       (item) => item.id === foundProduct.id
//     );

//     // PRODUCT EXISTS
//     if (existingItem) {
//       set({
//         cart: cart.map((item) =>
//           item.id === foundProduct.id
//             ? {
//                 ...item,
//                 quantity: item.quantity + 1,
//               }
//             : item
//         ),
//       });
//     }

//     // NEW PRODUCT
//     else {
//       set({
//         cart: [
//           ...cart,
//           {
//             ...foundProduct,
//             quantity: 1,
//             discount: 0,
//           },
//         ],
//       });
//     }

//     set({
//       addItemValue: "",
//     });
//   },

//   // =========================================
//   // INCREASE QUANTITY
//   // =========================================
//   increaseQty: (id) => {
//     const { cart } = get();

//     set({
//       cart: cart.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: item.quantity + 1,
//             }
//           : item
//       ),
//     });
//   },

//   // =========================================
//   // DECREASE QUANTITY
//   // =========================================
//   decreaseQty: (id) => {
//     const { cart } = get();

//     set({
//       cart: cart.map((item) =>
//         item.id === id &&
//         item.quantity > 1
//           ? {
//               ...item,
//               quantity: item.quantity - 1,
//             }
//           : item
//       ),
//     });
//   },

//   // =========================================
//   // REMOVE ITEM
//   // =========================================
//   removeItem: (id) => {
//     const { cart } = get();

//     set({
//       cart: cart.filter(
//         (item) => item.id !== id
//       ),
//     });
//   },

//   // =========================================
//   // UPDATE DISCOUNT
//   // =========================================
//   updateDiscount: (id, value) => {
//     const { cart } = get();

//     set({
//       cart: cart.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               discount: Number(value) || 0,
//             }
//           : item
//       ),
//     });
//   },

//   // =========================================
//   // CLEAR CART
//   // =========================================
//   clearCart: () =>
//     set({
//       cart: [],
//     }),

//   // =========================================
//   // CONFIRM ORDER
//   // =========================================
//   confirmOrder: () => {
//     const {
//       cart,
//       customerName,
//     } = get();

//     const orderData = {
//       customerName,
//       items: cart,
//       createdAt: new Date(),
//     };

//     console.log("ORDER:", orderData);

//     // LATER:
//     // send to backend
//     // save invoice
//     // print receipt

//     set({
//       cart: [],
//       customerName: "",
//       addItemValue: "",
//     });
//   },
// }));

















import { create } from "zustand";
import api from "../api/api.js";

export const useCashierStore = create((set, get) => ({
  // =========================================
  // PRODUCTS (from API)
  // =========================================
  products: [],
  productsLoading: false,
  productsError: null,

  fetchProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const { data } = await api.get("/pharmacy/barcode");
      // Map barcode API response → flat product list
      const products = (data.data || []).map((item) => ({
        id: item.medication.id,
        medicationId: item.medication.id,
        name: item.medication.brandName,
        genericName: item.medication.genericName,
        barcode: item.barcode,
        price: parseFloat(item.medication.unitPrice),
        category: item.medication.category?.categoryName || "",
        company: item.medication.company?.companyName || "",
      }));
      set({ products, productsLoading: false });
    } catch (err) {
      set({
        productsError: err.response?.data?.message || "Failed to load products",
        productsLoading: false,
      });
    }
  },

  // =========================================
  // BARCODE LOOKUP (API fallback)
  // =========================================
  barcodeLoading: false,

  lookupBarcode: async (value) => {
    const { products } = get();
    // Try local list first
    const local = products.find(
      (p) =>
        p.barcode === value ||
        p.name.toLowerCase() === value.toLowerCase()
    );
    if (local) return local;

    // Fallback: ask API
    set({ barcodeLoading: true });
    try {
      const { data } = await api.get(`/pharmacy/barcode/${value}`);
      const item = data.data;
      if (!item) return null;
      const product = {
        id: item.medication.id,
        medicationId: item.medication.id,
        name: item.medication.brandName,
        genericName: item.medication.genericName,
        barcode: item.barcode,
        price: parseFloat(item.medication.unitPrice),
        category: item.medication.category?.categoryName || "",
        company: item.medication.company?.companyName || "",
      };
      // Add to local cache
      set((state) => ({ products: [...state.products, product] }));
      return product;
    } catch {
      return null;
    } finally {
      set({ barcodeLoading: false });
    }
  },

  // =========================================
  // CUSTOMER
  // =========================================
  customerName: "",
  setCustomerName: (name) => set({ customerName: name }),
  clearCustomer: () => set({ customerName: "" }),

  // =========================================
  // SEARCH
  // =========================================
  searchTerm: "",
  setSearchTerm: (value) => set({ searchTerm: value }),

  // =========================================
  // ADD ITEM INPUT
  // =========================================
  addItemValue: "",
  setAddItemValue: (value) => set({ addItemValue: value }),

  // =========================================
  // CART
  // =========================================
  cart: [],

  addProduct: async () => {
    const { addItemValue, cart, lookupBarcode } = get();
    if (!addItemValue.trim()) return;

    const found = await lookupBarcode(addItemValue.trim());

    if (!found) {
      set({ addItemError: "Product not found" });
      setTimeout(() => set({ addItemError: null }), 3000);
      set({ addItemValue: "" });
      return;
    }

    const existing = cart.find((item) => item.id === found.id);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.id === found.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        cart: [
          ...cart,
          { ...found, quantity: 1, discount: 0 },
        ],
      });
    }
    set({ addItemValue: "", addItemError: null });
  },

  addItemError: null,

  // =========================================
  // INCREASE / DECREASE / REMOVE
  // =========================================
  increaseQty: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

  updateDiscount: (id, value) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, discount: Number(value) || 0 } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  // =========================================
  // CONFIRM ORDER (POST to API)
  // =========================================
  orderLoading: false,
  orderSuccess: false,
  orderError: null,

  confirmOrder: async () => {
    const { cart, customerName } = get();
    if (cart.length === 0) return;

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity - item.discount,
      0
    );

    const payload = {
      customerName: customerName || "customer",
      paymentStatus: "fully_paid",
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      items: cart.map((item) => ({
        medicationId: parseInt(item.medicationId),
        quantity: item.quantity,
        unitPrice: item.price,
        medicationDiscount: item.discount,
        totalPrice: parseFloat(
          (item.price * item.quantity - item.discount).toFixed(2)
        ),
      })),
    };

    set({ orderLoading: true, orderError: null, orderSuccess: false });
    try {
      await api.post("/pharmacy/purchases", payload);
      set({
        orderLoading: false,
        orderSuccess: true,
        cart: [],
        customerName: "",
        addItemValue: "",
      });
      setTimeout(() => set({ orderSuccess: false }), 4000);
    } catch (err) {
      set({
        orderLoading: false,
        orderError:
          err.response?.data?.message || "Failed to confirm order",
      });
      setTimeout(() => set({ orderError: null }), 4000);
    }
  },
}));
