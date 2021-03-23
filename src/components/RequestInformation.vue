<template>
  <v-card elevation="20" rounded>
    <v-card-title class="grey darken-3">
      <span class="title font-weight-light">Request Informations</span>
    </v-card-title>
    <v-list-item
      v-for="(prop, index) in getData"
      :key="index"
    >
      <v-list-item-content>
        <v-row>
          <v-col>
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
  method: {
    getData () {
      for (const key in this.$props) {
        if (Object.hasOwnProperty.call(this.$props, key)) {
          this.data = [...this.data, { name: key, value: this.$props[key] }]
        }
      }
      console.log(this.data)

      return this.data
    }
  }
}
</script>
