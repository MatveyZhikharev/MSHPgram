<script>
import axios from "axios";

export default {
  data() {
    return {
      username: this.$cookies.get('user'),
      user: null
    }
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    goProfile() {
      this.$router.push({
        name: 'profile',
      })
    },
    async loadUser() {
      let response = await axios.post('http://localhost:3005/user/byUsername', {
        username: this.username
      })
      this.user = response.data
    }
  }
}
</script>

<template>
  <header class="d-flex flex-wrap justify-content-between py-3 px-5 border-bottom">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <span class="fs-4">MSHPgram<img src="/src/assets/logo.svg" alt=""></span>
    </a>
    <img
        @click="goProfile"
        v-if="user"
        :src="user.avatar">
  </header>
</template>

<style scoped>
img {
  width: 50px;
  height: 50px;
}
</style>