<template>
  <div class="container">
    <Menu>
     <router-link to="/">Inicio</router-link> 
     <router-link to="/about">Acerca de</router-link>
     <router-link to="/clientes"> Clientes</router-link>
     <router-link to="/vehiculos"> Vehiculos</router-link>
     <router-link to="/servicios"> Servicios</router-link>
    </Menu>
    <div>
      <router-view/>
    </div>
  </div>
</template>
<script>

import Menu from './components/Menu.vue'

export default {
  name: 'App',
  data() {
    return {

    }
  },
  components: {
    Menu
  }
}
</script>

<style lang="scss">
.container{
  padding-top: 90px;
}

</style>
