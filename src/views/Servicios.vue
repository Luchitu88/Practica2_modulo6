<template>
    <div>
      <h1>Servicios</h1>
      <form @submit.prevent="agregarServicio">
        <select v-model="nuevoServicio.vehiculoId">
          <option value="">Seleccione un Vehículo</option>
          <option v-for="vehiculo in vehiculos" :value="vehiculo.id" :key="vehiculo.id">
            {{ vehiculo.marca }} - {{ vehiculo.modelo }}
          </option>
        </select>
        <input v-model="nuevoServicio.descripcion" placeholder="Descripción" />
        <input v-model="nuevoServicio.precio" placeholder="Precio" type="number" />
        <button type="submit">Agregar</button>
      </form>
  
      <input v-model.number="filtroPrecio" placeholder="Filtrar por precio mayor a" type="number" />
  
      <table>
        <thead>
          <tr>
            <th>Vehículo</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in serviciosFiltrados" :key="servicio.id">
            <td>{{ obtenerVehiculo(servicio.vehiculoId) }}</td>
            <td>{{ servicio.descripcion }}</td>
            <td>{{ servicio.precio }}</td>
            <td>
              <button @click="eliminarServicio(servicio.id)">Eliminar</button>
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
        servicios: [],
        vehiculos: [],
        nuevoServicio: {
          vehiculoId: '',
          descripcion: '',
          precio: ''
        },
        filtroPrecio: " "
      };
    },
    computed: {
      serviciosFiltrados() {
        return this.servicios.filter(s => s.precio > this.filtroPrecio);
      }
    },
    methods: {
      async obtenerServicios() {
        const response = await apiClient.get('/servicios');
        this.servicios = response.data;
      },
      async obtenerVehiculos() {
        const response = await apiClient.get('/vehiculos');
        this.vehiculos = response.data;
      },
      obtenerVehiculo(id) {
        const vehiculo = this.vehiculos.find(v => v.id === id);
        return vehiculo ? `${vehiculo.marca} - ${vehiculo.modelo}` : 'No encontrado';
      },
      async agregarServicio() {
      const response = await apiClient.post('/servicios', this.nuevoServicio);
      this.servicios.push(response.data);
      this.nuevoServicio = { vehiculoId: '', descripcion: '', precio: '' };
    },
    async eliminarServicio(id) {
      await apiClient.delete(`/servicios/${id}`);
      this.servicios = this.servicios.filter(s => s.id !== id);
    }
  },
  mounted() {
    this.obtenerServicios();
    this.obtenerVehiculos();
  }
};
</script>