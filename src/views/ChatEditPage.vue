<script>
import axios from 'axios'


export default {
  data() {
    return {
      isNew: this.$route.name === 'addChat',
      username: this.$cookies.get('user'),
      userId: '',
      userNew: null,
      userDelete: null,
      canEdit: this.$route.name === 'addChat',
      chatId: this.$route.params.chat,
      chat: {},
    }
  },
  mounted() {
    this.getUserId()
    this.getChat()
  },
  methods: {
    async getChat() {
      let response = await axios.get('/chat', {
        params: {
          chatId: this.chatId,
        }
      })
      if (response.data === 'new') {
        this.isNew = true
      } else {
        this.chat = response.data
        this.canEdit = this.chat.users.includes(this.userId) || this.isNew
        for (let i = 0; i < this.chat.users.length; i++) {
          this.chat.users[i] = (await axios.post('/user', {
            id: this.chat.users[i]
          })).data
        }
      }
    },
    async getUserId() {
      let response = await axios.post('/user/id', {
        username: this.username
      })
      this.userId = response.data
    },
    async saveChat(evt) {
      evt.preventDefault()
      if (this.isNew) {
        let response = await axios.post('/chat/new', {
          title: this.chat.title,
          user: this.username,
          userNew: this.userNew,
        })
        this.chat = response.data
      } else {
        let response = await axios.post('/chat/edit', {
          chatId: this.chat._id,
          title: this.chat.title,
          userNew: this.userNew,
          userDelete: this.userDelete,
        })
        this.chat = response.data
        for (let i = 0; i < this.chat.users.length; i++) {
          this.chat.users[i] = (await axios.post('/user', {
            id: this.chat.users[i]
          })).data
        }
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <h1 class="text-center" v-if="isNew">Создание чата</h1>
    <h1 class="text-center" v-else>Редактирование чата</h1>

    <form class="mx-auto w-75 d-flex gap-3 flex-column">
      <div class="form-group">
        <label for="titleInput">Название</label>
        <input type="text"
               class="form-control"
               id="titleInput"
               aria-describedby="emailHelp"
               placeholder="Введите название"
               v-model="chat.title"
               required
               :readonly="!canEdit">
      </div>
      <div class="form-group">
        <label for="titleInput">Пользователи</label>
        <ul class="list-group">
          <li
              v-for="(item, index) in chat.users"
              class="list-group-item">{{ item.username }}
          </li>
        </ul>
        <br>
        <input type="text"
               class="form-control"
               id="user"
               placeholder="Введите логин пользователя (не вас)"
               v-model="userNew"
               required
               :readonly="!canEdit">
        <small id="userHelp" class="form-text text-muted">ввод добавит второго пользователя</small>
        <input type="text"
               class="form-control"
               id="userDel"
               placeholder="Введите логин пользователя"
               v-model="userDelete"
               v-if="!isNew"
               required
               :readonly="!canEdit">
        <small
            id="userDelHelp"
            class="form-text text-muted"
            v-if="!isNew">ввод удалит пользователя</small>
        <br>
        <button
            @click="saveChat($event)"
            type="submit"
            class="btn btn-secondary">Сохранить
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>