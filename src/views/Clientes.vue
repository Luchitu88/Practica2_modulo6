<template>
    <div>
      <h1>Detalle de Clientes</h1>
      <!-- Formulario para agregar un nuevo vehículo -->
      <form @submit.prevent="ClienteEnEdicion ? guardarEdicion() : agregarCliente()">
        <input v-model="nuevoCliente.nombre"  placeholder="Nombre y Apellido" />
        <input v-model="nuevoCliente.direccion" placeholder="Direccion" />
        <input v-model="nuevoCliente.telefono" placeholder="Telefono" type="number" />
        <input v-model="nuevoCliente.email" placeholder="Correo Electronico"  />

        <button class="btn btn-primary" type="submit">{{ ClienteEnEdicion ? 'Guardar Cambios' : 'Agregar'  }}</button>
        <button v-if="ClienteEnEdicion" class="btn btn-info" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
      <br><br/>
      <input v-model="filtroNombre" placeholder="Busqueda por Nombre" />
  
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th>Correo Electronico</th>
            <th style="text-align: justify;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.direccion }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>{{ cliente.email }}</td>
            <td>
              <button @click="cargarEdicion(cliente)" class="btn btn-dark" style="margin-right: 5px; ">Editar</button>
              <button @click="eliminarCliente(cliente.id)" class="btn btn-danger" style="margin-right: 5px; ">Eliminar</button>
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
        clientes: [],    
        nuevoCliente: {
          nombre: '',
          direccion: '',
          telefono: '',
          email: ''
        },
        filtroNombre: '',
        ClienteEnEdicion: null, // Nuevo estado para manejar edición
      };
    },
    computed: {
      clientesFiltrados() {
        return this.clientes.filter(v =>
          v.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }
    },
    methods: {
      async obtenerClientes() {
        const response = await apiClient.get('/clientes');
        this.clientes = response.data;
      },
      async agregarCliente() {
          const response = await apiClient.post('/clientes', this.nuevoCliente);
          this.clientes.push(response.data);
          this.nuevoCliente = { nombre: '', direccion: '', telefono: '', email: ''};  
      },
      async eliminarCliente(id) {
        await apiClient.delete(`/clientes/${id}`);
        this.clientes = this.clientes.filter(v => v.id !== id);
      },
      cargarEdicion(cliente) {
        this.ClienteEnEdicion = cliente;
        this.nuevoCliente = { ...cliente }; // Cargar datos en el formulario
      },
      async guardarEdicion() {
        await apiClient.put(`/clientes/${this.ClienteEnEdicion.id}`, this.nuevoCliente);
        this.clientes = this.clientes.map(v =>
          v.id === this.ClienteEnEdicion.id ? { ...this.nuevoCliente } : v
        );
        this.cancelarEdicion();
      },
      cancelarEdicion() {
        this.ClienteEnEdicion = null;
        this.nuevoCliente = { nombre: '', direccion: '', telefono: '', email: ''};
      }
    },
    mounted() {
      this.obtenerClientes();
    }
  };
  </script>
  