<template>
  <v-card rounded>
    <v-card-title class="grey darken-3">
      <span class="title font-weight-light">Request Informations</span>
    </v-card-title>
    <v-list-item
      v-for="(prop, index) in data"
      :key="index"
    >
      <v-list-item-content>
        <v-row>
          <v-col cols="4">
            <p class="font-weight-bold">
              {{prop.name}}
            </p>
          </v-col>
          <v-col cols="5">
            <p>{{ prop.value }}</p>
          </v-col>
        </v-row>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    to: {
      type: String
    },
    from: {
      type: String
    },
    method: {
      type: String
    },
    status: {
      type: Number
    }
  },
  data: () => ({
    data: []
  }),
  mounted () {
    for (const key in this.$props) {
      if (Object.hasOwnProperty.call(this.$props, key)) {
        if (key === 'timing') {
          continue
        }
        this.data = [...this.data, { name: key, value: this.$props[key] }]
      }
    }
  }
}
</script>
