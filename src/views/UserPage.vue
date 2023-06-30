<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  data() {
    return {
      username: this.$cookies.get('user'),
      user: null,
      birthday: '',
    }
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    async loadUser() {
      let response = await axios.post('http://localhost:3005/user/byUsername', {
        username: this.username
      })
      this.user = response.data
      this.birthday = this.getNormDate(this.user.birthday)
    },
    getNormDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    async register(evt) {
      evt.preventDefault()

      let response = await axios.post('/user/edit', {
        name: this.user.name,
        username: this.username,
        password: this.user.password,
        avatar: this.user.avatar,
        sex: this.user.sex,
        date: this.birthday,
      })
      if (response.data === this.username){
        this.$router.push({
          name: 'main'
        })
      }
    }
  }
}
</script>

<template>
  <form
      v-if="user"
      class="container d-flex align-items-center flex-column gap-4">
    <div class="form-group">
      <img :src="user.avatar" alt=""></div>
    <div class="form-group w-50">
      <label for="userInput">Имя</label>
      <input type="text"
             class="form-control"
             id="userInput"
             placeholder="Введите имя"
             v-model="user.name"
             required>
    </div>
    <div class="form-group w-50">
      <label for="exampleInputPassword1">Пароль</label>
      <input type="password"
             class="form-control"
             id="exampleInputPassword1"
             placeholder="Пароль"
             v-model="user.password"
             required>
    </div>
    <div class="form-group w-50">
      <label for="avatar">Аватар</label>
      <input type="text"
             class="form-control"
             id="avatar"
             aria-describedby="emailHelp"
             placeholder="Введите ссылку"
             v-model="user.avatar">
    </div>
    <div class="form-group w-50">
      <p class="mb-0">Пол</p>
      <select class="form-select" v-model="user.sex">
        <option value="Мужской">Мужской</option>
        <option value="Женский">Женский</option>
        <option value="Не указан">Не указан</option>
      </select>
    </div>
    <div class="form-group w-50">
      <label for="exampleInputEmail1">Дата рождения</label>
      <input type="date"
             class="form-control"
             id="exampleInputEmail1"
             aria-describedby="emailHelp"
             placeholder="Введите ссылку"
             v-model="birthday">
    </div>
    <button
        @click="register($event)"
        type="submit"
        class="btn btn-secondary w-50">Зарегистрироваться</button>
  </form>
</template>

<style scoped>
img {
  width: 300px;
  height: 300px;
}
</style>