<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      user: this.$cookies.get('user'),
      chats: []
    }
  },
  mounted() {
    this.loadChats(this.user)
    setInterval(() => {
      this.loadChats(this.user);
    }, 2500)
  },
  methods: {
    addChat() {
      this.$router.push({
        name: 'addChat'
      })
    },
    goChat(chat) {
      this.$router.push({
        name: 'chat',
        params: {
          chat: chat
        }
      })
    },
    fromNow(date) {
      return dayjs(date).fromNow(true)
    },
    async loadChats(user) {
      let response = await axios.get('/chats/all', {
        params: {
          username: user
        }
      })
      this.chats = response.data
      for (let i = 0; i < this.chats.length; i++) {
        let chat = this.chats[i]
        if (chat.messages.length > 0) {
          chat.lastMsg = chat.messages[chat.messages.length - 1].text
        } else {
          chat.lastMsg = ''
        }
      }
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white sidebar position-relative">
    <div class="p-3 mx-auto text-decoration-none border-bottom">
      <span class="fs-5 fw-semibold">Чаты</span>
    </div>
    <div class="list-group list-group-flush border-bottom scrollarea">
      <div
          @click="goChat(item._id)"
          class="list-group-item list-group-item-action py-3 lh-tight"
          :class="{
            'active_chat': $route.params.chat === item._id
          }"
          aria-current="true"
          v-for="(item, index) in this.chats">
        <div class="d-flex w-100 align-items-center justify-content-between">
          <h5 class="mb-1">{{ item.title }}</h5>
          <small>{{fromNow(item.updatedAt)}}</small>
        </div>
        <div class="col-10 mb-1 small">
          {{item.lastMsg}}</div>
      </div>
    </div>
    <button
        @click="addChat"
        type="button"
        class="add-chat position-absolute">
      <span class="plus position-absolute">+</span>
    </button>
  </div>
</template>

<style scoped>
.scrollarea {
  overflow-y: scroll;
}

.sidebar {
  width: 25vw;
  height: 93vh;
}

.active_chat {
  background: linear-gradient(to bottom right, rgba(210, 210, 13, 0.98), lightgreen, mediumpurple) fixed;
}

.add-chat {
  bottom: 40px;
  right: 25px;
  width: 50px;
  height: 50px;

  font-size: 40px;

  border-radius: 25px;
  background: linear-gradient(to bottom right, rgba(210, 210, 13, 0.98), lightgreen, mediumpurple) fixed;
  border-width: 0;
}

.plus {
  margin-bottom: 15px;
  top: -9px;
  left: 11.5px;
  color: #FFF
}
</style>