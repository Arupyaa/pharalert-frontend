import { create } from "zustand";

export const useCashierStore = create((set, get) => ({
  // =========================================
  // PRODUCTS
  // =========================================
  products: [
    {
      id: 1,
      name: "Amoxicillin 500mg",
      barcode: "1111",
     
      price: 12.5,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400",
    },
    {
      id: 2,
      name: "Panadol Extra",
      barcode: "2222",
     
      price: 5,
      image:
        "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=400",
    },
    {
      id: 3,
      name: "Vitamin C 1000mg",
      barcode: "3333",
    
      price: 18,
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400",
    },
    {
      id: 4,
      name: "Paracetamol 500mg",
      barcode: "4444",
      
      price: 9.5,
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400",
    },
  ],

  // =========================================
  // CUSTOMER
  // =========================================
  customerName: "",

  setCustomerName: (name) =>
    set({
      customerName: name,
    }),

  clearCustomer: () =>
    set({
      customerName: "",
    }),

  // =========================================
  // SEARCH
  // =========================================
  searchTerm: "",

  setSearchTerm: (value) =>
    set({
      searchTerm: value,
    }),

  // =========================================
  // ADD ITEM INPUT
  // =========================================
  addItemValue: "",

  setAddItemValue: (value) =>
    set({
      addItemValue: value,
    }),

  // =========================================
  // CART
  // =========================================
  cart: [
    {
      id: 1,
      name: "Amoxicillin 500mg",
      barcode: "1111",
      sku: "84920183",
      price: 12.5,
      quantity: 2,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400",
    },
    {
      id: 2,
      name: "Panadol Extra",
      barcode: "2222",
      sku: "49201833",
      price: 5,
      quantity: 3,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=400",
    },
    {
      id: 3,
      name: "Vitamin C 1000mg",
      barcode: "3333",
      sku: "19203844",
      price: 18,
      quantity: 1,
      discount: 2,
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400",
    },
    {
      id: 4,
      name: "Paracetamol 500mg",
      barcode: "4444",
      sku: "58291044",
      price: 9.5,
      quantity: 1,
      discount: 0,
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400",
    },
  ],

  // =========================================
  // ADD PRODUCT
  // =========================================
  addProduct: () => {
    const {
      products,
      addItemValue,
      cart,
    } = get();

    if (!addItemValue.trim()) return;

    const foundProduct = products.find(
      (product) =>
        product.barcode === addItemValue ||
        product.name.toLowerCase() ===
          addItemValue.toLowerCase()
    );

    if (!foundProduct) {
      alert("Product not found");
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === foundProduct.id
    );

    // PRODUCT EXISTS
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === foundProduct.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      });
    }

    // NEW PRODUCT
    else {
      set({
        cart: [
          ...cart,
          {
            ...foundProduct,
            quantity: 1,
            discount: 0,
          },
        ],
      });
    }

    set({
      addItemValue: "",
    });
  },

  // =========================================
  // INCREASE QUANTITY
  // =========================================
  increaseQty: (id) => {
    const { cart } = get();

    set({
      cart: cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      ),
    });
  },

  // =========================================
  // DECREASE QUANTITY
  // =========================================
  decreaseQty: (id) => {
    const { cart } = get();

    set({
      cart: cart.map((item) =>
        item.id === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      ),
    });
  },

  // =========================================
  // REMOVE ITEM
  // =========================================
  removeItem: (id) => {
    const { cart } = get();

    set({
      cart: cart.filter(
        (item) => item.id !== id
      ),
    });
  },

  // =========================================
  // UPDATE DISCOUNT
  // =========================================
  updateDiscount: (id, value) => {
    const { cart } = get();

    set({
      cart: cart.map((item) =>
        item.id === id
          ? {
              ...item,
              discount: Number(value) || 0,
            }
          : item
      ),
    });
  },

  // =========================================
  // CLEAR CART
  // =========================================
  clearCart: () =>
    set({
      cart: [],
    }),

  // =========================================
  // CONFIRM ORDER
  // =========================================
  confirmOrder: () => {
    const {
      cart,
      customerName,
    } = get();

    const orderData = {
      customerName,
      items: cart,
      createdAt: new Date(),
    };

    console.log("ORDER:", orderData);

    // LATER:
    // send to backend
    // save invoice
    // print receipt

    set({
      cart: [],
      customerName: "",
      addItemValue: "",
    });
  },
}));