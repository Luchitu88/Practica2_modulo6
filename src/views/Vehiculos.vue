<template>
  <div>
    <h1>Vehículos</h1>

    <!-- Formulario para agregar un nuevo vehículo -->
    <form @submit.prevent="vehiculoEnEdicion ? guardarEdicion() : agregarVehiculo()">
      <input v-model="nuevoVehiculo.marca" placeholder="Marca" />
      <input v-model="nuevoVehiculo.modelo" placeholder="Modelo" />
      <input v-model="nuevoVehiculo.anho" placeholder="Año" type="number" />
      <button type="submit">{{ vehiculoEnEdicion ? 'Guardar Cambios' : 'Agregar' }}</button>
      <button v-if="vehiculoEnEdicion" type="button" @click="cancelarEdicion">Cancelar</button>
    </form>

    <input v-model="filtroMarca" placeholder="Buscar por marca" />

    <table>
      <thead>
        <tr>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
          <td>{{ vehiculo.marca }}</td>
          <td>{{ vehiculo.modelo }}</td>
          <td>{{ vehiculo.anho }}</td>
          <td>
            <button @click="eliminarVehiculo(vehiculo.id)">Eliminar</button>
          </td>
          <td>
            <button @click="cargarEdicion(vehiculo)">Editar</button>
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
      nuevoVehiculo: {
        marca: '',
        modelo: '',
        anho: ''
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
    async agregarVehiculo() {
      const response = await apiClient.post('/vehiculos', this.nuevoVehiculo);
      this.vehiculos.push(response.data);
      this.nuevoVehiculo = { marca: '', modelo: '', anho: '' };
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
      this.nuevoVehiculo = { marca: '', modelo: '', anho: '' };
    }
  },
  mounted() {
    this.obtenerVehiculos();
  }
};
</script>
