<script>
import axios from 'axios'

import AppHeader from "./components/AppHeader.vue";
import AppMenu from "./components/AppMenu.vue";

import { RouterView } from 'vue-router'

export default {
  components: {
    AppHeader,
    AppMenu,
    RouterView
  },
  data() {
    return {
      user: '',

      name: '',
      username: '',
      password: '',
      avatar: '',
      sex: '',
      date: '',

      loginL: '',
      passwordL: ''
    }
  },
  mounted() {
    this.loadUsername()
  },
  methods: {
    loadUsername() {
      this.user = this.$cookies.get('user')
    },
    async register(evt) {
      evt.preventDefault()
      if (this.name && this.username && this.password) {
        let response = await axios.post('/register', {
          name: this.name,
          username: this.username,
          password: this.password,
          avatar: this.avatar,
          sex: this.sex,
          date: this.date,
        })
        if (response.data !== 'error') {
          this.$cookies.set('user', response.data)
          this.loadUsername()
        }
      }
    },
    async login(evt) {
      evt.preventDefault()
      if (this.loginL && this.passwordL) {
        let response = await axios.post('/login', {
          username: this.loginL,
          password: this.passwordL
        })
        if (response.data !== 'error') {
          this.$cookies.set('user', response.data)
          this.loadUsername()
        }
      }
    }
  }
}
</script>

<template>
  <app-header></app-header>

  <main class="d-flex px-1" v-if="user">
    <app-menu></app-menu>
    <router-view></router-view>
  </main>
  <main v-else class="d-flex">
    <div class="col">
      <h2 class="text-center mt-3">Авторизоваться</h2>
      <form class="mx-auto w-75 d-flex gap-3 flex-column">
        <div class="form-group">
          <label for="exampleInputEmail1">Имя</label>
          <input type="text"
                 class="form-control"
                 id="exampleInputEmail1"
                 aria-describedby="emailHelp"
                 placeholder="Введите имя"
                 v-model="name"
                 required>
          <small id="emailHelp" class="form-text text-muted">обязательное поле</small>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Логин</label>
          <input type="text"
                 class="form-control"
                 id="exampleInputEmail1"
                 aria-describedby="emailHelp"
                 placeholder="Введите логин"
                 v-model="username"
                 required>
          <small id="emailHelp" class="form-text text-muted">уникальное, обязательное поле</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Пароль</label>
          <input type="password"
                 class="form-control"
                 id="exampleInputPassword1"
                 placeholder="Пароль"
                 v-model="password"
                 required>
          <small id="passwordHelp" class="form-text text-muted">обязательное поле</small>
        </div>
        <div class="form-group">
          <select class="form-select" v-model="sex">
            <option value="Мужской">Мужской</option>
            <option value="Женский">Женский</option>
            <option value="Не указан" selected>Не указан</option>
          </select>
          <small id="passwordHelp" class="form-text text-muted">обязательное поле</small>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Аватар</label>
          <input type="text"
                 class="form-control"
                 id="exampleInputEmail1"
                 aria-describedby="emailHelp"
                 placeholder="Введите ссылку"
                 v-model="avatar">
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Дата рождения</label>
          <input type="date"
                 class="form-control"
                 id="exampleInputEmail1"
                 aria-describedby="emailHelp"
                 placeholder="Введите ссылку"
                 v-model="date">
        </div>
        <button
            @click="register($event)"
            type="submit"
            class="btn btn-primary">Зарегистрироваться</button>
      </form>
    </div>
    <div class="col">
      <h2 class="text-center mt-3">Авторизоваться</h2>
      <form class="mx-auto w-75 d-flex gap-3 flex-column">
        <div class="form-group">
          <label for="exampleInputEmail1">Логин</label>
          <input type="text"
                 class="form-control"
                 id="exampleInputEmail1"
                 aria-describedby="emailHelp"
                 placeholder="Введите логин"
                 v-model="loginL"
                 required>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Пароль</label>
          <input type="password"
                 class="form-control"
                 id="exampleInputPassword1"
                 placeholder="Пароль"
                 v-model="passwordL"
                 required>
        </div>
        <button
            @click="login($event)"
            type="submit"
            class="btn btn-primary">Войти</button>
      </form>
    </div>
  </main>


</template>

<style scoped>

</style>
