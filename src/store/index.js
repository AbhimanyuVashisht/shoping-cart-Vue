import Vuex from 'vuex';

import Vue from 'vue';

import shop from '@/api/shop'

Vue.use(Vuex);


export default new Vuex.Store({
  state: { // = data
    products: [],
    // {id, quantity}
    cart: [],

    checkoutStatus: null
  },

  getters: { // computed properties
    availableProducts(state, getters){ // similar to mutation state is passed as the first parameter automatically,
      // all existing getters as the second parameter
      return state.products.filter(product => product.inventory > 0)
    },

    cartProducts(state){
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },

    cartTotal(state, getters){
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    }
  },

  actions: {
    fetchProducts(context){ // passes context automatically referring context.commit or context.state
      // api call
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          context.commit('setProducts', products);
          resolve()
        })
      })
    },

    addProductToCart(context, product){
      if(product.inventory > 0){
        const cartItem = context.state.cart.find(item => item.id === product.id)

        if(!cartItem){
          context.commit('pushProductToCart', product.id)
        } else {
          context.commit('incrementItemQuantity', cartItem)
        }
        context.commit('decrementProductInventory', product)
      }
    },

    checkout(context){
      shop.buyProducts(
        context.state.cart,
        () => {
          context.commit('emptyCart')
          context.commit('setCheckoutStatus', 'success')
        },
        () => {
          context.commit('setCheckoutStatus', 'fail')
        }
      )
    }
  },

  mutations: {
    setProducts(state, products){ /* payload */
      state.products = products
    },

    pushProductToCart(state, productId){
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },

    incrementItemQuantity(state, cartItem){
      cartItem.quantity++
    },

    decrementProductInventory(state, product){
      product.inventory--
    },

    setCheckoutStatus(state, status){
      state.checkoutStatus = status
    },

    emptyCart(state){
      state.cart = []
    }
  }
})
