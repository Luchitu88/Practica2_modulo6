<template>
    <div>
      <h1>Servicios Solicitados</h1>
      <form @submit.prevent="agregarServicio">
        <select id="cliente" v-model="nuevoServicio.clienteId" @change="setVehiculos()">
          <option value=""  hidden >Seleccione un Cliente</option>
          <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
        <select v-model="nuevoServicio.vehiculoId">
          <option value="" hidden >Seleccione un Vehículo</option>
          <option v-for="vehiculo in vehiculosList" :value="vehiculo.id" :key="`cliente-${id}`">
            {{ vehiculo.placa }} >>  {{ vehiculo.marca }} - {{ vehiculo.modelo }}
          </option>
        </select>
        <input v-model="nuevoServicio.descripcion" placeholder="Descripción" />
        <input v-model="nuevoServicio.precio" placeholder="Precio" type="number" />
        <button class="btn btn-primary" type="submit">Agregar</button>
      </form>
      <br></br>
      <input v-model.number="filtroPrecio" placeholder="Filtrar por precio mayor a" type="number" />
  
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Detalle de Vehículo</th>
            <th>Descripción Servicio</th>
            <th>Precio Bs.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicio in serviciosFiltrados" :key="servicio.id">
            <td>{{ obtenerCliente(servicio.clienteId) }}</td>
            <td>{{ obtenerVehiculo(servicio.vehiculoId) }}</td>
            <td>{{ servicio.descripcion }}</td>
            <td>{{ servicio.precio }}</td>
            <td>
              <button @click="eliminarServicio(servicio.id)" class="btn btn-danger">Eliminar</button>
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
        clientes: [],
        vehiculosList:[],
        nuevoServicio: {
          vehiculoId: '',
          clienteId: '',
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
        return vehiculo ? `${vehiculo.placa} >> ${vehiculo.marca} - ${vehiculo.modelo}` : 'No encontrado';
      },
      async obtenerClientes() {
        const response = await apiClient.get('/clientes');
        this.clientes = response.data;
      },
      obtenerCliente(id) {
        const cliente = this.clientes.find(v => v.id === id);
        return cliente ? `${cliente.nombre}` : 'No encontrado';
      },
      async agregarServicio() {
      const response = await apiClient.post('/servicios', this.nuevoServicio);
      this.servicios.push(response.data);
      this.nuevoServicio = { vehiculoId: '', descripcion: '', precio: '' , clienteId:''};
    },
    async eliminarServicio(id) {
      await apiClient.delete(`/servicios/${id}`);
      this.servicios = this.servicios.filter(s => s.id !== id);
    },
    async setVehiculos() {
        const response = await apiClient.get(`/vehiculos?clienteId=` + this.nuevoServicio.clienteId);
        this.vehiculosList = response.data;
      },
  },
  mounted() {
    this.obtenerServicios();
    this.obtenerVehiculos();
    this.obtenerClientes();
  }
};
</script>