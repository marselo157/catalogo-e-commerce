import { ref, computed } from "vue"


const cartItems = ref([])

export function useCart() {
  // Adicionar produto ao carrinho
  const addToCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id)

    if (existingItem) {
      
      existingItem.quantity += 1
    } else {
      
      cartItems.value.push({
        ...product,
        quantity: 1,
      })
    }

    // Salva no localStorage para persistência
    saveCart()

    // Emitir evento para mostrar modal
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("product-added-to-cart"))
    }
  }

  // Remover produto do carrinho
  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== productId)
    saveCart()
  }

  // Atualizar quantidade de um produto
  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find((item) => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity) // Mínimo de 1
      saveCart()
    }
  }

  // Limpar carrinho
  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  // Salvar carrinho no localStorage
  const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cartItems.value))
  }

  // Carregar carrinho do localStorage
  const loadCart = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  }

  // Calcular total de itens no carrinho
  const cartItemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Calcular subtotal do carrinho
  const cartSubtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    cartItemCount,
    cartSubtotal,
  }
}
