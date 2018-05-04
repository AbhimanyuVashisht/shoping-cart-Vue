import shop from '@/api/shop'

export default {
  namespaced: true,
  state: {
    // = data
    items: [],
  },

  getters: {
    availableProducts(state, getters){ // similar to mutation state is passed as the first parameter automatically,
      // all existing getters as the second parameter
      return state.items.filter(product => product.inventory > 0)
    },

    productIsInStock(){ // We cannot pass argument to the getter methods instead we can return the function
      //  that will accept the argument
      return (product) => {
        return product.inventory > 0
      }
    }
  },


  mutations: {
    setProducts(state, products){ /* payload */
      state.items = products
    },

    decrementProductInventory(state, product){
      product.inventory--
    },

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
  }


}
