import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { db } from "../../firebase";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    productos: [],
    carrito: [],
    ventas: [],
    historico_ventas: [],
    numero_transaccion:0
    
  },
  getters: {
    cantidadCarrito(state) {
      return state.carrito.length;
    },
    productosFiltrados(state) {
      // Obtener solamente los productos con stock mayor a cero.
      const productos = state.productos.filter((pizza) => pizza.stock > 0);
      return !productos ? [] : productos;
    },
    totalCarrito(state) {
      const carrito = state.carrito;
      if (carrito.length === 0) return 0;
      const suma = carrito.reduce((acc, x) => acc + x.subtotal, 0);
      return suma;
    },
   
  },
  mutations: {
    cargarData(state, payload) {
      state.productos = payload;
    },
    agregarPizza(state, payload) {
      const agregar = payload.id;
      const cantidad = 1;
      const nombre = payload.nombre;
      const precio = payload.precio;
      const subtotal = precio * cantidad;

      const finder = state.carrito.find((obj) => obj.id === agregar);

      if (!finder) {
        const obj = {
          id: agregar,
          cantidad,
          nombre,
          precio,
          subtotal,
        };
        state.carrito.push(obj);
      } else {
        finder.cantidad = cantidad + finder.cantidad;
        finder.subtotal = finder.cantidad * precio;
      }
    },
    comprar(state) {
      const respuesta = confirm("¿Quieres comprar ahora?");
      // La venta debe ser un objeto que tenga las siguientes propiedades:
      // ID, Nombre, Precio Subtotal, Cantidad Vendida.
      if (respuesta) {
        state.numero_transaccion++;
         const venta = state.carrito.map((obj) => {
          // Cantidad, ID, Precio, Nombre, Subtotal
          /*
          let cantidad_vendida = 0;
            if(obj.id==='P001'){
              console.log("DEBUG NAPOLITANAS:: "+state.historico_napolitanas + obj.cantidad);
              cantidad_vendida = state.historico_napolitanas = state.historico_napolitanas + obj.cantidad;
            }else if(obj.id==='P002'){
              console.log("DEBUG ESPAÑOLAS:: "+state.historico_espanola + obj.cantidad);
              cantidad_vendida = state.historico_espanola = state.historico_espanola + obj.cantidad;
            }
            */
          const obj2 = {
            id: obj.id,
            nombre: obj.nombre,
            precioSubtotal: obj.subtotal,
            cantidadVendida: obj.cantidad,
            numero_transaccion: state.numero_transaccion
          };

          return obj2;
        });
        //Arreglando vista compras
        for (let i = 0; i < venta.length; i++){
          let pivote = venta[i];
          state.historico_ventas.push(pivote);
        }
        state.ventas = state.historico_ventas;
        
        // Descontar el stock en el arreglo productos según
        // la cantidad en el carrito.
        state.productos.forEach((producto) => {
          const id = producto.id;

          state.carrito.forEach((el) => {
            if (el.id === id) {
              producto.stock = producto.stock - el.cantidad;
            }
          });
        });
      }
      /*Limpiar el carrito cuando se produzca una compra*/
      state.carrito = [];
    },
    //se usa el metodo add para guardar la data en la coleccion de firestore
    guardarPizzasEnDB(state) {
      setTimeout(() => {
        try {
          const productos = state.productos;
          console.log(productos);
          productos.forEach(async (producto) => {
            await db.collection("pizzas").add(producto);
          });
        } catch (error) {
          console.log(error);
        }
      }, 2000);
    },
    agregarNuevaPizza(state, payload) {
      // Qué pasaría si el ID existe?
      // Validar que el ID no exista:
      const existe = state.productos.find((pizza) => pizza.id === payload.id);
      // Si no existe ingresar a la base de datos.
      if (!existe) state.productos.push(payload);
    },
  },
  actions: {
    async getData({ commit }) {
      const url =
        "https://us-central1-apis-varias-mias.cloudfunctions.net/pizzeria";
      try {
        const req = await axios(url);
        const pizzas = req.data;
        const pizzasStock = pizzas.map((obj) => {
          obj.stock = 10;
          return obj;
        });
        commit("cargarData", pizzasStock);
      } catch (error) {
        console.log(error);
      }
    },
    //accion que permite mandar la data inicial a firebase, la data esta en productos como arreglo de objetos en la primera accion
    async setDataPizzasDB({ commit }) {
      commit("guardarPizzasEnDB");
      },
      //crear nueva pizza
      async crearNuevaPizza({ commit }, payload) {
        const pizza = payload;
        if (!pizza) return;
        commit("agregarNuevaPizza", pizza);
        await db.collection("pizzas").add(pizza);
      },
  },
});