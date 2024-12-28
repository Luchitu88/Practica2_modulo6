<template>
  <div>
    <h1>Detalle de Vehículos</h1>
    <!-- Formulario para agregar un nuevo vehículo -->
    <form @submit.prevent="vehiculoEnEdicion ? guardarEdicion() : agregarVehiculo()">
      <select v-model="nuevoVehiculo.clienteId">
          <option value="" hidden>Seleccione un Cliente</option>
          <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">
            {{ cliente.nombre }} 
          </option>
        </select>
        <input v-model="nuevoVehiculo.placa"  placeholder="Placa" style="text-transform: uppercase"/>
      <input v-model="nuevoVehiculo.marca"  placeholder="Marca" />
      <input v-model="nuevoVehiculo.modelo" placeholder="Modelo" />
      <input v-model="nuevoVehiculo.anho" placeholder="Año" type="number" />
      <select id="color" v-model="nuevoVehiculo.color" placeholder="Color">
          <option value="" hidden>Color</option>
          <option :value="color" v-for="(color, index) in colorlist" :key="`color-${index}`">{{ color }}</option>
     </select>
      <button class="btn btn-primary" type="submit">{{ vehiculoEnEdicion ? 'Guardar Cambios' : 'Agregar'  }}</button>

      <button v-if="vehiculoEnEdicion" class="btn btn-info" type="button" @click="cancelarEdicion">Cancelar</button>
    </form>
    <br><br/>
    <input v-model="filtroMarca" placeholder="Busqueda por Marca" />

    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Placa</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Color</th>
          <th style="text-align: justify;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
          <td>{{ obtenerCliente(vehiculo.clienteId) }}</td> 
          <td>{{ vehiculo.placa }}</td>
          <td>{{ vehiculo.marca }}</td>
          <td>{{ vehiculo.modelo }}</td>
          <td>{{ vehiculo.anho }}</td>
          <td>{{ vehiculo.color }}</td>
          <td>
            <button @click="cargarEdicion(vehiculo)" class="btn btn-dark" style="margin-right: 5px; ">Editar</button>
            <button @click="eliminarVehiculo(vehiculo.id)" class="btn btn-danger" style="margin-right: 5px; ">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiClient from '../api';

export default {
  data() {
    return {
      vehiculos: [],
      clientes: [],
      colorlist: ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco', 'Plata'],
      nuevoVehiculo: {
        marca: '',
        modelo: '',
        anho: '',
        color: '',
        placa: '',
        clienteId: '',
      },
      filtroMarca: '',
      vehiculoEnEdicion: null, // Nuevo estado para manejar edición
    };
  },
  computed: {
    vehiculosFiltrados() {
      return this.vehiculos.filter(v =>
        v.marca.toLowerCase().includes(this.filtroMarca.toLowerCase())
      );
    }
  },
  methods: {
    async obtenerVehiculos() {
      const response = await apiClient.get('/vehiculos');
      this.vehiculos = response.data;
    },
    async obtenerClientes() {
        const response = await apiClient.get('/clientes');
        this.clientes = response.data;
      },
    obtenerCliente(id) {
        const cliente= this.clientes.find(v => v.id === id);
        return cliente ? `${cliente.nombre}` : 'No encontrado';
      },
    
    async agregarVehiculo() {
        const response = await apiClient.post('/vehiculos', this.nuevoVehiculo);
        this.vehiculos.push(response.data);
        this.nuevoVehiculo = { marca: '', modelo: '', anho: '' , color: '', placa: '', clienteId: ''};  
    },
    async eliminarVehiculo(id) {
      await apiClient.delete(`/vehiculos/${id}`);
      this.vehiculos = this.vehiculos.filter(v => v.id !== id);
    },
    cargarEdicion(vehiculo) {
      this.vehiculoEnEdicion = vehiculo;
      this.nuevoVehiculo = { ...vehiculo }; // Cargar datos en el formulario
    },
    async guardarEdicion() {
      await apiClient.put(`/vehiculos/${this.vehiculoEnEdicion.id}`, this.nuevoVehiculo);
      this.vehiculos = this.vehiculos.map(v =>
        v.id === this.vehiculoEnEdicion.id ? { ...this.nuevoVehiculo } : v
      );
      this.cancelarEdicion();
    },
    cancelarEdicion() {
      this.vehiculoEnEdicion = null;
      this.nuevoVehiculo = { marca: '', modelo: '', anho: '', color: '' , placa: '', clienteId: ''};
    }
  },
  mounted() {
    this.obtenerVehiculos();
    this.obtenerClientes();
  }
};
</script>
