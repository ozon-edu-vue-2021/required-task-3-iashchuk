<template>
  <div class="person">
    <div class="person__photo">
      <img :src="person.picture" alt="photo" />
    </div>
    <div class="person__info">
      <div class="person__row person__row_name">
        <span class="person__title">{{ person.name }} ({{ person.age }})</span>
      </div>
      <div class="person__row person__row_email">
        <span class="person__title">Почта:</span>
        <span class="person__text">{{ person.email }}</span>
      </div>
      <div class="person__row person__row_date">
        <span class="person__title">Дата регистрации:</span>
        <span class="person__text">{{ formatedDate }}</span>
      </div>
      <div class="person__row person__row_about">
        <span class="person__title">О себе:</span>
        <span class="person__text">{{ person.about }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/helpers";

export default {
  props: {
    person: {
      type: Object,
      default: null,
    },
  },
  computed: {
    formatedDate() {
      return formatDate(this.person.registered);
    },
  },
};
</script>

<style scoped>
.person {
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-gap: 8px;
}

.person__photo img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}

.person__info {
  display: grid;
  grid-gap: 8px;
}

.person__row {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.person__row_name {
  margin-bottom: 15px;
  font-weight: bold;
}

.person__title {
  font-weight: bold;
}
</style>
